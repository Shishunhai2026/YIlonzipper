/**
 * Product catalogue — the single source of truth for the whole site.
 *
 * Every specification value below is reproduced verbatim from the manufacturer's
 * own published data (../doc/dgyilon产品资料库/03_技术参数). Values are never
 * rounded, converted or inferred. Where the manufacturer publishes nothing for a
 * field, the field is left undefined and the UI renders "Not published" rather
 * than a guess.
 *
 * Structure is locale-neutral: all display strings live under `en` so a second
 * locale can be added without reshaping the data.
 */
import imageManifest from './image-manifest.json';

export type ImageAsset = {
  src: string;
  alt: string;
  width: number | null;
  height: number | null;
  bytes: number;
};

type ImageRole = 'main' | 'gallery' | 'scene' | 'spec' | 'variant';

export const imagesFor = (id: string, role: ImageRole): ImageAsset[] =>
  ((imageManifest as Record<string, Record<string, ImageAsset[]>>)[id]?.[role] ?? []);

export type Spec = {
  /** Stable key used for comparison tables and i18n lookup. */
  key: string;
  label: string;
  value: string;
};

export type Variant = {
  index: number;
  name: string;
  imageCount: number;
};

export type ApplicationSlug =
  | 'military-equipment'
  | 'waterproof-gear'
  | 'sealed-bags-luggage'
  | 'protective-suits'
  | 'rainwear-dry-bags'
  | 'industrial-fast-doors'
  | 'cold-chain'
  | 'cleanrooms'
  | 'drysuits-underwater'
  | 'inflatable-boats'
  | 'rescue-equipment';

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  categorySlug: string;
  /** Verbatim values that drive filtering, schema.org and the comparison table. */
  specs: {
    size?: string;
    chainWidth?: string;
    tapeWidth?: string;
    endTab?: string;
    circumference?: string;
    length?: string;
    material?: string;
    slider?: string;
    waterproofRating?: string;
    sealStrength?: string;
    tensileStrength?: string;
    heatResistance?: string;
    durability?: string;
  };
  tags: string[];
  summary: string;
  description: string;
  applications: string[];
  applicationSlugs: ApplicationSlug[];
  /** Full parameter table exactly as published, in published order. */
  parameters: Spec[];
  features: string[];
  variants: Variant[];
  /** Only set when the manufacturer publishes something notable for that product. */
  note?: string;
};

export type Category = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  productIds: string[];
  /** Primary keyword this page targets — used for metadata, never stuffed. */
  seoKeyword: string;
};

/** `Not published` is rendered wherever the manufacturer publishes no value. */
export const NOT_PUBLISHED = 'Not published';

const p = (...pairs: [string, string][]): Spec[] =>
  pairs.map(([label, value]) => ({
    key: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    label,
    value,
  }));

const FEATURES = [
  'Airtight and waterproof sealing performance',
  'Multiple sizes available',
  'Custom colours available',
  'Eco-friendly materials',
  'IPX6 / IPX7 / IPX8 ratings available',
];

/** Variant lists are attached after the product literals — see VARIANT_NAMES. */

