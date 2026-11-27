// Copy for the redesigned COA automation page (/coa-automation). Content
// follows the redesigned site's COA page; the page lays it out and animates
// it: src/pages/CoaLanding.jsx and src/components/coax.

const IMG = `${import.meta.env.BASE_URL}home/img/cert/`;
const SYS = `${import.meta.env.BASE_URL}home/img/systems/`;

export const C_HERO = {
  eyebrow: 'COA automation',
  title: 'AI agents for COA automation',
  titleEnd: 'for quality, compliance and supplier release.',
  text: 'Star automatically extracts test results, lot numbers and product information from incoming certificates of analysis, compares them against your specifications and quality rules, flags exceptions, and sends validated data to your ERP, QMS or other system.',
  primary: 'Try it on a sample',
  secondary: 'See how the AI decides',
  proof: ['Reads every supplier’s format', 'Checks your spec, not just theirs', 'Sends data to LIMS, ERP or QMS'],
  supplier: 'Halden Pharma Ingredients',
  site: 'API plant · Unit 3 · GMP certified',
  product: 'Paracetamol USP',
  lot: 'PC-24-0917',
  spec: 'USP 2025',
  // The certificate's rows: [label, value, confidence %, is a test].
  rows: [
    ['Product', 'Paracetamol USP', 99],
    ['Batch', 'PC-24-0917', 99],
    ['Assay (HPLC)', '99.8%', 99, true],
    ['Water (KF)', '0.21%', 98, true],
    ['4-Aminophenol', '0.002%', 97, true],
    ['Total impurities', '0.08%', 98, true],
    ['TAMC', '<10 cfu/g', 97, true],
    ['E. coli', 'Absent', 99, true],
  ],
  verdict: 'Conforms to your specification',
  verdictSub: 'USP 2025 · 6 of 6 tests within limits',
  released: 'Batch PC-24-0917 released for production',
};

// The two samples to try. Each test: [group, test, spec, result, status].
// The extraction demo: two sample certificates, read field by field.
// Each field is [label, value, confidence %, flag?]; a flag is
// [review | bad, what the reader should check].
export const C_TRY = {
  title: 'Try your COA here.',
  titleEnd: 'See every test result extracted and checked.',
  note: 'Demo with sample results. Units, test names and limits are normalized to your specification’s wording, so every result compares like for like.',
  samples: [
    {
      file: 'Paracetamol API COA.pdf',
      supplier: 'Halden Pharma Ingredients',
      site: 'API plant · Unit 3 · GMP certified',
      standard: 'USP 2025 · Ph. Eur.',
      tag: 'API · 2 pages',
      tone: '#493ee5',
      secs: '2.7 s',
      product: 'Paracetamol USP',
      lot: 'PC-24-0917',
      outcome: ['ok', 'Release', 'All 11 tests are within your specification. The retest date goes to QA to confirm against your shelf-life rule.'],
      groups: [
        ['Product details', [
          ['Product', 'Paracetamol (Acetaminophen)', 99],
          ['Grade / monograph', 'USP 2025 · Ph. Eur.', 98],
          ['Batch number', 'PC-24-0917', 99],
          ['Manufacture date', '14 Sep 2024', 99],
          ['Retest date', '12 Sep 2028', 96, ['review', 'Check against your shelf-life rule']],
          ['Batch quantity', '1,250 kg', 97],
        ]],
        ['Identification and assay', [
          ['Description', 'White crystalline powder', 97],
          ['Identification (IR)', 'Conforms', 99],
          ['Assay (HPLC)', '99.8%', 99],
          ['Melting range', '169.5 °C', 98],
        ]],
        ['Impurities', [
          ['Water (KF)', '0.21%', 98],
          ['Residue on ignition', '0.04%', 97],
          ['4-aminophenol', '12 ppm', 96],
          ['Total impurities', '0.08%', 97],
        ]],
        ['Microbial limits', [
          ['TAMC', '<10 CFU/g', 95],
          ['TYMC', '<10 CFU/g', 95],
          ['E. coli', 'Absent in 1 g', 98],
        ]],
      ],
    },
    {
      file: 'Propylene glycol COA.pdf',
      supplier: 'NovaChem Ingredients',
      site: 'Excipient plant · Site B',
      standard: 'PG-USP-004 Rev. 11',
      tag: 'Excipient · 1 page',
      tone: '#0e7a8a',
      secs: '2.1 s',
      product: 'Propylene Glycol USP',
      lot: 'PG-261004',
      outcome: ['warn', 'Hold for QA', 'Ethylene glycol is not reported, and the certificate cites Rev. 11 of a specification now at Rev. 12.'],
      groups: [
        ['Product details', [
          ['Product', 'Propylene Glycol USP', 99],
          ['Specification', 'PG-USP-004 Rev. 11', 98, ['bad', 'Your approved specification is Rev. 12']],
          ['Lot number', 'PG-261004', 99],
          ['Manufacturing site', 'Site B', 97, ['review', 'Not yet on your approved-site list']],
          ['Manufacture date', '04 Oct 2026', 98],
          ['Quantity', '80 drums × 215 kg', 94],
        ]],
        ['Identification and assay', [
          ['Appearance', 'Clear, colorless', 97],
          ['Identification (IR)', 'Conforms', 99],
          ['Assay (GC)', '99.8%', 99],
        ]],
        ['Impurities', [
          ['Water (KF)', '0.020%', 97],
          ['Diethylene glycol', '0.07%', 96, ['review', 'Close to your 0.10% limit']],
          ['Ethylene glycol', 'Not reported', 88, ['bad', 'Required by your specification']],
          ['Residue on ignition', '0.002%', 95],
        ]],
      ],
    },
  ],
};

