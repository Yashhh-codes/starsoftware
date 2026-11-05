// RFQ to quote page (/rfq-to-quote): the redesigned site's RFQ to quote
// page (star-software-site.vercel.app/rfq-to-quote), copy as it is there.
// Icons are named from the sprite in components/mtr-campaign/icons.jsx.

// The chapters of the sticky "On this page" bar, by section id.
export const CHAPTERS = [
  ['investigation', 'How Star investigates'],
  ['radar', 'Quote risk radar'],
  ['roi', 'ROI'],
  ['faq', 'FAQ'],
  ['contact', 'Try it on your RFQ'],
];

export const HERO = {
  kicker: 'RFQ to quote automation',
  title: ['Turn complex RFQs into production-ready quotes', 'with AI agents.'],
  text: "Star's AI agents read the email, engineering drawings, technical specifications, BOMs, spreadsheets and supporting documents together, identifying what needs to be made, how it needs to be made, what requirements apply, what information is missing and what could put your margin at risk. Then Star helps your team build the quote.",
  // The steps the strip under the buttons runs through.
  flow: ['RFQ', 'Requirements', 'BOM', 'Process', 'Cost', 'Risk', 'Quote'],
};

// The hero's picture: an RFQ received, the bots at work, the quote sent
// first, and what that does for the team.
export const WIN = {
  bots: ['Reads every drawing', 'Builds the full BOM', 'Prices with your rules'],
  wins: ['No re-keying', 'No missed parts', 'No margin leaks'],
};

// The live investigation of one RFQ package. Inputs are [count, name,
// format, icon, colour]; agents [name, findings, icon, colour]; risks
// [title, detail, routed to, severity].
export const INVESTIGATION = {
  heading: ['Live AI investigation: a real complex RFQ.', "22 drawings, a BOM, a 187-page specification and email instructions, investigated by Star's AI agents."],
  inputs: [
    ['22', 'Drawings', 'PDF / DWG', 'doc', '#493ee5'],
    ['1', 'BOM', 'XLSX', 'list', '#0e7a55'],
    ['187-page', 'Specification', 'PDF', 'book', '#c0264a'],
    ['RFQ', 'Email and instructions', '', 'mail', '#2160D9'],
  ],
  intake: ['RFQ intake agent', '26 files · 43 line items organized', 'Customer · Due date · Revisions · Missing items'],
  agents: [
    ['Drawing agent', ['43 parts found', '2 revisions detected', 'Key features and tolerances extracted'], 'doc', '#2160D9'],
    ['Specification agent', ['14 applicable clauses', 'NDT, coating and inspection requirements mapped to parts'], 'book', '#635bff'],
    ['ERP agent', ['Customer found', 'Labor rates loaded', 'Material costs loaded', 'Work centers matched'], 'layers', '#0e7a55'],
    ['Historical quote agent', ['Similar job found', 'Quoted 6 months ago', 'Material: A572-50', 'Result: won'], 'pulse', '#d97706'],
  ],
  risks: [
    ['Revision conflict', 'Drawing 1047 Rev C, specification references Rev B', 'Engineering review', 'bad'],
    ['Missing NDT cost', 'Specification requires NDT, no cost included', 'Costing review', 'warn'],
    ['Expired supplier price', 'Material vendor quote has expired', 'Supplier agent', 'warn'],
  ],
  model: [
    ['Cost model', 'Material + labor + outside processing + inspection + overhead'],
    ['Price model', 'Applies customer terms and margin rules'],
    ['Quote ready', 'Conditional quote prepared, 3 items require resolution'],
  ],
};

