import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section, SectionHeading, ButtonLink, type Crumb } from '@/components/ui';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { company } from '@/data/company';
import { getGuide, type Block } from '@/data/guides';
import { categoryLinks } from '@/data/navigation';
import { openGraphFor } from '@/lib/seo';

const TITLE = 'Manufacturing — Airtight Zipper Production';
const DESCRIPTION =
  'How YILON assembles airtight zippers — HF welding, sewing with seam tape and bonding — from enquiry and sampling through to mass production.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/factory' },
  openGraph: openGraphFor({ title: TITLE, description: DESCRIPTION, path: '/factory' }),
};

const TRAIL: Crumb[] = [
  { name: 'Home', href: '/' },
  { name: 'Manufacturing', href: '/factory' },
];

const isTable = (block: Block): block is Extract<Block, { type: 'table' }> =>
  block.type === 'table';
const isList = (block: Block): block is Extract<Block, { type: 'ul' }> => block.type === 'ul';

/**
 * The assembly-process table and the HF welding notes are read out of the
 * published TPU manufacturing guide instead of being retyped, so this page
 * cannot contradict the guide it summarises.
 */
const tpuGuide = getGuide('tpu-zipper-manufacturing');
const processTable = tpuGuide?.blocks.find(isTable);
const weldingNotes = tpuGuide?.blocks.find(isList)?.items ?? [];

const STAGES = [
  {
    step: '01',
    title: 'Enquiry',
    duration: 'Confirmed at enquiry',
    body: 'Send the application, the effective opening length, the size or tape width, the host material and the target waterproof rating. Oil resistance requirements, test conditions and acceptance criteria are agreed at this point rather than discovered later.',
    points: [
      'Use case and application',
      'Length range and effective opening length',
      'Size or tape width, colour, opening style and slider count',
      'Host material to be joined, and target rating (IPX6 / IPX7 / IPX8)',
      'Sample, trial production and mass production quantities',
    ],
  },
  {
    step: '02',
    title: 'Sampling',
    duration: company.customisation.sampleLeadTime,
    body: 'A sample is produced to the agreed drawing. The sample is what gets tested — installed into your host material rather than tested loose — because the finished assembly is what has to pass, not the zipper on its own.',
    points: [
      'Model, colour, length, opening style, slider and end structure',
      'Dimensions and tolerances measured against the agreed drawing',
      'Open/close cycle testing against the published 3,000+ figure',
      'Airtight or watertight testing at the agreed rating and conditions',
      'Assembly testing with your own material, then packaging and batch identification',
    ],
  },
  {
    step: '03',
    title: 'Mass production',
    duration: company.customisation.productionLeadTime,
    body: 'Once the sample and acceptance criteria are signed off, production runs to the agreed specification. Batch identification and traceability are set before scale-up so the delivered goods can be traced back to the agreed sample.',
    points: [
      'Lead time confirmed against specification, material and quantity',
      'Sampling method and acceptance criteria agreed',
      'Batch identification and traceability',
      'Test reports for the agreed rating supplied with the order',
    ],
  },
] as const;

