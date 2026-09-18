import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle2, MapPin, Package, Truck, Phone, MessageSquare,
  Star, Navigation, Bike, ChefHat, Home as HomeIcon, RefreshCw
} from 'lucide-react';
import { useOrders, Order, OrderStatus } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';

const STAGES: { key: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
  { key: "Preparing",        label: "Order Confirmed", desc: "Restaurant received your order", icon: <CheckCircle2 className="w-5 h-5" /> },
  { key: "Ready for pickup", label: "Order Preparing", desc: "Chef is preparing your food",    icon: <ChefHat className="w-5 h-5" /> },
  { key: "Out for delivery", label: "Food Ready",      desc: "Your food is ready for pickup",  icon: <Package className="w-5 h-5" /> },
  { key: "Nearby",           label: "On The Way",      desc: "Rider is on the way to you",     icon: <Bike className="w-5 h-5" /> },
  { key: "Delivered",        label: "Delivered",       desc: "Enjoy your meal!",               icon: <HomeIcon className="w-5 h-5" /> },
];

const OrderTracking = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orders, updateStatus } = useOrders();
  const [selectedId, setSelectedId] = useState<string | null>(orderId || null);
  const [now, setNow] = useState(Date.now());

  const activeOrder = useMemo(
    () => orders.find(o => o.id === (selectedId || orders[0]?.id)),
    [orders, selectedId]
  );

  // Tick every second for live ETA countdown
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-advance status every 20 seconds (demo)
  useEffect(() => {
    if (!activeOrder) return;
    if (activeOrder.status === "Delivered") return;
    const timer = setTimeout(() => {
      const i = STAGES.findIndex(s => s.key === activeOrder.status);
      if (i >= 0 && i < STAGES.length - 1) {
        updateStatus(activeOrder.id, STAGES[i + 1].key);
      }
    }, 20000);
    return () => clearTimeout(timer);
  }, [activeOrder, updateStatus]);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 p-6 text-center">
        <Package className="w-16 h-16 text-gray-300" />
        <h2 className="text-2xl font-bold">No orders yet</h2>
        <p className="text-gray-500">Place an order to see live tracking here.</p>
        <Button onClick={() => navigate('/')}>Browse Restaurants</Button>
      </div>
    );
  }

  const order = activeOrder!;
  const currentIdx = STAGES.findIndex(s => s.key === order.status);
  const elapsedMin = (now - order.placedAt) / 60000;
  const etaMinutes = Math.max(0, Math.round(order.estimatedDelivery - elapsedMin));
  const progressPct = Math.round(((currentIdx + 1) / STAGES.length) * 100);
  const isDelivered = order.status === "Delivered";

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Track Your Order</h1>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-orange-500"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
        {/* Order chips if multiple */}
        {orders.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {orders.map(o => (
              <button
                key={o.id}
                onClick={() => setSelectedId(o.id)}
                className={`px-3 py-1 rounded-full border text-sm whitespace-nowrap transition ${
                  o.id === order.id
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-700 hover:border-orange-300'
                }`}
              >
                #{o.id} • {o.status}
              </button>
            ))}
          </div>
        )}

        {/* ETA card */}
        <div className={`rounded-xl p-6 ${isDelivered ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDelivered ? 'text-green-700' : 'text-orange-700'}`}>
                {isDelivered ? 'Delivered' : 'Estimated Delivery Time'}
              </p>
              <p className={`text-4xl font-bold ${isDelivered ? 'text-green-600' : 'text-orange-600'}`}>
                {isDelivered ? 'Arrived' : `${etaMinutes} min`}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Order placed {Math.round(elapsedMin)} min ago
              </p>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDelivered ? 'bg-green-100' : 'bg-orange-100 animate-pulse'}`}>
              {isDelivered ? (
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              ) : (
                <Truck className="w-8 h-8 text-orange-600" />
              )}
            </div>
          </div>

          <div className="mt-4 h-2 bg-white rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${isDelivered ? 'bg-green-500' : 'bg-orange-500'}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Live map placeholder */}
        {!isDelivered && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-green-50">
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d="M 40 180 Q 120 120 200 140 T 360 60"
                  stroke="#f97316"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                  fill="none"
                />
              </svg>

              <div className="absolute left-6 bottom-4 flex flex-col items-center">
                <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center shadow-md">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] text-gray-700 mt-1 bg-white px-1 rounded">Restaurant</span>
              </div>

              <div className="absolute right-6 top-4 flex flex-col items-center">
                <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <HomeIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] text-gray-700 mt-1 bg-white px-1 rounded">You</span>
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-orange-400 opacity-40 animate-ping"></div>
                  <div className="relative w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Bike className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 flex items-center justify-between border-t bg-white">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-600">
                  Rider is moving toward your location
                </span>
              </div>
              <span className="text-xs text-gray-400">Live</span>
            </div>
          </div>
        )}

        {/* Driver card */}
        {order.driverName && !isDelivered && (
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                {order.driverName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium">{order.driverName}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {order.driverRating}
                  </span>
                  <span>•</span>
                  <span>{order.vehicleNumber}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${order.driverPhone}`}
                className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100"
              >
                <Phone className="w-5 h-5" />
              </a>
              <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100">
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold mb-4">Order Status</h3>
          <div className="space-y-1">
            {STAGES.map((stage, idx) => {
              const done = idx <= currentIdx;
              const active = idx === currentIdx;
              const history = order.statusHistory?.find(h => h.status === stage.key);
              const timeStr = history
                ? new Date(history.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : `${15 + idx * 5} min`;

              return (
                <div key={stage.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        done ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
                      } ${active ? 'ring-4 ring-orange-200 scale-105' : ''}`}
                    >
                      {stage.icon}
                    </div>
                    {idx < STAGES.length - 1 && (
                      <div
                        className={`w-1 flex-1 min-h-8 ${
                          idx < currentIdx ? 'bg-orange-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>

                  <div className="flex-1 pb-4">
                    <div className="flex justify-between">
                      <p className={`font-medium ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                        {stage.label}
                      </p>
                      <span className={`text-xs ${active ? 'text-orange-500 font-medium' : 'text-gray-400'}`}>
                        {done ? (active ? 'Live' : timeStr) : timeStr}
                      </span>
                    </div>
                    <p className={`text-sm ${done ? 'text-gray-600' : 'text-gray-400'}`}>
                      {stage.desc}
                    </p>
                    {active && !isDelivered && (
                      <div className="mt-1 inline-flex items-center gap-1 text-xs text-orange-500">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        In progress
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order details */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <h3 className="font-semibold">Order Details</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Order ID</p>
              <p className="font-medium">#{order.id}</p>
            </div>
            <div>
              <p className="text-gray-500">Payment</p>
              <p className="font-medium capitalize">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-gray-500">Restaurant</p>
              <p className="font-medium">{order.restaurantName}</p>
            </div>
            <div>
              <p className="text-gray-500">Total</p>
              <p className="font-medium">₹{order.total}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-sm mb-1">Delivery Address</p>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
              <p className="text-sm">{order.address}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-gray-500 text-sm mb-2">Items</p>
            <ul className="space-y-1">
              {order.items.map(item => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="text-gray-600">₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-sm mt-3 pt-3 border-t">
              <span>Subtotal</span><span>₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span><span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold mt-2">
              <span>Total</span><span>₹{order.total}</span>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </main>
    </div>
  );
};

export default OrderTracking;