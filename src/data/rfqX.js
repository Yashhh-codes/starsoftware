// The redesigned RFQ to quote page's new sections (src/components/rfqx).
// The hero, "Processes & industries" and the FAQ keep their copy in
// rfqLanding.js; the facts here follow it (RFQ-2291, Northline
// Fabrication, drawing 1047 Rev C, the three risks, the 71 score).

// The investigation, told in four stages. Each stage is
// [number, name, what happens].
export const R_INVESTIGATE = {
  label: 'How Star investigates',
  title: 'One RFQ package, read the way',
  accent: 'your best estimator would.',
  lead: '22 drawings, a BOM, a 187-page specification and the email instructions arrive together. Star’s agents read them together, cross-check them, and hand your team a conditional quote with every open question named.',
  rfq: ['RFQ-2291', 'Northline Fabrication', 'Due Fri 14:00'],
  package: [
    ['Drawings', '22 sheets', 'PDF / DWG', 'drawing'],
    ['BOM', '43 line items', 'XLSX', 'sheet'],
    ['Specification', '187 pages', 'PDF', 'book'],
    ['Email', 'Instructions', 'RFQ', 'mail'],
  ],
  stages: [
    ['01', 'Intake', 'The package is opened, split and organized'],
    ['02', 'Investigate', 'Four agents read it side by side'],
    ['03', 'Flag', 'Conflicts and gaps are routed to people'],
    ['04', 'Build', 'Cost, price, then a conditional quote'],
  ],
  intake: [
    ['Customer', 'Northline Fabrication', 'Found in ERP'],
    ['Due date', 'Fri 14:00', 'From the email'],
    ['Line items', '43 parts', 'BOM ↔ drawings'],
    ['Revisions', '2 detected', 'Drawings 1047, 1112'],
    ['Missing', 'NDT cost', 'Spec 4.3.2'],
  ],
  agents: [
    ['Drawing agent', 'drawing', ['43 parts found', '2 revisions detected', 'Tolerances and features extracted']],
    ['Specification agent', 'book', ['14 applicable clauses', 'NDT, coating and inspection mapped to parts']],
    ['ERP agent', 'erp', ['Customer and labor rates loaded', 'Material costs and work centers matched']],
    ['Historical quote agent', 'history', ['Similar job quoted 6 months ago', 'A572-50 · result: won']],
  ],
  risks: [
    ['Revision conflict', 'Drawing 1047 is Rev C; the specification cites Rev B', 'Engineering', 'bad'],
    ['Missing NDT cost', 'Specification requires NDT, no cost included', 'Costing', 'warn'],
    ['Expired supplier price', 'The galvanizer’s quote expired last month', 'Supplier agent', 'warn'],
  ],
  build: [
    ['Cost model', 'Material + labor + outside processing + inspection + overhead', '$134,900'],
    ['Price model', 'Customer terms and your margin rules applied', '$179,150'],
    ['Conditional quote', '3 items to resolve before it goes out', 'Ready'],
  ],
};

// One part, from the drawing to its costed line. Callouts are
// [mark, what the agent read, where it lands]; x and y place the mark on
// the drawing (percent of its box).
export const R_DRAWING = {
  label: 'Drawing to cost',
  title: 'Every note on the drawing',
  accent: 'ends up in the price.',
  lead: 'Missed notes are where margins leak: a weld callout, a galvanize note, an inspection clause buried in the spec. Star reads each one, ties it to an operation, and prices it with your rates.',
  part: ['DWG 1047', 'Rev C', 'Base plate bracket', 'Qty 40'],
  callouts: [
    ['1', 'ASTM A572 Gr. 50, ¾″ plate', 'Material', 75, 30],
    ['2', '6 × Ø22 holes', 'Laser cut and drill', 65, 22],
    ['3', 'Fillet weld, both sides', 'Weld labor', 87, 60],
    ['4', 'Hot-dip galvanize', 'Outside processing', 11, 63],
    ['5', 'MT per spec 4.3.2', 'Inspection (NDT)', 42, 95],
  ],
  // [operation, $ per part, mark it came from, flagged by Star]
  costs: [
    ['Material', 48.2, '1'],
    ['Laser cut and drill', 22.6, '2'],
    ['Weld labor', 31.8, '3'],
    ['Galvanizing (outside)', 14.5, '4'],
    ['NDT inspection', 6.9, '5', true],
    ['Overhead (18%)', 22.4, ''],
  ],
  margin: 0.247,
  qty: 40,
  note: 'NDT was in the specification, not on the drawing. Without it, this line is under-quoted on every part.',
};

// The radar's six checks: [area, status, risk 0..1, findings, routed to,
// ok | warn | bad].
export const R_RADAR = {
  label: 'Quote risk radar',
  title: 'Know what could hurt the quote',
  accent: 'before the customer does.',
  lead: 'Six checks run on every RFQ. Each one is scored, and anything that needs a person goes to the right one, with the evidence attached.',
  score: 71,
  items: [
    ['Material', 'Low risk', 0.22, 'ASTM A572 Gr. 50 · current price · 2-week lead time', '', 'ok'],
    ['Drawing', 'Verified', 0.18, 'Drawing 1047 Rev C · features extracted · process identified', '', 'ok'],
    ['Specification', 'Conflict', 0.92, 'Spec references Rev B, drawing shows Rev C', 'Customer clarification', 'bad'],
    ['Inspection', 'High risk', 0.84, 'NDT required per spec · no cost included', 'Supplier quote', 'bad'],
    ['Outside process', 'Review', 0.58, 'Galvanizing required · supplier quote expired', 'New quote requested', 'warn'],
    ['Margin', 'On target', 0.24, 'Estimated 24.7% against a 20% target', '', 'ok'],
  ],
  verdict: ['Human review required', '3 items need resolution before the final quote can be sent.'],
};

export const R_ROI = {
  label: 'RFQ automation ROI',
  title: 'More capacity, faster response,',
  accent: 'stronger margins.',
  lead: 'The same estimators quote more of what comes in, answer first, and stop leaving costs off the page.',
  // [value to count to, prefix, suffix, label, text]
  stats: [
    [60, '', '%', 'Estimator capacity', 'Less manual work on RFQ analysis and data extraction'],
    [3, '2–', '×', 'More RFQs quoted', 'Quote more opportunities with the same team'],
    [90, '70–', '%', 'Faster response', 'Quote cycle time from days to hours'],
    [5, '+2–', '%', 'Margin protection', 'Missing costs and requirements caught before you quote'],
  ],
  benchmarks: [
    [40, 'of B2B buyers cite slow response time as their biggest frustration'],
    [19, 'cite pricing as their biggest frustration'],
  ],
  benchmarkSource: 'McKinsey & Company B2B Pulse Survey, 2022',
  quote: 'Fast, accurate quoting directly increases your win rate.',
  annualWage: 75940,
  reduction: 0.6,
  exampleSource:
    'Source: U.S. Bureau of Labor Statistics, May 2025. Median annual wage for cost estimators (manufacturing): $75,940. Illustrative, labor costs only. Actual results may vary.',
};

export const R_CONTACT = {
  label: 'Try it on your RFQ',
  title: 'What would Star find',
  accent: 'in your next RFQ?',
  text: 'Send one RFQ package: the email, drawings and specification. We’ll walk you through the parts, requirements and risks Star finds, and the quote it would prepare.',
  steps: [
    ['Send one package', 'Email, drawings, spec: as your customer sent it'],
    ['We run it through Star', 'Parts, requirements, risks and a cost model'],
    ['You get a walkthrough', '30 minutes, on your own documents'],
  ],
};
