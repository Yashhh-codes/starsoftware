// Star Software's published results, shown as number cards on articles that
// don't state figures of their own, picked by the article's category (as in
// the reference design, where the cards are product results rather than
// figures from the post). Every figure is from starsoftware.co: the topic's
// product page, with homepage figures topping a topic up to three.
// Shown under a "Star Software by the numbers" label so they aren't read as
// claims made by the article.

const HOMEPAGE = {
  efficiency: { value: '95%', label: 'increase in manual data-entry efficiency' },
  errors: { value: '82%', label: 'decrease in manual document review errors' },
  costs: { value: '70%', label: 'reduction in operation costs' },
};

export const PRODUCT_STATS = {
  // starsoftware.co/ap-automation
  ap: [
    { value: '90%', label: 'decrease in human error' },
    { value: '85%', label: 'increase in overall AP efficiency' },
    { value: '99%', label: 'reduction in manual entry' },
  ],
  // starsoftware.co/ar-automation ("Almost 90%")
  ar: [
    { value: '~90%', label: 'auto lockbox matching with invoice and remittance' },
    HOMEPAGE.costs,
    HOMEPAGE.errors,
  ],
  // starsoftware.co/coa-automation ("save up to 70%")
  coa: [
    { value: 'Up to 70%', label: 'lower operational costs with automated CoA processing' },
    HOMEPAGE.efficiency,
    HOMEPAGE.errors,
  ],
  // starsoftware.co case study: Dover Tubular Alloys
  mtr: [
    { value: '90%', label: 'less MTR processing time at Dover Tubular Alloys' },
    HOMEPAGE.efficiency,
    HOMEPAGE.errors,
  ],
  // starsoftware.co/transcript-processing
  transcript: [
    { value: '68%', label: 'increase in enrollment speed' },
    { value: '96%', label: 'increase in workflow efficiency' },
    { value: '310%', label: 'return on investment' },
  ],
};

export const DEFAULT_PRODUCT_STATS = [HOMEPAGE.efficiency, HOMEPAGE.errors, HOMEPAGE.costs];

export const PRODUCT_STATS_LABEL = 'Star Software by the numbers';

export function getProductStats(category) {
  return PRODUCT_STATS[category] || DEFAULT_PRODUCT_STATS;
}
