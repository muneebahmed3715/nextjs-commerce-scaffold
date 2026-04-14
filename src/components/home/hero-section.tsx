import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-linear-to-r from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                An easy way to send requests to all suppliers
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Connect with thousands of verified suppliers and manufacturers. 
                Get the best prices for your products with just one request.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
                <Link href="/suppliers">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Start Sourcing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="border border-white/80 bg-blue-700/30 text-white hover:bg-white hover:text-blue-700"
                asChild
              >
                <Link href="/products">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">10,000+</div>
                <div className="text-blue-100">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-blue-100">Suppliers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-blue-100">Countries</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop&q=80', label: 'Smart Watch' },
                  { src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&q=80', label: 'Headphones' },
                  { src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&q=80', label: 'T-Shirt' },
                  { src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop&q=80', label: 'Yoga Mat' },
                ].map((item) => (
                  <div key={item.label} className="bg-white/20 rounded-lg overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={item.src}
                        alt={item.label}
                        fill
                        className="object-cover"
                        sizes="150px"
                      />
                    </div>
                    <p className="text-xs text-white/80 text-center py-1 font-medium">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}