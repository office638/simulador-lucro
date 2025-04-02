import React from 'react';
import { Input } from './input';

interface PercentageInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function PercentageInput({ value, onChange }: PercentageInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove todos os caracteres não numéricos e pontos/vírgulas
    const rawValue = e.target.value.replace(/[^0-9.-]/g, '');
    
    // Converte para número mantendo uma casa decimal
    const numericValue = rawValue ? parseFloat(rawValue) : 0;
    
    onChange(numericValue);
  };

  return (
    <Input
      type="text"
      value={`${value.toFixed(1)}%`}
      onChange={handleChange}
      className="text-right tabular-nums"
      inputMode="numeric"
      pattern="[0-9]*"
    />
  );
}