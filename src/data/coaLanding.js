// Copy for the COA landing page (/coa-automation), word for word from
// "COA Landing Page Copy.pdf" (October 2026); the eyebrows are the page's
// own section labels. The page lays it out and animates it:
// src/pages/CoaLanding.jsx.

// Where the "proof review" calls to action go, like the site's other
// "Get a Demo" links.
export const PROOF_REVIEW_URL = '/#demo';

export const HERO = {
  eyebrow: 'COA automation',
  // The highlighted end of the headline is set apart on the page.
  title: 'Verify supplier COA data',
  titleHighlight: 'against the specifications that matter.',
  text: 'Star Software extracts supplier COA data, verifies it against your product specification and routes exceptions to the right reviewer.',
  primaryCta: 'Start your COA Proof Review',
  secondaryCta: 'See the Workflow',
};

// Logos from public/mtr/logos/; the rest show as wordmarks until their
// logos are supplied.
export const CUSTOMERS = [
  { name: 'ROSCHE' },
  { name: 'Dover Tubular' },
  { name: 'Coilplus', logo: '/mtr/logos/coilplus.png' },
  { name: 'Apollo Dynamics' },
  { name: 'Mitsubishi Electric', logo: '/mtr/logos/mitsubishi-electric.svg' },
];

export const PROBLEM = {
  eyebrow: 'The problem',
  title: 'Supplier data doesn’t release the lot by itself.',
  text: 'Your team still needs to identify the applicable requirement, compare the result and decide what happens next.',
  steps: [
    { title: 'Find the value', text: 'Capture results across different supplier COA layouts.' },
    { title: 'Match the spec', text: 'Apply the product or supplier-specific requirement.' },
    { title: 'Flag the exceptions', text: 'Show what is missing, unclear or out of range.' },
    { title: 'Route the decision', text: 'Support the right automated or reviewer-led QA step.' },
  ],
};

export const WORKFLOW = {
  eyebrow: 'How it works',
  title: 'From supplier COA to QA review',
  text: 'Connect document capture with the product requirements and review decisions that follow.',
  steps: [
    { title: 'Extract', text: 'Capture the relevant values from the supplier COA.' },
    { title: 'Verify', text: 'Compare them with your applicable product or supplier requirement.' },
    { title: 'Review', text: 'Email exceptions to the defined person.' },
    { title: 'Progress', text: 'Support the automated or reviewer-led next step in the QA workflow.' },
  ],
};

export const DIFFERENCE = {
  eyebrow: 'Extraction vs verification',
  title: 'Give every reported value the context it needs.',
  text: 'Reading a COA answers what the supplier reported. Verification asks whether that result aligns with the requirement your business uses.',
  cta: 'See how this works with COAs',
  columns: ['Extraction establishes', 'Verification adds'],
  rows: [
    ['The supplier-reported value', 'The requirement that applies'],
    ['The information captured', 'How the result compares'],
    ['What is ready for checking', 'What needs attention'],
    ['The source document', 'The decision context'],
  ],
};

export const REVIEWER = {
  eyebrow: 'Reviewer visibility',
  title: 'Keep QA judgment connected to the source.',
  text: 'When a result is missing, unclear or outside the required range, Star Software can email the defined person for review.',
  points: [
    'Supplier result and requirement shown together',
    'Reason for attention made visible',
    'Automated or reviewer-led decision path',
    'Clear next action for QA',
  ],
};

export const AUDIENCE = {
  eyebrow: 'Who it supports',
  // A non-breaking hyphen, so the line never breaks inside the compound.
  title: 'Built around supplier‑certificate review',
  text: 'For teams in pharma, food, chemical, wood and rubber businesses where supplier COAs inform incoming-material or release decisions.',
  industries: ['Pharma', 'Food', 'Chemical', 'Wood', 'Rubber'],
  teams: [
    { title: 'QA and quality operations', text: 'Assess supplier COAs within lot and release workflows.' },
    { title: 'Quality managers', text: 'Evaluate checking consistency, reviewer visibility and workflow control.' },
    { title: 'Supplier quality and procurement', text: 'Address document variation that creates downstream quality work.' },
    { title: 'Technical stakeholders', text: 'Assess system requirements and downstream data flow where relevant to implementation.' },
  ],
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
  title: 'Test the method on your COAs',
  text: 'Use supplier documents and product requirements that reflect the QA decisions your team actually makes.',
  cta: 'See your proof review',
  listTitle: 'Bring a representative set',
  list: [
    'Supplier COAs your team receives',
    'The applicable product or supplier requirements',
    'Different layouts and complex examples',
    'Missing or out-of-range scenarios',
    'Your current QA review process',
  ],
};

export const FAQS = {
  eyebrow: 'FAQ',
  title: 'Common Questions on COA Automation',
  items: [
    {
      q: 'Does this include verification as well as extraction?',
      a: 'Yes. The workflow includes comparing captured information with the buyer’s applicable product specification and bringing items that need attention into review.',
    },
    {
      q: 'Can it work with our product specification?',
      a: 'Provide the relevant specification with your sample COAs. The evaluation establishes which requirements can be supported in your context.',
    },
    {
      q: 'What happens when a value needs attention?',
      a: 'Missing, ambiguous or out-of-range values are referred to the defined person by email for review. The subsequent action follows your agreed QA workflow.',
    },
    {
      q: 'Will it work with every supplier format?',
      a: 'Include representative supplier and layout variation in the review. Assess the documents your team receives rather than assuming one sample establishes coverage for every format.',
    },
    {
      q: 'How much does it cost, and how quickly can we implement it?',
      a: 'Pricing and timing follow the agreed document, specification, workflow and system requirements.',
    },
  ],
};

export const FINAL_CTA = {
  title: 'See how COA verification fits your QA workflow.',
  text: 'Start with the supplier COAs you review and the product requirements used to check.',
  cta: 'Start a COA Proof Review',
};