export const products: Product[] = [
  {
    id: '1',
    slug: '10-resin-airtight-zipper',
    name: '#10 Resin Airtight Zipper',
    shortName: '#10 Resin',
    categorySlug: 'resin-airtight-zippers',
    specs: {
      size: '#10',
      chainWidth: '10 mm',
      tapeWidth: '45 mm',
      endTab: '20 mm',
      length: 'Fully customizable',
      material: 'TPU',
      slider: 'Metal / Plastic',
      waterproofRating: 'IPX8',
      sealStrength: '60 kPa',
      tensileStrength: '1100 N/5 cm',
      heatResistance: '-30°C ~ 70°C',
      durability: '3000+ cycles',
    },
    tags: ['#10', 'TPU', 'IPX8'],
    summary:
      'Heavy-duty #10 resin airtight zipper with a TPU sealing layer, rated IPX8 and tested to 60 kPa sealing pressure.',
    description:
      'High-strength resin structure with a TPU sealing layer for military equipment, waterproof equipment, sealed bags and luggage, and protective suits. Strong teeth, stable sealing, and fully customizable sizing.',
    applications: [
      'Military equipment',
      'Waterproof equipment',
      'Sealed bags and luggage',
      'Protective suits',
    ],
    applicationSlugs: [
      'military-equipment',
      'waterproof-gear',
      'sealed-bags-luggage',
      'protective-suits',
    ],
    parameters: p(
      ['Chain Width', '10 mm'],
      ['Length', 'Fully customizable'],
      ['Tape Width', '45 mm'],
      ['End Tab', '20 mm'],
      ['Seal Strength', '60 kPa'],
      ['Tensile Strength', '1100 N/5 cm'],
      ['Heat Resistance', '-30°C ~ 70°C'],
      ['Material', 'TPU'],
      ['Slider', 'Metal/Plastic'],
      ['Process', 'HF welding, sewing/tape, bonding'],
      ['Weather Resistance', 'Good'],
      ['Oil Resistance', 'Good'],
      ['Durability', '3000+ cycles'],
      [
        'Application',
        'Military equipment, waterproof equipment, sealed bags and luggage, protective suits',
      ],
    ),
    features: FEATURES,
    variants: [],
  },
  {
    id: '2',
    slug: '5-resin-airtight-zipper',
    name: '#5 Resin Airtight Zipper',
    shortName: '#5 Resin',
    categorySlug: 'resin-airtight-zippers',
    specs: {
      size: '#5',
      chainWidth: '5 mm',
      tapeWidth: '35 mm',
      endTab: '16 mm',
      length: 'Fully customizable',
      material: 'TPU',
      slider: 'Metal / Plastic',
      waterproofRating: 'IPX8',
      sealStrength: '30 kPa',
      tensileStrength: '800 N/5 cm',
      heatResistance: '-30°C ~ 70°C',
      durability: '3000+ cycles',
    },
    tags: ['#5', 'TPU', 'IPX8'],
    summary:
      'Compact #5 resin airtight zipper — IPX8 sealed, 30 kPa tested, for lighter waterproof and airtight assemblies.',
    description:
      'Compact resin airtight zipper with excellent sealing for military equipment, waterproof equipment, sealed bags and luggage, and protective suits that require lightweight airtight waterproof sealing.',
    applications: [
      'Military equipment',
      'Waterproof equipment',
      'Sealed bags and luggage',
      'Protective suits',
    ],
    applicationSlugs: [
      'military-equipment',
      'waterproof-gear',
      'sealed-bags-luggage',
      'protective-suits',
    ],
    parameters: p(
      ['Chain Width', '5 mm'],
      ['Length', 'Fully customizable'],
      ['Tape Width', '35 mm'],
      ['End Tab', '16 mm'],
      ['Seal Strength', '30 kPa'],
      ['Tensile Strength', '800 N/5 cm'],
      ['Heat Resistance', '-30°C ~ 70°C'],
      ['Material', 'TPU'],
      ['Slider', 'Metal/Plastic'],
      ['Process', 'HF welding, sewing/tape, bonding'],
      ['Weather Resistance', 'Good'],
      ['Oil Resistance', 'Good'],
      ['Durability', '3000+ cycles'],
      [
        'Application',
        'Military equipment, waterproof equipment, sealed bags and luggage, protective suits',
      ],
    ),
    features: FEATURES,
    variants: [],
  },
  {
    id: '3',
    slug: 'self-healing-airtight-zipper',
    name: 'Self-Healing Airtight Zipper',
    shortName: 'Self-Healing',
    categorySlug: 'functional-airtight-zippers',
    specs: {
      size: '#5',
      chainWidth: '5 mm',
      endTab: '20 mm',
      length: 'Fully customizable',
      material: 'TPU',
      slider: 'Plastic',
      waterproofRating: 'IPX8',
      sealStrength: '30 kPa',
      tensileStrength: '160 N/5 cm',
      heatResistance: '-30°C ~ 70°C',
      durability: '3000+ cycles',
    },
    tags: ['#5', 'TPU', 'IPX8'],
    summary:
      'Recovers automatically if the chain derails — built for inflatables, rescue gear and any application where a failed seal is not an option.',
    description:
      'Self-healing airtight zipper with high-sealing construction and automatic recovery features for military equipment, waterproof equipment, sealed bags and luggage, and protective suits.',
    applications: [
      'Military equipment',
      'Waterproof equipment',
      'Sealed bags and luggage',
      'Protective suits',
    ],
    applicationSlugs: [
      'military-equipment',
      'waterproof-gear',
      'sealed-bags-luggage',
      'protective-suits',
    ],
    parameters: p(
      ['Chain Width', '5 mm'],
      ['Length', 'Fully customizable'],
      ['End Tab', '20 mm'],
      ['Seal Strength', '30 kPa'],
      ['Tensile Strength', '160 N/5 cm'],
      ['Heat Resistance', '-30°C ~ 70°C'],
      ['Material', 'TPU'],
      ['Slider', 'Plastic'],
      ['Process', 'HF welding, tape, bonding'],
      ['Weather Resistance', 'Good'],
      ['Oil Resistance', 'Good'],
      ['Durability', '3000+ cycles'],
      [
        'Application',
        'Military equipment, waterproof equipment, sealed bags and luggage, protective suits',
      ],
    ),
    features: FEATURES,
    variants: [],
    note: 'Keeps a high-sealing airtight structure while recovering automatically after derailing, so the zipper can carry on being used.',
  },
  {
    id: '4',
    slug: 'peva-airtight-zipper',
    name: 'PEVA Airtight Zipper',
    shortName: 'PEVA',
    categorySlug: 'functional-airtight-zippers',
    specs: {
      material: 'PEVA',
      waterproofRating: 'IPX7',
      length: 'Customizable',
    },
    tags: ['PEVA', 'IPX7'],
    summary:
      'Lightweight, eco-friendly PEVA airtight zipper for everyday waterproof products where cost matters as much as sealing.',
    description:
      'Lightweight airtight zipper made of PEVA material, eco-friendly and non-toxic, cost-optimized. Suitable for general waterproof clothing, rain gear, and daily waterproof items.',
    applications: ['Raincoats', 'Dry bags', 'Daily waterproof gear'],
    applicationSlugs: ['rainwear-dry-bags'],
    parameters: p(
      ['Material', 'PEVA'],
      ['Waterproof Rating', 'IPX7'],
      ['Color', 'Black (custom)'],
      ['Length', 'Customizable'],
      ['Process', 'HF welding, sewing'],
      ['Weather Resistance', 'Good'],
      ['Environment', 'Daily waterproofing'],
      ['Application', 'Raincoats, dry bags, daily waterproof gear'],
    ),
    features: FEATURES,
    variants: [],
  },
  {
    id: '5',
    slug: '5-nylon-woven-waterproof-zipper',
    name: '#5 Nylon Woven Waterproof Zipper',
    shortName: '#5 Nylon',
    categorySlug: 'nylon-woven-waterproof-zippers',
    specs: {
      size: '#5',
      tapeWidth: '32±1 mm',
      material: 'Coating: TPU; Tape: Polyester; Teeth: Nylon',
      waterproofRating: 'IPX6',
      length: 'Fully customizable',
      durability: '≥3000 cycles',
    },
    tags: ['#5', 'Nylon/TPU', 'IPX6'],
    summary:
      'Flexible TPU-coated nylon woven zipper rated IPX6, with full published pull-strength and dimensional tolerances.',
    description:
      'Nylon woven watertight zipper with TPU coating for IPX6 protection. Flexible and lightweight for military equipment, waterproof equipment, sealed bags and luggage, and protective suits.',
    applications: [
      'Military equipment',
      'Waterproof equipment',
      'Sealed bags and luggage',
      'Protective suits',
    ],
    applicationSlugs: [
      'military-equipment',
      'waterproof-gear',
      'sealed-bags-luggage',
      'protective-suits',
    ],
    parameters: p(
      ['Size', '#5'],
      ['Material', 'Coating: TPU; Tape: Polyester; Teeth: Nylon'],
      ['Waterproof Rating', 'IPX6'],
      ['Total Length', 'Fully customizable'],
      ['Effective Length', 'Fully customizable'],
      ['Weight (per meter)', '~35 g/m'],
      ['Tape Width', '32±1 mm'],
      ['Tooth Width', '6.2±1 mm'],
      ['Tape Thickness', '0.77±0.02 mm'],
      ['Tooth Height', '3.0±0.05 mm'],
      ['Color', 'Black (custom)'],
      ['Flat Pull Strength', '≥700 N'],
      ['Top Stop Strength', '≥250 N'],
      ['Sliding Smoothness', '≤20 N'],
      ['Slider Pull Force', '≤55 N'],
      ['Cycle Test', '≥3000 cycles'],
      [
        'Application',
        'Military equipment, waterproof equipment, sealed bags and luggage, protective suits',
      ],
    ),
    features: FEATURES,
    variants: [],
  },
  {
    id: '6',
    slug: '8-nylon-woven-waterproof-zipper',
    name: '#8 Nylon Woven Waterproof Zipper',
    shortName: '#8 Nylon',
    categorySlug: 'nylon-woven-waterproof-zippers',
    specs: {
      size: '#8',
      tapeWidth: '32±1 mm',
      material: 'Coating: TPU; Tape: Polyester; Teeth: Nylon',
      waterproofRating: 'IPX6',
      length: 'Fully customizable',
      durability: '≥3000 cycles',
    },
    tags: ['#8', 'Nylon/TPU', 'IPX6'],
    summary:
      'The heavier #8 nylon woven build — same IPX6 TPU coating, stronger structure for higher-durability seals.',
    description:
      '#8 nylon woven watertight zipper with a stronger structure and TPU coating for IPX6 protection, suitable for military equipment, waterproof equipment, sealed bags and luggage, and protective suits.',
    applications: [
      'Military equipment',
      'Waterproof equipment',
      'Sealed bags and luggage',
      'Protective suits',
    ],
    applicationSlugs: [
      'military-equipment',
      'waterproof-gear',
      'sealed-bags-luggage',
      'protective-suits',
    ],
    parameters: p(
      ['Size', '#8'],
      ['Material', 'Coating: TPU; Tape: Polyester; Teeth: Nylon'],
      ['Waterproof Rating', 'IPX6'],
      ['Total Length', 'Fully customizable'],
      ['Effective Length', 'Fully customizable'],
      ['Weight (per meter)', '~35 g/m'],
      ['Tape Width', '32±1 mm'],
      ['Tooth Width', '6.2±1 mm'],
      ['Tooth Height', '3.0±0.05 mm'],
      ['Color', 'Black (custom)'],
      ['Flat Pull Strength', '≥700 N'],
      ['Top Stop Strength', '≥250 N'],
      ['Sliding Smoothness', '≤20 N'],
      ['Slider Pull Force', '≤55 N'],
      ['Cycle Test', '≥3000 cycles'],
      [
        'Application',
        'Military equipment, waterproof equipment, sealed bags and luggage, protective suits',
      ],
    ),
    features: FEATURES,
    variants: [],
  },
  {
    id: '7',
    slug: 'high-speed-roller-door-zipper',
    name: 'High-Speed Roller Door Zipper',
    shortName: 'Roller Door',
    categorySlug: 'high-speed-roller-door-zippers',
    specs: {
      material: 'TPU/PVC',
      length: 'Customizable',
      durability: '3000+ cycles',
    },
    tags: ['TPU/PVC'],
    summary:
      'The sealing and load-bearing element of a zipper-type high-speed door, built for constant open/close cycles.',
    description:
      'Special zipper designed for high-speed roller doors with fast open/close and high durability. For industrial doors, cold chain logistics, and clean rooms.',
    applications: ['Industrial fast doors', 'Cold chain doors', 'Clean room doors'],
    applicationSlugs: ['industrial-fast-doors', 'cold-chain', 'cleanrooms'],
    parameters: p(
      ['Material', 'TPU/PVC'],
      ['Color', 'Black (custom)'],
      ['Length', 'Customizable'],
      ['Opening Speed', 'Fast open/close design'],
      ['Durability', '3000+ cycles'],
      ['Process', 'HF welding, sewing'],
      ['Application', 'Industrial fast doors, cold chain doors, clean room doors'],
    ),
    features: FEATURES,
    variants: [],
    note: 'No waterproof or airtight rating is published for this product.',
  },
  {
    id: '8',
    slug: 'circular-airtight-zipper',
    name: 'Circular Airtight Zipper',
    shortName: 'Circular',
    categorySlug: 'special-structure-sealing',
    specs: {
      size: '#10',
      chainWidth: '10 mm',
      tapeWidth: '70 mm',
      endTab: '20 mm',
      circumference: 'Fully customizable',
      material: 'TPU',
      slider: 'Metal / Plastic',
      waterproofRating: 'IPX8',
      sealStrength: '60 kPa',
      tensileStrength: '1100 N/5 cm',
      heatResistance: '-30°C ~ 70°C',
      durability: '3000+ cycles',
    },
    tags: ['#10', 'TPU', 'IPX8'],
    summary:
      'Closed-loop zipper delivering 360° sealing around an opening, IPX8 rated and 60 kPa tested.',
    description:
      'Circular fully enclosed airtight zipper for 360-degree seamless sealing in military equipment, waterproof equipment, sealed bags and luggage, and protective suits that need a closed-loop sealing structure.',
    applications: [
      'Military equipment',
      'Waterproof equipment',
      'Sealed bags and luggage',
      'Protective suits',
    ],
    applicationSlugs: [
      'military-equipment',
      'waterproof-gear',
      'sealed-bags-luggage',
      'protective-suits',
    ],
    parameters: p(
      ['Chain Width', '10 mm'],
      ['Circumference', 'Fully customizable'],
      ['Tape Width', '70 mm'],
      ['End Tab', '20 mm'],
      ['Seal Strength', '60 kPa'],
      ['Tensile Strength', '1100 N/5 cm'],
      ['Heat Resistance', '-30°C ~ 70°C'],
      ['Material', 'TPU'],
      ['Slider', 'Metal/Plastic'],
      ['Process', 'HF welding, sewing/tape, bonding'],
      ['Weather Resistance', 'Good'],
      ['Oil Resistance', 'Good'],
      ['Durability', '3000+ cycles'],
      [
        'Application',
        'Military equipment, waterproof equipment, sealed bags and luggage, protective suits',
      ],
    ),
    features: FEATURES,
    variants: [],
  },
  {
    id: '9',
    slug: 'drysuit-envelope-zipper',
    name: 'Drysuit Envelope Zipper',
    shortName: 'Drysuit Envelope',
    categorySlug: 'special-structure-sealing',
    specs: {
      size: '#5 / #8',
      material: 'Silicone Rubber',
      waterproofRating: 'IPX8',
      length: 'Customizable',
    },
    tags: ['#5/#8', 'Silicone', 'IPX8'],
    summary:
      'Silicone rubber drysuit envelope rated IPX8, built for deep-sea pressure and salt water.',
    description:
      'Professional drysuit envelope zipper made of silicone rubber for reliable sealing under extreme water pressure. For drysuits, deep-sea suits, and rescue gear.',
    applications: ['Drysuits', 'Deep-sea work suits', 'Underwater rescue gear'],
    applicationSlugs: ['drysuits-underwater'],
    parameters: p(
      ['Size', '#5 / #8'],
      ['Material', 'Silicone Rubber'],
      ['Waterproof Rating', 'IPX8'],
      ['Color', 'Black'],
      ['Length', 'Customizable'],
      ['Saltwater Resistance', 'Excellent'],
      ['Process', 'HF welding, bonding'],
      ['Environment', 'Deep-sea high pressure'],
      ['Application', 'Drysuits, deep-sea suits, underwater rescue gear'],
    ),
    features: [],
    variants: [],
    note: 'The manufacturer publishes neck seal and sleeve seal accessories for this product.',
  },
];

