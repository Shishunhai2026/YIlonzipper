import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section, SectionHeading, ButtonLink, type Crumb } from '@/components/ui';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { productPath, products, type Product } from '@/data/products';
import { openGraphFor } from '@/lib/seo';

const TITLE = 'Zipper Material Comparison: TPU, PEVA, Nylon';
const DESCRIPTION =
  'TPU, PEVA, silicone rubber and nylon woven airtight zipper materials compared using only published specification values — including what is not published.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: 'TPU vs PEVA zipper, silicone rubber drysuit zipper, nylon woven waterproof zipper',
  alternates: { canonical: '/technology/materials' },
  openGraph: openGraphFor({
    title: TITLE,
    description: DESCRIPTION,
    path: '/technology/materials',
    type: 'article',
  }),
};

const TRAIL: Crumb[] = [
  { name: 'Home', href: '/' },
  { name: 'Technology', href: '/technology' },
  { name: 'Materials', href: '/technology/materials' },
];

/** Series are grouped by the `material` value published in the parameter table. */
const byMaterial = (test: (product: Product) => boolean): Product[] =>
  products.filter(test);

const TPU_BODY = byMaterial((p) => p.specs.material === 'TPU');
const NYLON_WOVEN = byMaterial((p) => (p.specs.material ?? '').includes('Nylon'));
const PEVA = byMaterial((p) => p.specs.material === 'PEVA');
const SILICONE = byMaterial((p) => p.specs.material === 'Silicone Rubber');

type MaterialRow = {
  material: string;
  where: string;
  properties: string[];
  series: Product[];
  /** True when the manufacturer publishes no numeric figure for this material. */
  gap: string;
};

const MATERIALS: MaterialRow[] = [
  {
    material: 'TPU',
    where:
      'The one-piece body of the #10 plastic, #5 plastic, self-healing and circular airtight zippers. It is also published as the coating over polyester tape on the #5 and #8 nylon woven builds, and as one half of the TPU/PVC material of the high-speed roller door zipper.',
    properties: [
      'Heat resistance -30°C ~ 70°C',
      'Seal strength 60 kPa (#10 plastic, circular) and 30 kPa (#5 plastic, self-healing)',
      'Tensile strength 1,100 N/5 cm (#10 plastic, circular), 800 N/5 cm (#5 plastic), 160 N/5 cm (self-healing)',
      'Durability 3,000+ cycles',
      'Weather resistance: Good',
      'Oil resistance: Good',
    ],
    series: TPU_BODY,
    gap: 'No hardness, density or elongation figure is published for TPU.',
  },
  {
    material: 'PEVA',
    where: 'The PEVA airtight zipper — one series in the functional airtight range, published as the cost-optimised option for everyday waterproofing.',
    properties: [
      'Waterproof rating IPX7',
      'Colour: Black (custom)',
      'Length: customizable',
      'Process: HF welding, sewing',
      'Weather resistance: Good',
      'Environment: daily waterproofing',
    ],
    series: PEVA,
    gap: 'No temperature, seal-strength, tensile or cycle figure is published for PEVA. The published -30°C ~ 70°C figure belongs to TPU, not PEVA.',
  },
  {
    material: 'Silicone rubber',
    where: 'The drysuit envelope zipper, where continuous immersion and salt water — rather than splash resistance — are the deciding conditions.',
    properties: [
      'Waterproof rating IPX8',
      'Saltwater resistance: Excellent',
      'Environment: deep-sea high pressure',
      'Sizes: #5 / #8',
      'Colour: Black',
      'Process: HF welding, bonding',
    ],
    series: SILICONE,
    gap: 'No temperature range and no seal-strength figure is published for silicone rubber.',
  },
  {
    material: 'Nylon woven with a TPU coating',
    where: 'The #5 and #8 nylon woven waterproof zippers. The published construction is a TPU coating over polyester tape with nylon teeth — a composite rather than a one-piece sheet.',
    properties: [
      'Waterproof rating IPX6',
      'Tape width 32±1 mm',
      'Tooth width 6.2±1 mm, tooth height 3.0±0.05 mm, tape thickness 0.77±0.02 mm',
      'Weight ~35 g/m',
      'Flat pull strength ≥700 N; top stop strength ≥250 N',
      'Sliding smoothness ≤20 N; slider pull force ≤55 N',
      'Cycle test ≥3,000 cycles',
      'Colour: Black (custom)',
    ],
    series: NYLON_WOVEN,
    gap: 'No temperature range and no seal-strength figure is published for the nylon woven builds.',
  },
];

