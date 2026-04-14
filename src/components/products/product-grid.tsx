import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { SafeImage } from '@/components/ui/safe-image';

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

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder-product.svg',
      slug: product.slug,
      sku: product.sku,
    });
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-0">
            <div className="relative">
              <Link href={`/products/${product.slug}`}>
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                  <SafeImage
                    src={product.images[0] || '/placeholder-product.svg'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    fallbackSrc="/placeholder-product.svg"
                  />
                </div>
              </Link>
              
              {product.originalPrice && product.originalPrice > product.price && (
                <Badge className="absolute top-2 left-2 bg-red-500">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              )}
              
              {product.isFeatured && (
                <Badge className="absolute top-2 right-2 bg-blue-500">
                  Featured
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
                onClick={(e) => {
                  e.preventDefault();
                  // Add to wishlist functionality
                }}
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4">
              <Badge variant="secondary" className="text-xs mb-2">
                {product.category.name}
              </Badge>
              
              <Link href={`/products/${product.slug}`}>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary">
                  {product.name}
                </h3>
              </Link>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">(4.5)</span>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                </Badge>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}