import React from 'react';
import { Input } from './input';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function CurrencyInput({ value, onChange }: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove todos os caracteres não numéricos
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    
    // Converte para número considerando 2 casas decimais
    const numericValue = rawValue ? parseInt(rawValue) / 100 : 0;
    
    onChange(numericValue);
  };

  const formattedValue = value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <Input
      type="text"
      value={formattedValue}
      onChange={handleChange}
      className="text-right tabular-nums"
      inputMode="numeric"
      pattern="[0-9]*"
    />
  );
}