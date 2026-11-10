import { DEMO_PATH } from './demo';
// About page (/about-us), from "NEW - About Star Software" (Google Docs) and
// the summary sent with it (the challenge, how we solve it, the core
// capabilities and the business objective). Copy as written; the photos
// are from Unsplash (free to use), served from its image CDN.

export const CONTACT_URL = '/#contact';
export const DEMO_URL = DEMO_PATH;

// An Unsplash photo at the width it's shown, cropped to fit.
export const photo = (id, width) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const PHOTOS = {
  steel: { id: 'photo-1697698532634-ea59b636ccea', alt: 'Coils of rolled steel lined up in a mill warehouse' },
  lab: { id: 'photo-1668600372358-e61485420d2f', alt: 'Quality technicians in a laboratory, one reviewing results on a tablet' },
  paperwork: { id: 'photo-1583521214690-73421a1829a9', alt: 'Stacks of paper documents and file folders on an office desk' },
  finance: { id: 'photo-1772588627327-1eeddcf73c11', alt: 'A person reviewing financial documents beside a calculator and a laptop' },
  procurement: { id: 'photo-1664382953403-fc1ac77073a0', alt: 'Two colleagues with a clipboard walking a warehouse aisle' },
  education: { id: 'photo-1758270705518-b61b40527e76', alt: 'University students gathered around a laptop in a lecture hall' },
  workflow: { id: 'photo-1590402494587-44b71d7772f6', alt: 'Two colleagues mapping out a process with sticky notes on a glass wall' },
  expert: { id: 'photo-1700727448575-6f1680cd7d75', alt: 'A quality engineer reviewing results on a clipboard' },
  idea: { id: 'photo-1666600980032-689037dae6c6', alt: 'A hand cupping a glowing light bulb against an evening sky' },
};

export const HERO = {
  eyebrow: 'About Star Software',
  title: 'From Document Intelligence to Intelligent Workflow Automation.',
  titleHighlight: 'Intelligent Workflow Automation.',
  text: 'We turn fragmented information into connected workflows and meaningful business outcomes.',
  primaryCta: 'Talk to us',
  secondaryCta: 'What we automate',
  // The photo band under the headline: where Star's work happens.
  band: [
    { photo: 'steel', label: 'Manufacturing quality' },
    { photo: 'finance', label: 'Finance' },
    { photo: 'procurement', label: 'Procurement' },
    { photo: 'education', label: 'Education' },
  ],
};

export const STORY = {
  title: 'Every business runs on information.',
  documents: [
    { doc: 'A purchase order', role: 'initiates a transaction.' },
    { doc: 'An invoice', role: 'triggers a financial process.' },
    { doc: 'A Mill Test Report', role: 'provides evidence of material quality.' },
    { doc: 'A Certificate of Analysis', role: 'records product test results.' },
    { doc: 'A transcript', role: 'documents academic achievement.' },
  ],
  text: 'But the real challenge isn’t simply capturing what’s written in these documents. It’s connecting the information, validating what matters and ensuring the right action follows.',
};

export const CHALLENGE = {
  eyebrow: 'The challenge we solve',
  title: 'Critical information is everywhere. The context and actions are not.',
  text: 'Business-critical data is dispersed across documents, email conversations, spreadsheets, supplier records and enterprise applications. Teams spend valuable time extracting information, reconciling discrepancies, checking compliance, chasing missing evidence and coordinating approvals.',
  closing: 'Disconnected processes create delays, increase operational risk and make it harder to act on reliable information.',
  // Where the data sits, and what teams spend their time on: from the text.
  sources: ['Documents', 'Email conversations', 'Spreadsheets', 'Supplier records', 'Enterprise applications'],
  work: ['Extracting information', 'Reconciling discrepancies', 'Checking compliance', 'Chasing missing evidence', 'Coordinating approvals'],
};

export const MISSION = {
  title: 'Star Software is changing how organizations work with information.',
  lead: 'We combine intelligent document processing, specialized AI agents and workflow automation to help businesses transform disconnected information into reliable, actionable intelligence.',
  text: 'Our technology captures data from diverse sources, interprets it in context, validates it against applicable standards and business rules, and connects the results to the processes and systems where work happens.',
  quote: 'Because extracting data is only the beginning. The real value emerges when information becomes intelligence, and intelligence drives action.',
};

export const APPROACH = {
  eyebrow: 'How we solve it',
  title: 'Extract. Understand. Validate. Automate. Integrate.',
  steps: [
    {
      title: 'Document Intelligence',
      text: 'Extract relevant information from PDFs, scans, emails, spreadsheets and other business files, including complex layouts and challenging documents.',
    },
    {
      title: 'Cross-Document Validation',
      text: 'Connect related records and reconcile information across purchase orders, MTRs, COAs, specifications, inspection reports and supplier communications.',
    },
    {
      title: 'AI Agents',
      text: 'Apply specialized intelligence to extraction, requirements matching, compliance checks, supplier analysis and exception management.',
    },
    {
      title: 'Workflow Automation',
      text: 'Route tasks, trigger rule-based actions, request missing information, coordinate reviews and approvals, and track exceptions through resolution.',
    },
    {
      title: 'Enterprise Integration',
      text: 'Deliver validated, traceable data and workflow outcomes to ERP, QMS, LIMS, DMS and other business systems.',
    },
  ],
};

