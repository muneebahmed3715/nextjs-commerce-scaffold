'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Search, 
  MessageCircle, 
  Package,
  CreditCard,
  Truck,
  RefreshCw,
  Shield,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

const faqData = [
  {
    category: "Orders & Payment",
    icon: Package,
    color: "bg-blue-100 text-blue-600",
    questions: [
      {
        q: "How do I place an order?",
        a: "To place an order, browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping information and payment details. Review your order and click 'Place Order' to complete your purchase."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are secure and encrypted."
      },
      {
        q: "Can I modify or cancel my order?",
        a: "Orders can be modified or cancelled within 2 hours of placement. After this time, the order enters our fulfillment process and cannot be changed. Contact our customer service team immediately if you need assistance."
      },
      {
        q: "Do you offer payment plans or financing?",
        a: "Yes, we offer payment plans through our partnership with Afterpay and Klarna for qualifying orders over $50. You can select this option at checkout."
      },
      {
        q: "Why was my payment declined?",
        a: "Payment declines can occur due to insufficient funds, incorrect billing information, expired cards, or security flags from your bank. Please check your payment details and try again, or contact your bank for assistance."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    icon: Truck,
    color: "bg-green-100 text-green-600",
    questions: [
      {
        q: "What are your shipping options?",
        a: "We offer Standard Shipping (5-7 business days, $5.99), Express Shipping (2-3 business days, $12.99), and Overnight Shipping (next business day, $24.99). Free shipping is available on orders over $50."
      },
      {
        q: "How long does order processing take?",
        a: "Most orders are processed within 1-2 business days. Custom items may take 3-5 business days. You'll receive a confirmation email once your order ships."
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to over 50 countries worldwide. International shipping times and costs vary by destination. Additional customs fees may apply."
      },
      {
        q: "Can I track my order?",
        a: "Yes, all orders include tracking. You'll receive a tracking number via email once your order ships. You can also track your order through your account dashboard."
      },
      {
        q: "What if my package is lost or damaged?",
        a: "If your package is lost or damaged during transit, contact us immediately. We'll file a claim with the shipping carrier and arrange for a replacement or refund."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    icon: RefreshCw,
    color: "bg-purple-100 text-purple-600",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return policy for unused items in original packaging. Items must be returned with all tags and labels attached. Custom and final sale items cannot be returned."
      },
      {
        q: "How do I return an item?",
        a: "Log into your account, go to 'Order History,' and select 'Return Item.' Follow the prompts to print a return label and drop off the package at any authorized shipping location."
      },
      {
        q: "Are there any return fees?",
        a: "Return shipping is free for defective items. For other returns, a $5.99 return shipping fee applies. Original shipping costs are non-refundable."
      },
      {
        q: "How long do refunds take?",
        a: "Refunds are processed within 5-7 business days after we receive your return. The credit will appear on your original payment method."
      },
      {
        q: "Can I exchange an item?",
        a: "Yes, you can exchange items within 30 days. Exchanges are processed quickly, and we'll ship the new item once we receive your return."
      }
    ]
  },
  {
    category: "Products & Services",
    icon: Shield,
    color: "bg-orange-100 text-orange-600",
    questions: [
      {
        q: "How do I know if a product is in stock?",
        a: "Product availability is shown on each product page. Items marked 'In Stock' are ready to ship. You can also sign up for stock notifications on out-of-stock items."
      },
      {
        q: "Do you offer product warranties?",
        a: "Yes, most products come with a manufacturer's warranty. Extended warranty options are available at checkout for eligible items."
      },
      {
        q: "Can I order custom or personalized items?",
        a: "Yes, we offer customization on select products. Custom items have a longer processing time and cannot be returned unless defective."
      },
      {
        q: "How do I choose the right size?",
        a: "Each product includes detailed sizing charts and measurements. We also provide fit guides and customer reviews to help you choose the right size."
      },
      {
        q: "Are your products authentic?",
        a: "Yes, we guarantee that all products are 100% authentic and sourced directly from manufacturers or authorized distributors."
      }
    ]
  },
  {
    category: "Account & Security",
    icon: Shield,
    color: "bg-red-100 text-red-600",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click 'Sign In' and then 'Create Account.' Enter your email address and create a password. You'll receive a confirmation email to verify your account."
      },
      {
        q: "Is my personal information secure?",
        a: "Yes, we use industry-standard SSL encryption to protect your personal and payment information. We never share your data with third parties without your consent."
      },
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot Password' on the sign-in page. Enter your email address, and we'll send you a password reset link."
      },
      {
        q: "Can I save multiple shipping addresses?",
        a: "Yes, you can save multiple shipping addresses in your account for faster checkout. You can also set a default address."
      },
      {
        q: "How do I delete my account?",
        a: "To delete your account, contact our customer service team. We'll process your request within 24 hours and confirm when your account has been deleted."
      }
    ]
  }
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFAQs, setFilteredFAQs] = useState(faqData);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      setFilteredFAQs(faqData);
    } else {
      const filtered = faqData.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.q.toLowerCase().includes(term) || 
          q.a.toLowerCase().includes(term)
        )
      })).filter(category => category.questions.length > 0);
      
      setFilteredFAQs(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to common questions about our products, services, and policies.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-12 pr-4 py-3 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
            <a href="/contact">
              <MessageCircle className="w-6 h-6" />
              <span>Live Chat Support</span>
            </a>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
            <a href="/track-order">
              <Package className="w-6 h-6" />
              <span>Track Order</span>
            </a>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
            <a href="/returns">
              <RefreshCw className="w-6 h-6" />
              <span>Start a Return</span>
            </a>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
            <a href="/contact">
              <HelpCircle className="w-6 h-6" />
              <span>Contact Us</span>
            </a>
          </Button>
        </div>

        {/* FAQ Categories */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {filteredFAQs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-gray-600 mb-4">
                    Try searching with different keywords or browse our categories below.
                  </p>
                  <Button onClick={() => setSearchTerm('')}>
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredFAQs.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center mr-3`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        {category.category}
                        <Badge variant="secondary" className="ml-auto">
                          {category.questions.length} questions
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((faq, faqIndex) => (
                          <AccordionItem key={faqIndex} value={`${index}-${faqIndex}`}>
                            <AccordionTrigger className="text-left">
                              {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600">
                              {faq.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="#" className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                  <span className="text-sm">How to track my order</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                  <span className="text-sm">Return policy details</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                  <span className="text-sm">Shipping costs & times</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                  <span className="text-sm">Payment options</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                  <span className="text-sm">Account management</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>
              </CardContent>
            </Card>

            {/* Still Need Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Still Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Can't find the answer you're looking for? Our support team is here to help.
                </p>
                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <a href="/contact">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Support
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="tel:1-800-123-4567">
                      <Package className="w-4 h-4 mr-2" />
                      Call 1-800-HELP
                    </a>
                  </Button>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Available Mon-Fri, 9AM-6PM EST
                </div>
              </CardContent>
            </Card>

            {/* Help Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Help Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="/shipping" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Shipping Info</p>
                    <p className="text-xs text-gray-500">Delivery times and costs</p>
                  </div>
                </a>
                <a href="/returns" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                  <RefreshCw className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Returns & Exchanges</p>
                    <p className="text-xs text-gray-500">30-day return policy</p>
                  </div>
                </a>
                <a href="/track-order" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                  <Package className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Order Tracking</p>
                    <p className="text-xs text-gray-500">Track your package</p>
                  </div>
                </a>
                <a href="/account" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                  <Shield className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium">Account Help</p>
                    <p className="text-xs text-gray-500">Manage your account</p>
                  </div>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}