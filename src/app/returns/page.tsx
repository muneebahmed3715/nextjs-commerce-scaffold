import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  Clock, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Package,
  CreditCard,
  ArrowLeft,
  Calendar,
  Truck
} from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Returns & Exchanges
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our hassle-free return policy ensures you can shop with confidence. Learn about our return process and guidelines.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Return Policy Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Our Return Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="font-semibold text-green-800">30-Day Return Window</h4>
                  </div>
                  <p className="text-green-700">
                    Return any item within 30 days of delivery for a full refund or exchange.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      Eligible for Return
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Unused and unworn items</li>
                      <li>• Items in original packaging</li>
                      <li>• All tags and labels attached</li>
                      <li>• Original receipt or proof of purchase</li>
                      <li>• Non-customized products</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                      Not Eligible for Return
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Used or damaged items</li>
                      <li>• Items without original packaging</li>
                      <li>• Custom or personalized products</li>
                      <li>• Perishable goods</li>
                      <li>• Items marked as final sale</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Return Process */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  How to Return an Item
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Initiate Your Return</h4>
                      <p className="text-sm text-gray-600">
                        Log into your account and go to "Order History" to select the item you want to return.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Choose Return Option</h4>
                      <p className="text-sm text-gray-600">
                        Select refund or exchange, and provide a reason for the return.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Print Return Label</h4>
                      <p className="text-sm text-gray-600">
                        Download and print your prepaid return shipping label.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold">Package and Ship</h4>
                      <p className="text-sm text-gray-600">
                        Pack the item securely and drop it off at any authorized shipping location.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold">Receive Refund/Exchange</h4>
                      <p className="text-sm text-gray-600">
                        Once we receive and inspect your item, we'll process your refund or exchange within 5-7 business days.
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <a href="/account/returns">Start a Return</a>
                </Button>
              </CardContent>
            </Card>

            {/* Exchange Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Exchanges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Want a different size, color, or style? We make exchanges easy and convenient.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Exchange Benefits</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Free shipping on exchange items</li>
                      <li>• No restocking fees</li>
                      <li>• Same 30-day exchange window</li>
                      <li>• Quick processing (2-3 business days)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Exchange Process</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Select new item during return process</li>
                      <li>• Pay difference if new item costs more</li>
                      <li>• Receive credit if new item costs less</li>
                      <li>• We'll ship new item once return is received</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refund Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Refund Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Refund Timeline</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-sm">Return Received</span>
                        <Badge variant="outline">Day 0</Badge>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-sm">Quality Inspection</span>
                        <Badge variant="outline">1-2 days</Badge>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-sm">Refund Processing</span>
                        <Badge variant="outline">1-2 days</Badge>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm">Refund Complete</span>
                        <Badge variant="outline">3-5 days</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Refund Methods</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Original payment method (preferred)</li>
                      <li>• Store credit (immediate processing)</li>
                      <li>• Gift card (if requested)</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Shipping Costs</h4>
                    <p className="text-blue-700 text-sm">
                      Original shipping costs are non-refundable. Return shipping is free for defective items; otherwise, a $5.99 return shipping fee applies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <a href="/account/returns">Start a Return</a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/track-order">Track Return Status</a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/contact">Contact Support</a>
                </Button>
              </CardContent>
            </Card>

            {/* Return Exceptions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Special Cases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Damaged Items</h4>
                  <p className="text-sm text-gray-600">
                    Contact us within 48 hours of delivery for damaged items. We'll arrange a replacement or refund.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Wrong Item Received</h4>
                  <p className="text-sm text-gray-600">
                    We'll send the correct item and arrange pickup of the wrong item at no cost to you.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Gift Returns</h4>
                  <p className="text-sm text-gray-600">
                    Gift recipients can return items for store credit or exchange the item.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Our customer service team is here to help with any return or exchange questions.
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> returns@shophub.com</p>
                  <p><strong>Phone:</strong> 1-800-RETURNS</p>
                  <p><strong>Hours:</strong> Mon-Fri, 9AM-6PM EST</p>
                </div>
              </CardContent>
            </Card>

            {/* Return Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Return Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Item is within 30-day return window</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Item is unused and in original condition</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Original packaging and tags are intact</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Proof of purchase is available</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}