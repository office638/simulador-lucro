import { useState } from 'react';
import { Card, CardContent } from './card';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function CollapsibleCard({ title, children, defaultExpanded = true }: CollapsibleCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className="card page-break-inside-avoid">
      <div className="p-4 border-b">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-xl font-bold"
        >
          {title}
          {isExpanded ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>
      {isExpanded && (
        <CardContent className="print:block">
          {children}
        </CardContent>
      )}
    </Card>
  );
}