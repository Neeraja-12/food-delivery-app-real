import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from "@/components/ui/button";
import { RestaurantService } from '@/services/restaurant-service';
import type { RestaurantDetails } from '@/services/restaurant-service';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

function generateMenu(restaurantId: number): Record<string, MenuItem[]> {
  const shared = {
    Starters: [
      { name: 'Paneer Tikka', price: 220 },
      { name: 'Chicken 65', price: 260 },
      { name: 'Veg Manchurian', price: 180 },
      { name: 'Spring Rolls', price: 160 },
    ],
    'Main Course': [
      { name: 'Butter Chicken', price: 320 },
      { name: 'Paneer Butter Masala', price: 280 },
      { name: 'Veg Biryani', price: 240 },
      { name: 'Chicken Biryani', price: 300 },
      { name: 'Dal Makhani', price: 220 },
    ],
    Breads: [
      { name: 'Butter Naan', price: 60 },
      { name: 'Garlic Naan', price: 80 },
      { name: 'Tandoori Roti', price: 40 },
    ],
    Desserts: [
      { name: 'Gulab Jamun', price: 120 },
      { name: 'Rasmalai', price: 140 },
      { name: 'Ice Cream', price: 100 },
    ],
    Beverages: [
      { name: 'Masala Chai', price: 60 },
      { name: 'Sweet Lassi', price: 90 },
      { name: 'Cold Coffee', price: 120 },
      { name: 'Fresh Lime Soda', price: 80 },
    ],
  };

  const foodImages = [
    'photo-1565299624946-b28f40a0ae38',
    'photo-1513104890138-7c749659a591',
    'photo-1568901346375-23c9450c58cd',
    'photo-1604152135912-04a022e73eca',
    'photo-1593584785033-9c7604d0863f',
    'photo-1589302168068-964664d93dc0',
    'photo-1587314168485-3236d6710101',
    'photo-1595295333158-4742f28fbd85',
  ];

  let itemId = restaurantId * 1000;
  const menu: Record<string, MenuItem[]> = {};

  Object.entries(shared).forEach(([category, items]) => {
    menu[category] = items.map((item, idx) => ({
      id: ++itemId,
      name: item.name,
      price: item.price,
      image: foodImages[(restaurantId + idx) % foodImages.length],
      description: `Delicious ${item.name.toLowerCase()} prepared fresh`,
    }));
  });

  return menu;
}

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurantId = Number(id);

  const { addItem, getQuantity, increase, decrease, totalItems } = useCart();

  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [menuItems, setMenuItems] = useState<Record<string, MenuItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    RestaurantService.getRestaurantById(restaurantId)
      .then((data: RestaurantDetails) => {
        setRestaurant(data);
        setMenuItems(generateMenu(restaurantId));
      })
      .catch((err: unknown) => {
        console.error(err);
        setError('Failed to load restaurant. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [restaurantId]);

  const handleAdd = (item: MenuItem) => {
    addItem(
      {
        id: item.id,
        name: item.name,
        price: item.price,
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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

      {restaurant && (
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <div className="flex gap-4 items-center mb-6">
            {restaurant.img && (
              <img
                src={`https://images.unsplash.com/${restaurant.img}?auto=format&fit=crop&w=200&h=200&q=80`}
                alt={restaurant.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
            <div>
              <h2 className="text-xl font-bold">{restaurant.name}</h2>
              <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
              <p className="text-sm text-gray-500">
                ⭐ {restaurant.rating} • {restaurant.time}
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 pb-24 max-w-2xl">
        {Object.entries(menuItems).map(([category, items]) => (
          <section key={category} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 capitalize">{category}</h2>
            <div className="space-y-4">
              {items.map(item => {
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
                          ₹{item.price}
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