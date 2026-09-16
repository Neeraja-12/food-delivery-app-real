
import React, { useState } from 'react';
import { ShoppingBag, Clock, MapPin, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { OrderTracking } from './OrderTracking';
import { RestaurantService } from '@/services/restaurant-service';
import { toast } from '@/hooks/use-toast';

interface PlaceOrderDemoProps {
  restaurantId: number;
  restaurantName: string;
  buttonText?: string;
  variant?: "default" | "outline" | "secondary";
}

export const PlaceOrderDemo: React.FC<PlaceOrderDemoProps> = ({
  restaurantId,
  restaurantName,
  buttonText = "Place Order",
  variant = "default"
}) => {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // Demo order items
  const orderItems = [
    { id: 1, name: "Butter Chicken", quantity: 1, price: 320 },
    { id: 2, name: "Garlic Naan", quantity: 2, price: 60 },
    { id: 3, name: "Jeera Rice", quantity: 1, price: 120 },
    { id: 4, name: "Sweet Lassi", quantity: 2, price: 80 }
  ];
  
  const handlePlaceOrder = () => {
    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your delivery address",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate order creation
    RestaurantService.placeOrder(restaurantId, orderItems, address)
      .then(response => {
        setOrderId(response.orderId);
        toast({
          title: "Order Placed!",
          description: "Your order has been placed successfully"
        });
      })
      .catch(error => {
        toast({
          title: "Order Failed",
          description: error.message || "Could not place your order",
          variant: "destructive"
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  const cancelOrder = () => {
    setOrderId(null);
    setOpen(false);
    
    toast({
      title: "Order Cancelled",
      description: "Your order has been cancelled"
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant}>
          <ShoppingBag className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        {!orderId ? (
          <>
            <DialogHeader>
              <DialogTitle>Complete Your Order</DialogTitle>
              <DialogDescription>
                Place a demo order from {restaurantName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="mb-6">
                <h3 className="font-medium mb-3">Order Summary</h3>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  {orderItems.map(item => (
                    <div key={item.id} className="flex justify-between py-1 border-b last:border-0">
                      <div className="flex">
                        <span className="text-muted-foreground mr-2">{item.quantity}x</span>
                        <span>{item.name}</span>
                      </div>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between pt-2 font-medium">
                    <span>Total Amount</span>
                    <span>₹{orderItems.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="Enter your full address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium mb-1">
                    Special Instructions (Optional)
                  </label>
                  <Textarea
                    id="instructions"
                    placeholder="Any special requests for the restaurant..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground border-t pt-3">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Estimated Delivery: 30-40 minutes</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
              <Button 
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {loading ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </>
        ) : (
          <OrderTracking
            orderId={orderId}
            restaurantId={restaurantId}
            deliveryAddress={address}
            items={orderItems}
            onCancel={cancelOrder}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
