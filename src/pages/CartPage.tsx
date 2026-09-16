
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RestaurantService } from '@/services/restaurant-service';
import CartHeader from '@/components/cart/CartHeader';
import CartItem from '@/components/cart/CartItem';
import AddressInput from '@/components/cart/AddressInput';
import OrderSummary from '@/components/cart/OrderSummary';
import PaymentMethodSelector from '@/components/cart/PaymentMethodSelector';
import OrderSuccess from '@/components/cart/OrderSuccess';
import EmptyCart from '@/components/cart/EmptyCart';

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  discount: number;
  image?: string;
}

const paymentMethods: PaymentMethod[] = [
  { id: 'cod', name: 'Cash on Delivery', discount: 0 },
  { id: 'phonepe', name: 'PhonePe', discount: 18 },
  { id: 'gpay', name: 'Google Pay', discount: 18 },
  { id: 'paytm', name: 'Paytm', discount: 18 },
];

const foodImages = [
  'photo-1565299624946-b28f40a0ae38',
  'photo-1513104890138-7c749659a591',
  'photo-1568901346375-23c9450c58cd',
  'photo-1604152135912-04a022e73eca',
  'photo-1593584785033-9c7604d0863f',
  'photo-1589302168068-964664d93dc0',
  'photo-1587314168485-3236d6710101',
  'photo-1595295333158-4742f28fbd85',
  'photo-1602273660127-a0000560a4c1',
  'photo-1563379926898-05f4575a45d8',
  'photo-1595295333158-4742f28fbd85',
];

const CartPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { cart: initialCart, menuItems, restaurantId, restaurantName } = location.state || { 
    cart: {}, 
    menuItems: [],
    restaurantId: null,
    restaurantName: 'Restaurant'
  };
  
  const [cart, setCart] = useState<{[key: string]: number}>(initialCart || {});
  const [selectedPayment, setSelectedPayment] = useState<string>('cod');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    console.log("Cart data:", cart);
    console.log("Menu items:", menuItems);
  }, [cart, menuItems]);

  const getItemDetails = (itemId: number) => {
    if (!menuItems) {
      console.log("No menu items available");
      return null;
    }
    
    for (const category of Object.values(menuItems)) {
      if (Array.isArray(category)) {
        const item = category.find(item => item.id === itemId);
        if (item) return item;
      }
    }
    console.log(`Item with ID ${itemId} not found in menu items`);
    return null;
  };

  const cartItems: CartItem[] = Object.entries(cart).map(([id, quantity]) => {
    const item = getItemDetails(Number(id));
    const randomImageIndex = Number(id) % foodImages.length;
    return {
      id: Number(id),
      name: item?.name || `Item ${id}`,
      price: item?.price || '₹0',
      quantity: quantity as number,
      image: item?.image || foodImages[randomImageIndex]
    };
  });

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace('₹', ''));
    return sum + (price * item.quantity);
  }, 0);

  const selectedMethod = paymentMethods.find(method => method.id === selectedPayment);
  const discount = selectedMethod ? Math.round((subtotal * selectedMethod.discount) / 100) : 0;
  const total = subtotal - discount;

  const handleIncreaseQuantity = (itemId: number) => {
    setCart(prevCart => ({
      ...prevCart,
      [itemId]: (prevCart[itemId] || 0) + 1
    }));
  };

  const handleDecreaseQuantity = (itemId: number) => {
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
  };

  const handleRemoveItem = (itemId: number) => {
    setCart(prevCart => {
      const newCart = {...prevCart};
      delete newCart[itemId];
      return newCart;
    });
    
    toast.info("Item removed from cart");
  };

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    if (!address.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }
    
    setShowPaymentForm(true);
  };

  const handlePayment = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    setLoading(true);
    
    const orderItems = cartItems.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: parseInt(item.price.replace('₹', ''))
    }));
    
    RestaurantService.placeOrder(restaurantId || 1, orderItems, address)
      .then(response => {
        setOrderSuccess(true);
        toast.success(`Order #${response.orderId} placed successfully!`);
        toast.info(`Your food will arrive in approximately ${response.estimatedTime} minutes`);
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
      })
      .catch(error => {
        toast.error(error.message || "Failed to place order");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (orderSuccess) {
    return <OrderSuccess />;
  }

  return (
    <div className="min-h-screen bg-white">
      <CartHeader 
        showPaymentForm={showPaymentForm} 
        restaurantId={restaurantId} 
        onBackFromPayment={() => setShowPaymentForm(false)}
      />

      <main className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="space-y-6 max-w-2xl mx-auto">
            {!showPaymentForm ? (
              <>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      price={item.price}
                      quantity={item.quantity}
                      image={item.image}
                      onIncrease={handleIncreaseQuantity}
                      onDecrease={handleDecreaseQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>

                <AddressInput 
                  address={address}
                  onChange={setAddress}
                />

                <div className="border-t pt-4 space-y-2">
                  <OrderSummary 
                    subtotal={subtotal} 
                    discount={0} 
                    total={subtotal}
                  />
                </div>

                <Button 
                  className="w-full py-6 text-lg"
                  onClick={handleProceedToPayment}
                  disabled={loading || cartItems.length === 0}
                >
                  Proceed to Payment
                </Button>
              </>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  <OrderSummary 
                    subtotal={subtotal} 
                    discount={discount} 
                    total={total}
                    selectedPaymentMethod={selectedPayment}
                    paymentDiscount={selectedMethod?.discount}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
                  <p className="p-4 bg-gray-50 rounded-lg">{address}</p>
                </div>

                <PaymentMethodSelector 
                  methods={paymentMethods}
                  selectedMethod={selectedPayment}
                  onMethodChange={setSelectedPayment}
                />

                <div className="border-t pt-4 space-y-2">
                  <OrderSummary 
                    subtotal={subtotal} 
                    discount={discount} 
                    total={total}
                    selectedPaymentMethod={selectedPayment}
                    paymentDiscount={selectedMethod?.discount}
                  />
                </div>

                <Button 
                  className="w-full py-6 text-lg"
                  onClick={handlePayment}
                  disabled={loading || cartItems.length === 0}
                >
                  {loading ? "Processing..." : `Pay ₹${total}`}
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
