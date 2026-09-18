import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section, SectionHeading, ButtonLink, Badge, type Crumb } from '@/components/ui';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { guides } from '@/data/guides';
import { siteUrl } from '@/data/company';
import { openGraphFor } from '@/lib/seo';

const TITLE = 'Technical Guides & Waterproof Zipper Technology';
const DESCRIPTION =
  'Selection, IPX ratings, materials, manufacturing and procurement guides for airtight and waterproof zippers — the manufacturer’s technical reference.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/technology' },
  openGraph: openGraphFor({ title: TITLE, description: DESCRIPTION, path: '/technology' }),
};

const TRAIL: Crumb[] = [
  { name: 'Home', href: '/' },
  { name: 'Technology', href: '/technology' },
];

/**
 * Sub-pages of the technology section that are not guides. Surfaced here so the
 * hub is the single entry point for technical reference material.
 */
const SUB_PAGES = [
  {
    href: '/technology/materials',
    label: 'Material comparison',
    description:
      'TPU, PEVA, silicone rubber and nylon woven compared using only the published specification values — and what is not published.',
  },
  {
    href: '/technology/ipx-ratings',
    label: 'IPX waterproof ratings',
    description:
      'What IPX4 to IPX8 actually test, the published conditions behind each rating, and which YILON series carry them.',
  },
  {
    href: '/quality',
    label: 'Quality & testing',
    description:
      'The test types carried out on airtight zippers, the published reference figures, and how samples are validated before mass production.',
  },
] as const;

export default function TechnologyHubPage() {
  return (
    <>
      <PageHero
        eyebrow="Technology"
        title="Airtight zip technology, written down"
        trail={TRAIL}
        intro="Eight in-depth guides plus the material, rating and quality reference pages. Written for a procurement or design engineer specifying a sealed opening — ratings, materials, assembly processes and what to validate before mass production."
      />

      <Section tone="white">
        <SectionHeading
          eyebrow="Guides"
          title="Eight guides, one sealing question each"
          intro="Every guide is the manufacturer’s own published copy, restructured so the tables and headings are real HTML rather than an image or a PDF."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/technology/${guide.slug}`}
              className="group flex flex-col rounded-card border border-steel-200 bg-white p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-base font-bold text-navy-900 group-hover:text-navy-700">
                  {guide.title}
                </h2>
                <Badge tone="steel">Guide</Badge>
              </div>
              <p className="mt-2 text-sm font-medium text-navy-700">{guide.subtitle}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-steel-600">{guide.summary}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
                Read the guide
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5">
                  <path
                    d="M2 8h11M9 4l4 4-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="light">
        <SectionHeading
          eyebrow="Reference"
          title="Look-up pages for in-project decisions"
          intro="Shorter, table-led pages for the questions that come up in almost every specification review."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SUB_PAGES.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="group flex flex-col rounded-card border border-steel-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-lg"
            >
              <h3 className="text-base font-bold text-navy-900 group-hover:text-navy-700">
                {page.label}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-steel-600">
                {page.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
                Open
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5">
                  <path
                    d="M2 8h11M9 4l4 4-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="white">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">
              Have a specification the guides do not cover?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-steel-600">
              Send the drawing, the host material and the rating you are working to. We will come
              back with the series, the assembly process and the test conditions to agree.
            </p>
          </div>
          <ButtonLink href="/request-a-quote" size="lg" className="shrink-0">
            Request a Quote
          </ButtonLink>
        </div>
      </Section>

      <JsonLd id="technology-breadcrumbs" data={breadcrumbSchema(TRAIL)} />
      <JsonLd
        id="technology-itemlist"
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Airtight and waterproof zipper technical guides',
          itemListElement: guides.map((guide, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: guide.title,
            url: `${siteUrl}/technology/${guide.slug}`,
          })),
        }}
      />
    </>
  );
}