// The radar's checks, as [area, status, findings, ok | warn | bad].
export const RADAR = {
  heading: ['Quote risk radar.', 'AI checks every requirement, finds the risks, and tells you exactly what needs attention before the quote goes out.'],
  score: 71,
  items: [
    ['Material', 'Low risk', ['ASTM A572 Grade 50', 'Current price found', 'Lead time: 2 weeks'], 'ok'],
    ['Drawing', 'Verified', ['Drawing 1047 Rev C', 'Key features extracted', 'Manufacturing process identified'], 'ok'],
    ['Specification', 'Conflict', ['Rev B referenced', 'Drawing shows Rev C', 'Requires customer clarification'], 'bad'],
    ['Inspection', 'High risk', ['NDT required per specification', 'No cost included', 'Requires supplier quote'], 'bad'],
    ['Outside process', 'Review', ['Galvanizing required', 'Supplier quote expired', 'New quote requested'], 'warn'],
    ['Margin', 'On target', ['Estimated margin: 24.7%', 'Target margin: 20%', 'Within acceptable range'], 'ok'],
  ],
  verdict: ['Human review required', '3 items need resolution before the final quote can be sent.'],
};

export const ROI = {
  heading: ['RFQ automation ROI.', 'More capacity, faster response, and stronger margins.'],
  stats: [
    ['60%', 'Estimator capacity', 'Less manual work on RFQ analysis and data extraction', 'user'],
    ['2–3×', 'More RFQs quoted', 'Quote more opportunities with the same team', 'doc'],
    ['70–90%', 'Faster response', 'Reduce quote cycle time from days to hours', 'clock'],
    ['+2–5%', 'Margin protection', 'Catch missing costs and requirements before you quote', 'pulse'],
  ],
  benchmarks: [
    ['40%', 'of B2B buyers cite slow response time as their biggest frustration.'],
    ['19%', 'cite pricing as the biggest frustration.'],
  ],
  benchmarkSource: 'Source: McKinsey & Company B2B Pulse Survey, 2022',
  quote: 'Fast, accurate quoting directly increases your win rate.',
  // The calculator: an estimator's yearly wage, and the share of RFQ hours
  // Star takes off their plate.
  annualWage: 75940,
  reduction: 0.6,
  exampleSource:
    'Source: U.S. Bureau of Labor Statistics, May 2025. Median annual wage for cost estimators (manufacturing): $75,940. Illustrative example, labor costs only. Actual results may vary.',
};

const para = (text) => `<p>${text}</p>`;
const list = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;

