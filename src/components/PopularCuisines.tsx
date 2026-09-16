
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const PopularCuisines = () => {
  const cuisines = [
    {
      id: 1,
      name: 'Italian',
      image: 'photo-1565299624946-b28f40a0ae38',
      count: 42,
    },
    {
      id: 2,
      name: 'Chinese',
      image: 'photo-1563245372-f21724e3856d',
      count: 38,
    },
    {
      id: 3,
      name: 'Indian',
      image: 'photo-1505253758473-96b7015fcd40',
      count: 27,
    },
    {
      id: 4,
      name: 'Mexican',
      image: 'photo-1586511925558-a4c6376fe65f',
      count: 25,
    },
    {
      id: 5,
      name: 'Japanese',
      image: 'photo-1611143669185-af224c5e3252',
      count: 19,
    },
    {
      id: 6,
      name: 'Thai',
      image: 'photo-1559314809-0d155014e29e',
      count: 15,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Popular Cuisines</h2>
        <Link to="/category/all">
          <Button variant="ghost" size="sm" className="gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {cuisines.map((cuisine) => (
          <Link to={`/category/${cuisine.name.toLowerCase()}`} key={cuisine.id}>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow">
              <div className="relative h-32">
                <img 
                  src={`https://images.unsplash.com/${cuisine.image}?auto=format&fit=crop&w=300&q=80`}
                  alt={cuisine.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-3 text-white">
                    <h3 className="font-medium text-sm">{cuisine.name}</h3>
                    <p className="text-xs opacity-80">{cuisine.count} restaurants</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
