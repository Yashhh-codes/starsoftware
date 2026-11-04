import Statement from './Statement';
import { Icon } from './icons';

// Digitized only against intelligent MTRs, side by side, with an arrow from
// one to the other.
function Side({ side, kind }) {
  return (
    <article className={`mc-vs-card is-${kind}`}>
      <p className="mc-vs-k">{side.label}</p>
      <h3>{side.title}</h3>
      <ul className="mc-vs-list">
        {side.items.map((item) => (
          <li key={item}>
            <span className="mc-vs-mark">
              <Icon name={kind === 'after' ? 'check' : 'x'} />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Comparison({ comparison }) {
  return (
    <section className="sec sec-soft mc-vs" id="intelligent">
      <div className="wrap">
        <Statement text={comparison.heading} />
        <div className="mc-vs-grid">
          <Side side={comparison.before} kind="before" />
          <span className="mc-vs-arrow" aria-hidden="true">
            <Icon name="right" />
          </span>
          <Side side={comparison.after} kind="after" />
        </div>
      </div>
    </section>
  );
}
