import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import { company, siteUrl } from '@/data/company';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.brand} — Airtight & Waterproof Zipper Manufacturer`,
    template: `%s | ${company.brand}`,
  },
  description:
    'YILON manufactures airtight and waterproof zippers — IPX6 to IPX8, 60 kPa sealing strength, 3,000+ cycles. OEM/ODM custom sizes, materials and lengths from 5 cm to 100 m.',
  applicationName: company.brand,
  authors: [{ name: company.legalName }],
  creator: company.legalName,
  publisher: company.legalName,
  formatDetection: { telephone: false, address: false, email: false },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: company.brand,
    locale: 'en_US',
    url: siteUrl,
    title: `${company.brand} — Airtight & Waterproof Zipper Manufacturer`,
    description:
      'IPX6–IPX8 airtight and waterproof zippers, 60 kPa sealing strength, 3,000+ cycles. Custom sizes, materials and lengths from 5 cm to 100 m.',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${company.brand} — Airtight & Waterproof Zipper Manufacturer`,
    description:
      'IPX6–IPX8 airtight and waterproof zippers, 60 kPa sealing strength, 3,000+ cycles. Custom sizes, materials and lengths from 5 cm to 100 m.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  category: 'Manufacturing',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#142a3a',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-steel-800 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <JsonLd id="organization" data={organizationSchema()} />
        <JsonLd id="website" data={websiteSchema()} />
      </body>
    </html>
  );
}
