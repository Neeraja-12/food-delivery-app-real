import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  Clock, 
  Bike, 
  MapPin, 
  Info, 
  ShoppingBag, 
  X,
  Plus,
  Minus,
  ChevronDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { RestaurantAvailability } from '@/components/RestaurantAvailability';
import { RestaurantService } from '@/services/restaurant-service';
import { PlaceOrderDemo } from '@/components/PlaceOrderDemo';
import { useLocationTracking } from '@/hooks/use-location-tracking';
import LazyImage from '@/components/LazyImage';

// Food category images mapping
const foodImages = {
  "bestsellers": [
    "photo-1565299624946-b28f40a0ae38", // Pizza
    "photo-1513104890138-7c749659a591", // Burger
    "photo-1568901346375-23c9450c58cd", // Sandwich
    "photo-1598811465391-a217e9a0249c", // Chicken
    "photo-1576506295286-5cda18df43e7"  // Paneer
  ],
  "starters": [
    "photo-1587314168485-3236d6710101", // Salad
    "photo-1530062845289-9109b2c9c868", // Pakora
    "photo-1625938144207-7190ada8853d", // Spring Roll
    "photo-1601050690597-df0568f70950", // Chilli Chicken
    "photo-1606491956689-2ea866880c84"  // Aloo Tikki
  ],
  "main": [
    "photo-1604152135912-04a022e73eca", // Curry
    "photo-1589647363207-f57283bf541f", // Kadai Paneer
    "photo-1615361200141-f45961202b75", // Malai Kofta
    "photo-1556694795-b6423d3d5f14", // Palak Paneer
    "photo-1546833998-877b37c2e3c4"  // Chicken Curry
  ],
  "bread": [
    "photo-1619535860434-bb174fe72b21", // Naan
    "photo-1602273660127-a0000560a4c1", // Roti
    "photo-1605300287659-76fe93273d38", // Paratha
    "photo-1602273660127-a0000560a4c1", // Kulcha
    "photo-1619535860434-bb174fe72b21"  // Butter Naan
  ],
  "rice": [
    "photo-1593584785033-9c7604d0863f", // Biryani
    "photo-1575606752743-f08381ee7cdf", // Jeera Rice
    "photo-1572453800999-e8d2d1589b7c", // Veg Pulao
    "photo-1612444530582-fc66183b16f0", // Fried Rice
    "photo-1617388410258-329736ad6aca"  // Special Rice
  ],
  "desserts": [
    "photo-1595295333158-4742f28fbd85", // Ice cream
    "photo-1605859465655-84c45e14a0af", // Gulab Jamun
    "photo-1606341909662-577979bc5eb9", // Rasgulla
    "photo-1549395160-0a8a19dfdd90", // Kheer
    "photo-1571115177098-24ec42ed204d"  // Gajar Halwa
  ],
  "beverages": [
    "photo-1544787219-7f47ccb76574", // Coffee
    "photo-1555949940-796a97a62d83", // Lassi
    "photo-1563203369-26f2e4a5ccf7", // Cola
    "photo-1556679343-c1306ee3277b", // Chai
    "photo-1513558161293-cdaf765ed2fd"  // Fresh Lime
  ]
};

// Mock menu categories
const menuCategories = [
  { id: "bestsellers", name: "Bestsellers" },
  { id: "starters", name: "Starters" },
  { id: "main", name: "Main Course" },
  { id: "bread", name: "Breads" },
  { id: "rice", name: "Rice & Biryani" },
  { id: "desserts", name: "Desserts" },
  { id: "beverages", name: "Beverages" }
];

