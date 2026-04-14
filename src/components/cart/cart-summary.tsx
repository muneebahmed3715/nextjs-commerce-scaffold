import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Truck, Shield, RefreshCw } from 'lucide-react';

interface CartSummaryProps {
  subtotal: number;
  onCheckout: () => void;
  isCheckingOut: boolean;
}

export function CartSummary({ subtotal, onCheckout, isCheckingOut }: CartSummaryProps) {
  // Calculate totals
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Shipping</span>
            {shipping === 0 ? (
              <Badge variant="secondary">FREE</Badge>
            ) : (
              <span>${shipping.toFixed(2)}</span>
            )}
          </div>
          
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          {subtotal < 50 && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Checkout Button */}
      <Button 
        className="w-full" 
        size="lg"
        onClick={onCheckout}
        disabled={isCheckingOut}
      >
        {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
      </Button>

      {/* Features */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center space-x-3">
            <Truck className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-gray-500">On orders over $50</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">Secure Payment</p>
              <p className="text-xs text-gray-500">SSL encrypted</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">Easy Returns</p>
              <p className="text-xs text-gray-500">30-day policy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accepted Payment Methods */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-3">Accepted Payment Methods</p>
          <div className="flex space-x-2">
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-medium">
              VISA
            </div>
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-medium">
              MC
            </div>
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-medium">
              AMEX
            </div>
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-medium">
              PP
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}