/**
 * Application pages.
 *
 * Every application below is one the manufacturer publishes against its own
 * products (product parameter "Application" rows and the published FAQ).
 * No new end-use markets have been invented. `requirements` restates sealing
 * criteria the manufacturer already publishes (IPX ratings, 60 kPa test
 * pressure, cycle counts, salt-water resistance, temperature range).
 */
import type { ApplicationSlug } from './products';

export type Application = {
  slug: ApplicationSlug;
  name: string;
  headline: string;
  intro: string;
  /** Selection guidance the manufacturer publishes for this kind of use. */
  requirements: string[];
  productIds: string[];
  seoKeyword: string;
};

export const applications: Application[] = [
  {
    slug: 'military-equipment',
    name: 'Military & Defence Equipment',
    headline: 'Airtight sealing for military and defence equipment',
    intro:
      'Military equipment is the manufacturer’s leading published application for its airtight range. These assemblies are opened and closed repeatedly and have to hold their seal under pressure, which is why the plastic and circular builds are rated IPX8 and tested to 60 kPa.',
    requirements: [
      'Repeated open/close — the published durability figure is 3,000+ cycles',
      'Pressure sealing — reference test at 60 kPa on plastic and circular builds',
      'Continuous immersion tolerance — IPX8 on the plastic, self-healing and circular products',
      'Sealing pressure confirmed against your own project test conditions',
    ],
    productIds: ['1', '2', '3', '5', '6', '8'],
    seoKeyword: 'military airtight zipper',
  },
  {
    slug: 'waterproof-gear',
    name: 'Waterproof Equipment',
    headline: 'Airtight and watertight zippers for waterproof equipment',
    intro:
      'The manufacturer publishes waterproof equipment across both its airtight and watertight ranges. Choosing between them comes down to whether the assembly has to resist air and pressure loss, or only water ingress.',
    requirements: [
      'Watertight only — IPX6 nylon woven builds (#5 and #8)',
      'Airtight and pressure-sealed — IPX8 plastic and circular builds',
      'Flexible, lightweight substrates — nylon woven with TPU coating',
      'HF welding, sewing/tape or bonding, depending on the host material',
    ],
    productIds: ['1', '2', '5', '6', '8'],
    seoKeyword: 'waterproof equipment zipper',
  },
  {
    slug: 'sealed-bags-luggage',
    name: 'Sealed Bags & Luggage',
    headline: 'Airtight zippers for sealed bags and luggage',
    intro:
      'Sealed bags and luggage appear as a published application for most of the range, from the heavy #10 plastic build down to the lightweight PEVA zipper used on everyday dry bags and backpacks.',
    requirements: [
      'Airtight sealing for dry bags and sealed luggage — IPX8 plastic build',
      'Cost-sensitive everyday dry bags — PEVA, IPX7',
      'Expanded PVC/TPU panels — HF welding is the published process',
      'Length produced to order, fully customizable',
    ],
    productIds: ['1', '2', '3', '4', '5', '6', '8'],
    seoKeyword: 'dry bag zipper',
  },
  {
    slug: 'protective-suits',
    name: 'Protective Suits',
    headline: 'Airtight zippers for protective suits and coveralls',
    intro:
      'Protective suits are a published application across the airtight range, where the opening has to stay sealed while the wearer moves and flexes.',
    requirements: [
      'Flexible fit without losing the seal — nylon woven TPU builds',
      'Higher sealing pressure — plastic or circular IPX8 builds',
      'Oil resistance — published as “Good” on the plastic and circular products',
      'Sewn-then-taped construction where the host fabric requires it',
    ],
    productIds: ['1', '2', '3', '5', '6', '8'],
    seoKeyword: 'protective suit zipper',
  },
  {
    slug: 'rainwear-dry-bags',
    name: 'Rainwear & Everyday Dry Bags',
    headline: 'Lightweight airtight zippers for rainwear and everyday dry bags',
    intro:
      'The PEVA airtight zipper is the manufacturer’s cost-optimised, lightweight option for everyday waterproofing: rainwear, dry bags and general outdoor gear at IPX7 rather than full IPX8 immersion.',
    requirements: [
      'IPX7 — temporary immersion rather than continuous',
      'Lightweight and eco-friendly PEVA material',
      'HF welding or sewing as the published assembly processes',
      'Colour customization available (standard is black)',
    ],
    productIds: ['4'],
    seoKeyword: 'raincoat waterproof zipper',
  },
  {
    slug: 'industrial-fast-doors',
    name: 'Industrial High-Speed Doors',
    headline: 'Zippers for zipper-type industrial high-speed doors',
    intro:
      'In a zipper-type high-speed door the zipper is both the seal and the load-bearing element, so it has to survive constant cycling without losing alignment.',
    requirements: [
      'Fast open/close design as published',
      '3,000+ cycles durability figure',
      'TPU/PVC construction',
      'HF welding or sewing into the door curtain',
    ],
    productIds: ['7'],
    // Distinct from /products/high-speed-roller-door-zippers, which owns the
    // commercial product query "high speed door zipper". This page targets the
    // application intent — how the closure behaves on a fast door — so the two
    // stop competing for one term.
    seoKeyword: 'high speed door sealing',
  },
  {
    slug: 'cold-chain',
    name: 'Cold Chain & Refrigeration',
    headline: 'Zippers for cold chain and refrigerated door systems',
    intro:
      'Cold storage and cold chain distribution doors are a published application for the high-speed roller door zipper, where the seal has to keep working across repeated fast cycles.',
    requirements: [
      'Rapid cycling without loss of alignment',
      'Durability rated at 3,000+ cycles',
      'Installed by HF welding or sewing',
      'No waterproof or airtight rating is published for this product',
    ],
    productIds: ['7'],
    seoKeyword: 'cold storage door zipper',
  },
  {
    slug: 'cleanrooms',
    name: 'Cleanrooms & Controlled Environments',
    headline: 'Zippers for cleanroom and controlled-environment partitions',
    intro:
      'Cleanroom partitions and controlled environments are a published application for the roller door zipper, including pharmaceutical, food processing and electronics areas.',
    requirements: [
      'Frequent, fast cycling as part of normal operation',
      '3,000+ cycles durability figure',
      'TPU/PVC material compatible with wash-down environments',
      'HF welding or sewing for a flush, cleanable joint',
    ],
    productIds: ['7'],
    seoKeyword: 'cleanroom door zipper',
  },
  {
    slug: 'drysuits-underwater',
    name: 'Drysuits & Underwater Operations',
    headline: 'Drysuit and underwater sealing rated IPX8',
    intro:
      'The drysuit envelope zipper is built for continuous immersion rather than splashes. Silicone rubber holds its seal under deep-sea pressure and resists salt water, with neck and sleeve seals available alongside it.',
    requirements: [
      'IPX8 — continuous immersion under agreed conditions',
      'Saltwater resistance published as excellent',
      'Deep-sea high-pressure environment',
      'Neck seal and sleeve seal accessories available',
    ],
    productIds: ['9'],
    seoKeyword: 'drysuit zipper',
  },
  {
    slug: 'inflatable-boats',
    name: 'Inflatable Boats & SUPs',
    headline: 'Airtight zippers for inflatable boats, SUPs and inflatable structures',
    intro:
      'An inflatable closure is a pressure seal first: it is folded, packed and inflated repeatedly, and it has to hold air as well as keep water out. That places it in the airtight range rather than the watertight one, and it is the use the manufacturer publishes the self-healing build against.',
    requirements: [
      'Air retention — airtight builds are published with a 60 kPa sealing pressure test (#10 plastic and circular)',
      'Derail recovery — the self-healing build resets automatically, which matters on an inflatable pressurised under load',
      'Repeated folding and packing — the published durability figure is 3,000+ cycles',
      'Closed-loop openings — the circular airtight zipper seals through 360 degrees where the port is not a straight line',
      'HF welding assembly, which suits the TPU and PVC panels used on inflatables',
    ],
    productIds: ['3', '1', '8'],
    seoKeyword: 'waterproof zipper for inflatable boats',
  },
  {
    slug: 'rescue-equipment',
    name: 'Rescue Equipment',
    headline: 'Airtight and waterproof zippers for rescue equipment',
    intro:
      'The manufacturer publishes rescue use against two products: the self-healing airtight zipper, which recovers automatically if the chain derails, and the drysuit envelope zipper, published for underwater rescue gear and rated IPX8 for deep-sea pressure and salt water.',
    requirements: [
      'No single point of failure — the self-healing build resets automatically after derailing',
      'Continuous immersion — IPX8 on the self-healing and drysuit envelope builds',
      'Salt water and deep-sea pressure — the silicone rubber drysuit envelope is published for both',
      'Repeated deployment — the published durability figure is 3,000+ cycles',
      'Sealing pressure confirmed against your own project test conditions',
    ],
    productIds: ['3', '9'],
    seoKeyword: 'zipper for rescue equipment',
  },
];

export const getApplication = (slug: string): Application | undefined =>
  applications.find((a) => a.slug === slug);
