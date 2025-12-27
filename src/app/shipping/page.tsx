import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Truck, 
  Clock, 
  Shield, 
  Package,
  MapPin,
  CheckCircle,
  Info,
  Globe,
  Calculator
} from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shipping Information
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our shipping policies, delivery times, and costs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Shipping Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">Standard Shipping</h4>
                        <p className="text-sm text-gray-600">5-7 business days</p>
                      </div>
                      <Badge variant="secondary">$5.99</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Reliable and economical shipping for all orders under $50.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">Express Shipping</h4>
                        <p className="text-sm text-gray-600">2-3 business days</p>
                      </div>
                      <Badge variant="secondary">$12.99</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Faster delivery for when you need your items quickly.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">Overnight Shipping</h4>
                        <p className="text-sm text-gray-600">Next business day</p>
                      </div>
                      <Badge variant="secondary">$24.99</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Fastest delivery option for urgent orders.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-green-800">Free Shipping</h4>
                        <p className="text-sm text-green-600">5-7 business days</p>
                      </div>
                      <Badge className="bg-green-600">FREE</Badge>
                    </div>
                    <p className="text-sm text-green-700">
                      On all orders over $50. Automatically applied at checkout.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Times */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Order Processing Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Standard Processing</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Most orders are processed within 1-2 business days.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• In-stock items: 1-2 business days</li>
                      <li>• Custom items: 3-5 business days</li>
                      <li>• Large orders: 2-3 business days</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Order Cut-off Times</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Orders placed after these times will be processed the next business day.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Standard Shipping: 2:00 PM EST</li>
                      <li>• Express Shipping: 12:00 PM EST</li>
                      <li>• Overnight Shipping: 10:00 AM EST</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* International Shipping */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  International Shipping
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">International Delivery Times</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-blue-700">Canada & Mexico</p>
                      <p className="text-blue-600">7-14 business days</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-700">Europe</p>
                      <p className="text-blue-600">10-21 business days</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-700">Asia & Pacific</p>
                      <p className="text-blue-600">14-28 business days</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-700">Rest of World</p>
                      <p className="text-blue-600">21-35 business days</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Important Notes:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• International orders may be subject to customs duties and taxes</li>
                    <li>• You are responsible for any import fees charged by your country</li>
                    <li>• Some items may have shipping restrictions to certain countries</li>
                    <li>• International orders cannot be cancelled once shipped</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Package Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Package Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  All orders include tracking information. You'll receive an email with your tracking number once your order ships.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Order Confirmed</p>
                      <p className="text-sm text-gray-600">We've received your order and are preparing it for shipment</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Order Processed</p>
                      <p className="text-sm text-gray-600">Your order has been processed and is ready for pickup</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">In Transit</p>
                      <p className="text-sm text-gray-600">Your package is on its way to you</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Out for Delivery</p>
                      <p className="text-sm text-gray-600">Your package will be delivered today</p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <a href="/track-order">Track Your Order</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Shipping Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your zip code to estimate shipping costs and delivery times.
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter ZIP code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button className="w-full">Calculate Shipping</Button>
                </div>
              </CardContent>
            </Card>

            {/* Shipping FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Info className="w-5 h-5 mr-2" />
                  Quick Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Do you ship to PO boxes?</h4>
                  <p className="text-sm text-gray-600">
                    Yes, we ship to PO boxes via USPS for standard shipping only.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Can I change my shipping address?</h4>
                  <p className="text-sm text-gray-600">
                    Address changes are possible before order processing. Contact us immediately.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">What if my package is lost?</h4>
                  <p className="text-sm text-gray-600">
                    We'll investigate and either reship or refund your order. Contact us if tracking shows no movement for 7+ days.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Shield className="w-5 h-5 mr-2" />
                  Shipping Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Need help with shipping? Our support team is here to assist you.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/contact">Contact Support</a>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/faq">View Shipping FAQ</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}