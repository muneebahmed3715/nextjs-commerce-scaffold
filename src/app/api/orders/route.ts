import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getBearerToken, verifyAuthToken } from '@/lib/auth';
import { notifySupplierNewOrder } from '@/lib/supplier-notifications';

export async function POST(request: NextRequest) {
  try {
    const {
      items,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      total,
      guestInfo,
    } = await request.json();

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    // Resolve user: authenticated user or guest checkout user
    const token = getBearerToken(request);
    let userId: string;

    if (token) {
      try {
        const decoded = verifyAuthToken(token);
        userId = decoded.userId;
      } catch {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      }
    } else {
      const guestName = String(guestInfo?.name || '').trim();
      const guestEmail = String(guestInfo?.email || '').trim().toLowerCase();
      const guestPhone = String(guestInfo?.phone || '').trim();

      if (!guestName || !guestEmail || !guestPhone) {
        return NextResponse.json(
          { error: 'Guest checkout requires name, email, and phone number' },
          { status: 400 }
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestEmail)) {
        return NextResponse.json(
          { error: 'Please enter a valid email address' },
          { status: 400 }
        );
      }

      const existingUser = await db.user.findUnique({ where: { email: guestEmail } });

      if (existingUser?.password) {
        return NextResponse.json(
          { error: 'This email is already registered. Please sign in to place your order.' },
          { status: 409 }
        );
      }

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const guestUser = await db.user.create({
          data: {
            name: guestName,
            email: guestEmail,
            role: 'CUSTOMER',
          },
        });
        userId = guestUser.id;
      }
    }

    // Generate order number
    const orderNumber = `SHP-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;

    const order = await db.$transaction(async (tx) => {
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.id } });

        if (!product || !product.isActive) {
          throw new Error(`Product ${item.id} is unavailable`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
      }

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: 'PROCESSING',
          subtotal,
          tax,
          shipping,
          total,
          shippingAddress,
        },
      });

      await tx.orderItem.createMany({
        data: items.map((item: { id: string; quantity: number; price: number }) => ({
          orderId: createdOrder.id,
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return createdOrder;
    });

    const customer = await db.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    const customerName = customer?.name || customer?.email || undefined;

    await Promise.all(
      items.map((item: { id: string; quantity: number }) =>
        notifySupplierNewOrder({
          productId: item.id,
          quantity: item.quantity,
          customerName,
        })
      )
    );

    return NextResponse.json({
      message: 'Order placed successfully',
      orderNumber: order.orderNumber,
      orderId: order.id,
    });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to place order' },
      { status: 500 }
    );
  }
}