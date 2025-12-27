'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RefreshCw,
  Star,
  Minus,
  Plus
} from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { toast } from 'sonner';

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

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '/placeholder-product.jpg',
        slug: product.slug,
        sku: product.sku,
      });
    }

    toast.success(`${quantity} ${product.name} added to cart`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard');
    }
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Category and Badges */}
      <div className="space-y-2">
        <Badge variant="secondary" className="text-sm">
          {product.category.name}
        </Badge>
        {product.isFeatured && (
          <Badge className="bg-blue-500 text-white ml-2">
            Featured
          </Badge>
        )}
        {discountPercentage > 0 && (
          <Badge className="bg-red-500 text-white ml-2">
            {discountPercentage}% OFF
          </Badge>
        )}
      </div>

      {/* Product Name */}
      <h1 className="text-3xl font-bold text-gray-900">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">(4.5)</span>
        </div>
        <Separator orientation="vertical" className="h-5" />
        <span className="text-sm text-gray-600">
          {Math.floor(Math.random() * 100) + 20} reviews
        </span>
        <Separator orientation="vertical" className="h-5" />
        <span className="text-sm text-gray-600">
          {Math.floor(Math.random() * 500) + 100} sold
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-4">
        <span className="text-3xl font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </span>
        {product.originalPrice && (
          <span className="text-xl text-gray-500 line-through">
            ${product.originalPrice.toFixed(2)}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">
        {product.description}
      </p>

      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
        </Badge>
        {product.stock > 0 && product.stock < 10 && (
          <span className="text-sm text-orange-600">
            Only {product.stock} left!
          </span>
        )}
      </div>

      {/* SKU */}
      <p className="text-sm text-gray-500">
        SKU: {product.sku}
      </p>

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Quantity:</span>
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-none"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <div className="w-12 text-center">
              {quantity}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-none"
              onClick={() => setQuantity(quantity + 1)}
              disabled={quantity >= product.stock}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          
          <Button variant="outline" size="lg">
            <Heart className="w-5 h-5 mr-2" />
            Wishlist
          </Button>
          
          <Button variant="outline" size="lg" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
        <div className="flex items-center space-x-3">
          <Truck className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Free Shipping</p>
            <p className="text-xs text-gray-500">On orders over $50</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Secure Payment</p>
            <p className="text-xs text-gray-500">100% secure</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Easy Returns</p>
            <p className="text-xs text-gray-500">30 days return</p>
          </div>
        </div>
      </div>
    </div>
  );
}