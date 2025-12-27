import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await db.product.findUnique({
      where: {
        slug: params.slug,
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get related products from the same category
    const relatedProducts = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        isActive: true,
        id: {
          not: product.id,
        },
      },
      include: {
        category: true,
      },
      take: 4,
    });

    const formattedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
    };

    const formattedRelatedProducts = relatedProducts.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
    }));

    return NextResponse.json({
      product: formattedProduct,
      relatedProducts: formattedRelatedProducts,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}