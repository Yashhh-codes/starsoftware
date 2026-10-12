// Resource topics, shared by the navbar dropdown and the hub's quick links so
// the two can't drift apart. Destinations deep-link into the hub's filters.
// FAQs and Success Story have no dedicated pages yet, so they open the hub;
// FAQ sub-items point at the matching article category until FAQ content exists.
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
    to: '/resources',
    children: [
      { label: 'Invoice Automation', to: '/resources?category=ap' },
      { label: 'MTR Automation', to: '/resources?category=mtr' },
      { label: 'Transcript Processing', to: '/resources?category=transcript' },
      { label: 'MTR Automation Insights', to: '/resources?category=mtr' },
    ],
  },
  { label: 'Case Study', to: '/resources?type=case-study' },
  { label: 'Success Story', to: '/resources' },
  { label: 'QA Engineering Resource Center', to: '/resources?category=qa' },
  { label: 'Whitepapers', to: '/resources#whitepapers' },
];
