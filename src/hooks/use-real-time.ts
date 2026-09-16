
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

// This simulates real-time updates - in a real app, 
// this would connect to a WebSocket or use Server-Sent Events
export function useRealTime() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [activeListeners, setActiveListeners] = useState<string[]>([]);

  // Simulate connection to real-time service
  useEffect(() => {
    const connectRealTime = () => {
      console.log("Connecting to real-time service...");
      
      // Simulate connection delay
      const timeout = setTimeout(() => {
        setIsConnected(true);
        setLastUpdate(new Date());
        console.log("Connected to real-time service");
        
        toast({
          title: "Connected",
          description: "Real-time updates are now active",
        });
      }, 1500);
      
      return () => clearTimeout(timeout);
    };
    
    const connection = connectRealTime();
    
    // Cleanup on unmount
    return () => {
      console.log("Disconnecting from real-time service...");
      connection();
      setIsConnected(false);
    };
  }, []);

  // Add a listener for a specific event
  const subscribe = (channel: string, callback: (data: any) => void) => {
    console.log(`Subscribing to ${channel}`);
    
    if (!activeListeners.includes(channel)) {
      setActiveListeners(prev => [...prev, channel]);
    }
    
    // Return unsubscribe function
    return () => {
      console.log(`Unsubscribing from ${channel}`);
      setActiveListeners(prev => prev.filter(ch => ch !== channel));
    };
  };

  // Simulate sending data to the real-time service
  const publish = (channel: string, data: any) => {
    if (!isConnected) {
      console.warn("Not connected to real-time service");
      return false;
    }
    
    console.log(`Publishing to ${channel}:`, data);
    setLastUpdate(new Date());
    
    // In a real implementation, this would send data to the server
    return true;
  };

  return {
    isConnected,
    lastUpdate,
    activeListeners,
    subscribe,
    publish
  };
}
