// MTR campaign page (/mtr-campaign): the MTR automation page of the
// redesigned site (star-software-site.vercel.app/mtr-automation), without
// its Try it, Resources, Industries and contact sections or its footer.
// The hero, the comparison, the two steps and the closing offer carry the
// campaign email's message ("Don’t just digitize MTRs. Make them
// intelligent."), in the page's own words; the rest is copy as it is on
// that page. The only links out are the closing offer's email button and
// the footer's email card; the address is text. Icons are 24 × 24 line drawings,
// in the data so each card keeps its own.
const STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };

// The company's details, as in the campaign email's footer.
const MAIL = 'info@starsoftware.co';
const mailto = (subject) => `mailto:${MAIL}?subject=${encodeURIComponent(subject)}`;

export const COMPANY = {
  name: 'Star Software',
  line: 'Document and QA automation',
  address: '35, Sector A, Govindpura Industrial Area, Bhopal, MP 462023, India',
  mail: MAIL,
  // The footer's email card opens a new email.
  mailHref: `mailto:${MAIL}`,
};

// The chapters of the sticky "On this page" bar, by section id.
export const CHAPTERS = [
  ['integrations', 'Integrations'],
  ['how-it-works', 'How it works'],
  ['decide', 'How it decides'],
  ['compliance', 'Compliance'],
  ['standards', 'Standards'],
  ['en10204', 'EN 10204'],
  ['agents', 'Agents'],
  ['faqs', 'FAQ'],
  ['send', 'Send your MTR'],
];

export const HERO = {
  title: ['Don’t just digitize MTRs.', 'Make them intelligent.'],
  text: 'A scanned MTR is still only a picture of a table. Star reads even complex mill test reports into clean, validated data your ERP can use, then acts on it, so your team spends less time reading certificates and more time acting on what they say.',
  // In-page only: the closing offer and the two steps.
  ctas: [
    { label: 'Send us your toughest MTR', href: '#send', primary: true },
    { label: 'See how it works', href: '#how-it-works' },
  ],
  proof: ['ERP-ready data, validated on arrival', 'Values checked against your spec and PO', 'NCRs, QMS updates and holds handled for you'],
  // The certificate the hero reads, row by row.
  scan: {
    label: 'A mill test certificate being read: grade, heat number, chemistry and mechanical values extracted with confidence scores, then checked against ASTM A516 Grade 70 limits',
    issuer: 'Northfield Steel Mill',
    issuerSub: 'Plate mill · Unit 2',
    docTitle: 'Mill test certificate',
    meta: ['PO 44-1180', 'Plate 1.25 × 96 × 240 in'],
    outTitle: 'Structured MTR data',
    rows: [
      ['Grade', 'ASTM A516 Gr. 70', 99],
      ['Heat no.', '24A8871', 99],
      ['Carbon', '0.21%', 99],
      ['Manganese', '1.05%', 98],
      ['Phosphorus', '0.010%', 97],
      ['Yield', '47.5 ksi', 99],
      ['Tensile', '79.0 ksi', 98],
      ['Elongation', '24%', 96],
    ],
    verdict: ['Within ASTM A516 Gr. 70 limits', 'Chemistry and mechanical, 6 of 6 checks'],
    release: 'Heat 24A8871 released to inventory',
  },
};

// Digitized only, beside intelligent MTRs.
export const COMPARISON = {
  heading: ['A digital MTR isn’t an intelligent one.', 'Most teams stop at the scan. Here’s what changes when they don’t.'],
  before: {
    label: 'Digitized only',
    title: 'Easier to store, just as manual',
    items: [
      'Scans and PDFs sitting in a shared folder',
      'Values still read and re-keyed by hand',
      'Gaps and mismatches caught late, or missed',
      'Nothing moves until someone steps in',
    ],
  },
  after: {
    label: 'Intelligent MTRs',
    title: 'Data that does the work',
    items: [
      'Structured, validated data, ready for your ERP',
      'Each value checked against your spec and PO',
      'Missing values and discrepancies flagged on arrival',
      'NCRs, QMS updates and holds raised automatically',
    ],
  },
};

