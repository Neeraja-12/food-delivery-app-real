
import React from 'react';
import { ArrowRight, Star, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export const FeaturedRestaurants = () => {
  const restaurants = [
    {
      id: 1,
      name: 'The Italian Place',
      image: 'photo-1555396273-367ea4eb4db5',
      rating: 4.8,
      reviews: 120,
      cuisine: 'Italian, Pizza',
      deliveryTime: '20-30 min',
      deliveryFee: '$1.99',
      promoted: true,
    },
    {
      id: 2,
      name: 'Sushi House',
      image: 'photo-1579871494447-9811cf80d66c',
      rating: 4.6,
      reviews: 89,
      cuisine: 'Japanese, Sushi',
      deliveryTime: '25-35 min',
      deliveryFee: '$2.99',
      promoted: false,
    },
    {
      id: 3,
      name: 'Burger Joint',
      image: 'photo-1561758033-d89a9ad46330',
      rating: 4.4,
      reviews: 145,
      cuisine: 'American, Burgers',
      deliveryTime: '15-25 min',
      deliveryFee: '$0.99',
      promoted: true,
    },
    {
      id: 4,
      name: 'Taco Haven',
      image: 'photo-1565299585323-38d6b0865b47',
      rating: 4.5,
      reviews: 109,
      cuisine: 'Mexican, Tacos',
      deliveryTime: '30-40 min',
      deliveryFee: '$1.49',
      promoted: false,
    },
    {
      id: 5,
      name: 'Golden Dragon',
      image: 'photo-1563245372-f21724e3856d',
      rating: 4.7,
      reviews: 210,
      cuisine: 'Chinese, Asian',
      deliveryTime: '20-35 min',
      deliveryFee: '$2.49',
      promoted: false,
    },
    {
      id: 6,
      name: 'La Pizzeria',
      image: 'photo-1579751626657-72bc17010498',
      rating: 4.9,
      reviews: 178,
      cuisine: 'Italian, Pizza',
      deliveryTime: '20-30 min',
      deliveryFee: '$1.99',
      promoted: true,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Featured Restaurants</h2>
        <Link to="/category/all">
          <Button variant="ghost" size="sm" className="gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((restaurant) => (
          <Link to={`/restaurant/${restaurant.id}`} key={restaurant.id}>
            <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <img 
                  src={`https://images.unsplash.com/${restaurant.image}?auto=format&fit=crop&w=500&q=80`}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                {restaurant.promoted && (
                  <Badge className="absolute top-2 left-2 bg-primary">
                    Featured
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between mb-1">
                  <h3 className="font-semibold">{restaurant.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                    <span className="text-xs text-gray-500">({restaurant.reviews})</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-2">{restaurant.cuisine}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <span>{restaurant.deliveryFee} delivery</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
