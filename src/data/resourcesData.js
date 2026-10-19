// Resource Hub articles: real posts from starsoftware.co (WordPress REST API),
// one per hub slot, until the hub fetches posts live. Their bodies are in
// articleContent.js. The shape (slug/category/type/date/readMinutes) is what
// ResourceHub.jsx and ArticleDetail.jsx expect.

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
  // Posts filed under no automation topic (WordPress "Article" / "Others").
  { id: 'others', label: 'Industry & Trends' },
];

export const ARTICLES = [
  {
    slug: 'certificate-of-conformance-coc-vs-certificate-of-analysis-coa-vs-material-test-report-mtr-understanding-the-differences-and-why-automation-matters',
    featured: true,
    type: 'guide',
    category: 'coa',
    categoryLabel: 'CoA & MTR Automation',
    tag: 'Certificate of Analysis',
    title:
      'Certificate of Conformance (CoC) vs. Certificate of Analysis (CoA) vs. Material Test Report (MTR): Understanding the Differences and Why Automation Matters',
    description:
      'A CoC confirms compliance, a CoA validates product quality, and an MTR provides complete material traceability and engineering verification.',
    author: 'Steve John',
    date: '2026-08-05',
    readMinutes: 7,
    image: 'https://starsoftware.co/wp-content/uploads/2026/08/ChatGPT-Image-Aug-5-2026-12_28_00-PM.png',
  },
  {
    slug: 'test-certificate-automation-for-steel-service-centers-a-complete-guide',
    type: 'guide',
    category: 'mtr',
    categoryLabel: 'MTR Automation',
    tag: '',
    title:
      'Test Certificate Automation for Steel Service Centers – A Complete Guide',
    description:
      'How AI-powered test certificate automation helps steel service centers automate MTRs, improve traceability, and reduce manual data entry.',
    author: 'Abizar Hassan',
    date: '2026-08-04',
    readMinutes: 7,
    image: 'https://starsoftware.co/wp-content/uploads/2026/08/ChatGPT-Image-Aug-4-2026-01_10_22-PM.png',
  },
  {
    slug: 'why-po-invoice-and-grn-processing-demands-different-financial-controls',
    type: 'guide',
    category: 'ap',
    categoryLabel: 'AP & AR Automation',
    tag: '',
    title:
      'Why PO, Invoice, and GRN Processing Demands Different Financial Controls',
    description:
      'PO, Invoice, and GRN processing carry different financial risks. Learn what finance teams must scrutinize to avoid leakage, errors, and compliance issues.',
    author: 'Abizar Hassan',
    date: '2026-02-03',
    readMinutes: 4,
    image: 'https://starsoftware.co/wp-content/uploads/2026/02/ChatGPT-Image-Feb-3-2026-11_56_19-AM.png',
  },
  {
    slug: 'how-ar-automation-protects-cash-flow-during-demand-slowdowns-in-the-u-s-metals-market',
    type: 'guide',
    category: 'ar',
    categoryLabel: 'AR Automation',
    tag: 'US Metal Industry',
    title:
      'How AR Automation Protects Cash Flow During Demand Slowdowns in the U.S. Metals Market',
    description:
      'AR automation helps U.S. metal companies protect cash flow during demand slowdowns by reducing disputes, lowering DSO, and accelerating collections.',
    author: 'Star Software',
    date: '2025-12-23',
    readMinutes: 3,
    image: 'https://starsoftware.co/wp-content/uploads/2025/12/Ar-automation.jpeg',
  },
  {
    slug: 'why-automating-customer-credit-checks-is-key-to-risk-free-growth',
    type: 'guide',
    category: 'ar',
    categoryLabel: 'AR Automation',
    tag: '',
    title:
      'Why Automating Customer Credit Checks is Key to Risk-Free Growth',
    description:
      'Automating customer credit checks is emerging as a powerful strategy to accelerate revenue without exposing your business to unnecessary risk.',
    author: 'Star Software',
    date: '2025-04-10',
    readMinutes: 3,
    image: 'https://starsoftware.co/wp-content/uploads/2025/04/credit-check.webp',
  },
  {
    slug: 'why-faster-coa-turnaround-improves-customer-onboarding-and-retention',
    type: 'guide',
    category: 'coa',
    categoryLabel: 'CoA Automation',
    tag: '',
    title:
      'Why Faster COA Turnaround Improves Customer Onboarding and Retention',
    description:
      'Faster COA turnaround speeds customer onboarding, reduces compliance friction, and improves retention by building trust, audit readiness, and operational reliability.',
    author: 'Star Software',
    date: '2026-01-05',
    readMinutes: 3,
    image: 'https://starsoftware.co/wp-content/uploads/2026/01/Faster-COA.png',
  },
  {
    slug: 'how-automated-qa-workflows-are-redefining-modern-manufacturing-and-compliance',
    type: 'guide',
    category: 'qa',
    categoryLabel: 'QA Automation',
    tag: 'COA',
    title:
      'How Automated QA Workflows Are Redefining Modern Manufacturing and Compliance',
    description:
      'Explore how automated QA workflows transform manufacturing and regulated industries improving accuracy, and strengthening compliance.',
    author: 'Steve John',
    date: '2025-12-02',
    readMinutes: 4,
    image: 'https://starsoftware.co/wp-content/uploads/2025/12/qa.jpeg',
  },
  {
    slug: 'why-manual-transcript-evaluation-is-a-silent-hurdle-in-u-s-higher-ed-admissions',
    type: 'guide',
    category: 'transcript',
    categoryLabel: 'Transcript Automation',
    tag: 'EdTech',
    title:
      'Why Manual Transcript Evaluation is a Silent Hurdle in U.S. Higher Ed Admissions',
    description:
      'Explore how transcript automation can streamline the transfer student process and alleviate administrative bottlenecks in higher education.',
    author: 'Abizar Hassan',
    date: '2026-07-16',
    readMinutes: 4,
    image: 'https://starsoftware.co/wp-content/uploads/2026/07/transcript1.png',
  },
  {
    slug: 'use-case-seamless-erp-integration-with-stars-automation-software',
    featured: true,
    type: 'case-study',
    category: 'others',
    categoryLabel: 'Others',
    tag: 'automation',
    title:
      'Use Case Spotlight: Real-world Implementation of Star’s Automation Software',
    description:
      'Discover the power of Star\'s Automation Software in revolutionizing document processing workflows. Seamless integration with ERPs.',
    author: 'Star Software',
    date: '2023-12-12',
    readMinutes: 2,
    image: 'https://starsoftware.co/wp-content/uploads/2024/12/d2071ecb-d809-4fde-b423-e9ac7fb42488_27_11zon.webp',
  },
];

export function formatResourceDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
