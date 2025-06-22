'use client';

import { useState } from 'react';

type TabType = 'summary' | 'variants' | 'raw';

interface Variant {
  '#CHROM': string;
  POS: string;
  ID: string;
  REF: string;
  ALT: string;
  QUAL: string;
  FILTER: string;
  INFO: string;
  parsedINFO?: Record<string, string>;
}

interface ReportData {
  patientId: string;
  reportDate: string;
  variants: Array<{
    chromosome: string;
    variant_count: number;
  }>;
  phenotypes: any[];
  recommendations: any[];
  references: any[];
}

const parseInfoField = (infoString: string): Record<string, string> => {
  if (!infoString || infoString === '.') return {};
  return infoString.split(';').reduce((acc: Record<string, string>, pair) => {
    const [key, value] = pair.split('=');
    acc[key] = value || 'true';
    return acc;
  }, {});
};

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vcfContent, setVcfContent] = useState<string>('');
  const [vcfData, setVcfData] = useState<Variant[]>([]);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [fileProcessed, setFileProcessed] = useState(false);

  const resetState = () => {
    setFile(null);
    setVcfContent('');
    setVcfData([]);
    setReportData(null);
    setError(null);
  };

  const startAnalysis = () => {
    if (!fileProcessed) return;
    
    setAnalysisStarted(true);
    setIsProcessing(true);
    
    // Simulate processing time (2 seconds)
    setTimeout(() => {
      setIsProcessing(false);
      // After processing, ensure we're showing the summary tab
      setActiveTab('summary');
    }, 2000);
  };

  const processVcfFile = async (file: File): Promise<ReportData> => {
    try {
      const content = await file.text();
      if (!content || content.trim().length === 0) {
        throw new Error('File is empty');
      }
      
      // Set initial states
      setVcfContent(content);
      setAnalysisStarted(false);
      setIsProcessing(false);

      const lines = content.split('\n').filter(line => line && !line.startsWith('##'));
      const headerLine = lines.find(line => line.startsWith('#CHROM'));

      if (!headerLine) {
        throw new Error('Invalid VCF format: Missing #CHROM header line');
      }

      const headers = headerLine.replace(/^#/, '').split('\t');
      const requiredHeaders = ['#CHROM', 'POS', 'ID', 'REF', 'ALT', 'QUAL', 'FILTER', 'INFO'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

      if (missingHeaders.length > 0) {
        throw new Error(`Invalid VCF format: Missing required headers: ${missingHeaders.join(', ')}`);
      }

      const dataLines = lines.filter(line => line && !line.startsWith('#'));
      if (dataLines.length === 0) {
        throw new Error('No variant data found in the VCF file');
      }

      const parsedData = dataLines.map((line, index) => {
        const values = line.split('\t');
        if (values.length < headers.length) {
          throw new Error(`Line ${index + 1}: Incorrect number of fields. Expected ${headers.length}, got ${values.length}`);
        }

        const variant = headers.reduce((obj: any, header, i) => {
          obj[header] = values[i] || '.';
          return obj;
        }, {}) as Variant;

        if (variant.INFO && variant.INFO !== '.') {
          variant.parsedINFO = parseInfoField(variant.INFO);
        }

        return variant;
      });

      setVcfData(parsedData);

      const variantCount = parsedData.length;
      const chromosomes = [...new Set(parsedData.map(v => v['#CHROM']))];
      const variantTypes = parsedData.reduce((acc, variant) => {
        const type = variant.REF.length === 1 && variant.ALT.length === 1 ? 'SNP' : 'INDEL';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const reportData = {
        patientId: `PAT-${Date.now().toString().slice(-6)}`,
        reportDate: new Date().toISOString(),
        variants: [
          { chromosome: 'Total Variants', variant_count: variantCount },
          { chromosome: 'Chromosomes', variant_count: chromosomes.length },
          ...Object.entries(variantTypes).map(([type, count]) => ({
            chromosome: type,
            variant_count: count as number
          }))
        ],
        phenotypes: [],
        recommendations: [],
        references: []
      };
      
      // Set the report data and mark as not processing
      setReportData(reportData);
      return reportData;
    } catch (err) {
      console.error('Error processing VCF data:', err);
      setError('Failed to process VCF data');
      setIsProcessing(false);
      throw err;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        console.log('No file selected');
        resetState();
        return;
      }
      
      const file = e.target.files[0];
      console.log('Selected file:', file.name, 'Size:', file.size, 'bytes');
      
      resetState();
      setFile(file);
      setFileProcessed(false);
      
      // Process the VCF file but don't start analysis yet
      processVcfFile(file)
        .then(report => {
          console.log('File processed, ready for analysis');
          setReportData(report);
          setFileProcessed(true);
        })
        .catch((error: Error) => {
          console.error('Error processing VCF:', error);
          setError(`Error processing VCF: ${error.message}`);
        });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error in handleFileChange:', error);
      setError(`Error: ${errorMessage}`);
    }
  };

  const loadSampleFile = async () => {
    try {
      setIsUploading(true);
      setError(null);
      console.log('Loading sample VCF file...');
      
      const response = await fetch('/vcf_samples/AR6GE3BF5QA_vcf.vcf');
      if (!response.ok) {
        throw new Error(`Failed to load sample file: ${response.statusText}`);
      }
      
      const content = await response.text();
      if (!content) {
        throw new Error('Sample file is empty');
      }
      
      console.log('Sample file loaded, processing...');
      const file = new File([content], 'sample.vcf', { type: 'text/vcf' });
      setFile(file);
      const report = await processVcfFile(file);
      setReportData(report);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load sample file';
      console.error('Error loading sample file:', error);
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">VCF File Analysis</h1>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="flex-1 w-full">
                <span className="sr-only">Choose VCF file</span>
                <input
                  type="file"
                  accept=".vcf,.vcf.gz"
                  onChange={handleFileChange}
                  disabled={isUploading || isProcessing}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </label>
              <div className="text-gray-500 text-sm whitespace-nowrap">OR</div>
              <button
                onClick={loadSampleFile}
                disabled={isUploading || isProcessing}
                className="px-6 py-2 bg-green-50 text-green-700 rounded-md text-sm font-semibold
                  hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  whitespace-nowrap"
              >
                {isUploading ? 'Processing...' : 'Use Sample VCF'}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 text-red-700 bg-red-50 rounded-md mt-4">
              <p className="font-medium">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
            
          {isUploading && !reportData && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Processing VCF file...</p>
            </div>
          )}
          
          {!isUploading && file && !fileProcessed && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Processing file, please wait...</p>
            </div>
          )}
            
          {fileProcessed && reportData && (
            <div className="mt-6">
              {!analysisStarted ? (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">Ready to Analyze Your VCF File?</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                    Your VCF file has been uploaded successfully. Click the button below to start the analysis.
                  </p>
                  <button
                    onClick={startAnalysis}
                    disabled={isProcessing}
                    className={`px-8 py-3 text-lg font-semibold text-white rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 ${
                      isProcessing 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </span>
                    ) : (
                      'Start Analysis'
                    )}
                  </button>
                </div>
              ) : (
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab('summary')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'summary'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Summary
                    </button>
                    <button
                      onClick={() => setActiveTab('variants')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'variants'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Variants ({vcfData.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('raw')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'raw'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Raw VCF
                    </button>
                  </nav>
                </div>
              )}
                
              <div className="py-4">
                {activeTab === 'summary' && (
                  <div className="space-y-4">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          VCF File Summary
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Overview of the VCF file contents
                        </p>
                      </div>
                      <div className="border-t border-gray-200">
                        <dl>
                          {reportData.variants?.map((item, i) => (
                            <div key={i} className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                              <dt className="text-sm font-medium text-gray-500">
                                {item.chromosome}
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">
                                {item.variant_count?.toLocaleString()}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'variants' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {['#CHROM', 'POS', 'ID', 'REF', 'ALT', 'QUAL', 'FILTER'].map((header) => (
                            <th 
                              key={header}
                              scope="col" 
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {vcfData.slice(0, 100).map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            {['#CHROM', 'POS', 'ID', 'REF', 'ALT', 'QUAL', 'FILTER'].map((key) => (
                              <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="max-w-xs truncate" title={String((row as any)[key] || '.')}>
                                  {String((row as any)[key] || '.')}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {vcfData.length > 100 && (
                      <div className="px-6 py-3 text-sm text-gray-500">
                        Showing first 100 of {vcfData.length.toLocaleString()} variants
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'raw' && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <pre className="text-xs text-gray-800 overflow-auto max-h-[600px] bg-white p-4 rounded border border-gray-200">
                      {vcfContent.split('\n').slice(0, 500).join('\n')}
                      {vcfContent.split('\n').length > 500 && (
                        <div className="mt-2 text-gray-500">
                          ... (truncated, showing first 500 lines)
                        </div>
                      )}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
