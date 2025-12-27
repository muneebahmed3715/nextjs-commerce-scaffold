import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { items, shippingAddress, shippingMethod, paymentMethod, subtotal, tax, shipping, total } = await request.json();

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

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify token and get user ID
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Generate order number
    const orderNumber = `SHP-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber,
        userId: decoded.userId,
        status: 'processing',
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create order items
    for (const item of items) {
      await db.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        },
      });
    }

    // Update product stock
    for (const item of items) {
      await db.product.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

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