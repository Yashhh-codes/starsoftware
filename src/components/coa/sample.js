// The supplier COA the COA page's illustrations share (the hero, the
// workflow cards and the exception review), checked against a buyer's
// product specification. Product, limits and results are made up for the
// illustration; there is no customer data in them.

export const PRODUCT = 'Citric acid, anhydrous';
export const SPEC = 'Spec PS-104';

// `limit` is the supplier's own, as printed on its certificate, which
// marks every result as conforming; `req` is the buyer's. Water passes the
// supplier's limit but not the buyer's, and iron is in the buyer's
// specification but not on the certificate at all.
export const TESTS = [
  { key: 'assay', test: 'Assay', limit: '99.5–100.5 %', value: '99.7 %', req: '99.5–100.5 %', tone: 'ok' },
  { key: 'water', test: 'Water (KF)', limit: '≤ 1.0 %', value: '0.62 %', req: '≤ 0.50 %', tone: 'range' },
  { key: 'ash', test: 'Sulfated ash', limit: '≤ 0.05 %', value: '0.03 %', req: '≤ 0.05 %', tone: 'ok' },
  { key: 'pb', test: 'Lead (Pb)', limit: '≤ 0.5 ppm', value: '0.2 ppm', req: '≤ 0.5 ppm', tone: 'ok' },
  { key: 'fe', test: 'Iron (Fe)', value: null, req: '≤ 5 ppm', tone: 'missing' },
];

export const ON_CERTIFICATE = TESTS.filter((t) => t.value);
