
import React from 'react';
import { Link } from 'react-router-dom';

const EmptyCart = () => {
  return (
    <div className="text-center py-8">
      <p className="text-lg text-muted-foreground">Your cart is empty</p>
      <Link to="/" className="text-primary hover:underline mt-4 inline-block">
        Browse Restaurants
      </Link>
    </div>
  );
};

export default EmptyCart;
