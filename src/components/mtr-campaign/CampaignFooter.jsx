import { Icon } from './icons';

// The campaign page's footer: the company, then its office and email in two
// cards. The email card opens a new email; the office is text.
export default function CampaignFooter({ company }) {
  const contact = [
    ['pin', 'Office', company.address],
    ['mail', 'Email', company.mail, company.mailHref],
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
            {contact.map(([icon, label, value, href]) => {
              const body = (
                <>
                  <span className="mc-footer-ic">
                    <Icon name={icon} />
                  </span>
                  <p>
                    <small>{label}</small>
                    <span>{value}</span>
                  </p>
                  {href && <Icon name="arr" className="mc-footer-go" />}
                </>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a className="mc-footer-card is-link" href={href}>
                      {body}
                    </a>
                  ) : (
                    <div className="mc-footer-card">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </address>
      </div>
    </footer>
  );
}
