'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { primaryNav } from '@/data/navigation';
import { company } from '@/data/company';
import { ButtonLink, Container } from '@/components/ui';

function BrandMark() {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-md bg-navy-800 text-sm font-black tracking-tight text-white"
      >
        YL
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-base font-bold tracking-tight text-navy-900">{company.brand}</span>
        <span className="mt-0.5 hidden text-[0.68rem] font-medium text-steel-500 sm:block">
          Airtight &amp; Waterproof Zippers
        </span>
      </span>
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuId = useId();

  /**
   * Menus close on navigation.
   *
   * This is done in the link handlers rather than a `useEffect` on `pathname`:
   * calling setState synchronously inside an effect triggers a second render
   * pass after every navigation (React flags this as a cascading render), and
   * the click that navigated is the actual event we care about.
   */
  const closeMenus = () => {
    setMobileOpen(false);
    setOpenMenu(null);
  };

  // Escape closes the open dropdown / mobile panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Click outside closes the dropdown.
  useEffect(() => {
    if (!openMenu) return;
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [openMenu]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-steel-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <Container>
        <div className="flex h-[var(--header-height)] items-center justify-between gap-4">
          <Link href="/" onClick={closeMenus} aria-label={`${company.brand} home`} className="shrink-0">
            <BrandMark />
          </Link>

          <nav ref={navRef} aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => {
                const active = isActive(item.href);
                if (!item.children) {
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeMenus}
                        aria-current={active ? 'page' : undefined}
                        className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                          active
                            ? 'text-navy-900'
                            : 'text-steel-600 hover:bg-navy-50 hover:text-navy-800'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                const open = openMenu === item.label;
                return (
                  <li key={item.href} className="relative">
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`${menuId}-${item.label}`}
                      onClick={() => setOpenMenu(open ? null : item.label)}
                      className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                        active ? 'text-navy-900' : 'text-steel-600 hover:bg-navy-50 hover:text-navy-800'
                      }`}
                    >
                      {item.label}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 12 12"
                        className={`h-2.5 w-2.5 transition-transform ${open ? 'rotate-180' : ''}`}
                      >
                        <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                    </button>
                    {open ? (
                      <ul
                        id={`${menuId}-${item.label}`}
                        className="absolute left-0 top-full z-50 mt-1 w-72 rounded-lg border border-steel-200 bg-white p-2 shadow-lg"
                      >
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={closeMenus}
                              className="block rounded-md px-3 py-2 text-sm text-steel-700 hover:bg-navy-50 hover:text-navy-900"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${company.contact.email}`}
              className="hidden text-sm font-medium text-steel-600 hover:text-navy-800 xl:block"
            >
              {company.contact.email}
            </a>
            <ButtonLink href="/request-a-quote" size="sm" className="hidden sm:inline-flex">
              Request a Quote
            </ButtonLink>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls={`${menuId}-mobile`}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="rounded-md p-2 text-navy-900 hover:bg-navy-50 lg:hidden"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                {mobileOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {mobileOpen ? (
        <div id={`${menuId}-mobile`} className="border-t border-steel-200 bg-white lg:hidden">
          <Container className="py-4">
            <ul className="space-y-1">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenus}
                    className="block rounded-md px-3 py-2.5 text-base font-semibold text-navy-900 hover:bg-navy-50"
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <ul className="mb-1 ml-3 border-l border-steel-200 pl-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={closeMenus}
                            className="block rounded-md px-2 py-2 text-sm text-steel-600 hover:bg-navy-50 hover:text-navy-900"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-steel-200 pt-4">
              <ButtonLink href="/request-a-quote" size="lg" className="w-full">
                Request a Quote
              </ButtonLink>
              <a
                href={`mailto:${company.contact.email}`}
                className="mt-3 block text-center text-sm text-steel-600"
              >
                {company.contact.email}
              </a>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
