import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export function EmptyCart() {
  return (
    <div className="text-center py-16">
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet. 
            Start shopping to fill it up!
          </p>
          
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/products">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/deals">
                View Special Deals
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 pt-8 border-t">
            <h3 className="font-medium text-gray-900 mb-4">Why shop with us?</h3>
            <div className="grid grid-cols-1 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">1</span>
                </div>
                <span className="text-left">Quality products from verified suppliers</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">2</span>
                </div>
                <span className="text-left">Competitive prices and great deals</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">3</span>
                </div>
                <span className="text-left">Fast and reliable shipping</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}