export const C_PASSFAIL = {
  title: 'A COA can say “Pass”',
  titleEnd: 'and still fail your requirements.',
  lead: 'A supplier may certify that a material conforms to its own specification. That doesn’t answer your quality team’s real question: can this batch actually be released?',
  cert: {
    supplier: 'NovaChem Ingredients',
    fields: [
      ['Product', 'Propylene Glycol USP'],
      ['Specification', 'PG-USP-004 Rev. 11', 2],
      ['Manufacturing site', 'Site B', 3],
      ['Lot', 'PG-261004'],
    ],
    tests: [
      ['Appearance', 'Clear, colorless', 'Conforms'],
      ['Identification (IR)', 'Conforms', 'Conforms'],
      ['Assay (GC)', 'min 99.5%', '99.8%'],
      ['Water (KF)', 'max 0.10%', '0.020%'],
      ['Diethylene glycol', 'max 0.10%', '0.07%', 4],
      ['Residue on ignition', 'max 0.007%', '0.002%'],
      ['Ethylene glycol (EG)', '', 'not tested', 1],
    ],
  },
  findings: [
    ['bad', 'EG test', 'Required by Rev. 12, not on the COA'],
    ['bad', 'Specification', 'COA cites Rev. 11; current is Rev. 12'],
    ['bad', 'Manufacturing site', 'Site B is not approved for this material'],
    ['warn', 'DEG 0.07%', 'Within limit, above this supplier’s usual 0.02 to 0.03%'],
  ],
  close: 'Star turns each COA into a quality decision, not just extracted data.',
};

export const C_DECIDE = {
  title: 'Extraction is only the first step.',
  lead: 'Star decides whether the batch can be released.',
  story: [
    'A lot of Propylene Glycol USP has arrived and production needs it tomorrow. The supplier’s COA says it passes.',
    'But it was made at a site that isn’t approved for this material, it cites specification Rev. 11 instead of the current Rev. 12, and three required tests aren’t on it.',
  ],
  question: 'Can QA release the lot?',
  basis: ['FDA 21 CFR 211.84', 'FDA data integrity', 'USP-based specification', 'Supplier qualification', 'Audit trail'],
};

