/**
 * Company facts.
 *
 * SOURCE OF TRUTH: the product library at ../doc/dgyilon产品资料库 (05_公司资料).
 * Every value here is taken from the manufacturer's own published material.
 * Anything not published by the manufacturer is intentionally absent rather
 * than guessed — components must render a graceful fallback, never an invention.
 */

export const company = {
  legalName: 'Dongtai SZIP Science&Technology CO.,Limited',
  brand: 'YILON',
  founded: 2014,
  industry: 'Airtight & waterproof zipper manufacturing',

  /** Street address exactly as published by the manufacturer. */
  address: {
    street: 'South No.2, Weiyi Road, Precision Industrial Park',
    town: 'Sizao Town',
    city: 'Dongtai City',
    province: 'Jiangsu Province',
    postcode: '224248',
    country: 'China',
  },

  contact: {
    person: 'Mr. Hai Smith',
    /** Contact details are supplied by the client and are not drawn from the
     *  product library — they are the one field set the manufacturer does not
     *  publish as part of its product data. */
    /** Primary first: it is the one used wherever only a single value fits,
     *  such as the Organization node in the JSON-LD. */
    phones: [
      { display: '+86 18973134733', href: '+8618973134733' },
      { display: '+86 18073184270', href: '+8618073184270' },
    ],
    email: 'shishunhai2026@gmail.com',
  },

  // --- Published business metrics. Do not extrapolate or add new ones. ---
  stats: {
    yearsInBusiness: new Date().getFullYear() - 2014,
    exportCountries: 30, // "exported to more than 30 countries and regions"
    enterpriseClients: 300, // "serving over 300 enterprise clients worldwide"
    productSeries: 9,
    subModels: 60,
  },

  markets: ['North America', 'Europe', 'Southeast Asia', 'the Middle East'] as const,

  certifications: {
    /** Stated by the manufacturer in prose. No downloadable certificate files
     *  are published on their site, so these are claims, not verified documents. */
    claimed: [
      'National High-Tech Enterprise certification',
      'ISO system certification',
      'Multiple patents',
      'Test reports',
      'IPX6 / IPX7 / IPX8 full-rating testing',
    ],
    /** Surfaced in the UI so the claim is never presented as an audited fact. */
    note: 'Certification documents are available on request. Contact us and we will send the originals for your project.',
  },

  /**
   * Capability statements the manufacturer publishes about its own operation.
   * Kept deliberately short — no factory size, headcount, equipment list or
   * capacity figures are published, so none are presented.
   */
  capabilities: [
    'In-house R&D team with multiple patents',
    'Modern production workshops and equipment',
    'Quality management system applied to every order',
    'OEM / ODM and full custom sizing',
    'HF welding, sewing/tape and bonding processes',
  ],

  /** Customisation envelope, from the manufacturer's published FAQ. */
  customisation: {
    lengthRange: '5 cm to 100 m',
    options: [
      'Size and tape width',
      'Length and effective opening',
      'Colour',
      'Slider type and count',
      'Opening style',
      'Material and coating',
      'Waterproof rating and oil resistance',
      'Test requirements',
    ],
    sampleLeadTime: '7–15 days (reference)',
    productionLeadTime: '15–30 days (reference)',
    moq: 'Depends on specification and material — confirmed per project',
  },
} as const;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://www.yilon-zipper.com';
