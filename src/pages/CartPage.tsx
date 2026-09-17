import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RestaurantService } from '@/services/restaurant-service';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import CartHeader from '@/components/cart/CartHeader';
import CartItem from '@/components/cart/CartItem';
import AddressInput from '@/components/cart/AddressInput';
import OrderSummary from '@/components/cart/OrderSummary';
import PaymentMethodSelector from '@/components/cart/PaymentMethodSelector';
import OrderSuccess from '@/components/cart/OrderSuccess';
import EmptyCart from '@/components/cart/EmptyCart';

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

const CartPage = () => {
  const navigate = useNavigate();

  const {
    items,
    restaurantId,
    restaurantName,
    address,
    setAddress,
    increase,
    decrease,
    remove,
    clear,
    subtotal,
  } = useCart();

  const { addOrder } = useOrders();

  const [selectedPayment, setSelectedPayment] = useState<string>('cod');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const selectedMethod = paymentMethods.find(m => m.id === selectedPayment);
  const discount = selectedMethod
    ? Math.round((subtotal * selectedMethod.discount) / 100)
    : 0;
  const total = subtotal - discount;

  const handleProceedToPayment = () => {
    if (items.length === 0) {
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
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    const orderItems = items.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    RestaurantService.placeOrder(restaurantId || 1, orderItems, address)
      .then(response => {
        // Save to OrderContext so it appears in /orders
        const saved = addOrder({
          restaurantId: restaurantId || 1,
          restaurantName: restaurantName || 'Restaurant',
          items: orderItems,
          subtotal,
          discount,
          total,
          address,
          paymentMethod: selectedPayment,
          estimatedDelivery: response.estimatedTime || 30,
        });

        setOrderSuccess(true);
        toast.success(`Order #${saved.id} placed successfully!`);
        toast.info(
          `Your food will arrive in approximately ${saved.estimatedDelivery} minutes`
        );

        clear();

        // Redirect to the live tracking page
        setTimeout(() => {
          navigate(`/orders/${saved.id}`);
        }, 1500);
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
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="space-y-6 max-w-2xl mx-auto">
            {!showPaymentForm ? (
              <>
                <div className="space-y-4">
                  {items.map(item => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      price={`₹${item.price}`}
                      quantity={item.quantity}
                      image={item.image}
                      onIncrease={increase}
                      onDecrease={decrease}
                      onRemove={remove}
                    />
                  ))}
                </div>

                <AddressInput address={address} onChange={setAddress} />

                <div className="border-t pt-4 space-y-2">
                  <OrderSummary subtotal={subtotal} discount={0} total={subtotal} />
                </div>

                <Button
                  className="w-full py-6 text-lg"
                  onClick={handleProceedToPayment}
                  disabled={loading || items.length === 0}
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
                  disabled={loading || items.length === 0}
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