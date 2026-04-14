import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

const VALID_ORDER_STATUSES = [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
] as const;

function isValidOrderStatus(value: string): value is (typeof VALID_ORDER_STATUSES)[number] {
  return VALID_ORDER_STATUSES.includes(value as (typeof VALID_ORDER_STATUSES)[number]);
}

export async function PATCH(request: NextRequest) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const { orderId, status } = await request.json();

    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const normalizedStatus = String(status || '').toUpperCase();

    if (!isValidOrderStatus(normalizedStatus)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
    }

    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        status: normalizedStatus,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Admin update order error:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
