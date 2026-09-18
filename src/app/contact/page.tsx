import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink, PageHero, Section } from '@/components/ui';
import { company } from '@/data/company';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, contactPageSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Contact YILON — Airtight & Waterproof Zippers',
  description:
    'Contact YILON about airtight and waterproof zipper enquiries. Email shishunhai2026@gmail.com, call +86 18973134733, or send your specification via the form.',
  alternates: { canonical: '/contact' },
};

const CONTACT_METHODS = [
  {
    label: 'Email',
    links: [
      { text: company.contact.email, href: `mailto:${company.contact.email}` },
    ],
    note: 'Best for drawings, specifications and test requirements.',
  },
  {
    label: 'Phone',
    links: company.contact.phones.map((phone) => ({
      text: phone.display,
      href: `tel:${phone.href}`,
    })),
    note: `Ask for ${company.contact.person}.`,
  },
];

export default function ContactPage() {
  const address = company.address;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the factory, not a reseller"
        intro="YILON manufactures its own airtight and waterproof zippers. Whether you need a specification checked, a sample requested or a quotation issued, you reach the people who build it."
        trail={[
          { name: 'Home', href: '/' },
          { name: 'Contact', href: '/contact' },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/request-a-quote" size="lg">
            Request a Quote
          </ButtonLink>
          <ButtonLink href={`mailto:${company.contact.email}`} variant="ghost" size="lg">
            Email us
          </ButtonLink>
        </div>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="text-xl font-bold text-navy-900">How to reach us</h2>
            <dl className="mt-6 space-y-6">
              {CONTACT_METHODS.map((method) => (
                <div
                  key={method.label}
                  className="rounded-card border border-steel-200 bg-white p-6 shadow-[var(--shadow-card)]"
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-steel-500">
                    {method.label}
                  </dt>
                  <dd className="mt-2">
                    {method.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        {...(link.href.startsWith('http')
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="block text-lg font-bold text-navy-800 hover:text-navy-600 hover:underline"
                      >
                        {link.text}
                      </a>
                    ))}
                    <p className="mt-1.5 text-sm text-steel-600">{method.note}</p>
                  </dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-12 text-xl font-bold text-navy-900">Factory address</h2>
            <address className="mt-4 not-italic leading-relaxed text-steel-700">
              <strong className="font-semibold text-navy-900">{company.legalName}</strong>
              <br />
              {address.street}
              <br />
              {address.town}, {address.city}
              <br />
              {address.province} {address.postcode}
              <br />
              {address.country}
            </address>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-card border border-navy-100 bg-navy-50 p-7">
              <h2 className="text-base font-bold text-navy-900">Send your specification instead</h2>
              <p className="mt-3 text-sm leading-relaxed text-steel-600">
                For anything technical — a drawing, a target IPX rating, a host material — the
                quotation form captures everything our engineers need in one pass, and gives you a
                reference number to follow up with.
              </p>
              <div className="mt-6">
                <ButtonLink href="/request-a-quote">Go to the quote form</ButtonLink>
              </div>
            </div>

            <div className="mt-6 rounded-card border border-steel-200 bg-white p-7">
              <h2 className="text-base font-bold text-navy-900">Before you write</h2>
              <p className="mt-3 text-sm leading-relaxed text-steel-600">
                Many first questions are already answered in detail — production lead times,
                minimum order quantity, testing, material choice and how to validate a sample.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/faq" className="font-medium text-navy-700 hover:underline">
                    Frequently asked questions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/technology/zipper-selection-guide"
                    className="font-medium text-navy-700 hover:underline"
                  >
                    Zipper selection guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/technology/custom-zipper-procurement-checklist"
                    className="font-medium text-navy-700 hover:underline"
                  >
                    Custom order procurement checklist
                  </Link>
                </li>
                <li>
                  <Link href="/quality" className="font-medium text-navy-700 hover:underline">
                    Quality and testing
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <JsonLd id="contact-page" data={contactPageSchema()} />
      <JsonLd
        id="contact-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Home', href: '/' },
          { name: 'Contact', href: '/contact' },
        ])}
      />
    </>
  );
}
