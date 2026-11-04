import { Icon } from './icons';

// The campaign page's footer: the company, then its office, phone and email
// in three cards. Text only, no links.
export default function CampaignFooter({ company }) {
  const contact = [
    ['pin', 'Office', company.address],
    ['phone', 'Phone', company.phone],
    ['mail', 'Email', company.mail],
  ];
  return (
    <footer className="mc-footer">
      <div className="wrap mc-footer-in">
        <div className="mc-footer-brand">
          <span className="mc-footer-mark" aria-hidden="true" />
          <p>
            <b>{company.name}</b>
            <span>{company.line}</span>
          </p>
        </div>
        <address className="mc-footer-contact">
          <ul>
            {contact.map(([icon, label, value]) => (
              <li key={label}>
                <span className="mc-footer-ic">
                  <Icon name={icon} />
                </span>
                <p>
                  <small>{label}</small>
                  <span>{value}</span>
                </p>
              </li>
            ))}
          </ul>
        </address>
      </div>
    </footer>
  );
}
