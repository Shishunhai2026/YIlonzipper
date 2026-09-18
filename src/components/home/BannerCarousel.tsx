'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

export const AUTOPLAY_MS = 5000;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Read through useSyncExternalStore rather than useState + a mount effect: the
 * server snapshot is `false`, so the prerender always contains slide 1 and never
 * starts a timer, and the client corrects on hydration without the cascading
 * second render that `react-hooks/set-state-in-effect` exists to prevent.
 */
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getServerReducedMotion = () => false;

export type BannerImage = {
  src: string;
  /** Descriptive alt text, supplied by the page from the banner data. */
  alt: string;
};

/**
 * Homepage banner carousel.
 *
 * Client-side because it holds the slide index and an autoplay interval.
 *
 * Autoplay stops for anyone who has asked for reduced motion, but the arrows and
 * dots stay live — the preference is about unsolicited movement, not about
 * removing the control. The controls are real `<button>` elements, so keyboard
 * operation needs no extra handler; the arrow-key listener is an addition rather
 * than the mechanism, matching ProductGallery's approach to its thumbnails.
 *
 * Slides advance by translating the track rather than cross-fading it. The
 * project defines no `@keyframes`, so a transform keeps animation expressed
 * through Tailwind's transition utilities, composites on the GPU, and needs no
 * extra reduced-motion path: globals.css already neutralises transition
 * durations for those users.
 */
export function BannerCarousel({ images }: { images: BannerImage[] }) {
  const count = images.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count); // wraps in both directions
    },
    [count],
  );

  const autoplay = count > 1 && !paused && !reduced;

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => {
      // A background tab keeps its interval but must not burn through slides.
      if (document.hidden) return;
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [autoplay, count]);

  // Every hook runs above this line; the early return stays below them.
  if (count === 0) return null;

  // Guard against a stale index if the image list ever shrinks on re-render.
  const current = Math.min(index, count - 1);

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Airtight and waterproof zipper applications"
      className="relative overflow-hidden rounded-card border border-steel-200 bg-navy-900 shadow-[var(--shadow-card)]"
      // Touch fires pointerenter on tap and never a matching leave, which would
      // freeze autoplay for the rest of the session — hence the pointerType guard.
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setPaused(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setPaused(false);
      }}
      // focus/blur bubble in React, so tabbing onto an arrow or dot pauses too.
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          go(current - 1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          go(current + 1);
        }
      }}
    >
      <div
        className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
        // Inline style is permitted: CSP style-src includes 'unsafe-inline', and
        // next.config.ts warns against pairing a nonce with it. A percentage
        // keeps the offset correct at every viewport width.
        style={{ transform: `translateX(-${current * 100}%)` }}
        // Silent while it moves on its own; announced once the user is in
        // control. Narrating an unattended carousel every 5s is the classic
        // screen-reader defect.
        aria-live={autoplay ? 'off' : 'polite'}
      >
        {images.map((image, i) => (
          <div
            key={image.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i === current ? undefined : true}
            className="relative aspect-[2.55/1] w-full shrink-0"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              // Only the first slide is priority, so the head carries a single
              // preload. The rest are eager rather than the default lazy: a
              // lazy slide sits translated outside this overflow-hidden box, so
              // the browser never treats it as entering the viewport and the
              // first advance to it paints an empty frame. Five banners total
              // ~550KB, which is affordable for an above-the-fold carousel.
              priority={i === 0}
              loading={i === 0 ? undefined : 'eager'}
              sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1280px) calc(100vw - 3rem), 1216px"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={() => go(current - 1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-navy-950/50 text-white backdrop-blur transition-colors hover:bg-navy-950/75"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
              <path
                d="M10 3L5 8l5 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(current + 1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-navy-950/50 text-white backdrop-blur transition-colors hover:bg-navy-950/75"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
              <path
                d="M6 3l5 5-5 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <ol className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-navy-950/45 px-3 py-1.5 backdrop-blur">
            {images.map((image, i) => (
              <li key={image.src}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-pressed={i === current}
                  aria-label={`Show slide ${i + 1} of ${count}: ${image.alt}`}
                  className={`block h-2.5 w-2.5 rounded-full transition-colors ${
                    i === current ? 'bg-accent-500 ring-2 ring-white/70' : 'bg-white/60 hover:bg-white'
                  }`}
                />
              </li>
            ))}
          </ol>
        </>
      ) : null}
    </section>
  );
}
