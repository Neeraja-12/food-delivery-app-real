
import React from 'react';
import { Link } from 'react-router-dom';
import { Bike } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Ride = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Bike className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Ride with Swiggy</h1>
            <p className="text-xl text-gray-600">Join our delivery partner network and earn on your own schedule</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Flexible Hours</h3>
              <p className="text-gray-600">Work whenever you want, be your own boss</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Weekly Payments</h3>
              <p className="text-gray-600">Get paid weekly, directly to your bank account</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Earn More</h3>
              <p className="text-gray-600">Earn bonuses during peak hours and weekends</p>
            </div>
          </div>

          <div className="bg-primary/5 p-8 rounded-lg mb-12">
            <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
            <ul className="space-y-4">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Valid driver's license
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Two-wheeler or bicycle
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Smartphone with Android 5.0 or higher
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Age 18 or above
              </li>
            </ul>
          </div>

          <div className="text-center">
            <Button className="px-8 py-6 text-lg">
              Sign Up as Delivery Partner
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ride;
