'use client';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <section className="mb-8">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Please read these Terms of Service carefully before using GenetoScript.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 dark:text-gray-300">
              By accessing or using GenetoScript, you agree to be bound by these Terms of Service and all applicable laws and regulations.
              If you do not agree with any of these terms, you are prohibited from using this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Medical Disclaimer</h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/50 p-6 rounded-lg space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                GenetoScript is not a substitute for professional medical advice, diagnosis, or treatment.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Always seek the advice of your physician or other qualified health provider</li>
                <li>Never disregard professional medical advice because of something you have read on GenetoScript</li>
                <li>If you think you may have a medical emergency, call your doctor or emergency services immediately</li>
                <li>The genetic analysis provided is for informational purposes only</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Service Description</h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                GenetoScript provides:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Analysis of genetic data using PharmCAT</li>
                <li>Generation of pharmacogenetic reports</li>
                <li>Links to relevant clinical guidelines and resources</li>
                <li>Educational information about pharmacogenetics</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Use the service only for lawful purposes</li>
                <li>Not upload any malicious files or content</li>
                <li>Not attempt to breach or circumvent any security measures</li>
                <li>Not use the service in any way that could damage or impair its functionality</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Privacy and Data Handling</h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We are committed to protecting your privacy:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>All genetic analysis is performed locally in your browser</li>
                <li>We do not store any of your genetic data</li>
                <li>No personal information is collected or transmitted</li>
                <li>See our Privacy Policy for more details</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="text-gray-600 dark:text-gray-300">
              GenetoScript is open-source software licensed under the MIT License. The source code is available on GitHub.
              PharmCAT and related resources are subject to their respective licenses and terms of use.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Disclaimer of Warranties</h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
                WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 dark:text-gray-300">
              IN NO EVENT SHALL GENETOSCRIPT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
              INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We reserve the right to modify or replace these Terms at any time. We will provide notice of any material changes by posting the new Terms on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
            <p className="text-gray-600 dark:text-gray-300">
              For questions about these Terms, please contact us through our{' '}
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
