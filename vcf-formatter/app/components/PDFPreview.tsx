'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Portal from './Portal';
import { pdf, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 600 },
  ],
});

// Ensure PharmCatReport is loaded client-side only

const PharmCatReport = dynamic(
  () => import('./PharmCatReport'),
  { ssr: false }
);

interface PDFPreviewProps {
  data: {
    patientId?: string;
    reportDate: string;
    phenotypes: Array<{
      gene: string;
      phenotype: string;
      activity: string;
      implications: string;
      pharmgkbId?: string;
      guidelineLinks?: Array<{
        title: string;
        url: string;
        source: string;
      }>;
    }>;
    recommendations: Array<{
      drug: string;
      recommendation: string;
      severity: 'high' | 'medium' | 'low';
      evidenceLevel?: string;
      guidelineLinks?: Array<{
        title: string;
        url: string;
        source: string;
      }>;
      clinicalAnnotations?: Array<{
        title: string;
        url: string;
        level: string;
      }>;
    }>;
  };
  onClose: () => void;
}

export default function PDFPreview({ data, onClose }: PDFPreviewProps) {
  const [mounted, setMounted] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const generatePdf = async () => {
      try {
        // Create the PDF document
        const PharmCatReportComponent = (await import('./PharmCatReport')).default;
        const pdfDoc = await pdf(<PharmCatReportComponent data={data} />).toBlob();
        
        if (isMounted) {
          setPdfBlob(pdfDoc);
        }
      } catch (error) {
        console.error('Error generating PDF:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
        }
      }
    };

    generatePdf();

    return () => {
      isMounted = false;
    };
  }, [data]);

  if (!mounted || !pdfBlob) {
    return (
      <Portal>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
            <div className="animate-pulse text-gray-600 dark:text-gray-300">
              Generating PDF...
            </div>
          </div>
        </div>
      </Portal>
    );
  }

  const pdfUrl = URL.createObjectURL(pdfBlob);

  return (
    <Portal>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div 
          className="bg-white dark:bg-gray-800 w-[90vw] h-[90vh] rounded-lg shadow-xl flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 id="modal-title" className="text-xl font-semibold text-gray-900 dark:text-white">
              PharmCAT Report Preview
            </h2>
            <div className="flex items-center gap-4">
              <a
                href={pdfUrl}
                download="pharmcat-report.pdf"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Download PDF
              </a>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close preview"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 relative">
            <div className="w-full h-full rounded border border-gray-200 dark:border-gray-700 overflow-hidden bg-white">
              <iframe
                src={pdfUrl}
                className="w-full h-full"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
