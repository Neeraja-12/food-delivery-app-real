
import React from 'react';
import { HelpCircle } from 'lucide-react';

const Help = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <HelpCircle className="w-8 h-8 text-primary" />
        Help & Support
      </h1>
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          {[
            {
              question: "How do I place an order?",
              answer: "Browse restaurants, select items, add them to your cart, and proceed to checkout."
            },
            {
              question: "What payment methods are accepted?",
              answer: "We accept credit/debit cards, digital wallets, and cash on delivery."
            },
            {
              question: "How can I track my order?",
              answer: "Once your order is confirmed, you can track it in real-time through the app."
            },
            {
              question: "What if I need to cancel my order?",
              answer: "You can cancel your order within 5 minutes of placing it without any charges."
            }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
              <p className="text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">Still need help?</p>
          <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Help;
