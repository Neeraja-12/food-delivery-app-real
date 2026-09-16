
import React from 'react';

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
  selectedPaymentMethod?: string;
  paymentDiscount?: number;
}

const OrderSummary = ({ 
  subtotal, 
  discount, 
  total,
  selectedPaymentMethod,
  paymentDiscount
}: OrderSummaryProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span>₹{subtotal}</span>
      </div>
      
      {discount > 0 && (
        <div className="flex justify-between items-center text-green-600">
          <span>Discount {paymentDiscount ? `(${paymentDiscount}%)` : ''}</span>
          <span>-₹{discount}</span>
        </div>
      )}
      
      <div className="flex justify-between">
        <span className="text-muted-foreground">Delivery</span>
        <span>Free</span>
      </div>
      
      <div className="flex justify-between font-medium pt-2 border-t border-gray-200 mt-2">
        <span>Total</span>
        <span>₹{total}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
