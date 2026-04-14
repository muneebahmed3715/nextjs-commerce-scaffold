'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SafeImage } from '@/components/ui/safe-image';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderStatus {
  status: string;
  date: string;
  description: string;
  completed: boolean;
}

interface OrderData {
  orderNumber: string;
  status: string;
  estimatedDelivery: string;
  trackingNumber: string;
  carrier: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  timeline: OrderStatus[];
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber || !email) {
      toast.error('Please enter both order number and email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/track-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderNumber, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrderData(data);
        toast.success('Order found successfully!');
      } else {
        setError(data.error || 'Order not found');
        toast.error(data.error || 'Order not found');
      }
    } catch (error) {
      setError('Failed to track order. Please try again.');
      toast.error('Failed to track order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'out-for-delivery':
        return 'bg-blue-100 text-blue-800';
      case 'in-transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (completed: boolean) => {
    return completed ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <Clock className="w-5 h-5 text-gray-400" />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Order
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your order number and email address to track your package status and delivery timeline.
          </p>
        </div>

        {!orderData ? (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Order Lookup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTrackOrder} className="space-y-6">
                  <div>
                    <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Order Number *
                    </label>
                    <Input
                      id="orderNumber"
                      type="text"
                      placeholder="e.g., SHP-2024-12345"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You can find your order number in your confirmation email
                    </p>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      The email address used when placing the order
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                        <p className="text-red-800">{error}</p>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      'Tracking...'
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Track Order
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Need Help?</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Customer Service:</strong>
                      </p>
                      <p className="text-sm">1-800-TRACK-ME</p>
                      <p className="text-sm">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Email Support:</strong>
                      </p>
                      <p className="text-sm">orders@shophub.com</p>
                      <p className="text-sm">Response within 24 hours</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Order {orderData.orderNumber}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Placed on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(orderData.status)}>
                    {orderData.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Delivery Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Estimated Delivery:</strong> {orderData.estimatedDelivery}</p>
                      <p><strong>Tracking Number:</strong> {orderData.trackingNumber}</p>
                      <p><strong>Carrier:</strong> {orderData.carrier}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <div className="space-y-1 text-sm">
                      <p>{orderData.shippingAddress.name}</p>
                      <p>{orderData.shippingAddress.address}</p>
                      <p>
                        {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zip}
                      </p>
                      <p>{orderData.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {orderData.timeline.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="shrink-0 mt-1">
                        {getStatusIcon(item.completed)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{item.status}</h4>
                          <span className="text-sm text-gray-500">{item.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <SafeImage
                        src={item.image || '/placeholder-product.svg'}
                        alt={item.name}
                        width={64}
                        height={64}
                        sizes="64px"
                        className="w-16 h-16 object-cover rounded"
                        fallbackSrc="/placeholder-product.svg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="flex-1" asChild>
                <a href={`/contact?order=${orderData.orderNumber}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </a>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <a href="/returns">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start a Return
                </a>
              </Button>
              <Button 
                className="flex-1" 
                onClick={() => {
                  setOrderData(null);
                  setOrderNumber('');
                  setEmail('');
                }}
              >
                Track Another Order
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}