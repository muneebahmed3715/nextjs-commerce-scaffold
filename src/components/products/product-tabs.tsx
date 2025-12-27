'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle } from 'lucide-react';

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

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [reviews] = useState([
    {
      id: 1,
      name: 'John Doe',
      rating: 5,
      date: '2024-01-15',
      comment: 'Excellent product! Exactly as described and great quality.',
      verified: true,
    },
    {
      id: 2,
      name: 'Jane Smith',
      rating: 4,
      date: '2024-01-10',
      comment: 'Good value for money. Fast shipping and well packaged.',
      verified: true,
    },
    {
      id: 3,
      name: 'Mike Johnson',
      rating: 5,
      date: '2024-01-05',
      comment: 'Amazing product! Would definitely recommend to others.',
      verified: false,
    },
  ]);

  const specifications = [
    { label: 'Brand', value: 'Generic Brand' },
    { label: 'Model', value: product.sku },
    { label: 'Category', value: product.category.name },
    { label: 'Weight', value: '1.5 kg' },
    { label: 'Dimensions', value: '30 x 20 x 10 cm' },
    { label: 'Material', value: 'High Quality Materials' },
    { label: 'Warranty', value: '1 Year Manufacturer Warranty' },
    { label: 'Origin', value: 'Made in USA' },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-current text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="mt-12">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Product Description</h3>
              <div className="prose max-w-none text-gray-600">
                <p className="mb-4">{product.description}</p>
                <p className="mb-4">
                  This premium product is designed with quality and durability in mind. 
                  Perfect for everyday use, it combines functionality with style to meet 
                  all your needs. Whether you're a professional or a casual user, you'll 
                  appreciate the attention to detail and superior craftsmanship.
                </p>
                <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>High-quality materials ensure long-lasting durability</li>
                  <li>Sleek and modern design that complements any setting</li>
                  <li>Easy to use and maintain</li>
                  <li>Environmentally friendly manufacturing process</li>
                  <li>Backed by our satisfaction guarantee</li>
                </ul>
                <p className="mt-4">
                  Experience the difference that quality makes. This product has been 
                  thoroughly tested to meet the highest standards of performance and 
                  reliability, ensuring you get the best value for your investment.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">{spec.label}:</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {renderStars(5)}
                  </div>
                  <span className="text-sm text-gray-600">4.5 out of 5</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{review.name}</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex text-yellow-400">
                              {renderStars(review.rating)}
                            </div>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shipping" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Shipping & Delivery</h3>
              <div className="space-y-4 text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Standard Shipping</h4>
                  <p>5-7 business days - FREE on orders over $50</p>
                  <p>Otherwise, $5.99 flat rate</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Express Shipping</h4>
                  <p>2-3 business days - $12.99</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Overnight Shipping</h4>
                  <p>Next business day - $24.99</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">International Shipping</h4>
                  <p>Available to most countries - Rates calculated at checkout</p>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">Return Policy</h4>
                  <p>30-day return policy for unused items in original packaging.</p>
                  <p>Customer is responsible for return shipping costs.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}