export const FAQ = {
  heading: 'Questions about RFQ to quote automation',
  items: [
    ['rfq-1', 'What is RFQ-to-quote automation?', para('RFQ-to-quote automation uses AI and workflow automation to streamline the process of converting customer Requests for Quotation (RFQs) into structured, costed quotes. It helps manufacturers analyze RFQ emails, engineering drawings, bills of materials (BOMs), technical specifications and supporting documents, extract relevant requirements, estimate costs and prepare quotations with less manual effort.')],
    ['rfq-2', 'How does AI automate the RFQ analysis process?', para("AI agents analyze incoming RFQ packages to identify customer requirements, product specifications, quantities, materials, manufacturing processes, delivery expectations and other critical details. Star's AI agents can process information across emails, drawings, spreadsheets and technical documents, organize the findings and highlight missing information or potential risks before the quotation is prepared.")],
    ['rfq-3', 'Can AI extract BOMs from engineering drawings and technical documents?', para("Yes. AI-powered document processing can identify part numbers, component descriptions, quantities, dimensions and other relevant information from supported engineering documents. Star's drawing and BOM analysis capabilities help organize these details into structured information that can be used during manufacturing cost estimation and quote preparation. Extraction capabilities depend on the drawing format and document quality.")],
    ['rfq-4', 'Can Star analyze multiple drawings and technical specifications within one RFQ?', para("Yes. Complex RFQs often contain multiple engineering drawings, technical specifications, BOMs, spreadsheets and email instructions. Star's AI agents can analyze these documents together, connect related information and organize requirements across the RFQ package. This helps estimators avoid reviewing each document in isolation and provides a more complete understanding of the job.")],
    ['rfq-5', 'Can RFQ automation detect drawing revision conflicts?', para('Yes. Star can identify revision references and compare relevant information across drawings, specifications and supporting documents. When conflicting revisions or inconsistent requirements are detected, the system can flag them for engineering or customer clarification before the quote is finalized.')],
    ['rfq-6', 'How does AI identify missing costs or requirements in a manufacturing quote?', para("Star's AI agents can analyze technical and commercial requirements to identify cost elements that may need attention. These can include raw materials, labor, machining operations, outside processing, inspection, non-destructive testing (NDT), coating, finishing and packaging. Missing or unconfirmed cost inputs can be flagged for review to help prevent underquoting.")],
    ['rfq-7', 'Can RFQ automation use historical quotes to improve cost estimation?', para('Yes. Historical quotation data can provide valuable references when estimating new jobs. Where connected and configured, Star can retrieve relevant historical quotes, compare similar parts or jobs, and use available material costs, labor rates, processing information and previous pricing as inputs for quote preparation. Final estimates remain subject to current pricing and business rules.')],
    ['rfq-8', 'Can Star calculate manufacturing costs and prepare customer quotations?', para("Star can help structure the costing process by bringing together material costs, labor, manufacturing operations, outside processing, inspection expenses, overheads and configured pricing rules. It can then support the preparation of a structured quotation for review. Final pricing can follow your organization's margin policies, approval thresholds and commercial terms.")],
    ['rfq-9', 'How does RFQ automation help manufacturers protect profit margins?', para('Incomplete RFQ analysis can result in missed operations, overlooked inspection requirements, outdated supplier prices and underestimated material or labor costs. Star helps identify these potential gaps before the quote is issued. By bringing technical requirements and cost inputs into one workflow, manufacturers can make more informed pricing decisions and reduce avoidable margin leakage.')],
    ['rfq-10', 'Can RFQ automation handle incomplete or ambiguous customer requirements?', para('Yes. Star can identify missing specifications, unclear instructions, conflicting document references and incomplete cost inputs. Instead of treating uncertain information as confirmed, the workflow can flag these issues and route them to engineering, procurement or costing teams for clarification before the quotation is finalized.')],
    ['rfq-11', 'Can AI automate the entire quotation process without human involvement?', para('AI can automate significant parts of RFQ intake, document analysis, data extraction, requirement mapping, cost preparation and quotation generation. However, complex engineering decisions, unresolved technical conflicts, commercial approvals and final pricing decisions may still require human involvement. Star supports a human-in-the-loop approach, allowing teams to review exceptions and approve quotations before they are sent to customers.')],
    [
      'rfq-12',
      'Which industries benefit from RFQ-to-quote automation?',
      para('RFQ-to-quote automation is particularly useful for industries that handle complex technical requirements and multi-component quotations. Common applications include:') +
        list([
          '<strong>Metal fabrication:</strong> Sheet metal, structural steel and custom fabrication.',
          '<strong>Machining and CNC manufacturing:</strong> Precision components and engineered parts.',
          '<strong>Industrial manufacturing:</strong> Custom equipment, assemblies and machinery.',
          '<strong>Automotive and aerospace:</strong> Component manufacturing and specification-driven quotations.',
          '<strong>Oil and gas:</strong> Industrial equipment, piping and engineered components.',
          '<strong>Construction and engineering:</strong> Fabricated structures, materials and project-based RFQs.',
        ]),
    ],
  ].map(([id, question, html]) => ({ id, question, html })),
};

// The closing section and its sample form. Sending opens the visitor's
// email app addressed to the team, with the details filled in; the file
// is attached there.
export const CONTACT = {
  heading: 'What would Star find in your next RFQ?',
  text: 'Send one RFQ package: the email, drawings and specification. We’ll walk you through the parts, requirements and risks Star finds, and the quote it would prepare.',
  demoUrl: 'https://starsoftware.co/contact/',
  mail: 'info@starsoftware.co',
  doctype: 'RFQ or drawing',
  doctypes: ['Mill test report (MTR)', 'Certificate of analysis (COA)', 'Invoice', 'RFQ or drawing', 'Other'],
};
