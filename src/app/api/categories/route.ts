import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { VALID_CATEGORY_SLUGS } from '@/lib/product-categories';

export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            products: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const allowedSlugs = new Set<string>(VALID_CATEGORY_SLUGS);

    const response = categories
      .filter((category) => allowedSlugs.has(category.slug))
      .map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        productCount: category._count.products,
      }));

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
