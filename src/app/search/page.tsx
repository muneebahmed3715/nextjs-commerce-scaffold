'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductGrid } from '@/components/products/product-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Toaster } from '@/components/ui/toaster';

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

interface SearchResponse {
  products: Product[];
  query: string;
  total: number;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const newUrl = `/search?q=${encodeURIComponent(query.trim())}`;
      window.history.pushState({}, '', newUrl);
      performSearch(query.trim());
    }
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for products..."
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                className="pl-12 pr-4 text-lg h-12"
              />
              <Button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-pulse space-y-4">
              <Skeleton className="h-8 w-64 mx-auto" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && hasSearched && results && (
          <div>
            {/* Results Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Search Results
              </h1>
              <p className="text-gray-600">
                {results.total} {results.total === 1 ? 'product' : 'products'} found for "
                <span className="font-medium">{results.query}</span>"
              </p>
            </div>

            {/* Results Grid */}
            {results.products.length > 0 ? (
              <ProductGrid products={results.products} />
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  No products found
                </h2>
                
                <p className="text-gray-600 mb-8">
                  We couldn't find any products matching "{results.query}". 
                  Try different keywords or browse our categories.
                </p>
                
                <div className="space-y-4">
                  <Button asChild>
                    <Link href="/products">
                      Browse All Products
                    </Link>
                  </Button>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="text-sm text-gray-500">Popular searches:</span>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      Electronics
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      Clothing
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      Home & Garden
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && !hasSearched && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Search for Products
            </h2>
            
            <p className="text-gray-600 mb-8">
              Enter keywords to find the products you're looking for.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Product Names</h3>
                <p className="text-sm text-gray-600">Search by product name or brand</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Categories</h3>
                <p className="text-sm text-gray-600">Browse products by category</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">SKU Numbers</h3>
                <p className="text-sm text-gray-600">Find products by SKU</p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="max-w-2xl mx-auto mb-8">
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
      <SearchPageContent />
    </Suspense>
  );
}