import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section, SectionHeading, ButtonLink, type Crumb } from '@/components/ui';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { productPath, products, type Product } from '@/data/products';
import { getGuide, type Block } from '@/data/guides';
import { openGraphFor } from '@/lib/seo';

const TITLE = 'IPX Waterproof Ratings Explained: IPX6, IPX7, IPX8';
const DESCRIPTION =
  'What IPX6, IPX7 and IPX8 test conditions mean under IEC 60529, which YILON airtight zipper series carry each rating, and what IPX alone does not tell you.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: 'IPX7 IPX8 waterproof rating, IPX6 test conditions, waterproof zipper rating',
  alternates: { canonical: '/technology/ipx-ratings' },
  openGraph: openGraphFor({
    title: TITLE,
    description: DESCRIPTION,
    path: '/technology/ipx-ratings',
    type: 'article',
  }),
};

const TRAIL: Crumb[] = [
  { name: 'Home', href: '/' },
  { name: 'Technology', href: '/technology' },
  { name: 'IPX ratings', href: '/technology/ipx-ratings' },
];

const isTable = (block: Block): block is Extract<Block, { type: 'table' }> =>
  block.type === 'table';

/**
 * The rating chart is read straight out of the published IPX guide rather than
 * retyped here, so the test conditions on this page can never drift from the
 * guide they are quoted from.
 */
const ipxGuide = getGuide('ipx-waterproof-rating-guide');
const chart = ipxGuide?.blocks.find(isTable);

const seriesAtRating = (rating: string): Product[] =>
  products.filter((product) => product.specs.waterproofRating === rating);

const chartRows =
  chart?.rows.map(([rating, conditions, protection, uses]) => ({
    rating,
    conditions,
    protection,
    uses,
    series: seriesAtRating(rating),
  })) ?? [];

/** Products the manufacturer publishes without a waterproof rating. */
const unrated = products.filter((product) => !product.specs.waterproofRating);

const RATED_LEVELS = [
  {
    rating: 'IPX8',
    meaning: 'Continuous immersion',
    guidance:
      'Defined by agreement rather than by a fixed depth, so the test depth and duration have to be stated for the project. This is the level the plastic, self-healing, circular and drysuit builds are published at.',
  },
  {
    rating: 'IPX7',
    meaning: 'Temporary immersion (1 m, 30 min)',
    guidance:
      'Suited to gear that is submerged briefly and then drained, rather than equipment that has to hold pressure.',
  },
  {
    rating: 'IPX6',
    meaning: 'Powerful water jets',
    guidance:
      'Suited to gear exposed to driven rain, spray and wash-down rather than immersion. This is the level the nylon woven range is published at.',
  },
] as const;

const CAVEATS = [
  {
    title: 'IPX covers water ingress only',
    body: 'An IPX rating does not equal airtightness or pressure retention. An airtight assembly needs a sealing-pressure test as well — the published reference across the range is 60 kPa.',
  },
  {
    title: 'IPX8 is defined by agreement',
    body: 'The standard does not fix a depth or duration for IPX8. "IPX8" on its own is incomplete: the depth, duration and mounting method must be stated and agreed before the test means anything.',
  },
  {
    title: 'One product can hold several ratings',
    body: 'A single zipper can pass more than one rating, and the rating achieved depends on the assembly it is fitted into. Rely on the test report for the configuration you are buying.',
  },
  {
    title: 'Ask for the report, not the logo',
    body: 'Ask suppliers for third-party or factory test reports for the specific rating you need, at the depth and duration your product will see.',
  },
] as const;

const DEFINE_AT_SELECTION = [
  'Test depth and pressure',
  'Duration of the test',
  'Mounting method — the zipper tested loose is not the zipper installed',
  'End structure and how the opening is finished',
  'Whether the zipper must be opened and closed repeatedly',
] as const;

