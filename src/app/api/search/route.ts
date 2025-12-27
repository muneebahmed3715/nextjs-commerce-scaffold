import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    let products;
    
    if (category) {
      products = await db.product.findMany({
        where: {
          isActive: true,
          category: {
            slug: category,
          },
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              sku: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit ? parseInt(limit) : 20,
      });
    } else {
      products = await db.product.findMany({
        where: {
          isActive: true,
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              sku: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit ? parseInt(limit) : 20,
      });
    }

    const formattedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
    }));

    return NextResponse.json({
      products: formattedProducts,
      query,
      total: formattedProducts.length,
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}