// The decision seen from inside, under the decision tree: the context
// Star gathers around the certificate, the checks its agents run, and the
// recommendation QA receives. Context: [icon, title, question, finding,
// tone, where Star pulls it from]; checks: [what, agent].
export const C_FLOW = {
  label: 'Inside the decision',
  title: 'Context in, a reasoned decision out.',
  accent: 'Every check, shown to QA.',
  lead: 'The same lot from the inside: what Star gathers around the certificate, the checks its agents run, and the recommendation QA receives, with every reason attached.',
  coa: { product: 'Propylene Glycol USP', lot: 'PG-261004', supplier: 'NovaChem Ingredients', status: 'Supplier status: pass' },
  context: [
    ['po', 'PO and receiving', 'What was ordered and received?', 'USP grade from approved Site A. Receiving matches the lot, but the COA lists Site B.', 'warn', 'ERP'],
    ['spec', 'Approved specification', 'What does QA require?', 'PG-USP-004 Rev. 12: assay, water, DEG, EG, acidity and specific gravity.', 'info', 'QMS'],
    ['rules', 'FDA and USP rules', 'What are the compliance checks?', '21 CFR 211.84: verify incoming components and supplier reliability before release.', 'info', 'Rules library'],
    ['history', 'Supplier and change history', 'What has happened before?', 'Site B not qualified. 3 documentation deviations in 12 months.', 'bad', 'Supplier records'],
    ['trend', 'Trend and production impact', 'Is it risky or urgent?', 'DEG at 0.07%, against a usual 0.02 to 0.03%. Needed for production tomorrow.', 'warn', 'LIMS and MES'],
  ],
  checks: [
    ['Extracts material, lot and test results', 'Document agent'],
    ['Matches PO, receiving and supplier details', 'Document agent'],
    ['Applies the current spec, Rev. 12', 'Spec agent'],
    ['Checks 21 CFR 211.84 and USP rules', 'Compliance agent'],
    ['Reviews supplier qualification', 'Supplier risk agent'],
    ['Compares DEG with the supplier’s trend', 'Trend agent'],
    ['Finds missing tests and outdated references', 'Spec agent'],
    ['Explains the decision for QA', 'Decision agent'],
  ],
  agents: ['Document agent', 'Spec agent', 'Compliance agent', 'Supplier risk agent', 'Trend agent', 'Decision agent'],
  verdict: 'Hold material',
  critical: [
    'EG result required by the current spec is not on the COA.',
    'Manufacturing Site B is not approved for this material.',
    'The COA cites obsolete specification Rev. 11.',
    'The supporting lab record belongs to a different lot.',
  ],
  risks: ['DEG is within spec but outside this supplier’s recent trend.', 'Supplier has repeat documentation deviations.'],
  steps: [
    'Keep the lot on QA hold.',
    'Request a corrected COA and valid EG evidence.',
    'Escalate site qualification and the DEG trend to QA.',
    'Re-check automatically when corrected documents arrive.',
  ],
  impact: ['High', 'Needed tomorrow, but the quality criteria aren’t met yet.'],
  basis: ['FDA 21 CFR 211.84', 'FDA data integrity', 'USP-based specification', 'Supplier qualification', 'Audit trail'],
};

