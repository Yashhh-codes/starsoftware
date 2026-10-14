// The navbar's Resources dropdown. Blog topics deep-link into the hub's
// filters; items that are their own pages on starsoftware.co (case studies,
// success stories, FAQs, the QA resource center, MTR insights) link there,
// as WordPress has no posts to filter to for them. Full URLs open as
// ordinary links; paths go through the router.
// The other FAQ sub-items have no page of their own, so they point at the
// matching article topic.
export const RESOURCE_LINKS = [
  {
    label: 'Blogs',
    to: '/resources?type=guide',
    children: [
      { label: 'AP Automation', to: '/resources?type=guide&category=ap' },
      { label: 'AR Automation', to: '/resources?type=guide&category=ar' },
      { label: 'CoA Automation', to: '/resources?type=guide&category=coa' },
      { label: 'MTR Automation', to: '/resources?type=guide&category=mtr' },
      { label: 'Transcript Automation', to: '/resources?type=guide&category=transcript' },
      { label: 'Others', to: '/resources?type=guide' },
    ],
  },
  {
    label: 'FAQs | Frequently Asked Questions',
    to: 'https://starsoftware.co/faqs-frequently-asked-questions/',
    children: [
      { label: 'Invoice Automation', to: '/resources?category=ap' },
      { label: 'MTR Automation', to: '/resources?category=mtr' },
      { label: 'Transcript Processing', to: '/resources?category=transcript' },
      { label: 'MTR Automation Insights', to: 'https://starsoftware.co/mtr-automaton-insights/' },
    ],
  },
  { label: 'Case Study', to: 'https://starsoftware.co/case-studies/' },
  { label: 'Success Story', to: 'https://starsoftware.co/success-story/' },
  { label: 'QA Engineering Resource Center', to: 'https://starsoftware.co/qa-engineering-resource-center/' },
  { label: 'Whitepapers', to: '/resources#whitepapers' },
];
