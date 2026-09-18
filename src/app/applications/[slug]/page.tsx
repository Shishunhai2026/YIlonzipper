import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero, Section, SectionHeading, ButtonLink, type Crumb } from '@/components/ui';
import { ProductCard } from '@/components/home/ProductCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { applications, getApplication } from '@/data/applications';
import { getProductById, productPath } from '@/data/products';
import { company, siteUrl } from '@/data/company';
import { applicationTitle, clampDescription } from '@/lib/seo';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return applications.map((application) => ({ slug: application.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const application = getApplication(slug);
  if (!application) return {};

  // `application.intro` is published copy — the clamp shortens what the SERP
  // shows without editing the source text.
  const description = clampDescription(application.intro);

  return {
    title: applicationTitle(application.slug, application.headline),
    description,
    keywords: application.seoKeyword,
    alternates: { canonical: `/applications/${application.slug}` },
    openGraph: {
      url: `${siteUrl}/applications/${application.slug}`,
      title: `${application.headline} | YILON`,
      description,
    },
  };
}

export default async function ApplicationPage({ params }: PageProps) {
  const { slug } = await params;
  const application = getApplication(slug);
  if (!application) notFound();

  const trail: Crumb[] = [
    { name: 'Home', href: '/' },
    { name: 'Applications', href: '/applications' },
    { name: application.name, href: `/applications/${application.slug}` },
  ];

  const matched = application.productIds
    .map((id) => getProductById(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <>
      <PageHero
        eyebrow="Application"
        title={application.headline}
        intro={application.intro}
        trail={trail}
      >
        <ButtonLink href={`/request-a-quote?application=${application.slug}`} size="lg">
          Request a Quote
        </ButtonLink>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Sealing requirements"
              title={`What ${application.name.toLowerCase()} calls for`}
              intro="These are the criteria the manufacturer publishes for this kind of assembly. Confirm your own figures against the agreed test conditions."
            />
            <ul className="mt-8 space-y-4">
              {application.requirements.map((requirement) => (
                <li
                  key={requirement}
                  className="flex gap-3.5 rounded-card border border-steel-200 bg-white p-4 text-sm leading-relaxed text-steel-700"
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
                  {requirement}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-card border border-navy-100 bg-navy-50 p-6 sm:p-7">
              <h2 className="text-base font-bold text-navy-900">Quote a {application.name} build</h2>
              <p className="mt-3 text-sm leading-relaxed text-steel-700">
                Send the opening length, the host material and the target rating. Your quote request
                is pre-filled with this application so the enquiry reaches the right engineering
                desk first time.
              </p>
              <dl className="mt-6 space-y-3 border-t border-navy-200 pt-5 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-steel-600">Application</dt>
                  <dd className="text-right font-semibold text-navy-900">{application.name}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-steel-600">Matched series</dt>
                  <dd className="text-right font-semibold text-navy-900">{matched.length}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-steel-600">Length range</dt>
                  <dd className="text-right font-semibold text-navy-900">
                    {company.customisation.lengthRange}
                  </dd>
                </div>
              </dl>
              <div className="mt-6">
                <ButtonLink
                  href={`/request-a-quote?application=${application.slug}`}
                  size="lg"
                  className="w-full"
                >
                  Request a Quote
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="light">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Matched products"
            title={`${matched.length} published series for this application`}
            intro="The manufacturer publishes these series against this application. Every specification on a product page is reproduced from the published parameter table."
          />
          <ButtonLink href="/products" variant="ghost">
            All products
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matched.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 3} />
          ))}
        </div>
      </Section>

      <Section tone="white">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">
              Still comparing materials or ratings?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-steel-600">
              The technical guides cover rating selection, material comparison and what to validate
              at sample stage before committing to mass production.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <ButtonLink href="/technology/zipper-selection-guide" variant="ghost" size="lg">
              Selection guide
            </ButtonLink>
            <ButtonLink href="/technology/ipx-ratings" variant="ghost" size="lg">
              IPX ratings
            </ButtonLink>
          </div>
        </div>

        <p className="mt-10 text-sm text-steel-600">
          <Link href="/applications" className="font-semibold text-accent-600 hover:underline">
            Back to all applications
          </Link>
        </p>
      </Section>

      <JsonLd id="application-breadcrumbs" data={breadcrumbSchema(trail)} />
      <JsonLd
        id="application-itemlist"
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Airtight zipper series for ${application.name}`,
          itemListElement: matched.map((product, i) => ({
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