// Understanding the certificate, then acting on it: [title, text] items.
export const STEPS = {
  heading: ['From reading the certificate to running the workflow.', 'Star understands each MTR first, then acts on what it finds.'],
  steps: [
    {
      label: 'Step 1 · Document intelligence',
      title: 'Understand every MTR',
      c: '#493ee5',
      items: [
        ['Capture every critical value', 'Heat numbers, chemistry, mechanical results and standards, from any mill’s layout.'],
        ['Validate chemistry and mechanicals', 'Each result compared with your grade and PO requirements.'],
        ['Catch gaps and mismatches', 'Blank fields, wrong heats and out-of-range values are flagged, not skipped.'],
        ['Keep records searchable and traceable', 'Find any heat in seconds, each value linked to its source certificate.'],
      ],
    },
    {
      label: 'Step 2 · Workflow automation',
      title: 'Act on what it finds',
      c: '#0092b8',
      items: [
        ['Automatic NCRs', 'Out-of-spec results open an NCR, already filled in with the evidence.'],
        ['QMS and ERP updates', 'Validated records and exceptions go straight into the systems you use.'],
        ['Supplier scorecards', 'Each certificate adds to a live view of how every supplier performs.'],
        ['Release control', 'Failed heats stay on hold until your quality team signs them off.'],
      ],
    },
  ],
  focus: ['Certificate and QA document automation is our whole focus.', 'It isn’t a feature we bolted on. It’s the work we do.'],
};

// The offer the email closes on: email the certificates.
export const SEND = {
  heading: ['Send us your toughest MTR.', 'See what Star finds in it.'],
  text: 'Email us two or three certificates from the suppliers that cause you the most trouble, in any format they come in.',
  actions: [
    { label: 'Email your MTRs', href: mailto('Our toughest MTRs'), icon: 'mail', primary: true },
  ],
  note: 'Every email is read by a person on our team.',
  returnsTitle: 'What you’ll get back',
  returns: ['Your certificates as structured data', 'Validation results for every value', 'Each missing value or discrepancy we find'],
  checklist: {
    text: 'Not ready to share documents? Ask for our ASTM A36 MTR validation checklist instead.',
    cta: { label: 'Ask for the checklist', href: mailto('Checklist') },
  },
};

