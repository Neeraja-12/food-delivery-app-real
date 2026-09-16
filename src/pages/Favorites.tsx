import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Favorites = () => {
  const { toast } = useToast();
  const [likedRestaurants, setLikedRestaurants] = useState<any[]>([]);
  const [restaurantData] = useState([
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
      img: "photo-1540316465051-c8a0270da5d1",
      rating: 4.7,
      price: "₹1000 for two",
      time: "40-45 mins"
    },
    {
      id: 9,
      name: "Al-Daaz",
      cuisine: "Arabian • Middle Eastern • BBQ",
      img: "photo-1513104890138-7c749659a591",
      rating: 4.2,
      price: "₹600 for two",
      time: "35-40 mins"
    },
    {
      id: 10,
      name: "Polar Bear",
      cuisine: "Ice Cream • Desserts • Beverages",
      img: "photo-1501443762994-82bd5dace89a",
      rating: 4.5,
      price: "₹250 for two",
      time: "15-20 mins"
    },
    {
      id: 11,
      name: "Punjabi by Nature",
      cuisine: "North Indian • Punjabi • Curry",
      img: "photo-1546833999-b9f581a1996d",
      rating: 4.3,
      price: "₹800 for two",
      time: "35-40 mins"
    },
    {
      id: 12,
      name: "Sushi Hub",
      cuisine: "Japanese • Sushi • Asian",
      img: "photo-1553621042-f6e147245754",
      rating: 4.6,
      price: "₹1200 for two",
      time: "40-45 mins"
    }
  ]);

  useEffect(() => {
    const savedLikes = localStorage.getItem('likedRestaurants');
    const likedIds = savedLikes ? JSON.parse(savedLikes) : [];
    const likedRestaurantsData = restaurantData.filter(restaurant => 
      likedIds.includes(restaurant.id)
    );
    setLikedRestaurants(likedRestaurantsData);
  }, []);

  const handleUnlike = (restaurantId: number) => {
    const savedLikes = localStorage.getItem('likedRestaurants');
    const likedIds = savedLikes ? JSON.parse(savedLikes) : [];
    const newLikedIds = likedIds.filter((id: number) => id !== restaurantId);
    localStorage.setItem('likedRestaurants', JSON.stringify(newLikedIds));
    
    setLikedRestaurants(prev => prev.filter(restaurant => restaurant.id !== restaurantId));
    
    toast({
      title: "Removed from favorites",
      description: "Restaurant removed from your favorites",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/" className="text-primary hover:text-primary/90 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
          <p className="text-muted-foreground">
            {likedRestaurants.length} restaurants saved
          </p>
        </div>

        {likedRestaurants.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-4">
              Start adding restaurants to your favorites list!
            </p>
            <Link 
              to="/" 
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Explore Restaurants
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {likedRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img
                    src={`https://images.unsplash.com/${restaurant.img}?auto=format&fit=crop&q=80&w=800`}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <button 
                    onClick={() => handleUnlike(restaurant.id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </button>
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
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{restaurant.price}</span>
                    <span>{restaurant.time}</span>
                  </div>
                  <Link 
                    to={`/restaurant/${restaurant.id}`}
                    className="w-full mt-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-200 inline-block text-center"
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
