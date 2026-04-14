import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const notifications = await (db as any).supplierNotification.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        supplier: {
          select: { name: true, email: true },
        },
        product: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Supplier notifications admin error:', error);
    return NextResponse.json(
      { error: 'Failed to load supplier notifications' },
      { status: 500 }
    );
  }
}