export const DECISION = {
  heading: ['Extraction is only the first step.', 'Star decides what should happen to the material.'],
  story: [
    'A shipment of A516 Grade 70 plate has arrived and production needs it today. The MTR shows chemistry and mechanical properties within ASTM limits, but the customer PO asks for an impact test at −46 °C and heat-treatment evidence.',
    'The impact test isn’t on the certificate, the heat-treatment records are incomplete, and this supplier has had two similar issues in the last six months.',
  ],
  question: 'Should QA release it, hold it or escalate it?',
  incoming: {
    title: 'Incoming MTR',
    docTitle: 'Mill test report',
    text: 'A516 Gr. 70 plate, heat 24A8871. Chemistry and mechanicals within ASTM limits.',
  },
  // What the AI gathers beside the certificate, each in its own colour.
  sources: [
    {
      title: 'Purchase order',
      q: 'What did we order?',
      a: 'A516 Gr. 70, impact test at −46 °C, normalized, full traceability.',
      c: '#2160D9',
      icon: <path d="M6 3h8l4 4v14H6z M14 3v4h4 M9 12h6 M9 16h4" {...STROKE} />,
    },
    {
      title: 'Customer specification',
      q: 'What does the customer require?',
      a: 'Impact test at −46 °C and heat-treatment evidence.',
      c: '#635bff',
      icon: <path d="M5 4h14v16H5z M8.5 8.5h7 M8.5 12h7 M8.5 15.5h4" {...STROKE} />,
    },
    {
      title: 'ASTM standard',
      q: 'What are the base requirements?',
      a: 'A516 Gr. 70 chemistry and mechanical limits.',
      c: '#0e7a55',
      icon: <path d="M3 5.5c3-1.3 6-1.3 9 .6 3-1.9 6-1.9 9-.6V19c-3-1.3-6-1.3-9 .6-3-1.9-6-1.9-9-.6z M12 6.1v13.5" {...STROKE} />,
    },
    {
      title: 'Supplier history',
      q: 'How has this supplier performed?',
      a: '2 impact-test NCRs in the last 6 months for this grade.',
      c: '#d97706',
      icon: <path d="M5 20V12 M10 20V6 M15 20v-6 M20 20V9" {...STROKE} />,
    },
    {
      title: 'Production schedule',
      q: 'What does holding it cost?',
      a: 'Material is needed on the line today.',
      c: '#0092b8',
      icon: (
        <>
          <rect x="4" y="5" width="16" height="15" rx="2" {...STROKE} />
          <path d="M4 9.5h16 M8.5 3v4 M15.5 3v4" {...STROKE} />
        </>
      ),
    },
  ],
  checks: [
    'Extracts key data from the MTR',
    'Matches the PO and customer spec',
    'Checks ASTM requirements',
    'Reviews supplier quality history',
    'Weighs risk and production impact',
    'Applies your QA rules',
  ],
  // Findings are [severity, text]: x, warn or info.
  rec: {
    title: 'Hold material',
    groups: [
      {
        items: [
          ['x', 'Impact test required by the customer is not on the certificate.'],
          ['x', 'Heat-treatment evidence is incomplete.'],
          ['warn', 'Supplier has past impact-test failures for this grade.'],
          ['info', 'Material is needed today, so QA is asked to review now.'],
        ],
      },
    ],
    next: [
      'Request the missing impact test and heat-treatment records.',
      'Escalate to QA for a deviation approval if production can’t wait.',
      'Release automatically once acceptable documents arrive.',
    ],
  },
};

export const COMPLIANCE = {
  heading: 'How Star helps support material compliance and traceability',
  question: 'Every steel shipment comes with specifications. But does every MTR prove that the material meets them?',
  text: 'Star automatically extracts chemical composition, mechanical properties, heat numbers, material grades, and test results from MTRs and mill certificates. It helps verify certificate data against the applicable material specifications and customer requirements, flagging discrepancies before they become production delays, rejected shipments, or costly rework.',
};

// The certificate checks the compliance picture runs through, as
// [standard, what it checks, ok | warn].
export const COMPLIANCE_CHECKS = [
  ['ASTM A6/A6M', 'Grade, chemistry and marking', 'ok'],
  ['ASTM A370', 'Yield, tensile, elongation present', 'ok'],
  ['Customer PO', 'Impact test at −46 °C', 'warn'],
  ['ISO 9001 8.5.2', 'Heat traced to receipt', 'ok'],
  ['EN 10204', 'Type 3.1 supplied, 3.2 ordered', 'warn'],
];

// The businesses to pick from. Each opens one of the segments below (two
// share the mills one), and may start on a standard other than the first.
export const SECTORS = [
  {
    sector: 'Steel service centers',
    standards: 'ASTM A6/A6M, ASTM A370, ISO 9001, EN 10204',
    helps: 'Incoming certificate verification, grade checking, heat traceability',
    segment: 0,
  },
  {
    sector: 'Steel mills / manufacturers',
    standards: 'ASTM A6/A6M, A20/A20M, A480/A480M, applicable product specifications',
    helps: 'Chemical and mechanical results, test completeness, certification',
    segment: 1,
  },
  {
    sector: 'Structural fabricators',
    standards: 'AISC 207, AWS D1.1, ASTM A6/A6M',
    helps: 'Heat/MTR traceability, base-material checks, fabrication quality evidence',
    segment: 2,
  },
  {
    sector: 'Pressure-vessel and energy suppliers',
    standards: 'ASTM A20/A20M, ASME material specifications, API 5L where applicable',
    helps: 'Material specification matching, required tests, documentation and traceability',
    segment: 1,
    focus: 2,
  },
];