export const SOLUTIONS = {
  eyebrow: 'Where we work',
  title: 'Intelligence Beyond Individual Documents',
  text: 'From manufacturing quality and financial operations to procurement and education, Star applies AI-powered automation to document-intensive processes where accuracy, efficiency and traceability matter.',
  items: [
    {
      area: 'Manufacturing Quality',
      title: 'MTR and COA Automation',
      text: 'Connect mill test reports and certificates of analysis with purchase orders, customer specifications, inspection reports and applicable quality requirements. Validate critical values, identify missing evidence and surface discrepancies to support informed quality decisions.',
      photo: 'steel',
      links: [
        { label: 'MTR automation', to: '/mtr-automation' },
        { label: 'COA automation', to: '/coa-automation' },
      ],
    },
    {
      area: 'Finance',
      title: 'Accounts Payable and Accounts Receivable Automation',
      text: 'Streamline invoice data capture, document validation, transaction matching and exception handling. Help finance teams reduce repetitive processing and move financial information through connected, more consistent workflows.',
      photo: 'finance',
    },
    {
      area: 'Procurement',
      title: 'Purchase Order Automation',
      text: 'Capture and validate purchase order information, connect purchasing documents with related records, and help maintain consistency across procurement, receiving and downstream business processes.',
      photo: 'procurement',
    },
    {
      area: 'Education',
      title: 'Transcript Automation',
      text: 'Extract and structure academic information from transcripts and supporting documents, helping institutions streamline document-intensive admissions, evaluation and records-processing workflows.',
      photo: 'education',
    },
  ],
  studio: {
    area: 'Workflow Studio',
    title: 'Connecting Intelligence with Execution',
    text: 'Design and orchestrate workflows that bring documents, AI agents, configurable business rules, people and enterprise applications together. From routine task routing to exception resolution and approval coordination, Workflow Studio helps translate process requirements into connected business operations.',
    photo: 'workflow',
  },
  closing: 'Each capability addresses a specific business challenge. Together, they reflect a broader vision: automation that does more than process documents—it connects information, decisions and actions across the enterprise.',
};

export const AGENTS = {
  eyebrow: 'AI agents and workflows',
  title: 'AI Agents That Understand the Task. Workflows That Move It Forward.',
  lead: 'We believe intelligent automation works best when specialized intelligence is combined with coordinated execution.',
  text: [
    'Star’s AI agents support tasks such as document extraction, cross-document matching, requirements validation, supplier analysis and exception identification. Workflow automation connects these capabilities, helping route tasks, trigger rule-based actions, request missing information, coordinate reviews and maintain visibility into process status.',
    'This approach helps organizations move beyond isolated automation tasks towards more connected operations. Routine work can progress with greater consistency, exceptions can reach the right people sooner, and decisions can be supported by relevant information and traceable evidence.',
  ],
  human: 'Human expertise remains central wherever judgment, authorization or formal approval is required.',
  // The two halves of the picture, named from the text above.
  agentTasks: ['Document extraction', 'Cross-document matching', 'Requirements validation', 'Supplier analysis', 'Exception identification'],
  workflowActions: ['Route tasks', 'Trigger rule-based actions', 'Request missing information', 'Coordinate reviews', 'Maintain visibility into process status'],
};

export const CAPABILITIES = {
  eyebrow: 'Our core capabilities',
  title: 'Our Core Capabilities',
  items: [
    { title: 'Intelligent Document Processing', text: 'Turn unstructured documents and business communications into usable, structured data.' },
    { title: 'AI-Powered Validation and Compliance', text: 'Check information against applicable standards, customer specifications and configurable business rules.' },
    { title: 'AI Agents and Decision Support', text: 'Connect evidence, identify discrepancies, surface risks and recommend appropriate next steps.' },
    { title: 'Workflow Automation and Orchestration', text: 'Move work across people, systems and business processes, from routine processing to exception resolution.' },
    { title: 'Supplier and Quality Intelligence', text: 'Identify recurring discrepancies, missing evidence and supplier performance patterns to support better-informed decisions.' },
    { title: 'Enterprise Integration and Traceability', text: 'Connect validated information with business applications while preserving context, status and audit history.' },
  ],
};

export const OUTCOMES = {
  eyebrow: 'Business outcomes',
  title: 'Designed Around Business Outcomes',
  lead: 'Technology creates value when it improves how work gets done.',
  text: [
    'Star aims to help organizations reduce repetitive manual effort, accelerate processing cycles, strengthen data reliability, improve compliance visibility and manage operational exceptions more effectively. By connecting document intelligence with workflow automation and enterprise systems, we help businesses build processes that are more efficient, consistent and accountable.',
    'Our focus is not automation for its own sake. It is about helping people spend less time managing documents and disconnected tasks—and more time making decisions, solving problems and moving the business forward.',
  ],
  objective: {
    label: 'Our business objective',
    title: 'Move businesses from manual document handling to intelligent, connected operations.',
    text: 'We aim to help organizations improve productivity, accelerate process cycles, strengthen compliance, reduce avoidable errors and gain greater visibility into operational risks—all while keeping people in control of decisions that require judgment and authorization.',
    aims: ['Improve productivity', 'Accelerate process cycles', 'Strengthen compliance', 'Reduce avoidable errors', 'Gain visibility into operational risks'],
  },
};

export const BELIEF = {
  eyebrow: 'Our belief',
  lines: ['Documents contain information.', 'Intelligence reveals what matters.', 'Workflow automation turns insight into action.'],
  text: 'At Star Software, we are building a more connected approach to business automation—bringing together documents, data, AI agents and workflows to help organizations operate with greater efficiency, confidence and control.',
  primaryCta: 'Talk to us',
  secondaryCta: 'Get a Demo',
};
