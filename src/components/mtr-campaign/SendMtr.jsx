import Statement from './Statement';
import { Icon } from './icons';

// The closing offer: email the certificates that give you the most trouble,
// or call, and what comes back; or ask for the checklist instead. These are
// the page's only links out.
export default function SendMtr({ send }) {
  return (
    <section className="sec sec-dark mc-send" id="send">
      <div className="wrap mc-send-grid">
        <div className="mc-send-copy">
          <Statement text={send.heading} />
          <p className="mc-send-text">{send.text}</p>
          <div className="mc-send-actions">
            {send.actions.map((action) => (
              <a key={action.href} className={`btn btn-lg ${action.primary ? 'btn-primary' : 'mc-btn-dark'}`} href={action.href}>
                <Icon name={action.icon} className="mc-send-ic" />
                {action.label}
              </a>
            ))}
          </div>
          <p className="mc-send-note">{send.note}</p>
        </div>

        <div className="mc-send-card">
          <p className="mc-send-k">{send.returnsTitle}</p>
          <ul className="mc-send-list">
            {send.returns.map((item) => (
              <li key={item}>
                <span className="mc-vs-mark">
                  <Icon name="check" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mc-send-ps">
            <p>{send.checklist.text}</p>
            <a className="link" href={send.checklist.cta.href}>
              {send.checklist.cta.label}
              <Icon name="arr" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
