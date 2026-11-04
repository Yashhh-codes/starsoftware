import FaqSection from '../FaqSection';

// The Resources page's FAQ section, opening on MTR automation, with "Talk
// to our team" emailing the team. Its own styles load with it; the hub's
// heading and button styles it relies on are copied into MtrCampaign.css.
export default function CampaignFaq({ helpHref }) {
  return (
    <div className="sec sec-soft mc-faq">
      <div className="wrap">
        <FaqSection defaultCategory="mtr" helpHref={helpHref} />
      </div>
    </div>
  );
}