const VARIANT_NAMES: Record<string, string[]> = {
  "product-1": [
    "#10 23CM Double Closed",
    "#10 70mm Double Slider Inner/Outer Airtight Zipper",
    "#10 70mm Wide 23CM Airtight Zipper",
    "#10 70mm Wide Single Slider Double Puller",
    "#10 70mm Orange T Pull",
    "#10 70mm Orange Double Closed",
    "#10 70mm Orange Double Closed 76CM",
    "#10 70mm Orange Fabric Pull Tab",
    "#10 70mm Orange Fabric Pull Tab Long",
    "#10 70mm Orange Cord T",
    "#10 70mm Orange Cord T Long",
    "#10 70mm Orange Cord End",
    "#10 70mm Orange Cord End 76CM",
    "#10 70mm Front/Back Double Slider",
    "#10 70mm Front Double Slider",
    "#10 70mm Black T Pull",
    "#10 70mm Black Fabric Pull Tab",
    "#10 70mm Black Cord T",
    "#10 70mm Black Cord End",
    "#10 One Front One Back Double Slider",
    "#10 Top Stop Open Bottom Stop Open",
    "#10 Top Open Bottom Open Plastic Slider",
    "#10 Single Slider Double Puller",
    "#10 Orange Double Closed",
    "#10 Orange Double Closed 76CM",
    "#10 Orange Fabric Pull Tab",
    "#10 Orange Fabric Pull Tab Long",
    "#10 Orange Cord T",
    "#10 Orange Cord T Long",
    "#10 Orange Cord End",
    "#10 Orange Cord End 76CM",
    "#10 Front Double Slider",
    "#10 Airtight Zipper Cord T",
    "#10 Airtight Zipper Cord T Long",
    "#10 Airtight Zipper Cord End",
    "#10 Airtight Zipper Cord End 76CM",
    "#10 Blue Top Open Bottom Closed",
    "#10 Blue Top Closed Bottom Open",
    "#10 Blue Double Closed",
    "#10 Blue Double Closed 76CM",
    "#10 Blue Fabric Pull Tab",
    "#10 Blue Fabric Pull Tab Long",
    "#10 Blue Cord T",
    "#10 Blue Cord T Long",
    "#10 Blue Cord End",
    "#10 Blue Cord End 76CM",
    "#10 Black Double Closed 76CM",
    "#10 Black Fabric Pull Tab",
    "#10 Black Fabric Pull Tab Long",
  ],
  "product-2": [
    "#5 23CM Double Closed",
    "#5 23CM Double Closed Plastic Slider",
    "#5 Front/Back Single Slider",
    "#5 Front/Back Double Slider",
    "#5 Front Double Slider",
  ],
  "product-7": [
    "High-Speed Door TPU Zipper",
    "High-Speed Door TPU Zipper Long",
    "High-Speed Door UPE Track",
    "High-Speed Door Resetter",
    "High-Speed Door Zipper Assembly",
    "High-Speed Door Woven Zipper",
  ],
};

