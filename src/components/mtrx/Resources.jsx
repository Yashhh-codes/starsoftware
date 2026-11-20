import { ArrowRight, Download } from 'lucide-react';
import { X_RESOURCES } from '../../data/mtrX';
import SecHead from './SecHead';

// A cover drawn for each resource, in its own tone.
function Cover({ item, i }) {
  if (i === 0)
    return (
      <div className="mxr-cover mxr-cover--guide" aria-hidden="true">
        <span className="mxr-book">
          <small>Buyer’s guide</small>
          <b>MTR &amp; COA automation</b>
          <i />
          <i />
          <i />
        </span>
        <span className="mxr-book mxr-book--back" />
      </div>
    );
  if (i === 1)
    return (
      <div className="mxr-cover mxr-cover--score" aria-hidden="true">
        <span className="mxr-dial">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="48" />
            <circle className="mxr-dial-v" cx="60" cy="60" r="48" pathLength="100" />
          </svg>
          <b>72</b>
          <small>readiness</small>
        </span>
        <ul>
          <li style={{ '--w': 0.8 }} />
          <li style={{ '--w': 0.55 }} />
          <li style={{ '--w': 0.92 }} />
        </ul>
      </div>
    );
  if (i === 2)
    return (
      <div className="mxr-cover mxr-cover--story" aria-hidden="true">
        <b>{item.stat[0]}</b>
        <small>{item.stat[1]}</small>
        <span className="mxr-spark">
          <svg viewBox="0 0 160 40">
            <path d="M0 6 C30 8 40 10 60 16 S100 32 160 36" />
          </svg>
        </span>
      </div>
    );
  return (
    <div className="mxr-cover mxr-cover--case" aria-hidden="true">
      <span className="mxr-sheet">
        <i />
        <i />
        <i />
        <em>Case study</em>
      </span>
      <span className="mxr-sheet mxr-sheet--2" />
    </div>
  );
}

export default function Resources() {
  return (
    <section className="mx-sec mxr" aria-labelledby="mxr-title">
      <div className="mt-wrap">
        <SecHead id="mxr-title" label="Resources" title="Real documents," accent="real results." lead={X_RESOURCES.sub}>
          <a className="mxr-all" href="/resources">
            All resources
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </SecHead>
        <ul className="mxr-grid">
          {X_RESOURCES.items.map((item, i) => (
            <li key={item.title} data-reveal style={{ '--rv-delay': `${i * 80}ms` }}>
              <a className={`mxr-card mxr-card--${item.tone}`} href={item.href} download={item.download || undefined}>
                <Cover item={item} i={i} />
                <div className="mxr-body">
                  <small>{item.kind}</small>
                  <b>{item.title}</b>
                  <p>{item.text}</p>
                  <span className="mxr-cta">
                    {item.cta}
                    {item.download ? <Download size={15} aria-hidden="true" /> : <ArrowRight size={15} aria-hidden="true" />}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
