
import React from 'react';
import { Input } from "@/components/ui/input";

interface AddressInputProps {
  address: string;
  onChange: (address: string) => void;
}

const AddressInput = ({ address, onChange }: AddressInputProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
      <Input
        placeholder="Enter your delivery address"
        value={address}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export default AddressInput;