function SeriesList({ series }: { series: Product[] }) {
  if (!series.length) {
    return (
      <span className="text-xs italic text-steel-500">
        No YILON series is published at this rating
      </span>
    );
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

export default function IpxRatingsPage() {
  return (
    <>
      <PageHero
        eyebrow="Technology"
        title="IPX waterproof ratings explained"
        trail={TRAIL}
        intro="IPX is the water-protection code in IEC 60529: the higher the number, the stronger the protection. Zipper specifications most often quote IPX6, IPX7 and IPX8. This page sets out the published test conditions behind each rating, which series carry them, and the limits of using IPX alone to specify a sealed zipper."
      />

      {chartRows.length ? (
        <Section tone="white">
          <SectionHeading
            eyebrow="Rating chart"
            title="What each rating actually tests"
            intro="Test conditions below are the published conditions from the IPX guide. The final column lists the YILON series whose product data publishes that rating."
          />

          <div className="mt-10 overflow-x-auto rounded-card border border-steel-200">
            <table className="w-full min-w-[56rem] border-collapse text-left text-sm lg:min-w-0">
              <caption className="border-b border-steel-200 bg-steel-50 px-4 py-3 text-left text-sm font-semibold text-navy-900">
                IPX ratings, published test conditions and YILON series
              </caption>
              <thead>
                <tr className="border-b border-steel-200 bg-steel-50">
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600">
                    Rating
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600">
                    Test conditions
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600">
                    Protection
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600">
                    Typical uses
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600">
                    YILON series
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartRows.map((row) => (
                  <tr key={row.rating} className="border-b border-steel-100 align-top last:border-0">
                    <th scope="row" className="px-4 py-4 font-bold text-navy-900">
                      {row.rating}
                    </th>
                    <td className="px-4 py-4 text-steel-700">{row.conditions}</td>
                    <td className="px-4 py-4 text-steel-700">{row.protection}</td>
                    <td className="px-4 py-4 text-steel-700">{row.uses}</td>
                    <td className="px-4 py-4 text-steel-700">
                      <SeriesList series={row.series} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-steel-600">
            IPX4 and IPX5 conditions are published for reference. No YILON series publishes an IPX4
            or IPX5 rating.
          </p>
        </Section>
      ) : null}

      <Section tone="light">
        <SectionHeading
          eyebrow="Which series, which rating"
          title="Mapping the range to the rating it publishes"
          intro="Waterproof rating is one value in the published parameter table of each product. These are the three levels the range currently covers."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {RATED_LEVELS.map((level) => {
            const series = seriesAtRating(level.rating);
            return (
              <div
                key={level.rating}
                className="flex flex-col rounded-card border border-steel-200 bg-white p-6 shadow-[var(--shadow-card)]"
              >
                <p className="text-2xl font-bold tracking-tight text-navy-900">{level.rating}</p>
                <p className="mt-1 text-sm font-semibold text-navy-700">{level.meaning}</p>
                <p className="mt-3 text-sm leading-relaxed text-steel-600">{level.guidance}</p>
                <div className="mt-5 border-t border-steel-100 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-steel-500">
                    {series.length} published series
                  </p>
                  <ul className="mt-3 space-y-2">
                    {series.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={productPath(product)}
                          className="text-sm font-medium text-navy-700 hover:text-accent-600 hover:underline"
                        >
                          {product.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {unrated.length ? (
          <div className="mt-6 rounded-card border border-navy-100 bg-navy-50 p-6">
            <h3 className="text-base font-bold text-navy-900">
              Published without a waterproof rating
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-steel-700">
              {unrated.map((product) => product.name).join(', ')} — the manufacturer publishes no
              waterproof or airtight rating for{' '}
              {unrated.length === 1 ? 'this product' : 'these products'}. It is specified for
              cycling durability inside a door curtain rather than for immersion, so an IPX figure
              would be misleading.
            </p>
            <ul className="mt-4 space-y-2">
              {unrated.map((product) => (
                <li key={product.id}>
                  <Link
                    href={productPath(product)}
                    className="text-sm font-semibold text-accent-600 hover:underline"
                  >
                    {product.name} specifications
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Limits of the rating"
              title="What an IPX number does not tell you"
            />
            <ul className="mt-8 space-y-5">
              {CAVEATS.map((caveat) => (
                <li key={caveat.title} className="rounded-card border border-steel-200 bg-white p-5">
                  <h3 className="text-base font-bold text-navy-900">{caveat.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel-600">{caveat.body}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-card border border-navy-100 bg-navy-50 p-6">
              <h2 className="text-base font-bold text-navy-900">
                Define these before you test
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-steel-700">
                An IPX rating only means something once the test configuration is fixed. When
                selecting, agree these points with the supplier:
              </p>
              <ul className="mt-5 space-y-3">
                {DEFINE_AT_SELECTION.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-steel-700">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-card border border-steel-200 bg-white p-6">
              <h2 className="text-base font-bold text-navy-900">YILON testing</h2>
              <p className="mt-3 text-sm leading-relaxed text-steel-600">
                IPX6–IPX8 full-rating testing is published across the range. Airtight zippers
                additionally carry a 60 kPa sealing-pressure test, with factory reports included.
                Certification documents are available on request.
              </p>
              <div className="mt-5">
                <ButtonLink href="/quality" variant="ghost" className="w-full">
                  Quality &amp; testing
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="light">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">
              Tell us the depth, duration and mounting method
            </h2>
            <p className="mt-4 text-base leading-relaxed text-steel-600">
              With those three confirmed we can recommend the series and the sealing-pressure test
              to agree against your project.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <ButtonLink href="/request-a-quote" size="lg">
              Request a Quote
            </ButtonLink>
            <ButtonLink href="/technology/ipx-waterproof-rating-guide" variant="ghost" size="lg">
              Full IPX guide
            </ButtonLink>
          </div>
        </div>
      </Section>

      <JsonLd id="ipx-breadcrumbs" data={breadcrumbSchema(TRAIL)} />
    </>
  );
}
