import type { Metadata } from "next";
import "./globals.css";
import Footer from './components/Footer';
import Header from './components/Header';

export const metadata: Metadata = {
  title: "GenetoScript | Pharmacogenomic Analysis",
  description: "Personalized medicine through advanced pharmacogenomic analysis of your genetic data. Free.",
  icons: {
    icon: [
      { url: '/images/logo.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/images/logo.svg', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.json',
  themeColor: '#2563EB',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GenetoScript',
  },
  openGraph: {
    title: 'GenetoScript | Pharmacogenomic Analysis',
    description: 'Personalized medicine through advanced pharmacogenomic analysis of your genetic data. Free and private.',
    images: [{ url: '/images/logo.svg', width: 512, height: 512 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased flex flex-col min-h-screen font-sans"
      >
        <Header />
        <main className="flex-grow pt-16">{children}</main>
        <Footer />
        <div id="portal-root" className="relative z-[9999]" />
      </body>
    </html>
  );
}
