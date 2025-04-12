import FileUpload from './components/FileUpload';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-gray-900">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Personalized Medicine Through
            <span className="block text-blue-600 dark:text-blue-400 mt-2">Pharmacogenomic Analysis</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Upload your genetic data (VCF file) to receive personalized medication insights based on your unique genetic profile.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              100% Free
            </span>
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Private Analysis
            </span>
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              No Data Saved
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">How It Works</h2>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-medium">Upload VCF File</span>
                    <p className="text-sm mt-1">Compatible with genetic data from 23andMe, AncestryDNA, or any VCF format</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <div>
                    <span className="font-medium">PharmCAT Analysis</span>
                    <p className="text-sm mt-1">Advanced analysis of genetic markers affecting drug metabolism and response</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <div>
                    <span className="font-medium">Comprehensive Report</span>
                    <p className="text-sm mt-1">Detailed PDF report with drug recommendations and genetic phenotype analysis</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-medium">Real-time Processing</span>
                    <p className="text-sm mt-1">Instant analysis with progress tracking and downloadable results</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Security & Privacy</h2>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <span className="font-medium">No Data Storage</span>
                    <p className="text-sm mt-1">Your genetic data is analyzed in-memory and immediately deleted after processing</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <span className="font-medium">Private Analysis</span>
                    <p className="text-sm mt-1">All processing happens locally in your browser - no data is sent to external servers</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-medium">Always Free</span>
                    <p className="text-sm mt-1">No subscription, no hidden fees - completely free to use</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <FileUpload />
        </div>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Supported file format: .vcf</p>
          <p className="mt-1">Maximum file size: 2GB</p>
          <p className="mt-4 text-xs">By uploading your genetic data, you agree to our <a href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Terms of Service</a> and <a href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Privacy Policy</a>. Your data is never stored or shared.</p>
        </div>
      </div>
    </div>
  );
}
