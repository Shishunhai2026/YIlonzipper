/**
 * Content fidelity check.
 *
 * The site's whole claim to trustworthiness rests on it reproducing the
 * manufacturer's published numbers exactly. This compares every parameter the
 * site renders against the product library that was extracted from
 * dgyilon.com, and fails loudly on any drift.
 *
 * It also asserts that no artifact the manufacturer does not publish (a price,
 * a capacity figure, a customer name) leaks onto the site.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const SITE = process.cwd();
const LIB = path.resolve(SITE, '..', 'doc', 'dgyilon产品资料库');

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

console.log('=== CONTENT FIDELITY ===');

// ---- 1. Every published parameter value appears verbatim in the site source ----
const source = JSON.parse(readFileSync(path.join(LIB, '03_技术参数', '技术参数原始数据.json'), 'utf8'));

// Collect all TS/TSX under src/ as one blob to search.
const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(entry)) files.push(full);
  }
})(path.join(SITE, 'src'));
const blob = files.map((f) => readFileSync(f, 'utf8')).join('\n');

let parametersChecked = 0;
const missing = [];
for (const [id, product] of Object.entries(source)) {
  for (const param of product.params) {
    const value = param.val_en || param.val;
    parametersChecked++;
    // Values like "Full/2026" style strings are compared literally; the site must
    // contain the exact published figure, not a rounded or converted variant.
    if (!blob.includes(value)) missing.push(`product ${id}: ${param.en} = "${value}"`);
  }
}
check(
  `all ${parametersChecked} published parameter values present verbatim`,
  missing.length === 0,
  missing.slice(0, 8).join(' | '),
);

// ---- 2. Product names must match exactly ----
let namesChecked = 0;
const nameMismatch = [];
for (const [id, product] of Object.entries(source)) {
  namesChecked++;
  if (!blob.includes(product.name_en)) nameMismatch.push(`product ${id}: ${product.name_en}`);
}
check(`all ${namesChecked} product names present`, nameMismatch.length === 0, nameMismatch.join(' | '));

// ---- 3. Nothing the manufacturer does not publish may appear ----
// A price is the clearest signal of invented commercial data.
const PRICE_PATTERNS = [
  /\$\s?\d+(\.\d{2})?\s*(per|PCS|pc|piece|meter|m\b|unit)/i,
  /USD\s?\d/i,
  /price\s*[:=]\s*[\d$]/i,
  /"price"\s*:/i,
];
const priceHits = PRICE_PATTERNS.filter((re) => re.test(blob));
check('no prices anywhere in the source', priceHits.length === 0, `${priceHits.length} pattern(s) matched`);

// The manufacturer publishes no capacity / headcount / floor-area figures.
const FORBIDDEN_CLAIMS = [
  /(\d[\d,]*)\s*(square meters|sqm|m²|square metres)/i,
  /(\d[\d,]*)\s*(employees|staff|workers)/i,
  /(production capacity of|annual capacity of)\s*[\d,]/i,
];
const claimHits = FORBIDDEN_CLAIMS.filter((re) => re.test(blob));
check('no invented factory metrics', claimHits.length === 0, `${claimHits.length} pattern(s) matched`);

// ---- 4. Image manifest integrity ----
const manifest = JSON.parse(readFileSync(path.join(SITE, 'src', 'data', 'image-manifest.json'), 'utf8'));
let imageCount = 0;
let nonAscii = 0;
const missingFiles = [];
for (const roles of Object.values(manifest)) {
  for (const assets of Object.values(roles)) {
    for (const asset of assets) {
      imageCount++;
      if (!/^[\x20-\x7E]+$/.test(asset.src)) nonAscii++;
      const onDisk = path.join(SITE, 'public', asset.src.replace(/^\//, ''));
      try {
        statSync(onDisk);
      } catch {
        missingFiles.push(asset.src);
      }
    }
  }
}
check(`all ${imageCount} manifest images exist on disk`, missingFiles.length === 0, missingFiles.slice(0, 5).join(' | '));
check('all image paths are ASCII', nonAscii === 0, `${nonAscii} non-ASCII path(s)`);
check('image count matches the library (437)', imageCount === 437, `found ${imageCount}`);

// ---- 5. Entity counts ----
// Count the product literals by their id field, which only appears on a product
// definition. Checking the rendered pages instead would be brittle; this asserts
// the catalogue cannot silently gain or lose an entry.
const productsSource = readFileSync(path.join(SITE, 'src', 'data', 'products.ts'), 'utf8');
const productCount = (productsSource.match(/^ {4}id: '/gm) ?? []).length;
check('9 products defined in the data layer', productCount === 9, `found ${productCount}`);

const categoriesSource = productsSource.slice(productsSource.indexOf('export const categories'));
const categoryCount = (categoriesSource.match(/^ {4}slug: '/gm) ?? []).length;
check('5 categories defined', categoryCount === 5, `found ${categoryCount}`);

console.log('');
console.log(`passed: ${pass}, failed: ${fail}`);
process.exit(fail === 0 ? 0 : 1);
