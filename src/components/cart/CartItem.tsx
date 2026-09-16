
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import LazyImage from '@/components/LazyImage';

interface CartItemProps {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image?: string;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
}

const CartItem = ({
  id,
  name,
  price,
  quantity,
  image,
  onIncrease,
  onDecrease,
  onRemove
}: CartItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-md overflow-hidden">
          <LazyImage 
            src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=100&h=100&q=80`}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-primary font-medium mt-1">{price}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={() => onRemove(id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
        
        <div className="flex items-center border rounded-full overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => onDecrease(id)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => onIncrease(id)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
