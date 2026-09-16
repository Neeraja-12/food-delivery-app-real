
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface CartHeaderProps {
  showPaymentForm: boolean;
  restaurantId?: number | null;
  onBackFromPayment?: () => void;
}

const CartHeader = ({ 
  showPaymentForm, 
  restaurantId,
  onBackFromPayment
}: CartHeaderProps) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {showPaymentForm ? (
            <button 
              onClick={onBackFromPayment} 
              className="text-gray-600 hover:text-primary"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : (
            <Link to={`/restaurant/${restaurantId}`} className="text-gray-600 hover:text-primary">
              <ChevronLeft className="w-6 h-6" />
            </Link>
          )}
          <h1 className="text-2xl font-bold">{showPaymentForm ? "Payment" : "Your Cart"}</h1>
        </div>
      </div>
    </header>
  );
};

export default CartHeader;
