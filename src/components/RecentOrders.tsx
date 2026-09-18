import { useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';

const RecentOrders = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();

  if (orders.length === 0) return null;

  const recent = orders.slice(0, 3);

  const statusColor = (status: string) => {
    if (status === "Delivered") return "bg-green-100 text-green-700";
    if (status === "Nearby") return "bg-blue-100 text-blue-700";
    return "bg-orange-100 text-orange-700";
  };

  return (
    <section className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recent Orders</h2>
        <button
          onClick={() => navigate('/orders')}
          className="text-sm text-orange-500 hover:underline flex items-center gap-1"
        >
          View All <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {recent.map(order => (
          <div
            key={order.id}
            onClick={() => navigate(`/orders/${order.id}`)}
            className="bg-white rounded-lg border p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                order.status === "Delivered" ? "bg-green-100" : "bg-orange-100"
              }`}>
                {order.status === "Delivered" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Clock className="w-5 h-5 text-orange-600" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {order.restaurantName || 'Restaurant'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  #{order.id} • {order.items.length}{' '}
                  {order.items.length === 1 ? 'item' : 'items'} • ₹{order.total}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(order.status)}`}>
                {order.status}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {orders.length > 3 && (
        <button
          onClick={() => navigate('/orders')}
          className="mt-3 w-full text-sm text-gray-500 hover:text-orange-500 py-2"
        >
          + {orders.length - 3} more order{orders.length - 3 === 1 ? '' : 's'}
        </button>
      )}
    </section>
  );
};

export default RecentOrders;