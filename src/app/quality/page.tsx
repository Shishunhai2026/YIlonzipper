import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section, SectionHeading, ButtonLink, type Crumb } from '@/components/ui';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { faqs } from '@/data/faq';
import { productPath, products } from '@/data/products';

export const metadata: Metadata = {
  title: 'Quality & Testing — Airtight Zipper Tests',
  description:
    'The tests published for YILON airtight waterproof zippers — IPX6/7/8 to IEC 60529, sealing pressure, cycle life and temperature — and sample validation.',
  alternates: { canonical: '/quality' },
};

const TRAIL: Crumb[] = [
  { name: 'Home', href: '/' },
  { name: 'Quality & testing', href: '/quality' },
];

const faqById = (id: string) => faqs.find((item) => item.id === id);

const TESTS_FAQ = faqById('typical-tests');
const SAMPLE_CONFIRMATION_FAQ = faqById('sample-and-quality-confirmation');
const PRE_PRODUCTION_FAQ = faqById('sample-validation-before-mass-production');
const SEALING_PRESSURE_FAQ = faqById('sealing-pressure');
const TEMPERATURE_FAQ = faqById('temperature-range');

/** Test types the manufacturer publishes, in the order the FAQ lists them. */
const TEST_TYPES = [
  {
    name: 'Waterproof rating testing',
    detail: 'IPX6 / IPX7 / IPX8, referring to the IEC 60529 standard.',
  },
  {
    name: 'Sealing pressure & pressure-holding',
    detail: 'The airtight assemblies are published against a 60 kPa sealing-pressure reference test.',
  },
  {
    name: 'Open/close cycle life',
    detail: 'Cycle testing against the published 3,000+ open/close cycle figure.',
  },
  {
    name: 'Salt spray testing',
    detail: 'Published for assemblies used in seawater and coastal environments.',
  },
  {
    name: 'Temperature resistance testing',
    detail: 'The published TPU reference range is approximately -30°C to 70°C.',
  },
] as const;

/**
 * Reference figures, grouped from the published parameter tables rather than
 * listed by hand — so the "series" column can never disagree with the products.
 */
const REFERENCE_FIGURES = [
  {
    label: 'Sealing pressure',
    value: '60 kPa',
    figure: products.filter((product) => product.specs.sealStrength === '60 kPa'),
    context: 'Published reference sealing-pressure test on the heavy airtight builds.',
  },
  {
    label: 'Sealing pressure',
    value: '30 kPa',
    figure: products.filter((product) => product.specs.sealStrength === '30 kPa'),
    context: 'Published reference on the compact #5 resin and self-healing builds.',
  },
  {
    label: 'Durability',
    value: '3,000+ cycles',
    figure: products.filter((product) => (product.specs.durability ?? '').includes('3000')),
    context: 'Open/close cycle figure published across the range.',
  },
  {
    label: 'Temperature (TPU)',
    value: '-30°C ~ 70°C',
    figure: products.filter((product) => product.specs.heatResistance === '-30°C ~ 70°C'),
    context: 'Published heat-resistance range for TPU material.',
  },
];

