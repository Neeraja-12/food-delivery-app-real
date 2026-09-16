
import { toast } from "@/hooks/use-toast";

// Types for restaurant data
export interface RestaurantDetails {
  id: number;
  name: string;
  cuisine: string;
  img: string;
  rating: number;
  price: string;
  time: string;
  discount?: string;
  veg: boolean;
  isOpen: boolean;
  busyLevel: 'low' | 'medium' | 'high';
  estimatedDeliveryTime: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface RestaurantCache {
  [id: number]: {
    data: RestaurantDetails;
    timestamp: number;
  };
}

// In-memory cache for restaurant data
const restaurantCache: RestaurantCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// This would normally connect to a backend service
export class RestaurantService {
  static getRestaurantById(id: number): Promise<RestaurantDetails> {
    // Check if we have a fresh cached version
    const cached = restaurantCache[id];
    const now = Date.now();
    
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      console.log(`Using cached data for restaurant ${id}`);
      return Promise.resolve(cached.data);
    }
    
    console.log(`Fetching fresh data for restaurant ${id}`);
    
    // Simulate API request delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // This would be a real API call in production
        const restaurant = this.generateMockRestaurantDetails(id);
        
        // Update cache
        restaurantCache[id] = {
          data: restaurant,
          timestamp: now
        };
        
