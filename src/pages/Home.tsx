import React from 'react';
import { Header } from '@/components/Header';
import { TopOffers } from '@/components/TopOffers';
import { PopularCuisines } from '@/components/PopularCuisines';
import { FeaturedRestaurants } from '@/components/FeaturedRestaurants';
import { FeaturesSection } from '@/components/FeaturesSection';
import { Footer } from '@/components/Footer';
import { DialogComponents } from '@/components/DialogComponents';
import { NearbyRestaurants } from '@/components/NearbyRestaurants';
import { toast } from '@/hooks/use-toast';

const Home = () => {
  React.useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      localStorage.setItem('hasVisited', 'true');
      setTimeout(() => {
        toast({
          title: "Welcome to FoodApp",
          description: "Experience real-time food delivery with live updates and tracking!",
        });
      }, 1000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="container mx-auto px-4 pt-8 pb-16">
          <h1 className="text-3xl font-bold mb-8">Food delivery with real-time tracking</h1>

          {/* Nearby Restaurants */}
          <div className="mb-12">
            <NearbyRestaurants />
          </div>

          {/* Top Offers Section */}
          <div className="mb-12">
            <TopOffers />
          </div>

          {/* Popular Cuisines Section */}
          <div className="mb-12">
            <PopularCuisines />
          </div>

          {/* Featured Restaurants Section */}
          <FeaturedRestaurants />
        </section>

        {/* Features Section */}
        <FeaturesSection />
      </main>

      <Footer />

      {/* Dialog Components */}
      <DialogComponents />
    </div>
  );
};

export default Home;