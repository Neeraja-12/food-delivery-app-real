
import React, { useState, useEffect } from 'react';
import { Percent, Clock, ShoppingBag, Truck, Tag } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Offers = () => {
  const { toast } = useToast();
  const [claimedOffers, setClaimedOffers] = useState<{[key: string]: boolean}>({});

  // Load claimed offers from localStorage on component mount
  useEffect(() => {
    const loadClaimedOffers = () => {
      const offers: {[key: string]: boolean} = {};
      for (let i = 1; i <= 10; i++) {
        const status = localStorage.getItem(`offer_${i}`);
        if (status === 'claimed') {
          offers[`offer_${i}`] = true;
        }
      }
      setClaimedOffers(offers);
    };
    loadClaimedOffers();
  }, []);

  const handleClaimOffer = (offerId: number, discount: number, code?: string) => {
    const offerKey = `offer_${offerId}`;
    
    // Update state and localStorage
    setClaimedOffers(prev => ({...prev, [offerKey]: true}));
    localStorage.setItem(offerKey, 'claimed');
    
    // Show success toast
    toast({
      title: "Offer Claimed!",
      description: code 
        ? `${discount}% discount has been added to your account. Use code ${code}` 
        : `${discount}% discount has been added to your account`,
    });
    
    // Copy code to clipboard if provided
    if (code) {
      navigator.clipboard.writeText(code)
        .then(() => {
          toast({
            title: "Code Copied",
            description: `${code} has been copied to your clipboard`,
          });
        })
        .catch(() => {
          toast({
            title: "Cannot Copy",
            description: "Please copy the code manually",
            variant: "destructive"
          });
        });
    }
  };

  const specialCuisineOffers = [
    { 
      id: 9, 
      cuisine: "Italian", 
      img: "photo-1498579809087-ef1e558fd1da", 
      discount: 30,
      description: "Get 30% off on all Italian dishes including pizzas, pastas and more!"
    },
    { 
      id: 10, 
      cuisine: "Indian", 
      img: "photo-1585937421612-70a008356c36", 
      discount: 25,
      description: "Enjoy 25% off on authentic Indian cuisine - from biryanis to curries!"
    }
  ];

  const topOffers = [
    {
      id: 1,
      title: "50% OFF",
      description: "Up to ₹100 | Use code WELCOME50",
      img: "photo-1484659619207-9165d119dafe",
      code: "WELCOME50",
      discount: 50
    },
    {
      id: 2,
      title: "FREE DELIVERY",
      description: "On orders above ₹199",
      img: "photo-1530554764233-e79e16c91d08",
      discount: 100
    },
    {
      id: 3,
      title: "20% OFF",
      description: "Up to ₹150 | Use code PARTY20",
      img: "photo-1432139509613-5c4255bc9223",
      code: "PARTY20",
      discount: 20
    }
  ];

  const featuresData = [
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Fast Delivery",
      description: "Get your food delivered in under 30 minutes"
    },
    {
      icon: <ShoppingBag className="h-8 w-8 text-primary" />,
      title: "Live Tracking",
      description: "Know where your order is at all times"
    },
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "Free Delivery",
      description: "Free delivery on orders above ₹199"
    },
    {
      icon: <Tag className="h-8 w-8 text-primary" />,
      title: "Great Offers",
      description: "Discounts and offers available every day"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Percent className="w-8 h-8 text-primary" />
        Current Offers
      </h1>

      {/* Top Offers Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Top Offers</h2>
          <Link to="/offers" className="text-primary hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topOffers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img
                  src={`https://images.unsplash.com/${offer.img}?auto=format&fit=crop&q=80&w=800`}
                  alt={offer.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <Badge variant="default" className="w-fit mb-2">{offer.title}</Badge>
                <CardTitle>{offer.title}</CardTitle>
                <CardDescription>{offer.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleClaimOffer(offer.id, offer.discount, offer.code)}
                  disabled={claimedOffers[`offer_${offer.id}`]}
                >
                  {claimedOffers[`offer_${offer.id}`] ? 'Claimed' : 'Claim Offer'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 p-8 rounded-xl mb-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresData.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl text-center hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cuisine Specific Offers */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Cuisine Specific Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specialCuisineOffers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img
                  src={`https://images.unsplash.com/${offer.img}?auto=format&fit=crop&q=80&w=800`}
                  alt={offer.cuisine}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <Badge variant="default" className="w-fit mb-2">{offer.discount}% OFF</Badge>
                <CardTitle>{offer.cuisine} Cuisine Special</CardTitle>
                <CardDescription>{offer.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleClaimOffer(offer.id, offer.discount)}
                  disabled={claimedOffers[`offer_${offer.id}`]}
                >
                  {claimedOffers[`offer_${offer.id}`] ? 'Claimed' : 'Claim Offer'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Restaurant Offers Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Restaurant Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: 4, img: "photo-1496412705862-e0088f16f791", description: "Exclusive deals on your favorite meals!" },
            { id: 5, img: "photo-1555396273-367ea4eb4db5", description: "Big savings on family meals and combos!" },
            { id: 6, img: "photo-1566843972142-a7fcb70de55a", description: "Weekend special offers on selected cuisines!" },
            { id: 7, img: "photo-1505253716362-afaea1d3d1af", description: "Burma Burma special: 15% off on all orders!" },
            { id: 8, img: "photo-1517248135467-4c7edcad34c4", description: "Special discount on fine dining restaurants!" },
          ].map((offer) => (
            <div key={offer.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <img
                  src={`https://images.unsplash.com/${offer.img}?auto=format&fit=crop&q=80&w=800`}
                  alt={`Offer ${offer.id}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full">
                  {offer.id * 5}% OFF
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Special Offer {offer.id}</h3>
                <p className="text-muted-foreground mb-4">
                  {offer.description}
                </p>
                <Button 
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleClaimOffer(offer.id, offer.id * 5)}
                  disabled={claimedOffers[`offer_${offer.id}`]}
                >
                  {claimedOffers[`offer_${offer.id}`] ? 'Claimed' : 'Claim Offer'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Offers;
