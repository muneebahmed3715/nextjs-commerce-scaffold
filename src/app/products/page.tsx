'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductSort } from '@/components/products/product-sort';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/toaster';
import { parseCategorySlug } from '@/lib/product-categories';

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
  createdAt: string;
  category: {
    name: string;
    slug: string;
  };
}

interface ProductFiltersState {
  category: string;
  priceRange: [number, number];
  inStock: boolean;
}

interface CategoryCountItem {
  slug: string;
  productCount: number;
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const category = parseCategorySlug(searchParams.get('category'));
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState<ProductFiltersState>({
    category: category || '',
    priceRange: [0, 1000],
    inStock: true,
  });

  useEffect(() => {
    setFilters((previous) => ({
      ...previous,
      category: category || '',
    }));
  }, [category]);

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          return;
        }

        const data: CategoryCountItem[] = await response.json();
        const counts = data.reduce<Record<string, number>>((accumulator, item) => {
          accumulator[item.slug] = item.productCount;
          return accumulator;
        }, {});

        setCategoryCounts(counts);
      } catch (error) {
        console.error('Error fetching category counts:', error);
      }
    };

    fetchCategoryCounts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.category) {
          params.append('category', filters.category);
        }
        
        const response = await fetch(`/api/products?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          
          // Apply client-side sorting and filtering
          let filteredProducts = data;
          
          // Apply price filter
          filteredProducts = filteredProducts.filter((product: Product) => 
            product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
          );
          
          // Apply stock filter
          if (filters.inStock) {
            filteredProducts = filteredProducts.filter((product: Product) => product.stock > 0);
          }
          
          // Apply sorting
          if (sortBy === 'featured') {
            filteredProducts.sort((a: Product, b: Product) => {
              if (a.isFeatured === b.isFeatured) return 0;
              return a.isFeatured ? -1 : 1;
            });
          } else if (sortBy === 'price-low') {
            filteredProducts.sort((a: Product, b: Product) => a.price - b.price);
          } else if (sortBy === 'price-high') {
            filteredProducts.sort((a: Product, b: Product) => b.price - a.price);
          } else if (sortBy === 'name') {
            filteredProducts.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
          } else if (sortBy === 'newest') {
            filteredProducts.sort(
              (a: Product, b: Product) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
          
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')} Products` : 'All Products'}
          </h1>
          <p className="text-gray-600">
            Discover our wide selection of quality products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 shrink-0">
            <ProductFilters 
              filters={filters} 
              categoryCounts={categoryCounts}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {loading ? 'Loading...' : `${products.length} products found`}
              </p>
              <ProductSort value={sortBy} onValueChange={setSortBy} />
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or browse all products
                </p>
                <Button onClick={() => setFilters({ category: '', priceRange: [0, 1000] as [number, number], inStock: true })}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-96 mb-8" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}