import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section, SectionHeading, ButtonLink, Badge, type Crumb } from '@/components/ui';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { company } from '@/data/company';
import { categories } from '@/data/products';
import { openGraphFor } from '@/lib/seo';

const TITLE = 'About YILON — Airtight & Waterproof Zippers';
const DESCRIPTION = `${company.legalName} — a National High-Tech Enterprise founded in ${company.founded} in Jiangsu, exporting airtight zippers to ${company.stats.exportCountries}+ countries.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: openGraphFor({ title: TITLE, description: DESCRIPTION, path: '/about' }),
};

const TRAIL: Crumb[] = [
  { name: 'Home', href: '/' },
  { name: 'About us', href: '/about' },
];

/** Published business metrics — nothing here is derived or estimated. */
const METRICS = [
  { term: 'Founded', detail: String(company.founded) },
  { term: 'Years in business', detail: `${company.stats.yearsInBusiness}` },
  { term: 'Export countries', detail: `${company.stats.exportCountries}+` },
  { term: 'Enterprise clients', detail: `${company.stats.enterpriseClients}+` },
  { term: 'Product series', detail: String(company.stats.productSeries) },
  { term: 'Sub-models', detail: String(company.stats.subModels) },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={`${company.brand} — airtight and waterproof zipper manufacturer`}
        trail={TRAIL}
        intro={`${company.legalName} is a National High-Tech Enterprise founded in ${company.founded} in ${company.address.city}, ${company.address.province}. We research, develop, produce and sell airtight and waterproof zippers for equipment that has to stay sealed.`}
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Company profile"
              title="A factory, not a trading house"
              intro="Everything published on this site describes what the manufacturer makes and publishes. Where a figure is not published — floor space, headcount, capacity — it is not stated here either."
            />

            <div className="prose-guide mt-8 space-y-4 text-base leading-relaxed text-steel-700">
              <p>
                {company.legalName} was founded in {company.founded} and is
                based in {company.address.town}, {company.address.city},{' '}
                {company.address.province}, {company.address.country}. The company manufactures{' '}
                {company.industry.toLowerCase()} across {company.stats.productSeries} published
                product ranges and {company.stats.subModels} published sub-models.
              </p>
              <p>
                YILON is a National High-Tech Enterprise, which reflects a focus on research and
                development rather than assembly alone. The company runs its own R&amp;D team and
                holds multiple technical patents. Its airtight and waterproof zippers are rated
                IPX6 to IPX8, with airtight builds published at a 60 kPa sealing-pressure reference
                and a durability figure of 3,000+ open/close cycles.
              </p>
              <p>
                Products are exported to more than {company.stats.exportCountries} countries and
                regions, with long-term supply relationships with more than{' '}
                {company.stats.enterpriseClients} enterprise clients worldwide. The company also
                takes part in international exhibitions.
              </p>
            </div>

            <div className="mt-10 rounded-card border border-navy-100 bg-navy-50 p-6">
              <h2 className="text-base font-bold text-navy-900">What the R&amp;D work is for</h2>
              <p className="mt-3 text-sm leading-relaxed text-steel-700">
                Airtight zipper problems are rarely solved by a catalogue part. The published
                capability is in-house R&amp;D plus OEM/ODM production: size and tape width, length
                and effective opening, colour, slider type and count, opening style, material and
                coating, waterproof rating and oil resistance, and test requirements — all produced
                to the project rather than picked off a shelf.
              </p>
              <Link
                href="/factory"
                className="mt-4 inline-flex text-sm font-semibold text-accent-600 hover:underline"
              >
                See the manufacturing capability
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-card border border-steel-200 bg-steel-50 p-6 sm:p-7">
              <h2 className="text-base font-bold text-navy-900">Published at a glance</h2>
              <dl className="mt-5 divide-y divide-steel-200">
                {METRICS.map((metric) => (
                  <div key={metric.term} className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-sm text-steel-600">{metric.term}</dt>
                    <dd className="text-lg font-bold text-navy-900">{metric.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-6 rounded-card border border-steel-200 bg-white p-6 sm:p-7">
              <h2 className="text-base font-bold text-navy-900">Export markets</h2>
              <p className="mt-3 text-sm leading-relaxed text-steel-600">
                Products are exported to more than {company.stats.exportCountries} countries and
                regions, including:
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {company.markets.map((market) => (
                  <li key={market}>
                    <Badge tone="steel">{market}</Badge>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-card border border-steel-200 bg-white p-6 sm:p-7">
              <h2 className="text-base font-bold text-navy-900">Registered address</h2>
              <address className="mt-3 space-y-1 text-sm not-italic leading-relaxed text-steel-700">
                <p>{company.legalName}</p>
                <p>
                  {company.address.street}
                  <br />
                  {company.address.town}, {company.address.city}
                  <br />
                  {company.address.province} {company.address.postcode}, {company.address.country}
                </p>
                {company.contact.phones.map((phone) => (
                  <p key={phone.href}>
                    <a
                      href={`tel:${phone.href}`}
                      className="font-medium text-navy-700 hover:text-accent-600 hover:underline"
                    >
                      Tel: {phone.display}
                    </a>
                  </p>
                ))}
                <p>
                  <a
                    href={`mailto:${company.contact.email}`}
                    className="font-medium text-navy-700 hover:text-accent-600 hover:underline"
                  >
                    Email: {company.contact.email}
                  </a>
                </p>
              </address>
              <p className="mt-4 text-sm text-steel-600">
                Contact person for sales enquiries: {company.contact.person}.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="light">
        <SectionHeading
          eyebrow="Product range"
          title={`${company.stats.productSeries} published ranges`}
          intro="Each range exists because a different combination of pressure, flexibility, material and end use calls for a different construction."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products/${category.slug}`}
              className="group rounded-card border border-steel-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-lg"
            >
              <h3 className="text-base font-bold text-navy-900 group-hover:text-navy-700">
                {category.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-600">{category.tagline}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Certifications: stated claims, presented as claims. */}
      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Certifications & documentation"
              title="What the manufacturer states"
              intro="These are the certifications and documents YILON states it holds. They are published here as claims rather than as audited facts, because no certificate files are published for public download."
            />
            <ul className="mt-8 space-y-3">
              {company.certifications.claimed.map((claim) => (
                <li
                  key={claim}
                  className="flex gap-3 rounded-card border border-steel-200 bg-white p-4 text-sm font-medium text-steel-700"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="mt-0.5 h-4 w-4 shrink-0 text-navy-500"
                  >
                    <path
                      d="M8 1.5l5 2v4c0 3.2-2 5.4-5 6.5-3-1.1-5-3.3-5-6.5v-4l5-2Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M5.6 8l1.7 1.7L10.5 6.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  {claim}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-card border-2 border-accent-200 bg-accent-50 p-6 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-800">
                Please read
              </p>
              <h2 className="mt-3 text-lg font-bold text-navy-900">
                These are stated claims, not verified documents
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-steel-700">
                {company.certifications.note}
              </p>
              <div className="mt-6">
                <ButtonLink href="/request-a-quote" className="w-full">
                  Request certification documents
                </ButtonLink>
              </div>
              <p className="mt-4 text-sm text-steel-600">
                Or email{' '}
                <a
                  href={`mailto:${company.contact.email}`}
                  className="font-semibold text-accent-700 hover:underline"
                >
                  {company.contact.email}
                </a>{' '}
                with your project reference.
              </p>
            </div>

            <div className="mt-6 rounded-card border border-steel-200 bg-steel-50 p-6 sm:p-7">
              <h2 className="text-base font-bold text-navy-900">What is not published</h2>
              <p className="mt-3 text-sm leading-relaxed text-steel-600">
                Factory floor area, staff numbers, equipment lists and production capacity are not
                published by the manufacturer, so they are not stated on this site. What is
                published is the capability set and the customisation envelope.
              </p>
              <Link
                href="/factory"
                className="mt-4 inline-flex text-sm font-semibold text-accent-600 hover:underline"
              >
                Manufacturing capability
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="light">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">
              Start with your specification
            </h2>
            <p className="mt-4 text-base leading-relaxed text-steel-600">
              Send the application, opening length and host material. Sampling is a 7–15 day
              reference and mass production 15–30 days, subject to confirmation against your
              project.
            </p>
          </div>
          <ButtonLink href="/request-a-quote" size="lg" className="shrink-0">
            Request a Quote
          </ButtonLink>
        </div>
      </Section>

      <JsonLd id="about-breadcrumbs" data={breadcrumbSchema(TRAIL)} />
    </>
  );
}
