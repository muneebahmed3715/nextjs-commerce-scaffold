'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Mail,
  ArrowLeft,
  Home,
  FileText,
  HelpCircle
} from 'lucide-react';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  useEffect(() => {
    const orderParam = searchParams.get('order');
    if (orderParam) {
      setOrderNumber(orderParam);
      // Calculate estimated delivery (3-5 business days from now)
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5);
      setEstimatedDelivery(deliveryDate.toLocaleDateString());
    }
  }, [searchParams]);

  const handleContinueShopping = () => {
    router.push('/products');
  };

  const handleTrackOrder = () => {
    router.push(`/track-order?order=${orderNumber}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <p className="text-sm text-gray-500">
              Order confirmation has been sent to your email address.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Number:</span>
                      <span className="font-medium">{orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Processing
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <span className="font-medium">{estimatedDelivery}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">What's Next?</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Order Processing</p>
                        <p className="text-xs text-gray-600">We'll prepare your order for shipment</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">Confirmation Email</p>
                        <p className="text-xs text-gray-600">Check your email for order details</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Package className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="font-medium text-sm">Track Your Order</p>
                        <p className="text-xs text-gray-600">Monitor your order status online</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleTrackOrder}
            >
              <Truck className="w-4 h-4 mr-2" />
              Track Order
            </Button>
            <Button 
              className="w-full" 
              onClick={handleContinueShopping}
            >
              <Home className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>

          {/* Important Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="w-5 h-5 mr-2" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Order Processing</h4>
                  <p className="text-gray-600">
                    Your order is now being processed. You'll receive a confirmation email shortly with all order details.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Shipping Information</h4>
                  <p className="text-gray-600">
                    Most orders are processed within 1-2 business days and shipped within 3-5 business days.
                    You'll receive tracking information once your order ships.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Customer Support</h4>
                  <p className="text-gray-600 mb-3">
                    If you have any questions about your order, please don't hesitate to contact our customer support team.
                  </p>
                  <div className="space-y-1 text-xs">
                    <p><strong>Email:</strong> support@shophub.com</p>
                    <p><strong>Phone:</strong> 1-800-SUPPORT</p>
                    <p><strong>Hours:</strong> Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Need help with your order? Check out these resources:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="sm" asChild>
                <Link href="/track-order">
                  <FileText className="w-4 h-4 mr-2" />
                  Track Order
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/contact">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/faq">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  FAQs
                </Link>
              </Button>
            </div>
          </div>

          {/* Back to Account */}
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/account">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to My Account
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}