import type { Guide } from '@/data/guides';

/**
 * Metadata text helpers.
 *
 * Search engines truncate a meta description somewhere around 155–160
 * characters, so anything longer is written for nobody — the tail is simply cut
 * mid-word in the SERP. Several pages here derive their description from a
 * longer source string (a guide's `summary`, an application's `intro`), and the
 * source text is published content that must not be edited to suit a meta tag.
 *
 * `clampDescription` therefore lives here: it shortens a derived description to
 * a length that survives the SERP intact, without touching the source data.
 */

/**
 * Words that read as unfinished when they end a sentence. A clamp that lands
 * just before one of these produces a description ending in "…and the", so they
 * are trimmed off the tail instead.
 */
const DANGLING = new Set([
  // articles, conjunctions and pronouns
  'a', 'all', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'been', 'being', 'both', 'but',
  'by', 'can', 'could', 'did', 'do', 'does', 'either', 'for', 'from', 'had', 'has', 'have',
  'he', 'if', 'in', 'into', 'is', 'it', 'its', 'may', 'me', 'might', 'more', 'most', 'must',
  'my', 'neither', 'no', 'nor', 'not', 'of', 'on', 'or', 'our', 'shall', 'she', 'should',
  'so', 'some', 'such', 'than', 'that', 'the', 'their', 'them', 'then', 'these', 'they',
  'this', 'those', 'to', 'us', 'was', 'we', 'were', 'which', 'while', 'who', 'whose',
  'will', 'with', 'would', 'you', 'your',
  // prepositions — a description should not end on one
  'about', 'above', 'across', 'after', 'against', 'along', 'among', 'around', 'before',
  'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 'despite', 'down', 'during',
  'except', 'inside', 'like', 'near', 'off', 'onto', 'out', 'outside', 'over', 'past',
  'per', 'since', 'through', 'throughout', 'toward', 'towards', 'under', 'until', 'up',
  'upon', 'via', 'within', 'without',
]);

/** Collapses runs of whitespace so the length check matches what a SERP shows. */
const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();

/** Strips punctuation left hanging by the cut ("…, " / "… —"). */
const stripTrailingPunctuation = (text: string) => text.replace(/[\s,;:.!?—–-]+$/, '');

/**
 * Shortens `text` to at most `max` characters (default 158) on a word boundary.
 *
 * No ellipsis is appended — it would only consume characters that a longer word
 * could have used, and Google truncates with its own marker anyway.
 *
 * Text already within the limit is returned unchanged apart from whitespace
 * normalisation, so a description is never lengthened or reshaped by this.
 */
export function clampDescription(text: string, max = 158): string {
  const clean = normalize(text);
  if (clean.length <= max) return clean;

  // Slice one character past the limit so a word that ends exactly on it is not
  // thrown away, then drop the final (possibly partial) word.
  const words = clean.slice(0, max + 1).split(' ');
  words.pop();

  // Never trim past a usable length: a description that ends on a conjunction is
  // still better than one Google pads out.
  const floor = Math.min(120, max);
  const dangling = (word: string) => DANGLING.has(word.toLowerCase().replace(/[^a-z]/g, ''));
  while (
    words.length > 1 &&
    dangling(words[words.length - 1]) &&
    words.slice(0, -1).join(' ').length >= floor
  ) {
    words.pop();
  }

  const clamped = stripTrailingPunctuation(words.join(' '));
  // Only reachable if the very first word is longer than `max`.
  return clamped || stripTrailingPunctuation(clean.slice(0, max));
}

/**
 * Title overrides.
 *
 * The root layout renders `%s | YILON`, so every title pays 8 characters it
 * does not control, and a `<title>` past ~60 characters is cut in the SERP. Two
 * groups of pages publish a title that is too long for that budget:
 *
 *  - guide titles, which are the article's own H1 (`src/data/guides.ts`) and are
 *    not edited here — only the metadata string is shortened, so the visible
 *    article is untouched;
 *  - application headlines, same reasoning, with a shorter per-slug title.
 *
 * Both maps are exhaustive-by-exception: anything not listed keeps its own
 * title, so adding a guide or application needs no change here unless its title
 * is over budget.
 */
const GUIDE_TITLES: Record<string, string> = {
  'inflatable-gear-sealing': 'Sealing for Inflatable Boats, SUPs and Tents',
  'top-airtight-zipper-manufacturers': 'Airtight Zipper Manufacturers: Sourcing Guide',
};

const APPLICATION_TITLES: Record<string, string> = {
  'waterproof-gear': 'Waterproof Equipment Zippers',
  'rainwear-dry-bags': 'Rainwear & Everyday Dry Bag Zippers',
  cleanrooms: 'Cleanroom & Controlled Environment Zippers',
};

/** Metadata title for `/technology/[slug]` — the canonical guide URL. */
export const guideTitle = (guide: Pick<Guide, 'slug' | 'title'>): string =>
  GUIDE_TITLES[guide.slug] ?? guide.title;

/**
 * Metadata title for `/blog/[slug]`.
 *
 * The blog route serves the same article and points its canonical at the
 * technology URL, which is correct. The one thing it must not do is present an
 * identical `<title>` — an alias with a byte-identical title is the duplicate a
 * crawler reports even when the canonical is right — so it carries a distinct
 * suffix.
 */
export const guideAliasTitle = (guide: Pick<Guide, 'slug' | 'title'>): string =>
  `${guideTitle(guide)} — Blog`;

/** Metadata title for `/applications/[slug]`; falls back to the page headline. */
export const applicationTitle = (slug: string, headline: string): string =>
  APPLICATION_TITLES[slug] ?? headline;
