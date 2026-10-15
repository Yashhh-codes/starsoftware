// The navbar's Resources dropdown. Blog topics deep-link into the hub's
// filters; FAQs, case studies / success stories and the QA resource center
// jump to their sections on the hub (?faq= and ?stories= preselect a
// filter there). Full URLs open as ordinary links; paths go through the
// router. MTR Automation Insights still lives on starsoftware.co.
export const RESOURCE_LINKS = [
  {
    label: 'Blogs',
    to: '/resources?type=guide#latest',
    children: [
      { label: 'AP Automation', to: '/resources?type=guide&category=ap#library' },
      { label: 'AR Automation', to: '/resources?type=guide&category=ar#library' },
      { label: 'CoA Automation', to: '/resources?type=guide&category=coa#library' },
      { label: 'MTR Automation', to: '/resources?type=guide&category=mtr#library' },
      { label: 'Transcript Automation', to: '/resources?type=guide&category=transcript#library' },
      // Posts filed under no automation topic ("Industry & Trends" in the hub).
      { label: 'Others', to: '/resources?type=guide&category=others#library' },
    ],
  },
  {
    label: 'FAQs | Frequently Asked Questions',
    to: '/resources#faqs',
    children: [
      { label: 'Invoice Automation', to: '/resources?faq=invoice#faqs' },
      { label: 'MTR Automation', to: '/resources?faq=mtr#faqs' },
      { label: 'Transcript Processing', to: '/resources?faq=transcript#faqs' },
      { label: 'MTR Automation Insights', to: 'https://starsoftware.co/mtr-automaton-insights/' },
    ],
  },
  { label: 'Case Study', to: '/resources?stories=case-study#stories' },
  { label: 'Success Story', to: '/resources?stories=success-story#stories' },
  { label: 'QA Engineering Resource Center', to: '/resources#qa-center' },
  { label: 'Comparison Sheets', to: '/resources#comparisons' },
  { label: 'Whitepapers', to: '/resources#whitepapers' },
];
