import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, PageHero, Section, ButtonLink, type Crumb } from '@/components/ui';
import { ProductCard } from '@/components/home/ProductCard';
import { GuideBody } from '@/components/content/GuideBody';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { guides, getGuide } from '@/data/guides';
import { getProductById } from '@/data/products';
import { getApplication } from '@/data/applications';
import { siteUrl } from '@/data/company';
import { OG_IMAGE, clampDescription, guideAliasTitle } from '@/lib/seo';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

/**
 * Canonical strategy
 * ------------------
 * `/blog/[slug]` and `/technology/[slug]` serve the same published article set,
 * which would otherwise be duplicate content on two URLs.
 *
 * `/technology/[slug]` is the canonical version: it sits under the section the
 * guides are navigated from, it is the URL the footer and the header dropdown
 * link to, and it is the URL that carries the article schema. The blog post for
 * the same article is kept as a readable alias — it renders the identical body
 * via the shared `GuideBody` component — but declares `alternates.canonical`
 * pointing at the technology URL, and carries no article schema of its own, so
 * search engines consolidate the two URLs instead of splitting signals between
 * them.
 *
 * The one thing the alias must not do is repeat the canonical page's `<title>`
 * byte for byte — see `guideAliasTitle`, which suffixes it so the two routes
 * never render an identical title even though they are one article.
 */
const canonicalFor = (slug: string) => `/technology/${slug}`;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  const description = clampDescription(guide.summary);

  return {
    title: guideAliasTitle(guide),
    description,
    keywords: guide.seoKeyword,
    alternates: { canonical: canonicalFor(guide.slug) },
    openGraph: {
      type: 'article',
      // Points at the canonical URL so shared links consolidate on one page.
      url: `${siteUrl}${canonicalFor(guide.slug)}`,
      title: `${guideAliasTitle(guide)} | YILON`,
      description,
      publishedTime: guide.updated,
      modifiedTime: guide.updated,
      images: [OG_IMAGE],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const canonicalPath = canonicalFor(guide.slug);

  const trail: Crumb[] = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: guide.title, href: `/blog/${guide.slug}` },
  ];

  const relatedProducts = guide.relatedProductIds
    .map((id) => getProductById(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  const relatedApplications = guide.relatedApplicationSlugs
    .map((applicationSlug) => getApplication(applicationSlug))
    .filter((application): application is NonNullable<typeof application> => Boolean(application));

  return (
    <>
      <PageHero eyebrow="Article" title={guide.title} intro={guide.subtitle} trail={trail}>
        <p className="text-sm text-steel-500">
          Updated <time dateTime={guide.updated}>{guide.updated}</time>
        </p>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <article className="lg:col-span-8">
            <div className="prose-guide">
              <GuideBody blocks={guide.blocks} />
            </div>

            <p className="mt-10 border-t border-steel-200 pt-6 text-sm text-steel-600">
              This article is maintained in the technical guides section:{' '}
              <Link href={canonicalPath} className="font-semibold text-accent-600 hover:underline">
                {guide.title}
              </Link>
              .
            </p>
          </article>

          <aside className="lg:col-span-4" aria-label="Related information">
            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="rounded-card border border-steel-200 bg-steel-50 p-6">
                <h2 className="text-base font-bold text-navy-900">Request a Quote</h2>
                <p className="mt-3 text-sm leading-relaxed text-steel-600">
                  Send the drawing, the host material and the rating you are working to. We will
                  confirm the series and the test conditions against your project.
                </p>
                <div className="mt-5">
                  <ButtonLink href="/request-a-quote" className="w-full">
                    Request a Quote
                  </ButtonLink>
                </div>
              </div>

              {relatedApplications.length ? (
                <nav
                  aria-labelledby="post-applications"
                  className="rounded-card border border-steel-200 bg-white p-6"
                >
                  <h2 id="post-applications" className="text-base font-bold text-navy-900">
                    Related applications
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {relatedApplications.map((application) => (
                      <li key={application.slug}>
                        <Link
                          href={`/applications/${application.slug}`}
                          className="text-sm font-medium text-navy-700 hover:text-accent-600 hover:underline"
                        >
                          {application.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}

              <nav
                aria-labelledby="post-more"
                className="rounded-card border border-steel-200 bg-white p-6"
              >
                <h2 id="post-more" className="text-base font-bold text-navy-900">
                  More articles
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {guides
                    .filter((other) => other.slug !== guide.slug)
                    .slice(0, 5)
                    .map((other) => (
                      <li key={other.slug}>
                        <Link
                          href={`/blog/${other.slug}`}
                          className="text-sm font-medium text-navy-700 hover:text-accent-600 hover:underline"
                        >
                          {other.title}
                        </Link>
                      </li>
                    ))}
                </ul>
                <p className="mt-4">
                  <Link
                    href="/blog"
                    className="text-sm font-semibold text-accent-600 hover:underline"
                  >
                    All articles
                  </Link>
                </p>
              </nav>
            </div>
          </aside>
        </div>
      </Section>

      {relatedProducts.length ? (
        <Section tone="light">
          <h2 className="text-2xl font-bold tracking-tight text-navy-900">
            Products covered by this article
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-steel-600">
            Specification values on these product pages are reproduced verbatim from the
            manufacturer’s published parameter tables.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Section>
      ) : null}

      <section className="bg-navy-900 py-14 sm:py-16">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Specify a sealed opening with confidence
              </h2>
              <p className="mt-4 text-base leading-relaxed text-navy-100">
                Sampling is a 7–15 day reference and mass production 15–30 days, subject to
                confirmation. Send your parameters and we will quote against them.
              </p>
            </div>
            <ButtonLink href="/request-a-quote" size="lg" className="shrink-0">
              Request a Quote
            </ButtonLink>
          </div>
        </Container>
      </section>

      <JsonLd id="post-breadcrumbs" data={breadcrumbSchema(trail)} />
    </>
  );
}
