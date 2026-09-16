
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export const DialogComponents = () => {
  const [isSubscribeOpen, setIsSubscribeOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');

  // We'll show this dialog after a delay
  React.useEffect(() => {
    const hasSeenDialog = localStorage.getItem('hasSeenSubscribeDialog');
    
    if (!hasSeenDialog) {
      const timer = setTimeout(() => {
        setIsSubscribeOpen(true);
      }, 30000); // Show after 30 seconds
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically make an API call to subscribe the user
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter",
    });
    
    localStorage.setItem('hasSeenSubscribeDialog', 'true');
    setIsSubscribeOpen(false);
  };

  return (
    <>
      {/* Subscribe Dialog */}
      <Dialog open={isSubscribeOpen} onOpenChange={setIsSubscribeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscribe to our newsletter</DialogTitle>
            <DialogDescription>
              Get exclusive offers and updates delivered directly to your inbox.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubscribe}>
            <div className="my-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  localStorage.setItem('hasSeenSubscribeDialog', 'true');
                  setIsSubscribeOpen(false);
                }}
              >
                Not now
              </Button>
              <Button type="submit">Subscribe</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
