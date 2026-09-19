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
  /**
   * No `alternates.canonical` here, deliberately. A default would be inherited
   * by every route that does not declare its own — including `not-found.tsx`,
   * which was left claiming to be the homepage at `/`. Every page in `src/app`
   * sets its own canonical, and a page that forgets one is better off emitting
   * nothing (a missing canonical self-canonicalises) than claiming to be `/`.
   */
  /**
   * Defaults only. Every page supplies its own `openGraph` via openGraphFor()
   * in src/lib/seo.ts, because Next REPLACES this object rather than merging it
   * — a page that omits it inherits everything below, including the title and
   * description of the homepage.
   *
   * `url` is deliberately absent here for the same reason: scrapers fall back to
   * the page's own URL when og:url is missing, which is correct, whereas a
   * homepage value inherited by an inner page is actively wrong.
   */
  openGraph: {
    type: 'website',
    siteName: company.brand,
    locale: 'en_US',
    title: `${company.brand} — Airtight & Waterproof Zipper Manufacturer`,
    description:
      'IPX6–IPX8 airtight and waterproof zippers, 60 kPa sealing strength, 3,000+ cycles. Custom sizes, materials and lengths from 5 cm to 100 m.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'An airtight zipper shown underwater at sunset, with the IPX8 rating badge',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${company.brand} — Airtight & Waterproof Zipper Manufacturer`,
    description:
      'IPX6–IPX8 airtight and waterproof zippers, 60 kPa sealing strength, 3,000+ cycles. Custom sizes, materials and lengths from 5 cm to 100 m.',
    images: ['/og-image.jpg'],
  },
  /**
   * No `robots` here either, for the same reason as `alternates` above. Next
   * renders <meta name="robots" content="noindex"> for the 404 route by itself
   * (see `NonIndex` in next/dist/server/app-render), and a default declared
   * here is inherited rather than overridden — so it landed on the 404 page as
   * a second tag reading "index, follow", directly contradicting the first.
   *
   * Nothing is lost by omitting it: index/follow, max-image-preview:large and
   * max-snippet:-1 are all crawler defaults, so the absence of the tag and the
   * tag itself mean the same thing. Pages that want to state it can, as
   * /request-a-quote does.
   */
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