// ---- Categories -------------------------------------------------------------

export const categories: Category[] = [
  {
    slug: 'resin-airtight-zippers',
    name: 'Resin Airtight Zippers',
    shortName: 'Resin',
    tagline: 'IPX8 resin airtight zippers tested to 60 kPa',
    description:
      'High-strength resin teeth with a TPU sealing layer. The #10 build reaches 1,100 N/5 cm tensile strength and 60 kPa sealing pressure; the #5 build covers lighter assemblies. Both are rated IPX8 and rated for 3,000+ open/close cycles.',
    productIds: ['1', '2'],
    seoKeyword: 'resin airtight zipper',
  },
  {
    slug: 'functional-airtight-zippers',
    name: 'Functional Airtight Zippers',
    shortName: 'Functional',
    tagline: 'Self-healing and lightweight PEVA airtight zippers',
    description:
      'Zippers engineered around a specific behaviour rather than a size class. The self-healing build recovers automatically after derailing; the PEVA build brings IPX7 sealing to cost-sensitive everyday waterproof products.',
    productIds: ['3', '4'],
    // Category-level term, not the child's. The earlier value was the exact
    // keyword of /products/functional-airtight-zippers/self-healing-airtight-zipper,
    // so parent and child were competing for one query.
    seoKeyword: 'functional airtight zipper',
  },
  {
    slug: 'nylon-woven-waterproof-zippers',
    name: 'Nylon Woven Waterproof Zippers',
    shortName: 'Nylon Woven',
    tagline: 'Flexible TPU-coated nylon woven zippers, IPX6',
    description:
      'A TPU coating over polyester tape with nylon teeth — flexible, lightweight and IPX6 rated. Published tolerances and pull-strength limits are available for both the #5 and #8 builds.',
    productIds: ['5', '6'],
    seoKeyword: 'nylon waterproof zipper',
  },
  {
    slug: 'high-speed-roller-door-zippers',
    name: 'High-Speed Roller Door Zippers',
    shortName: 'Roller Door',
    tagline: 'Sealing and load-bearing element of a zipper-type high-speed door',
    description:
      'The core sealing and load-bearing component of a zipper-type high-speed door, built for constant cycling in cleanrooms, cold chain and industrial partitions.',
    productIds: ['7'],
    seoKeyword: 'high speed door zipper',
  },
  {
    slug: 'special-structure-sealing',
    name: 'Special Structure Sealing Products',
    shortName: 'Special Structure',
    tagline: 'Circular and drysuit sealing for closed-loop openings',
    description:
      'Where a straight zipper will not do: a circular airtight zipper delivering 360 degree sealing, and a silicone rubber drysuit envelope rated IPX8 for deep-sea pressure and salt water.',
    productIds: ['8', '9'],
    // Category-level term. The earlier value was the exact keyword of the child
    // page /products/special-structure-sealing/circular-airtight-zipper.
    seoKeyword: 'closed-loop sealing zipper',
  },
];

