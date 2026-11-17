import FaqSection from './FaqSection';
import './PageFaq.css';
import './PageFaqScope.css';

// A page's FAQ in the Resources page's design: the page's own questions
// under one topic, "Show all" for the rest, and the help card linking to
// the full FAQ in the resources section. Its own wrapper carries the
// design tokens, so it looks the same on any page.
export default function PageFaq({ items, topicLabel, lede, heading, moreHref = '/resources#faqs', sectionId = 'faq', className = '' }) {
  return (
    // The id ranks the FAQ's own styles above the page's (PageFaqScope.css).
    <div id="page-faq-scope" className={`page-faq ${className}`}>
      <div className="page-faq-wrap">
        <FaqSection
          items={items}
          topicLabel={topicLabel}
          lede={lede || `Common questions about ${topicLabel}, answered by the Star Software team.`}
          heading={heading}
          moreHref={moreHref}
          sectionId={sectionId}
        />
      </div>
    </div>
  );
}

// Plain-text answers as HTML paragraphs.
const escape = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const textToHtml = (text) =>
  String(text)
    .split(/\n{2,}/)
    .map((p) => `<p>${escape(p.trim())}</p>`)
    .join('');
