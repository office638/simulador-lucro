import React from 'react';
import { Input } from './input';
import { Label } from './label';

interface MarginTargetInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function MarginTargetInput({ value, onChange }: MarginTargetInputProps) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="target-margin" className="whitespace-nowrap">
        Ideal: acima de
      </Label>
      <Input
        id="target-margin"
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-20"
        min="0"
        max="100"
        step="1"
      />
      <span>%</span>
    </div>
  );
}