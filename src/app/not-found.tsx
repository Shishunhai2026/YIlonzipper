import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink, Container } from '@/components/ui';
import { categories } from '@/data/products';

export const metadata: Metadata = {
  title: 'Page not found',
  description:
    'The page you were looking for does not exist. Browse the YILON airtight and waterproof zipper range, or contact us and we will point you to it.',
  robots: { index: false, follow: true },
};

/** Popular destinations, so a 404 still routes visitors toward a product. */
const SUGGESTIONS = [
  { label: 'All products', href: '/products' },
  ...categories.slice(0, 3).map((c) => ({ label: c.name, href: `/products/${c.slug}` })),
  { label: 'Applications', href: '/applications' },
  { label: 'Contact', href: '/contact' },
];

export default function NotFound() {
  return (
    <Container className="py-24 text-center sm:py-32">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-navy-600">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
        This page does not exist
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-steel-600">
        The link may be out of date, or the page may have moved. Everything we manufacture is
        reachable from the product range.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/products" size="lg">
          Browse products
        </ButtonLink>
        <ButtonLink href="/request-a-quote" variant="ghost" size="lg">
          Request a Quote
        </ButtonLink>
      </div>

      <nav aria-label="Suggested pages" className="mt-12">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {SUGGESTIONS.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="font-medium text-navy-700 hover:underline">
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