        resolve(restaurant);
      }, 800);
    });
  }
  
  static getMultipleRestaurants(ids: number[]): Promise<RestaurantDetails[]> {
    // Create an array of promises for each restaurant
    const promises = ids.map(id => this.getRestaurantById(id));
    
    // Wait for all promises to resolve
    return Promise.all(promises);
  }
  
  static getNearbyRestaurants(lat: number, lng: number, radius: number = 5): Promise<RestaurantDetails[]> {
    // In a real app, this would call a geospatial search API
    console.log(`Searching for restaurants near ${lat},${lng} within ${radius}km`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock response with 5-10 restaurants
        const count = Math.floor(Math.random() * 6) + 5;
        const restaurants: RestaurantDetails[] = [];
        
        for (let i = 0; i < count; i++) {
          const id = Math.floor(Math.random() * 100) + 1;
          restaurants.push(this.generateMockRestaurantDetails(id, lat, lng, radius));
        }
        
        resolve(restaurants);
      }, 1200);
    });
  }
  
  static placeOrder(restaurantId: number, items: any[], address: string): Promise<{ orderId: string, estimatedTime: number }> {
    console.log(`Placing order at restaurant ${restaurantId}:`, items);
    
    return new Promise((resolve, reject) => {
      // 10% chance of order failure to simulate real-world issues
      if (Math.random() < 0.1) {
        setTimeout(() => {
          reject(new Error("Restaurant is too busy to accept your order right now. Please try again."));
          
          toast({
            title: "Order Failed",
            description: "Restaurant is too busy right now. Please try again.",
            variant: "destructive"
          });
        }, 1500);
        return;
      }
      
      // Successful order
      setTimeout(() => {
        const orderId = `ORD-${Date.now().toString().substring(7)}`;
        const estimatedTime = Math.floor(Math.random() * 20) + 25; // 25-45 minutes
        
        toast({
          title: "Order Placed Successfully!",
          description: `Your order #${orderId} will arrive in about ${estimatedTime} minutes.`
        });
        
        resolve({
          orderId,
          estimatedTime
        });
      }, 2000);
    });
  }
  
  static trackOrder(orderId: string): Promise<{ status: string, currentLocation: { lat: number, lng: number }, minutesAway: number }> {
    console.log(`Tracking order ${orderId}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock tracking data
        const statuses = ["Preparing", "Ready for pickup", "Out for delivery", "Nearby"];
        const randomIndex = Math.floor(Math.random() * statuses.length);
        
        resolve({
          status: statuses[randomIndex],
          currentLocation: {
            lat: 12.9716 + (Math.random() - 0.5) * 0.1,
            lng: 77.5946 + (Math.random() - 0.5) * 0.1
          },
          minutesAway: Math.floor(Math.random() * 30) + 5
        });
      }, 1000);
    });
  }
  
  // Helper method to generate mock restaurant data
  private static generateMockRestaurantDetails(id: number, nearLat?: number, nearLng?: number, radius?: number): RestaurantDetails {
    const baseNames = [
      "Tasty Bites", "Spice Route", "Urban Kitchen", "Fresh Plate", 
      "Flavor Town", "Green Garden", "Bangkok Wok", "Pizza Palace",
      "Burger Joint", "Sushi Express", "Taco Heaven", "Noodle House"
    ];
    
    const cuisines = [
      "Italian", "Chinese", "Mexican", "Indian", "Thai", 
      "Japanese", "American", "Mediterranean", "Korean"
    ];
    
    // Generate a name based on ID or pick randomly
    const name = id <= baseNames.length 
      ? baseNames[id - 1] 
      : `${baseNames[id % baseNames.length]} ${Math.floor(id / baseNames.length)}`;
    
    // Pick 1-3 cuisine types
    const cuisineCount = Math.floor(Math.random() * 3) + 1;
    const selectedCuisines = [];
    for (let i = 0; i < cuisineCount; i++) {
      const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
      if (!selectedCuisines.includes(cuisine)) {
        selectedCuisines.push(cuisine);
      }
    }
    
    // Random coordinates, close to provided location if given
    const lat = nearLat 
      ? nearLat + (Math.random() - 0.5) * (radius || 0.1) * 0.02 
      : 12.9716 + (Math.random() - 0.5) * 0.1;
    
    const lng = nearLng 
      ? nearLng + (Math.random() - 0.5) * (radius || 0.1) * 0.02 
      : 77.5946 + (Math.random() - 0.5) * 0.1;
    
    // Random busy level
    const busyLevels: ['low', 'medium', 'high'] = ['low', 'medium', 'high'];
    const busyLevel = busyLevels[Math.floor(Math.random() * busyLevels.length)];
    
    // Based on busy level, determine estimated delivery time
    let baseTime = 0;
    switch(busyLevel) {
      case 'low': baseTime = 20; break;
      case 'medium': baseTime = 30; break;
      case 'high': baseTime = 40; break;
    }
    
    const timeVariation = Math.floor(Math.random() * 10);
    const estimatedDeliveryTime = baseTime + timeVariation;
    
    // 90% chance of being open
    const isOpen = Math.random() < 0.9;
    
    // Price level
    const priceLevel = Math.floor(Math.random() * 4) + 1;
    const price = `₹${priceLevel * 100} for two`;
    
    // Random image (would be actual food images in real app)
    const imageIds = [
      "photo-1504674900247-0877df9cc836",
      "photo-1517248135467-4c7edcad34c4",
      "photo-1552566626-52f8b828add9",
      "photo-1496412705862-e0088f16f791",
      "photo-1555396273-367ea4eb4db5",
      "photo-1566843972142-a7fcb70de55a",
      "photo-1559847844-5315695dadae",
      "photo-1565299624946-b28f40a0ae38"
    ];
    
    const img = imageIds[Math.floor(Math.random() * imageIds.length)];
    
    // Random rating 3.5-5.0
    const rating = Math.floor(Math.random() * 15 + 35) / 10;
    
    // 30% chance of being vegetarian
    const veg = Math.random() < 0.3;
    
    // 60% chance of having a discount
    const hasDiscount = Math.random() < 0.6;
    let discount;
    
    if (hasDiscount) {
      const discountTypes = [
        "10% OFF up to ₹100",
        "20% OFF up to ₹150",
        "Buy 1 Get 1 Free",
        "Free Delivery",
        "50% OFF on selected items"
      ];
      
      discount = discountTypes[Math.floor(Math.random() * discountTypes.length)];
    }
    
    // Delivery time range
    const minTime = Math.floor(estimatedDeliveryTime * 0.8);
    const maxTime = Math.floor(estimatedDeliveryTime * 1.2);
    const time = `${minTime}-${maxTime} mins`;
    
    return {
      id,
      name,
      cuisine: selectedCuisines.join(" • "),
      img,
      rating,
      price,
      time,
      discount,
      veg,
      isOpen,
      busyLevel,
      estimatedDeliveryTime,
      coordinates: { lat, lng }
    };
  }
}
