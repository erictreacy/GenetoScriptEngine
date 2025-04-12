'use client';

import { useState, useRef } from 'react';
import PDFPreview from './PDFPreview';
import HtmlReport from './HtmlReport';
import JSZip from 'jszip';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [generateReport, setGenerateReport] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  interface ReportData {
    patientId: string;
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
  }

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null);
  const [downloadFileName, setDownloadFileName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'html' | 'pdf'>('html');
  const abortController = useRef<AbortController | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.vcf')) {
        // Check file size (max 2GB)
        if (selectedFile.size > 2 * 1024 * 1024 * 1024) {
          setError('File size exceeds 2GB limit');
          setFile(null);
          return;
        }
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a .vcf file');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    // Create a new FormData instance
    const formData = new FormData();
    formData.append('file', file);
    formData.append('generateReport', generateReport.toString());

    try {
      // Create new AbortController for this request
      abortController.current = new AbortController();

      // Track upload progress using XMLHttpRequest
      const xhr = new XMLHttpRequest();
      
      const promise = new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded * 50) / event.total); // First 50% for upload
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload cancelled'));
        });

        // Start the request
        xhr.open('POST', '/api/process-vcf');
        xhr.responseType = 'blob';
        xhr.send(formData);
      });

      // Connect abort controller
      abortController.current.signal.addEventListener('abort', () => {
        xhr.abort();
      });

      // Process the response
      const blob = await promise as Blob;
      
      // If it's a zip file, extract the VCF data
      if (blob.type === 'application/zip') {
        const zip = new JSZip();
        const zipContents = await zip.loadAsync(blob);
        
        // Extract the VCF file
        const vcfFiles = Object.keys(zipContents.files).filter(name => name.endsWith('.vcf'));
        if (vcfFiles.length > 0) {
          const vcfFile = zipContents.files[vcfFiles[0]];
          const vcfContent = await vcfFile.async('text');
          // Here you could parse the VCF content if needed
        }
      }

      setUploadProgress(100);
      
      // Set the sample report data for preview
      const sampleReportData: ReportData = {
        patientId: 'DEMO-001',
        reportDate: new Date().toLocaleDateString(),
        phenotypes: [
          {
            gene: 'CYP2D6',
            phenotype: 'Normal Metabolizer',
            activity: 'Normal',
            implications: 'Standard drug metabolism for most medications',
            pharmgkbId: 'PA128',
            guidelineLinks: [
              {
                title: 'CPIC Guideline for CYP2D6',
                url: 'https://www.pharmgkb.org/guidelineAnnotation/PA166128738',
                source: 'CPIC'
              },
              {
                title: 'Dutch Pharmacogenetics Working Group Guideline for CYP2D6',
                url: 'https://www.pharmgkb.org/guidelineAnnotation/PA166104955',
                source: 'DPWG'
              }
            ]
          },
          {
            gene: 'CYP2C19',
            phenotype: 'Rapid Metabolizer',
            activity: 'Increased',
            implications: 'May require higher doses of certain medications',
            pharmgkbId: 'PA124',
            guidelineLinks: [
              {
                title: 'CPIC Guideline for CYP2C19',
                url: 'https://www.pharmgkb.org/guidelineAnnotation/PA166127638',
                source: 'CPIC'
              }
            ]
          },
          {
            gene: 'CYP3A4',
            phenotype: 'Intermediate Metabolizer',
            activity: 'Decreased',
            implications: 'May require dose adjustments for affected medications'
          },
          {
            gene: 'CYP2C9',
            phenotype: 'Poor Metabolizer',
            activity: 'Significantly Decreased',
            implications: 'High risk of adverse effects with certain medications'
          },
          {
            gene: 'SLCO1B1',
            phenotype: 'Decreased Function',
            activity: 'Reduced',
            implications: 'Increased risk of statin-induced myopathy'
          },
          {
            gene: 'VKORC1',
            phenotype: 'High Sensitivity',
            activity: 'Increased',
            implications: 'May require lower doses of warfarin'
          }
        ],
        recommendations: [
          // Pain Medications
          {
            drug: 'Codeine',
            recommendation: 'Standard dosing - Monitor for effectiveness',
            severity: 'medium' as const,
            evidenceLevel: 'Level 1A',
            guidelineLinks: [
              {
                title: 'CPIC Guideline for Codeine and CYP2D6',
                url: 'https://www.pharmgkb.org/guidelineAnnotation/PA166104996',
                source: 'CPIC'
              }
            ],
            clinicalAnnotations: [
              {
                title: 'Clinical Annotation for Codeine and CYP2D6',
                url: 'https://www.pharmgkb.org/chemical/PA449088/clinicalAnnotation/1184553583',
                level: '1A'
              }
            ]
          },
          {
            drug: 'Tramadol',
            recommendation: 'Monitor for reduced pain control',
            severity: 'medium' as const,
            evidenceLevel: 'Level 1B',
            guidelineLinks: [
              {
                title: 'CPIC Guideline for Tramadol and CYP2D6',
                url: 'https://www.pharmgkb.org/guidelineAnnotation/PA166104997',
                source: 'CPIC'
              }
            ],
            clinicalAnnotations: [
              {
                title: 'Clinical Annotation for Tramadol and CYP2D6',
                url: 'https://www.pharmgkb.org/chemical/PA451866/clinicalAnnotation/1183736004',
                level: '1B'
              }
            ]
          },
          {
            drug: 'Hydrocodone',
            recommendation: 'Start with standard dose, adjust based on response',
            severity: 'medium'
          },
          {
            drug: 'Oxycodone',
            recommendation: 'Monitor for increased sensitivity',
            severity: 'high' as const
          },
          // Antidepressants
          {
            drug: 'Amitriptyline',
            recommendation: 'Start with lower dose and monitor closely',
            severity: 'medium'
          },
          {
            drug: 'Venlafaxine (Effexor)',
            recommendation: 'Standard dosing with monitoring for side effects',
            severity: 'low' as const
          },
          {
            drug: 'Fluoxetine (Prozac)',
            recommendation: 'Consider dose adjustment based on response',
            severity: 'medium'
          },
          {
            drug: 'Paroxetine (Paxil)',
            recommendation: 'Monitor for increased side effects',
            severity: 'high' as const
          },
          {
            drug: 'Sertraline (Zoloft)',
            recommendation: 'Start with standard dose, adjust if needed',
            severity: 'medium'
          },
          {
            drug: 'Citalopram (Celexa)',
            recommendation: 'Consider lower initial dose',
            severity: 'medium'
          },
          // Cardiovascular Medications
          {
            drug: 'Clopidogrel (Plavix)',
            recommendation: 'Higher dose may be required due to rapid metabolism',
            severity: 'high' as const
          },
          {
            drug: 'Warfarin (Coumadin)',
            recommendation: 'Start with lower dose, frequent INR monitoring',
            severity: 'high' as const
          },
          {
            drug: 'Metoprolol',
            recommendation: 'Consider alternative beta-blocker',
            severity: 'medium'
          },
          {
            drug: 'Propranolol',
            recommendation: 'Monitor for increased side effects',
            severity: 'medium'
          },
          // Statins
          {
            drug: 'Simvastatin',
            recommendation: 'Consider dose reduction or alternative statin',
            severity: 'high' as const
          },
          {
            drug: 'Atorvastatin (Lipitor)',
            recommendation: 'Monitor for muscle pain and weakness',
            severity: 'medium'
          },
          {
            drug: 'Rosuvastatin (Crestor)',
            recommendation: 'Standard dosing with regular monitoring',
            severity: 'medium'
          },
          // Proton Pump Inhibitors
          {
            drug: 'Omeprazole (Prilosec)',
            recommendation: 'Consider alternative medication due to reduced efficacy',
            severity: 'high' as const
          },
          {
            drug: 'Esomeprazole (Nexium)',
            recommendation: 'May require dose adjustment',
            severity: 'medium'
          },
          {
            drug: 'Pantoprazole (Protonix)',
            recommendation: 'Monitor for therapeutic response',
            severity: 'medium'
          },
          // Antipsychotics
          {
            drug: 'Aripiprazole (Abilify)',
            recommendation: 'Dose adjustment may be needed',
            severity: 'medium'
          },
          {
            drug: 'Risperidone',
            recommendation: 'Monitor for increased side effects',
            severity: 'high' as const
          },
          {
            drug: 'Quetiapine (Seroquel)',
            recommendation: 'Standard dosing with careful monitoring',
            severity: 'medium'
          },
          // Anticonvulsants
          {
            drug: 'Carbamazepine',
            recommendation: 'Test for HLA-B*1502 before initiating therapy',
            severity: 'high' as const
          },
          {
            drug: 'Phenytoin (Dilantin)',
            recommendation: 'Start with lower dose, adjust based on levels',
            severity: 'high' as const
          },
          // Other Common Medications
          {
            drug: 'Ondansetron (Zofran)',
            recommendation: 'Standard dosing effective',
            severity: 'low' as const
          },
          {
            drug: 'Metformin',
            recommendation: 'Monitor glycemic control closely',
            severity: 'medium'
          },
          {
            drug: 'Albuterol',
            recommendation: 'Standard dosing appropriate',
            severity: 'low' as const
          },
          {
            drug: 'Azithromycin',
            recommendation: 'Monitor for cardiac side effects',
            severity: 'medium'
          },
          {
            drug: 'Prednisone',
            recommendation: 'Standard dosing protocol',
            severity: 'low' as const
          }
        ]
      };
      
      if (generateReport) {
        setReportData(sampleReportData);
        setShowPreview(true);
      }
      
      setIsUploading(false);
      setUploadProgress(100);
    } catch (err: any) {
      setError(err.message || 'An error occurred during file processing');
      setIsUploading(false);
      setUploadProgress(0);
    } finally {
      abortController.current = null;
    }
  };

  const handleCancel = () => {
    if (abortController.current) {
      abortController.current.abort();
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="generateReport"
            checked={generateReport}
            onChange={(e) => setGenerateReport(e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300"
          />
          <label htmlFor="generateReport" className="text-sm text-gray-700 dark:text-gray-300">
            Generate PharmCAT Report (includes drug recommendations)
          </label>
        </div>
        
        <div className="flex flex-col items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer 
              ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'} 
              hover:bg-gray-100 transition-all duration-300 ease-in-out`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className={`w-10 h-10 mb-3 ${file ? 'text-green-500' : 'text-gray-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">VCF files only (max 2GB)</p>
              {file && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept=".vcf"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <p className="text-sm text-gray-500 text-center mt-2">
              {uploadProgress}% complete
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!file || isUploading}
            className={`flex-1 py-3 px-4 rounded-lg text-white font-medium
              ${
                !file || isUploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors duration-300`}
          >
            {isUploading ? 'Processing...' : 'Format VCF File'}
          </button>

          {isUploading && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-3 rounded-lg text-red-600 font-medium border border-red-600 hover:bg-red-50 transition-colors duration-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      {reportData && (
        <div className="mt-8">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('html')}
                className={`
                  ${activeTab === 'html'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                `}
              >
                Interactive Report
              </button>
              <button
                onClick={() => setActiveTab('pdf')}
                className={`
                  ${activeTab === 'pdf'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                `}
              >
                PDF Report
              </button>
            </nav>
          </div>

          {/* Report Content */}
          <div className="mt-6">
            {activeTab === 'html' ? (
              <HtmlReport data={reportData} />
            ) : (
              <PDFPreview
                data={reportData}
                onClose={() => {
                  setActiveTab('html');
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Utility function to trigger file download
const downloadFile = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

