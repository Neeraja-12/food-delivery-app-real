
import React from 'react';
import { ArrowRight, Tag, Copy, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const TopOffers = () => {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  
  const offers = [
    {
      id: 1,
      title: '50% OFF',
      description: 'On your first order',
      code: 'WELCOME50',
      backgroundColor: 'bg-red-500',
      expiry: '2023-12-31',
    },
    {
      id: 2,
      title: 'FREE DELIVERY',
      description: 'On orders above $15',
      code: 'FREEDEL',
      backgroundColor: 'bg-blue-500',
      expiry: '2023-12-31',
    },
    {
      id: 3,
      title: 'BUY 1 GET 1',
      description: 'On selected items',
      code: 'B1G1',
      backgroundColor: 'bg-green-500',
      expiry: '2023-12-31',
    },
    {
      id: 4,
      title: '30% OFF',
      description: 'On weekend orders',
      code: 'WEEKEND30',
      backgroundColor: 'bg-purple-500',
      expiry: '2023-12-31',
    },
  ];

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      
      toast({
        title: "Code Copied!",
        description: `${code} has been copied to clipboard`,
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the code manually",
        variant: "destructive",
      });
    }
  };

  const handleApplyOffer = (code: string) => {
    // This would typically navigate to the restaurant page or add the code to cart
    toast({
      title: "Offer Applied!",
      description: `Discount code ${code} will be applied at checkout`,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Top Offers</h2>
        <Link to="/offers">
          <Button variant="ghost" size="sm" className="gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {offers.map((offer) => (
          <Card key={offer.id} className={`overflow-hidden border-0 shadow-sm ${offer.backgroundColor} text-white transition-all hover:shadow-md`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{offer.title}</h3>
                  <p className="text-sm opacity-90">{offer.description}</p>
                </div>
                <Tag className="h-5 w-5 opacity-80" />
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <div className="bg-white/20 rounded px-2 py-1 text-sm">
                    {offer.code}
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="gap-1"
                    onClick={() => handleCopyCode(offer.code)}
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex justify-between mt-4">
                  <p className="text-xs opacity-80">
                    Valid until {new Date(offer.expiry).toLocaleDateString()}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-white border-white hover:bg-white/20"
                    onClick={() => handleApplyOffer(offer.code)}
                  >
                    Use Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
