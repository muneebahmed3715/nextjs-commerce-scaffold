import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const [usersCount, productsCount, ordersCount, suppliersCount, notificationsCount] =
      await Promise.all([
        db.user.count(),
        db.product.count({ where: { isActive: true } }),
        db.order.count(),
        db.supplier.count({ where: { isActive: true } }),
        (db as any).supplierNotification.count(),
      ]);

    const [recentOrders, recentProducts] = await Promise.all([
      db.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true },
          },
          items: {
            select: { quantity: true },
          },
        },
      }),
      db.product.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
            select: { name: true, slug: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      metrics: {
        usersCount,
        productsCount,
        ordersCount,
        suppliersCount,
        notificationsCount,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
        customerName: order.user.name || order.user.email,
      })),
      recentProducts,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to load admin dashboard' },
      { status: 500 }
    );
  }
}
