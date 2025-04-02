import React from 'react';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

interface ResultSectionProps {
  value: number;
  percentage: number;
  isPositive: boolean;
  previousValue?: number;
  previousPercentage?: number;
}

export function ResultSection({ 
  value, 
  percentage, 
  isPositive,
  previousValue,
  previousPercentage 
}: ResultSectionProps) {
  const formattedValue = value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const formattedPreviousValue = previousValue?.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const variation = previousValue 
    ? ((value - previousValue) / Math.abs(previousValue)) * 100 
    : 0;

  return (
    <div className={`mt-4 p-4 rounded ${isPositive ? 'bg-green-600' : 'bg-red-600'} text-white`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Resultado Final</h3>
        <div className="text-right">
          {previousValue && (
            <div className="flex items-center gap-2 mb-1 text-sm">
              <span>{formattedPreviousValue}</span>
              <ArrowRight className="h-4 w-4" />
              <span className="font-bold">{formattedValue}</span>
              <span className="flex items-center gap-1">
                {variation > 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {Math.abs(variation).toFixed(1)}%
              </span>
            </div>
          )}
          <p className="text-2xl font-bold">{formattedValue}</p>
          <div className="flex items-center justify-end gap-2 text-sm">
            <span>{percentage.toFixed(1)}% da receita</span>
            {previousPercentage && (
              <span className="opacity-75">
                (anterior: {previousPercentage.toFixed(1)}%)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}