import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonLink, Container, Section, SectionHeading, Badge } from '@/components/ui';
import { ProductCard } from '@/components/home/ProductCard';
import { BannerCarousel } from '@/components/home/BannerCarousel';
import { banners } from '@/data/banners';
import { products, categories, imagesFor, productPath } from '@/data/products';
import { applications } from '@/data/applications';
import { faqs } from '@/data/faq';
import { company, siteUrl } from '@/data/company';
import { JsonLd } from '@/components/seo/JsonLd';
import { openGraphFor } from '@/lib/seo';

// The root layout's `title.template` applies to descendant segments only, so
// this title is rendered as-is (no " | YILON" suffix) — keep it inside 60.
const TITLE = 'Airtight & Waterproof Zipper Manufacturer';
const DESCRIPTION =
  'YILON manufactures airtight and waterproof zippers to IPX6–IPX8 with 60 kPa sealing and 3,000+ cycle durability. OEM/ODM sizes from 5 cm to 100 m.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: openGraphFor({ title: TITLE, description: DESCRIPTION, path: '/' }),
};

const HOME_FAQS = faqs.filter((f) =>
  [
    'what-is-airtight-waterproof-zipper',
    'which-size-5-8-10',
    'ipx6-ipx7-ipx8',
    'customisation-parameters',
    'lead-times',
    'moq',
  ].includes(f.id),
);

const CAPABILITIES = [
  {
    title: 'Manufacturer, not a trading house',
    body: `A National High-Tech Enterprise founded in ${company.founded}, with its own R&D team and multiple patents. You are quoting the factory.`,
    icon: 'factory',
  },
  {
    title: 'IPX6–IPX8, with test reports',
    body: 'Full-range waterproof rating testing. Airtight builds additionally carry a 60 kPa sealing-pressure test with factory reports included.',
    icon: 'shield',
  },
  {
    title: 'Full customisation',
    body: 'Size #5/#8/#10, chain width 35–70 mm, length 5 cm–100 m, colour, slider and opening style — all produced to your project.',
    icon: 'sliders',
  },
  {
    title: 'Process matched to your material',
    body: 'HF welding, sewing with seam tape, and bonding. The assembly method is chosen to suit the host material and sealing grade.',
    icon: 'weld',
  },
] as const;

const ICONS: Record<string, string> = {
  factory: 'M3 21V9l6-4v4l6-4v4l6-3v15H3Zm4-3h2v-2H7v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Z',
  shield: 'M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3Zm-1 12l5-5-1.4-1.4L11 12.2 9.4 10.6 8 12l3 3Z',
  sliders: 'M4 7h16M4 12h16M4 17h16',
  weld: 'M13 3l-2 7h5l-6 11 1.5-8H7l6-10Z',
};

