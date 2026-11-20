import { useRef } from 'react';
import { ArrowRight, Check, ChevronDown, FlaskConical, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { Brand } from '../landing/LandingParts';
import { useLoop } from '../mtrx/motion';
import { C_HERO } from '../../data/coaX';
import { CUSTOMERS } from '../../data/coaLanding';

const T = C_HERO.tests;
const N = T.length;
// 0: the COA arrives · 1..N: a test each · N+1: the verdict · N+2: the
// batch is released · then it rests.
const VERDICT = N + 1;
const RELEASED = N + 2;
const LENGTH = N + 8;

function Console() {
  const ref = useRef(null);
  const [tick] = useLoop(ref, { ms: 850, length: LENGTH, rest: RELEASED + 1 });
  return (
    <div
      ref={ref}
      className="cxh-console"
      role="img"
      aria-label={`${C_HERO.supplier} certificate of analysis for ${C_HERO.product}: assay, water, impurities and E. coli are read and checked against the specification, and the batch is released for production.`}
    >
      <div className="cxh-grid" aria-hidden="true" />
      {/* The certificate */}
      <div className="cxh-coa" aria-hidden="true">
        <div className="cxh-coa-top">
          <span className="cxh-flask">
            <FlaskConical size={16} />
          </span>
          <div>
            <b>{C_HERO.supplier}</b>
            <small>Certificate of analysis</small>
          </div>
        </div>
        <p className="cxh-coa-prod">{C_HERO.product}</p>
        {T.map(([test, result], i) => (
          <p key={test} className={`cxh-coa-row${tick === i + 1 ? ' is-scan' : ''}${tick > i + 1 ? ' is-read' : ''}`}>
            <span>{test}</span>
            <b>{result}</b>
          </p>
        ))}
        <span className="cxh-sign" />
      </div>

      <span className={`cxh-pipe cxh-pipe--a${tick >= 1 && tick <= N ? ' is-on' : ''}`} aria-hidden="true" />

      {/* Each result inside its specification range */}
      <div className="cxh-checks" aria-hidden="true">
        <div className="cxh-checks-top">
          <span className="cxh-ai">
            <Sparkles size={12} />
            Star AI
          </span>
          <b>Against your specification</b>
          <em>{tick >= VERDICT ? `${N} of ${N} within limits` : tick >= 1 ? `Checking ${Math.min(tick, N)} of ${N}` : 'Waiting'}</em>
        </div>
        {T.map(([test, result, limit, pos], i) => {
          const on = tick > i;
          return (
            <div key={test} className={`cxh-t${on ? ' is-on' : ''}${tick === i + 1 ? ' is-now' : ''}`}>
              <div className="cxh-t-h">
                <span>{test}</span>
                <b>{on ? result : '—'}</b>
              </div>
              {pos == null ? (
                <div className="cxh-pill">
                  <i />
                  <span>{limit}</span>
                </div>
              ) : (
                <div className="cxh-range">
                  <span className="cxh-band" />
                  <i style={{ left: `${(on ? pos : 0) * 100}%` }} />
                  <small>{limit}</small>
                </div>
              )}
              <span className="cxh-ok">
                <Check size={11} strokeWidth={3.4} />
              </span>
            </div>
          );
        })}
      </div>

      <span className={`cxh-pipe cxh-pipe--b${tick >= VERDICT ? ' is-on' : ''}`} aria-hidden="true" />

      {/* The decision */}
      <div className={`cxh-rel${tick >= VERDICT ? ' is-verdict' : ''}${tick >= RELEASED ? ' is-released' : ''}`} aria-hidden="true">
        <span className="cxh-rel-ic">
          <ShieldCheck size={22} />
        </span>
        <b>{C_HERO.verdict}</b>
        <small>{C_HERO.verdictSub}</small>
        <div className="cxh-rel-bar">
          <PackageCheck size={16} />
          <span>{C_HERO.released}</span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="cxh" aria-labelledby="cxh-title">
      <div className="cxh-bg" aria-hidden="true" />
      <div className="mt-wrap cxh-inner">
        <p className="mxh-chip" data-reveal>
          <FlaskConical size={14} aria-hidden="true" />
          {C_HERO.eyebrow}
        </p>
        <h1 id="cxh-title" className="cxh-title" data-reveal style={{ '--rv-delay': '80ms' }}>
          {C_HERO.title} <span>{C_HERO.titleEnd}</span>
        </h1>
        <p className="cxh-lead" data-reveal style={{ '--rv-delay': '160ms' }}>
          {C_HERO.text}
        </p>
        <div className="cxh-actions" data-reveal style={{ '--rv-delay': '240ms' }}>
          <a className="mt-btn mt-btn--primary" href="#try">
            <span>{C_HERO.primary}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </a>
          <a className="mt-btn mt-btn--ghost" href="#decide">
            {C_HERO.secondary}
            <ChevronDown size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="cxh-stage" data-reveal="scale" style={{ '--rv-delay': '300ms' }}>
          <Console />
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
