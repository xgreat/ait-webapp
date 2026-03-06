import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { validateEnvironment } from "../lib/env-validation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Validate environment on startup
if (typeof window === 'undefined') { // Server-side only
  const envValidation = validateEnvironment();
  if (!envValidation.valid) {
    console.error('Environment validation failed:');
    envValidation.errors.forEach(error => console.error(`❌ ${error}`));
  }
  if (envValidation.warnings.length > 0) {
    console.warn('Environment validation warnings:');
    envValidation.warnings.forEach(warning => console.warn(`⚠️ ${warning}`));
  }
}

export const metadata: Metadata = {
  title: "AIT Training Platform - Transformasi Digital Bersama Ahlinya | PLAI BMD",
  description: "Solusi pelatihan teknologi komprehensif. Mulai dari fondasi data, keamanan siber, hingga implementasi AI strategis untuk bisnis dan industri. Official Training Partner PLAI BMD.",
  keywords: ["pelatihan teknologi", "data science", "AI", "machine learning", "cyber security", "digital transformation", "PLAI BMD", "training platform"],
  authors: [{ name: "AIT Training Center" }],
  creator: "AIT Training Center",
  publisher: "PLAI BMD",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ait.plai.ac.id'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "AIT Training Platform - Transformasi Digital Bersama Ahlinya",
    description: "Solusi pelatihan teknologi komprehensif dari PLAI BMD. Fondasi data, keamanan siber, AI strategis untuk bisnis modern.",
    url: "https://ait.plai.ac.id",
    siteName: "AIT Training Platform",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AIT Training Platform - PLAI BMD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIT Training Platform - Transformasi Digital Bersama Ahlinya",
    description: "Solusi pelatihan teknologi komprehensif dari PLAI BMD.",
    images: ["/og-image.jpg"],
    creator: "@ait_training",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
