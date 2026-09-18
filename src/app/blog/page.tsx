import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section, ButtonLink, type Crumb } from '@/components/ui';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { guides, guideAsPost } from '@/data/guides';
import { siteUrl } from '@/data/company';

export const metadata: Metadata = {
  title: 'Blog — Airtight & Waterproof Zipper Articles',
  description:
    'In-depth articles on airtight and waterproof zippers: selection, IPX ratings, materials, manufacturing, drysuit closures, inflatable sealing and procurement.',
  alternates: { canonical: '/blog' },
};

const TRAIL: Crumb[] = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
];

const POSTS = guides.map(guideAsPost);

export default function BlogIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Airtight and waterproof zipper articles"
        trail={TRAIL}
        intro="Long-form articles for engineers specifying a sealed opening. Each one is the manufacturer’s published technical copy, restructured so the tables and headings are readable on the web rather than locked inside a PDF."
      />

      <Section tone="white">
        <div className="space-y-6">
          {POSTS.map((post) => (
            <article
              key={post.slug}
              className="group rounded-card border border-steel-200 bg-white p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-lg sm:p-7"
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-steel-500">
                <time dateTime={post.date}>
                  {new Date(`${post.date}T00:00:00Z`).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'UTC',
                  })}
                </time>
                <span aria-hidden="true" className="text-steel-300">
                  ·
                </span>
                <span className="font-medium uppercase tracking-wider text-navy-600">
                  {post.keyword}
                </span>
              </div>

              <h2 className="mt-3 text-xl font-bold tracking-tight text-navy-900 group-hover:text-navy-700 sm:text-2xl">
                <Link href={post.href}>{post.title}</Link>
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-steel-600 sm:text-base">
                {post.excerpt}
              </p>

              <Link
                href={post.href}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600"
              >
                Read the article
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5">
                  <path
                    d="M2 8h11M9 4l4 4-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-steel-600">
          These articles are also published as the reference set in the{' '}
          <Link href="/technology" className="font-semibold text-accent-600 hover:underline">
            technical guides section
          </Link>
          , which is the canonical home for this content.
        </p>
      </Section>

      <Section tone="light">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">
              Reading is not the same as specifying
            </h2>
            <p className="mt-4 text-base leading-relaxed text-steel-600">
              Send the drawing, the host material and the rating you are working to. We will come back
              with the series, the assembly process and the test conditions to agree.
            </p>
          </div>
          <ButtonLink href="/request-a-quote" size="lg" className="shrink-0">
            Request a Quote
          </ButtonLink>
        </div>
      </Section>

      <JsonLd id="blog-breadcrumbs" data={breadcrumbSchema(TRAIL)} />
      <JsonLd
        id="blog-itemlist"
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Airtight and waterproof zipper articles',
          itemListElement: POSTS.map((post, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: post.title,
            url: `${siteUrl}${post.href}`,
          })),
        }}
      />
    </>
  );
}
