import React from 'react';

interface ResultSectionProps {
  value: number;
  percentage: number;
  isPositive: boolean;
}

export function ResultSection({ value, percentage, isPositive }: ResultSectionProps) {
  const formattedValue = value.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });

  return (
    <div className={`mt-4 grid grid-cols-[1fr_auto_auto] gap-4 items-center p-4 rounded-lg font-bold ${isPositive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
      <div>RESULTADO FINAL:</div>
      <div className="text-right">{formattedValue}</div>
      <div className="text-right">({percentage.toFixed(1)}%)</div>
    </div>
  );
}