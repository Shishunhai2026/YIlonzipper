# YILON — English B2B Website

English-language lead-generation site for **Dongtai YILON Industrial Co., Ltd.**, a manufacturer of
airtight and waterproof zippers.

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · 57 static pages

---

## ⚠️ Read this first: Windows path casing

The project lives at `D:\cc\zipper\Russia\yilon-en` — **capital R** in `Russia`.

Windows treats `russia` and `Russia` as the same directory, so the build *appears* to work from
either spelling. It does not. Webpack records whichever casing it first sees and then treats the
other spelling as a **different module**, so every file — including React — gets bundled twice. The
symptom is a baffling `Cannot read properties of null (reading 'useContext')` during prerender, with
nothing in the error mentioning paths.

**Always run commands from the correct casing:**

```bash
cd "D:/cc/zipper/Russia/yilon-en"
```

---

## Commands

```bash
npm run dev              # development server
npm run build            # production build (must stay green)
npm run start            # serve the production build
npm run lint             # eslint

npm run build:images     # regenerate WebP assets from the product library
npm run build:banners    # regenerate the homepage banner WebPs
npm run verify:content   # data fidelity check (no server needed)
npm run audit            # full SEO / structure / link audit (needs a running server)
npm run test:rfq         # RFQ form end-to-end tests (needs a running server)
```

---

## Where the content comes from

**The site invents nothing.** Every product name, specification value, rating, test figure and
company fact is taken from the manufacturer's own published data, extracted into the product library
at `../doc/dgyilon产品资料库/`.

```
src/data/
├── company.ts       Company facts, address, contact, published metrics
├── products.ts      9 products, 5 categories, full parameter tables  ← main source of truth
├── applications.ts  9 application pages
├── faq.ts           24 published Q&A, translated to English
├── guides.ts        8 technical guides, restructured from published copy
├── navigation.ts    Nav + footer link structure
└── image-manifest.json  437 images (generated — do not hand-edit)
```

Rules the codebase holds to:

- **No invented data.** If the manufacturer does not publish a value, the UI renders
  `Not published` (see `NOT_PUBLISHED` and `<SpecValue />`) rather than guessing.
- **No prices anywhere.** There is no published pricing, so every CTA is *Request a Quote*.
- **Published values are copied verbatim** — never rounded, converted or "tidied up".

`scripts/verify-content.mjs` enforces this: it asserts that all 112 published parameter values appear
verbatim in the source, and that no price or fabricated factory metric has crept in.

---

## Images

437 images are converted to WebP at build time by `scripts/build-images.mjs`, which reads the product
library and emits `public/images/products/product-N/{main,gallery,scenes,spec,variants}/`.

Chinese filenames from the library are mapped to ASCII slugs derived from the manufacturer's own
English model names, so URLs stay readable, stable and indexable. **Do not hand-edit the output** —
change the source library and re-run `npm run build:images`.

Pages using `next/image` get responsive AVIF/WebP automatically.

### Homepage banners

The five carousel images at the top of the homepage are a **separate pipeline**
from the product library. `scripts/build-banners.mjs` reads the artwork from
`../首页轮播图片`, writes WebP to `public/images/hero/`, and records dimensions in
`src/data/banner-manifest.json` — deliberately *not* `image-manifest.json`, whose
437-entry count `verify-content.mjs` asserts.

Alt text lives in `src/data/banners.ts`, not in the generated manifest, so
re-running the converter cannot overwrite it.

Two things to know before changing banner artwork:

- **Never overwrite an existing banner file.** `/images/:path*` is served with a
  one-year `immutable` cache header, so new artwork must get a new slug
  (`airtight-zipper-v2`) in the `SOURCES` table, not a new file at the old name.
- **Do not regenerate these with `npm run build:images`.** That script is
  hard-wired to the product library and rewrites `image-manifest.json` wholesale.

---

## SEO

- Every page: unique title, meta description ≤158 chars, canonical, breadcrumbs, JSON-LD.
- Structured data is generated from the same data the page renders (`src/lib/schema.ts`), so markup
  and visible content cannot disagree.
- `Product` schema deliberately omits `offers` — there is no published price.
- `/technology/{slug}` is canonical for guide content; `/blog/{slug}` is a declared alias that points
  its canonical there.
- `sitemap.ts` and `robots.ts` are generated from the data layer, so routes cannot silently drop out.
- Old brochure-site `.html` URLs 301-redirect to their new paths (see `next.config.ts`).

---

## The RFQ form

`/request-a-quote` is the site's only conversion path and its only dynamic surface.

- **Validation** — one zod schema (`src/lib/rfq.ts`) shared by client and server. The server is the
  authority; client-side checks are convenience only.
- **Delivery** — submissions are appended to `var/rfq/submissions.jsonl`, then emailed if SMTP is
  configured. If email fails the enquiry is still captured and the failure is logged.
- **Abuse controls** — honeypot field, per-IP rate limit, and hard caps on every field including the
  header-derived ones.

### `var/` contains customer PII

`var/rfq/submissions.jsonl` holds names, companies, emails and phone numbers. It is **gitignored** —
do not remove that entry and do not commit it.

### SMTP (optional)

Without these the form still works; enquiries are stored but not emailed.

```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=no-reply@example.com
SMTP_PASS=...
SMTP_SECURE=false
RFQ_NOTIFY_EMAIL=sales@example.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

`NEXT_PUBLIC_SITE_URL` drives canonicals, the sitemap and JSON-LD. **It currently defaults to a
placeholder — set it before going live.**

---

## Deployment notes

- The in-memory rate limiter is per-process and resets on redeploy. It is an abuse dampener, not a
  security boundary. Put real rate limiting at the edge (nginx `limit_req`, or a CDN).
- `X-Forwarded-For` is parsed from the **right** (`TRUSTED_PROXY_HOPS` in `src/lib/rate-limit.ts`).
  Adjust that constant to match the number of proxies you actually run in front of the app.
- `var/` assumes a persistent writable disk. On serverless, `persist()` throws and the form fails
  safely — point the store at a database or object storage before deploying there.
- HSTS is enabled. Only keep it if every hostname serves HTTPS.
- `script-src` uses `'unsafe-inline'`. That is deliberate: Next emits an inline bootstrap payload and
  the JSON-LD blocks are inline scripts, so a nonce would forfeit static prerendering. Do not add a
  nonce alongside it — browsers ignore `'unsafe-inline'` when a nonce is present, which silently
  breaks every page.

---

## Verification

```bash
npm run build
npx next start --port 3211
AUDIT_BASE=http://localhost:3211 npm run audit
AUDIT_BASE=http://localhost:3211 npm run test:rfq
npm run verify:content
```

Current state: **52 pages audited, 0 problems, 0 broken links · 14/14 RFQ tests · 9/9 content checks.**
