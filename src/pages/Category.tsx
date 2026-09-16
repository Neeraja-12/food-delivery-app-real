
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Clock, Search, Filter, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LazyImage from '@/components/LazyImage';
import { Helmet } from 'react-helmet-async';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Category = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [selectedFilters, setSelectedFilters] = useState({
    rating: 0,
    vegOnly: false,
    delivery: false,
    offers: false
  });
  
  const restaurants = [
    {
      id: 1,
      name: "Empire Restaurant",
      cuisine: "North Indian • Biryani • Kebab",
      img: "photo-1504674900247-0877df9cc836",
      rating: 4.2,
      price: "₹500 for two",
      time: "25-30 mins",
      veg: false,
      hasOffers: true,
      delivery: true,
      priceValue: 500
    },
    {
      id: 2,
      name: "Udupi Palace",
      cuisine: "South Indian • Dosa • Idli",
      img: "photo-1517248135467-4c7edcad34c4",
      rating: 4.5,
      price: "₹300 for two",
      time: "20-25 mins",
      veg: true,
      hasOffers: false,
      delivery: true,
      priceValue: 300
    },
    {
      id: 3,
      name: "Beijing Bites",
      cuisine: "Chinese • Asian • Noodles",
      img: "photo-1552566626-52f8b828add9",
      rating: 4.1,
      price: "₹600 for two",
      time: "35-40 mins",
      veg: false,
      hasOffers: true,
      delivery: true,
      priceValue: 600
    },
    {
      id: 8,
      name: "Burma Burma",
      cuisine: "Burmese • Asian • Vegetarian",
      img: "photo-1505253716362-afaea1d3d1af",
      rating: 4.7,
      price: "₹1000 for two",
      time: "40-45 mins",
      veg: true,
      hasOffers: true,
      delivery: false,
      priceValue: 1000
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter restaurants based on search and filters
  const filteredRestaurants = restaurants.filter(restaurant => {
    // Search filter
    if (searchQuery && 
      !restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
      !restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    // Rating filter
    if (selectedFilters.rating > 0 && restaurant.rating < selectedFilters.rating) {
      return false;
    }
    
    // Veg only filter
    if (selectedFilters.vegOnly && !restaurant.veg) {
      return false;
    }
    
    // Delivery filter
    if (selectedFilters.delivery && !restaurant.delivery) {
      return false;
    }
    
    // Offers filter
    if (selectedFilters.offers && !restaurant.hasOffers) {
      return false;
    }

    // Price range filter
    if (restaurant.priceValue < priceRange[0] || restaurant.priceValue > priceRange[1]) {
      return false;
    }
    
    return true;
  });

  const handleOrderNow = (restaurantId: number, restaurantName: string) => {
    navigate(`/restaurant/${restaurantId}`);
    toast({
      title: "Success",
      description: `Redirecting to ${restaurantName}'s menu`,
    });
  };

  const resetFilters = () => {
    setSelectedFilters({
      rating: 0,
      vegOnly: false,
      delivery: false,
      offers: false
    });
    setPriceRange([0, 1500]);
    setSearchQuery("");
    toast({
      title: "Filters reset",
      description: "All filters have been cleared",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Finding the best restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{category} Restaurants | Find the Best Places to Eat</title>
        <meta name="description" content={`Discover the best ${category} restaurants near you. Order online for delivery or takeout.`} />
        <meta name="keywords" content={`${category}, restaurants, food delivery, dining, takeout`} />
        <link rel="canonical" href={`https://yourdomain.com/category/${category}`} />
      </Helmet>

      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-primary">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold">{category} Restaurants</h1>
          </div>
          
          <div className="mt-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                type="text" 
                placeholder="Search restaurants or cuisines" 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Filter restaurants">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Restaurants</SheetTitle>
                  <SheetDescription>
                    Customize your search to find exactly what you're looking for.
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Price Range</h3>
                    <div className="px-2">
                      <Slider 
                        value={priceRange} 
                        min={0} 
                        max={1500} 
                        step={100} 
                        onValueChange={setPriceRange}
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Rating</h3>
                    <div className="flex flex-wrap gap-2">
                      {[0, 3, 3.5, 4, 4.5].map((rating) => (
                        <Button 
                          key={rating} 
                          variant={selectedFilters.rating === rating ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedFilters(prev => ({...prev, rating}))}
                        >
                          {rating === 0 ? 'Any' : `${rating}+`} 
                          {rating > 0 && <Star className="ml-1 h-3 w-3" />}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">More Filters</h3>
                    <div className="space-y-2">
                      <Button 
                        variant={selectedFilters.vegOnly ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedFilters(prev => ({...prev, vegOnly: !prev.vegOnly}))}
                      >
                        {selectedFilters.vegOnly && <Check className="mr-2 h-4 w-4" />}
                        Pure Vegetarian
                      </Button>
                      
                      <Button 
                        variant={selectedFilters.delivery ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedFilters(prev => ({...prev, delivery: !prev.delivery}))}
                      >
                        {selectedFilters.delivery && <Check className="mr-2 h-4 w-4" />}
                        Free Delivery
                      </Button>
                      
                      <Button 
                        variant={selectedFilters.offers ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedFilters(prev => ({...prev, offers: !prev.offers}))}
                      >
                        {selectedFilters.offers && <Check className="mr-2 h-4 w-4" />}
                        Offers Available
                      </Button>
                    </div>
                  </div>
                </div>
                
                <SheetFooter>
                  <Button variant="outline" onClick={resetFilters}>Reset All</Button>
                  <SheetClose asChild>
                    <Button>Apply Filters</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-medium mb-2">No restaurants found</p>
            <p className="text-muted-foreground mb-4">Try adjusting your filters or search criteria</p>
            <Button onClick={resetFilters}>Reset Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <LazyImage
                    src={`https://images.unsplash.com/${restaurant.img}?auto=format&fit=crop&q=80&w=800`}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  {restaurant.hasOffers && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                      Offers Available
                    </div>
                  )}
                  {restaurant.veg && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Pure Veg
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                    <div className="flex items-center bg-green-50 px-2 py-1 rounded">
                      <Star className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-green-600 font-medium">{restaurant.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{restaurant.cuisine}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{restaurant.price}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{restaurant.time}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => handleOrderNow(restaurant.id, restaurant.name)}
                  >
                    Order Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Category;
