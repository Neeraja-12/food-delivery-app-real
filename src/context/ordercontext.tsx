import React, { createContext, useContext, useEffect, useState } from "react";

export type OrderStatus =
  | "Preparing"
  | "Ready for pickup"
  | "Out for delivery"
  | "Nearby"
  | "Delivered";

export interface Order {
  id: string;
  restaurantId: number;
  restaurantName: string;
  items: { id: number; name: string; quantity: number; price: number }[];
  subtotal: number;
  discount: number;
  total: number;
  address: string;
  paymentMethod: string;
  status: OrderStatus;
  placedAt: number;           // timestamp
  estimatedDelivery: number;  // minutes
}

interface OrderContextValue {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "placedAt" | "status">) => Order;
  getOrder: (id: string) => Order | undefined;
  updateStatus: (id: string, status: OrderStatus) => void;
  clearOrders: () => void;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const raw = localStorage.getItem("orders");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (
    order: Omit<Order, "id" | "placedAt" | "status">
  ): Order => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now().toString().slice(-6)}`,
      placedAt: Date.now(),
      status: "Preparing",
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrder = (id: string) => orders.find(o => o.id === id);

  const updateStatus = (id: string, status: OrderStatus) =>
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o))
    );

  const clearOrders = () => setOrders([]);

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrder, updateStatus, clearOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used inside <OrderProvider>");
  return ctx;
};