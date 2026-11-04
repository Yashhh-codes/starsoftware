import FaqSection from '../FaqSection';

// Kept outside the component so the section sees the same list each render.
const TOPICS = ['mtr'];

// The Resources page's FAQ section, with only its MTR automation topic and
// "Talk to our team" emailing the team. Its own styles load with it; the
// hub's heading and button styles it relies on are copied into
// MtrCampaign.css.
export default function CampaignFaq({ faq }) {
  return (
    <div className="sec sec-soft mc-faq">
      <div className="wrap">
        <FaqSection topics={TOPICS} helpHref={faq.help} lede={faq.lede} />
      </div>
    </div>
  );
}
