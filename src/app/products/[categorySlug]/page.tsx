import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Badge,
  ButtonLink,
  Container,
  PageHero,
  Section,
  SectionHeading,
  type Crumb,
} from '@/components/ui';
import { ProductCard } from '@/components/home/ProductCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { getCategory, productPath, productsInCategory, categories } from '@/data/products';
import { applications } from '@/data/applications';
import { company, siteUrl } from '@/data/company';
import { clampDescription, openGraphFor } from '@/lib/seo';

type PageProps = { params: Promise<{ categorySlug: string }> };

export function generateStaticParams() {
  return categories.map((category) => ({ categorySlug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) return {};

  const title = category.name;
  const description = clampDescription(
    `${category.tagline}. Published ${category.seoKeyword} specifications and IPX ratings, with full customisation from the manufacturer.`,
  );
  const path = `/products/${category.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: openGraphFor({ title, description, path }),
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) notFound();

  const items = productsInCategory(category.slug);

  const trail: Crumb[] = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: category.name, href: `/products/${category.slug}` },
  ];

  // Applications this category's products are published against, deduplicated
  // and kept in the order the products declare them.
  const applicationSlugs = [...new Set(items.flatMap((product) => product.applicationSlugs))];
  const relatedApplications = applicationSlugs
    .map((slug) => applications.find((application) => application.slug === slug))
    .filter((application) => application !== undefined);

  return (
    <>
      <PageHero
        eyebrow="Product category"
        title={category.name}
        intro={category.tagline}
        trail={trail}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="navy">{items.length} series</Badge>
          {[...new Set(items.map((product) => product.specs.waterproofRating))]
            .filter((rating) => rating !== undefined)
            .map((rating) => (
              <Badge key={rating} tone="steel">
                {rating}
              </Badge>
            ))}
        </div>
      </PageHero>

      <Section tone="white">
        <p className="max-w-3xl text-base leading-relaxed text-steel-700">{category.description}</p>
      </Section>

      <Section tone="light">
        <SectionHeading
          eyebrow="Series in this category"
          title={`${items.length} series to compare`}
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 3} />
          ))}
        </div>
      </Section>

      {relatedApplications.length > 0 ? (
        <Section tone="steel">
          <SectionHeading
            eyebrow="Applications"
            title="Where this category is used"
            intro="These are the manufacturer's published applications for the series in this category, with the sealing requirements each one implies."
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedApplications.map((application) => (
              <Link
                key={application.slug}
                href={`/applications/${application.slug}`}
                className="flex items-center justify-between gap-4 rounded-card border border-navy-100 bg-white px-5 py-4 transition-colors hover:border-navy-300"
              >
                <span className="text-sm font-semibold text-navy-900">{application.name}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="h-4 w-4 shrink-0 text-steel-400"
                >
                  <path
                    d="M2 8h11M9 4l4 4-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      <section className="bg-navy-900 py-16 sm:py-20">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <Badge tone="accent">Request a Quote</Badge>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Quote the {category.shortName.toLowerCase()} range against your drawing
              </h2>
              <p className="mt-4 text-base leading-relaxed text-navy-100">
                Tell us the opening length, tape width, host material and target waterproof rating.
                We will confirm the series, the process and the lead time.
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

      <JsonLd id={`category-${category.slug}-breadcrumbs`} data={breadcrumbSchema(trail)} />
      <JsonLd
        id={`category-${category.slug}-itemlist`}
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: category.name,
          numberOfItems: items.length,
          itemListElement: items.map((product, i) => ({
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
