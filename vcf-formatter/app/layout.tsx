import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RxBlueprint | Pharmacogenomic Analysis",
  description: "Personalized medicine through advanced pharmacogenomic analysis of your genetic data.",
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
    title: 'RxBlueprint',
  },
  openGraph: {
    title: 'RxBlueprint | Pharmacogenomic Analysis',
    description: 'Personalized medicine through advanced pharmacogenomic analysis of your genetic data.',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
