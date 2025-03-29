import { FileDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface PdfButtonProps {
  targetRef: React.RefObject<HTMLDivElement>;
}

export function PdfButton({ targetRef }: PdfButtonProps) {
  const generatePDF = async () => {
    if (!targetRef.current) return;

    try {
      // Save current scroll position
      const scrollPos = window.scrollY;

      // Temporarily modify the container for proper capture
      const container = targetRef.current;
      const originalStyle = container.style.cssText;
      
      // Add print-specific styles
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        @media print {
          .page-break-inside-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .page-break-before {
            page-break-before: always !important;
            break-before: always !important;
          }
          table {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .card {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-top: 20px !important;
            margin-bottom: 25px !important;
          }
        }
      `;
      document.head.appendChild(styleSheet);
      
      // Set styles for capture
      Object.assign(container.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: `${container.scrollWidth}px`,
        minHeight: `${container.scrollHeight}px`,
        overflow: 'visible',
        transform: 'none',
        transformOrigin: 'top left',
      });

      // Add print classes to elements
      container.querySelectorAll('.card, table, tr').forEach(element => {
        element.classList.add('page-break-inside-avoid');
      });

      // Generate canvas with full content
      const canvas = await html2canvas(container, {
        scale: 2,
        logging: false,
        useCORS: true,
        windowWidth: container.scrollWidth,
        windowHeight: container.scrollHeight,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        allowTaint: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Remove elements that shouldn't be in the PDF
          const clonedElement = clonedDoc.querySelector('[data-html2canvas-ignore]');
          if (clonedElement) {
            clonedElement.remove();
          }

          // Add margins to sections in the cloned document
          clonedDoc.querySelectorAll('.card').forEach(card => {
            (card as HTMLElement).style.marginTop = '20px';
            (card as HTMLElement).style.marginBottom = '25px';
          });
        }
      });

      // Restore original styles and remove print stylesheet
      container.style.cssText = originalStyle;
      document.head.removeChild(styleSheet);
      
      // Restore scroll position
      window.scrollTo(0, scrollPos);

      // Calculate dimensions for PDF
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF with proper dimensions and margins
      const pdf = new jsPDF({
        orientation: imgHeight > pageHeight ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Set margins
      const margin = 10; // 10mm margins
      const contentWidth = imgWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);

      // Handle content that might span multiple pages
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;

      // Add content to PDF, creating new pages as needed
      while (heightLeft >= 0) {
        if (pageNumber > 1) {
          pdf.addPage();
        }

        // Add content with margins
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          margin, // x position with margin
          position + margin, // y position with margin
          contentWidth,
          imgHeight
        );

        heightLeft -= contentHeight;
        position -= contentHeight;
        pageNumber++;
      }

      // Save the PDF with date in the filename
      const today = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
      pdf.save(`Diagnostico-Financeiro-${today}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
    }
  };

  return (
    <button
      onClick={generatePDF}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
    >
      <FileDown size={20} />
      <span>Gerar PDF do Diagnóstico</span>
    </button>
  );
}