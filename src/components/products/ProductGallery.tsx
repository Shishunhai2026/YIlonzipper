'use client';

import Image from 'next/image';
import { useState } from 'react';

export type GalleryImage = {
  src: string;
  /** Descriptive alt text, built by the page from the product name. */
  alt: string;
};

/**
 * Product image gallery.
 *
 * Client-side because it holds the selected-image state. Thumbnails are real
 * `<button>` elements so they are reachable by Tab and activated by Enter/Space
 * without any extra key handling, and the selected one is exposed through
 * `aria-pressed`.
 */
export function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-card border border-steel-200 bg-steel-100 text-4xl font-black text-steel-300">
        YL
      </div>
    );
  }

  // Guard against a stale index if the image list ever shrinks on re-render.
  const index = Math.min(selected, images.length - 1);
  const current = images[index];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-card border border-steel-200 bg-white shadow-[var(--shadow-card)]">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority={index === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain"
        />
      </div>

      {images.length > 1 ? (
        <ul className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, i) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setSelected(i)}
                aria-pressed={i === index}
                aria-label={`Show image ${i + 1} of ${images.length}: ${image.alt}`}
                className={`block w-full overflow-hidden rounded-md border transition-colors ${
                  i === index
                    ? 'border-accent-500 ring-2 ring-accent-200'
                    : 'border-steel-200 hover:border-navy-400'
                }`}
              >
                <span className="relative block aspect-square bg-white">
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 25vw, 120px"
                    className="object-cover"
                  />
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
