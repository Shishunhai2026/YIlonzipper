'use client';

import { useActionState, useId } from 'react';
import { useFormStatus } from 'react-dom';
import { submitRfq } from '@/app/request-a-quote/actions';
import { IDLE } from '@/lib/rfq';
import { Button } from '@/components/ui';
import { applications } from '@/data/applications';
import { products } from '@/data/products';

type FieldProps = {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  defaultValue?: string;
  hint?: string;
  error?: string;
  as?: 'input' | 'textarea' | 'select';
  rows?: number;
  children?: React.ReactNode;
};

function Field({
  label,
  name,
  required = false,
  type = 'text',
  autoComplete,
  placeholder,
  defaultValue,
  hint,
  error,
  as = 'input',
  rows = 6,
  children,
}: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ');
  const baseClass =
    'w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-steel-900 shadow-sm transition-colors placeholder:text-steel-400 focus:outline-none focus:ring-2 focus:ring-navy-400/40';
  const stateClass = error
    ? 'border-red-400 focus:border-red-500'
    : 'border-steel-300 focus:border-navy-500';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-navy-900">
        {label}
        {required ? (
          <span className="ml-1 text-accent-600" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1 text-xs font-normal text-steel-400">(optional)</span>
        )}
      </label>

      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-steel-500">
          {hint}
        </p>
      ) : null}

      <div className="mt-1.5">
        {as === 'textarea' ? (
          <textarea
            id={id}
            name={name}
            rows={rows}
            required={required}
            placeholder={placeholder}
            defaultValue={defaultValue}
            aria-describedby={describedBy || undefined}
            aria-invalid={error ? true : undefined}
            className={`${baseClass} ${stateClass} resize-y`}
          />
        ) : as === 'select' ? (
          <select
            id={id}
            name={name}
            required={required}
            defaultValue={defaultValue}
            aria-describedby={describedBy || undefined}
            aria-invalid={error ? true : undefined}
            className={`${baseClass} ${stateClass}`}
          >
            {children}
          </select>
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            required={required}
            autoComplete={autoComplete}
            placeholder={placeholder}
            defaultValue={defaultValue}
            aria-describedby={describedBy || undefined}
            aria-invalid={error ? true : undefined}
            className={`${baseClass} ${stateClass}`}
          />
        )}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Sending…' : 'Send request'}
    </Button>
  );
}

export function RfqForm({
  defaultProduct = '',
  defaultApplication = '',
}: {
  defaultProduct?: string;
  defaultApplication?: string;
}) {
  const [state, formAction] = useActionState(submitRfq, IDLE);

  if (state.status === 'success') {
    return (
      <div
        role="status"
        className="rounded-card border border-emerald-200 bg-emerald-50 p-8 text-center"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 48 48"
          className="mx-auto h-12 w-12 text-emerald-600"
          fill="none"
        >
          <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="2.5" />
          <path
            d="M15 24.5l6 6 12-13"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h2 className="mt-4 text-xl font-bold text-emerald-900">Request received</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-emerald-800">
          Thank you — your enquiry has been logged and our engineering team will come back to you
          with a quotation. Please quote the reference below in any follow-up.
        </p>
        <p className="mt-5 inline-block rounded-md bg-white px-4 py-2 font-mono text-sm font-semibold text-emerald-900">
          {state.reference}
        </p>
      </div>
    );
  }

  const fieldErrors = state.status === 'error' ? (state.fieldErrors ?? {}) : {};

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state.status === 'error' ? (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          required
          autoComplete="name"
          placeholder="Your full name"
          error={fieldErrors.name}
        />
        <Field
          label="Company"
          name="company"
          required
          autoComplete="organization"
          placeholder="Company name"
          error={fieldErrors.company}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          error={fieldErrors.email}
        />
        <Field
          label="Country"
          name="country"
          required
          autoComplete="country-name"
          placeholder="Country of delivery"
          error={fieldErrors.country}
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+00 000 000 000"
          hint="Optional, but it speeds up technical questions."
          error={fieldErrors.phone}
        />

        <Field
          label="Product"
          name="product"
          as="select"
          defaultValue={defaultProduct}
          hint="Leave as “Not sure yet” if you would like us to advise."
          error={fieldErrors.product}
        >
          <option value="">Not sure yet — please advise</option>
          {products.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
          <option value="Custom / other">Custom or other</option>
        </Field>

        <Field
          label="Application"
          name="application"
          as="select"
          defaultValue={defaultApplication}
          error={fieldErrors.application}
        >
          <option value="">Select an application</option>
          {applications.map((a) => (
            <option key={a.slug} value={a.name}>
              {a.name}
            </option>
          ))}
          <option value="Other">Other</option>
        </Field>

        <Field
          label="Estimated quantity"
          name="quantity"
          placeholder="e.g. 5,000 pcs / 2,000 m"
          hint="Estimated annual or per-order volume helps us quote accurately."
          error={fieldErrors.quantity}
        />
      </div>

      <Field
        label="Requirements"
        name="requirements"
        as="textarea"
        required
        rows={6}
        placeholder={
          'Please include: opening length, tape width, target waterproof rating (IPX6/7/8), host material, colour, slider type, and any test conditions.'
        }
        hint="The more detail you give, the more precise our quotation will be."
        error={fieldErrors.requirements}
      />

      {/*
        Honeypot.

        Deliberately NOT labelled "leave blank" — the previous version announced
        what it was, so one look at the markup told a bot to skip it. The field
        now carries a plausible-looking name and no visible or announced label.
        Hidden from sighted users, assistive tech and the tab order by every
        mechanism that a naive form-filler does not evaluate.
      */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
      >
        <input
          id="company-fax"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-steel-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-steel-500">
          We use your details only to answer this enquiry. No marketing lists, no third parties.
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}
