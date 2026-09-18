import type { MetadataRoute } from 'next';
import { siteUrl } from '@/data/company';
import { categories, productPath, products } from '@/data/products';
import { applications } from '@/data/applications';
import { guides } from '@/data/guides';

/**
 * Sitemap.
 *
 * The base URL comes from `siteUrl` (itself derived from NEXT_PUBLIC_SITE_URL)
 * so a staging or alternate-domain deployment never advertises the wrong host.
 *
 * Guide URLs use the guide's own `updated` date as `lastModified`; everything
 * else uses the build date, because no other page publishes a modification date
 * and inventing one per page would be noise rather than signal.
 *
 * `/blog/[slug]` mirrors the same articles as `/technology/[slug]` and declares
 * the technology URL as its canonical. Those alias URLs are deliberately NOT
 * listed here: a sitemap may only contain canonical URLs, and submitting eight
 * URLs that each canonicalise somewhere else guarantees Search Console reports
 * "Duplicate, Google chose a different canonical" for them. The `/blog` index
 * itself is self-canonical and stays listed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const buildDate = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: buildDate, changeFrequency: 'monthly', priority: 1 },
    {
      url: `${siteUrl}/products`,
      lastModified: buildDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/applications`,
      lastModified: buildDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/technology`,
      lastModified: buildDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    { url: `${siteUrl}/about`, lastModified: buildDate, changeFrequency: 'yearly', priority: 0.6 },
    {
      url: `${siteUrl}/factory`,
      lastModified: buildDate,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/quality`,
      lastModified: buildDate,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    { url: `${siteUrl}/faq`, lastModified: buildDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/blog`, lastModified: buildDate, changeFrequency: 'weekly', priority: 0.6 },
    {
      url: `${siteUrl}/technology/materials`,
      lastModified: buildDate,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/technology/ipx-ratings`,
      lastModified: buildDate,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: buildDate,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/request-a-quote`,
      lastModified: buildDate,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteUrl}/products/${category.slug}`,
    lastModified: buildDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    // Products are nested under their category — see `productPath`. A flat
    // `/products/{slug}` would 404, because `/products/{slug}` is the category
    // route.
    url: `${siteUrl}${productPath(product)}`,
    lastModified: buildDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const applicationPages: MetadataRoute.Sitemap = applications.map((application) => ({
    url: `${siteUrl}/applications/${application.slug}`,
    lastModified: buildDate,
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${siteUrl}/technology/${guide.slug}`,
    lastModified: new Date(guide.updated),
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...applicationPages,
    ...guidePages,
  ];
}