// Each standard pins itself to a zone of the sample certificate: spec,
// grade, product, heat, chem, mech or supp.
export const SEGMENTS = [
  {
    name: 'Steel service centers and metal distributors',
    short: 'Service centers',
    headline: 'The wrong grade can leave your warehouse with the right paperwork attached.',
    lead: 'When a service center handles thousands of plates, coils, bars and sheets, a single heat-number mismatch or overlooked chemistry value can put customer orders at risk.',
    standards: [
      {
        pin: 'grade',
        code: 'ASTM A6/A6M',
        title: 'General requirements for structural steel',
        sub: 'Rolled structural bars, plates, shapes and sheet piling',
        what: 'General material requirements such as chemical analysis, mechanical testing, product identification and marking for applicable structural steel products. The specific material grade standard and contract determine the acceptance criteria.',
        how: 'Extracts grade, heat number, chemical elements, yield strength, tensile strength and elongation from MTRs, then compares reported values against the configured applicable specification.',
        why: "A service center may sell material marked for one specification even though its certificate doesn't establish all the required properties. Identifying that discrepancy before shipping can help prevent customer rejections and supplier disputes.",
      },
      {
        pin: 'mech',
        code: 'ASTM A370',
        title: 'Mechanical testing of steel products',
        sub: 'Mechanical test methods and definitions',
        what: 'Standardized testing methods for tensile, bend, hardness and impact testing of steel products, as applicable.',
        how: "Reads reported mechanical-test results and can verify that expected properties are present and within the applicable material specification's limits.",
        why: 'A certificate listing tensile strength does not necessarily establish every required mechanical property. Missing yield strength, elongation, or impact-test data can create an incomplete customer certification package.',
        note: 'ASTM A370 primarily defines testing methods; it does not universally set the acceptance limits for every grade.',
      },
      {
        pin: 'heat',
        code: 'ISO 9001',
        title: 'Clauses 8.4, 8.5.2, 8.6 and 8.7',
        sub: 'Supplier control, identification and traceability, release and nonconformance',
        what: 'Controlling externally supplied products, identifying and tracing outputs where required, conducting release verification, and controlling nonconforming outputs.',
        how: 'Associates supplier certificates with material and heat identifiers, records verification outcomes, and flags discrepancies for quality review.',
        why: 'Customers increasingly expect distributors to retrieve the correct MTR for the steel supplied. Missing traceability records can create problems even when the physical material is acceptable.',
      },
    ],
    cta: "Know what you're receiving, and prove what you're shipping.",
  },
  {
    name: 'Steel mills and metal manufacturers',
    short: 'Mills and manufacturers',
    headline: 'Producing the right steel is only half the job. You must also demonstrate that it meets the specification.',
    lead: 'Chemical composition, mechanical-test results, heat treatment, supplementary requirements and documented evidence can all affect material acceptance.',
    standards: [
      {
        pin: 'supp',
        code: 'ASTM A20/A20M',
        title: 'Steel plates for pressure vessels',
        what: 'General requirements for applicable pressure-vessel steel plates, including material production, chemical analysis, mechanical testing and supplementary requirements.',
        how: 'Compares certificate data against the applicable plate specification and purchase-order requirements, including required chemistry and mechanical properties.',
        why: "Pressure-vessel plate requirements may include additional tests or restrictions. A standard-looking MTR can be insufficient when a customer's project calls for supplementary testing.",
        note: 'Example: A purchaser orders ASTM A516 Grade 70 plate with a contractually specified impact-test requirement. Star can flag an MTR that lacks the required results for investigation.',
      },
      {
        pin: 'chem',
        code: 'ASTM A480/A480M',
        title: 'Stainless steel plate, sheet and strip',
        what: 'General requirements for applicable flat-rolled stainless steel products, including chemical composition and mechanical testing, with additional requirements where specified.',
        how: 'Checks the reported chemistry and mechanical properties against the ordered grade and applicable specification, including limits and additional contract requirements.',
        why: 'Incorrect chemistry or missing test information can turn an otherwise usable stainless-steel shipment into a customer rejection.',
      },
      {
        pin: 'product',
        code: 'API 5L',
        title: 'Specification for line pipe',
        what: 'Manufacturing and technical requirements for seamless and welded steel line pipe, including material properties, inspection, testing, marking and traceability.',
        how: 'Can extract pipe grade, manufacturing identifiers and test results, and compare MTR evidence against applicable API 5L purchase requirements.',
        why: 'Missing required testing or traceability documentation can delay pipe acceptance on energy-sector projects. Some verification requirements also depend on the product specification level and ordered options.',
      },
    ],
    cta: 'Automate verification of chemical, mechanical and specification requirements across your mill certificates.',
  },
  {
    name: 'Structural steel fabrication and construction',
    short: 'Fabrication and construction',
    headline: 'What happens when the steel has already been cut or welded, and its certificate cannot be traced?',
    lead: "For fabricators, a missing heat number or incorrect material certificate isn't just an administrative problem. It can delay fabrication approval, trigger reinspection and cause costly corrective work.",
    standards: [
      {
        pin: 'heat',
        code: 'AISC 207-25',
        title: 'Standard for certification programs',
        what: 'Quality-management requirements for applicable AISC certification programs, including controls for material identification, traceability, inspection and fabrication processes.',
        how: 'Connects MTR information with heat numbers, material identifiers, receiving records and fabrication documents. This supports maintaining material evidence across receiving and production.',
        why: 'If a beam or plate loses its identification during cutting or fabrication, the fabricator may struggle to demonstrate which certified material was used.',
        note: 'The previous AISC 207-20 edition explicitly required documented procedures to preserve heat and MTR identity through fabrication. The revised AISC 207-25 became effective February 1, 2026; users should check its current clauses against their certification scope.',
      },
      {
        pin: 'grade',
        code: 'AWS D1.1/D1.1M',
        title: 'Structural welding code, steel',
        what: 'Welding procedure qualification, welder qualification, fabrication, inspection and acceptance requirements for applicable welded steel structures.',
        how: 'Supports base-material documentation by validating MTR grade and property information against project requirements and making relevant certificates retrievable for welding-quality reviews.',
        why: 'A mismatch between specified and supplied base material may require investigation before fabrication. It can affect material acceptance and the suitability of the planned welding procedures.',
        note: "Important: Star's MTR automation does not perform weld inspection or replace WPS/PQR qualification, welder qualification or nondestructive testing.",
      },
      {
        pin: 'spec',
        code: 'ASTM A6/A6M',
        title: 'Structural steel material requirements',
        what: 'General requirements for applicable structural steel materials, including identification, chemistry and mechanical properties.',
        how: 'Compares MTR results with the ordered ASTM material grade, verifies expected fields and flags missing or incorrect material-identification information.',
        why: 'Catching a grade or heat mismatch before cutting or welding can reduce downstream material substitution investigations.',
      },
    ],
    cta: 'Protect heat traceability from receiving through fabrication.',
  },
];

