import React from 'react';
import { FileDown } from 'lucide-react';

interface PdfButtonProps {
  targetRef: React.RefObject<HTMLElement>;
  id?: string;
}

export function PdfButton({ targetRef, id }: PdfButtonProps) {
  const handleExport = () => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
  .grid {
    display: block !important;
  }
  .grid-simulacao {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1rem !important;
  }

        /* Reduz a escala do contêiner principal para impressão */
        #diagnostico-content {
          transform: scale(0.9);
          transform-origin: top left;
        }

        /* Se necessário, reduza os espaçamentos internos */
        .p-4, .sm\\:p-6, .md\\:p-8 {
          padding: 0.5rem !important;
        }

        /* Ajusta a grid para exibição em bloco (coluna única) */
        .grid {
          display: block !important;
           /* Sobrescreve para manter a grid lado a lado na seção de Resumo */
  .grid-resumo {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 1rem !important;
  }
        }
        .grid-cols-2, .sm\\:grid-cols-2, .md\\:grid-cols-2, .lg\\:grid-cols-2,
        .grid-cols-3, .sm\\:grid-cols-3, .md\\:grid-cols-3, .lg\\:grid-cols-3,
        .grid-cols-4, .sm\\:grid-cols-4, .md\\:grid-cols-4, .lg\\:grid-cols-4 {
          grid-template-columns: 100% !important;
        }
        
        /* Evita quebra de página em cartões colapsáveis e gráficos */
        .collapsible-card {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .recharts-wrapper {
          width: 100% !important;
          height: auto !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .collapsed-content {
          display: block !important;
          visibility: visible !important;
          height: auto !important;
          overflow: visible !important;
        }
        table {
          width: 100% !important;
          border-collapse: collapse !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        tr, td, th {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        /* Esconde botões e elementos não imprimíveis */
        button:not(.print-show),
        .no-print {
          display: none !important;
        }
        body {
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          color: black !important;
          background: white !important;
        }
        .page-break-before {
          page-break-before: always !important;
        }
        .page-break-after {
          page-break-after: always !important;
        }
      }
    `;

    document.head.appendChild(style);
    window.print();
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1000);
  };

  return (
    <button
      id={id}
      onClick={handleExport}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 no-print transition-colors"
    >
      <FileDown size={16} />
      Exportar PDF
    </button>
  );
}
