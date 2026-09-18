import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageHero, Section, SectionHeading, ButtonLink, type Crumb } from '@/components/ui';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { applications } from '@/data/applications';
import { getProductById, imagesFor } from '@/data/products';
import { siteUrl } from '@/data/company';

export const metadata: Metadata = {
  title: 'Airtight Zipper Applications',
  description:
    'Nine applications YILON publishes for its airtight and waterproof zippers — military gear, drysuits, protective suits, sealed bags, cold chain and cleanrooms.',
  alternates: { canonical: '/applications' },
};

const TRAIL: Crumb[] = [
  { name: 'Home', href: '/' },
  { name: 'Applications', href: '/applications' },
];

export default function ApplicationsIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Applications"
        title="Where airtight and waterproof zippers are used"
        trail={TRAIL}
        intro="Every application below is one the manufacturer publishes against its own products. Each page sets out the sealing requirements that matter for that use — rating, pressure, cycle count and assembly method — and the series that meet them."
      />

      <Section tone="white">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((application) => {
            const lead = getProductById(application.productIds[0] ?? '');
            const image = lead ? imagesFor(lead.id, 'main')[0] : undefined;

            return (
              <Link
                key={application.slug}
                href={`/applications/${application.slug}`}
                className="group flex flex-col overflow-hidden rounded-card border border-steel-200 bg-white shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-lg"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-steel-100">
                  {image ? (
                    <Image
                      src={image.src}
                      alt={`${application.name} — ${lead?.name ?? 'airtight zipper'} used for this application`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-3xl font-black text-steel-300">
                      YL
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-base font-bold text-navy-900 group-hover:text-navy-700">
                    {application.name}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-steel-600">
                    {application.headline}
                  </p>
                  <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-steel-500">
                    {application.productIds.length} matching series
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
                    Sealing requirements
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
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section tone="light">
        <SectionHeading
          eyebrow="Not sure which you need?"
          title="Send the use case and we will match the series"
          intro="Tell us the application, the opening length and the host material. We will come back with the right series, the correct rating and a quotation against your project."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/request-a-quote" size="lg">
            Request a Quote
          </ButtonLink>
          <ButtonLink href="/technology/zipper-selection-guide" variant="ghost" size="lg">
            Read the selection guide
          </ButtonLink>
        </div>
      </Section>

      <JsonLd id="applications-breadcrumbs" data={breadcrumbSchema(TRAIL)} />
      <JsonLd
        id="applications-itemlist"
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Airtight and waterproof zipper applications',
          itemListElement: applications.map((application, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: application.name,
            url: `${siteUrl}/applications/${application.slug}`,
          })),
        }}
      />
    </>
  );
}
