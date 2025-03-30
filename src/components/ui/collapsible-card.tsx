import React, { useState } from 'react';
import { Card, CardContent } from './card';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  showComparison?: boolean;
}

export function CollapsibleCard({ title, children, showComparison = false }: CollapsibleCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card>
      <div
        className="p-6 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          {showComparison && (
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Atual</span>
              <ArrowRight className="h-4 w-4 mx-1" />
              <span>Projetado</span>
            </div>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </div>
      {isOpen && <CardContent>{children}</CardContent>}
    </Card>
  );
}