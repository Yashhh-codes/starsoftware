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
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"%3E%3Cdefs%3E%3ClinearGradient id="coa1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%230055ff"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%237c3aed"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="500" fill="url(%23coa1)"/%3E%3Cg opacity="0.1"%3E%3Crect x="80" y="80" width="140" height="160" fill="white" rx="8"/%3E%3Cline x1="100" y1="120" x2="200" y2="120" stroke="white" stroke-width="3"/%3E%3Cline x1="100" y1="145" x2="200" y2="145" stroke="white" stroke-width="2"/%3E%3Cline x1="100" y1="165" x2="200" y2="165" stroke="white" stroke-width="2"/%3E%3Crect x="330" y="80" width="140" height="160" fill="white" rx="8"/%3E%3Crect x="580" y="80" width="140" height="160" fill="white" rx="8"/%3E%3C/g%3E%3Ctext x="400" y="320" font-size="72" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif"%3ECompliance%3C/text%3E%3Ctext x="400" y="400" font-size="72" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif"%3EDocuments%3C/text%3E%3Ctext x="400" y="460" font-size="32" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="sans-serif"%3ECoC vs CoA vs MTR%3C/text%3E%3C/svg%3E',
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
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"%3E%3Cdefs%3E%3ClinearGradient id="mtr1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%237c3aed"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%233b82f6"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="500" fill="url(%23mtr1)"/%3E%3Cg opacity="0.15"%3E%3Crect x="150" y="120" width="500" height="280" fill="none" stroke="white" stroke-width="3" rx="8"/%3E%3Cline x1="180" y1="180" x2="720" y2="180" stroke="white" stroke-width="2"/%3E%3Cline x1="180" y1="220" x2="720" y2="220" stroke="white" stroke-width="2"/%3E%3Cline x1="180" y1="260" x2="720" y2="260" stroke="white" stroke-width="2"/%3E%3Cline x1="180" y1="300" x2="720" y2="300" stroke="white" stroke-width="2"/%3E%3Cline x1="180" y1="340" x2="720" y2="340" stroke="white" stroke-width="2"/%3E%3C/g%3E%3Ctext x="400" y="80" font-size="56" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif"%3EMaterial Test%3C/text%3E%3Ctext x="400" y="150" font-size="56" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif"%3EAutomation%3C/text%3E%3Ctext x="400" y="440" font-size="36" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="sans-serif"%3EASTM Standards • Heat Numbers • ERP Integration%3C/text%3E%3C/svg%3E',
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
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"%3E%3Cdefs%3E%3ClinearGradient id="ap1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%230055ff"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%2322c55e"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="500" fill="url(%23ap1)"/%3E%3Cg opacity="0.2"%3E%3Crect x="100" y="100" width="200" height="280" fill="white" rx="4"/%3E%3Cline x1="130" y1="140" x2="270" y2="140" stroke="white" stroke-width="2"/%3E%3Crect x="300" y="100" width="200" height="280" fill="white" rx="4"/%3E%3Crect x="500" y="100" width="200" height="280" fill="white" rx="4"/%3E%3Cpath d="M 250 280 Q 350 320 450 280" stroke="white" stroke-width="2" fill="none"/%3E%3C/g%3E%3Ctext x="400" y="70" font-size="56" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif"%3E3-Way Match%3C/text%3E%3Ctext x="400" y="140" font-size="56" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif"%3EFinancial Controls%3C/text%3E%3Ctext x="400" y="420" font-size="40" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="sans-serif"%3EPO • Invoice • GRN%3C/text%3E%3Ctext x="400" y="470" font-size="28" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="sans-serif"%3EStop Overpayments Before They Post%3C/text%3E%3C/svg%3E',
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
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"%3E%3Cdefs%3E%3ClinearGradient id="ar1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2310b981"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%230ea5e9"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="500" fill="url(%23ar1)"/%3E%3Cg opacity="0.2"%3E%3Cpolyline points="150,350 250,280 350,310 450,200 550,240 650,150 750,180" fill="none" stroke="white" stroke-width="3"/%3E%3Ccircle cx="150" cy="350" r="6" fill="white"/%3E%3Ccircle cx="250" cy="280" r="6" fill="white"/%3E%3Ccircle cx="350" cy="310" r="6" fill="white"/%3E%3Ccircle cx="450" cy="200" r="6" fill="white"/%3E%3Ccircle cx="550" cy="240" r="6" fill="white"/%3E%3Ccircle cx="650" cy="150" r="6" fill="white"/%3E%3Ccircle cx="750" cy="180" r="6" fill="white"/%3E%3C/g%3E%3Ctext x="400" y="90" font-size="56" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif"%3ECash Flow%3C/text%3E%3Ctext x="400" y="160" font-size="56" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif"%3EOptimization%3C/text%3E%3Ctext x="400" y="420" font-size="36" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="sans-serif"%3EReduce DSO • Speed Reconciliation%3C/text%3E%3Ctext x="400" y="470" font-size="28" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="sans-serif"%3EProtect Revenue During Market Volatility%3C/text%3E%3C/svg%3E',
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
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"%3E%3Cdefs%3E%3ClinearGradient id="credit1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%237c3aed"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%23dc2626"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="500" fill="url(%23credit1)"/%3E%3Cg opacity="0.2"%3E%3Crect x="120" y="120" width="180" height="240" fill="white" rx="4"/%3E%3Cline x1="150" y1="160" x2="270" y2="160" stroke="white" stroke-width="2"/%3E%3Crect x="350" y="120" width="180" height="240" fill="white" rx="4"/%3E%3Crect x="580" y="120" width="180" height="240" fill="white" rx="4"/%3E%3Ccircle cx="210" cy="320" r="8" fill="white"/%3E%3Ccircle cx="440" cy="320" r="8" fill="white"/%3E%3Ccircle cx="670" cy="320" r="8" fill="white"/%3E%3C/g%3E%3Ctext x="400" y="80" font-size="56" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif"%3ECredit Risk%3C/text%3E%3Ctext x="400" y="150" font-size="56" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif"%3EAutomation%3C/text%3E%3Ctext x="400" y="420" font-size="36" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="sans-serif"%3EData Synthesis • Risk Assessment • Growth%3C/text%3E%3Ctext x="400" y="470" font-size="28" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="sans-serif"%3EFrom Multi-Day to Minutes%3C/text%3E%3C/svg%3E',
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
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"%3E%3Cdefs%3E%3ClinearGradient id="coa2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23dc2626"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%230055ff"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="500" fill="url(%23coa2)"/%3E%3Cg opacity="0.2"%3E%3Cpath d="M 150 150 L 250 150 L 250 350 L 150 350 Z" fill="white"/%3E%3Cpath d="M 300 130 L 400 130 L 400 370 L 300 370 Z" fill="white"/%3E%3Cpath d="M 450 120 L 550 120 L 550 380 L 450 380 Z" fill="white"/%3E%3Cpath d="M 600 140 L 700 140 L 700 360 L 600 360 Z" fill="white"/%3E%3C/g%3E%3Ctext x="400" y="80" font-size="56" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif"%3EQuality%3C/text%3E%3Ctext x="400" y="150" font-size="56" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif"%3EAcceleration%3C/text%3E%3Ctext x="400" y="420" font-size="36" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="sans-serif"%3EFaster CoA Ingestion • Reduce Quarantine%3C/text%3E%3Ctext x="400" y="470" font-size="28" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="sans-serif"%3EFor Regulated Manufacturing%3C/text%3E%3C/svg%3E',
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
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"%3E%3Cdefs%3E%3ClinearGradient id="qa1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2322c55e"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%237c3aed"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="500" fill="url(%23qa1)"/%3E%3Cg opacity="0.2"%3E%3Cg transform="translate(200, 150)"%3E%3Crect width="180" height="180" fill="none" stroke="white" stroke-width="2" rx="4"/%3E%3Cline x1="10" y1="50" x2="170" y2="50" stroke="white" stroke-width="1.5"/%3E%3Cline x1="10" y1="80" x2="170" y2="80" stroke="white" stroke-width="1.5"/%3E%3C/g%3E%3Cg transform="translate(450, 150)"%3E%3Crect width="180" height="180" fill="none" stroke="white" stroke-width="2" rx="4"/%3E%3Cline x1="10" y1="50" x2="170" y2="50" stroke="white" stroke-width="1.5"/%3E%3Cline x1="10" y1="80" x2="170" y2="80" stroke="white" stroke-width="1.5"/%3E%3C/g%3E%3C/g%3E%3Ctext x="400" y="80" font-size="56" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif"%3EQuality%3C/text%3E%3Ctext x="400" y="150" font-size="56" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif"%3EAutomation%3C/text%3E%3Ctext x="400" y="420" font-size="36" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="sans-serif"%3EInspection Reports • Automatic Verification%3C/text%3E%3Ctext x="400" y="470" font-size="28" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="sans-serif"%3EZero Discrepancies to Shipment%3C/text%3E%3C/svg%3E',
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
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"%3E%3Cdefs%3E%3ClinearGradient id="transcript1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%230055ff"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%237c3aed"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="500" fill="url(%23transcript1)"/%3E%3Cg opacity="0.2"%3E%3Crect x="180" y="100" width="440" height="280" fill="white" rx="4"/%3E%3Cline x1="220" y1="150" x2="580" y2="150" stroke="white" stroke-width="2"/%3E%3Cline x1="220" y1="190" x2="580" y2="190" stroke="white" stroke-width="1.5"/%3E%3Cline x1="220" y1="230" x2="580" y2="230" stroke="white" stroke-width="1.5"/%3E%3Cline x1="220" y1="270" x2="580" y2="270" stroke="white" stroke-width="1.5"/%3E%3Cline x1="220" y1="310" x2="580" y2="310" stroke="white" stroke-width="1.5"/%3E%3C/g%3E%3Ctext x="400" y="80" font-size="56" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif"%3ETranscript%3C/text%3E%3Ctext x="400" y="150" font-size="56" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif"%3EAutomation%3C/text%3E%3Ctext x="400" y="420" font-size="36" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="sans-serif"%3ECourse Equivalency • Transfer Admissions%3C/text%3E%3Ctext x="400" y="470" font-size="28" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="sans-serif"%3EFaster Processing for Higher Education%3C/text%3E%3C/svg%3E',
  },
  {
    slug: 'ppap-automotive-compliance',
    featured: true,
    type: 'case-study',
    category: 'ap',
    categoryLabel: 'AP Automation',
    tag: 'Automotive Compliance',
    title: 'PPAP Processing at Scale: Tier-1 Automotive Supplier Case Study',
    description:
      'How a Tier-1 supplier automated PPAP (Production Part Approval Process) documentation review across 50+ supplier submissions per month, reducing approval time from 5 days to 2 hours.',
    author: 'Star Software Case Study Team',
    date: '2026-08-10',
    readMinutes: 9,
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"%3E%3Cdefs%3E%3ClinearGradient id="ppap1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23dc2626"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%230055ff"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="500" fill="url(%23ppap1)"/%3E%3Cg opacity="0.2"%3E%3Crect x="100" y="140" width="150" height="150" fill="white" rx="4"/%3E%3Ctext x="175" y="215" font-size="32" text-anchor="middle" fill="white" font-family="sans-serif"%3E50+%3C/text%3E%3Crect x="325" y="140" width="150" height="150" fill="white" rx="4"/%3E%3Ctext x="400" y="215" font-size="32" text-anchor="middle" fill="white" font-family="sans-serif"%3E5 days%3C/text%3E%3Crect x="550" y="140" width="150" height="150" fill="white" rx="4"/%3E%3Ctext x="625" y="215" font-size="32" text-anchor="middle" fill="white" font-family="sans-serif"%3E2 hrs%3C/text%3E%3C/g%3E%3Ctext x="400" y="80" font-size="56" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif"%3EPPAP%3C/text%3E%3Ctext x="400" y="150" font-size="56" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif"%3ECase Study%3C/text%3E%3Ctext x="400" y="420" font-size="36" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="sans-serif"%3E50+ Submissions • Tier-1 Supplier%3C/text%3E%3Ctext x="400" y="470" font-size="28" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="sans-serif"%3E5 Days → 2 Hours of Processing%3C/text%3E%3C/svg%3E',
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
