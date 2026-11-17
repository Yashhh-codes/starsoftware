import PageFaq from '../PageFaq';

// The page's FAQ in the shared design, its help card linking to the full
// FAQ in Resources.
export default function RfqFaq({ faq }) {
  return (
    <PageFaq
      className="rq-faq"
      items={faq.items}
      topicLabel="RFQ to quote"
      heading={faq.heading}
      lede="How Star's AI agents read RFQ packages, find the risks and help your team build the quote."
      moreHref="/resources#faqs"
    />
  );
}
