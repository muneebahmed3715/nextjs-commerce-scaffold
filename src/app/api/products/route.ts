import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseImageList } from '@/lib/images';
import { parseCategorySlug } from '@/lib/product-categories';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const categoryParam = searchParams.get('category');
    const limit = searchParams.get('limit');
    const parsedCategory = parseCategorySlug(categoryParam);

    if (categoryParam && !parsedCategory) {
      return NextResponse.json(
        { error: 'Invalid category value' },
        { status: 400 }
      );
    }

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(featured === 'true' ? { isFeatured: true } : {}),
      ...(parsedCategory
        ? {
            category: {
              slug: parsedCategory,
            },
          }
        : {}),
    };
    
    const products = await db.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    });

    const formattedProducts = products.map(product => ({
      ...product,
      images: parseImageList(product.images),
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      originalPrice,
      sku,
      stock,
      images,
      isFeatured,
      categoryId,
      category,
    } = body;

    const resolvedCategorySlug = parseCategorySlug(
      typeof category === 'string' ? category : null
    );

    if (!name || !slug || !sku || typeof price !== 'number') {
      return NextResponse.json(
        { error: 'name, slug, sku, and price are required' },
        { status: 400 }
      );
    }

    let resolvedCategoryId = typeof categoryId === 'string' ? categoryId : null;

    if (!resolvedCategoryId && !resolvedCategorySlug) {
      return NextResponse.json(
        { error: 'categoryId or category is required' },
        { status: 400 }
      );
    }

    if (resolvedCategorySlug) {
      const foundCategory = await db.category.findUnique({
        where: { slug: resolvedCategorySlug },
        select: { id: true },
      });

      if (!foundCategory) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 400 }
        );
      }

      resolvedCategoryId = foundCategory.id;
    }

    if (resolvedCategoryId) {
      const foundCategoryById = await db.category.findUnique({
        where: { id: resolvedCategoryId },
        select: { id: true, slug: true },
      });

      if (!foundCategoryById) {
        return NextResponse.json(
          { error: 'Invalid categoryId' },
          { status: 400 }
        );
      }

      if (!parseCategorySlug(foundCategoryById.slug)) {
        return NextResponse.json(
          { error: 'Invalid category slug in categoryId' },
          { status: 400 }
        );
      }
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        description,
        price,
        originalPrice,
        sku,
        stock: typeof stock === 'number' ? stock : 0,
        images: JSON.stringify(Array.isArray(images) ? images : []),
        isFeatured: Boolean(isFeatured),
        categoryId: resolvedCategoryId!,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      {
        ...product,
        images: parseImageList(product.images),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}