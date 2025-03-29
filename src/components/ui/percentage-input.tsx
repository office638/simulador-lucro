import { NumericFormat } from 'react-number-format';
import { cn } from "@/lib/utils";

interface PercentageInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function PercentageInput({ value, onChange, className }: PercentageInputProps) {
  return (
    <NumericFormat
      value={value}
      onValueChange={(values) => {
        onChange(values.floatValue || 0);
      }}
      decimalScale={2}
      fixedDecimalScale
      suffix="%"
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  );
}