export default function QualityPage() {
  return (
    <>
      <PageHero
        eyebrow="Quality & testing"
        title="Quality and testing"
        trail={TRAIL}
        intro="What is tested on an airtight waterproof zipper, the reference figures the manufacturer publishes, and how a sample is validated before a mass-production order is released."
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Test types"
              title="What is normally tested"
              intro="These are the test types the manufacturer publishes. The specific test items and standards are carried out according to project requirements and as agreed between both parties, subject to the test report."
            />
            <ul className="mt-8 space-y-4">
              {TEST_TYPES.map((test) => (
                <li key={test.name} className="rounded-card border border-steel-200 bg-white p-5">
                  <h3 className="text-base font-bold text-navy-900">{test.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel-600">{test.detail}</p>
                </li>
              ))}
            </ul>
            {TESTS_FAQ ? (
              <p className="mt-6 rounded-card border border-navy-100 bg-navy-50 p-5 text-sm leading-relaxed text-steel-700">
                {TESTS_FAQ.answer}
              </p>
            ) : null}
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-card border-2 border-accent-200 bg-accent-50 p-6 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-800">
                Please read
              </p>
              <h2 className="mt-3 text-lg font-bold text-navy-900">
                Test items and standards are per project agreement
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-steel-700">
                The figures published on this site are reference values. The specific test items and
                standards are carried out according to project requirements and as agreed between
                both parties, subject to the test report. A rating or a pressure figure is only
                meaningful alongside the test conditions it was measured under.
              </p>
              <div className="mt-6">
                <ButtonLink href="/technology/ipx-ratings" variant="ghost" className="w-full">
                  How IPX ratings are tested
                </ButtonLink>
              </div>
            </div>

            <div className="mt-6 rounded-card border border-steel-200 bg-steel-50 p-6 sm:p-7">
              <h2 className="text-base font-bold text-navy-900">Certification documents</h2>
              <p className="mt-3 text-sm leading-relaxed text-steel-600">
                Certification documents and test reports are available on request — contact us and we
                will send the originals for your project.
              </p>
              <div className="mt-5">
                <ButtonLink href="/request-a-quote" className="w-full">
                  Request test reports
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="light">
        <SectionHeading
          eyebrow="Reference figures"
          title="The numbers the manufacturer publishes"
          intro="Every figure below appears in a published product parameter table and is reproduced here unchanged. Reference figures are not guarantees — confirm them against your own project test conditions."
        />

        <div className="mt-10 overflow-x-auto rounded-card border border-steel-200 bg-white">
          <table className="w-full min-w-[44rem] border-collapse text-left text-sm lg:min-w-0">
            <caption className="border-b border-steel-200 bg-white px-4 py-3 text-left text-sm font-semibold text-navy-900">
              Published reference figures and the series they apply to
            </caption>
            <thead>
              <tr className="border-b border-steel-200 bg-steel-50">
                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600">
                  Parameter
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600">
                  Published value
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600">
                  Series
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600">
                  Context
                </th>
              </tr>
            </thead>
            <tbody>
              {REFERENCE_FIGURES.map((row) => (
                <tr
                  key={`${row.label}-${row.value}`}
                  className="border-b border-steel-100 align-top last:border-0"
                >
                  <th scope="row" className="px-4 py-4 font-semibold text-navy-900">
                    {row.label}
                  </th>
                  <td className="px-4 py-4 font-semibold text-steel-800">{row.value}</td>
                  <td className="px-4 py-4 text-steel-700">
                    <ul className="space-y-1.5">
                      {row.figure.map((product) => (
                        <li key={product.id}>
                          <Link
                            href={productPath(product)}
                            className="font-medium text-navy-700 hover:text-accent-600 hover:underline"
                          >
                            {product.shortName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-4 text-steel-700">{row.context}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {SEALING_PRESSURE_FAQ ? (
            <div className="rounded-card border border-steel-200 bg-white p-5">
              <h3 className="text-base font-bold text-navy-900">Sealing pressure</h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-600">
                {SEALING_PRESSURE_FAQ.answer}
              </p>
            </div>
          ) : null}
          {TEMPERATURE_FAQ ? (
            <div className="rounded-card border border-steel-200 bg-white p-5">
              <h3 className="text-base font-bold text-navy-900">Temperature range</h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-600">
                {TEMPERATURE_FAQ.answer}
              </p>
            </div>
          ) : null}
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading
          eyebrow="Sample & quality confirmation"
          title="How a sample is confirmed before mass production"
          intro="The sample is the point at which the specification stops being a description and becomes something both sides can measure. These are the published confirmation points."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {SAMPLE_CONFIRMATION_FAQ ? (
            <div className="rounded-card border border-steel-200 bg-white p-6 sm:p-7">
              <h2 className="text-lg font-bold text-navy-900">
                {SAMPLE_CONFIRMATION_FAQ.question}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-steel-600">
                {SAMPLE_CONFIRMATION_FAQ.answer}
              </p>
            </div>
          ) : null}

          {PRE_PRODUCTION_FAQ ? (
            <div className="rounded-card border border-steel-200 bg-white p-6 sm:p-7">
              <h2 className="text-lg font-bold text-navy-900">{PRE_PRODUCTION_FAQ.question}</h2>
              <p className="mt-4 text-sm leading-relaxed text-steel-600">
                {PRE_PRODUCTION_FAQ.answer}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-10 rounded-card border border-navy-100 bg-navy-50 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-navy-900">
            The finished assembly is what has to pass
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-steel-700">
            A zipper tested loose is not the zipper installed. Sample validation is carried out with
            your own material — installation testing, open/close cycling, immersion or spray testing,
            air pressure testing, bending, and a visual and dimensional check — because the seam, the
            end structure and the host material all change how the seal behaves under pressure.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/request-a-quote">Start with a sample</ButtonLink>
            <ButtonLink href="/technology/custom-zipper-procurement-checklist" variant="ghost">
              Procurement checklist
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section tone="light">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">
              Agree the acceptance criteria with us
            </h2>
            <p className="mt-4 text-base leading-relaxed text-steel-600">
              Tell us the rating, the test conditions and the acceptance criteria your project needs.
              Sampling is a 7–15 day reference and mass production 15–30 days, subject to
              confirmation.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <ButtonLink href="/request-a-quote" size="lg">
              Request a Quote
            </ButtonLink>
            <ButtonLink href="/factory" variant="ghost" size="lg">
              Manufacturing capability
            </ButtonLink>
          </div>
        </div>
      </Section>

      <JsonLd id="quality-breadcrumbs" data={breadcrumbSchema(TRAIL)} />
    </>
  );
}
