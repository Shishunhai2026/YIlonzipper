import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Badge,
  ButtonLink,
  Container,
  PageHero,
  Section,
  SectionHeading,
  SpecValue,
  type Crumb,
} from '@/components/ui';
import { ProductCard } from '@/components/home/ProductCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import {
  COMPARISON_SPECS,
  categories,
  getCategory,
  productPath,
  products,
  productsInCategory,
} from '@/data/products';
import { company, siteUrl } from '@/data/company';

export const metadata: Metadata = {
  title: 'Airtight & Waterproof Zipper Series',
  description:
    'Compare nine airtight and waterproof zipper series — resin, nylon woven, PEVA, self-healing, circular and roller door — with published IPX and seal data.',
  alternates: { canonical: '/products' },
};

const TRAIL: Crumb[] = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
];

export default function ProductsIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Product range"
        title="Airtight and waterproof zippers"
        intro="Nine production series across five categories. Every value on this page is published by the manufacturer — where a field is not published, it reads “Not published” rather than an estimate."
        trail={TRAIL}
      />

      {categories.map((category, i) => {
        const items = productsInCategory(category.slug);

        return (
          <Section key={category.slug} tone={i % 2 === 0 ? 'white' : 'light'}>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow={`${items.length} series`}
                title={category.name}
                intro={category.description}
              />
              <ButtonLink href={`/products/${category.slug}`} variant="ghost">
                All {category.shortName} series
              </ButtonLink>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={i === 0 && index < 3} />
              ))}
            </div>
          </Section>
        );
      })}

      {/* ------------------------------------------------------- Comparison */}
      <Section tone="steel">
        <SectionHeading
          eyebrow="Comparison"
          title="Every published specification, side by side"
          intro="The nine series differ by size, tape width, material and sealing class. Use this table to shortlist against your own requirement, then request a quote with the drawing or host material."
        />

        <div className="mt-10 overflow-x-auto rounded-card border border-steel-200 bg-white shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[64rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Published specifications of all nine YILON airtight and waterproof zipper series.
              “Not published” means the manufacturer publishes no value for that field.
            </caption>
            <thead>
              <tr className="border-b border-steel-200 bg-steel-50">
                <th
                  scope="col"
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600"
                >
                  Series
                </th>
                {COMPARISON_SPECS.map((spec) => (
                  <th
                    key={spec.key}
                    scope="col"
                    className="min-w-[7rem] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600"
                  >
                    {spec.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-steel-100 last:border-0">
                  <th scope="row" className="min-w-[12rem] px-4 py-3 align-top">
                    <Link
                      href={productPath(product)}
                      className="font-semibold text-navy-900 hover:text-accent-600 hover:underline"
                    >
                      {product.name}
                    </Link>
                    <span className="mt-1 block text-xs font-normal text-steel-500">
                      {getCategory(product.categorySlug)?.name ?? product.categorySlug}
                    </span>
                  </th>
                  {COMPARISON_SPECS.map((spec) => (
                    <td key={spec.key} className="px-4 py-3 align-top text-steel-700">
                      <SpecValue value={product.specs[spec.key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-steel-600">
          “Not published” marks a field the manufacturer does not publish for that series. Every
          other value is reproduced verbatim from the published product data.
        </p>
      </Section>

      {/* ------------------------------------------------------------- CTA */}
      <section className="bg-navy-900 py-16 sm:py-20">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <Badge tone="accent">Request a Quote</Badge>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Not sure which of the nine series fits?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-navy-100">
                Send the application, opening length, host material and target rating. We will
                confirm the right series against your assembly and quote it — sizes, tape width,
                colour and slider to your specification.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <ButtonLink href="/request-a-quote" size="lg">
                Request a Quote
              </ButtonLink>
              <ButtonLink href={`mailto:${company.contact.email}`} variant="onDark" size="lg">
                Email us
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <JsonLd id="products-breadcrumbs" data={breadcrumbSchema(TRAIL)} />
      <JsonLd
        id="products-itemlist"
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'YILON airtight and waterproof zipper series',
          numberOfItems: products.length,
          itemListElement: products.map((product, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: product.name,
            url: `${siteUrl}${productPath(product)}`,
          })),
        }}
      />
    </>
  );
}
