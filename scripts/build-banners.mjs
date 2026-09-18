/**
 * Convert the homepage banner artwork into optimised WebP assets under public/.
 *
 * Deliberately separate from scripts/build-images.mjs. That script owns the
 * product library, is hard-wired to ../doc/dgyilon产品资料库/07_产品图片, and
 * rewrites src/data/image-manifest.json wholesale — a manifest whose 437-entry
 * count is asserted by scripts/verify-content.mjs. Banner assets live outside
 * that manifest on purpose: this script writes only public/images/hero/ and
 * src/data/banner-manifest.json, so the 437 check is untouched.
 *
 * Output names come from an explicit table rather than a slugify pass. One of
 * the source filenames ("waterproof zippe.png") is missing its final letter;
 * slugifying it would publish the typo in a URL that is then cached for a year.
 * The table also turns a renamed source file into a loud failure instead of a
 * silently missing slide.
 */
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Resolved from this file, never process.cwd(): the project lives at
// D:\cc\zipper\Russia\yilon-en, and reading cwd would reintroduce the
// lower-case "russia" path that makes webpack bundle every module twice.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.resolve(ROOT, '..', '首页轮播图片');
const OUT = path.resolve(ROOT, 'public', 'images', 'hero');
const MANIFEST = path.resolve(ROOT, 'src', 'data', 'banner-manifest.json');

/**
 * Container is max-w-7xl (1280px), so that is the widest the banner is ever
 * rendered. None of the current sources exceed it; the cap is a contract for
 * whatever artwork is dropped in next, so a 3000px file cannot end up served
 * under an immutable cache header at full size.
 */
const MAX_WIDTH = 1280;

/** Source filename -> output slug, in slide order. */
const SOURCES = [
  { file: 'Airtight Zipper.png', slug: 'airtight-zipper' },
  { file: 'dry suit zipper.png', slug: 'dry-suit-zipper' },
  { file: 'inflatable boat zipper.png', slug: 'inflatable-boat-zipper' },
  { file: 'TPU airtight zipper.png', slug: 'tpu-airtight-zipper' },
  { file: 'waterproof zippe.png', slug: 'waterproof-zipper' },
];

async function convert(srcPath, destPath) {
  const image = sharp(srcPath, { failOn: 'none' }).rotate();
  const meta = await image.metadata();
  const sourceWidth = meta.width ?? null;
  const sourceHeight = meta.height ?? null;
  const resized = Boolean(sourceWidth && sourceWidth > MAX_WIDTH);

  const pipeline = resized
    ? image.resize({ width: MAX_WIDTH, withoutEnlargement: true })
    : image;
  const buf = await pipeline.webp({ quality: 82, effort: 5 }).toBuffer();
  await writeFile(destPath, buf);

  // Record the dimensions actually written, not the source's: a future banner
  // wider than MAX_WIDTH would otherwise claim a width it is never served at.
  const width = resized ? MAX_WIDTH : sourceWidth;
  const height =
    resized && sourceWidth && sourceHeight
      ? Math.round((sourceHeight * MAX_WIDTH) / sourceWidth)
      : sourceHeight;

  return { width, height, bytes: buf.length };
}

async function main() {
  const present = new Set(await readdir(SRC));
  const missing = SOURCES.filter((s) => !present.has(s.file)).map((s) => s.file);
  if (missing.length) {
    throw new Error(`banner source(s) not found in ${SRC}: ${missing.join(', ')}`);
  }

  await mkdir(OUT, { recursive: true });

  const manifest = {};
  for (const { file, slug } of SOURCES) {
    const info = await convert(path.join(SRC, file), path.join(OUT, `${slug}.webp`));
    manifest[slug] = { src: `/images/hero/${slug}.webp`, ...info };
    console.log(`  ${file}  ->  /images/hero/${slug}.webp  (${info.width}x${info.height})`);
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2), 'utf8');

  const total = Object.values(manifest).reduce((n, m) => n + m.bytes, 0);
  console.log(`banners: ${Object.keys(manifest).length}, bytes: ${total}`);
}

await main();
