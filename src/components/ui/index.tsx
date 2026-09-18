import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Shared layout container — one source of truth for horizontal rhythm. */
export function Container({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'onDark';
type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-sm',
  secondary:
    'bg-navy-800 text-white hover:bg-navy-700 active:bg-navy-900 shadow-sm',
  ghost:
    'border border-steel-300 bg-white text-navy-800 hover:border-navy-400 hover:bg-navy-50',
  onDark:
    'border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

function buttonClasses(variant: ButtonVariant, size: ButtonSize, className: string) {
  return `inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ComponentPropsWithoutRef<'button'> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className' | 'children'>) {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
  const classes = buttonClasses(variant, size, className);

  if (isExternal) {
    return (
      <a href={href} className={classes} rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

export function Section({
  children,
  className = '',
  tone = 'white',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'white' | 'light' | 'navy' | 'steel';
}) {
  const tones = {
    white: 'bg-white',
    light: 'bg-steel-50',
    navy: 'bg-navy-900 text-white',
    steel: 'bg-navy-50',
  } as const;
  return (
    <section className={`py-14 sm:py-20 ${tones[tone]} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  tone = 'light',
  as: As = 'h2',
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  as?: 'h1' | 'h2' | 'h3';
}) {
  const isDark = tone === 'dark';
  return (
    <div className={`${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
      {eyebrow ? (
        <p
          className={`mb-3 text-xs font-semibold uppercase tracking-[0.14em] ${
            isDark ? 'text-navy-200' : 'text-navy-600'
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <As
        className={`text-2xl font-bold tracking-tight sm:text-3xl lg:text-[2.1rem] ${
          isDark ? 'text-white' : 'text-navy-900'
        }`}
      >
        {title}
      </As>
      {intro ? (
        <p className={`mt-4 text-base leading-relaxed ${isDark ? 'text-navy-100' : 'text-steel-600'}`}>
          {intro}
        </p>
      ) : null}
    </div>
  );
}

export function Badge({
  children,
  tone = 'navy',
}: {
  children: ReactNode;
  tone?: 'navy' | 'accent' | 'steel' | 'success';
}) {
  const tones = {
    navy: 'bg-navy-100 text-navy-800',
    accent: 'bg-accent-100 text-accent-800',
    steel: 'bg-steel-100 text-steel-700',
    success: 'bg-emerald-100 text-emerald-800',
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export type Crumb = { name: string; href: string };

export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-steel-500">
        {trail.map((item, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-x-2">
              {isLast ? (
                <span aria-current="page" className="font-medium text-steel-700">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="hover:text-navy-700 hover:underline">
                    {item.name}
                  </Link>
                  <span aria-hidden="true" className="text-steel-300">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Page hero used by every inner page, so heading level, spacing and breadcrumb
 * placement stay consistent site-wide (and every page opens with exactly one H1).
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  trail,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  trail: Crumb[];
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-navy-100 bg-navy-50">
      <Container className="py-10 sm:py-14">
        <Breadcrumbs trail={trail} />
        <div className="mt-6 max-w-3xl">
          {eyebrow ? (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-navy-600">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">{title}</h1>
          {intro ? <p className="mt-4 text-lg leading-relaxed text-steel-600">{intro}</p> : null}
        </div>
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </div>
  );
}

/** Renders "Not published" for values the manufacturer does not publish. */
export function SpecValue({ value }: { value?: string }) {
  if (!value) {
    return <span className="text-steel-400 italic">Not published</span>;
  }
  return <span>{value}</span>;
}
