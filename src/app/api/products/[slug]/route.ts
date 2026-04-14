import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseImageList } from '@/lib/images';
import { parseCategorySlug } from '@/lib/product-categories';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await db.product.findFirst({
      where: {
        slug,
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
      images: parseImageList(product.images),
    };

    const formattedRelatedProducts = relatedProducts.map(product => ({
      ...product,
      images: parseImageList(product.images),
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const existing = await db.product.findUnique({ where: { slug } });

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    let nextCategoryId = body.categoryId ?? existing.categoryId;

    if (typeof body.category === 'string') {
      const parsedCategory = parseCategorySlug(body.category);
      if (!parsedCategory) {
        return NextResponse.json(
          { error: 'Invalid category value' },
          { status: 400 }
        );
      }

      const categoryBySlug = await db.category.findUnique({
        where: { slug: parsedCategory },
        select: { id: true },
      });

      if (!categoryBySlug) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 400 }
        );
      }

      nextCategoryId = categoryBySlug.id;
    }

    if (typeof nextCategoryId !== 'string' || !nextCategoryId) {
      return NextResponse.json(
        { error: 'Invalid categoryId' },
        { status: 400 }
      );
    }

    const categoryById = await db.category.findUnique({
      where: { id: nextCategoryId },
      select: { slug: true },
    });

    if (!categoryById || !parseCategorySlug(categoryById.slug)) {
      return NextResponse.json(
        { error: 'Invalid categoryId' },
        { status: 400 }
      );
    }

    const updated = await db.product.update({
      where: { id: existing.id },
      data: {
        name: body.name ?? existing.name,
        slug: body.slug ?? existing.slug,
        description: body.description ?? existing.description,
        price: typeof body.price === 'number' ? body.price : existing.price,
        originalPrice: body.originalPrice ?? existing.originalPrice,
        sku: body.sku ?? existing.sku,
        stock: typeof body.stock === 'number' ? body.stock : existing.stock,
        images: body.images ? JSON.stringify(body.images) : existing.images,
        isFeatured: typeof body.isFeatured === 'boolean' ? body.isFeatured : existing.isFeatured,
        isActive: typeof body.isActive === 'boolean' ? body.isActive : existing.isActive,
        categoryId: nextCategoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      ...updated,
      images: parseImageList(updated.images),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const existing = await db.product.findUnique({ where: { slug } });

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await db.product.delete({ where: { id: existing.id } });

    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}