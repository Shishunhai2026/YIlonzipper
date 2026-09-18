/**
 * FAQ — the manufacturer's own 24 published questions and answers, translated
 * into English. No question or answer has been added, removed or embellished.
 * Where an answer quotes a test value (60 kPa, 3,000+ cycles, -30°C to 70°C) it
 * is the manufacturer's published figure and is reproduced exactly.
 */

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  /** Grouping used on the FAQ page and to build FAQPage schema per section. */
  group: 'Product' | 'Selection' | 'Technical' | 'Quality' | 'Ordering' | 'Company';
  /** Products this answer relates to, for internal linking. */
  productIds?: string[];
};

export const faqs: FaqItem[] = [
  {
    id: 'what-is-airtight-waterproof-zipper',
    question: 'What is an airtight waterproof zipper, and what sealing problems does YILON solve?',
    answer:
      'An airtight waterproof zipper stops water, air and moisture entering or escaping through an opening. It suits products that need an openable sealed port: military equipment, waterproof equipment, sealed bags and luggage, protective suits, diving gear, inflatable products and industrial high-speed doors. YILON can customise length from 5 cm to 100 m, plus size, tape width, colour, slider, opening style, material and testing requirements.',
    group: 'Product',
  },
  {
    id: 'airtight-vs-watertight-vs-waterproof',
    question: 'What is the difference between an airtight, a watertight and an ordinary waterproof zipper?',
    answer:
      'An ordinary waterproof zipper is mainly for rain and splash resistance. A watertight zipper reduces water ingress. An airtight zipper additionally has to control air leakage and carry a pressure seal. Real selection depends on immersion, flexing, pressure, how often it is opened, temperature and the working environment.',
    group: 'Selection',
  },
  {
    id: 'which-size-5-8-10',
    question: 'How do I choose between #5, #8 and #10 airtight waterproof zippers?',
    answer:
      '#5 suits lightweight and flexible products, #8 suits medium-to-high strength waterproof equipment, and #10 suits heavy-duty, pressure-resistant and industrial sealing projects. The plastic, nylon woven, self-healing and circular ranges address military equipment, waterproof equipment, sealed bags and luggage, and protective suits. When selecting, supply the use case, opening length, tape width, host material, water or air pressure, opening frequency and target waterproof rating.',
    group: 'Selection',
    productIds: ['1', '2', '5', '6'],
  },
  {
    id: 'ipx6-ipx7-ipx8',
    question: 'What do the IPX6, IPX7 and IPX8 waterproof ratings mean?',
    answer:
      'IPX6 means protection against powerful water jets, IPX7 means protection against temporary immersion, and IPX8 means continuous immersion under agreed conditions. When selecting, define the test depth, pressure, duration, mounting method, end structure and whether the zipper must be opened and closed repeatedly.',
    group: 'Technical',
  },
  {
    id: 'material-selection',
    question: 'How do I choose between TPU, PEVA, silicone rubber and nylon woven materials?',
    answer:
      'TPU suits most airtight waterproof projects. PEVA suits lightweight and economy waterproof products. Silicone rubber suits wide temperature ranges and high-end sealing. Nylon woven with TPU suits garments and flexible fabrics. Plastic teeth with a sealing layer suit openings that need higher strength.',
    group: 'Selection',
    productIds: ['1', '2', '4', '5', '9'],
  },
  {
    id: 'industries-and-products',
    question: 'Which industries and products can YILON airtight waterproof zippers be used in?',
    answer:
      'YILON airtight waterproof zippers can be used in military equipment, waterproof equipment, sealed bags and luggage, protective suits, diving gear, industrial high-speed doors, cleanroom doors, cold chain door curtains, chemical protective suits and medical isolation equipment.',
    group: 'Product',
  },
  {
    id: 'is-it-suitable',
    question: 'How do I judge whether an airtight zipper suits my product?',
    answer:
      'To judge whether an airtight zipper suits a product you need to confirm the sealing objective, mounting method, material compatibility, force direction, bend radius, opening frequency, end structure, maintenance environment and the test results of the finished assembly.',
    group: 'Selection',
  },
  {
    id: 'installation-methods',
    question: 'What installation methods can be used for airtight waterproof zippers?',
    answer:
      'Common installation methods for airtight waterproof zippers include high-frequency welding, heat pressing, sewing followed by seam taping, adhesive bonding and combined processes. The choice depends on the host material, sealing grade, force direction, appearance requirements and production process.',
    group: 'Technical',
  },
  {
    id: 'product-range',
    question: 'What product ranges and sub-models does YILON currently offer?',
    answer:
      'YILON currently covers 9 main product ranges: #10 plastic airtight zipper, #5 plastic airtight zipper, self-healing airtight zipper, PEVA airtight zipper, #5 nylon woven waterproof zipper, #8 nylon woven waterproof zipper, high-speed roller door zipper, circular airtight zipper and drysuit envelope. The #10 plastic, #5 plastic, self-healing, high-speed roller door and circular ranges are published with 3,000+ cycle durability.',
    group: 'Product',
    productIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
  },
  {
    id: 'self-healing',
    question: 'What is a self-healing airtight zipper?',
    answer:
      'A self-healing airtight zipper keeps a high-sealing airtight structure while adding automatic recovery: if the chain derails, it resets itself and can carry on being used. It suits inflatable products, rescue equipment and other applications where reliability matters most.',
    group: 'Product',
    productIds: ['3'],
  },
  {
    id: 'circular-zipper-uses',
    question: 'Which products use a circular airtight zipper?',
    answer:
      'A circular airtight zipper achieves 360-degree all-round sealing through a circular closure. It is used in closed-loop sealing structures for military equipment, waterproof equipment, sealed bags and luggage and protective suits, as well as tent and cover openings, medical isolation chambers and flexible storage containers.',
    group: 'Product',
    productIds: ['8'],
  },
  {
    id: 'high-speed-door-zipper',
    question: 'What is a high-speed roller door zipper?',
    answer:
      'A high-speed roller door zipper is the core sealing and load-bearing component of a zipper-type high-speed door. It supports frequent, rapid open/close cycles and is used in cleanrooms, cold chain logistics, industrial manufacturing partitions and commercial public areas.',
    group: 'Product',
    productIds: ['7'],
  },
  {
    id: 'customisation-parameters',
    question: 'What parameters do I need to provide to customise an airtight waterproof zipper?',
    answer:
      'To customise an airtight waterproof zipper you need to provide the use case, length range (5 cm to 100 m), effective opening length, size or tape width, colour, opening style, slider count, host material, waterproof rating, oil resistance requirements, sample quantity, trial production quantity and mass production quantity.',
    group: 'Ordering',
  },
  {
    id: 'sample-and-quality-confirmation',
    question: 'How does YILON handle sample testing and quality confirmation?',
    answer:
      'YILON sample and quality confirmation should cover model, colour, length, opening style, slider, end structure, dimensions, tolerances, 3,000+ open/close cycles, airtight/watertight testing, assembly testing with the customer’s own material, packaging, batch identification, lead time, sampling method and acceptance criteria.',
    group: 'Quality',
  },
  {
    id: 'sample-validation-before-mass-production',
    question: 'How should I validate samples before bulk purchasing?',
    answer:
      'Before bulk purchasing, confirm drawings and samples first, then carry out installation testing with the real material, open/close cycle testing, immersion or spray testing, air pressure testing, bending testing and visual and dimensional confirmation.',
    group: 'Quality',
  },
  {
    id: 'typical-tests',
    question: 'What tests are normally carried out on airtight waterproof zippers?',
    answer:
      'Common tests include waterproof rating testing (IPX6/IPX7/IPX8, referring to the IEC 60529 standard), sealing pressure and pressure-holding testing, open/close cycle life testing, salt spray testing and temperature resistance testing. The specific test items and standards are carried out according to project requirements and as agreed between both parties, subject to the test report.',
    group: 'Quality',
  },
  {
    id: 'sealing-pressure',
    question: 'How much sealing pressure can an airtight zipper withstand?',
    answer:
      'YILON airtight zippers reference a 60 kPa sealing pressure test. The pressure actually withstood depends on the size (#5/#8/#10), material, installation method and end structure. The specific figure is subject to your project’s test conditions.',
    group: 'Technical',
    productIds: ['1', '8'],
  },
  {
    id: 'temperature-range',
    question: 'What is the temperature range of an airtight waterproof zipper?',
    answer:
      'TPU material has a reference temperature range of approximately -30°C to 70°C. PEVA and silicone rubber have different temperature ranges. The specific figure is subject to the material chosen and your project testing.',
    group: 'Technical',
  },
  {
    id: 'lifespan-and-maintenance',
    question: 'How long does an airtight waterproof zipper last, and how should it be maintained?',
    answer:
      'The lifespan of an airtight waterproof zipper depends on the environment, opening frequency, installation and maintenance. It should be cleaned and dried after contact with seawater, sand or dust, lubricated with a compatible method, protected from hard folding, forced pulling, trapped fabric and opening while sandy, and the slider, ends, sealing film and seams should be checked regularly.',
    group: 'Technical',
  },
  {
    id: 'about-yilon',
    question: 'What kind of company is YILON, and what certifications does it hold?',
    answer:
      'Dongtai SZIP Science&Technology CO.,Limited was founded in 2014 in Dongtai City, Jiangsu Province. It is a National High-Tech Enterprise focused on the R&D, production and sales of airtight waterproof zippers, with its own R&D team and multiple technical patents. It serves more than 300 enterprise clients worldwide and exports to more than 30 countries and regions. Certification documents are available on request.',
    group: 'Company',
  },
  {
    id: 'export-markets',
    question: 'Which markets does YILON mainly export to?',
    answer:
      'YILON products are exported to more than 30 countries and regions, including North America, Europe, Southeast Asia and the Middle East. The company has long-term, stable partnerships with more than 300 enterprise clients worldwide and takes part in international exhibitions.',
    group: 'Company',
  },
  {
    id: 'lead-times',
    question: 'How long do sampling and mass production take?',
    answer:
      'Typical reference: sampling is about 7–15 days and mass production is about 15–30 days, depending on specification, material and quantity, subject to confirmation by the manufacturer. It is advisable to confirm both the sampling and production lead times at the time of enquiry.',
    group: 'Ordering',
  },
  {
    id: 'moq',
    question: 'What is the minimum order quantity (MOQ)?',
    answer:
      'The minimum order quantity depends on the specification and material; there is no single figure. Provide your estimated quantity with your enquiry and YILON will confirm it against your specific project.',
    group: 'Ordering',
  },
  {
    id: 'where-to-find-guides',
    question: 'Where can I find more detailed selection and technical information?',
    answer:
      'YILON publishes a technical guides section covering the selection guide, the IPX rating chart, material comparison, manufacturing process, drysuit zippers, inflatable gear sealing, a manufacturer comparison and a procurement checklist. You can also contact YILON directly for samples and selection advice.',
    group: 'Company',
  },
];

export const FAQ_GROUPS: FaqItem['group'][] = [
  'Product',
  'Selection',
  'Technical',
  'Quality',
  'Ordering',
  'Company',
];

export const faqsByGroup = (group: FaqItem['group']): FaqItem[] =>
  faqs.filter((f) => f.group === group);
