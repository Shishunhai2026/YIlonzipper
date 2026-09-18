'use server';

import { headers } from 'next/headers';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { rfqSchema, makeReference, type RfqState } from '@/lib/rfq';
import { checkRateLimit, clientKeyFrom } from '@/lib/rate-limit';
import { company } from '@/data/company';

/**
 * Handles an RFQ submission.
 *
 * Delivery: submissions are validated, then appended to a JSONL file on the
 * server as the durable record, and — when SMTP is configured via environment
 * variables — also emailed to the sales inbox. If email is not configured the
 * submission is still captured and the sender still gets a success response,
 * because losing an enquiry is worse than a missing notification.
 *
 * Nothing is written to the filesystem until every field has passed validation.
 *
 * DEPLOYMENT NOTE: the JSONL store needs a persistent writable disk, which a
 * serverless platform does not provide — `process.cwd()` is read-only there, so
 * `persist()` fails and email is the only channel that can deliver. That is why
 * notify() runs first and a submission is only reported as failed when BOTH
 * channels are unavailable. Configure SMTP_HOST / SMTP_USER / SMTP_PASS before
 * deploying to a serverless host, or the form will capture nothing.
 */

const STORE_DIR = path.join(process.cwd(), 'var', 'rfq');
const STORE_FILE = path.join(STORE_DIR, 'submissions.jsonl');

/**
 * Cap on non-validated header-derived fields. Both are attacker-controlled and
 * are written verbatim to disk, so an oversized User-Agent would otherwise let a
 * single request write tens of kilobytes.
 */
const MAX_HEADER_FIELD = 300;

async function persist(record: Record<string, unknown>) {
  await mkdir(STORE_DIR, { recursive: true });
  await appendFile(STORE_FILE, `${JSON.stringify(record)}\n`, 'utf8');
}

/**
 * Optional email delivery. Enabled only when the deployment supplies SMTP
 * settings; deliberately not required for the form to work.
 *
 * Returns true only when a message was actually handed to the mail server.
 */
async function notify(record: Record<string, unknown>): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.RFQ_NOTIFY_EMAIL ?? company.contact.email;

  if (!host || !user || !pass) {
    // Partial configuration is a deployment mistake, not a normal state — say so
    // rather than silently never sending anything.
    if (host || user || pass) {
      console.error(
        '[rfq] SMTP is partially configured (need SMTP_HOST, SMTP_USER and SMTP_PASS). ' +
          'Enquiries are being stored but not emailed.',
      );
    }
    return false;
  }

  try {
    // Loaded lazily so a deployment without SMTP never pulls in the dependency.
    const nodemailer = await import('nodemailer');
    const transport = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    });

    // Header fields are already newline-stripped by the schema, but the subject
    // is built from user input, so flatten it once more as defence in depth.
    const flatten = (v: unknown) => String(v ?? '').replace(/[\r\n]+/g, ' ').slice(0, 160);

    const lines = Object.entries(record)
      .filter(([key]) => key !== 'userAgent' && key !== 'ip' && key !== 'website')
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join('\n');

    await transport.sendMail({
      from: `"${company.brand} website" <${user}>`,
      to,
      replyTo: flatten(record.email),
      subject: `RFQ ${flatten(record.reference)} — ${flatten(record.company)}`,
      text: lines,
    });
    return true;
  } catch (err) {
    // A mail failure must not lose the enquiry: the caller still falls through to
    // the JSONL store, and only reports a failure if that fails too. Log the error
    // without the record's personal data.
    console.error('[rfq] failed to send notification email:', (err as Error)?.message);
    return false;
  }
}

export async function submitRfq(_prev: RfqState, formData: FormData): Promise<RfqState> {
  const headerList = await headers();
  const key = clientKeyFrom(headerList);

  // Only apply the in-process limiter when we have a trustworthy identity. A
  // shared fallback bucket would let one abuser lock out every legitimate buyer.
  if (key) {
    const limit = checkRateLimit(key);
    if (!limit.ok) {
      return {
        status: 'error',
        message: `Too many submissions from this connection. Please try again in ${Math.ceil(
          limit.retryAfterSeconds / 60,
        )} minute(s), or email us directly at ${company.contact.email}.`,
      };
    }
  }

  const raw = {
    name: formData.get('name'),
    company: formData.get('company'),
    email: formData.get('email'),
    country: formData.get('country'),
    phone: formData.get('phone'),
    product: formData.get('product'),
    application: formData.get('application'),
    quantity: formData.get('quantity'),
    requirements: formData.get('requirements'),
    website: formData.get('website'),
  };

  const parsed = rfqSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? 'form');
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return {
      status: 'error',
      message: 'Please check the highlighted fields and try again.',
      fieldErrors,
    };
  }

  const data = parsed.data;

  // Honeypot: a filled value means a bot. Report success so the bot does not
  // learn it was rejected, store nothing, and spend a plausible amount of time so
  // the response is not distinguishable from a real submission by latency alone.
  if (data.website) {
    await new Promise((resolve) => setTimeout(resolve, 400 + Math.floor(Math.random() * 600)));
    return { status: 'success', reference: makeReference() };
  }

  const reference = makeReference();
  const record = {
    reference,
    submittedAt: new Date().toISOString(),
    name: data.name,
    company: data.company,
    email: data.email,
    country: data.country,
    phone: data.phone,
    product: data.product,
    application: data.application,
    quantity: data.quantity,
    requirements: data.requirements,
    // Both capped: these come straight off request headers and are unvalidated.
    ip: (key ?? '').slice(0, 64),
    userAgent: (headerList.get('user-agent') ?? '').slice(0, MAX_HEADER_FIELD),
  };

  // Delivery is best-effort across two independent channels. The enquiry is
  // reported as failed only when BOTH are unavailable — a missing notification
  // costs far less than a lost lead, which is the whole reason this form exists.
  //
  // Email goes first because it is the channel that has to work in production.
  // The JSONL store needs a writable disk, so on a serverless host it is always
  // the one that fails; it stays as the backstop for local and self-hosted runs.
  const emailed = await notify(record);

  const stored = await persist(record).then(
    () => true,
    () => false,
  );

  if (!emailed && !stored) {
    return {
      status: 'error',
      message: `We could not record your request. Please email us directly at ${company.contact.email} and we will respond straight away.`,
    };
  }

  // Tell the operator whenever an enquiry landed on one channel but not the
  // other, so a misconfigured mailbox or a read-only store cannot quietly
  // swallow leads.
  if (!emailed) {
    console.warn(
      `[rfq] ${reference} stored but not emailed (SMTP not configured or send failed).`,
    );
  }
  if (!stored) {
    console.warn(
      `[rfq] ${reference} emailed but not stored (no writable store on this platform).`,
    );
  }

  return { status: 'success', reference };
}
