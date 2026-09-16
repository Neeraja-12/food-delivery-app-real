
import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
        
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg">
            <p className="text-gray-600 mb-6">
              Welcome to Swiggy, your trusted partner in food delivery. We're dedicated to connecting you 
              with the best restaurants in your area, ensuring that great food is just a click away.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              To elevate the quality of life for the urban consumer with unparalleled convenience. 
              Convenience is what makes us tick. It's what makes us get out of bed and say, "Let's do this."
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">What We Do</h2>
            <p className="text-gray-600 mb-6">
              We connect people with their favorite restaurants and deliver food right to their doorstep. 
              Our platform helps restaurants reach more customers and grow their business while providing 
              riders with flexible earning opportunities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Lightning-fast delivery to your doorstep</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
                <p className="text-gray-600">Thousands of restaurants to choose from</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Best Quality</h3>
                <p className="text-gray-600">Top-rated restaurants and quality service</p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link 
                to="/" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-200"
              >
                Explore Restaurants
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
