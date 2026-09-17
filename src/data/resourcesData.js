// Starter content for the Resource Hub. Swap these entries for real published
// articles as they become available — the shape (slug/category/type/date/
// readMinutes) is what ResourceHub.jsx and ArticleDetail.jsx expect.

export const RESOURCE_TYPES = [
  { id: 'all', label: 'All Resources' },
  { id: 'guide', label: 'Articles & Guides' },
  { id: 'case-study', label: 'Industry Case Studies' },
  { id: 'whitepaper', label: 'Technical Whitepapers' },
  { id: 'video', label: 'Video Walkthroughs' },
];

export const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'ap', label: 'AP Automation' },
  { id: 'ar', label: 'AR Automation' },
  { id: 'coa', label: 'CoA Automation' },
  { id: 'mtr', label: 'MTR Automation' },
  { id: 'qa', label: 'QA Automation' },
  { id: 'transcript', label: 'Transcript Automation' },
];

export const ARTICLES = [
  {
    slug: 'coc-coa-mtr-comparison-guide',
    featured: true,
    type: 'guide',
    category: 'coa',
    categoryLabel: 'CoA & MTR Automation',
    tag: 'Compliance Documents',
    title:
      'Certificate of Conformance (CoC) vs. Certificate of Analysis (CoA) vs. Material Test Report (MTR): A Comparison',
    description:
      'Understand the regulatory nuances, physical chemistry parameters, and metallurgical test data across these three quality compliance documents, and where automated parsing fits into the receiving workflow.',
    author: 'Star Software Engineering & Compliance Team',
    date: '2026-08-05',
    readMinutes: 8,
  },
  {
    slug: 'mtr-automation-steel-service-centers',
    type: 'guide',
    category: 'mtr',
    categoryLabel: 'MTR Automation',
    tag: 'ASTM / ASME',
    title:
      'Material Test Report (MTR) Automation for Steel Service Centers: An Implementation Guide',
    description:
      'How steel distributors automate yield strength, tensile testing, and heat-number extraction directly into their ERP without manual data entry.',
    author: 'Star Software Product Team',
    date: '2026-08-02',
    readMinutes: 6,
  },
  {
    slug: 'po-invoice-grn-3-way-match',
    type: 'guide',
    category: 'ap',
    categoryLabel: 'AP Automation',
    tag: 'PO & GRN',
    title: 'Why PO, Invoice, and GRN Processing Demands Different Financial Controls',
    description:
      'A look at the gaps in standard 2-way matching and how automated, line-item tolerance verification helps stop overpayments before they post.',
    author: 'Star Software Product Team',
    date: '2026-07-28',
    readMinutes: 5,
  },
  {
    slug: 'ar-automation-cash-flow',
    type: 'guide',
    category: 'ar',
    categoryLabel: 'AR Automation',
    tag: 'DSO',
    title: 'How AR Automation Helps Protect Cash Flow During Demand Slowdowns',
    description:
      'Practical approaches to reducing Days Sales Outstanding (DSO) and speeding up reconciliation during volatile industrial purchasing cycles.',
    author: 'Star Software Product Team',
    date: '2026-07-21',
    readMinutes: 7,
  },
  {
    slug: 'automated-credit-checks',
    type: 'guide',
    category: 'ar',
    categoryLabel: 'AR Automation',
    tag: 'Credit Risk',
    title: 'Automating Customer Credit Checks for Risk-Aware Growth',
    description:
      'Moving from manual, multi-day credit appraisals to automated synthesis of credit bureau data, bank statements, and trade references.',
    author: 'Star Software Product Team',
    date: '2026-07-15',
    readMinutes: 4,
  },
  {
    slug: 'coa-ingestion-regulated-manufacturing',
    type: 'guide',
    category: 'coa',
    categoryLabel: 'CoA Automation',
    tag: 'Quality Hold',
    title: 'Reducing Quarantine Bottlenecks with Faster CoA Ingestion',
    description:
      'How regulated manufacturers can shorten the wait for lab QA sign-off by automating Certificate of Analysis parsing and validation.',
    author: 'Star Software Product Team',
    date: '2026-07-09',
    readMinutes: 6,
  },
  {
    slug: 'qa-automation-inspection-reports',
    type: 'guide',
    category: 'qa',
    categoryLabel: 'QA Automation',
    tag: 'Inspection QA',
    title: 'Automating Quality Inspection Report Review at Scale',
    description:
      'How manufacturing QA teams cross-check inspection reports against purchase-order specifications automatically, catching discrepancies before shipment.',
    author: 'Star Software Product Team',
    date: '2026-07-04',
    readMinutes: 5,
  },
  {
    slug: 'academic-transcript-ingestion',
    type: 'guide',
    category: 'transcript',
    categoryLabel: 'Transcript Automation',
    tag: 'Higher Ed',
    title: 'Automated Academic Transcript Ingestion for Higher Education',
    description:
      'How registrar offices reduce manual course-equivalency lookups and speed up transfer-student admissions with automated transcript parsing.',
    author: 'Star Software Product Team',
    date: '2026-07-03',
    readMinutes: 5,
  },
];

export const INDUSTRIES = [
  {
    id: 'manufacturing',
    icon: 'Factory',
    title: 'Manufacturing',
    description:
      'Automate MTRs, CoAs, inspection reports, and freight waybills across multi-tier supplier operations.',
  },
  {
    id: 'metals-steel',
    icon: 'Layers',
    title: 'Metals & Steel',
    description:
      'Specialized parsing for heat numbers, mill specs, ASTM standards, and grade-equivalence mappings.',
  },
  {
    id: 'automotive',
    icon: 'Car',
    title: 'Automotive Supply Chain',
    description:
      'PPAP documentation, CoC compliance, and high-frequency supplier invoice reconciliation.',
  },
  {
    id: 'higher-education',
    icon: 'GraduationCap',
    title: 'Higher Education',
    description:
      'High-volume transcript parsing, grading-system conversions, and registrar workflow automation.',
  },
  {
    id: 'financial-services',
    icon: 'Landmark',
    title: 'Financial Services',
    description:
      'Commercial loan packets, credit agreements, balance sheets, and tax schedules with audit trails.',
  },
  {
    id: 'chemical-pharma',
    icon: 'FlaskConical',
    title: 'Chemical & Pharma',
    description:
      'Batch manufacturing records, safety data sheets (SDS), and Certificate of Analysis validation.',
  },
];

export function formatResourceDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
