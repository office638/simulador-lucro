import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface DetailRowProps {
  title: string;
  amount: number;
  percentage: number;
}

interface ExpandableRowProps {
  title: string;
  amount: number;
  percentage: number;
  details: DetailRowProps[];
  className?: string;
}

export const ExpandableRow: React.FC<ExpandableRowProps> = ({
  title,
  amount,
  percentage,
  details,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Formata o valor em R$
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val);
  };

  return (
    <>
      {/* Linha principal */}
      <tr
        className={`cursor-pointer hover:bg-gray-50 ${className}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td className="px-4 py-2 flex items-center gap-2">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="font-medium">
            {title}
          </span>
        </td>
        <td className={`text-right pr-6 ${amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
          {formatCurrency(amount)}
        </td>
        <td className="text-right pr-6">
          {percentage.toFixed(1)}%
        </td>
      </tr>

      {/* Linhas de detalhe */}
      {isExpanded && details.map((detail, index) => (
        <tr key={index} className="text-sm">
          <td className="pl-8 py-1">
            {detail.title}
          </td>
          <td className={`text-right pr-6 ${detail.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(detail.amount)}
          </td>
          <td className="text-right pr-6">
            {detail.percentage.toFixed(1)}%
          </td>
        </tr>
      ))}
    </>
  );
};
