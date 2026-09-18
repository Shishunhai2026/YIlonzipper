import Link from 'next/link';
import { company } from '@/data/company';
import { categoryLinks, applicationLinks } from '@/data/navigation';
import { Container } from '@/components/ui';

const companyLinks = [
  { label: 'About us', href: '/about' },
  { label: 'Manufacturing', href: '/factory' },
  { label: 'Quality & testing', href: '/quality' },
  { label: 'Technical guides', href: '/technology' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-navy-800 bg-navy-950 text-navy-100">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-lg font-bold tracking-tight text-white">{company.brand}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-navy-200">
              {company.legalName} — a National High-Tech Enterprise manufacturing airtight and
              waterproof zippers since {company.founded}. IPX6–IPX8 tested, 60 kPa sealing
              strength, 3,000+ cycles.
            </p>

            <address className="mt-5 space-y-1.5 text-sm not-italic text-navy-200">
              <p>
                {company.address.street}, {company.address.town}
                <br />
                {company.address.city}, {company.address.province} {company.address.postcode},{' '}
                {company.address.country}
              </p>
              {company.contact.phones.map((phone) => (
                <p key={phone.href}>
                  <a href={`tel:${phone.href}`} className="hover:text-white hover:underline">
                    Tel: {phone.display}
                  </a>
                </p>
              ))}
              <p>
                <a href={`mailto:${company.contact.email}`} className="hover:text-white hover:underline">
                  Email: {company.contact.email}
                </a>
              </p>
            </address>
          </div>

          <nav aria-label="Products" className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-300">
              Products
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categoryLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-navy-200 hover:text-white hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Applications" className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-300">
              Applications
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {applicationLinks.slice(0, 6).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-navy-200 hover:text-white hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/applications" className="text-navy-200 hover:text-white hover:underline">
                  All applications
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company" className="lg:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-300">
              Company
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-navy-200 hover:text-white hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/request-a-quote"
                  className="font-semibold text-accent-300 hover:text-accent-200 hover:underline"
                >
                  Request a Quote
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-navy-800 pt-6 text-xs text-navy-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName}. All rights reserved.
          </p>
          <p>
            Exporting to {company.stats.exportCountries}+ countries · Serving{' '}
            {company.stats.enterpriseClients}+ enterprise clients
          </p>
        </div>
      </Container>
    </footer>
  );
}
