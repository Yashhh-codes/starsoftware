import Statement from '../mtr-campaign/Statement';
import { Icon } from '../mtr-campaign/icons';

const ICONS = { process: 'route', industry: 'factory' };

// What Star automates, by process and by industry, side by side. Every item
// is a disclosure; those in a column share a name, so opening one closes
// the one before and the section stays short. Shown above the list
// version (Coverage) while the two are compared.
export default function CoverageAccordion({ coverage }) {
  return (
    <section className="sec rq-cov" id="coverage">
      <div className="wrap">
        <Statement text={[coverage.title.join(' ')]} />
        <p className="rq-cov-lede">{coverage.text}</p>
        <div className="rq-cov-grid">
          {coverage.groups.map((group) => (
            <div key={group.id} className="rq-cov-col">
              <div className="rq-cov-head">
                <span className="rq-cov-ic" aria-hidden="true">
                  <Icon name={ICONS[group.id]} />
                </span>
                <div>
                  <h3>{group.title}</h3>
                  <p>{group.question}</p>
                </div>
              </div>
              <div className="rq-cov-list">
                {group.items.map(([title, text]) => (
                  <details key={title} name={`rq-cov-${group.id}`}>
                    <summary>
                      {title}
                      <Icon name="plus" />
                    </summary>
                    <p>{text}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
