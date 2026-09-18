/**
 * Technical guides.
 *
 * Content is the manufacturer's own published English guide copy, restructured
 * into typed blocks so it can be rendered semantically (real H2/H3, real tables)
 * rather than as pre-formatted text. Wording, figures and test conditions are
 * unchanged; only the markup around them is new.
 *
 * Blocks are a discriminated union so a second locale can supply the same shape.
 */

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'table'; caption?: string; head: string[]; rows: string[][] }
  | { type: 'callout'; title: string; text: string };

export type Guide = {
  slug: string;
  title: string;
  subtitle: string;
  /** One-sentence summary used on cards and as the meta description basis. */
  summary: string;
  seoKeyword: string;
  updated: string;
  relatedProductIds: string[];
  relatedApplicationSlugs: string[];
  blocks: Block[];
};

export const guides: Guide[] = [
  {
    slug: 'zipper-selection-guide',
    title: 'Airtight Waterproof Zipper Selection Guide',
    subtitle: 'Four steps to choose rating, size, material and custom specification',
    summary:
      'Choose an airtight waterproof zipper in four steps: waterproof rating, size, material and custom specification. Includes the published IPX6–IPX8, #5/#8/#10 and material comparisons.',
    seoKeyword: 'waterproof zipper selection guide',
    updated: '2026-09-16',
    relatedProductIds: ['1', '2', '4', '5', '6', '8'],
    relatedApplicationSlugs: ['military-equipment', 'waterproof-gear', 'drysuits-underwater'],
    blocks: [
      {
        type: 'p',
        text: 'Selection comes down to four things: waterproof rating (IPX6–IPX8), size (#5/#8/#10), material (TPU/PEVA/silicone/nylon), and customisation (length/width/colour/slider). Identify your application first, then match sealing needs from high to low to narrow down the model.',
      },
      { type: 'h2', text: 'Step 1: Determine the waterproof rating' },
      {
        type: 'table',
        caption: 'Waterproof rating, protection and typical uses',
        head: ['Rating', 'Protection', 'Typical uses', 'YILON products'],
        rows: [
          ['IPX6', 'Powerful water jets', 'Rainwear, dry bags, standard waterproof wear', 'PEVA / TPU waterproof zippers'],
          ['IPX7', 'Temporary immersion (1 m, 30 min)', 'Wading gear, snorkelling, water sports', '#5/#8 TPU watertight zippers'],
          ['IPX8', 'Continuous immersion (>1 m, by agreement)', 'Drysuits, deep-sea workwear, military/medical pressure sealing', '#8/#10 TPU airtight zippers'],
        ],
      },
      { type: 'h2', text: 'Step 2: Choose the size' },
      {
        type: 'table',
        head: ['Size', 'Approx. chain width', 'Applications'],
        rows: [
          ['#5', '~5 mm', 'Lightweight garments, dry bags, general outdoor gear'],
          ['#8', '~8 mm', 'Protective suits, drysuits, inflatable products'],
          ['#10', '~10 mm', 'Heavy industry, military, rapid roller doors, high-pressure sealing'],
        ],
      },
      { type: 'h2', text: 'Step 3: Choose the material' },
      {
        type: 'ul',
        items: [
          'TPU: best all-round performance — elasticity, abrasion and hydrolysis resistance, -30 to 70°C range, first choice for airtight sealing.',
          'PEVA: lightweight and low-cost, for everyday waterproofing.',
          'Silicone rubber: highly flexible and weather-resistant, used for drysuit envelopes.',
          'Nylon: soft, good for watertight uses, but less effective than one-piece TPU for high-pressure airtight sealing.',
        ],
      },
      { type: 'h2', text: 'Step 4: Confirm the 12 customisation parameters' },
      {
        type: 'p',
        text: 'Application, length range, opening length, size/tape width, colour, slider style, end structure, material, waterproof rating, oil-resistance requirement, test conditions, and quantity.',
      },
      {
        type: 'callout',
        title: 'What YILON supports',
        text: 'We support #5/#8/#10, chain width 35–70 mm, length 5 cm–100 m, and full colour customisation; provide IPX6–IPX8 test reports, 60 kPa sealing strength and 3,000+ open/close cycles; with full sample-to-production support.',
      },
    ],
  },
  {
    slug: 'airtight-vs-watertight-vs-waterproof',
    title: 'Airtight vs Watertight vs Waterproof Zippers',
    subtitle: 'A complete comparison of three sealing levels',
    summary:
      'Airtight, watertight and waterproof are three different sealing levels. This guide compares their definitions, ratings, structure and typical uses — and the one question that tells you which you need.',
    seoKeyword: 'airtight vs watertight zipper',
    updated: '2026-09-16',
    relatedProductIds: ['1', '4', '5', '8'],
    relatedApplicationSlugs: ['drysuits-underwater', 'military-equipment', 'rainwear-dry-bags'],
    blocks: [
      {
        type: 'p',
        text: 'These are three levels of sealing: airtight zippers block both air and liquid and handle pressure differentials — the highest grade; watertight zippers block liquid water and handle short immersion but not sustained pressure; waterproof zippers resist splashes and brief rain. The simple test: does your product need to hold pressure?',
      },
      { type: 'h2', text: 'Airtight vs watertight vs waterproof' },
      {
        type: 'table',
        head: ['Type', 'Definition', 'Rating', 'Structure', 'Typical uses'],
        rows: [
          [
            'Airtight',
            'Blocks air & liquid, holds pressure',
            'IPX8 + pressure test',
            'One-piece TPU, sealing lip, minimal seams',
            'Drysuits, military, medical isolation, high-pressure inflatables',
          ],
          [
            'Watertight',
            'Blocks liquid water, short immersion',
            'IPX7',
            'Nylon/TPU composite, tape seal',
            'Wading suits, snorkelling, outdoor dry bags',
          ],
          [
            'Waterproof',
            'Splash and rain resistance',
            'IPX6',
            'Coating or standard tape',
            'Rainwear, general outdoor, everyday items',
          ],
        ],
      },
      { type: 'h2', text: 'Key differences' },
      {
        type: 'ul',
        items: [
          'Pressure: airtight holds pressure differentials; watertight and waterproof do not.',
          'Immersion: IPX7 lasts ~30 min; IPX8 allows continuous immersion.',
          'Structure: airtight zippers use one-piece TPU with fewer seams and lower failure risk.',
          'Material & flexibility: higher grades mean thicker material — balance flexibility against strength.',
        ],
      },
      {
        type: 'callout',
        title: 'Choosing between the three',
        text: 'YILON covers waterproof, watertight and airtight grades. Our engineering team can recommend the right level to avoid over-engineering costs or under-sealing failures.',
      },
    ],
  },
  {
    slug: 'ipx-waterproof-rating-guide',
    title: 'IPX Waterproof Rating Guide: IPX6, IPX7, IPX8',
    subtitle: 'Understand waterproof rating codes on zippers and gear',
    summary:
      'What IPX6, IPX7 and IPX8 actually mean, with the IEC 60529 test conditions behind each rating and the limitations of using IPX alone to specify a sealed zipper.',
    seoKeyword: 'IPX waterproof rating',
    updated: '2026-09-16',
    relatedProductIds: ['1', '2', '4', '5', '9'],
    relatedApplicationSlugs: ['drysuits-underwater', 'waterproof-gear'],
    blocks: [
      {
        type: 'p',
        text: 'IPX is the water-protection code in IEC 60529. The higher the number, the stronger the protection. When buying zippers you will most often see IPX6 / IPX7 / IPX8: IPX6 resists powerful jets, IPX7 handles temporary immersion, IPX8 allows continuous immersion.',
      },
      { type: 'h2', text: 'IPX rating chart' },
      {
        type: 'table',
        head: ['Rating', 'Test conditions', 'Protection', 'Typical uses'],
        rows: [
          ['IPX4', 'Splashing water', 'Everyday splashes', 'Light outdoor, everyday items'],
          ['IPX5', 'Water jets (low pressure)', 'General jets', 'Outdoor sports gear'],
          ['IPX6', 'Powerful jets (12.5 mm nozzle, 100 L/min, 3 m, ≥3 min)', 'Storm-level jets', 'Rainwear, dry bags, fast-dry wear'],
          ['IPX7', 'Immersion 1 m for 30 min', 'Temporary immersion', 'Wading, snorkelling, water sports'],
          ['IPX8', 'Continuous immersion >1 m (depth & duration per agreement)', 'Continuous immersion', 'Drysuits, military, medical pressure-sealed equipment'],
        ],
      },
      { type: 'h2', text: 'Important notes' },
      {
        type: 'ul',
        items: [
          'IPX covers water ingress only — it does not equal airtightness or pressure retention; for that, check sealing-pressure tests such as 60 kPa.',
          'A product can pass multiple ratings; rely on the manufacturer’s test report.',
          'Ask suppliers for third-party or factory test reports for the rating you need.',
        ],
      },
      {
        type: 'callout',
        title: 'YILON testing',
        text: 'YILON offers IPX6–IPX8 full-rating testing; airtight zippers additionally carry a 60 kPa sealing-pressure test, with factory reports included.',
      },
    ],
  },
  {
    slug: 'drysuit-zipper-materials',
    title: 'Drysuit Zipper Materials & Test Standards',
    subtitle: 'Material selection and testing for drysuit envelope zippers',
    summary:
      'Why silicone rubber is used for drysuit envelope zippers, how salt water and deep-sea pressure affect the seal, and what to test before specifying an IPX8 drysuit closure.',
    seoKeyword: 'drysuit zipper',
    updated: '2026-09-16',
    relatedProductIds: ['9', '6'],
    relatedApplicationSlugs: ['drysuits-underwater'],
    blocks: [
      {
        type: 'p',
        text: 'A drysuit envelope is a continuous-immersion closure, not a splash-resistant one. Material choice drives how the seal behaves under pressure, in salt water, and across the thousands of cycles a working drysuit sees.',
      },
      { type: 'h2', text: 'Material comparison for drysuit closures' },
      {
        type: 'table',
        head: ['Material', 'Behaviour', 'Suited to'],
        rows: [
          ['Silicone rubber', 'Highly flexible, weather-resistant, excellent saltwater resistance', 'Drysuit envelopes, deep-sea and underwater rescue work'],
          ['TPU', 'Elasticity, abrasion and hydrolysis resistance, -30 to 70°C', 'Airtight pressure-sealed assemblies'],
          ['Nylon woven + TPU', 'Soft and flexible, good watertight performance', 'Watertight garments where a one-piece TPU build is unnecessary'],
        ],
      },
      { type: 'h2', text: 'Published drysuit envelope specification' },
      {
        type: 'table',
        head: ['Parameter', 'Value'],
        rows: [
          ['Size', '#5 / #8'],
          ['Material', 'Silicone Rubber'],
          ['Waterproof rating', 'IPX8'],
          ['Saltwater resistance', 'Excellent'],
          ['Process', 'HF welding, bonding'],
          ['Environment', 'Deep-sea high pressure'],
        ],
      },
      { type: 'h2', text: 'What to test' },
      {
        type: 'ul',
        items: [
          'Immersion testing to the depth and duration your project requires — IPX8 is defined by agreement, not by a fixed number.',
          'Open/close cycle testing; the published durability figure across the range is 3,000+ cycles.',
          'Salt spray testing where the suit will be used in seawater.',
          'Assembly testing with the finished suit, including the neck and sleeve seals.',
        ],
      },
      {
        type: 'callout',
        title: 'Accessories',
        text: 'Neck seal and sleeve seal accessories are published alongside the YILON drysuit envelope zipper.',
      },
    ],
  },
  {
    slug: 'tpu-zipper-manufacturing',
    title: 'TPU Airtight Zipper Manufacturing Process',
    subtitle: 'How a TPU airtight zipper is built and assembled',
    summary:
      'How TPU airtight zippers are constructed and joined to a host material — high-frequency welding, sewing with tape, and bonding — and what each process means for seal integrity.',
    seoKeyword: 'TPU zipper manufacturing',
    updated: '2026-09-16',
    relatedProductIds: ['1', '2', '3', '8'],
    relatedApplicationSlugs: ['waterproof-gear', 'protective-suits'],
    blocks: [
      {
        type: 'p',
        text: 'TPU is the manufacturer’s first choice for airtight sealing: it combines elasticity with abrasion and hydrolysis resistance across a -30 to 70°C range, and it can be welded rather than only sewn.',
      },
      { type: 'h2', text: 'Published assembly processes' },
      {
        type: 'table',
        head: ['Process', 'Used on', 'Notes'],
        rows: [
          ['HF welding, sewing/tape, bonding', '#10 resin, #5 resin, circular airtight zipper', 'Full combination available on the resin and circular ranges'],
          ['HF welding, tape, bonding', 'Self-healing airtight zipper', 'Sewing is not listed for this product'],
          ['HF welding, sewing', 'PEVA airtight zipper, high-speed roller door zipper', 'Simpler two-process route'],
          ['HF welding, bonding', 'Drysuit envelope zipper', 'Suited to silicone rubber'],
        ],
      },
      { type: 'h2', text: 'Why high-frequency welding matters' },
      {
        type: 'ul',
        items: [
          'Welding fuses the zipper tape to the host material instead of perforating it, so the seal is not interrupted by stitch holes.',
          'It suits TPU and PVC panels — the materials used on dry bags, inflatables and protective coverings.',
          'Where the host material cannot be welded, sewing followed by seam taping is the published alternative.',
        ],
      },
      {
        type: 'callout',
        title: 'Sealing performance',
        text: 'Airtight TPU builds are published with 60 kPa sealing strength (#10 resin and circular) and 3,000+ open/close cycles.',
      },
    ],
  },
  {
    slug: 'inflatable-gear-sealing',
    title: 'Sealing Solutions for Inflatable Boats, SUPs and Tents',
    subtitle: 'Choosing a closure for inflatable gear',
    summary:
      'What an inflatable closure has to do — hold air pressure, survive folding and resist abrasion — and how airtight zipper specification follows from that.',
    seoKeyword: 'inflatable boat zipper',
    updated: '2026-09-16',
    relatedProductIds: ['3', '1', '8'],
    relatedApplicationSlugs: ['waterproof-gear', 'sealed-bags-luggage'],
    blocks: [
      {
        type: 'p',
        text: 'An inflatable closure is a pressure seal first. It is folded, packed and inflated repeatedly, and it has to hold air as well as keep water out — which puts it in the airtight category rather than the watertight one.',
      },
      { type: 'h2', text: 'What to specify' },
      {
        type: 'ul',
        items: [
          'Sealing strength: airtight builds are published with a 60 kPa sealing pressure test (#10 resin, circular).',
          'Derail recovery: the self-healing airtight zipper resets automatically after derailing, which matters on inflatables and rescue equipment where failure is not an option.',
          'Closed-loop openings: where the port is not a straight line, the circular airtight zipper gives 360-degree sealing.',
          'Assembly: HF welding suits the TPU and PVC panels used on inflatables.',
        ],
      },
      { type: 'h2', text: 'Published values to check against your project' },
      {
        type: 'table',
        head: ['Parameter', 'Published value'],
        rows: [
          ['Seal strength (#10 resin, circular)', '60 kPa'],
          ['Seal strength (#5 resin, self-healing)', '30 kPa'],
          ['Tensile strength (#10 resin, circular)', '1100 N/5 cm'],
          ['Heat resistance (TPU)', '-30°C ~ 70°C'],
          ['Durability', '3000+ cycles'],
        ],
      },
      {
        type: 'callout',
        title: 'Confirm against your own test',
        text: 'Published values are reference figures. The pressure actually withstood depends on size, material, installation method and end structure — confirm against your project’s test conditions.',
      },
    ],
  },
  {
    slug: 'top-airtight-zipper-manufacturers',
    title: 'Airtight Waterproof Zipper Manufacturers: A Sourcing Guide',
    subtitle: 'How to compare airtight zipper suppliers',
    summary:
      'What to compare when sourcing airtight waterproof zippers — published test values, material capability, process range, customisation envelope and documentation.',
    seoKeyword: 'airtight zipper manufacturer',
    updated: '2026-09-16',
    relatedProductIds: ['1', '2', '5', '6', '9'],
    relatedApplicationSlugs: ['military-equipment', 'drysuits-underwater'],
    blocks: [
      {
        type: 'p',
        text: 'Airtight zippers are not a commodity. Two suppliers can both quote “IPX8 waterproof zipper” and still be producing closures that behave completely differently under pressure. The difference is what they are willing to publish and test.',
      },
      { type: 'h2', text: 'What to compare' },
      {
        type: 'table',
        head: ['Criterion', 'What to ask for'],
        rows: [
          ['Published test values', 'A seal-strength figure (e.g. 60 kPa), a cycle figure (e.g. 3,000+), and the test conditions behind them'],
          ['Rating coverage', 'Whether the supplier tests IPX6, IPX7 and IPX8, and under what nozzle, depth and duration'],
          ['Material range', 'TPU, PEVA, silicone rubber and nylon woven capability rather than a single material'],
          ['Process range', 'HF welding, sewing with tape, and bonding — because the process must match your host material'],
          ['Customisation envelope', 'Length range, tape width, colour, slider and opening style'],
          ['Documentation', 'Test reports for the rating you need, and certification documents on request'],
        ],
      },
      { type: 'h2', text: 'Red flags' },
      {
        type: 'ul',
        items: [
          'A rating quoted without test conditions — IPX8 is defined “by agreement”, so the depth and duration must be stated.',
          'No published seal-strength figure for an airtight product; water rating alone does not describe pressure performance.',
          'A single material offered for every application.',
          'Unwillingness to sample against your own material — the finished assembly is what has to pass, not the zipper alone.',
        ],
      },
      {
        type: 'callout',
        title: 'YILON in context',
        text: 'YILON publishes #5/#8/#10 sizes, 35–70 mm chain width, 5 cm–100 m length, IPX6–IPX8 testing, 60 kPa sealing strength and 3,000+ cycle durability, with certification documents available on request.',
      },
    ],
  },
  {
    slug: 'custom-zipper-procurement-checklist',
    title: 'Custom Airtight Zipper: Procurement Checklist',
    subtitle: 'The parameters and process for a custom order',
    summary:
      'A complete procurement checklist for custom airtight zippers: the parameters to supply, the sample validation steps, and the acceptance criteria to agree before mass production.',
    seoKeyword: 'custom waterproof zipper',
    updated: '2026-09-16',
    relatedProductIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    relatedApplicationSlugs: ['military-equipment', 'waterproof-gear', 'industrial-fast-doors'],
    blocks: [
      {
        type: 'p',
        text: 'A custom airtight zipper order succeeds or fails on the parameters agreed up front. This checklist covers what to supply at enquiry, what to validate at sample stage, and what to sign off before mass production.',
      },
      { type: 'h2', text: 'Step 1: Supply these parameters with your enquiry' },
      {
        type: 'ul',
        items: [
          'Use case and application',
          'Length range (5 cm to 100 m) and effective opening length',
          'Size or tape width',
          'Colour',
          'Opening style and slider count',
          'Host material to be joined',
          'Target waterproof rating (IPX6 / IPX7 / IPX8)',
          'Oil resistance requirement',
          'Test conditions and acceptance criteria',
          'Sample, trial production and mass production quantities',
        ],
      },
      { type: 'h2', text: 'Step 2: Validate at sample stage' },
      {
        type: 'table',
        head: ['Check', 'What to confirm'],
        rows: [
          ['Model and colour', 'Matches the drawing and the target assembly'],
          ['Length and opening style', 'Effective opening length is correct in the finished assembly'],
          ['Slider and end structure', 'Type, count and end treatment as specified'],
          ['Dimensions and tolerances', 'Measured against the agreed drawing'],
          ['Cycle testing', '3,000+ open/close cycles as published'],
          ['Airtight / watertight testing', 'At the rating and test conditions agreed'],
          ['Assembly test with your material', 'Installed into the real host material, not tested loose'],
          ['Packaging and batch identification', 'Traceability and packing agreed before scale-up'],
        ],
      },
      { type: 'h2', text: 'Step 3: Agree before mass production' },
      {
        type: 'ul',
        items: [
          'Lead time — sampling is a 7–15 day reference and mass production 15–30 days, subject to confirmation',
          'Sampling method and acceptance criteria',
          'Batch identification and traceability',
          'Documentation: test reports for the agreed rating',
        ],
      },
      {
        type: 'callout',
        title: 'MOQ',
        text: 'The minimum order quantity depends on specification and material — there is no single figure. Include your estimated quantity with your enquiry and it will be confirmed against your project.',
      },
    ],
  },
];

export const getGuide = (slug: string): Guide | undefined => guides.find((g) => g.slug === slug);

/** Guides are also the site's in-depth article set — see /blog. */
export const guideAsPost = (g: Guide) => ({
  slug: g.slug,
  title: g.title,
  excerpt: g.summary,
  date: g.updated,
  href: `/blog/${g.slug}`,
  keyword: g.seoKeyword,
});
