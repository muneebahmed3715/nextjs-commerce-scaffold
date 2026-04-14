import { NextRequest, NextResponse } from 'next/server';
import { getBearerToken, verifyAuthToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { notifySupplierItemAddedToCart } from '@/lib/supplier-notifications';

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity, customerName } = await request.json();

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      );
    }

    let resolvedCustomerName =
      typeof customerName === 'string' ? customerName.trim() : '';

    const token = getBearerToken(request);
    if (token) {
      try {
        const decoded = verifyAuthToken(token);
        const user = await db.user.findUnique({
          where: { id: decoded.userId },
          select: { name: true, email: true },
        });
        if (user) {
          resolvedCustomerName = user.name?.trim() || user.email || resolvedCustomerName;
        }
      } catch {
        // Ignore auth parsing errors and continue with anonymous customer.
      }
    }

    await notifySupplierItemAddedToCart({
      productId,
      quantity: typeof quantity === 'number' ? quantity : 1,
      customerName: resolvedCustomerName || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart-add supplier notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send supplier notification' },
      { status: 500 }
    );
  }
}
