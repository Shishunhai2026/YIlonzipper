/**
 * End-to-end audit against a running production server.
 *
 * Checks the things that actually break SEO or accessibility in practice:
 * duplicate/missing H1, missing or wrong canonical, duplicate titles, JSON-LD
 * validity, image alt coverage, and internal links that 404.
 */
const BASE = process.env.AUDIT_BASE ?? 'http://localhost:3210';
const MAX_PAGES = Number(process.env.AUDIT_MAX ?? 400);

const get = async (url) => {
  const res = await fetch(url, { redirect: 'manual' });
  const body = res.status === 200 || res.status === 404 ? await res.text() : '';
  return { status: res.status, body, headers: res.headers };
};

// ---- collect the URL set from the sitemap (the site's own source of truth) ----
const { body: sitemap } = await get(`${BASE}/sitemap.xml`);
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1])
  .map((u) => u.replace(/^https?:\/\/[^/]+/, ''))
  .filter((p) => p && p !== '/');

// Always include the home page and the key conversion route.
const targets = ['/', ...urls.slice(0, MAX_PAGES)];

/**
 * Deliberate alias pair: `/blog/{slug}` and `/technology/{slug}` serve the same
 * published article. The technology URL is canonical — the blog post renders
 * the identical body, declares the technology URL as its canonical and carries
 * no article schema of its own, which is the documented way to consolidate two
 * URLs for one article.
 *
 * Two checks below would otherwise report that design as a defect: the shared
 * canonical, and the duplicate title if the two ever drift back together. Both
 * are exempted for exactly this pair and nothing else — every other page is
 * still held to the strict check.
 */
const BLOG_PREFIX = '/blog/';

/** The technology URL a `/blog/{slug}` path aliases, or null for any other path. */
const aliasCanonical = (path) =>
  path.startsWith(BLOG_PREFIX) ? `/technology/${path.slice(BLOG_PREFIX.length)}` : null;

/** True when one path is the blog alias of the other (either order). */
const isAliasPair = (a, b) => aliasCanonical(a) === b || aliasCanonical(b) === a;

const problems = [];
const titles = new Map();
const canonicals = new Map();
let checked = 0;

for (const path of targets) {
  const { status, body } = await get(`${BASE}${path}`);
  if (status !== 200) {
    problems.push(`${path} → HTTP ${status}`);
    continue;
  }
  checked++;

  const h1s = [...body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, '').trim(),
  );
  if (h1s.length === 0) problems.push(`${path} → no <h1>`);
  if (h1s.length > 1) problems.push(`${path} → ${h1s.length} <h1> elements`);

  const title = (body.match(/<title[^>]*>([\s\S]*?)<\/title>/) ?? [])[1]?.trim();
  if (!title) problems.push(`${path} → no <title>`);
  else {
    if (titles.has(title)) {
      const other = titles.get(title);
      if (!isAliasPair(path, other)) problems.push(`${path} → duplicate title (also ${other})`);
    } else titles.set(title, path);
    if (title.length > 65) problems.push(`${path} → title ${title.length} chars (>65)`);
  }

  const desc = (body.match(/<meta name="description" content="([^"]*)"/) ?? [])[1];
  if (!desc) problems.push(`${path} → no meta description`);
  else if (desc.length > 165) problems.push(`${path} → description ${desc.length} chars (>165)`);

  const canonical = (body.match(/<link rel="canonical" href="([^"]*)"/) ?? [])[1];
  if (!canonical) problems.push(`${path} → no canonical`);
  else {
    const cpath = canonical.replace(/^https?:\/\/[^/]+/, '') || '/';
    if (canonicals.has(cpath)) {
      // A blog alias pointing at its own technology URL is the intended design.
      if (aliasCanonical(path) !== cpath) {
        problems.push(`${path} → canonical ${cpath} already used by ${canonicals.get(cpath)}`);
      }
    } else canonicals.set(cpath, path);
  }

  // JSON-LD must parse.
  const blocks = [...body.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)];
  if (blocks.length === 0) problems.push(`${path} → no JSON-LD`);
  for (const [, raw] of blocks) {
    try {
      JSON.parse(raw);
    } catch {
      problems.push(`${path} → invalid JSON-LD`);
      break;
    }
  }

  // Images: only enforce alt on <img> that Next renders (these are the content ones).
  const imgs = [...body.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const noAlt = imgs.filter((tag) => !/\salt=/.test(tag));
  if (noAlt.length) problems.push(`${path} → ${noAlt.length} <img> without alt`);

  // A page with no followable CTA is a conversion dead end.
  if (!/Request a Quote/i.test(body)) problems.push(`${path} → no "Request a Quote" CTA`);
}

// ---- internal link check over a sample of pages ----
const linkTargets = new Set();
for (const path of targets.slice(0, 30)) {
  const { body } = await get(`${BASE}${path}`);
  for (const m of body.matchAll(/href="(\/[^"#?]*)/g)) {
    if (!/\.(png|jpe?g|webp|avif|svg|ico|xml|txt|css|js)$/i.test(m[1])) linkTargets.add(m[1]);
  }
}
let brokenLinks = 0;
for (const href of linkTargets) {
  const res = await fetch(`${BASE}${href}`, { redirect: 'manual' });
  if (res.status >= 400) {
    problems.push(`broken internal link: ${href} → HTTP ${res.status}`);
    brokenLinks++;
  }
}

console.log('=== AUDIT ===');
console.log('pages checked      :', checked);
console.log('internal links     :', linkTargets.size, `(${brokenLinks} broken)`);
console.log('unique titles      :', titles.size);
console.log('problems           :', problems.length);
if (problems.length) {
  console.log('');
  problems.slice(0, 60).forEach((p) => console.log('  ✗', p));
  if (problems.length > 60) console.log(`  … and ${problems.length - 60} more`);
} else {
  console.log('✓ no problems found');
}
