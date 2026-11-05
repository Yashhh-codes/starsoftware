import Statement from '../mtr-campaign/Statement';
import { Icon } from '../mtr-campaign/icons';

// The questions as native disclosures, the first one open.
export default function RfqFaq({ faq }) {
  return (
    <section className="sec" id="faq">
      <div className="wrap mf-grid">
        <div>
          <Statement text={[faq.heading]} small />
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
