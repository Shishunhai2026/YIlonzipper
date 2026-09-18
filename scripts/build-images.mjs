/**
 * Convert the product library images into optimised WebP assets under public/.
 *
 * - Source of truth: ../doc/dgyilon产品资料库/07_产品图片 (437 verified images)
 * - Output names are plain ASCII and derived from the manufacturer's own English
 *   model names, so URLs stay readable, stable and indexable.
 *   The library's numeric variant prefixes map 1:1 to the variant index in the
 *   product data, which is how the English slug is resolved.
 */
import { readdir, mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.resolve(ROOT, '..', 'doc', 'dgyilon产品资料库', '07_产品图片');
const OUT = path.resolve(ROOT, 'public', 'images', 'products');
const MAX_WIDTH = 1600;

/** Source folder (Chinese) -> output folder slug + role in the data model. */
const KINDS = {
  '主图': { slug: 'main', role: 'main', label: 'Main view' },
  '产品图': { slug: 'gallery', role: 'gallery', label: 'Product view' },
  '应用场景': { slug: 'scenes', role: 'scene', label: 'Application photo' },
  '规格图': { slug: 'spec', role: 'spec', label: 'Specification drawing' },
  '细分型号': { slug: 'variants', role: 'variant', label: 'Variant view' },
};

/** Hand-checked English labels for the handful of non-variant filenames. */
const FIXED_NAMES = { '脖套': 'neck-seal', '袖套': 'sleeve-seal' };
const FIXED_LABELS = { '脖套': 'Neck seal', '袖套': 'Sleeve seal' };

const slugify = (s) =>
  s
    .replace(/[/#+]/g, ' ')
    .replace(/(\d)\s*(mm|cm|m)\b/gi, '$1$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70) || 'image';

async function convert(srcPath, destPath) {
  const image = sharp(srcPath, { failOn: 'none' }).rotate();
  const meta = await image.metadata();
  const pipeline =
    meta.width && meta.width > MAX_WIDTH
      ? image.resize({ width: MAX_WIDTH, withoutEnlargement: true })
      : image;
  const buf = await pipeline.webp({ quality: 82, effort: 5 }).toBuffer();
  await writeFile(destPath, buf);
  return { width: meta.width ?? null, height: meta.height ?? null, bytes: buf.length };
}

function byIndex(a, b) {
  const na = Number((a.match(/(\d+)/) || [])[1] ?? 0);
  const nb = Number((b.match(/(\d+)/) || [])[1] ?? 0);
  return na - nb || a.localeCompare(b);
}

async function main() {
  const customTypes = JSON.parse(
    await readFile(path.resolve(ROOT, 'scripts', 'variants.json'), 'utf8'),
  );
  const manifest = {};
  let converted = 0;
  const failures = [];

  const productDirs = (await readdir(SRC, { withFileTypes: true }))
    .filter((d) => d.isDirectory() && /^product-\d+$/.test(d.name))
    .map((d) => d.name)
    .sort((a, b) => Number(a.split('-')[1]) - Number(b.split('-')[1]));

  for (const productDir of productDirs) {
    const id = productDir.split('-')[1];
    const variants = customTypes[productDir] ?? [];
    manifest[id] = { main: [], gallery: [], scene: [], spec: [], variant: [] };

    for (const [sourceKind, { slug, role, label }] of Object.entries(KINDS)) {
      const dir = path.join(SRC, productDir, sourceKind);
      if (!existsSync(dir)) continue;
      const outDir = path.join(OUT, productDir, slug);
      await mkdir(outDir, { recursive: true });

      const files = (await readdir(dir))
        .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
        .sort(byIndex);

      for (const file of files) {
        const base = path.basename(file, path.extname(file));
        let name;

        if (role === 'variant') {
          // "00_10号23CM双闭_1" -> variant index 00, shot 1
          const idx = Number((base.match(/^(\d+)_/) || [])[1] ?? -1);
          const shot = (base.match(/_(\d+)$/) || [])[1] ?? '1';
          const variantName = variants[idx]?.name_en ?? `variant-${idx}`;
          name = `${String(idx).padStart(2, '0')}-${slugify(variantName)}-${shot}.webp`;
        } else if (FIXED_NAMES[base]) {
          name = `${FIXED_NAMES[base]}.webp`;
        } else if (role === 'main') {
          name = 'main.webp';
        } else {
          // p0 / s3 style library names carry their own ordering number.
          const n = (base.match(/(\d+)/) || [])[1] ?? '1';
          name = `${slug}-${n}.webp`;
        }

        try {
          const info = await convert(path.join(dir, file), path.join(outDir, name));
          manifest[id][role].push({
            src: `/images/products/${productDir}/${slug}/${name}`,
            // Never fall back to `base` here: it is the original Chinese filename.
            alt: variants[Number((base.match(/^(\d+)_/) || [])[1])]?.name_en ?? FIXED_LABELS[base] ?? label,
            ...info,
          });
          converted++;
        } catch (err) {
          failures.push(`${productDir}/${sourceKind}/${file}: ${err.message}`);
        }
      }
    }
  }

  await writeFile(
    path.resolve(ROOT, 'src', 'data', 'image-manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8',
  );

  const total = Object.values(manifest).reduce(
    (s, m) => s + Object.values(m).reduce((x, a) => x + a.length, 0),
    0,
  );
  console.log(`converted: ${converted}, failed: ${failures.length}, manifest: ${total}`);
  failures.slice(0, 10).forEach((f) => console.log('  !', f));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
