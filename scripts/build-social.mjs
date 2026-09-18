/**
 * Generate the social share card and the Organization logo.
 *
 * Both are committed to public/ and referenced from the metadata and the
 * Organization schema. They are generated rather than hand-authored so the
 * brand colours stay in one place and the pair can be regenerated if the
 * wordmark or palette changes.
 *
 * Run with `npm run build:social`.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.resolve(ROOT, 'public');

// Brand palette — must match the @theme tokens in src/app/globals.css.
const NAVY_900 = '#142a3a';
const NAVY_800 = '#1d3a4f';
const ACCENT = '#fb5a12';
const WHITE = '#ffffff';
const STEEL = '#c3d8e5';

// SVG text has no font fallback chain of its own, so name fonts that exist on
// the machine doing the generating. The output is committed, so this only has
// to resolve at build time.
const FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

const OG_W = 1200;
const OG_H = 630;

/**
 * The 1200×630 share card.
 *
 * Layout: the banner artwork runs full width across the top at its own aspect
 * ratio (1158×456 → 1200×473), so nothing in it is cropped and its own YILON
 * badge survives. The remaining 157px carries the headline on the brand navy,
 * faded in from the image so the two read as one card rather than a photo with
 * a caption bar.
 */
async function buildOgImage() {
  const bannerPath = path.resolve(OUT, 'images', 'hero', 'airtight-zipper.webp');
  const bannerW = OG_W;
  const banner = await sharp(bannerPath)
    .resize({ width: bannerW })
    .toBuffer();
  const bannerMeta = await sharp(banner).metadata();
  const bannerH = bannerMeta.height ?? 473;
  const textTop = bannerH;

  const overlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${NAVY_900}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${NAVY_900}" stop-opacity="1"/>
    </linearGradient>
  </defs>

  <!-- Blend the artwork into the navy block beneath it -->
  <rect x="0" y="${textTop - 110}" width="${OG_W}" height="110" fill="url(#fade)"/>

  <rect x="0" y="${textTop + 34}" width="64" height="4" rx="2" fill="${ACCENT}"/>

  <text x="64" y="${textTop + 96}" font-family="${FONT}" font-size="44" font-weight="700"
        fill="${WHITE}" letter-spacing="-0.5">Airtight &amp; Waterproof Zippers</text>

  <text x="64" y="${textTop + 136}" font-family="${FONT}" font-size="21" font-weight="400"
        fill="${STEEL}">IPX6–IPX8 sealing · 60 kPa tested · built to order from 5 cm to 100 m</text>
</svg>`;

  const out = await sharp({
    create: { width: OG_W, height: OG_H, channels: 4, background: NAVY_900 },
  })
    .composite([
      { input: banner, top: 0, left: 0 },
      { input: Buffer.from(overlay), top: 0, left: 0 },
    ])
    // JPEG rather than WebP or PNG: this is a photograph, and JPEG is the one
    // format every social scraper renders (WebP previews are still unreliable
    // in WhatsApp and some LinkedIn clients). PNG came out at 1.2 MB.
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();

  await writeFile(path.resolve(OUT, 'og-image.jpg'), out);
  return out.length;
}

/**
 * The Organization logo.
 *
 * Square and filled edge to edge, which is what Google's logo guidance asks
 * for. It mirrors the brand mark in the site header: the YL monogram on
 * navy-800.
 */
async function buildLogo() {
  const size = 512;

  // The monogram is rendered on its own and trimmed to the ink, then centred on
  // the navy square. Placing text by baseline depends on the font's ascent
  // metrics and lands visibly off-centre; trimming is exact and font-agnostic.
  const textSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900">
  <text x="450" y="450" text-anchor="middle" dominant-baseline="central"
        font-family="${FONT}" font-size="320" font-weight="800"
        fill="${WHITE}" letter-spacing="-12">YL</text>
</svg>`;

  const trimmed = await sharp(Buffer.from(textSvg)).trim({ threshold: 1 }).toBuffer();
  const ink = await sharp(trimmed).metadata();
  const inkW = ink.width ?? 1;
  const inkH = ink.height ?? 1;

  // The mark should occupy a little under two thirds of the square, leaving the
  // clear margin Google's logo guidance asks for.
  const scale = (size * 0.62) / Math.max(inkW, inkH);
  const scaled = await sharp(trimmed)
    .resize({ width: Math.round(inkW * scale) })
    .toBuffer();
  const mark = await sharp(scaled).metadata();

  const out = await sharp({
    create: { width: size, height: size, channels: 4, background: NAVY_800 },
  })
    .composite([
      {
        input: scaled,
        left: Math.round((size - (mark.width ?? 0)) / 2),
        top: Math.round((size - (mark.height ?? 0)) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  await writeFile(path.resolve(OUT, 'logo.png'), out);
  return out.length;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const og = await buildOgImage();
  const logo = await buildLogo();
  console.log(`  public/og-image.jpg  ${(og / 1024).toFixed(1)} KB  (${OG_W}x${OG_H})`);
  console.log(`  public/logo.png      ${(logo / 1024).toFixed(1)} KB  (512x512)`);
}

await main();