export const C_REGS = {
  kicker: 'FDA, GMP and ISO quality requirements',
  title: 'Regulations require more than',
  titleEnd: 'collecting a certificate.',
  lead: 'Pick your industry to see the requirements behind incoming COAs and how Star helps you meet them.',
  industries: [
    {
      name: 'Pharmaceuticals',
      img: `${IMG}coa-pharma.webp`,
      line: 'A Certificate of Analysis isn’t enough. The results must meet your approved requirements.',
      supplier: 'Global Pharma Co.',
      product: 'Sterile API · Batch A2403017',
      tests: [
        ['Appearance', 'Clear, colorless solution', 'Conforms'],
        ['Assay (HPLC)', '98.0 to 102.0%', '99.4%'],
        ['Related substances', '≤ 0.5%', '0.2%'],
        ['pH', '6.0 to 7.5', '6.8'],
      ],
      regs: [
        { code: '21 CFR 211.84', title: 'Testing and approval or rejection of components, containers and closures', zone: 'supplier', req: 'Incoming lots must be appropriately sampled, tested or examined and released by Quality Control before use.', how: 'Automatically matches supplier COAs to the material, lot, purchase order and approved specification.', link: ['Verify FDA requirement: 21 CFR 211.84', 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211/subpart-E/section-211.84'] },
        { code: '21 CFR 211.160', title: 'Laboratory controls, general requirements', zone: 'tests', req: 'Laboratory controls must include scientifically sound specifications, standards, sampling plans and test procedures, and any deviation from them must be recorded and justified.', how: 'Checks every result on the COA against the limits, units and methods in your approved specification, and records each deviation for QA review.', link: ['Verify FDA requirement: 21 CFR 211.160', 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211/subpart-I/section-211.160'] },
        { code: '21 CFR 211.194', title: 'Complete and reliable laboratory evidence', zone: 'tests', req: 'Laboratory records must contain complete data from required testing, including sample identification, applicable methods, results and supporting information.', how: 'Extracts certificate test values, material identifiers and lot information into structured, searchable records, helping connect supplier-provided evidence with internal quality workflows.', link: ['Verify FDA requirement: 21 CFR 211.194', 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211/subpart-J/section-211.194'] },
        { code: '21 CFR Part 11', title: 'Electronic records and electronic signatures', zone: 'product', req: 'When required records are kept electronically, the system needs controls such as validation, secure time-stamped audit trails and controls over electronic signatures.', how: 'Records each extraction, check and reviewer decision in a time-stamped audit trail, supporting the controls your validated quality system relies on.', note: 'Part 11 compliance depends on how the system is validated, configured and used within your quality system.', link: ['Verify FDA requirement: 21 CFR Part 11', 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-11'] },
      ],
      href: '/industries/pharmaceutical-manufacturing',
    },
    {
      name: 'Food and beverage',
      img: `${IMG}coa-food.webp`,
      line: 'Food safety starts before an ingredient reaches the production line.',
      supplier: 'NutriSource Ingredients Co.',
      product: 'Whey protein isolate · Batch WP240501-01',
      tests: [
        ['Protein (dry basis)', '≥ 90.0%', '91.8%'],
        ['Moisture', '≤ 5.0%', '3.1%'],
        ['Ash', '≤ 2.0%', '1.2%'],
        ['Total plate count', '≤ 1,000 CFU/g', '320 CFU/g'],
      ],
      regs: [
        { code: '21 CFR 117.405', title: 'Supply-chain program', zone: 'supplier', req: 'Covered receiving facilities must establish and implement a risk-based supply-chain program for raw materials and ingredients where an identified hazard requires a supply-chain-applied control, subject to regulatory exceptions.', how: 'Reviews incoming COA information against ingredient-specific test requirements, identifies missing certificates and connects supplier documentation to material and lot information.', note: '21 CFR Part 11 does not generally apply to records required to be maintained under Part 117.', link: ['View 21 CFR 117.405', 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-117/subpart-G/section-117.405'] },
        { code: '21 CFR 117.410', title: 'Supplier verification activities', zone: 'tests', req: 'Applicable programs must address approved suppliers, appropriate supplier verification activities, frequency, execution and documentation.', how: 'Structures ingredient test data and can flag missing verification information or inconsistent results for follow-up, supporting documented supplier-record review.', note: '21 CFR Part 11 does not generally apply to records required to be maintained under Part 117.', link: ['View 21 CFR 117.410', 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-117/subpart-G/section-117.410'] },
        { code: '21 CFR 117.475', title: 'Records documenting the supply-chain program', zone: 'product', req: 'The supply-chain program must be documented in records, including approved suppliers, the verification activities chosen and their results, such as sampling and testing.', how: 'Keeps each supplier COA linked to its supplier, ingredient lot and verification result as a searchable record, ready for review.', note: '21 CFR Part 11 does not generally apply to records required to be maintained under Part 117.', link: ['View 21 CFR 117.475', 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-117/subpart-G/section-117.475'] },
      ],
    },
    {
      name: 'Medical devices',
      img: `${IMG}coa-device.webp`,
      line: 'Quality begins with the components that become your medical device.',
      supplier: 'Precision Medical Components',
      product: 'Titanium alloy hip stem · Batch B240715-01',
      tests: [
        ['Material grade (PMI)', 'Ti-6Al-4V (ASTM F136)', 'Conforms'],
        ['Tensile strength', '≥ 860 MPa', '912 MPa'],
        ['Hardness', '≤ 36 HRC', '34 HRC'],
        ['Surface cleanliness', '≤ 50 µg/cm²', '28 µg/cm²'],
      ],
      regs: [
        { code: 'FDA QMSR', title: '21 CFR Part 820', zone: 'supplier', req: 'Applicable finished medical-device manufacturers must maintain a quality management system under FDA’s QMSR, which incorporates ISO 13485:2016.', how: 'Supports the purchasing and incoming-verification parts of that system by comparing supplier certificate information against approved material requirements.', link: ['FDA QMSR official explanation', 'https://www.fda.gov/medical-devices/postmarket-requirements-devices/quality-management-system-regulation-qmsr'] },
        { code: 'ISO 13485 · 7.4.1–7.4.3', title: 'Purchasing process, purchasing information and verification of purchased product', zone: 'tests', req: 'Suppliers must be evaluated and selected against criteria, purchasing information must describe the product, and purchased product must be verified against it, with records kept.', how: 'Compares supplier certificate data with your purchasing specification and records the verification result against the supplier and lot.', link: ['ISO 13485 standard information', 'https://www.iso.org/standard/59752.html'] },
        { code: 'ISO 13485 · 7.5.8–7.5.9', title: 'Identification and traceability', zone: 'product', req: 'Applicable identification and traceability controls must be established and maintained.', how: 'Captures relevant supplier and lot identifiers from COAs and links them to purchasing or material records through configured integrations.', link: ['ISO 13485 standard information', 'https://www.iso.org/standard/59752.html'] },
      ],
    },
    {
      name: 'General manufacturing',
      img: `${IMG}coa-metal.webp`,
      line: 'A material certificate should prove quality, not simply accompany the shipment.',
      supplier: 'Precision Metals Ltd.',
      product: 'Stainless steel rod · Batch B240715-01',
      tests: [
        ['Material grade', '316L (UNS S31603)', '316L'],
        ['Diameter', '50.00 ± 0.10 mm', '49.98 mm'],
        ['Tensile strength', '≥ 520 MPa', '545 MPa'],
        ['Hardness', '≤ 95 HRB', '82 HRB'],
      ],
      regs: [
        { code: 'ISO 9001 · 8.4', title: 'Externally provided products and services', zone: 'supplier', req: 'Organizations establish suitable controls over external providers and determine verification activities for purchased materials and other externally supplied outputs.', how: 'Reads material certificates, validates grade and test results against approved specifications, and highlights supplier discrepancies.', note: 'ISO 9001 is a quality management standard, not an FDA regulation. It is usually voluntary unless required by contracts or other obligations.' },
        { code: 'ISO 9001 · 8.6', title: 'Release of products and services', zone: 'product', req: 'Planned arrangements must verify that requirements are met before release, and documented evidence of conformity and of who authorized the release must be retained.', how: 'Gives QA the evidence behind each release decision, with every check against the specification, and records who approved it.', note: 'ISO 9001 is a quality management standard, not an FDA regulation. It is usually voluntary unless required by contracts or other obligations.', link: ['ISO 9001 standard information', 'https://www.iso.org/standard/62085.html'] },
        { code: 'ISO 9001 · 8.7', title: 'Control of nonconforming outputs', zone: 'tests', req: 'Nonconforming outputs must be identified and controlled to prevent unintended use or delivery.', how: 'Flags out-of-spec results, wrong grades and missing certificate information that can feed a customer’s nonconformance workflow.' },
      ],
    },
    {
      name: 'Chemicals',
      img: `${IMG}coa-chem.webp`,
      line: 'COA automation for chemical manufacturing.',
      supplier: 'Meridian Chemicals',
      product: 'Isopropyl alcohol, technical grade · Batch IPA-2409-118',
      tests: [
        ['Purity (GC)', '≥ 99.5%', '99.8%'],
        ['Water (KF)', '≤ 0.10%', '0.04%'],
        ['Color (APHA)', '≤ 10', '5'],
        ['Acidity (as acetic acid)', '≤ 0.002%', '0.001%'],
      ],
      regs: [
        { code: 'Your specification', title: 'Supplier and production COAs', zone: 'tests', req: 'Process supplier and production COAs with unit normalization, specification checks and traceability.', how: 'Normalizes units and test names, checks every result against your specification and links each certificate to its batch.' },
      ],
    },
    {
      name: 'Cosmetics',
      img: `${IMG}coa-cosmetic.webp`,
      line: 'COA automation for cosmetics.',
      supplier: 'Lumen Cosmetic Ingredients',
      product: 'Hyaluronic acid serum base · Batch HA-2410-07',
      tests: [
        ['Appearance', 'Clear viscous gel', 'Conforms'],
        ['pH', '5.5 to 7.0', '6.2'],
        ['Viscosity', '3,000 to 6,000 cP', '4,350 cP'],
        ['Total aerobic count', '≤ 100 CFU/g', '<10 CFU/g'],
      ],
      regs: [
        { code: 'Your specification', title: 'Product, batch and lab data', zone: 'tests', req: 'Automate extraction and validation of product, batch and laboratory quality data.', how: 'Extracts product, batch and test data from every supplier’s layout and checks it against your approved limits.' },
      ],
    },
  ],
};

export const C_CONTROLS = {
  title: 'Compliance controls,',
  titleEnd: 'automated.',
  lead: 'Star helps automate the COA checks, documentation and audit trails behind FDA cGMP, GDP and your industry’s quality standards.',
  steps: ['Receive COA', 'Extract key data', 'Match approved specification', 'Flag exceptions', 'QA review and audit-ready record'],
  controls: [
    ['Incoming material verification', 'Compares supplier COAs with approved specifications before release.'],
    ['Specification control', 'Checks tests, limits, units and revision levels.'],
    ['Quality records', 'Keeps a searchable history of every review and decision.'],
    ['Exception routing', 'Sends missing tests, out-of-spec values and mismatches to QA.'],
  ],
  note: 'One unchecked certificate can lead to batch rejection, delays, rework, supplier disputes or recalls. Star supports compliance workflows. It does not by itself certify regulatory compliance.',
};

export const C_AGENTS = {
  title: 'Pre-built agents for',
  titleEnd: 'every step of release.',
  lead: 'Each one does a single job well, and they work together on every COA.',
  items: [
    { key: 'doc', title: 'Document agent', text: 'Collects COAs from email, supplier portals and uploads, and extracts the material, lot, tests, limits and results from any layout.', c: '#493ee5' },
    { key: 'spec', title: 'Specification agent', tag: 'Current revision', text: 'Matches every result to your approved specification and its latest revision, and normalizes units and test names before comparing.', c: '#0092b8' },
    { key: 'comp', title: 'Compliance agent', tag: 'FDA · cGMP · USP', text: 'Applies the checks your regulators expect, such as 21 CFR 211.84 for incoming components, and finds missing tests and outdated references.', c: '#0e9f6e' },
    { key: 'risk', title: 'Supplier risk agent', text: 'Checks the supplier’s qualification, approved sites and past deviations before a lot is accepted.', c: '#d97706' },
    { key: 'trend', title: 'Trend agent', text: 'Compares each result with the supplier’s history, so a value that’s in spec but drifting still gets noticed.', c: '#db2777' },
    { key: 'dec', title: 'Decision agent', tag: 'Audit trail', text: 'Recommends release, hold or QA review, explains why, and records the decision with a link to the source certificate.', c: '#2160d9' },
  ],
};

export const C_INTEG = {
  title: 'Make every COA part of',
  titleEnd: 'your quality data.',
  lead: 'Connect validated certificate data to the systems that manage batches, products and quality records.',
  stages: [
    ['Extract', 'Tests, limits, lots and units from any layout'],
    ['Understand', 'Test names and units normalized'],
    ['Validate', 'Against your approved specification'],
    ['Verify', 'Supplier, site and revision checked'],
    ['Integrate', 'Written to the system of record'],
    ['Trace', 'Every value linked to its certificate'],
  ],
  systems: [
    { name: 'SAP', logo: `${SYS}sap.svg` },
    { name: 'Oracle', logo: `${SYS}oracle.svg` },
    { name: 'Dynamics 365', logo: `${SYS}dynamics365.svg` },
    { name: 'MasterControl', logo: `${SYS}mastercontrol.svg` },
    { name: 'NetSuite', logo: `${SYS}netsuite.png` },
    { name: 'Snowflake', logo: `${SYS}snowflake.svg` },
  ],
  kinds: ['LIMS', 'MES', 'QMS', 'Your custom ERP'],
  // The hub: documents in on the left, Star AI in the middle, the systems
  // it feeds on the right, by kind. Logos are [name, file in SYS, words
  // shown beside a mark that has none]; a group's `tags` are kinds of
  // system shown as words.
  docs: [
    ['coa', 'COA', 'Certificate of analysis'],
    ['mtr', 'MTR', 'Mill test report'],
    ['inv', 'Invoice', 'AP and AR documents'],
  ],
  groups: [
    { name: 'ERP', text: 'Purchasing, inventory, finance', logos: [['SAP', 'sap.svg'], ['Oracle', 'oracle.svg'], ['NetSuite', 'netsuite.png'], ['Dynamics 365', 'dynamics365.svg'], ['Infor', 'infor.png'], ['INVEX', 'invex.png', 'INVEX']] },
    { name: 'CRM', text: 'Customers and accounts', logos: [['Salesforce', 'salesforce.svg'], ['HubSpot', 'hubspot.svg'], ['Zoho', 'zoho.svg']] },
    { name: 'Workflow', text: 'Route, notify, automate', logos: [['Workato', 'workato.png'], ['MuleSoft', 'mulesoft.svg'], ['Power Automate', 'powerautomate.svg', 'Power Automate'], ['Zapier', 'zapier.svg']] },
    { name: 'Quality and data', text: 'Compliance and analytics', tags: ['LIMS', 'QMS', 'MES'], logos: [['MasterControl', 'mastercontrol.svg'], ['Snowflake', 'snowflake.svg']] },
  ],
  flowNote: 'Structured data, specification checks, exception handling and a link back to the source certificate, for every COA.',
};

export const C_RESOURCES = {
  title: 'Practical guides for',
  titleEnd: 'certificate automation.',
  sub: 'Frameworks and best practices for quality and compliance teams.',
  items: [
    { kind: 'Buyer’s guide', title: 'MTR and COA automation buyer’s guide', text: 'What to look for, what to ask vendors and how to compare them.', cta: 'Download PDF', href: '/home/downloads/star-mtr-coa-buyers-guide.pdf', download: true, tone: 'violet', cover: 'book' },
    { kind: 'Whitepaper', title: 'The enterprise guide to intelligent document processing', text: 'From unstructured documents to trusted data in your ERP, QMS or LIMS.', cta: 'Download PDF', href: '/home/downloads/star-enterprise-guide-idp.pdf', download: true, tone: 'teal', cover: 'book2' },
    { kind: 'Guide', title: 'Why faster COA turnaround improves customer onboarding and retention', text: 'Speeds onboarding, reduces compliance friction and builds trust and audit readiness.', cta: 'Read the guide', href: '/resources/why-faster-coa-turnaround-improves-customer-onboarding-and-retention', tone: 'navy', cover: 'clock' },
    { kind: 'Guide', title: 'How automated QA workflows are redefining modern manufacturing', text: 'How automated QA workflows improve accuracy and strengthen compliance.', cta: 'Read the guide', href: '/resources/how-automated-qa-workflows-are-redefining-modern-manufacturing-and-compliance', tone: 'amber', cover: 'case' },
  ],
};

// The closing section and its sample form. Sending opens the visitor's
// email app addressed to the team; the file is attached there.
export const C_CONTACT = {
  title: 'What would Star extract from your COAs?',
  text: 'Send one certificate of analysis. We’ll walk you through the extracted data, the checks against your specification and the release decision the agent would recommend.',
  steps: [
    ['Send one document', 'A real one, in whatever format your supplier sends it.'],
    ['Star reads and checks it', 'The same extraction and validation it runs in production.'],
    ['We walk you through it', 'The data, the checks it ran and the action it would take.'],
  ],
  docs: ['MTR', 'COA', 'Invoice', 'RFQ'],
  mail: 'info@starsoftware.co',
  doctype: 'Certificate of analysis (COA)',
  doctypes: ['Mill test report (MTR)', 'Certificate of analysis (COA)', 'Invoice', 'RFQ or drawing', 'Other'],
};

export const C_SEND = {
  title: 'What would Star extract',
  titleEnd: 'from your COAs?',
  text: 'Send one certificate of analysis. We’ll walk you through the extracted data, the checks against your specification and the release decision the agent would recommend.',
  steps: ['Send one COA', 'We extract and check it', 'You get a walkthrough'],
  cta: 'Send a sample',
  alt: 'Prefer a live walkthrough? Request a demo',
  file: 'your-supplier-coa.pdf',
  fields: [
    ['Material', 'Propylene Glycol USP'],
    ['Lot', 'PG-261004'],
    ['Tests', '7 of 9 within limits'],
    ['Specification', 'Rev. 11 cited'],
  ],
  checks: ['14 passed', '3 need a look'],
  action: 'Hold for QA, request the EG test and a Rev. 12 COA',
};
