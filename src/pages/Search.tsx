
import React, { useState } from 'react';
import { Search as SearchIcon, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Mock restaurant data
const allRestaurants = [
  { 
    id: 1, 
    name: "Empire Restaurant",
    cuisine: "North Indian • Biryani • Kebab",
    img: "photo-1504674900247-0877df9cc836",
    rating: 4.2,
    price: "₹500 for two",
    time: "25-30 mins"
  },
  {
    id: 2,
    name: "Udupi Palace",
    cuisine: "South Indian • Dosa • Idli",
    img: "photo-1517248135467-4c7edcad34c4",
    rating: 4.5,
    price: "₹300 for two",
    time: "20-25 mins"
  },
  {
    id: 3,
    name: "Beijing Bites",
    cuisine: "Chinese • Asian • Noodles",
    img: "photo-1552566626-52f8b828add9",
    rating: 4.1,
    price: "₹600 for two",
    time: "35-40 mins"
  },
  {
    id: 4,
    name: "Pizza Hut",
    cuisine: "Pizza • Italian • Fast Food",
    img: "photo-1496412705862-e0088f16f791",
    rating: 4.3,
    price: "₹800 for two",
    time: "30-35 mins"
  },
  {
    id: 5,
    name: "Truffles",
    cuisine: "Burgers • American • Cafe",
    img: "photo-1555396273-367ea4eb4db5",
    rating: 4.8,
    price: "₹450 for two",
    time: "25-30 mins"
  },
  {
    id: 6,
    name: "Meghana Foods",
    cuisine: "Biryani • Andhra • Seafood",
    img: "photo-1566843972142-a7fcb70de55a",
    rating: 4.6,
    price: "₹700 for two",
    time: "30-35 mins"
  },
  {
    id: 7,
    name: "Third Wave Coffee",
    cuisine: "Cafe • Coffee • Desserts",
    img: "photo-1495474472287-4d71bcdd2085",
    rating: 4.4,
    price: "₹400 for two",
    time: "20-25 mins"
  },
  {
    id: 8,
    name: "Burma Burma",
    cuisine: "Burmese • Asian • Vegetarian",
    img: "photo-1505253716362-afaea1d3d1af",
    rating: 4.7,
    price: "₹1000 for two",
    time: "40-45 mins"
  }
];

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof allRestaurants>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Empty search",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = allRestaurants.filter(
      restaurant => 
        restaurant.name.toLowerCase().includes(term) || 
        restaurant.cuisine.toLowerCase().includes(term)
    );
    
    setSearchResults(results);
    setHasSearched(true);
    
    if (results.length === 0) {
      toast({
        title: "No results found",
        description: `No restaurants found matching "${searchTerm}"`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Search results",
        description: `Found ${results.length} restaurant${results.length !== 1 ? 's' : ''}`,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <SearchIcon className="w-8 h-8 text-primary" />
          Search Restaurants
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex gap-4 mb-4">
            <Input
              type="text"
              placeholder="Search for restaurants or cuisines..."
              className="flex-1 p-3"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={handleSearch}>
              Search
            </Button>
          </div>
          <div className="text-center text-muted-foreground">
            {!hasSearched && "Enter a restaurant name or cuisine type to begin your search"}
          </div>
        </div>

        {hasSearched && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {searchResults.length === 0 
                ? "No results found" 
                : `Search Results (${searchResults.length})`}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((restaurant) => (
                <div key={restaurant.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <img
                      src={`https://images.unsplash.com/${restaurant.img}?auto=format&fit=crop&q=80&w=800`}
                      alt={restaurant.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{restaurant.name}</h3>
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
                      asChild
                      className="w-full"
                    >
                      <Link to={`/restaurant/${restaurant.id}`}>
                        View Menu
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