// The sample certificate the standards pin to, zone by zone.
export const CERT = {
  fields: [
    ['spec', 'Specification', 'ASTM A6/A6M · ASTM A516/A516M'],
    ['grade', 'Grade and marking', 'A516 Gr. 70 · stencil NSM 24A8871'],
    ['product', 'Product', 'Plate 1.25 × 96 × 240 in'],
    ['heat', 'Heat and traceability', 'Heat 24A8871 · PO 44-1180 · Lot 3'],
  ],
  chemistry: [
    ['C', '0.21'],
    ['Mn', '1.05'],
    ['P', '0.010'],
    ['S', '0.003'],
    ['Si', '0.28'],
  ],
  mechanical: [
    ['Yield', '47.5 ksi'],
    ['Tensile', '79.0 ksi'],
    ['Elong.', '24%'],
  ],
};

export const EN10204 = {
  kicker: 'EN 10204',
  heading: 'Is the certificate you received actually the certificate your customer ordered?',
  lead: 'The standard defines different types of inspection documents supplied for metallic products. European customers often ask for a particular type, and an MTR can look complete without being the type the purchase order requires.',
  // [type, description], least to most independent assurance.
  types: [
    ['2.1', 'Declaration of compliance with the order, without test results.'],
    ['2.2', 'Test report based on nonspecific inspection.'],
    ['3.1', "Inspection certificate with specific inspection results, validated by the manufacturer's authorized representative independent of manufacturing."],
    ['3.2', "Inspection certificate involving the manufacturer and an authorized purchaser's or designated independent inspector."],
  ],
  names: ['Declaration of compliance', 'Test report', 'Inspection certificate', 'Inspection certificate, third party'],
  how: 'Extracts certificate type, manufacturer information, heat identifiers, test results and relevant validation details. It can flag when the supplied document appears inconsistent with the certificate type required by the purchase order.',
  why: 'A project requiring an EN 10204 Type 3.2 certificate generally cannot be satisfied merely by providing a Type 3.1 certificate. Even correct chemical and mechanical results do not resolve an incorrect inspection-document type.',
  note: 'Star can help detect document-level mismatches, but it cannot independently establish certificate authenticity or substitute for the required third-party inspection.',
};

