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
        @page {
          size: A4;
          margin: 20mm;
        }

        /* Força a quebra de página adequada */
        .collapsible-card {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          display: block !important;
        }

        /* Garante que os gráficos sejam renderizados */
        .recharts-wrapper {
          width: 100% !important;
          height: auto !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          display: block !important;
        }

        /* Força a exibição de conteúdo colapsado */
        .collapsed-content {
          display: block !important;
          visibility: visible !important;
          height: auto !important;
          overflow: visible !important;
        }

        /* Ajustes para tabelas */
        table {
          width: 100% !important;
          border-collapse: collapse !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          display: table !important;
        }

        tr, td, th {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* Esconde elementos desnecessários */
        button:not(.print-show), 
        .no-print {
          display: none !important;
        }

        /* Garante contraste adequado */
        body {
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          color: black !important;
          background: white !important;
        }

        /* Força exibição de todos os elementos */
        #diagnostico-content * {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }

        /* Mantém as cores dos gráficos */
        .recharts-sector,
        .recharts-bar-rectangle {
          stroke: none !important;
        }

        /* Garante que grids flexbox funcionem na impressão */
        .grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
        }

        /* Força quebra de página em seções específicas */
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
    setTimeout(() => document.head.removeChild(style), 1000);
  };

  return (
    <button
      id={id}
      onClick={handleExport}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 no-print"
    >
      <FileDown size={16} />
      Exportar PDF
    </button>
  );
}