// ---- Lookups ----------------------------------------------------------------

export const getCategory = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);

export const getProduct = (slug: string): Product | undefined =>
  products.find((x) => x.slug === slug);

export const getProductById = (id: string): Product | undefined =>
  products.find((x) => x.id === id);

export const productsInCategory = (slug: string): Product[] =>
  products.filter((x) => x.categorySlug === slug);

/**
 * Canonical URL of a product. Products are nested under their category because
 * the category list itself lives at `/products`, so a flat `/products/{slug}`
 * would collide with the category route. Every link to a product — cards,
 * structured data, sitemap — must go through this helper.
 */
export const productPath = (product: Product): string =>
  `/products/${product.categorySlug}/${product.slug}`;

/** Spec keys present on any product — drives the comparison table columns. */
export const COMPARISON_SPECS: { key: keyof Product['specs']; label: string }[] = [
  { key: 'size', label: 'Size' },
  { key: 'chainWidth', label: 'Chain width' },
  { key: 'tapeWidth', label: 'Tape width' },
  { key: 'material', label: 'Material' },
  { key: 'waterproofRating', label: 'Waterproof rating' },
  { key: 'sealStrength', label: 'Seal strength' },
  { key: 'tensileStrength', label: 'Tensile strength' },
  { key: 'heatResistance', label: 'Heat resistance' },
  { key: 'durability', label: 'Durability' },
];

// ---- Variants ---------------------------------------------------------------
// Variant counts and ordering come from the library's own image manifest, so the
// two can never drift apart.

for (const product of products) {
  const stored = VARIANT_NAMES[product.id] ?? [];
  const manifestVariants = imagesFor(product.id, 'variant');
  if (!manifestVariants.length) continue;

  const byIndex = new Map<number, { name: string; count: number }>();
  for (const img of manifestVariants) {
    const idx = Number((img.src.match(/(\d+)-[a-z0-9-]+-\d+\.webp$/) || [])[1] ?? 0);
    const entry = byIndex.get(idx) ?? { name: stored[idx] ?? img.alt, count: 0 };
    entry.count += 1;
    byIndex.set(idx, entry);
  }

  product.variants = [...byIndex.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([index, { name, count }]) => ({ index, name, imageCount: count }));
}

export const totalVariants = products.reduce((n, x) => n + x.variants.length, 0);

export const totalImages = Object.values(
  imageManifest as Record<string, Record<string, ImageAsset[]>>,
).reduce((n, m) => n + Object.values(m).reduce((s, arr) => s + arr.length, 0), 0);
