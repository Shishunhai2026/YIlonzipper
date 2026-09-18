import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
import { ProductGallery, type GalleryImage } from '@/components/products/ProductGallery';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, productSchema } from '@/lib/schema';
import { getCategory, getProduct, imagesFor, productPath, products, productsInCategory } from '@/data/products';
import { applications } from '@/data/applications';
import { faqs, type FaqItem } from '@/data/faq';
import { getGuide, type Guide } from '@/data/guides';
import { company } from '@/data/company';
import { clampDescription, openGraphFor } from '@/lib/seo';

type PageProps = { params: Promise<{ categorySlug: string; productSlug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({
    categorySlug: product.categorySlug,
    productSlug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug, productSlug } = await params;
  const product = getProduct(productSlug);
  const category = getCategory(categorySlug);
  if (!product || !category || product.categorySlug !== category.slug) return {};

  const rating = product.specs.waterproofRating;
  const title = rating ? `${product.name} — ${rating}` : product.name;
  // `product.summary` is published copy and is never edited to fit a meta
  // tag; the clamp only bounds what the SERP shows.
  const description = clampDescription(
    `${product.summary} Custom sizes and lengths from the manufacturer.`,
  );
  const path = productPath(product);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: openGraphFor({ title, description, path }),
  };
}

/**
 * Images in the order a buyer wants to see them: the hero shot, then detail
 * views, then the product in use, then any published spec sheet. Alt text is
 * built from the product name because the manifest's own alt strings are short
 * internal codes ("p0", "s3") that would tell a screen reader nothing.
 */
function galleryImages(productId: string, productName: string): GalleryImage[] {
  const groups: { role: 'main' | 'gallery' | 'scene' | 'spec'; alt: (i: number) => string }[] = [
    { role: 'main', alt: () => `${productName} — product view` },
    { role: 'gallery', alt: (i) => `${productName} — detail view ${i + 1}` },
    { role: 'scene', alt: (i) => `${productName} — product in use, view ${i + 1}` },
    { role: 'spec', alt: (i) => `${productName} — published specification sheet ${i + 1}` },
  ];

  return groups.flatMap(({ role, alt }) =>
    imagesFor(productId, role).map((asset, i) => ({ src: asset.src, alt: alt(i) })),
  );
}

/** Zero-padded variant index at the start of a variant filename (`00-slug-1.webp`). */
function variantIndexOf(src: string): number {
  const file = src.split('/').pop() ?? '';
  return Number(file.split('-')[0]);
}

const GENERIC_FAQ_IDS = [
  'what-is-airtight-waterproof-zipper',
  'ipx6-ipx7-ipx8',
  'installation-methods',
  'customisation-parameters',
];

/** Up to four published answers: the product's own first, then generic ones. */
function faqsForProduct(productId: string): FaqItem[] {
  const specific = faqs.filter((faq) => faq.productIds?.includes(productId));
  const generic = GENERIC_FAQ_IDS.map((id) => faqs.find((faq) => faq.id === id)).filter(
    (faq): faq is FaqItem => faq !== undefined,
  );

  return [...specific, ...generic]
    .filter((faq, i, all) => all.findIndex((other) => other.id === faq.id) === i)
    .slice(0, 4);
}

/**
 * Technical guides surfaced on each product page.
 *
 * Deliberately held here rather than in products.ts: scripts/verify-content.mjs
 * counts 4-space-indented `slug: '...'` lines in that file to assert there are
 * exactly 5 categories, so adding slug-shaped data there would break the check.
 *
 * Keyed by product slug. Anything absent falls back to the three guides that
 * apply to every sealed assembly — how to select, what the ratings mean, and
 * what a quotation needs.
 */
const DEFAULT_GUIDES = [
  'zipper-selection-guide',
  'ipx-waterproof-rating-guide',
  'custom-zipper-procurement-checklist',
];

const GUIDES_BY_PRODUCT: Record<string, string[]> = {
  '10-plastic-airtight-zipper': [
    'zipper-selection-guide',
    'ipx-waterproof-rating-guide',
    'custom-zipper-procurement-checklist',
  ],
  '5-plastic-airtight-zipper': [
    'zipper-selection-guide',
    'ipx-waterproof-rating-guide',
    'custom-zipper-procurement-checklist',
  ],
  'self-healing-airtight-zipper': [
    'inflatable-gear-sealing',
    'zipper-selection-guide',
    'ipx-waterproof-rating-guide',
  ],
  'peva-airtight-zipper': [
    'zipper-selection-guide',
    'airtight-vs-watertight-vs-waterproof',
    'custom-zipper-procurement-checklist',
  ],
  '5-nylon-woven-waterproof-zipper': [
    'zipper-selection-guide',
    'airtight-vs-watertight-vs-waterproof',
    'ipx-waterproof-rating-guide',
  ],
  '8-nylon-woven-waterproof-zipper': [
    'zipper-selection-guide',
    'airtight-vs-watertight-vs-waterproof',
    'ipx-waterproof-rating-guide',
  ],
  'high-speed-roller-door-zipper': [
    'tpu-zipper-manufacturing',
    'zipper-selection-guide',
    'custom-zipper-procurement-checklist',
  ],
  'circular-airtight-zipper': [
    'airtight-vs-watertight-vs-waterproof',
    'zipper-selection-guide',
    'custom-zipper-procurement-checklist',
  ],
  'drysuit-envelope-zipper': [
    'drysuit-zipper-materials',
    'ipx-waterproof-rating-guide',
    'zipper-selection-guide',
  ],
};

/** Resolves slugs to guides, dropping any that no longer exist. */
function guidesForProduct(slug: string): Guide[] {
  return (GUIDES_BY_PRODUCT[slug] ?? DEFAULT_GUIDES)
    .map((guideSlug) => getGuide(guideSlug))
    .filter((guide): guide is Guide => guide !== undefined);
}

export default async function ProductPage({ params }: PageProps) {
  const { categorySlug, productSlug } = await params;
  const product = getProduct(productSlug);
  const category = getCategory(categorySlug);
  if (!product || !category || product.categorySlug !== category.slug) notFound();

  const images = galleryImages(product.id, product.name);
  const variantImages = imagesFor(product.id, 'variant');
  const faqItems = faqsForProduct(product.id);
  const productGuides = guidesForProduct(product.slug);

  const trail: Crumb[] = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: category.name, href: `/products/${category.slug}` },
    { name: product.name, href: productPath(product) },
  ];

  const related = [
    ...productsInCategory(category.slug).filter((item) => item.id !== product.id),
    ...products.filter((item) => item.categorySlug !== category.slug).slice(0, 2),
  ];

  return (
    <>
      <PageHero
        eyebrow={category.name}
        title={product.name}
        intro={product.summary}
        trail={trail}
      />

      {/* ------------------------------------------------- Gallery + key facts */}
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={images} />

          <div>
            <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
              Product overview
            </h2>
            <p className="mt-4 text-base leading-relaxed text-steel-700">{product.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} tone="navy">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mt-8 rounded-card border border-steel-200 bg-steel-50 p-6 shadow-[var(--shadow-card)]">
              <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-steel-500">
                    Material
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-navy-900">
                    <SpecValue value={product.specs.material} />
                  </dd>
                </div>
                {product.specs.waterproofRating ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-steel-500">
                      Waterproof rating
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-navy-900">
                      <SpecValue value={product.specs.waterproofRating} />
                    </dd>
                  </div>
                ) : null}
                {product.specs.sealStrength ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-steel-500">
                      Seal strength
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-navy-900">
                      <SpecValue value={product.specs.sealStrength} />
                    </dd>
                  </div>
                ) : null}
                {product.specs.size ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-steel-500">
                      Size
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-navy-900">
                      <SpecValue value={product.specs.size} />
                    </dd>
                  </div>
                ) : null}
              </dl>

              <div className="mt-6 border-t border-steel-200 pt-6">
                <ButtonLink href={`/request-a-quote?product=${product.slug}`} size="lg">
                  Request a Quote
                </ButtonLink>
                <p className="mt-3 text-xs leading-relaxed text-steel-500">
                  Send your opening length, tape width and host material — we quote against the
                  assembly, not a catalogue number.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------- Parameter table */}
      <Section tone="light">
        <SectionHeading
          eyebrow="Published data"
          title="Full specifications"
          intro="Reproduced verbatim from the manufacturer's product data. No value is rounded, converted or inferred."
        />

        <div className="mt-10 overflow-hidden rounded-card border border-steel-200 bg-white shadow-[var(--shadow-card)]">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">Published parameters for {product.name}</caption>
            <thead>
              <tr className="border-b border-steel-200 bg-steel-50">
                <th
                  scope="col"
                  className="w-2/5 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600"
                >
                  Parameter
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-steel-600"
                >
                  Published value
                </th>
              </tr>
            </thead>
            <tbody>
              {product.parameters.map((parameter) => (
                <tr key={parameter.key} className="border-b border-steel-100 last:border-0">
                  <th
                    scope="row"
                    className="px-5 py-3 align-top text-sm font-medium text-steel-600"
                  >
                    {parameter.label}
                  </th>
                  <td className="px-5 py-3 align-top text-steel-800">{parameter.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {product.features.length > 0 ? (
        <Section tone="white">
          <SectionHeading eyebrow="Features" title="Product features" />
          <ul className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
            {product.features.map((feature) => (
              <li key={feature} className="flex gap-3 text-sm leading-relaxed text-steel-700">
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
                {feature}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {product.variants.length > 0 ? (
        <Section tone="light">
          <SectionHeading
            eyebrow={`${product.variants.length} variants`}
            title="Variants produced for this series"
            intro="Slider arrangement, puller, colour and length combinations published for this series. Variant naming follows the manufacturer's own list."
          />

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {product.variants.map((variant) => {
              const image = variantImages.find(
                (asset) => variantIndexOf(asset.src) === variant.index,
              );

              return (
                <li
                  key={variant.index}
                  className="flex flex-col overflow-hidden rounded-card border border-steel-200 bg-white shadow-[var(--shadow-card)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-steel-100">
                    {image ? (
                      <Image
                        src={image.src}
                        alt={`${product.name} — ${variant.name}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl font-black text-steel-300">
                        YL
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-sm font-semibold text-navy-900">{variant.name}</h3>
                    <p className="mt-2 text-xs text-steel-500">
                      {variant.imageCount} {variant.imageCount === 1 ? 'image' : 'images'} published
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}

      {product.note ? (
        <Section tone="white">
          <div className="max-w-3xl rounded-card border border-navy-100 bg-navy-50 p-6">
            <h2 className="text-base font-bold text-navy-900">Good to know</h2>
            <p className="mt-2 text-sm leading-relaxed text-steel-700">{product.note}</p>
          </div>
        </Section>
      ) : null}

      {/* ------------------------------------------------------ Applications */}
      <Section tone="steel">
        <SectionHeading
          eyebrow="Applications"
          title="Where this series is used"
          intro="The manufacturer's published applications for this product. Each links to the sealing requirements that apply to that use."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {product.applications.map((name, i) => {
            const slug = product.applicationSlugs[i];
            if (!slug) return null;

            return (
              <li key={name}>
                <Link
                  href={`/applications/${slug}`}
                  className="flex items-center justify-between gap-4 rounded-card border border-navy-100 bg-white px-5 py-4 transition-colors hover:border-navy-300"
                >
                  <span className="text-sm font-semibold text-navy-900">
                    {applications.find((item) => item.slug === slug)?.name ?? name}
                  </span>
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
              </li>
            );
          })}
        </ul>
      </Section>

      {/* -------------------------------------------------- Technical guides */}
      {productGuides.length > 0 ? (
        <Section tone="light">
          <SectionHeading
            eyebrow="Technical guides"
            title="How this series is specified"
            intro="The engineering references buyers use to pin down a specification — ratings, materials and the data a quotation needs to be accurate."
          />

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productGuides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/technology/${guide.slug}`}
                  className="flex h-full flex-col rounded-card border border-steel-200 bg-white p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-lg"
                >
                  <span className="text-base font-bold text-navy-900">{guide.title}</span>
                  <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-steel-600">
                    {guide.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* -------------------------------------------------- Related products */}
      <Section tone="white">
        <SectionHeading eyebrow="Also consider" title="Related series" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </Section>

      {/* --------------------------------------------------------------- FAQ */}
      {faqItems.length > 0 ? (
        <Section tone="light">
          <SectionHeading
            eyebrow="Common questions"
            title="Questions buyers ask about this product"
          />
          <div className="mt-10 max-w-3xl space-y-3">
            {faqItems.map((faq) => (
              <details
                key={faq.id}
                className="group rounded-card border border-steel-200 bg-white p-5 shadow-[var(--shadow-card)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-4 w-4 shrink-0 text-steel-400 transition-transform group-open:rotate-180"
                  >
                    <path
                      d="M4 6l4 4 4-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-steel-600">{faq.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-sm text-steel-600">
            <Link href="/faq" className="font-semibold text-accent-600 hover:underline">
              All frequently asked questions
            </Link>
          </p>
        </Section>
      ) : null}

      {/* ------------------------------------------------------------- CTA */}
      <section className="bg-navy-900 py-16 sm:py-20">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <Badge tone="accent">Request a Quote</Badge>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Quote the {product.shortName} to your specification
              </h2>
              <p className="mt-4 text-base leading-relaxed text-navy-100">
                Length, tape width, colour, slider and opening style are all produced to order. Send
                the drawing or the host material and we will confirm the build and the lead time.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <ButtonLink href={`/request-a-quote?product=${product.slug}`} size="lg">
                Request a Quote
              </ButtonLink>
              <ButtonLink href={`mailto:${company.contact.email}`} variant="onDark" size="lg">
                Email us
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <JsonLd
        id={`product-${product.id}-schema`}
        data={productSchema(
          product,
          images.map((image) => image.src),
          product.summary,
        )}
      />
      <JsonLd id={`product-${product.id}-breadcrumbs`} data={breadcrumbSchema(trail)} />
      {/* No FAQPage here: most of these answers come from the shared published
          pool that /faq already marks up in full, so emitting them again on
          every product page put the same Q&A on ten URLs. The visible FAQ
          section below stays — only the duplicate markup is gone. */}
    </>
  );
}
