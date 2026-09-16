
import React, { useState, useEffect } from 'react';
import { ClipboardList, PackageCheck, Utensils, Bike, CheckCircle2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const OrderTracking = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(30);

  const steps = [
    {
      title: "Order Confirmed",
      description: "Your order has been received",
      icon: ClipboardList,
      time: "Just now"
    },
    {
      title: "Order Preparing",
      description: "Chef is preparing your food",
      icon: Utensils,
      time: "10 min"
    },
    {
      title: "Food Ready",
      description: "Your food is ready for pickup",
      icon: PackageCheck,
      time: "15 min"
    },
    {
      title: "On The Way",
      description: "Rider is on the way",
      icon: Bike,
      time: "20 min"
    },
    {
      title: "Delivered",
      description: "Enjoy your meal!",
      icon: CheckCircle2,
      time: "30 min"
    }
  ];

  // Simulate order progress
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          toast.success(`Order Status: ${steps[prev + 1].title}`);
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 8000); // Update every 8 seconds for demo

    return () => clearInterval(interval);
  }, []);

  // Update progress bar and estimated time
  useEffect(() => {
    setProgress((currentStep / (steps.length - 1)) * 100);
    setEstimatedTime(Math.max(30 - (currentStep * 7), 5));
  }, [currentStep]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>
      
      {/* Estimated Time */}
      <div className="bg-primary/5 p-4 rounded-lg mb-8">
        <p className="text-lg font-semibold">
          Estimated Delivery Time: {estimatedTime} minutes
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentStep;
          const isActive = index === currentStep;

          return (
            <div
              key={step.title}
              className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                isActive ? 'bg-primary/5' : ''
              }`}
            >
              <div className={`p-2 rounded-full ${
                isCompleted ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${
                    isCompleted ? 'text-primary' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {isCompleted ? 'Completed' : step.time}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order details */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <div className="space-y-2">
          <p className="text-muted-foreground">Order ID: #{Math.floor(Math.random() * 900000) + 100000}</p>
          <p className="text-muted-foreground">Estimated Delivery Time: {estimatedTime} minutes</p>
          <p className="text-muted-foreground">Delivery Address: 123 Main St, City</p>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
