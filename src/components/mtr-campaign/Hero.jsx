import { useEffect, useRef, useState } from 'react';
import { Icon } from './icons';
import { useOnScreen, useReducedMotion } from './hooks';

const TICK_MS = 520;

// A certificate being read: a beam runs down its rows while each value
// lands in the structured data beside it, then the verdict and the release
// follow, and it starts over. With reduced motion it shows the end state.
function CertificateScan({ scan }) {
  const { rows } = scan;
  const total = rows.length + 1;
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const onScreen = useOnScreen(ref, { threshold: 0.25 });
  const [tick, setTick] = useState(reduced ? total + 1 : 0);

  useEffect(() => {
    if (reduced || !onScreen) return undefined;
    let n = 0;
    setTick(0);
    const timer = setInterval(() => {
      n = n > total + 6 ? 0 : n + 1;
      setTick(n);
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [reduced, onScreen, total]);

  const read = tick > rows.length;
  const released = tick > total;

  return (
    <div className="mh-scan" ref={ref} role="img" aria-label={scan.label}>
      <div className="mh-paper" aria-hidden="true">
        <div className="mh-paper-top">
          <div>
            <b>{scan.issuer}</b>
            <small>{scan.issuerSub}</small>
          </div>
          <span>{scan.docTitle}</span>
        </div>
        <div className="mh-paper-meta">
          {scan.meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="mh-paper-rows">
          {rows.map(([label, value], i) => (
            <div key={label} className={`mh-pr${tick === i + 1 ? ' is-scan' : ''}${tick > i + 1 ? ' is-read' : ''}`}>
              <span>{label}</span>
              <b>{value}</b>
            </div>
          ))}
          <i
            className="mh-beam"
            style={{ '--y': Math.max(1, Math.min(tick, rows.length)) }}
            data-on={tick > 0 && tick <= rows.length ? '' : undefined}
          />
        </div>
      </div>
      <div className="mh-out">
        <div className="mh-out-h">
          <span className="mh-bot">
            <i />
            Star AI
          </span>
          <b>{scan.outTitle}</b>
          <em className={read ? 'is-done' : undefined}>{read ? `${rows.length} fields` : 'Reading…'}</em>
        </div>
        <ul>
          {rows.map(([label, value, confidence], i) => (
            <li key={label} className={tick > i + 1 ? 'is-in' : undefined}>
              <span>{label}</span>
              <b>{value}</b>
              <i>{confidence}%</i>
            </li>
          ))}
        </ul>
        <div className={`mh-verdict${read ? ' is-in' : ''}`}>
          <span className="mh-verdict-ic">
            <Icon name="check" />
          </span>
          <div>
            <b>{scan.verdict[0]}</b>
            <small>{scan.verdict[1]}</small>
          </div>
        </div>
        <div className={`mh-release${released ? ' is-in' : ''}`}>{scan.release}</div>
      </div>
    </div>
  );
}

export default function Hero({ hero }) {
  return (
    <section className="mh">
      <div className="wrap mh-grid">
        <div className="mh-copy">
          <p className="oa-k">
            <i aria-hidden="true" />
            {hero.kicker}
          </p>
          <h1 className="mh-h">
            {hero.title[0]} <em>{hero.title[1]}</em>
          </h1>
          <p className="mh-p">{hero.text}</p>
          <div className="mh-cta">
            <a className="btn btn-outline btn-lg" href="#decide">
              See how the AI decides
            </a>
          </div>
          <ul className="mh-proof">
            {hero.proof.map((item) => (
              <li key={item}>
                <Icon name="check" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <CertificateScan scan={hero.scan} />
      </div>
    </section>
  );
}