/** The material comparison published in the drysuit envelope guide. */
const DRYSUIT_COMPARISON = [
  [
    'Silicone rubber',
    'Highly flexible, weather-resistant, excellent saltwater resistance',
    'Drysuit envelopes, deep-sea and underwater rescue work',
  ],
  [
    'TPU',
    'Elasticity, abrasion and hydrolysis resistance, -30 to 70°C',
    'Airtight pressure-sealed assemblies',
  ],
  [
    'Nylon woven + TPU',
    'Soft and flexible, good watertight performance',
    'Watertight garments where a one-piece TPU build is unnecessary',
  ],
];

/** Verbatim from the selection guide's "Step 3: Choose the material". */
const SELECTION_NOTES = [
  'TPU: best all-round performance — elasticity, abrasion and hydrolysis resistance, -30 to 70°C range, first choice for airtight sealing.',
  'PEVA: lightweight and low-cost, for everyday waterproofing.',
  'Silicone rubber: highly flexible and weather-resistant, used for drysuit envelopes.',
  'Nylon: soft, good for watertight uses, but less effective than one-piece TPU for high-pressure airtight sealing.',
];

function SeriesLinks({ series }: { series: Product[] }) {
  if (!series.length) {
    return <span className="italic text-steel-400">No series published</span>;
  }
  return (
    <ul className="space-y-1.5">
      {series.map((product) => (
        <li key={product.id}>
          <Link
            href={productPath(product)}
            className="font-medium text-navy-700 hover:text-accent-600 hover:underline"
          >
            {product.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function MaterialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Technology"
        title="Airtight zipper materials compared"
        trail={TRAIL}
        intro="TPU, PEVA, silicone rubber and nylon woven, compared using only the values the manufacturer publishes. Where no figure is published, this page says so rather than filling the gap."
      />

      <Section tone="white">
        <SectionHeading
          eyebrow="Comparison"
          title="Four materials, what is published for each"
          intro="Every value below comes from the published product parameter tables or from the published technical guides. Nothing has been measured, converted or estimated for this page."
        />

        <div className="mt-10 overflow-x-auto rounded-card border border-steel-200">
          <table className="w-full min-w-[52rem] border-collapse text-left text-sm lg:min-w-0">
            <caption className="border-b border-steel-200 bg-steel-50 px-4 py-3 text-left text-sm font-semibold text-navy-900">
              Published material properties across the YILON range
            </caption>
            <thead>
              <tr className="border-b border-steel-200 bg-steel-50">
                <th scope="col" className="w-[12%] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600">
                  Material
                </th>
                <th scope="col" className="w-[28%] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600">
                  Where it appears in the range
                </th>
                <th scope="col" className="w-[38%] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600">
                  Published properties
                </th>
                <th scope="col" className="w-[22%] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600">
                  Series using it
                </th>
              </tr>
            </thead>
            <tbody>
              {MATERIALS.map((row) => (
                <tr key={row.material} className="border-b border-steel-100 align-top last:border-0">
                  <th scope="row" className="px-4 py-5 font-bold text-navy-900">
                    {row.material}
                  </th>
                  <td className="px-4 py-5 text-steel-700">{row.where}</td>
                  <td className="px-4 py-5 text-steel-700">
                    <ul className="space-y-1.5">
                      {row.properties.map((property) => (
                        <li key={property} className="flex gap-2">
                          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                          <span>{property}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-5 text-steel-700">
                    <SeriesLinks series={row.series} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section tone="light">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">
              How the selection guide puts it
            </h2>
            <p className="mt-4 text-base leading-relaxed text-steel-600">
              The published selection guide describes the four materials in one line each. This is
              the manufacturer’s own wording, unchanged.
            </p>
            <ul className="mt-6 space-y-3">
              {SELECTION_NOTES.map((note) => (
                <li
                  key={note}
                  className="flex gap-3 rounded-card border border-steel-200 bg-white p-4 text-sm leading-relaxed text-steel-700"
                >
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">
              Material behaviour for continuous immersion
            </h2>
            <p className="mt-4 text-base leading-relaxed text-steel-600">
              The drysuit envelope guide compares the same materials specifically against deep-sea
              and salt-water exposure.
            </p>
            <div className="mt-6 overflow-x-auto rounded-card border border-steel-200">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm lg:min-w-0">
                <caption className="border-b border-steel-200 bg-white px-4 py-3 text-left text-sm font-semibold text-navy-900">
                  Material comparison for drysuit closures
                </caption>
                <thead>
                  <tr className="border-b border-steel-200 bg-white">
                    <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600">
                      Material
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600">
                      Behaviour
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600">
                      Suited to
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DRYSUIT_COMPARISON.map((row) => (
                    <tr key={row[0]} className="border-b border-steel-100 align-top last:border-0">
                      <th scope="row" className="px-4 py-3 font-semibold text-navy-900">
                        {row[0]}
                      </th>
                      <td className="px-4 py-3 text-steel-700">{row[1]}</td>
                      <td className="px-4 py-3 text-steel-700">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-steel-600">
              Read the full guide:{' '}
              <Link
                href="/technology/drysuit-zipper-materials"
                className="font-semibold text-accent-600 hover:underline"
              >
                Drysuit zipper materials and test standards
              </Link>
            </p>
          </div>
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading
          eyebrow="Honest gaps"
          title="What is not published for these materials"
          intro="A material comparison is only useful if it is complete about its own limits. These figures are not published anywhere in the manufacturer’s material, so they are not stated here."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {MATERIALS.map((row) => (
            <li key={row.material} className="rounded-card border border-steel-200 bg-steel-50 p-5">
              <p className="text-sm font-bold text-navy-900">{row.material}</p>
              <p className="mt-2 text-sm leading-relaxed text-steel-600">{row.gap}</p>
            </li>
          ))}
          <li className="rounded-card border border-navy-100 bg-navy-50 p-5 sm:col-span-2">
            <p className="text-sm font-bold text-navy-900">Temperature range</p>
            <p className="mt-2 text-sm leading-relaxed text-steel-600">
              The published reference temperature range of approximately -30°C to 70°C applies to
              TPU. The manufacturer states that PEVA and silicone rubber have different temperature
              ranges, and that the specific figure is subject to the material chosen and your project
              testing.
            </p>
          </li>
          <li className="rounded-card border border-navy-100 bg-navy-50 p-5 sm:col-span-2">
            <p className="text-sm font-bold text-navy-900">Cost</p>
            <p className="mt-2 text-sm leading-relaxed text-steel-600">
              No price or cost comparison is published for any material. PEVA is published as the
              cost-optimised option and TPU as the first choice for airtight sealing; beyond that,
              material selection is confirmed per project.
            </p>
          </li>
        </ul>
      </Section>

      <Section tone="light">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">
              Send us the host material and we will confirm the build
            </h2>
            <p className="mt-4 text-base leading-relaxed text-steel-600">
              Material choice depends on the pressure, the flexing, the temperature and how the
              zipper is joined to your product. Tell us those four things and we will confirm the
              material and the process.
            </p>
          </div>
          <ButtonLink href="/request-a-quote" size="lg" className="shrink-0">
            Request a Quote
          </ButtonLink>
        </div>
      </Section>

      <JsonLd id="materials-breadcrumbs" data={breadcrumbSchema(TRAIL)} />
    </>
  );
}
