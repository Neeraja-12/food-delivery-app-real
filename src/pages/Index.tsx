
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  Clock, 
  Star, 
  ArrowRight, 
  ChevronRight, 
  Heart, 
  Bike, 
  ShoppingBag, 
  Truck, 
  Compass, 
  Tag, 
  Menu, 
  X,
  Utensils,
  Award,
  Coffee,
  PenSquare,
  Gift,
  DollarSign,
  Share2,
  Filter
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useMobile } from '@/hooks/use-mobile';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const navigationLinks = [
  { name: 'Home', path: '/' },
  { name: 'Search', path: '/search' },
  { name: 'Offers', path: '/offers' },
  { name: 'Help', path: '/help' },
];

const popularCuisines = [
  { name: 'Pizza', image: 'photo-1513104890138-7c749659a591', path: '/category/pizza' },
  { name: 'Burger', image: 'photo-1568901346375-23c9450c58cd', path: '/category/burger' },
  { name: 'Chinese', image: 'photo-1563245372-f21724e3856d', path: '/category/chinese' },
  { name: 'Sushi', image: 'photo-1579871494447-9811cf80d66c', path: '/category/sushi' },
  { name: 'Mexican', image: 'photo-1565299624946-b28f40a0ae38', path: '/category/mexican' },
  { name: 'Italian', image: 'photo-1498579809087-ef1e558fd1da', path: '/category/italian' },
  { name: 'Indian', image: 'photo-1585937421612-70a008356c36', path: '/category/indian' },
  { name: 'Thai', image: 'photo-1559847844-5315695dadae', path: '/category/thai' },
];

