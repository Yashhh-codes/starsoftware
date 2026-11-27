import { useEffect, useRef } from 'react';
import { Check, ChevronRight, PackageCheck, ScanLine, ShieldCheck, Sparkles } from 'lucide-react';
import { Brand } from '../landing/LandingParts';
import { useLoop } from '../mtrx/motion';
import { fly } from '../landing/fly';
import { C_HERO } from '../../data/coaX';
import { CUSTOMERS } from '../../data/coaLanding';

const R = C_HERO.rows;
const N = R.length;
const TESTS = R.filter((r) => r[3]).length;
const MS = 560;
// 0: the next certificate arrives · 1..N: a row each is read and its value
// flies across to the structured data · N+1: each test is checked against
// the specification · N+2: the verdict · N+3: the batch is released and
// the certificate stamped · then it rests and starts over.
const CHECK = N + 1;
const VERDICT = N + 2;
const RELEASED = N + 3;
const LENGTH = N + 10;

// The certificate on the left, read row by row; each value flies to the
// card beside it and lands with its confidence. The tests are then checked
// against the specification, the verdict follows, and the batch is
// released with a stamp on the certificate.
function Scan() {
  const ref = useRef(null);
  const layer = useRef(null);
  const src = useRef([]);
  const dst = useRef([]);
  const [tick, , reduced] = useLoop(ref, { ms: MS, length: LENGTH, rest: RELEASED + 2 });
  const read = Math.min(tick, N);

  // The value being read flies from the certificate to its field.
  useEffect(() => {
    if (reduced || tick < 1 || tick > N || !ref.current || !layer.current) return;
    const i = tick - 1;
    const from = src.current[i];
    const to = dst.current[i];
    if (!from || !to) return;
    fly(ref.current, layer.current, { className: 'cxs-chip', text: R[i][1], from, to, duration: MS * 0.95, lift: 46 });
  }, [tick, reduced]);

  const phase = tick >= RELEASED ? 'released' : tick >= VERDICT ? 'verdict' : tick >= CHECK ? 'check' : tick >= 1 ? 'read' : 'wait';
  const status = {
    wait: 'Waiting',
    read: `Reading ${read} of ${N}`,
    check: 'Checking',
    verdict: 'Verified',
    released: 'Verified',
  }[phase];

  return (
    <div
      ref={ref}
      className={`cxs is-${phase}`}
      role="img"
      aria-label={`A certificate of analysis from ${C_HERO.supplier} being read: product, batch and test results extracted with confidence scores, each test checked against the approved specification, and the batch released.`}
    >
      <div className="cxs-paper" aria-hidden="true">
        <div className="cxs-paper-top">
          <div>
            <b>{C_HERO.supplier}</b>
            <small>{C_HERO.site}</small>
          </div>
          <span>Certificate of analysis</span>
        </div>
        <div className="cxs-paper-meta">
          <span>{C_HERO.product}</span>
          <span>Batch {C_HERO.lot}</span>
        </div>
        <div className="cxs-paper-rows">
          {R.map(([label, value], i) => (
            <p key={label} className={`${i < read ? 'is-read' : ''}${tick === i + 1 ? ' is-now' : ''}`}>
              <span>{label}</span>
              <b ref={(el) => (src.current[i] = el)}>{value}</b>
            </p>
          ))}
          <i className="cxs-beam" style={{ '--y': Math.max(0, Math.min(tick, N) - 1) }} />
        </div>
        <div className="cxs-stamp">
          <ShieldCheck size={16} />
          <div>
            <b>Released</b>
            <small>QA · {C_HERO.lot}</small>
          </div>
        </div>
      </div>

      <div className="cxs-out" aria-hidden="true">
        <div className="cxs-out-h">
          <span className="cxs-ai">
            <Sparkles size={11} />
            Star AI
          </span>
          <b>Structured COA data</b>
          <em>{status}</em>
        </div>
        <ul>
          {R.map(([label, value, conf, test], i) => (
            <li key={label} className={`${i < read ? 'is-in' : ''}${test ? ' is-test' : ''}`} style={{ '--i': test ? R.slice(0, i).filter((r) => r[3]).length : 0 }}>
              <span>{label}</span>
              <b ref={(el) => (dst.current[i] = el)}>
                <em>{value}</em>
                <i aria-hidden="true" />
              </b>
              <small className="cxs-conf">{conf}%</small>
              <span className="cxs-ok">{test && <Check size={10} strokeWidth={3.6} />}</span>
            </li>
          ))}
        </ul>

        <div className="cxs-foot">
          <div className="cxs-prog">
            <span className="cxs-prog-ic">
              <ScanLine size={14} />
            </span>
            <div>
              <b>{phase === 'check' ? `Checking ${TESTS} tests against ${C_HERO.spec}` : phase === 'read' ? 'Extracting fields' : 'Waiting for a certificate'}</b>
              <i style={{ '--p': phase === 'check' ? 1 : read / N }} />
            </div>
          </div>
          <div className="cxs-verdict">
            <span className="cxs-verdict-ic">
              <svg className="cxs-ring" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" />
              </svg>
              <Check size={14} strokeWidth={3.2} />
            </span>
            <div>
              <b>{C_HERO.verdict}</b>
              <small>{C_HERO.verdictSub}</small>
            </div>
          </div>
        </div>
        <div className="cxs-release">
          <div>
            <PackageCheck size={15} />
            {C_HERO.released}
          </div>
        </div>
      </div>
      <div className="cxs-layer" ref={layer} aria-hidden="true" />
    </div>
  );
}

export default function Hero() {
  return (
    <section className="cxh" aria-labelledby="cxh-title">
      <div className="cxh-bg" aria-hidden="true" />
      <div className="mt-wrap">
        <nav className="cxh-crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <span>Products</span>
            </li>
            <li>
              <span aria-current="page">COA Automation</span>
            </li>
          </ol>
        </nav>
      </div>
      <div className="mt-wrap cxh-grid">
        <div className="cxh-copy">
          <p className="cxh-k" data-reveal>
            <i aria-hidden="true" />
            {C_HERO.eyebrow}
          </p>
          <h1 id="cxh-title" className="cxh-title" data-reveal style={{ '--rv-delay': '80ms' }}>
            {C_HERO.title} <em>{C_HERO.titleEnd}</em>
          </h1>
          <p className="cxh-lead" data-reveal style={{ '--rv-delay': '160ms' }}>
            {C_HERO.text}
          </p>
          <div className="cxh-actions" data-reveal style={{ '--rv-delay': '240ms' }}>
            <a className="mt-btn mt-btn--primary" href="#try">
              <span>{C_HERO.primary}</span>
              <ChevronRight size={18} aria-hidden="true" />
            </a>
            <a className="mt-btn mt-btn--ghost" href="#decide">
              {C_HERO.secondary}
            </a>
          </div>
          <ul className="cxh-proof" data-reveal style={{ '--rv-delay': '300ms' }}>
            {C_HERO.proof.map((item) => (
              <li key={item}>
                <span aria-hidden="true">
                  <Check size={11} strokeWidth={3.4} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="cxh-visual" data-reveal="scale" style={{ '--rv-delay': '200ms' }}>
          <Scan />
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
