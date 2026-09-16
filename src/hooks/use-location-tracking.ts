
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
  timestamp: number | null;
}

export function useLocationTracking() {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: true,
    error: null,
    timestamp: null
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: "Geolocation is not supported by your browser"
      }));
      
      toast({
        title: "Location Tracking Unavailable",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      
      return;
    }

    // Get initial location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null,
          timestamp: position.timestamp
        });
        
        toast({
          title: "Location Found",
          description: "Your location has been detected for better delivery estimates"
        });
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
        
        toast({
          title: "Location Error",
          description: `Could not get your location: ${error.message}`,
          variant: "destructive"
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    // Set up continuous tracking
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null,
          timestamp: position.timestamp
        });
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    // Cleanup the watch when component unmounts
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Function to get distance from a point (in kilometers)
  const getDistanceFrom = (targetLat: number, targetLng: number): number | null => {
    if (!location.latitude || !location.longitude) return null;
    
    // Haversine formula to calculate distance between two points
    const R = 6371; // Earth's radius in km
    const dLat = (targetLat - location.latitude) * Math.PI / 180;
    const dLon = (targetLng - location.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(location.latitude * Math.PI / 180) * Math.cos(targetLat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return parseFloat(distance.toFixed(1));
  };

  // Get estimated delivery time based on distance
  const getEstimatedDeliveryTime = (targetLat: number, targetLng: number): number | null => {
    const distance = getDistanceFrom(targetLat, targetLng);
    if (distance === null) return null;
    
    // Simple estimate: 5 minutes base + 3 minutes per km
    return Math.round(5 + distance * 3);
  };

  return {
    ...location,
    getDistanceFrom,
    getEstimatedDeliveryTime
  };
}
