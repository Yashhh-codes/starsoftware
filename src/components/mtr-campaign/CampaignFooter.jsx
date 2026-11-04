// The campaign page's footer: the company and how to reach it, as text, no
// links.
export default function CampaignFooter({ company }) {
  return (
    <footer className="mc-footer">
      <div className="wrap mc-footer-in">
        <p className="mc-footer-brand">
          <b>{company.name}</b>
          <span>{company.line}</span>
        </p>
        <address className="mc-footer-contact">
          <span>{company.address}</span>
          <span>
            {company.phone}
            <i aria-hidden="true">·</i>
            {company.mail}
          </span>
        </address>
      </div>
    </footer>
  );
}
