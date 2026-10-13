// The "Star Software for this" card beside each article, chosen by the
// article's category so every new article gets a matching card without any
// per-article setup. Links go to the demo request until product pages exist.
export const ARTICLE_PROMOS = {
  ap: {
    title: 'Invoice and AP automation',
    description:
      'Header fields and every line item from any invoice layout, matched to the PO and GRN, with only the exceptions left for your team.',
  },
  ar: {
    title: 'AR and remittance automation',
    description:
      'Remittances, payment advices and credit documents read and matched to open invoices, so cash posts the same day.',
  },
  coa: {
    title: 'CoA extraction and validation',
    description:
      'Every test result on a Certificate of Analysis read and checked against your specs, with out-of-range values flagged before release.',
  },
  mtr: {
    title: 'MTR extraction and validation',
    description:
      'Heat numbers, chemistry and mechanical results pulled from any mill format and checked against ASTM and ASME limits.',
  },
  qa: {
    title: 'Quality document automation',
    description:
      'Inspection reports and quality records read, verified and filed, with discrepancies caught before shipment.',
  },
  transcript: {
    title: 'Transcript processing',
    description:
      'Courses, grades and credits read from any institution’s transcript and mapped to your equivalency rules.',
  },
};

export const DEFAULT_PROMO = {
  title: 'Document automation',
  description:
    'Extraction, validation and workflow automation for the documents your teams still key in by hand.',
};

export const PROMO_LINK = '/#demo';

export function getArticlePromo(category) {
  return ARTICLE_PROMOS[category] || DEFAULT_PROMO;
}
