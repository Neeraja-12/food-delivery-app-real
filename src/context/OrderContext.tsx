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
  placedAt: number;
  estimatedDelivery: number;
  // Enhanced fields
  driverName?: string;
  driverPhone?: string;
  driverRating?: number;
  vehicleNumber?: string;
  currentLat?: number;
  currentLng?: number;
  statusHistory?: { status: OrderStatus; at: number }[];
}

interface OrderContextValue {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "placedAt" | "status" | "driverName" | "driverPhone" | "driverRating" | "vehicleNumber" | "currentLat" | "currentLng" | "statusHistory">) => Order;
  getOrder: (id: string) => Order | undefined;
  updateStatus: (id: string, status: OrderStatus) => void;
  clearOrders: () => void;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

const DRIVERS = [
  { name: "Ravi Kumar", phone: "+91 98765 43210", rating: 4.8, vehicle: "KA-01-AB-1234" },
  { name: "Anita Sharma", phone: "+91 91234 56789", rating: 4.9, vehicle: "KA-02-CD-5678" },
  { name: "Mohan Das", phone: "+91 99887 76655", rating: 4.6, vehicle: "KA-03-EF-9012" },
  { name: "Priya Nair", phone: "+91 98700 11223", rating: 4.7, vehicle: "KA-05-GH-3456" },
];

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
    order: Omit<Order, "id" | "placedAt" | "status" | "driverName" | "driverPhone" | "driverRating" | "vehicleNumber" | "currentLat" | "currentLng" | "statusHistory">
  ): Order => {
    const driver = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
    const now = Date.now();
    const newOrder: Order = {
      ...order,
      id: `ORD-${now.toString().slice(-6)}`,
      placedAt: now,
      status: "Preparing",
      driverName: driver.name,
      driverPhone: driver.phone,
      driverRating: driver.rating,
      vehicleNumber: driver.vehicle,
      currentLat: 12.9716 + (Math.random() - 0.5) * 0.05,
      currentLng: 77.5946 + (Math.random() - 0.5) * 0.05,
      statusHistory: [{ status: "Preparing", at: now }],
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrder = (id: string) => orders.find(o => o.id === id);

  const updateStatus = (id: string, status: OrderStatus) =>
    setOrders(prev =>
      prev.map(o => {
        if (o.id !== id) return o;
        const history = o.statusHistory || [];
        const alreadyLogged = history.some(h => h.status === status);
        return {
          ...o,
          status,
          statusHistory: alreadyLogged
            ? history
            : [...history, { status, at: Date.now() }],
        };
      })
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