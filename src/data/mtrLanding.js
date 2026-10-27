// Copy for the MTR landing page (/mtr-automation), word for word from
// "MTR Landing Page Copy.pdf" (October 2026). The page lays it out and
// animates it: src/pages/MtrLanding.jsx.

// Where the "proof review" calls to action go, like the site's other
// "Get a Demo" links.
export const PROOF_REVIEW_URL = '/#demo';

export const HERO = {
  eyebrow: 'MTR automation',
  // The highlighted end of the headline is set apart on the page.
  title: 'Automate incoming MTR checks,',
  titleHighlight: 'from supplier certificate to ERP',
  text: 'Star Software turns your supplier MTRs into review-ready data, checks it against ASTM requirements, and sends approved results to your ERP.',
  primaryCta: 'Start an MTR Proof Review',
  secondaryCta: 'See the Workflow',
};

// Logos from public/mtr/logos/; the rest show as wordmarks until their
// logos are supplied. `logoHeight` (px) is for a logo set in two lines,
// which needs more height than the others to be read.
export const CUSTOMERS = [
  { name: 'Triple S Steel' },
  { name: 'Dover Tubular' },
  { name: 'Coilplus', logo: '/mtr/logos/coilplus.png' },
  { name: 'Nucor Skyline', logo: '/mtr/logos/nucor-skyline.png' },
  { name: 'Mitsubishi Electric', logo: '/mtr/logos/mitsubishi-electric.svg' },
];

export const PROBLEM = {
  eyebrow: 'The problem',
  title: 'A certificate isn’t finished when it’s read.',
  text: 'The real work begins when your team has to check values, approve the material, and move the information onward.',
  callout: {
    value: '100+',
    title: 'MTRs a month?',
    text: 'Manual review stops being a task. It becomes an operational bottleneck.',
  },
  steps: [
    { title: 'Find the relevant values', text: 'Locate chemical, mechanical, and hardness data across supplier layouts.' },
    { title: 'Check the right requirement', text: 'Compare the result with the applicable ASTM and material requirements' },
    { title: 'Review the exceptions', text: 'Give quality teams the context to decide what happens next.' },
    { title: 'Move the record', text: 'Send approved data onward and retrieve the certificate when needed.' },
  ],
};

export const WORKFLOW = {
  eyebrow: 'How it works',
  title: 'Four steps. One controlled flow.',
  text: 'From incoming supplier MTR to approved information in the right operational system.',
  steps: [
    { title: 'Extract', text: 'Capture the data your team needs from the MTR' },
    { title: 'Check', text: 'Apply the relevant ASTM and material requirements' },
    { title: 'Review', text: 'Surface confidence and exceptions for the right approval path' },
    { title: 'Handoff', text: 'Move approved results to your ERP or document system' },
  ],
};

export const BENEFITS = {
  eyebrow: 'Operational benefits',
  title: 'Address the workaround for every certificate',
  text: 'A useful MTR system supports the complete review environment, including variation, exceptions, retrieval, and downstream data.',
  cta: 'See how this works on your MTRs',
  items: [
    { title: 'Reduce repeated entry', text: 'Keep captured information connected to the checks and processes that follow.' },
    { title: 'Handle supplier variation', text: 'Evaluate the layouts and certificate combinations your team actually receives.' },
    { title: 'Retrieve certificate records', text: 'Find related MTRs by customer and sales order for audit and documentation requests.' },
    { title: 'Generate outgoing certificates', text: 'Create a certificate of conformance with content and format confirmed for the workflow.' },
  ],
};

export const REVIEWER = {
  eyebrow: 'Reviewer visibility',
  title: 'Show the reason behind the review.',
  text: 'A confidence score is only useful when the reviewer can see the value, its source, the relevant requirement, and the next action.',
  points: [
    'Automated or reviewer-led approval',
    'Source and checking context together',
    'Exceptions routed to the right person',
    'Clear next action for quality teams',
  ],
  // The animated card is labelled as an illustration, not a screenshot.
  visualLabel: 'Illustrative MTR review workflow',
};

export const SYSTEM_FIT = {
  eyebrow: 'System fit',
  title: 'Connect certificate processing with your existing systems.',
  text: 'Using Acumatica or Microsoft Dynamics? Include your setup in the MTR review. Star Software also works with SAP, NetSuite, Infor, and Aptean, with SharePoint available as a document source or destination.',
  note: 'System fit varies by version and configuration',
  // In the diagram: the first two are the ones the copy names first.
  erps: [
    { name: 'Acumatica', featured: true },
    { name: 'Microsoft Dynamics', logo: '/mtr/logos/dynamics365.svg', logoHeight: 40, featured: true },
    { name: 'SAP', logo: '/mtr/logos/sap.svg' },
    { name: 'NetSuite', logo: '/mtr/logos/netsuite.png' },
    { name: 'Infor', logo: '/mtr/logos/infor.png' },
    { name: 'Aptean' },
  ],
  documentSystem: { name: 'SharePoint' },
};

export const PARTNERS = [
  { name: 'SAP', logo: '/mtr/logos/sap.svg' },
  { name: 'NetSuite', logo: '/mtr/logos/netsuite.png' },
  { name: 'SharePoint' },
  { name: 'Acumatica' },
  { name: 'Dynamics 365', logo: '/mtr/logos/dynamics365.svg', logoHeight: 40 },
  { name: 'Aptean' },
];

export const PROOF = {
  eyebrow: 'Proof review',
  title: 'Start with your MTRs. Not our claims.',
  text: 'See how extraction, checking, reviewer visibility, and handoff behave using certificates that reflect your suppliers and workflow.',
  cta: 'See your proof review',
  listTitle: 'Bring a representative document set',
  list: [
    'MTRs from the suppliers your team works with',
    'The relevant ASTM or material requirements',
    'Examples of supplier or layout variation',
    'Your current review and approval process',
    'The destination for approved information',
  ],
};

export const FAQS = {
  eyebrow: 'FAQ',
  title: 'Common Questions on MTR Automation',
  items: [
    {
      q: 'Which specifications can we evaluate?',
      a: 'Star checks MTR data against ASTM requirements. Share the applicable standard and material context so the evaluation can establish the specific checking scope; support should not be inferred for every standard or revision.',
    },
    {
      q: 'Will it work with our suppliers’ documents?',
      a: 'Use representative MTRs from your actual suppliers to assess document handling and information capture. Include meaningful variation in the sample set.',
    },
    {
      q: 'Can reviewed information reach our ERP?',
      a: 'Yes. Reviewed information can go into a document management system or directly into the ERP. Your system version, configuration, and required data flow determine the connection scope.',
    },
    {
      q: 'Can we retrieve certificates later?',
      a: 'Star supports audit retrieval of MTRs by customer and sales order. Include a retrieval example in the workflow review if it is important to your team.',
    },
    {
      q: 'How long does implementation take, and what does it cost?',
      a: '1 month, and the price starts at 500 USD / month',
    },
  ],
};

export const FINAL_CTA = {
  title: 'Ready to take manual drag out of MTR review?',
  text: 'Evaluate the workflow with your documents before committing to a wider implementation.',
  cta: 'Start an MTR Proof Review',
};
