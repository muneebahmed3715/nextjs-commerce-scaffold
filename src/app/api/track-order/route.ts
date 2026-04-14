import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseImageList } from '@/lib/images';

export async function POST(request: NextRequest) {
  try {
    const { orderNumber, email } = await request.json();

    // Validate required fields
    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: 'Order number and email are required' },
        { status: 400 }
      );
    }

    const order = await db.order.findFirst({
      where: {
        orderNumber,
        user: {
          email,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or email does not match' },
        { status: 404 }
      );
    }

    const statusRank: Record<string, number> = {
      PENDING: 1,
      PROCESSING: 2,
      SHIPPED: 3,
      DELIVERED: 4,
      CANCELLED: 0,
    };

    const currentRank = statusRank[order.status] ?? 1;
    const createdAtFormatted = order.createdAt.toLocaleString();
    const estimatedDate = new Date(order.createdAt.getTime() + 5 * 24 * 60 * 60 * 1000);

    const timeline = [
      {
        status: 'Order Confirmed',
        date: createdAtFormatted,
        description: 'We received your order and started processing.',
        completed: currentRank >= 1,
      },
      {
        status: 'Order Processed',
        date: currentRank >= 2 ? createdAtFormatted : 'Pending',
        description: 'Your order has been prepared and verified.',
        completed: currentRank >= 2,
      },
      {
        status: 'In Transit',
        date: currentRank >= 3 ? createdAtFormatted : 'Pending',
        description: 'Your package is on the way.',
        completed: currentRank >= 3,
      },
      {
        status: 'Delivered',
        date: currentRank >= 4 ? createdAtFormatted : estimatedDate.toLocaleDateString(),
        description: 'Package delivered to your shipping address.',
        completed: currentRank >= 4,
      },
    ];

    const shippingAddress = (order.shippingAddress as {
      name?: string;
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    }) || {};

    return NextResponse.json({
      orderNumber: order.orderNumber,
      status: order.status.toLowerCase(),
      estimatedDelivery: estimatedDate.toISOString().split('T')[0],
      trackingNumber: order.orderNumber,
      carrier: 'Standard Shipping',
      items: order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        image: parseImageList(item.product.images)[0] || '/placeholder-product.svg',
      })),
      shippingAddress: {
        name: shippingAddress.name || 'Customer',
        address: shippingAddress.street || 'Address unavailable',
        city: shippingAddress.city || '',
        state: shippingAddress.state || '',
        zip: shippingAddress.zip || '',
        country: shippingAddress.country || '',
      },
      timeline,
    });

  } catch (error) {
    console.error('Order tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track order' },
      { status: 500 }
    );
  }
}