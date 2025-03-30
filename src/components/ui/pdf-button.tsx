import React from 'react';
import { FileDown } from 'lucide-react';

interface PdfButtonProps {
  targetRef: React.RefObject<HTMLElement>;
}

export function PdfButton({ targetRef }: PdfButtonProps) {
  const handleExport = () => {
    // Add print-specific styles
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        @page {
          size: A4;
          margin: 20mm;
        }

        /* Ensure proper page breaks */
        table, tr, td, th, p, div {
          page-break-inside: avoid;
        }

        /* Hide unnecessary elements when printing */
        button, .no-print {
          display: none !important;
        }

        /* Ensure charts and tables fit within page */
        .recharts-wrapper {
          width: 100% !important;
          height: auto !important;
          page-break-inside: avoid;
        }

        /* Maintain text contrast and readability */
        body {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
          color: black !important;
          background: white !important;
        }

        /* Ensure tables span full width */
        table {
          width: 100% !important;
          border-collapse: collapse;
        }

        /* Maintain proper spacing */
        td, th {
          padding: 8px !important;
        }

        /* Keep card styles */
        .card {
          border: 1px solid #ddd;
          margin-bottom: 20px;
          page-break-inside: avoid;
        }

        /* Ensure proper text wrapping */
        * {
          overflow-wrap: break-word;
          word-wrap: break-word;
        }
      }
    `;

    // Add the style element
    document.head.appendChild(style);

    // Trigger print dialog
    window.print();

    // Remove the style element after printing
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1000);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 no-print"
    >
      <FileDown size={16} />
      Exportar PDF
    </button>
  );
}