import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /**
   * IMPORTANT (Windows): the project directory is `D:\cc\zipper\Russia\yilon-en`
   * with a capital R. This workspace has been reached as `...\russia\...` in some
   * shells, and because Windows paths are case-insensitive the build succeeds
   * either way — but webpack records the path it first sees and then treats the
   * other spelling as a different module. The result is every file (including
   * React) being bundled twice, which surfaces as a confusing
   * "Cannot read properties of null (reading 'useContext')" during prerender.
   *
   * Always run npm/next from the canonical, correctly-cased path above. Keeping
   * the root pinned here also stops Turbopack walking up into the parent
   * workspace's lockfile.
   */
  turbopack: { root: __dirname },

  poweredByHeader: false,

  images: {
    // All product imagery is pre-optimised to WebP at build time by
    // scripts/build-images.mjs, so Next only needs to serve and resize it.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1600, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: false,
  },

  // Server actions post multipart form data; the default 1 MB ceiling is far
  // above the largest legitimate RFQ payload, so tighten it.
  experimental: {
    serverActions: { bodySizeLimit: '128kb' },
  },

  async headers() {
    const isDev = process.env.NODE_ENV === 'development';

    /**
     * Content-Security-Policy.
     *
     * 'unsafe-inline' for scripts is unavoidable without abandoning the static
     * prerender: Next emits an inline bootstrap/flight payload on every page and
     * the JSON-LD blocks are inline <script> elements. A nonce would make every
     * response unique and forfeit the prerender pipeline that this site is built
     * around. It still blocks external script injection, javascript: URIs and
     * object/base abuse, which is the majority of the value.
     *
     * Do NOT add a nonce alongside 'unsafe-inline' — browsers ignore the latter
     * when a nonce is present, which silently breaks every page.
     */
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
      // next/font self-hosts Inter and injects an inline @font-face block.
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "manifest-src 'self'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          // Enable only once every hostname is confirmed to serve HTTPS.
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
      {
        // Product imagery is content-hashed by path, so it can be cached hard.
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // The previous brochure site used flat .html paths; keep old links working.
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/products.html', destination: '/products', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      { source: '/faq.html', destination: '/faq', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/product-detail.html', destination: '/products', permanent: true },
      { source: '/guides', destination: '/technology', permanent: true },
      { source: '/guides/:slug', destination: '/technology/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
