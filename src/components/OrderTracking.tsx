
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Check, X, Package, Truck, Home } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRealTime } from '@/hooks/use-real-time';
import { RestaurantService } from '@/services/restaurant-service';
import { toast } from '@/hooks/use-toast';

interface OrderTrackingProps {
  orderId: string;
  restaurantId: number;
  deliveryAddress: string;
  items: Array<{id: number, name: string, quantity: number, price: number}>;
  onCancel?: () => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ 
  orderId, 
  restaurantId, 
  deliveryAddress,
  items,
  onCancel
}) => {
  const [orderStatus, setOrderStatus] = useState<string>("Order Confirmed");
  const [progress, setProgress] = useState<number>(10);
  const [minutesRemaining, setMinutesRemaining] = useState<number | null>(null);
  const [driverName, setDriverName] = useState<string | null>(null);
  const [driverPhone, setDriverPhone] = useState<string | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<{lat: number, lng: number} | null>(null);
  const [restaurantDetails, setRestaurantDetails] = useState<any>(null);
  const { isConnected, subscribe } = useRealTime();

  // Order statuses in sequence
  const orderStatuses = [
    "Order Confirmed",
    "Preparing",
    "Ready for Pickup",
    "Driver Assigned",
    "Out for Delivery",
    "Nearby",
    "Delivered"
  ];

  // Fetch restaurant details
  useEffect(() => {
    RestaurantService.getRestaurantById(restaurantId)
      .then(details => {
        setRestaurantDetails(details);
        setMinutesRemaining(details.estimatedDeliveryTime);
      })
      .catch(error => {
        console.error("Failed to fetch restaurant details:", error);
        toast({
          title: "Error",
          description: "Could not load restaurant details",
          variant: "destructive"
        });
      });
  }, [restaurantId]);

  // Subscribe to order updates
  useEffect(() => {
    if (!isConnected || !orderId) return;

    // This simulates receiving real-time updates
    let currentStatusIndex = 0;
    
    const unsubscribe = subscribe(`order-${orderId}`, (data) => {
      // In a real app, we would handle actual data from the server
      console.log(`Received update for order ${orderId}:`, data);
    });

    // Simulate order status progression
    const interval = setInterval(() => {
      // Don't progress past "Delivered"
      if (currentStatusIndex >= orderStatuses.length - 1) {
        clearInterval(interval);
        return;
      }

      // Random chance to progress to next status
      if (Math.random() < 0.3) {
        currentStatusIndex++;
        const newStatus = orderStatuses[currentStatusIndex];
        setOrderStatus(newStatus);
        
        // Update progress based on status
        const newProgress = Math.round((currentStatusIndex / (orderStatuses.length - 1)) * 100);
        setProgress(newProgress);
        
        // Show toast notification for important status changes
        toast({
          title: "Order Update",
          description: newStatus
        });
        
        // Assign driver at the right stage
        if (newStatus === "Driver Assigned") {
          const drivers = [
            { name: "Rahul S", phone: "98765-43210" },
            { name: "Priya M", phone: "87654-32109" },
            { name: "Amit K", phone: "76543-21098" }
          ];
          const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
          setDriverName(randomDriver.name);
          setDriverPhone(randomDriver.phone);
        }
        
        // Simulate location updates once out for delivery
        if (newStatus === "Out for Delivery" || newStatus === "Nearby") {
          // Generate a location between restaurant and delivery address
          const factor = newStatus === "Nearby" ? 0.8 : 0.3; // How close to destination (0=restaurant, 1=destination)
          
          if (restaurantDetails?.coordinates) {
            const deliveryLat = restaurantDetails.coordinates.lat + (Math.random() - 0.5) * 0.02;
            const deliveryLng = restaurantDetails.coordinates.lng + (Math.random() - 0.5) * 0.02;
            
            setDeliveryLocation({
              lat: restaurantDetails.coordinates.lat * (1 - factor) + deliveryLat * factor,
              lng: restaurantDetails.coordinates.lng * (1 - factor) + deliveryLng * factor
            });
          }
        }
      }
      
      // Update minutes remaining
      if (minutesRemaining && minutesRemaining > 1) {
        setMinutesRemaining(prev => prev ? prev - 1 : null);
      }
    }, 5000); // Check every 5 seconds
    
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [isConnected, orderId, restaurantDetails, minutesRemaining]);

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Order Confirmed": return <Check className="h-5 w-5 text-green-500" />;
      case "Preparing": return <Package className="h-5 w-5 text-yellow-500" />;
      case "Ready for Pickup": return <Package className="h-5 w-5 text-green-500" />;
      case "Driver Assigned": return <MapPin className="h-5 w-5 text-blue-500" />;
      case "Out for Delivery": return <Truck className="h-5 w-5 text-blue-500" />;
      case "Nearby": return <MapPin className="h-5 w-5 text-primary" />;
      case "Delivered": return <Home className="h-5 w-5 text-green-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  if (!restaurantDetails) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm animate-pulse flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 rounded-full bg-gray-200 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Order #{orderId.substring(orderId.length - 6)}</h3>
          <p className="text-muted-foreground text-sm">From {restaurantDetails.name}</p>
        </div>
        <Badge variant={
          orderStatus === "Delivered" ? "default" : 
          orderStatus === "Nearby" ? "outline" : 
          "secondary"
        }>
          {orderStatus}
        </Badge>
      </div>
      
      <Progress value={progress} className="h-2 mb-6" />
      
      <div className="space-y-4 mb-6">
        {orderStatuses.map((status, index) => {
          const isPassed = orderStatuses.indexOf(orderStatus) >= index;
          const isCurrent = orderStatus === status;
          
          return (
            <div 
              key={status} 
              className={`flex items-center ${isPassed ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                isCurrent ? 'bg-primary/10 text-primary' : 
                isPassed ? 'bg-primary/5' : 'bg-gray-100'
              }`}>
                {getStatusIcon(status)}
              </div>
              <div className="flex-grow">
                <p className={`${isCurrent ? 'font-medium' : ''}`}>{status}</p>
                {isCurrent && status === "Out for Delivery" && driverName && (
                  <p className="text-sm text-muted-foreground">
                    Your driver {driverName} is on the way
                  </p>
                )}
                {isCurrent && status === "Nearby" && (
                  <p className="text-sm text-muted-foreground">
                    Your order will arrive in about {Math.max(minutesRemaining || 0, 2)} minutes
                  </p>
                )}
              </div>
              {isPassed && !isCurrent && (
                <span className="text-xs text-muted-foreground">
                  {index < 2 ? 'Just now' : `${index * 5}m ago`}
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      {driverName && orderStatus !== "Delivered" && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{driverName}</p>
              <p className="text-sm text-muted-foreground">Your delivery partner</p>
            </div>
          </div>
          <div className="flex space-x-2 mt-2">
            <Button size="sm" variant="outline" className="flex-1">
              Call
            </Button>
            <Button size="sm" className="flex-1">
              Chat
            </Button>
          </div>
        </div>
      )}
      
      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">Order Summary</h4>
        <ul className="space-y-2 mb-4">
          {items.map(item => (
            <li key={item.id} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.name}</span>
              <span>₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>₹{items.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
        </div>
      </div>
      
      {orderStatus !== "Delivered" && orderStatus !== "Out for Delivery" && orderStatus !== "Nearby" && (
        <Button 
          variant="outline" 
          className="w-full mt-6"
          onClick={() => {
            if (onCancel) {
              onCancel();
              toast({
                title: "Order Cancelled",
                description: "Your order has been cancelled successfully",
              });
            }
          }}
        >
          <X className="h-4 w-4 mr-2" /> Cancel Order
        </Button>
      )}
    </div>
  );
};