// Generate mock menu items for each category with proper food images
const generateMenuItems = (categoryId: string) => {
  const count = Math.floor(Math.random() * 6) + 4; // 4-10 items per category
  const items = [];
  
  const itemNames: {[key: string]: string[]} = {
    "bestsellers": ["Butter Chicken", "Paneer Tikka", "Chicken Biryani", "Dal Makhani", "Garlic Naan"],
    "starters": ["Chicken 65", "Paneer Pakora", "Veg Spring Roll", "Chilli Chicken", "Aloo Tikki"],
    "main": ["Butter Chicken", "Kadai Paneer", "Chicken Curry", "Malai Kofta", "Palak Paneer"],
    "bread": ["Butter Naan", "Garlic Naan", "Roti", "Paratha", "Kulcha"],
    "rice": ["Jeera Rice", "Veg Pulao", "Chicken Biryani", "Mutton Biryani", "Egg Fried Rice"],
    "desserts": ["Gulab Jamun", "Rasgulla", "Kheer", "Ice Cream", "Gajar Halwa"],
    "beverages": ["Mango Lassi", "Sweet Lassi", "Cold Coffee", "Masala Chai", "Fresh Lime Soda"]
  };
  
  const baseNames = itemNames[categoryId] || itemNames.bestsellers;
  const images = foodImages[categoryId as keyof typeof foodImages] || foodImages.bestsellers;
  
  for (let i = 0; i < count; i++) {
    const isVeg = Math.random() < 0.5;
    const name = baseNames[i % baseNames.length] + (i >= baseNames.length ? ` ${Math.floor(i / baseNames.length) + 1}` : '');
    const imageIndex = i % images.length;
    
    items.push({
      id: parseInt(`${menuCategories.findIndex(c => c.id === categoryId)}${i}`),
      name: name,
      description: `Delicious ${name.toLowerCase()} prepared with finest ingredients and authentic spices.`,
      price: `₹${Math.floor(Math.random() * 300) + 100}`,
      isVeg: isVeg,
      isSpicy: Math.random() < 0.3,
      isPopular: Math.random() < 0.2,
      image: images[imageIndex]
    });
  }
  
  return items;
};

// Create menuItems outside the component to avoid initialization issues
const menuItems = {
  bestsellers: generateMenuItems("bestsellers"),
  starters: generateMenuItems("starters"),
  main: generateMenuItems("main"),
  bread: generateMenuItems("bread"),
  rice: generateMenuItems("rice"),
  desserts: generateMenuItems("desserts"),
  beverages: generateMenuItems("beverages")
};

// Helper function to get a menu item by ID
const getMenuItemById = (id: number) => {
  for (const category in menuItems) {
    const foundItem = menuItems[category as keyof typeof menuItems].find(item => item.id === id);
    if (foundItem) return foundItem;
  }
  return null;
};

