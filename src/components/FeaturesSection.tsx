
import React from 'react';
import { Rocket, Clock, Navigation, Bell } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Rocket className="h-10 w-10 text-primary" />,
      title: 'Fast Delivery',
      description: 'Get your food delivered in under 30 minutes',
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: 'Real-Time Tracking',
      description: 'Know exactly where your order is',
    },
    {
      icon: <Navigation className="h-10 w-10 text-primary" />,
      title: 'Live Location Updates',
      description: 'See your delivery person approaching in real-time',
    },
    {
      icon: <Bell className="h-10 w-10 text-primary" />,
      title: 'Instant Notifications',
      description: 'Get updates about your order status',
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the best food delivery service with real-time tracking and live updates
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="inline-block mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
