/**
 * End-to-end test of the RFQ server action against a running server.
 *
 * Replays the exact multipart submission the browser makes, including Next's
 * encrypted server-action reference and action key, so validation, the honeypot
 * and persistence are genuinely exercised rather than just "the form renders".
 */
import { existsSync, rmSync, readFileSync } from 'node:fs';
import path from 'node:path';

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:3210';
const STORE = path.join(process.cwd(), 'var', 'rfq', 'submissions.jsonl');

let pass = 0;
let fail = 0;
const check = (name, ok, detail = '') => {
  if (ok) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
};

const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

/** Scrapes Next's hidden server-action inputs from the rendered form. */
async function actionPayload() {
  const html = await (await fetch(`${BASE}/request-a-quote`)).text();
  const hidden = new Map();
  for (const m of html.matchAll(/<input[^>]*type="hidden"[^>]*>/g)) {
    const tag = m[0];
    const name = (tag.match(/name="([^"]*)"/) ?? [])[1];
    const value = (tag.match(/value="([^"]*)"/) ?? [])[1] ?? '';
    if (name && name.startsWith('$ACTION')) hidden.set(decode(name), decode(value));
  }
  return hidden;
}

/**
 * Submits the form fields plus the captured action plumbing.
 *
 * `clientIp` sets X-Forwarded-For so each test case gets its own rate-limit
 * bucket. Without it every case shares the loopback bucket, so re-running the
 * suite (or running the burst test first) silently rate-limits the other cases —
 * which then look like persistence failures.
 */
async function submit(fields, clientIp = '10.0.0.1') {
  const plumbing = await actionPayload();
  if (plumbing.size === 0) throw new Error('no $ACTION fields found on the page');

  const fd = new FormData();
  for (const [k, v] of plumbing) fd.set(k, v);
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);

  // Next omits the action key for the initial (non-replay) submission.
  const actionKey = plumbing.get('$ACTION_KEY');
  if (actionKey) fd.set('$ACTION_KEY', actionKey);

  // A real browser always sends Origin on a same-origin form POST. Next uses it
  // to reject cross-site server-action calls, so a test that omits it is not
  // exercising the same path the browser does.
  const res = await fetch(`${BASE}/request-a-quote`, {
    method: 'POST',
    body: fd,
    headers: {
      Origin: BASE,
      Referer: `${BASE}/request-a-quote`,
      'X-Forwarded-For': clientIp,
    },
  });
  return { status: res.status, text: await res.text() };
}

/** Unique-per-run client identity so repeated runs never collide. */
const RUN = Math.floor(Math.random() * 60000);
const ipFor = (name) => `10.${RUN % 250}.${name.length}.${name.charCodeAt(0) % 250}`;

if (existsSync(STORE)) rmSync(STORE);
const storeRows = () =>
  existsSync(STORE)
    ? readFileSync(STORE, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
    : [];

console.log('=== RFQ END-TO-END ===');

const VALID = {
  name: 'Anna Müller',
  company: 'Nordsee Diving Equipment GmbH',
  email: 'Anna@Nordsee-Diving.example',
  country: 'Germany',
  phone: '+49 40 123456',
  product: '#10 Resin Airtight Zipper',
  application: 'Drysuits & Underwater Operations',
  quantity: '5,000 pcs per year',
  requirements:
    'We need an IPX8 drysuit closure, opening length 620 mm, silicone rubber preferred. Please quote with the 60 kPa test report.',
  website: '',
};

// 1 — happy path
try {
  const r = await submit(VALID, ipFor('valid'));
  const rows = storeRows();
  check('valid submission accepted', r.status === 200, `HTTP ${r.status}`);
  check('valid submission persisted', rows.length === 1, `${rows.length} row(s)`);
  if (rows[0]) {
    check('email normalised to lowercase', rows[0].email === 'anna@nordsee-diving.example', rows[0].email);
    // 5 random bytes render as 7 base64url characters: A–Z, 0–9, and the two
    // URL-safe symbols - and _.
    check(
      'reference generated',
      /^RFQ-\d{8}-[A-Z0-9_-]{7,}$/.test(rows[0].reference),
      rows[0].reference,
    );
    check('company stored verbatim', rows[0].company === VALID.company);
    check('technical requirements stored in full', rows[0].requirements === VALID.requirements);
    check('honeypot stripped before storage', rows[0].website === undefined);
    check('timestamp recorded', !Number.isNaN(Date.parse(rows[0].submittedAt)));
  }
} catch (e) {
  check('valid submission accepted', false, e.message);
}

// 2 — missing required fields
try {
  const before = storeRows().length;
  await submit({ ...VALID, name: '', company: '', requirements: 'short' }, ipFor('missing'));
  check('missing required fields not persisted', storeRows().length === before);
} catch (e) {
  check('missing required fields not persisted', false, e.message);
}

// 3 — malformed email
try {
  const before = storeRows().length;
  await submit({ ...VALID, email: 'not-an-email' }, ipFor('bademail'));
  check('malformed email not persisted', storeRows().length === before);
} catch (e) {
  check('malformed email not persisted', false, e.message);
}

// 4 — honeypot
try {
  const before = storeRows().length;
  const r = await submit(
    { ...VALID, email: 'bot@example.com', website: 'http://spam.example' },
    ipFor('honeypot'),
  );
  check('honeypot returns success (does not tip off the bot)', r.status === 200);
  check('honeypot submission not persisted', storeRows().length === before);
} catch (e) {
  check('honeypot submission not persisted', false, e.message);
}

// 5 — oversized field
try {
  const before = storeRows().length;
  await submit({ ...VALID, email: 'big@example.com', requirements: 'x'.repeat(6000) }, ipFor('oversize'));
  check('oversized field not persisted', storeRows().length === before);
} catch (e) {
  check('oversized field not persisted', false, e.message);
}

// 6 — rate limiting
try {
  let throttled = 0;
  for (let i = 0; i < 8; i++) {
    const r = await submit({ ...VALID, email: `burst${i}@example.com` }, '10.99.99.99');
    if (/too many submissions/i.test(r.text)) throttled++;
  }
  check('rate limiter engages under a burst', throttled > 0, `${throttled}/8 throttled`);
} catch (e) {
  check('rate limiter engages under a burst', false, e.message);
}

console.log('');
console.log(`passed: ${pass}, failed: ${fail}`);
process.exit(fail === 0 ? 0 : 1);
