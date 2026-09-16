
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Star, Search } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useLocationTracking } from '@/hooks/use-location-tracking';
import { RestaurantService, RestaurantDetails } from '@/services/restaurant-service';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export const NearbyRestaurants = () => {
  const location = useLocationTracking();
  const [restaurants, setRestaurants] = useState<RestaurantDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchRadius, setSearchRadius] = useState(5); // km
  const [searchQuery, setSearchQuery] = useState("");

  // Load nearby restaurants based on location
  useEffect(() => {
    if (location.loading || location.error || !location.latitude || !location.longitude) {
      return;
    }

    setLoading(true);
    RestaurantService.getNearbyRestaurants(location.latitude, location.longitude, searchRadius)
      .then(results => {
        setRestaurants(results);
        setLoading(false);
        
        toast({
          title: "Nearby Restaurants",
          description: `Found ${results.length} restaurants near you`
        });
      })
      .catch(error => {
        console.error("Failed to get nearby restaurants:", error);
        setLoading(false);
        
        toast({
          title: "Error",
          description: "Failed to load nearby restaurants",
          variant: "destructive"
        });
      });
  }, [location.latitude, location.longitude, searchRadius]);

  // Filter restaurants based on search query
  const filteredRestaurants = restaurants.filter(restaurant => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.cuisine.toLowerCase().includes(query)
    );
  });

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Nearby Restaurants</h3>
          <Skeleton className="h-8 w-24" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (location.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <div className="text-red-500 mb-2">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <h3 className="text-lg font-medium">Location Error</h3>
        </div>
        <p className="text-red-700 mb-4">{location.error}</p>
        <p className="text-sm text-red-600 mb-2">Please enable location access to see nearby restaurants</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-semibold">
          {location.latitude && location.longitude ? "Nearby Restaurants" : "Restaurants"}
        </h3>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 w-60"
            />
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="h-9"
            onClick={() => {
              if (location.latitude && location.longitude) {
                setLoading(true);
                RestaurantService.getNearbyRestaurants(location.latitude, location.longitude, searchRadius)
                  .then(results => {
                    setRestaurants(results);
                    setLoading(false);
                  })
                  .catch(() => setLoading(false));
              }
            }}
          >
            <Navigation className="h-4 w-4 mr-1" /> Refresh
          </Button>
        </div>
      </div>
      
      {location.latitude && location.longitude && restaurants.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            Location Active
          </Badge>
          
          <Badge variant="outline">
            Within {searchRadius}km
          </Badge>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-xs"
            onClick={() => setSearchRadius(prev => prev === 5 ? 10 : 5)}
          >
            {searchRadius === 5 ? "Increase radius" : "Decrease radius"}
          </Button>
        </div>
      )}
      
      {filteredRestaurants.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No restaurants found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Try a different search term" : "No restaurants in this area yet"}
          </p>
          {searchQuery && (
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </Button>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRestaurants.map(restaurant => (
          <Link to={`/restaurant/${restaurant.id}`} key={restaurant.id}>
            <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/${restaurant.img}?auto=format&fit=crop&q=80&w=500`} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                
                {!restaurant.isOpen && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive">Closed</Badge>
                  </div>
                )}
                
                {restaurant.discount && (
                  <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {restaurant.discount}
                  </div>
                )}
                
                {location.latitude && location.longitude && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {location.getDistanceFrom(
                      restaurant.coordinates.lat, 
                      restaurant.coordinates.lng
                    )}km
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between mb-1">
                  <h3 className="font-semibold truncate mr-2">{restaurant.name}</h3>
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-xs whitespace-nowrap">
                    <Star className="h-3 w-3 fill-green-600 text-green-600" /> {restaurant.rating}
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-2 line-clamp-1">{restaurant.cuisine}</p>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <div>{restaurant.price}</div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {restaurant.time}
                  </div>
                </div>
                
                {restaurant.busyLevel === 'high' && (
                  <div className="mt-2 text-xs text-yellow-600 flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> High demand right now
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
