import type { Metadata } from 'next';
import { PageHero, Section } from '@/components/ui';
import { RfqForm } from '@/components/forms/RfqForm';
import { company } from '@/data/company';
import { getProduct } from '@/data/products';
import { getApplication } from '@/data/applications';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Request a Quote — Custom Airtight Zippers',
  description:
    'Request a quotation for custom airtight or waterproof zippers. Send your opening length, tape width, target IPX rating and quantity for an engineering reply.',
  alternates: { canonical: '/request-a-quote' },
  robots: { index: true, follow: true },
};

const WHAT_HELPS = [
  'Opening length and total length (we produce 5 cm to 100 m)',
  'Tape width, or the size you need (#5, #8, #10)',
  'Target waterproof rating — IPX6, IPX7 or IPX8',
  'Sealing pressure or the test condition you must pass',
  'Host material the zipper will be welded, sewn or bonded into',
  'Colour, slider type and opening style',
  'Estimated sample, trial and mass production quantities',
  'Any test report or acceptance criteria you require',
];

export default async function RequestQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; application?: string }>;
}) {
  const params = await searchParams;

  // Deep links from product and application pages pre-select the relevant option.
  const selectedProduct = params.product ? getProduct(params.product) : undefined;
  const selectedApplication = params.application ? getApplication(params.application) : undefined;

  return (
    <>
      <PageHero
        eyebrow="Request a Quote"
        title="Tell us what you need to seal"
        intro="Every order is produced to your specification rather than picked from a catalogue, so the fastest route to an accurate quotation is a short description of the assembly. We usually reply within one working day."
        trail={[
          { name: 'Home', href: '/' },
          { name: 'Request a Quote', href: '/request-a-quote' },
        ]}
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="text-xl font-bold text-navy-900">Your enquiry</h2>
            <p className="mt-2 text-sm leading-relaxed text-steel-600">
              Fields marked <span className="font-semibold text-accent-600">*</span> are required.
            </p>
            <div className="mt-6">
              <RfqForm
                defaultProduct={selectedProduct?.name ?? ''}
                defaultApplication={selectedApplication?.name ?? ''}
              />
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-card border border-steel-200 bg-steel-50 p-7">
              <h2 className="text-base font-bold text-navy-900">
                What to include for a fast, accurate quote
              </h2>
              <ul className="mt-5 space-y-3">
                {WHAT_HELPS.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-steel-700">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent-500"
                    >
                      <path
                        d="M3 8.5l3 3 7-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-steel-500">
                Not sure about a parameter? Send what you have and we will advise on the rest —
                selection guidance is part of what we do.
              </p>
            </div>

            <div className="mt-6 rounded-card border border-steel-200 bg-white p-7">
              <h2 className="text-base font-bold text-navy-900">Prefer to write directly?</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-steel-500">Email</dt>
                  <dd className="mt-0.5">
                    <a
                      href={`mailto:${company.contact.email}`}
                      className="font-medium text-navy-700 hover:underline"
                    >
                      {company.contact.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-steel-500">Phone</dt>
                  <dd className="mt-0.5 space-y-0.5">
                    {company.contact.phones.map((phone) => (
                      <a
                        key={phone.href}
                        href={`tel:${phone.href}`}
                        className="block font-medium text-navy-700 hover:underline"
                      >
                        {phone.display}
                      </a>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="text-steel-500">Contact</dt>
                  <dd className="mt-0.5 text-steel-700">{company.contact.person}</dd>
                </div>
                <div>
                  <dt className="text-steel-500">Address</dt>
                  <dd className="mt-0.5 text-steel-700">
                    {company.address.street}, {company.address.town}
                    <br />
                    {company.address.city}, {company.address.province}{' '}
                    {company.address.postcode}, {company.address.country}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 rounded-card border border-navy-100 bg-navy-50 p-7">
              <h2 className="text-base font-bold text-navy-900">What happens next</h2>
              <ol className="mt-4 space-y-3 text-sm text-steel-700">
                <li className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-200 text-[0.7rem] font-bold text-navy-900">
                    1
                  </span>
                  We review your specification and confirm the right series and rating.
                </li>
                <li className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-200 text-[0.7rem] font-bold text-navy-900">
                    2
                  </span>
                  You receive a quotation, plus our recommendation on material and assembly.
                </li>
                <li className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-200 text-[0.7rem] font-bold text-navy-900">
                    3
                  </span>
                  Sampling: {company.customisation.sampleLeadTime}.
                </li>
                <li className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-200 text-[0.7rem] font-bold text-navy-900">
                    4
                  </span>
                  Mass production: {company.customisation.productionLeadTime}.
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </Section>

      <JsonLd
        id="rfq-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Home', href: '/' },
          { name: 'Request a Quote', href: '/request-a-quote' },
        ])}
      />
    </>
  );
}