const featuredRestaurants = [
  {
    id: 1,
    name: "Empire Restaurant",
    cuisine: "North Indian • Biryani • Kebab",
    img: "photo-1504674900247-0877df9cc836",
    rating: 4.2,
    price: "₹500 for two",
    time: "25-30 mins",
    discount: "10% OFF up to ₹100",
    veg: false
  },
  {
    id: 2,
    name: "Udupi Palace",
    cuisine: "South Indian • Dosa • Idli",
    img: "photo-1517248135467-4c7edcad34c4",
    rating: 4.5,
    price: "₹300 for two",
    time: "20-25 mins",
    discount: "20% OFF up to ₹150",
    veg: true
  },
  {
    id: 3,
    name: "Beijing Bites",
    cuisine: "Chinese • Asian • Noodles",
    img: "photo-1552566626-52f8b828add9",
    rating: 4.1,
    price: "₹600 for two",
    time: "35-40 mins",
    discount: "15% OFF up to ₹120",
    veg: false
  },
  {
    id: 4,
    name: "Pizza Hut",
    cuisine: "Pizza • Italian • Fast Food",
    img: "photo-1496412705862-e0088f16f791",
    rating: 4.3,
    price: "₹800 for two",
    time: "30-35 mins",
    discount: "Buy 1 Get 1",
    veg: false
  },
  {
    id: 5,
    name: "Truffles",
    cuisine: "Burgers • American • Cafe",
    img: "photo-1555396273-367ea4eb4db5",
    rating: 4.8,
    price: "₹450 for two",
    time: "25-30 mins",
    discount: "30% OFF up to ₹200",
    veg: false
  },
  {
    id: 6,
    name: "Meghana Foods",
    cuisine: "Biryani • Andhra • Seafood",
    img: "photo-1566843972142-a7fcb70de55a",
    rating: 4.6,
    price: "₹700 for two",
    time: "30-35 mins",
    discount: "10% OFF up to ₹80",
    veg: false
  },
  {
    id: 7,
    name: "Thai Basil",
    cuisine: "Thai • Asian • Curry",
    img: "photo-1559847844-5315695dadae",
    rating: 4.4,
    price: "₹650 for two",
    time: "30-35 mins",
    discount: "25% OFF up to ₹175",
    veg: false
  },
  {
    id: 8,
    name: "Taco Bell",
    cuisine: "Mexican • Tacos • Fast Food",
    img: "photo-1565299624946-b28f40a0ae38",
    rating: 4.0,
    price: "₹400 for two",
    time: "25-30 mins",
    discount: "Free Churros",
    veg: false
  },
  {
    id: 9,
    name: "Domino's Pizza",
    cuisine: "Pizza • Fast Food • Italian",
    img: "photo-1513104890138-7c749659a591",
    rating: 4.2,
    price: "₹550 for two",
    time: "30-35 mins",
    discount: "Free Garlic Bread",
    veg: false
  },
  {
    id: 10,
    name: "Subway",
    cuisine: "Sandwiches • Healthy • Salads",
    img: "photo-1509722747041-616f39b57569",
    rating: 4.1,
    price: "₹350 for two",
    time: "20-25 mins",
    discount: "15% OFF on Subs",
    veg: false
  },
  {
    id: 11,
    name: "Paradise Biryani",
    cuisine: "Biryani • Hyderabadi • Indian",
    img: "photo-1633945274405-b6c8069297b8",
    rating: 4.7,
    price: "₹750 for two",
    time: "35-40 mins",
    discount: "₹100 OFF above ₹500",
    veg: false
  },
  {
    id: 12,
    name: "Sushi Day",
    cuisine: "Japanese • Sushi • Asian",
    img: "photo-1579871494447-9811cf80d66c",
    rating: 4.5,
    price: "₹900 for two",
    time: "40-45 mins",
    discount: "20% OFF up to ₹180",
    veg: false
  },
  {
    id: 13,
    name: "Saravana Bhavan",
    cuisine: "South Indian • Vegetarian",
    img: "photo-1589301760014-d929f3979dbc",
    rating: 4.6,
    price: "₹350 for two",
    time: "25-30 mins",
    discount: "Free Sweet with order",
    veg: true
  },
  {
    id: 14,
    name: "Burger King",
    cuisine: "Burgers • American • Fast Food",
    img: "photo-1571091718767-18b5b1457add",
    rating: 4.2,
    price: "₹450 for two",
    time: "25-30 mins",
    discount: "2 Medium Whopper Meals @ ₹599",
    veg: false
  },
  {
    id: 15,
    name: "Krispy Kreme",
    cuisine: "Donuts • Desserts • Beverages",
    img: "photo-1527904324834-3bda86da6771",
    rating: 4.4,
    price: "₹300 for two",
    time: "25-30 mins",
    discount: "Buy 6 Get 6 Free",
    veg: true
  },
  {
    id: 16,
    name: "Punjab Grill",
    cuisine: "North Indian • Punjabi • Kebab",
    img: "photo-1546833999-b9f581a1996d",
    rating: 4.5,
    price: "₹800 for two",
    time: "35-40 mins",
    discount: "15% OFF up to ₹150",
    veg: false
  }
];

const topOffers = [
  {
    id: 1,
    title: "50% OFF",
    description: "Up to ₹100 | Use code WELCOME50",
    img: "photo-1484659619207-9165d119dafe",
    code: "WELCOME50"
  },
  {
    id: 2,
    title: "FREE DELIVERY",
    description: "On orders above ₹199",
    img: "photo-1530554764233-e79e16c91d08"
  },
  {
    id: 3,
    title: "20% OFF",
    description: "Up to ₹150 | Use code PARTY20",
    img: "photo-1618160702438-9b02ab6515c9",
    code: "PARTY20"
  }
];

// Map images for different cities
const cityMapImages = {
  "Bangalore": "photo-1596176530529-78163a4f7af2",
  "Mumbai": "photo-1529253355930-ddbe423a2ac7",
  "Delhi": "photo-1587474260584-136574528ed5",
  "Hyderabad": "photo-1572487041120-d0fca4002557",
  "Chennai": "photo-1582510003544-4d00b7f74220",
  "Kolkata": "photo-1558431382-27e303142255",
  "Pune": "photo-1625493236795-1afbc950111c",
  "Ahmedabad": "photo-1624954208558-9a463e16e765"
};

// Popular restaurants by city
const restaurantsByCity: {[key: string]: number[]} = {
  "Bangalore": [1, 2, 5, 6, 11],
  "Mumbai": [3, 9, 10, 14, 15],
  "Delhi": [4, 7, 12, 13, 16],
  "Hyderabad": [6, 11, 8, 7, 5],
  "Chennai": [2, 13, 10, 15, 7],
  "Kolkata": [3, 9, 14, 16, 8],
  "Pune": [1, 4, 9, 14, 5],
  "Ahmedabad": [4, 11, 10, 16, 13]
};

