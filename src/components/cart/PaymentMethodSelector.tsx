
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PaymentMethod {
  id: string;
  name: string;
  discount: number;
  image?: string;
}

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedMethod: string;
  onMethodChange: (value: string) => void;
}

const PaymentMethodSelector = ({
  methods,
  selectedMethod,
  onMethodChange
}: PaymentMethodSelectorProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
      <RadioGroup
        value={selectedMethod}
        onValueChange={onMethodChange}
        className="space-y-3"
      >
        {methods.map((method) => (
          <div key={method.id} className="flex items-center space-x-2 border p-4 rounded-lg">
            <RadioGroupItem value={method.id} id={method.id} />
            <Label htmlFor={method.id} className="flex-1">
              {method.name}
              {method.discount > 0 && (
                <span className="text-green-600 ml-2">{method.discount}% OFF</span>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
