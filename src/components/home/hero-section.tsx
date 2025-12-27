import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
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
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Sourcing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Browse Products
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
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="w-12 h-12 bg-white/30 rounded-lg mb-3"></div>
                  <div className="h-2 bg-white/40 rounded mb-2"></div>
                  <div className="h-2 bg-white/40 rounded w-3/4"></div>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="w-12 h-12 bg-white/30 rounded-lg mb-3"></div>
                  <div className="h-2 bg-white/40 rounded mb-2"></div>
                  <div className="h-2 bg-white/40 rounded w-3/4"></div>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="w-12 h-12 bg-white/30 rounded-lg mb-3"></div>
                  <div className="h-2 bg-white/40 rounded mb-2"></div>
                  <div className="h-2 bg-white/40 rounded w-3/4"></div>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="w-12 h-12 bg-white/30 rounded-lg mb-3"></div>
                  <div className="h-2 bg-white/40 rounded mb-2"></div>
                  <div className="h-2 bg-white/40 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}