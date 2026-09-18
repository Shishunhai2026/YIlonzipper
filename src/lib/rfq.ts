import { randomBytes } from 'node:crypto';
import { z } from 'zod';

/**
 * RFQ (Request for Quote) schema.
 *
 * Shared by the client form and the server action so the two can never disagree
 * about what is valid. The server is the authority — client-side validation is a
 * convenience only and is never trusted.
 *
 * Length caps exist because every field ends up in an email and a stored record;
 * unbounded input is both an abuse vector and an operational problem.
 */

/**
 * Control characters have no legitimate place in a single-line field, and CR/LF
 * in particular are the email header-injection vector. The range is built
 * explicitly rather than written as a regex literal escape so the intent
 * survives any tooling that normalises string escapes.
 *
 * NOTE: this deliberately excludes the newline for fields that are allowed to be
 * multi-line (see `multilineText`), because a competent buyer pasting a spec
 * table into the Requirements box should not have it silently flattened.
 */
const CONTROL_CHARS_NO_NEWLINE = new RegExp(
  '[' +
    String.fromCharCode(0) +
    '-' +
    String.fromCharCode(9) +
    String.fromCharCode(11) +
    '-' +
    String.fromCharCode(31) +
    String.fromCharCode(127) +
    ']',
  'g',
);

const clean = (value: string) => value.replace(CONTROL_CHARS_NO_NEWLINE, '').trim();

/** Multi-line variant: keeps \n (and normalises \r\n), still strips everything else. */
const cleanMultiline = (value: string) =>
  value
    .replace(/\r\n?/g, '\n')
    .replace(CONTROL_CHARS_NO_NEWLINE, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

/** Single-line field with a length window. */
const text = (min: number, max: number, label: string) =>
  z
    .string()
    .transform(clean)
    .refine((v) => v.length >= min, { message: `${label} is required` })
    .refine((v) => v.length <= max, { message: `${label} must be ${max} characters or fewer` });

export const rfqSchema = z.object({
  name: text(2, 100, 'Name'),
  company: text(2, 150, 'Company'),
  email: z
    .string()
    .transform((v) => v.trim().toLowerCase())
    // Anchored and newline-free: this value also becomes the reply-to address.
    .pipe(z.string().email('Please enter a valid email address').max(200)),
  country: text(2, 80, 'Country'),
  phone: z
    .string()
    .transform(clean)
    .refine((v) => v === '' || /^[+\d][\d\s().-]{5,30}$/.test(v), {
      message: 'Please enter a valid phone number',
    })
    .optional()
    .default(''),
  product: z.string().transform(clean).pipe(z.string().max(200)).optional().default(''),
  application: z.string().transform(clean).pipe(z.string().max(120)).optional().default(''),
  quantity: z.string().transform(clean).pipe(z.string().max(120)).optional().default(''),
  requirements: z
    .string()
    .transform(cleanMultiline)
    .refine((v) => v.length >= 10, { message: 'Requirements is required' })
    .refine((v) => v.length <= 5000, {
      message: 'Requirements must be 5000 characters or fewer',
    }),

  /**
   * Honeypot — must stay empty.
   *
   * The cap here is intentionally permissive rather than `max(0)`. An earlier
   * version capped it at zero, which made the schema reject a filled honeypot
   * before the server action could run its honeypot check — turning a silent
   * discard into an error response that told the bot exactly which field had
   * given it away. Validation must let this through so the action can decide.
   */
  website: z.string().max(500).optional().default(''),
});

export type RfqInput = z.input<typeof rfqSchema>;
export type RfqData = z.output<typeof rfqSchema>;

export type RfqState =
  | { status: 'idle' }
  | { status: 'success'; reference: string }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string> };

export const IDLE: RfqState = { status: 'idle' };

/**
 * Reference shown to the sender and written into the notification email, so a
 * submission can be traced without exposing an incrementing internal id.
 *
 * Uses a CSPRNG rather than Math.random(): the reference is only a display token
 * today, but a predictable value would become an enumeration risk the moment
 * anyone adds a "check my enquiry status" lookup against it.
 */
export function makeReference(): string {
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}${String(
    now.getUTCDate(),
  ).padStart(2, '0')}`;
  const rand = randomBytes(5).toString('base64url').toUpperCase().slice(0, 8);
  return `RFQ-${stamp}-${rand}`;
}
