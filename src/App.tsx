import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";

import Home from "./pages/Home";
import Index from "./pages/Index";

const Search = lazy(() => import("./pages/Search"));
const Offers = lazy(() => import("./pages/Offers"));
const Help = lazy(() => import("./pages/Help"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Category = lazy(() => import("./pages/Category"));
const RestaurantMenu = lazy(() => import("./pages/RestaurantMenu"));
const CartPage = lazy(() => import("./pages/CartPage"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const About = lazy(() => import("./pages/About"));
const Ride = lazy(() => import("./pages/Ride"));
const Favorites = lazy(() => import("./pages/Favorites"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center blur-bg low-contrast">
    <div className="text-center reduced-visibility">
      <div className="w-16 h-16 border-4 border-primary/70 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-lg text-muted-foreground/80">Loading page...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <OrderProvider>
    <CartProvider>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <div className="app-container low-contrast min-h-screen flex flex-col">
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/classic" element={<Index />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/offers" element={<Offers />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/team" element={<NotFound />} />
                    <Route path="/careers" element={<NotFound />} />
                    <Route path="/partner" element={<NotFound />} />
                    <Route path="/ride" element={<Ride />} />
                    <Route path="/terms" element={<NotFound />} />
                    <Route path="/privacy" element={<NotFound />} />
                    <Route path="/cookies" element={<NotFound />} />
                    <Route path="/category/:category" element={<Category />} />
                    <Route path="/restaurant/:id" element={<RestaurantMenu />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/orders" element={<OrderTracking />} />
                    <Route path="/orders/:orderId" element={<OrderTracking />} />
                    <Route path="/track-order" element={<OrderTracking />} />
                    <Route path="/restaurants" element={<Navigate to="/category/all" replace />} />
                    <Route path="/menu" element={<Navigate to="/restaurant/1" replace />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </TooltipProvider>
            </div>
          </BrowserRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </CartProvider>
  </OrderProvider>
);

export default App;