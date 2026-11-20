// Copy for the redesigned MTR automation page (/mtr-automation) that isn't
// already in src/data/mtrCampaign.jsx or src/data/mtrLanding.js: the
// hero, the customer story, resources and industries. Content follows the
// redesigned site's MTR automation page.

export const X_HERO = {
  eyebrow: 'MTR automation',
  title: 'AI-powered mill test report automation',
  titleEnd: 'for metal and steel quality.',
  text: 'Automatically extract, verify and manage mill test reports and material test certificates. Star checks chemistry, mechanical properties, heat numbers, grades and specifications against ASTM, ASME, API, EN and your own customer requirements, before material is received, released or shipped.',
  primary: 'Try it on a sample',
  secondary: 'See how the AI decides',
  ticks: ['Reads every mill’s format', 'Checks specs and customer POs', 'Sends data to your ERP or QMS'],
  // The certificate in the hero: [label, value, confidence, limit text,
  // position of the value inside its limit band (0 to 1)].
  cert: {
    mill: 'Northfield Steel Mill',
    unit: 'Plate mill · Unit 2',
    doc: 'Mill test certificate',
    po: 'PO 44-1180',
    product: 'Plate 1.25 × 96 × 240 in',
    rows: [
      ['Grade', 'ASTM A516 Gr. 70', 99, 'Matches PO', null],
      ['Heat no.', '24A8871', 99, 'Traced', null],
      ['Carbon', '0.21%', 99, 'max 0.27', 0.78],
      ['Manganese', '1.05%', 98, '0.85 – 1.20', 0.57],
      ['Phosphorus', '0.010%', 97, 'max 0.025', 0.4],
      ['Yield', '47.5 ksi', 99, 'min 38', 0.62],
      ['Tensile', '79.0 ksi', 98, '70 – 90', 0.45],
      ['Elongation', '24%', 96, 'min 17', 0.7],
    ],
  },
};

export const X_STORY = {
  kicker: 'Customer story · United Performance Metals',
  was: 20,
  wasUnit: 'min',
  now: 'seconds',
  sub: 'Processing time per MTR, before and after Star.',
  href: '/resources/stories/upm-case-study',
  quote: 'Extracting, validating, standardizing and retrieving MTR data had become a substantial manual workload. Star took it off the team’s desk.',
};

export const X_RESOURCES = {
  heading: 'Real documents, real results.',
  sub: 'Guides and stories from teams automating their MTRs.',
  items: [
    { kind: 'Buyer’s guide', title: 'MTR and COA automation buyer’s guide', text: 'What to look for, what to ask vendors and how to compare them.', cta: 'Download PDF', href: '/home/downloads/star-mtr-coa-buyers-guide.pdf', download: true, tone: 'violet' },
    { kind: 'Assessment', title: 'MTR readiness assessment', text: 'Score how ready your certificate process is for automation.', cta: 'Download PDF', href: '/home/downloads/star-mtr-coa-readiness-assessment.pdf', download: true, tone: 'teal' },
    { kind: 'Customer story', title: 'Flack Global Metals automates MTC processing', text: 'How a metals supplier took certificate entry off its team’s desk.', cta: 'Read the story', href: '/resources/stories/flack-global-metals-boosts-efficiency-with-automated-mtc-processing', tone: 'navy', stat: ['93%', 'less processing time'] },
    { kind: 'Case study', title: 'Basic Metals', text: 'Certificate processing at a growing metals distributor.', cta: 'Read the case study', href: '/resources/stories/basic-metals-case-study', tone: 'amber' },
  ],
};

export const X_INDUSTRIES = {
  heading: 'One engine.',
  headingEnd: 'Quality workflows for every industry that buys metal.',
  items: [
    { key: 'steel', name: 'Steel and metals', title: 'MTR automation for steel service centers', text: 'Process certificates from many mills and suppliers while keeping material traceability and quality records intact.', gains: ['Faster certificate processing', 'Less manual data entry', 'Better heat traceability', 'Faster material release'], href: '/industries/metal-service-centers', doc: ['MTR', 'A516 Gr. 70', 'Heat 24A8871'] },
    { key: 'mfg', name: 'Manufacturing', title: 'Incoming material verification', text: 'Extract and validate supplier certificates before material enters your quality workflow.', gains: ['Faster receiving inspection', 'Less transcription', 'Consistent validation', 'Audit-ready records'], href: '/industries/steel-metal-manufacturing', doc: ['Cert of conformance', '6061-T6 bar', 'Lot 3381'] },
    { key: 'auto', name: 'Automotive', title: 'Supplier material certification', text: 'Standardise how material certificates are processed across your supplier quality workflows.', gains: ['Supplier quality control', 'Faster verification', 'Better traceability', 'Less manual work'], doc: ['Material cert', 'DP 980 coil', 'Coil C-20417'] },
    { key: 'aero', name: 'Aerospace', title: 'Certificates for high-compliance work', text: 'Structure and validate critical material data, with clear handling for every exception.', gains: ['Compliance support', 'Full traceability', 'Exception review', 'Audit readiness'], doc: ['Mill cert', 'Ti-6Al-4V plate', 'Heat T9921'] },
    { key: 'oil', name: 'Oil and gas', title: 'Material documentation at project scale', text: 'Process certificates across complex projects and large supplier networks.', gains: ['Faster document review', 'Material traceability', 'Specification checks', 'Central records'], doc: ['API 5L MTR', 'X65 PSL2 pipe', 'Heat 77Q120'] },
    { key: 'build', name: 'Construction', title: 'Simpler material certificate checks', text: 'Turn supplier certificates into structured, searchable records for every project.', gains: ['Faster verification', 'Consistent documents', 'Less manual entry', 'Better project records'], href: '/industries/construction', doc: ['Rebar MTR', 'A615 Gr. 60', 'Heat 5530R'] },
  ],
};

export const X_SEND = {
  heading: 'What would Star extract from your MTRs?',
  text: 'Send one mill test report. We’ll walk you through the extracted data, the checks against your specs and the action the agent would take.',
  steps: ['Send one MTR', 'We extract and check it', 'You get a walkthrough'],
  cta: 'Send a sample',
  alt: 'Prefer a live walkthrough? Request a demo',
};
