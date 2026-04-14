import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getBearerToken, verifyAuthToken } from '@/lib/auth';
import { parseImageList } from '@/lib/images';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }
    
    // Verify token and get user ID
    let decoded;
    try {
      decoded = verifyAuthToken(token);
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Find user orders
    const orders = await db.order.findMany({
      where: {
        userId: decoded.userId
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format orders for response
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        id: item.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        image: parseImageList(item.product.images)[0] || '/placeholder-product.svg'
      })),
      shippingAddress: order.shippingAddress
    }));

    return NextResponse.json(formattedOrders);

  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}