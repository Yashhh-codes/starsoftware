import { useRef } from 'react';
import { ArrowRight, Check, ChevronDown, ScanText, ShieldCheck, Sparkles } from 'lucide-react';
import { Brand } from '../landing/LandingParts';
import { useLoop } from './motion';
import { X_HERO } from '../../data/mtrX';
import { CUSTOMERS } from '../../data/mtrLanding';

const ROWS = X_HERO.cert.rows;
const N = ROWS.length;
// tick 0: a fresh certificate; 1..N: row by row; N+1: verdict; N+2:
// released; then it rests before starting over.
const VERDICT = N + 1;
const RELEASED = N + 2;
const LENGTH = N + 8;

// The certificate as it arrives from the mill, read row by row by a beam.
function Paper({ tick }) {
  const { cert } = X_HERO;
  const at = Math.min(Math.max(tick, 1), N) - 1;
  return (
    <div className="mxh-paper" aria-hidden="true">
      <div className="mxh-paper-top">
        <span className="mxh-mill-mark">N</span>
        <div>
          <b>{cert.mill}</b>
          <small>{cert.unit}</small>
        </div>
        <em>{cert.doc}</em>
      </div>
      <div className="mxh-paper-meta">
        <span>{cert.po}</span>
        <span>{cert.product}</span>
      </div>
      <div className="mxh-paper-rows" style={{ '--at': at }}>
        {ROWS.map(([label, value], i) => (
          <div key={label} className={`mxh-pr${tick === i + 1 ? ' is-scan' : ''}${tick > i + 1 ? ' is-read' : ''}`}>
            <span>{label}</span>
            <b>{value}</b>
          </div>
        ))}
        <i className={`mxh-beam${tick >= 1 && tick <= N ? ' is-on' : ''}`} />
      </div>
      <div className="mxh-paper-foot">
        <span className="mxh-sign" />
        <small>Authorized representative · EN 10204 3.1</small>
      </div>
      <span className={`mxh-stamp${tick >= RELEASED ? ' is-on' : ''}`}>
        Released
        <small>Heat 24A8871</small>
      </span>
    </div>
  );
}

// What Star makes of it: each value with its confidence, and where it sits
// inside the specification's limits.
function Record({ tick }) {
  const done = ROWS.filter((_, i) => tick > i).length;
  return (
    <div className="mxh-rec" aria-hidden="true">
      <div className="mxh-rec-top">
        <span className="mxh-ai">
          <Sparkles size={13} />
          Star AI
        </span>
        <b>Structured MTR data</b>
        <span className={`mxh-state${tick >= VERDICT ? ' is-done' : ''}`}>
          {tick >= VERDICT ? 'Checked' : tick >= 1 ? `Reading ${Math.min(done, N)}/${N}` : 'Waiting'}
        </span>
      </div>
      <ul className="mxh-rec-rows">
        {ROWS.map(([label, value, conf, limit, pos], i) => {
          const on = tick > i;
          return (
            <li key={label} className={`${on ? 'is-on' : ''}${tick === i + 1 ? ' is-new' : ''}`}>
              <span className="mxh-k">{label}</span>
              <span className="mxh-v">{on ? value : ''}</span>
              {pos == null ? (
                <span className="mxh-tag">
                  <Check size={11} strokeWidth={3} />
                  {limit}
                </span>
              ) : (
                <span className="mxh-band" title={limit}>
                  <i style={{ '--x': pos }} />
                  <small>{limit}</small>
                </span>
              )}
              <span className="mxh-conf">{conf}%</span>
            </li>
          );
        })}
      </ul>
      <div className={`mxh-verdict${tick >= VERDICT ? ' is-on' : ''}`}>
        <span className="mxh-verdict-ic">
          <ShieldCheck size={18} />
        </span>
        <div>
          <b>Within ASTM A516 Gr. 70 limits</b>
          <small>6 of 6 checks passed</small>
        </div>
        <span className="mxh-verdict-pill">Pass</span>
      </div>
    </div>
  );
}

function Stage() {
  const ref = useRef(null);
  const [tick] = useLoop(ref, { ms: 620, length: LENGTH, rest: RELEASED + 1 });
  return (
    <div
      ref={ref}
      className="mxh-stage"
      role="img"
      aria-label="A mill test certificate from Northfield Steel Mill is read row by row. Each value is extracted with its confidence, checked against the ASTM A516 Grade 70 limits, and heat 24A8871 is released to inventory."
    >
      <div className="mxh-grid" aria-hidden="true" />
      <div className="mxh-glow" aria-hidden="true" />
      <Paper tick={tick} />
      <Record tick={tick} />
      <div className={`mxh-float mxh-float--po${tick >= 3 ? ' is-on' : ''}`} aria-hidden="true">
        <span className="mxh-float-ic">PO</span>
        <div>
          <b>PO 44-1180 matched</b>
          <small>Grade, size and heat</small>
        </div>
      </div>
      <div className={`mxh-float mxh-float--erp${tick >= RELEASED ? ' is-on' : ''}`} aria-hidden="true">
        <span className="mxh-float-ic mxh-float-ic--ok">
          <Check size={14} strokeWidth={3} />
        </span>
        <div>
          <b>Released to inventory</b>
          <small>Record sent to your ERP</small>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="mxh" aria-labelledby="mxh-title">
      <div className="mxh-bg" aria-hidden="true" />
      <div className="mt-wrap mxh-inner">
        <div className="mxh-copy">
          <p className="mxh-chip" data-reveal>
            <ScanText size={14} aria-hidden="true" />
            {X_HERO.eyebrow}
          </p>
          <h1 id="mxh-title" className="mxh-title" data-reveal style={{ '--rv-delay': '80ms' }}>
            {X_HERO.title} <span>{X_HERO.titleEnd}</span>
          </h1>
          <p className="mxh-lead" data-reveal style={{ '--rv-delay': '160ms' }}>
            {X_HERO.text}
          </p>
          <div className="mxh-actions" data-reveal style={{ '--rv-delay': '240ms' }}>
            <a className="mt-btn mt-btn--primary" href="#try">
              <span>{X_HERO.primary}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="mt-btn mt-btn--ghost" href="#decision">
              {X_HERO.secondary}
              <ChevronDown size={18} aria-hidden="true" />
            </a>
          </div>
          <ul className="mxh-ticks" data-reveal style={{ '--rv-delay': '320ms' }}>
            {X_HERO.ticks.map((t) => (
              <li key={t}>
                <Check size={13} strokeWidth={3} aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="mxh-visual" data-reveal="scale" style={{ '--rv-delay': '200ms' }}>
          <Stage />
        </div>
      </div>
      <div className="mt-wrap mxh-trust">
        <p>Trusted by teams at</p>
        <ul>
          {CUSTOMERS.map((item) => (
            <li key={item.name}>
              <Brand item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
