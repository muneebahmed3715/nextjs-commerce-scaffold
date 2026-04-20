import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getBearerToken, verifyAuthToken } from '@/lib/auth';
import { parseImageList } from '@/lib/images';

type CartInputItem = {
  id: string;
  quantity: number;
};

async function getUserIdFromRequest(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) {
    return null;
  }

  try {
    const decoded = verifyAuthToken(token);
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const cart = await db.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: {
            id: 'asc',
          },
        },
      },
    });

    const items = (cart?.items ?? []).map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      image: parseImageList(item.product.images)[0] ?? '/placeholder-product.svg',
      quantity: item.quantity,
      slug: item.product.slug,
      sku: item.product.sku,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const body = await request.json();
    const rawItems = Array.isArray(body?.items) ? body.items : [];

    const incomingItems: CartInputItem[] = rawItems
      .filter((item) => item && typeof item.id === 'string')
      .map((item) => ({
        id: item.id,
        quantity: Number.isFinite(item.quantity) ? Math.max(1, Math.floor(item.quantity)) : 1,
      }));

    const productIds = incomingItems.map((item) => item.id);
    const products = await db.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    });

    const productById = new Map(products.map((product) => [product.id, product]));
    const validItems = incomingItems.filter((item) => {
     const product = productById.get(item.id) as any;
      return Boolean(product) && item.quantity <= (product?.stock ?? 0);
    });

    const cart = await db.$transaction(async (tx) => {
      const ensured = await tx.cart.upsert({
        where: { userId },
        create: { userId },
        update: {},
      });

      await tx.cartItem.deleteMany({
        where: { cartId: ensured.id },
      });

      if (validItems.length > 0) {
        await tx.cartItem.createMany({
          data: validItems.map((item) => ({
            cartId: ensured.id,
            productId: item.id,
            quantity: item.quantity,
          })),
        });
      }

      return tx.cart.findUnique({
        where: { id: ensured.id },
        include: {
          items: {
            include: {
              product: true,
            },
            orderBy: {
              id: 'asc',
            },
          },
        },
      });
    });

    const items = (cart?.items ?? []).map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      image: parseImageList(item.product.images)[0] ?? '/placeholder-product.svg',
      quantity: item.quantity,
      slug: item.product.slug,
      sku: item.product.sku,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const cart = await db.cart.findUnique({ where: { userId } });
    if (cart) {
      await db.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return NextResponse.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}