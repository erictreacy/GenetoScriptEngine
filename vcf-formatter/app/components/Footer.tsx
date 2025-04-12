import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Image src="/images/logo.svg" alt="GenetoScript Logo" width={24} height={24} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} GenetoScript. All rights reserved.
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="/privacy"
              className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              Terms of Service
            </Link>
            <a
              href="https://github.com/erictreacy/PharmCAT"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
