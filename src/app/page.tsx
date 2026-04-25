import { Suspense } from 'react';
import { Header } from '@/components/layout/header';
import { HeroSection } from '@/components/home/hero-section';
import { CategoriesSection } from '@/components/home/categories-section';
import { FeaturedProducts } from '@/components/home/featured-products';
import { RecommendedProducts } from '@/components/home/recommended-products';
import { NewsletterSection } from '@/components/home/newsletter-section';
import { AboutSection } from '@/components/home/about-section';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        <RecommendedProducts />
        <AboutSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}