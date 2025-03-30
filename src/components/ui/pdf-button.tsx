import React from 'react';
import { FileDown } from 'lucide-react';

interface PdfButtonProps {
  targetRef: React.RefObject<HTMLElement>;
}

export function PdfButton({ targetRef }: PdfButtonProps) {
  const handleExport = () => {
    // Placeholder for PDF export functionality
    console.log('Export to PDF clicked');
  };

  return (
    <button
      onClick={handleExport}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
    >
      <FileDown size={16} />
      Exportar PDF
    </button>
  );
}