export const AGENTS = {
  heading: ['Pre-built agents you can put to work.', 'Start with one, add the rest as you go.'],
  items: [
    {
      title: 'MTR management agent',
      c: '#493ee5',
      icon: <path d="M4 6.5h6l2 2h8V19H4z M4 10.5h16" {...STROKE} />,
      text: 'Collects MTRs from email, supplier portals and scans, files them by heat number, PO and supplier, and keeps them searchable by grade, temper, alloy and finish.',
    },
    {
      title: 'MTR extraction agent',
      c: '#0092b8',
      tag: 'Exceptions only',
      icon: <path d="M6 3h8l4 4v14H6z M14 3v4h4 M9 12.5l2 2 4-4.5" {...STROKE} />,
      text: 'Star’s own certificate model reads most MTRs. This agent steps in for the hard ones: unusual layouts, poor scans and handwritten notes.',
    },
    {
      title: 'Compliance agent',
      c: '#0e7a55',
      tag: 'ASTM · ASME · API',
      icon: <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z M9 12l2 2 4-4.5" {...STROKE} />,
      text: 'Checks chemistry, mechanical properties and test results against the standard and the customer’s PO, and explains every exception.',
    },
    {
      title: 'Integration agent',
      c: '#2160D9',
      tag: 'QMS · ERP · DMS',
      icon: (
        <>
          <circle cx="6" cy="6" r="2.5" {...STROKE} />
          <circle cx="18" cy="18" r="2.5" {...STROKE} />
          <path d="M8.5 6H14a4 4 0 014 4v5.5 M6 8.5V18h9.5" {...STROKE} />
        </>
      ),
      text: 'Sends validated MTR data to your QMS, ERP or document system, linked to the receipt, the heat and the order.',
    },
    {
      title: 'Supplier analysis agent',
      c: '#d97706',
      icon: <path d="M4 20V12 M9.3 20V6 M14.6 20v-6 M20 20V9" {...STROKE} />,
      text: 'Tracks each mill’s record over time: missing tests, repeat deviations and NCRs, so you know which suppliers need a closer look.',
    },
  ],
};

export const INTEGRATIONS = {
  heading: ['Fits into the systems you already use.', 'Validated MTR data flows into your ERP, QMS, MES and the work that follows.'],
  // The documents feeding the hub diagram.
  docs: ['MTR', 'COA', 'Invoice'],
  proof: {
    kicker: 'Customer story · United Performance Metals',
    was: '20 min',
    now: 'seconds',
    sub: 'Processing time per MTR, before and after Star.',
  },
};

// The FAQ (the Resources page's section, MTR automation only): the line
// under its heading, and where its "Talk to our team" goes.
export const FAQ = {
  lede: 'How Star Software handles MTRs, from setup and integration to accuracy and security.',
  help: mailto('Question about MTR automation'),
};
