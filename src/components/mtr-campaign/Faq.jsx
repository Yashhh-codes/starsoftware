import { Link } from 'react-router-dom';
import Statement from './Statement';
import { Icon } from './icons';

// The questions as native disclosures, the first one open. Answers are the
// FAQ library's HTML.
export default function Faq({ faq }) {
  return (
    <section className="sec" id="faq">
      <div className="wrap mf-grid">
        <div>
          <Statement text={[faq.heading]} small />
          <p className="mf-more">
            {faq.links.map(([label, href]) =>
              href.startsWith('/') ? (
                <Link key={href} className="link" to={href}>
                  {label}
                  <Icon name="arr" />
                </Link>
              ) : (
                <a key={href} className="link" href={href}>
                  {label}
                  <Icon name="arr" />
                </a>
              )
            )}
          </p>
        </div>
        <div className="mf-list">
          {faq.items.map((item, i) => (
            <details key={item.id} open={i === 0}>
              <summary>
                {item.question}
                <Icon name="plus" />
              </summary>
              <div className="mf-a" dangerouslySetInnerHTML={{ __html: item.html }} />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