export default function HomePage() {
  const hero = imagesFor('1', 'main')[0];

  return (
    <>
      {/* ------------------------------------------------------ Banner carousel */}
      {/* Contained rather than full-bleed: the artwork is only ~1160px wide and
          Next never upscales past a source's intrinsic width, so stretching it
          across a wide viewport would be pure browser-side interpolation.
          Deliberately a bare <section> + <Container> rather than the Section
          primitive, whose py-14 sm:py-20 is too much air for a strip that sits
          directly under the header — the same choice the hero below makes. */}
      <section className="bg-white pt-6 sm:pt-8">
        <Container>
          <BannerCarousel images={banners} />
        </Container>
      </section>

      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden bg-navy-900">
        <div className="absolute inset-0">
          {/* Decorative only: aria-hidden, object-cover, painted at 25% opacity
              under a navy gradient. It is not the LCP element, so it must not
              claim a High-priority preload slot ahead of the carousel. */}
          {hero ? (
            <Image
              src={hero.src}
              alt=""
              aria-hidden="true"
              fill
              sizes="100vw"
              className="object-cover opacity-25"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/95 to-navy-900/70" />
        </div>

        <Container className="relative py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-navy-100 backdrop-blur">
              Airtight &amp; Waterproof Zipper Manufacturer
            </p>

            <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Airtight and waterproof zippers, engineered to hold pressure
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-100">
              YILON manufactures airtight and waterproof zippers rated IPX6 to IPX8, tested to
              60 kPa sealing strength and rated for 3,000+ open/close cycles. Sizes #5, #8 and
              #10 in TPU, PEVA, silicone rubber and nylon woven — produced to order from 5 cm to
              100 m.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="/request-a-quote" size="lg">
                Request a Quote
              </ButtonLink>
              <ButtonLink href="/products" variant="onDark" size="lg">
                Browse the product range
              </ButtonLink>
            </div>

            <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-4">
              {[
                { dt: 'Founded', dd: String(company.founded) },
                { dt: 'Countries served', dd: `${company.stats.exportCountries}+` },
                { dt: 'Enterprise clients', dd: `${company.stats.enterpriseClients}+` },
                { dt: 'Product series', dd: String(company.stats.productSeries) },
              ].map((s) => (
                <div key={s.dt}>
                  <dt className="text-xs font-medium uppercase tracking-wider text-navy-300">
                    {s.dt}
                  </dt>
                  <dd className="mt-1 text-2xl font-bold text-white">{s.dd}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* -------------------------------------------------------- Capabilities */}
      <Section tone="white">
        <SectionHeading
          eyebrow="Why YILON"
          title="A zipper factory that publishes its numbers"
          intro="Airtight zippers are not a commodity — two suppliers can both quote “IPX8” and still perform completely differently under pressure. Here is what we make public."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((c) => (
            <div
              key={c.title}
              className="rounded-card border border-steel-200 bg-white p-6 shadow-[var(--shadow-card)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-100 text-navy-700">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d={ICONS[c.icon]} />
                </svg>
              </span>
              <h3 className="mt-4 text-base font-bold text-navy-900">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-600">{c.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------------- Products */}
      <Section tone="light">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Product range"
            title="Nine airtight and waterproof zipper series"
            intro="From heavy-duty #10 plastic builds for military and pressure-sealed assemblies, through flexible TPU-coated nylon woven zippers, to a silicone rubber drysuit envelope rated for continuous immersion."
          />
          <ButtonLink href="/products" variant="ghost">
            All products
          </ButtonLink>
        </div>

        {/* No `priority` on these cards: the grid sits well below the fold, so
            preloading them only contends with the hero carousel for the same
            connection budget. */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------ Categories */}
      <Section tone="white">
        <SectionHeading
          eyebrow="Shop by category"
          title="Five categories, one sealing problem each"
          intro="Every series exists because a different combination of pressure, flexibility, material and end use calls for a different construction."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/products/${c.slug}`}
              className="group rounded-card border border-steel-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-bold text-navy-900 group-hover:text-navy-700">
                  {c.name}
                </h3>
                <span className="shrink-0 text-xs font-semibold text-steel-400">
                  {c.productIds.length} series
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-steel-600">{c.tagline}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- Applications */}
      <Section tone="steel">
        <SectionHeading
          eyebrow="Applications"
          title="Where these zippers go"
          intro="Each application page sets out the sealing requirements that actually matter for that use — ratings, pressure, cycle counts and assembly method."
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((a) => (
            <Link
              key={a.slug}
              href={`/applications/${a.slug}`}
              className="flex items-center justify-between gap-4 rounded-card border border-navy-100 bg-white px-5 py-4 transition-colors hover:border-navy-300"
            >
              <span className="text-sm font-semibold text-navy-900">{a.name}</span>
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-steel-400">
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

      {/* ----------------------------------------------------------- Customisation */}
      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              eyebrow="OEM / ODM"
              title="Custom-built to your assembly, not picked off a shelf"
              intro="Every order is produced to the length, width, colour and opening style your product needs. Send the drawing or the host material and we will quote against it."
            />
            <dl className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-steel-500">
                  Length range
                </dt>
                <dd className="mt-1.5 text-lg font-bold text-navy-900">
                  {company.customisation.lengthRange}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-steel-500">
                  Sampling
                </dt>
                <dd className="mt-1.5 text-lg font-bold text-navy-900">
                  {company.customisation.sampleLeadTime}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-steel-500">
                  Mass production
                </dt>
                <dd className="mt-1.5 text-lg font-bold text-navy-900">
                  {company.customisation.productionLeadTime}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-steel-500">
                  MOQ
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-steel-700">
                  {company.customisation.moq}
                </dd>
              </div>
            </dl>
            <div className="mt-8">
              <ButtonLink href="/request-a-quote" size="lg">
                Start a quote
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-card border border-steel-200 bg-steel-50 p-7">
            <h3 className="text-base font-bold text-navy-900">What we can customise</h3>
            <ul className="mt-5 space-y-3">
              {company.customisation.options.map((opt) => (
                <li key={opt} className="flex gap-3 text-sm text-steel-700">
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
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------------------- FAQ */}
      <Section tone="light">
        <SectionHeading
          eyebrow="Common questions"
          title="Technical questions buyers ask first"
          intro="Full answers to these and many more are on the FAQ page."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {HOME_FAQS.map((f) => (
            <div key={f.id} className="rounded-card border border-steel-200 bg-white p-6">
              <h3 className="text-base font-bold text-navy-900">{f.question}</h3>
              <p className="mt-3 text-sm leading-relaxed text-steel-600">{f.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <ButtonLink href="/faq" variant="ghost">
            All frequently asked questions
          </ButtonLink>
        </div>
      </Section>

      {/* -------------------------------------------------------------- Final CTA */}
      <section className="bg-navy-900 py-16 sm:py-20">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <Badge tone="accent">Request a Quote</Badge>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Send us your drawing, material and target rating
              </h2>
              <p className="mt-4 text-base leading-relaxed text-navy-100">
                Tell us the application, opening length and host material. We will come back with
                the right series, the correct rating and a quotation — usually within one working
                day.
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

      {/* No FAQPage here. The same answers are abbreviated on this page and
          published in full on /faq, and that page is the one that should hold
          the FAQ markup — emitting the set from both made Google choose between
          two candidate URLs for the same questions. The visible Q&A stays. */}
      <JsonLd
        id="home-itemlist"
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Airtight and waterproof zipper range',
          itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p.name,
            url: `${siteUrl}${productPath(p)}`,
          })),
        }}
      />
    </>
  );
}
