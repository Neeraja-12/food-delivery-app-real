
import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, Zap } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRealTime } from '@/hooks/use-real-time';

interface RestaurantAvailabilityProps {
  isOpen: boolean;
  busyLevel: 'low' | 'medium' | 'high';
  estimatedDeliveryTime: number;
}

export const RestaurantAvailability: React.FC<RestaurantAvailabilityProps> = ({
  isOpen,
  busyLevel,
  estimatedDeliveryTime
}) => {
  const [localBusyLevel, setLocalBusyLevel] = useState(busyLevel);
  const [localDeliveryTime, setLocalDeliveryTime] = useState(estimatedDeliveryTime);
  const { isConnected, subscribe } = useRealTime();

  // Simulate real-time updates to restaurant status
  useEffect(() => {
    if (!isConnected) return;

    // Set up initial values
    setLocalBusyLevel(busyLevel);
    setLocalDeliveryTime(estimatedDeliveryTime);

    // This would subscribe to real-time updates from the server
    const unsubscribe = subscribe(`restaurant-status`, (data) => {
      // In a real app, we would handle actual data from the server
      console.log(`Received restaurant status update:`, data);
    });

    // Simulate occasional changes to restaurant status
    const interval = setInterval(() => {
      // 20% chance to change busy level
      if (Math.random() < 0.2) {
        const busyLevels: ['low', 'medium', 'high'] = ['low', 'medium', 'high'];
        const currentIndex = busyLevels.indexOf(localBusyLevel);
        
        // Randomly move up or down one level, but stay within bounds
        const direction = Math.random() < 0.5 ? -1 : 1;
        const newIndex = Math.max(0, Math.min(busyLevels.length - 1, currentIndex + direction));
        
        setLocalBusyLevel(busyLevels[newIndex]);
      }
      
      // Adjust delivery time slightly (±5 minutes)
      if (Math.random() < 0.3) {
        const change = Math.floor(Math.random() * 5) * (Math.random() < 0.5 ? -1 : 1);
        setLocalDeliveryTime(prev => Math.max(15, Math.min(60, prev + change)));
      }
    }, 15000); // Check every 15 seconds
    
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [isConnected, busyLevel, estimatedDeliveryTime]);

  if (!isOpen) {
    return (
      <div className="flex items-center">
        <Badge variant="destructive" className="mr-2">Closed</Badge>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </TooltipTrigger>
            <TooltipContent>
              <p>This restaurant is currently closed.</p>
              <p>Please check back later.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  // Busy level indicator
  const getBusyBadge = () => {
    switch(localBusyLevel) {
      case 'low':
        return (
          <div className="flex items-center">
            <Badge variant="outline" className="bg-green-50 text-green-700 mr-2">
              Available
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Zap className="h-4 w-4 text-green-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Not busy - order will be prepared quickly</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 mr-2">
              Busy
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Moderately busy - slight delay expected</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      case 'high':
        return (
          <div className="flex items-center">
            <Badge variant="outline" className="bg-red-50 text-red-700 mr-2">
              Very Busy
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>High demand - longer wait times expected</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Badge variant="outline" className="bg-green-50 text-green-700 mr-2">
            Open
          </Badge>
          <span className="text-sm text-muted-foreground">
            Accepting orders
          </span>
        </div>
        {getBusyBadge()}
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <Clock className="h-4 w-4 mr-1" />
        <span>Estimated delivery: {localDeliveryTime} minutes</span>
      </div>
    </div>
  );
};
