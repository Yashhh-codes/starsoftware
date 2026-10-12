// PLACEHOLDER CONTENT — replace with real whitepapers before launch.
// Titles, summaries and highlights are topic outlines only: no statistics or
// claims have been invented. `file` is the PDF's public URL (for example
// '/whitepapers/ap-automation-playbook.pdf' served from public/); while it is
// null the download button stays disabled.
export const WHITEPAPERS = [
  {
    id: 'ap-automation-playbook',
    category: 'AP Automation',
    title: 'The Enterprise Playbook for Accounts Payable Automation',
    summary:
      'A practical framework for moving invoice capture, PO matching and approval routing from manual queues into automated workflows.',
    highlights: [
      'How to sequence an AP automation rollout',
      'Where three-way matching breaks down, and how to handle exceptions',
      'A checklist for evaluating extraction accuracy',
    ],
    tone: 'indigo',
    file: null,
  },
  {
    id: 'coa-validation-guide',
    category: 'CoA Automation',
    title: 'Automating Certificate of Analysis Validation',
    summary:
      'How quality teams can verify supplier CoAs against specifications automatically, without slowing goods receipt.',
    highlights: [
      'Mapping CoA fields to your material specifications',
      'Designing tolerance rules and approval thresholds',
      'Building an audit trail for every certificate',
    ],
    tone: 'teal',
    file: null,
  },
  {
    id: 'mtr-extraction-guide',
    category: 'MTR Automation',
    title: 'From PDF to ERP: Extracting Mill Test Report Data at Scale',
    summary:
      'An implementation guide for steel distributors digitising heat numbers, chemistry and mechanical properties from MTRs.',
    highlights: [
      'Handling mill-specific MTR layouts',
      'Validating chemistry and mechanical values against grade standards',
      'Pushing verified data into your ERP',
    ],
    tone: 'amber',
    file: null,
  },
];
