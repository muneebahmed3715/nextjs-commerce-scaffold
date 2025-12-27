import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Dumbbell,
  ArrowRight 
} from 'lucide-react';

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and devices',
    icon: Smartphone,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel',
    icon: Shirt,
    color: 'bg-pink-100 text-pink-600',
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Everything for your home',
    icon: Home,
    color: 'bg-green-100 text-green-600',
  },
  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sports equipment and gear',
    icon: Dumbbell,
    color: 'bg-orange-100 text-orange-600',
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our wide selection of products across different categories
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.slug} href={`/products?category=${category.slug}`}>
                <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer border-0 hover:border-primary">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-center text-primary group-hover:text-primary/80">
                      <span className="text-sm font-medium">Shop Now</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}