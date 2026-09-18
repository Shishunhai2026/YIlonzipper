import Image from 'next/image';
import Link from 'next/link';
import { imagesFor, productPath, type Product } from '@/data/products';
import { Badge } from '@/components/ui';

/**
 * Product card used on the home page, product index and category pages.
 * Falls back to a text-only card if a product has no library image, rather than
 * rendering a broken image.
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const main = imagesFor(product.id, 'main')[0];

  return (
    <Link
      href={productPath(product)}
      className="group flex flex-col overflow-hidden rounded-card border border-steel-200 bg-white shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-steel-100">
        {main ? (
          <Image
            src={main.src}
            alt={`${product.name} — ${product.summary}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-steel-300">YL</div>
        )}
        {product.specs.waterproofRating ? (
          <span className="absolute left-3 top-3">
            <Badge tone="navy">{product.specs.waterproofRating}</Badge>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-navy-900 group-hover:text-navy-700">
          {product.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-steel-600">{product.summary}</p>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-steel-100 pt-4 text-xs">
          <div>
            <dt className="text-steel-500">Material</dt>
            <dd className="mt-0.5 font-medium text-steel-800">{product.specs.material ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-steel-500">Seal strength</dt>
            <dd className="mt-0.5 font-medium text-steel-800">{product.specs.sealStrength ?? '—'}</dd>
          </div>
        </dl>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
          View specifications
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5">
            <path
              d="M2 8h11M9 4l4 4-4 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
