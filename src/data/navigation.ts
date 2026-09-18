import { categories } from './products';
import { applications } from './applications';

export type NavLink = { label: string; href: string; description?: string };

export const primaryNav: { label: string; href: string; children?: NavLink[] }[] = [
  { label: 'Products', href: '/products' },
  {
    label: 'Applications',
    href: '/applications',
    children: applications.map((a) => ({ label: a.name, href: `/applications/${a.slug}` })),
  },
  {
    label: 'Technology',
    href: '/technology',
    children: [
      { label: 'All technical guides', href: '/technology' },
      { label: 'Materials', href: '/technology/materials' },
      { label: 'Waterproof ratings', href: '/technology/ipx-ratings' },
      { label: 'Quality & testing', href: '/quality' },
    ],
  },
  {
    label: 'Company',
    href: '/about',
    children: [
      { label: 'About us', href: '/about' },
      { label: 'Manufacturing', href: '/factory' },
      { label: 'Quality', href: '/quality' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

/** Category links used in the footer and on the products index. */
export const categoryLinks: NavLink[] = categories.map((c) => ({
  label: c.name,
  href: `/products/${c.slug}`,
  description: c.tagline,
}));

export const applicationLinks: NavLink[] = applications.map((a) => ({
  label: a.name,
  href: `/applications/${a.slug}`,
}));