const Index = () => {
  const isMobile = useMobile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [likedRestaurants, setLikedRestaurants] = useState<number[]>([]);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState("Bangalore");
  const [showFastDeliveryDialog, setShowFastDeliveryDialog] = useState(false);
  const [showLiveTrackingDialog, setShowLiveTrackingDialog] = useState(false);
  const [showFreeDeliveryDialog, setShowFreeDeliveryDialog] = useState(false);
  const [showGreatOffersDialog, setShowGreatOffersDialog] = useState(false);
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [viewAllRestaurants, setViewAllRestaurants] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([100, 800]);
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState(60);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // List of available locations
  const locations = [
    "Bangalore", 
    "Mumbai", 
    "Delhi", 
    "Hyderabad", 
    "Chennai", 
    "Kolkata", 
    "Pune", 
    "Ahmedabad"
  ];

  // Location coordinates for the map (approximate for demo purposes)
  const locationCoordinates: {[key: string]: {lat: number, lng: number}} = {
    "Bangalore": {lat: 12.9716, lng: 77.5946},
    "Mumbai": {lat: 19.0760, lng: 72.8777},
    "Delhi": {lat: 28.7041, lng: 77.1025},
    "Hyderabad": {lat: 17.3850, lng: 78.4867},
    "Chennai": {lat: 13.0827, lng: 80.2707},
    "Kolkata": {lat: 22.5726, lng: 88.3639},
    "Pune": {lat: 18.5204, lng: 73.8567},
    "Ahmedabad": {lat: 23.0225, lng: 72.5714}
  };

  // Features data
  const featuresData = [
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Fast Delivery",
      description: "Get your food delivered in under 30 minutes",
      action: () => {
        setShowFastDeliveryDialog(true);
      }
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-primary" />,
      title: "Live Tracking",
      description: "Know where your order is at all times",
      action: () => {
        setShowLiveTrackingDialog(true);
      }
    },
    {
      icon: <Truck className="h-10 w-10 text-primary" />,
      title: "Free Delivery",
      description: "Free delivery on orders above ₹199",
      action: () => {
        setShowFreeDeliveryDialog(true);
      }
    },
    {
      icon: <Tag className="h-10 w-10 text-primary" />,
      title: "Great Offers",
      description: "Discounts and offers available every day",
      action: () => {
        setShowGreatOffersDialog(true);
      }
    },
    {
      icon: <Utensils className="h-10 w-10 text-primary" />,
      title: "Premium Quality",
      description: "Only the finest ingredients and best restaurants",
      action: () => {
        toast({
          title: "Premium Quality",
          description: "We partner with only the top-rated restaurants in each city."
        });
      }
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Top Rated",
      description: "Restaurants with highest customer satisfaction",
      action: () => {
        toast({
          title: "Top Rated",
          description: "Our ranking algorithm ensures you only see the best options."
        });
      }
    },
    {
      icon: <Coffee className="h-10 w-10 text-primary" />,
      title: "All Cuisines",
      description: "From local favorites to international dishes",
      action: () => {
        navigate("/search");
      }
    },
    {
      icon: <PenSquare className="h-10 w-10 text-primary" />,
      title: "Easy Reviews",
      description: "Leave feedback after every order",
      action: () => {
        toast({
          title: "Reviews System",
          description: "Your feedback helps us improve the service for everyone."
        });
      }
    }
  ];

  // Function to load map
  const loadMap = () => {
    if (mapContainerRef.current) {
      const cityImage = cityMapImages[selectedLocation] || "photo-1569336415962-a4bd9f69cd83";
      mapContainerRef.current.innerHTML = `
        <div class="relative w-full h-64 min-h-[16rem] overflow-hidden rounded-lg">
          <img 
            src="https://images.unsplash.com/${cityImage}?auto=format&fit=crop&q=80&w=800" 
            alt="Map of ${selectedLocation}" 
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="bg-white p-3 rounded-full shadow-lg animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
          </div>
          <div class="absolute bottom-4 left-4 bg-white py-1 px-3 rounded-full text-sm font-medium shadow">
            ${selectedLocation}
          </div>
          <div class="absolute top-4 right-4 bg-white p-2 rounded-lg shadow">
            <div class="flex items-center gap-1 text-xs">
              <span class="text-primary font-medium">${featuredRestaurants.length}</span>
              <span>Restaurants Available</span>
            </div>
          </div>
        </div>
        <div class="mt-3">
          <h4 class="font-medium text-sm mb-2">Popular in ${selectedLocation}:</h4>
          <div class="flex flex-wrap gap-2">
            ${generateRestaurantBadges(selectedLocation)}
          </div>
        </div>
      `;
      setMapLoaded(true);
    }
  };

  // Generate restaurant badges for the map
  const generateRestaurantBadges = (city: string) => {
    const cityRestaurants = restaurantsByCity[city] || [1, 2, 3, 4, 5];
    return cityRestaurants.map(id => {
      const restaurant = featuredRestaurants.find(r => r.id === id);
      if (restaurant) {
        return `<span class="bg-primary/10 text-primary text-xs rounded-full px-2 py-1">${restaurant.name}</span>`;
      }
      return '';
    }).join('');
  };

  // Load map for the location dialog
  useEffect(() => {
    if (showLocationMap) {
      // Add a small delay to ensure the DOM is ready
      setTimeout(() => {
        loadMap();
      }, 100);
    }
  }, [showLocationMap, selectedLocation]);

  // Ensure the map loads when the component unmounts and remounts
  useEffect(() => {
    // Clear on unmount to prevent memory leaks
    return () => {
      setMapLoaded(false);
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.isLoggedIn) {
        setIsLoggedIn(true);
        setUserName(parsedData.name);
      }
    }

    // Get liked restaurants from localStorage
    const savedLikes = localStorage.getItem('likedRestaurants');
    const likedIds = savedLikes ? JSON.parse(savedLikes) : [];
    setLikedRestaurants(likedIds);
    setFavoriteCount(likedIds.length);

    // Get saved location from localStorage
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }
  }, []);

  // Filter restaurants based on criteria
  const getFilteredRestaurants = () => {
    let filtered = [...featuredRestaurants];
    
    // Apply price range filter
    filtered = filtered.filter(restaurant => {
      const price = parseInt(restaurant.price.split('₹')[1].split(' ')[0]);
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Apply veg only filter
    if (showVegOnly) {
      filtered = filtered.filter(restaurant => restaurant.veg);
    }
    
    // Apply minimum rating filter
    if (minRating > 0) {
      filtered = filtered.filter(restaurant => restaurant.rating >= minRating);
    }
    
    // Apply delivery time filter
    filtered = filtered.filter(restaurant => {
      const maxTime = parseInt(restaurant.time.split('-')[1].split(' ')[0]);
      return maxTime <= deliveryTime;
    });
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(restaurant => 
        restaurant.name.toLowerCase().includes(query) || 
        restaurant.cuisine.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const handleLike = (restaurantId: number) => {
    const isAlreadyLiked = likedRestaurants.includes(restaurantId);
    let newLikedIds: number[];
    
    if (isAlreadyLiked) {
      newLikedIds = likedRestaurants.filter(id => id !== restaurantId);
      toast({
        title: "Removed from favorites",
        description: "Restaurant removed from your favorites",
      });
    } else {
      newLikedIds = [...likedRestaurants, restaurantId];
      toast({
        title: "Added to favorites",
        description: "Restaurant added to your favorites",
      });
    }
    
    setLikedRestaurants(newLikedIds);
    setFavoriteCount(newLikedIds.length);
    localStorage.setItem('likedRestaurants', JSON.stringify(newLikedIds));
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    localStorage.setItem('selectedLocation', location);
    toast({
      title: "Location Updated",
      description: `Your delivery location has been updated to ${location}`,
    });
    setMapLoaded(false);
    setTimeout(() => {
      loadMap();
    }, 500);
  };

  const handleFeatureAction = (featureTitle: string) => {
    switch(featureTitle) {
      case "Fast Delivery":
        toast({
          title: "Fast Delivery",
          description: "We prioritize speed! Order now to experience our fast delivery service."
        });
        break;
      case "Live Tracking":
        toast({
          title: "Live Tracking",
          description: "Track your order in real-time with our live tracking feature."
        });
        break;
      case "Free Delivery":
        toast({
          title: "Free Delivery",
          description: "Enjoy free delivery on orders above ₹199. No coupon needed!"
        });
        break;
      case "Great Offers":
        toast({
          title: "Great Offers",
          description: "Check out our offers page for the latest discounts and deals."
        });
        navigate("/offers");
        break;
      default:
        break;
    }
  };

  const handleShare = (platform: string) => {
    const shareUrl = window.location.href;
    const shareTitle = "Check out FoodApp - Food delivery in your city!";
    
    switch(platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, "_blank");
        break;
      case "whatsapp":
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`, "_blank");
        break;
      case "email":
        window.open(`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent("Check out this food delivery app: " + shareUrl)}`, "_blank");
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl)
          .then(() => {
            toast({
              title: "Link Copied",
              description: "Share link has been copied to clipboard",
            });
          })
          .catch(() => {
            toast({
              title: "Copy Failed",
              description: "Could not copy link to clipboard",
              variant: "destructive"
            });
          });
        break;
    }
    
    setShowShareDialog(false);
  };

  const resetFilters = () => {
    setPriceRange([100, 800]);
    setShowVegOnly(false);
    setMinRating(0);
    setDeliveryTime(60);
    setSearchQuery("");
    
    toast({
      title: "Filters Reset",
      description: "All filters have been reset to default values",
    });
  };

  const applyFilters = () => {
    setShowFilterDialog(false);
    
    toast({
      title: "Filters Applied",
      description: "Your restaurant filters have been applied",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xl font-bold text-primary">FoodApp</Link>
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center border rounded-full pl-3 pr-2 py-1 gap-2 text-muted-foreground cursor-pointer hover:bg-gray-50">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">{selectedLocation}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0">
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Select your location</p>
                  <div className="space-y-1">
                    {locations.map((location) => (
                      <Button
                        key={location}
                        variant={selectedLocation === location ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleLocationChange(location)}
                      >
                        {location}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowLocationMap(true)}
                    >
                      View on Map
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Search Input */}
          <div className="hidden md:flex relative w-full max-w-md mx-4">
            <Input
              placeholder="Search for restaurants, cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Mobile menu button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          )}

          {/* Desktop navigation */}
          {!isMobile && (
            <nav className="flex items-center gap-6">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-4">
                <button 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowFilterDialog(true)}
                >
                  <Filter className="h-5 w-5" />
                </button>
                <button 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowShareDialog(true)}
                >
                  <Share2 className="h-5 w-5" />
                </button>
                <Link to="/favorites" className="relative">
                  <Heart className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                  {favoriteCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {favoriteCount > 9 ? '9+' : favoriteCount}
                    </span>
                  )}
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <section className="container mx-auto px-4 pt-8 pb-16">
          <h1 className="text-3xl font-bold mb-8">Food delivery in {selectedLocation}</h1>
          
          {/* Top Offers */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Top Offers</h2>
              <Link to="/offers" className="text-primary flex items-center gap-1 text-sm">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topOffers.map((offer) => (
                <Card key={offer.id} className="hover-scale">
                  <div className="relative h-40 overflow-hidden rounded-t-lg">
                    <img 
                      src={`https://images.unsplash.com/${offer.img}?auto=format&fit=crop&q=80&w=600`} 
                      alt={offer.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                      <div>
                        <h3 className="text-white text-xl font-bold">{offer.title}</h3>
                        <p className="text-white/80 text-sm">{offer.description}</p>
                      </div>
                    </div>
                  </div>
                  <CardFooter className="justify-between items-center">
                    {offer.code ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">{offer.code}</Badge>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-7"
                          onClick={() => {
                            navigator.clipboard.writeText(offer.code || "");
                            toast({
                              title: "Code Copied",
                              description: `${offer.code} has been copied to clipboard`
                            });
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No code needed</span>
                    )}
                    <Button variant="ghost" size="sm" className="h-7">
                      Use Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Popular Cuisines */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Popular Cuisines</h2>
              <Link to="/search" className="text-primary flex items-center gap-1 text-sm">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {popularCuisines.map((cuisine) => (
                <Link 
                  key={cuisine.name} 
                  to={cuisine.path}
                  className="hover-scale block"
                >
                  <div className="relative rounded-lg overflow-hidden h-24 group">
                    <img 
                      src={`https://images.unsplash.com/${cuisine.image}?auto=format&fit=crop&q=80&w=300`} 
                      alt={cuisine.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-medium">{cuisine.name}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Featured Restaurants */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Featured Restaurants</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                  onClick={() => setShowFilterDialog(true)}
                >
                  <Filter className="h-4 w-4 mr-1" /> Filters
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8"
                  onClick={() => setViewAllRestaurants(!viewAllRestaurants)}
                >
                  {viewAllRestaurants ? "Show Less" : "View All"}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(viewAllRestaurants ? getFilteredRestaurants() : getFilteredRestaurants().slice(0, 8)).map((restaurant) => (
                <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
                  <Card className="overflow-hidden h-full hover-scale">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/${restaurant.img}?auto=format&fit=crop&q=80&w=500`} 
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLike(restaurant.id);
                        }}
                      >
                        <Heart 
                          className={`h-4 w-4 ${likedRestaurants.includes(restaurant.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                        />
                      </Button>
                      {restaurant.discount && (
                        <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                          {restaurant.discount}
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
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            {getFilteredRestaurants().length === 0 && (
              <div className="text-center py-8">
                <div className="mb-3 text-muted-foreground">
                  <Compass className="h-12 w-12 mx-auto mb-2" />
                  <h3 className="text-lg font-medium">No restaurants found</h3>
                </div>
                <p className="mb-4 text-muted-foreground">Try adjusting your filters to find restaurants.</p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            )}
            
            {!viewAllRestaurants && getFilteredRestaurants().length > 8 && (
              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setViewAllRestaurants(true)}
                >
                  View All Restaurants <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Features Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-center mb-10">Why Choose FoodApp</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuresData.slice(0, 4).map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-6 text-center hover-scale shadow-sm cursor-pointer"
                  onClick={feature.action}
                >
                  <div className="mx-auto mb-4 inline-flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">FoodApp</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Order food from the best restaurants and shops in your area
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                <li><Link to="/help" className="text-muted-foreground hover:text-foreground">Help & Support</Link></li>
                <li><Link to="/partner" className="text-muted-foreground hover:text-foreground">Partner with us</Link></li>
                <li><Link to="/ride" className="text-muted-foreground hover:text-foreground">Become a Rider</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="text-muted-foreground hover:text-foreground">Cookie Policy</Link></li>
                <li><Link to="/help" className="text-muted-foreground hover:text-foreground">Dispute Resolution</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Install App</h3>
              <p className="text-sm text-muted-foreground mb-4">Get the FoodApp mobile app for faster ordering</p>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="justify-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z"/>
                    <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z"/>
                  </svg>
                  App Store
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M14.222 9.374c1.037-.61 1.037-2.137 0-2.748L11.528 5.04 8.32 8l3.207 2.96 2.694-1.586Zm-3.595 2.116L7.583 8.68 1.03 14.73c.201.202.416.371.647.5l9.396-4.147c1.037-.61 2.665-.61 3.702 0l.646.386-3.193-1.868-1.601.937Zm-.299-9.438-9.396-4.148c-.231.129-.446.298-.647.5l6.553 6.05 3.044-2.81-2.694-1.586c-.376-.221-.777-.336-1.182-.339-.401.003-.802.118-1.179.339l-2.695 1.586L1.696.732c-.201.201-.415.37-.646.499l9.395 4.143c1.037.61 1.037 2.137 0 2.748l-3.193 1.873 3.195 2.949c.53.309 1.131.51 1.729.51s1.198-.2 1.729-.51l.646-.386-3.193-2.946 3.193-1.87c1.037-.611 1.037-2.137 0-2.747l-.646-.387Zm-6.3-3.448 9.395 4.147c.231-.129.445-.298.646-.499l-6.553-6.051-3.044 2.81 2.694 1.587c.23.132.488.204.752.208.264-.004.522-.076.752-.208l2.694-1.587-1.93-1.78c-.23-.132-.487-.205-.751-.209-.265.004-.522.077-.752.21l-3.294 1.928c-.231.129-.445.298-.646.499Zm-2.021 5.708-1.179.689 9.395 4.147c.201-.201.416-.37.646-.499l-6.553-6.05-2.309 1.713Z"/>
                  </svg>
                  Play Store
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} FoodApp. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Restaurants</DialogTitle>
            <DialogDescription>
              Customize your search preferences to find the perfect restaurant
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Price Range</h4>
              <div className="px-2">
                <Slider
                  defaultValue={priceRange}
                  min={100}
                  max={1000}
                  step={50}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="veg-only">Vegetarian Only</Label>
                <div className="text-sm text-muted-foreground">
                  Show only vegetarian restaurants
                </div>
              </div>
              <Switch
                id="veg-only"
                checked={showVegOnly}
                onCheckedChange={setShowVegOnly}
              />
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3">Minimum Rating</h4>
              <div className="flex justify-between gap-2">
                {[0, 3.5, 4.0, 4.5].map((rating) => (
                  <Button
                    key={rating}
                    variant={minRating === rating ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setMinRating(rating)}
                  >
                    {rating === 0 ? 'Any' : rating+'+'}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3">Delivery Time (up to {deliveryTime} min)</h4>
              <div className="px-2">
                <Slider
                  defaultValue={[deliveryTime]}
                  min={15}
                  max={60}
                  step={5}
                  value={[deliveryTime]}
                  onValueChange={(value) => setDeliveryTime(value[0])}
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>15 min</span>
                  <span>60 min</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-between">
            <Button variant="outline" onClick={resetFilters}>Reset</Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share FoodApp</DialogTitle>
            <DialogDescription>
              Share this app with your friends and family
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => handleShare("facebook")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
              </svg>
              Facebook
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => handleShare("twitter")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
              </svg>
              Twitter
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => handleShare("whatsapp")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              WhatsApp
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => handleShare("email")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
              </svg>
              Email
            </Button>
          </div>
          <Button variant="default" className="w-full" onClick={() => handleShare("copy")}>
            Copy Link
          </Button>
        </DialogContent>
      </Dialog>

      {/* Location Map Dialog */}
      <Dialog open={showLocationMap} onOpenChange={setShowLocationMap}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delivery Area</DialogTitle>
            <DialogDescription>
              Viewing delivery area for {selectedLocation}
            </DialogDescription>
          </DialogHeader>
          <div ref={mapContainerRef} className="min-h-[300px] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-primary/20 h-16 w-16 flex items-center justify-center mb-3">
                <MapPin className="h-8 w-8 text-primary/50" />
              </div>
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          </div>
          <div className="flex justify-between gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowLocationMap(false)}>
              Close
            </Button>
            <Button onClick={() => {
              navigate('/search');
              setShowLocationMap(false);
            }}>
              Browse Restaurants
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fast Delivery Dialog */}
      <Dialog open={showFastDeliveryDialog} onOpenChange={setShowFastDeliveryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fast Delivery</DialogTitle>
            <DialogDescription>
              Get your food delivered in under 30 minutes
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg overflow-hidden mb-4">
              <img 
                src="https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&q=80&w=500" 
                alt="Fast Delivery" 
                className="w-full"
              />
            </div>
            <p className="text-muted-foreground mb-4">
              Our dedicated delivery fleet ensures your food arrives hot and fresh. 
              We prioritize speed without compromising on quality.
            </p>
            <div className="space-y-2">
              <div className="flex gap-2 items-start">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <span className="font-medium">30-Minute Guarantee</span>
                  <p className="text-sm text-muted-foreground">On select restaurants within 5km radius</p>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <Bike className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <span className="font-medium">Live Tracking</span>
                  <p className="text-sm text-muted-foreground">Follow your order in real-time until delivery</p>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowFastDeliveryDialog(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Live Tracking Dialog */}
      <Dialog open={showLiveTrackingDialog} onOpenChange={setShowLiveTrackingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Live Order Tracking</DialogTitle>
            <DialogDescription>
              Know where your order is at all times
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg overflow-hidden mb-4">
              <img 
                src="https://images.unsplash.com/photo-1595246008861-d2bc8d2de816?auto=format&fit=crop&q=80&w=500" 
                alt="Live Tracking" 
                className="w-full"
              />
            </div>
            <p className="text-muted-foreground mb-4">
              Our real-time tracking system allows you to monitor every step of your order, 
              from restaurant preparation to delivery at your doorstep.
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Order Confirmed</h4>
                  <p className="text-sm text-muted-foreground">Restaurant receives and confirms your order</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Preparation</h4>
                  <p className="text-sm text-muted-foreground">Your food is being prepared fresh</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Out for Delivery</h4>
                  <p className="text-sm text-muted-foreground">Rider is on the way with your order</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-medium">Delivered</h4>
                  <p className="text-sm text-muted-foreground">Food delivered to your doorstep</p>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowLiveTrackingDialog(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Free Delivery Dialog */}
      <Dialog open={showFreeDeliveryDialog} onOpenChange={setShowFreeDeliveryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Free Delivery</DialogTitle>
            <DialogDescription>
              Free delivery on orders above ₹199
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg overflow-hidden mb-4">
              <img 
                src="https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=500" 
                alt="Free Delivery" 
                className="w-full"
              />
            </div>
            <p className="text-muted-foreground mb-4">
              Enjoy free delivery on all orders above ₹199. No code needed - discount applies automatically at checkout.
            </p>
            <div className="bg-primary/10 rounded-lg p-4">
              <h4 className="text-primary font-medium mb-2">Delivery Fee Structure</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Order below ₹199</span>
                  <span className="font-medium">₹35 - ₹45</span>
                </li>
                <li className="flex justify-between">
                  <span>Order ₹199 - ₹399</span>
                  <span className="font-medium">₹15</span>
                </li>
                <li className="flex justify-between text-primary">
                  <span>Order above ₹399</span>
                  <span className="font-medium">FREE</span>
                </li>
              </ul>
            </div>
          </div>
          <Button onClick={() => navigate("/search")}>
            Order Now
          </Button>
        </DialogContent>
      </Dialog>

      {/* Great Offers Dialog */}
      <Dialog open={showGreatOffersDialog} onOpenChange={setShowGreatOffersDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Great Offers</DialogTitle>
            <DialogDescription>
              Discounts and offers available every day
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg overflow-hidden mb-4">
              <img 
                src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&q=80&w=500" 
                alt="Offers" 
                className="w-full"
              />
            </div>
            <p className="text-muted-foreground mb-4">
              Take advantage of our exclusive offers and discounts to save on your favorite meals.
            </p>
            <div className="space-y-4">
              {topOffers.map((offer) => (
                <div key={offer.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{offer.title}</h4>
                    {offer.code && (
                      <Badge variant="outline" className="text-xs font-mono">{offer.code}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      if (offer.code) {
                        navigator.clipboard.writeText(offer.code);
                        toast({
                          title: "Code Copied",
                          description: `${offer.code} has been copied to clipboard`
                        });
                      }
                      setShowGreatOffersDialog(false);
                      navigate("/search");
                    }}
                  >
                    {offer.code ? "Use Code" : "Use Offer"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={() => navigate("/offers")}>
            View All Offers
          </Button>
        </DialogContent>
      </Dialog>

      {/* Mobile menu drawer */}
      {isMobile && (
        <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className={`absolute top-0 right-0 h-full w-4/5 max-w-xs bg-white transition-transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg">Menu</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="space-y-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Separator />
                <div className="pt-2">
                  <div className="text-sm text-muted-foreground mb-2">Useful Links</div>
                  <div className="space-y-4">
                    <Link
                      to="/about"
                      className="block py-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      About Us
                    </Link>
                    <Link
                      to="/help"
                      className="block py-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Help & Support
                    </Link>
                    {isLoggedIn ? (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          localStorage.removeItem('user');
                          setIsLoggedIn(false);
                          setUserName("");
                          setIsMobileMenuOpen(false);
                          toast({
                            title: "Logged Out",
                            description: "You have been logged out successfully",
                          });
                        }}
                      >
                        Log Out
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button 
                          variant="default" 
                          className="w-full"
                          onClick={() => {
                            navigate("/signin");
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Sign In
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            navigate("/signup");
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Sign Up
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
