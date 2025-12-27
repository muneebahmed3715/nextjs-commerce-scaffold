import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    
    let products;
    
    if (featured === 'true') {
      products = await db.product.findMany({
        where: {
          isActive: true,
          isFeatured: true,
        },
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit ? parseInt(limit) : undefined,
      });
    } else if (category) {
      products = await db.product.findMany({
        where: {
          isActive: true,
          category: {
            slug: category,
          },
        },
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      products = await db.product.findMany({
        where: {
          isActive: true,
        },
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit ? parseInt(limit) : undefined,
      });
    }

    const formattedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}