const RestaurantMenu = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bestsellers");
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const location = useLocationTracking();

  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    
    // Fetch restaurant details
    RestaurantService.getRestaurantById(parseInt(id))
      .then(details => {
        setRestaurant(details);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to get restaurant details:", error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to load restaurant details",
          variant: "destructive"
        });
      });
  }, [id]);

  const handleAddToCart = (item: any) => {
    setCart(prevCart => ({
      ...prevCart,
      [item.id]: (prevCart[item.id] || 0) + 1
    }));
    
    toast({
      title: "Added to Cart",
      description: `${item.name} added to your order`,
    });
  };
  
  const handleRemoveFromCart = (itemId: number) => {
    setCart(prevCart => {
      const currentQty = prevCart[itemId];
      if (currentQty <= 1) {
        const newCart = {...prevCart};
        delete newCart[itemId];
        return newCart;
      }
      return {
        ...prevCart,
        [itemId]: currentQty - 1
      };
    });
    
    toast({
      title: "Updated Cart",
      description: "Your order has been updated",
    });
  };
  
  const handlePlaceOrder = () => {
    // Navigate to cart page with current cart and menu items
    navigate('/cart', {
      state: {
        cart,
        menuItems,
        restaurantId: restaurant?.id,
        restaurantName: restaurant?.name
      }
    });
  };
  
  // Calculate cart total
  const cartItems = Object.entries(cart).map(([id, quantity]) => {
    const item = getMenuItemById(parseInt(id));
    return {
      ...item,
      quantity
    };
  });
  
  const cartTotal = cartItems.reduce((total, item) => {
    if (!item) return total;
    return total + (parseInt(item.price.replace('₹', '')) * item.quantity);
  }, 0);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-4">
            <Skeleton className="h-8 w-24" />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <Skeleton className="h-56 w-full" />
            
            <div className="p-6">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-24 w-24 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="text-red-500 mb-4">
            <X className="h-12 w-12 mx-auto mb-2" />
            <h2 className="text-xl font-bold">Restaurant Not Found</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            The restaurant you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto max-w-4xl p-4">
          <Link to="/" className="flex items-center text-muted-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Restaurants
          </Link>
          
          <div className="relative rounded-lg overflow-hidden h-56 mb-4">
            <img 
              src={`https://images.unsplash.com/${restaurant.img}?auto=format&fit=crop&q=80&w=1200`} 
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
            >
              <Heart className="h-4 w-4 text-muted-foreground" />
            </Button>
            
            {restaurant.discount && (
              <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                {restaurant.discount}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl font-bold">{restaurant.name}</h1>
              <div className="flex items-center px-2 py-1 bg-green-50 text-green-700 rounded">
                <Star className="h-4 w-4 fill-green-600 text-green-600 mr-1" /> 
                <span className="font-medium">{restaurant.rating}</span>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-2">{restaurant.cuisine}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {location.latitude && location.longitude ? 
                    `${location.getDistanceFrom(restaurant.coordinates.lat, restaurant.coordinates.lng)}km away` : 
                    'Distance not available'}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>{restaurant.time}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Info className="h-4 w-4 mr-1" />
                <span>{restaurant.price}</span>
              </div>
            </div>
            
            {/* Restaurant Availability Component */}
            <RestaurantAvailability 
              isOpen={restaurant.isOpen}
              busyLevel={restaurant.busyLevel}
              estimatedDeliveryTime={restaurant.estimatedDeliveryTime}
            />
          </div>
        </div>
      </div>
      
      {/* Menu Section */}
      <div className="container mx-auto max-w-4xl p-4">
        <div className="bg-white rounded-lg shadow-sm">
          <Tabs defaultValue="bestsellers" value={activeTab} onValueChange={setActiveTab}>
            <div className="overflow-x-auto">
              <TabsList className="w-full justify-start p-0 h-auto bg-transparent border-b rounded-none">
                {menuCategories.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {menuCategories.map(category => (
              <TabsContent key={category.id} value={category.id} className="p-4">
                <h3 className="text-lg font-semibold mb-4">{category.name}</h3>
                
                <div className="space-y-6">
                  {menuItems[category.id as keyof typeof menuItems].map(item => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{item.name}</h4>
                          {item.isVeg ? (
                            <div className="border border-green-500 p-0.5">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                          ) : (
                            <div className="border border-red-500 p-0.5">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            </div>
                          )}
                          {item.isPopular && (
                            <Badge variant="outline" className="text-xs h-5 px-1 bg-orange-50 text-orange-700 border-orange-200">
                              Bestseller
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <p className="font-medium">{item.price}</p>
                        
                        {/* Add to cart button */}
                        {cart[item.id] ? (
                          <div className="inline-flex items-center border rounded-md overflow-hidden mt-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-none"
                              onClick={() => handleRemoveFromCart(item.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">
                              {cart[item.id] || 0}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-none"
                              onClick={() => handleAddToCart(item)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => handleAddToCart(item)}
                          >
                            Add
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0 w-24 h-24 rounded overflow-hidden">
                        <LazyImage 
                          src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&q=80&w=100`} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      
      {/* Place order section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md p-4">
        <div className="container mx-auto max-w-4xl">
          {Object.keys(cart).length > 0 ? (
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">
                  {Object.keys(cart).length} {Object.keys(cart).length === 1 ? 'item' : 'items'} | ₹{cartTotal}
                </div>
                <button className="text-sm text-muted-foreground flex items-center">
                  View cart details <ChevronDown className="h-4 w-4 ml-1" />
                </button>
              </div>
              
              <Button
                onClick={handlePlaceOrder}
                className="py-6"
              >
                Place Order
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Add items to your cart to place an order</p>
              <PlaceOrderDemo 
                restaurantId={restaurant.id}
                restaurantName={restaurant.name}
                buttonText="Try Demo Order"
                variant="outline"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Add some spacing at the bottom for the fixed order section */}
      <div className="h-20"></div>
    </div>
  );
};

export default RestaurantMenu;
