/**
 * schema.org builders.
 *
 * Kept in one place so the structured data emitted by every page is derived from
 * the same product data the page renders — the two can never disagree, which is
 * the usual cause of rich-result penalties.
 */
import { company, siteUrl } from '@/data/company';
import { productPath, type Product } from '@/data/products';
import type { FaqItem } from '@/data/faq';
import type { Guide } from '@/data/guides';

const abs = (path: string) => (path.startsWith('http') ? path : `${siteUrl}${path}`);

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: company.legalName,
  alternateName: company.brand,
  url: siteUrl,
  // Google renders this in brand search results and knowledge panels, and the
  // publisher of every Article node is expected to carry one. Without it the
  // eight guide pages were failing Article eligibility on two counts, not one.
  logo: {
    '@type': 'ImageObject',
    url: abs('/logo.png'),
    width: 512,
    height: 512,
    caption: company.brand,
  },
  slogan: 'Airtight and waterproof zipper manufacturer',
  foundingDate: String(company.founded),
  email: company.contact.email,
  telephone: company.contact.phones[0].href,
  address: {
    '@type': 'PostalAddress',
    streetAddress: company.address.street,
    addressLocality: company.address.town,
    addressRegion: company.address.province,
    postalCode: company.address.postcode,
    addressCountry: 'CN',
  },
  // One ContactPoint per published number: schema.org types `telephone` as a
  // single value, so a second number needs a second node rather than an array.
  contactPoint: company.contact.phones.map((phone) => ({
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: company.contact.email,
    telephone: phone.href,
    availableLanguage: ['en'],
  })),
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: company.brand,
  publisher: { '@id': `${siteUrl}/#organization` },
  inLanguage: 'en',
});

export const breadcrumbSchema = (trail: { name: string; href: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: abs(item.href),
  })),
});

/**
 * Product schema.
 *
 * Only fields the manufacturer actually publishes are emitted. In particular
 * `offers` is intentionally omitted — there is no published price, and inventing
 * one would be both misleading and a rich-result violation.
 */
export const productSchema = (
  product: Product,
  images: string[],
  description: string,
) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': `${siteUrl}${productPath(product)}#product`,
  name: product.name,
  description,
  image: images.map(abs),
  url: `${siteUrl}${productPath(product)}`,
  sku: `YILON-P${product.id}`,
  category: product.categorySlug.replace(/-/g, ' '),
  brand: { '@type': 'Brand', name: company.brand },
  manufacturer: { '@id': `${siteUrl}/#organization` },
  material: product.specs.material,
  additionalProperty: product.parameters
    .filter((param) => param.label !== 'Application')
    .map((param) => ({
      '@type': 'PropertyValue',
      name: param.label,
      value: param.value,
    })),
});

export const faqSchema = (items: FaqItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
});

/**
 * Guide/article schema.
 *
 * `path` defaults to the blog URL, but `/technology/[slug]` is the canonical
 * route for guide content, so that page passes its own path. Emitting the same
 * `@id` from both URLs describes them as one article entity rather than two
 * competing ones.
 *
 * `image` is required for Google's Article rich result. These guides publish no
 * artwork of their own, so they carry the site's share card — a real image that
 * exists on the site and depicts the subject, rather than a fabricated asset.
 * A per-guide illustration would be better and is a content task, not a schema
 * one.
 */
export const articleSchema = (guide: Guide, path = `/blog/${guide.slug}`) => ({
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  '@id': `${siteUrl}${path}#article`,
  headline: guide.title,
  description: guide.summary,
  image: {
    '@type': 'ImageObject',
    url: abs('/og-image.jpg'),
    width: 1200,
    height: 630,
  },
  datePublished: guide.updated,
  dateModified: guide.updated,
  inLanguage: 'en',
  author: { '@id': `${siteUrl}/#organization` },
  publisher: { '@id': `${siteUrl}/#organization` },
  mainEntityOfPage: `${siteUrl}${path}`,
  about: guide.seoKeyword,
});

export const contactPageSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  url: `${siteUrl}/contact`,
  name: `Contact ${company.brand}`,
  mainEntity: { '@id': `${siteUrl}/#organization` },
});
