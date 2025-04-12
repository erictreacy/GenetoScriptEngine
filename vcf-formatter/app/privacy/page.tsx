'use client';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <section className="mb-8">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              At GenetoScript, we take your privacy seriously. This Privacy Policy explains how we handle your data when you use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Collection and Processing</h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                GenetoScript is designed with privacy at its core. Here's how we handle your data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  <strong>No Data Storage:</strong> We do not store any of your genetic data or analysis results on our servers.
                </li>
                <li>
                  <strong>Local Processing:</strong> All genetic analysis is performed locally in your browser.
                </li>
                <li>
                  <strong>No Tracking:</strong> We do not use cookies or tracking mechanisms to monitor your usage.
                </li>
                <li>
                  <strong>No Personal Information:</strong> We do not collect any personally identifiable information.
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How Your Data is Processed</h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                When you upload a VCF file:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>The file is processed entirely in your browser</li>
                <li>No data is transmitted to our servers</li>
                <li>Results are generated locally and immediately discarded after viewing</li>
                <li>Your genetic data never leaves your device</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Our service includes links to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>PharmGKB - For pharmacogenetic knowledge and guidelines</li>
                <li>CPIC - For clinical implementation guidelines</li>
                <li>GitHub - For our open-source code repository</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">
                These third-party services have their own privacy policies and terms of service.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We implement several security measures:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>HTTPS encryption for all web traffic</li>
                <li>Local-only data processing</li>
                <li>Immediate data disposal after analysis</li>
                <li>No server-side storage of genetic information</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We may update this privacy policy from time to time. We will notify users of any material changes by posting the new privacy policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-300">
              If you have any questions about this Privacy Policy, please contact us through our{' '}
              <a
                href="https://github.com/erictreacy/PharmCAT/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                GitHub Issues
              </a>{' '}
              page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
