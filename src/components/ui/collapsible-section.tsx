import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function CollapsibleSection({ title, children, defaultExpanded = true }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 font-semibold bg-gray-50 p-2 hover:bg-gray-100 transition-colors"
      >
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        {title}
      </button>
      {isExpanded && (
        <div className="pl-4 py-2">
          {children}
        </div>
      )}
    </div>
  );
}