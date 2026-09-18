import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section, ButtonLink, type Crumb } from '@/components/ui';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { FAQ_GROUPS, faqs, faqsByGroup, type FaqItem } from '@/data/faq';
import { getProductById, productPath } from '@/data/products';
import { company } from '@/data/company';

export const metadata: Metadata = {
  title: `Airtight Waterproof Zipper FAQ — ${faqs.length} Questions`,
  description:
    'All 24 published questions on airtight and waterproof zippers — selection, IPX ratings, materials, installation, testing, customisation, lead times and MOQ.',
  alternates: { canonical: '/faq' },
};

const TRAIL: Crumb[] = [
  { name: 'Home', href: '/' },
  { name: 'FAQ', href: '/faq' },
];

/** Anchor slug for a group heading, used by the in-page contents list. */
const groupId = (group: FaqItem['group']) => group.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const GROUP_INTROS: Record<FaqItem['group'], string> = {
  Product: 'What the range covers and what each series is for.',
  Selection: 'How to narrow the range down to the right series for your product.',
  Technical: 'Ratings, pressure, temperature, installation and maintenance.',
  Quality: 'What is tested, and how a sample is confirmed before mass production.',
  Ordering: 'What to send with an enquiry, and the published reference lead times.',
  Company: 'Who manufactures the zippers, and where the export markets are.',
};

function FaqEntry({ item }: { item: FaqItem }) {
  const linked = (item.productIds ?? [])
    .map((id) => getProductById(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <details className="group border-b border-steel-200 last:border-0">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-base font-semibold text-navy-900 marker:hidden hover:text-navy-700 [&::-webkit-details-marker]:hidden">
        <span>{item.question}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="mt-1 h-4 w-4 shrink-0 text-steel-400 transition-transform group-open:rotate-180"
        >
          <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </summary>
      <div className="pb-6 pr-8">
        <p className="text-sm leading-relaxed text-steel-600">{item.answer}</p>
        {linked.length ? (
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="text-steel-500">Related series:</span>
            {linked.map((product) => (
              <Link
                key={product.id}
                href={productPath(product)}
                className="font-medium text-navy-700 hover:text-accent-600 hover:underline"
              >
                {product.shortName}
              </Link>
            ))}
          </p>
        ) : null}
      </div>
    </details>
  );
}

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        trail={TRAIL}
        intro={`All ${faqs.length} questions the manufacturer publishes about airtight and waterproof zippers — selection, ratings, materials, testing, customisation and ordering. Nothing has been added, removed or reworded.`}
      >
        <nav aria-label="FAQ sections" className="rounded-card border border-navy-100 bg-white p-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-steel-500">
            Jump to a section
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {FAQ_GROUPS.map((group) => (
              <li key={group}>
                <a
                  href={`#${groupId(group)}`}
                  className="inline-flex items-center gap-2 rounded-md border border-steel-200 px-3 py-2 text-sm font-semibold text-navy-800 transition-colors hover:border-navy-300 hover:bg-navy-50"
                >
                  {group}
                  <span className="text-xs font-medium text-steel-500">
                    {faqsByGroup(group).length}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <Section tone="white">
        <div className="max-w-4xl">
          {FAQ_GROUPS.map((group) => (
            <section key={group} aria-labelledby={groupId(group)} className="mb-12 last:mb-0">
              <h2
                id={groupId(group)}
                className="scroll-mt-24 text-xl font-bold tracking-tight text-navy-900 sm:text-2xl"
              >
                {group}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-steel-600">{GROUP_INTROS[group]}</p>
              <div className="mt-4 border-t border-steel-200">
                {faqsByGroup(group).map((item) => (
                  <FaqEntry key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </Section>

      <Section tone="light">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">
              Question not answered here?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-steel-600">
              Send the application, the opening length and the host material. We will confirm the
              series, the rating and the test conditions for your project — sampling is a 7–15 day
              reference and mass production 15–30 days, subject to confirmation.
            </p>
            <p className="mt-4 text-sm text-steel-600">
              Or email{' '}
              <a
                href={`mailto:${company.contact.email}`}
                className="font-semibold text-accent-600 hover:underline"
              >
                {company.contact.email}
              </a>
              .
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <ButtonLink href="/request-a-quote" size="lg">
              Request a Quote
            </ButtonLink>
            <ButtonLink href="/technology" variant="ghost" size="lg">
              Technical guides
            </ButtonLink>
          </div>
        </div>
      </Section>

      <JsonLd id="faq-schema" data={faqSchema(faqs)} />
      <JsonLd id="faq-breadcrumbs" data={breadcrumbSchema(TRAIL)} />
    </>
  );
}