export default function FactoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Manufacturing"
        title="Manufacturing capability"
        trail={TRAIL}
        intro="This page is about what the manufacturer can do, not about a building. It covers the published assembly processes, the customisation envelope, and what happens between an enquiry and a shipped mass-production order."
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Capability"
              title="What the manufacturer publishes about its own operation"
              intro="A short list, because it is the whole published list. Floor area, headcount, equipment schedules and capacity figures are not published, so they are not claimed here."
            />
            <ul className="mt-8 space-y-4">
              {company.capabilities.map((capability) => (
                <li
                  key={capability}
                  className="flex gap-3.5 rounded-card border border-steel-200 bg-white p-4 text-sm font-medium text-steel-700"
                >
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
                  {capability}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-card border border-steel-200 bg-steel-50 p-6 sm:p-7">
              <h2 className="text-base font-bold text-navy-900">Reference lead times</h2>
              <p className="mt-3 text-sm leading-relaxed text-steel-600">
                Published reference figures, subject to confirmation by the manufacturer against
                your specification:
              </p>
              <dl className="mt-5 divide-y divide-steel-200">
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-sm text-steel-600">Sampling</dt>
                  <dd className="text-right text-base font-bold text-navy-900">
                    {company.customisation.sampleLeadTime}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-sm text-steel-600">Mass production</dt>
                  <dd className="text-right text-base font-bold text-navy-900">
                    {company.customisation.productionLeadTime}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-sm text-steel-600">Length range</dt>
                  <dd className="text-right text-base font-bold text-navy-900">
                    {company.customisation.lengthRange}
                  </dd>
                </div>
              </dl>
              <p className="mt-5 rounded-md border border-navy-100 bg-white p-4 text-sm leading-relaxed text-steel-700">
                <span className="font-semibold text-navy-900">MOQ: </span>
                {company.customisation.moq}
              </p>
            </div>

            <div className="mt-6 rounded-card border border-steel-200 bg-white p-6 sm:p-7">
              <h2 className="text-base font-bold text-navy-900">Where the R&amp;D sits</h2>
              <p className="mt-3 text-sm leading-relaxed text-steel-600">
                {company.legalName} is a National High-Tech Enterprise founded in{' '}
                {company.founded}, with an in-house R&amp;D team and multiple technical patents.
                Process and material decisions are made in-house rather than outsourced.
              </p>
              <Link
                href="/about"
                className="mt-4 inline-flex text-sm font-semibold text-accent-600 hover:underline"
              >
                About {company.brand}
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {processTable ? (
        <Section tone="light">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <SectionHeading
                eyebrow="Assembly"
                title="Three processes, matched to the host material"
                intro="The zipper is only half the seal — the other half is how it is joined to your product. The published routes are high-frequency welding, sewing followed by seam taping, and adhesive bonding."
              />

              <div className="mt-8 overflow-x-auto rounded-card border border-steel-200">
                <table className="w-full min-w-[34rem] border-collapse text-left text-sm lg:min-w-0">
                  <caption className="border-b border-steel-200 bg-white px-4 py-3 text-left text-sm font-semibold text-navy-900">
                    {processTable.caption ?? 'Published assembly processes'}
                  </caption>
                  <thead>
                    <tr className="border-b border-steel-200 bg-white">
                      {processTable.head.map((heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {processTable.rows.map((row, r) => (
                      <tr
                        key={`process-${r}`}
                        className="border-b border-steel-100 align-top last:border-0"
                      >
                        {row.map((cell, c) =>
                          c === 0 ? (
                            <th
                              key={`process-${r}-${c}`}
                              scope="row"
                              className="px-4 py-4 font-semibold text-navy-900"
                            >
                              {cell}
                            </th>
                          ) : (
                            <td key={`process-${r}-${c}`} className="px-4 py-4 text-steel-700">
                              {cell}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {weldingNotes.length ? (
              <div className="lg:col-span-5">
                <div className="rounded-card border border-navy-100 bg-navy-50 p-6 sm:p-7">
                  <h2 className="text-base font-bold text-navy-900">
                    Why high-frequency welding matters
                  </h2>
                  <ul className="mt-5 space-y-4">
                    {weldingNotes.map((note) => (
                      <li key={note} className="flex gap-3 text-sm leading-relaxed text-steel-700">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500"
                        />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 border-t border-navy-200 pt-5 text-sm leading-relaxed text-steel-700">
                    Airtight TPU builds are published with a 60 kPa sealing strength (#10 plastic and
                    circular) and a 3,000+ open/close cycle figure.
                  </p>
                </div>

                <div className="mt-6 rounded-card border border-steel-200 bg-white p-6 sm:p-7">
                  <h2 className="text-base font-bold text-navy-900">Read the process guide</h2>
                  <p className="mt-3 text-sm leading-relaxed text-steel-600">
                    The full manufacturing guide covers construction, the welding route and the
                    sealing performance published across the range.
                  </p>
                  <Link
                    href="/technology/tpu-zipper-manufacturing"
                    className="mt-4 inline-flex text-sm font-semibold text-accent-600 hover:underline"
                  >
                    TPU airtight zipper manufacturing process
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      <Section tone="white">
        <SectionHeading
          eyebrow="Enquiry to production"
          title="Three stages, no surprises"
          intro="A custom airtight zipper order succeeds or fails on the parameters agreed up front. These are the three stages, with the published reference lead times."
        />

        <ol className="mt-12 grid gap-6 lg:grid-cols-3">
          {STAGES.map((stage) => (
            <li
              key={stage.step}
              className="flex flex-col rounded-card border border-steel-200 bg-white p-6 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-navy-800 text-xs font-bold text-white"
                >
                  {stage.step}
                </span>
                <h3 className="text-base font-bold text-navy-900">{stage.title}</h3>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-accent-700">
                {stage.duration}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-steel-600">{stage.body}</p>
              <ul className="mt-5 space-y-2.5 border-t border-steel-100 pt-4">
                {stage.points.map((point) => (
                  <li key={point} className="flex gap-2.5 text-sm text-steel-700">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-300"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-steel-600">
          The procurement checklist guide sets out the same three stages as a checklist you can work
          through with your own engineering team.{' '}
          <Link
            href="/technology/custom-zipper-procurement-checklist"
            className="font-semibold text-accent-600 hover:underline"
          >
            Read the procurement checklist
          </Link>
        </p>
      </Section>

      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="Customisation"
              title="Produced to your specification, not picked off a shelf"
              intro={`Length is produced from ${company.customisation.lengthRange} to order. Everything below is confirmed against your drawing at enquiry.`}
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {company.customisation.options.map((option) => (
                <li
                  key={option}
                  className="flex gap-3 rounded-card border border-steel-200 bg-white p-4 text-sm text-steel-700"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500"
                  />
                  <span>{option}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-card border border-navy-100 bg-white p-6 sm:p-8">
              <h2 className="text-lg font-bold text-navy-900">
                What is deliberately not on this page
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-steel-700">
                A reader evaluating a supplier often wants floor space, machine counts, staff numbers
                and monthly capacity. None of that is published by the manufacturer, so none of it is
                stated here. Rather than fill the gap with an estimate, this page stays with what can
                be traced to the published material: the capability set, the assembly processes, the
                customisation envelope and the reference lead times.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-steel-700">
                If a specific figure matters for your supplier audit, ask for it directly — it will
                be answered against your project rather than published as a general claim.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/request-a-quote">Request a Quote</ButtonLink>
                <ButtonLink href="/quality" variant="ghost">
                  Quality &amp; testing
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* The manufacturing page previously linked to no product at all. A buyer
          reading how the zippers are assembled should be able to reach what is
          assembled, without going back through the main menu. */}
      <Section tone="white">
        <SectionHeading
          eyebrow="What we make"
          title="The range these processes produce"
          intro="Five published categories, nine series. Every process described above is applied to the products below."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categoryLinks.map((category) => (
            <li key={category.href}>
              <Link
                href={category.href}
                className="flex h-full flex-col rounded-card border border-steel-200 bg-white p-5 transition-colors hover:border-navy-300"
              >
                <span className="text-sm font-semibold text-navy-900">{category.label}</span>
                {category.description ? (
                  <span className="mt-1.5 text-sm leading-relaxed text-steel-600">
                    {category.description}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <ButtonLink href="/products" variant="ghost">
            All nine series
          </ButtonLink>
        </div>
      </Section>

      <JsonLd id="factory-breadcrumbs" data={breadcrumbSchema(TRAIL)} />
    </>
  );
}
