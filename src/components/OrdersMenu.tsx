import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronDown, Clock, CheckCircle2, Bike, ChefHat } from 'lucide-react';
import { useOrders, OrderStatus } from '@/context/OrderContext';

const statusIcon = (status: OrderStatus) => {
  switch (status) {
    case "Preparing":        return <ChefHat className="w-4 h-4 text-orange-500" />;
    case "Ready for pickup": return <ChefHat className="w-4 h-4 text-orange-500" />;
    case "Out for delivery": return <Bike className="w-4 h-4 text-blue-500" />;
    case "Nearby":           return <Bike className="w-4 h-4 text-blue-500" />;
    case "Delivered":        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  }
};

const statusBadge = (status: OrderStatus) => {
  if (status === "Delivered") return "bg-green-100 text-green-700";
  if (status === "Nearby" || status === "Out for delivery") return "bg-blue-100 text-blue-700";
  return "bg-orange-100 text-orange-700";
};

const OrdersMenu = () => {
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeOrders = orders.filter(o => o.status !== "Delivered");
  const recent = orders.slice(0, 5);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative flex items-center gap-1 text-gray-700 hover:text-orange-500 px-2 py-1"
      >
        <Package className="w-5 h-5" />
        <span className="hidden md:inline text-sm">My Orders</span>
        {activeOrders.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {activeOrders.length}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50 overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <p className="font-semibold">Your Orders</p>
            {orders.length > 0 && (
              <Link
                to="/orders"
                onClick={() => setOpen(false)}
                className="text-xs text-orange-500 hover:underline"
              >
                View All
              </Link>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No orders yet</p>
              <p className="text-xs text-gray-400 mt-1">Your orders will appear here</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {recent.map(order => (
                <button
                  key={order.id}
                  onClick={() => {
                    navigate(`/orders/${order.id}`);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-0 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                      {statusIcon(order.status)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {order.restaurantName || 'Restaurant'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        #{order.id} • ₹{order.total}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-medium whitespace-nowrap ${statusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {orders.length > 0 && (
            <button
              onClick={() => {
                navigate('/orders');
                setOpen(false);
              }}
              className="w-full text-center py-2 text-sm text-orange-500 hover:bg-orange-50 border-t font-medium"
            >
              Track All Orders
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersMenu;