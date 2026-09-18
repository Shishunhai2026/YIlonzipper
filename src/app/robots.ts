import type { MetadataRoute } from 'next';
import { siteUrl } from '@/data/company';

/**
 * Crawl policy: everything public is allowed, API routes are not useful to a
 * crawler, and the sitemap is advertised on the same base URL the rest of the
 * site uses.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
