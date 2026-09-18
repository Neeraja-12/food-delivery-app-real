import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingCart, Menu, Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useRealTime } from '@/hooks/use-real-time';
import { useCart } from '@/context/CartContext';
import OrdersMenu from '@/components/OrdersMenu';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { toast } = useToast();
  const realTime = useRealTime();
  const { totalItems } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have no new notifications",
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="font-bold text-xl hidden md:inline-block">FoodApp</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-primary">Home</Link>
            <Link to="/search" className="text-sm font-medium hover:text-primary">Search</Link>
            <Link to="/offers" className="text-sm font-medium hover:text-primary">Offers</Link>
            <Link to="/help" className="text-sm font-medium hover:text-primary">Help</Link>
          </nav>

          {/* User Controls */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={handleNotificationClick}
            >
              <Bell className="h-5 w-5" />
              {realTime.isConnected && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-green-500 rounded-full"></span>
              )}
            </Button>

            {/* Orders dropdown - desktop + mobile */}
            <OrdersMenu />

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link to="/signin">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden p-4 bg-gray-50 border-t border-gray-200">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              className="px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/search"
              className="px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Search
            </Link>
            <Link
              to="/offers"
              className="px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Offers
            </Link>
            <Link
              to="/help"
              className="px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Help
            </Link>
            <Link
              to="/orders"
              className="px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              My Orders
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};