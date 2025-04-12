'use client';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-gray-900">

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="prose dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">About GenetoScript</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">What is GenetoScript?</h2>
            <p className="text-gray-600 dark:text-gray-300">
              GenetoScript is a free, privacy-focused web application that helps you understand how your genetic makeup might affect your response to different medications. 
              We use PharmCAT (Pharmacogenomics Clinical Annotation Tool) to analyze your genetic data and provide personalized medication insights.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Understanding PharmCAT</h2>
            <div className="bg-blue-50 dark:bg-blue-900/50 p-6 rounded-lg mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                PharmCAT is a tool developed by the Clinical Pharmacogenetics Implementation Consortium (CPIC) to standardize the interpretation of pharmacogenetic test results.
                It analyzes genetic variations that may affect how you respond to medications and provides recommendations based on established clinical guidelines.
              </p>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Features:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Analyzes genetic variants related to drug metabolism</li>
              <li>Provides evidence-based medication recommendations</li>
              <li>Uses guidelines from CPIC and other professional organizations</li>
              <li>Helps healthcare providers make informed prescribing decisions</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1. Upload Your Data</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Upload your VCF (Variant Call Format) file from genetic testing services like 23andMe or AncestryDNA.
                  Your data is processed locally and is never stored or shared.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2. Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  PharmCAT analyzes your genetic variants and compares them with known pharmacogenetic markers
                  that influence drug response.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3. Results</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Receive detailed reports with:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Genetic phenotypes affecting drug metabolism</li>
                    <li>Medication recommendations</li>
                    <li>Links to clinical guidelines</li>
                    <li>Evidence levels for each recommendation</li>
                  </ul>
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">4. Take Action</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Share your results with your healthcare provider to help inform medication decisions.
                  All recommendations should be discussed with a qualified healthcare professional.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Understanding Your Results</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>Your report includes several key components:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Genetic Phenotypes:</strong> How your genetic variations affect drug metabolism
                </li>
                <li>
                  <strong>Drug Recommendations:</strong> Personalized guidance for specific medications
                </li>
                <li>
                  <strong>Evidence Levels:</strong> The strength of scientific evidence supporting each recommendation
                </li>
                <li>
                  <strong>Clinical Guidelines:</strong> Links to professional guidelines from CPIC and other organizations
                </li>
              </ul>
              <p className="mt-4">
                All recommendations are based on peer-reviewed research and clinical guidelines from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Clinical Pharmacogenetics Implementation Consortium (CPIC)</li>
                <li>Dutch Pharmacogenetics Working Group (DPWG)</li>
                <li>PharmGKB (Pharmacogenomics Knowledge Base)</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Privacy & Security</h2>
            <div className="bg-green-50 dark:bg-green-900/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Our Commitments:</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Your genetic data is processed locally in your browser</li>
                <li>No data is stored on our servers</li>
                <li>No information is shared with third parties</li>
                <li>All processing is done in-memory and immediately deleted</li>
                <li>The service is completely free with no hidden costs</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Important Notes</h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/50 p-6 rounded-lg">
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Always consult with healthcare professionals before making any medication changes</li>
                <li>Genetic results should be considered alongside other clinical factors</li>
                <li>PharmCAT results are based on current scientific knowledge and may be updated as new research emerges</li>
                <li>Not all medications have pharmacogenetic guidelines available</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Contributing</h2>
            <div className="bg-blue-50 dark:bg-blue-900/50 p-6 rounded-lg mb-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                GenetoScript is an open-source project, and we welcome contributions from the community! Whether you're a developer, scientist, or healthcare professional, there are many ways to help improve the project:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Code contributions (features, bug fixes, optimizations)</li>
                <li>Documentation improvements</li>
                <li>Scientific expertise and guidance</li>
                <li>Bug reports and feature requests</li>
                <li>User experience feedback</li>
              </ul>
              <div className="mt-6">
                <a
                  href="https://github.com/erictreacy/PharmCAT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span>Contribute on GitHub</span>
                </a>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Additional Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a
                href="https://www.pharmgkb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">PharmGKB</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Comprehensive pharmacogenomics knowledge base
                </p>
              </a>
              <a
                href="https://cpicpgx.org"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">CPIC</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Clinical implementation guidelines and resources
                </p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
