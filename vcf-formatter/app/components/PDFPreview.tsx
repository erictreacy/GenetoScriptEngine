'use client';

import { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import PharmCatReport from './PharmCatReport';
import Portal from './Portal';

interface PDFPreviewProps {
  data: {
    patientId?: string;
    reportDate: string;
    phenotypes: Array<{
      gene: string;
      phenotype: string;
      activity: string;
      implications: string;
    }>;
    recommendations: Array<{
      drug: string;
      recommendation: string;
      severity: 'high' | 'medium' | 'low';
    }>;
  };
  onClose: () => void;
}

export default function PDFPreview({ data, onClose }: PDFPreviewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
        <div className="flex-1 p-4 relative">
          <PDFViewer className="w-full h-full rounded border border-gray-200 dark:border-gray-700">
            <PharmCatReport data={data} />
          </PDFViewer>
        </div>
        </div>
      </div>
    </Portal>
  );
}
