import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from "@/components/ui/button";
import { RestaurantService } from '@/services/restaurant-service';

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurantId = Number(id);

  const { addItem, getQuantity, increase, decrease, totalItems } = useCart();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    RestaurantService.getRestaurantDetails(restaurantId)
      .then(data => {
        setRestaurant(data.restaurant);
        setMenuItems(data.menu);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [restaurantId]);

  const handleAdd = (item: any) => {
    addItem(
      {
        id: item.id,
        name: item.name,
        price: Number(String(item.price).replace(/[^\d.]/g, '')),
        image: item.image,
      },
      restaurantId,
      restaurant?.name
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-orange-500"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">{restaurant?.name || 'Restaurant'}</h1>
          <button
            onClick={() => navigate('/cart')}
            className="relative text-gray-600 hover:text-orange-500"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {Object.entries(menuItems).map(([category, items]: [string, any]) => (
          <section key={category} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 capitalize">{category}</h2>
            <div className="space-y-4">
              {items.map((item: any) => {
                const qty = getQuantity(item.id);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=100&h=100&q=80`}
                          alt={item.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-orange-500 font-semibold mt-1">
                          ₹{Number(String(item.price).replace(/[^\d.]/g, ''))}
                        </p>
                      </div>
                    </div>

                    {qty === 0 ? (
                      <Button
                        onClick={() => handleAdd(item)}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Add
                      </Button>
                    ) : (
                      <div className="flex items-center border rounded-full overflow-hidden">
                        <button
                          onClick={() => decrease(item.id)}
                          className="px-3 py-1 text-orange-500 hover:bg-orange-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 font-medium">{qty}</span>
                        <button
                          onClick={() => increase(item.id)}
                          className="px-3 py-1 text-orange-500 hover:bg-orange-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {/* Floating cart button */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto">
          <Button
            onClick={() => navigate('/cart')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg"
          >
            View Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </Button>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;