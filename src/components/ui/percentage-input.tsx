import { NumericFormat } from 'react-number-format';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";

interface PercentageInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function PercentageInput({ value, onChange, className }: PercentageInputProps) {
  const increment = () => {
    onChange(value + 1);
  };

  const decrement = () => {
    onChange(value - 1);
  };

  return (
    <div className="relative">
      <NumericFormat
        value={value}
        onValueChange={(values) => {
          onChange(values.floatValue || 0);
        }}
        decimalScale={2}
        fixedDecimalScale
        suffix="%"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-8",
          className
        )}
      />
      <div className="absolute right-2 top-0 h-full flex flex-col justify-center">
        <button
          type="button"
          onClick={increment}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <ChevronUp size={14} />
        </button>
        <button
          type="button"
          onClick={decrement}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
}