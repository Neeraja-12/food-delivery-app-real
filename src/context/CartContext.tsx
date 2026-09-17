import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextValue {
  items: CartItem[];
  restaurantId: number | null;
  restaurantName: string;
  address: string;
  setAddress: (a: string) => void;
  addItem: (
    item: Omit<CartItem, "quantity">,
    restaurantId: number,
    restaurantName?: string
  ) => void;
  increase: (id: number) => void;
  decrease: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  subtotal: number;
  totalItems: number;
  hasItem: (id: number) => boolean;
  getQuantity: (id: number) => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("cartItems");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [restaurantId, setRestaurantId] = useState<number | null>(() => {
    const raw = localStorage.getItem("cartRestaurantId");
    return raw ? Number(raw) : null;
  });

  const [restaurantName, setRestaurantName] = useState<string>(() => {
    return localStorage.getItem("cartRestaurantName") || "Restaurant";
  });

  const [address, setAddress] = useState<string>(() => {
    return localStorage.getItem("cartAddress") || "";
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (restaurantId !== null) {
      localStorage.setItem("cartRestaurantId", String(restaurantId));
    } else {
      localStorage.removeItem("cartRestaurantId");
    }
  }, [restaurantId]);

  useEffect(() => {
    localStorage.setItem("cartRestaurantName", restaurantName);
  }, [restaurantName]);

  useEffect(() => {
    localStorage.setItem("cartAddress", address);
  }, [address]);

  const addItem = (
    item: Omit<CartItem, "quantity">,
    rid: number,
    rname?: string
  ) => {
    // If adding from a different restaurant, reset the cart first
    if (restaurantId !== null && restaurantId !== rid) {
      setItems([{ ...item, quantity: 1 }]);
      setRestaurantId(rid);
      if (rname) setRestaurantName(rname);
      return;
    }
    setRestaurantId(rid);
    if (rname) setRestaurantName(rname);
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const increase = (id: number) =>
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );

  const decrease = (id: number) =>
    setItems(prev =>
      prev
        .map(i => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter(i => i.quantity > 0)
    );

  const remove = (id: number) =>
    setItems(prev => prev.filter(i => i.id !== id));

  const clear = () => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName("Restaurant");
    setAddress("");
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const hasItem = (id: number) => items.some(i => i.id === id);
  const getQuantity = (id: number) =>
    items.find(i => i.id === id)?.quantity ?? 0;

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        restaurantName,
        address,
        setAddress,
        addItem,
        increase,
        decrease,
        remove,
        clear,
        subtotal,
        totalItems,
        hasItem,
        getQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};