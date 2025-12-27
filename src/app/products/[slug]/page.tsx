'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductImageGallery } from '@/components/products/product-image-gallery';
import { ProductInfo } from '@/components/products/product-info';
import { ProductTabs } from '@/components/products/product-tabs';
import { RelatedProducts } from '@/components/products/related-products';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/toaster';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  sku: string;
  stock: number;
  images: string[];
  isFeatured: boolean;
  category: {
    name: string;
    slug: string;
  };
}

interface ProductDetailsResponse {
  product: Product;
  relatedProducts: Product[];
}

function ProductPageContent() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<ProductDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        if (response.ok) {
          const productData = await response.json();
          setData(productData);
        } else if (response.status === 404) {
          setError('Product not found');
        } else {
          setError('Failed to load product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('An error occurred while loading the product');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="mb-6">
              <Skeleton className="h-8 w-32 mb-4" />
            </div>
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <Skeleton className="aspect-square rounded-lg" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Product not found'}
            </h1>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { product, relatedProducts } = data;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary">Products</Link>
            <span>/</span>
            <Link 
              href={`/products?category=${product.category.slug}`} 
              className="hover:text-primary"
            >
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <ProductImageGallery images={product.images} />
          <ProductInfo product={product} />
        </div>

        {/* Product Tabs */}
        <ProductTabs product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="mb-6">
              <Skeleton className="h-8 w-32 mb-4" />
            </div>
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <Skeleton className="aspect-square rounded-lg" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <ProductPageContent />
    </Suspense>
  );
}