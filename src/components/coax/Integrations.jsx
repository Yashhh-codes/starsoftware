import { useLayoutEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/useMotion';
import SecHead from '../mtrx/SecHead';
import { C_INTEG } from '../../data/coaX';

const SYS = `${import.meta.env.BASE_URL}home/img/systems/`;
const LOGO = `${import.meta.env.BASE_URL}home/img/logo-star-white.png`;

// The stage is drawn at one size and scaled to fit, so the curves always
// meet the cards: documents on the left, Star AI in the middle, the
// systems on the right.
const W = 1136;
const DOC_W = 290;
const CORE = 200;
const CORE_X = 448;
const CORE_IN = 22;
const GROUP_X = 776;
const GAP = 12;
const PAD = 4;

// The document icons: a sheet with its colour band and the detail that
// says what it is (a flask for a COA, a grid and seal for an MTR, a
// receipt for an invoice).
const ICON = {
  coa: (
    <svg viewBox="0 0 30 38" aria-hidden="true">
      <path d="M3.5 1.5h17l6 6v29h-23z" fill="#fff" stroke="#bcc4d1" strokeLinejoin="round" />
      <path d="M4.0 2.0h16.3v5.5h-16.3z" fill="currentColor" />
      <rect x="6.5" y="10" width="10" height="1.6" rx="0.8" fill="#8a94a6" />
      {[13.5, 16.9, 20.3, 23.7].map((y) => (
        <g key={y}>
          <rect x="6.5" y={y} width="8" height="1.6" rx="0.8" fill="#cfd5df" />
          <circle cx="19" cy={y + 0.8} r="1.1" fill="currentColor" />
        </g>
      ))}
      <circle cx="21.5" cy="30" r="5.2" fill="currentColor" />
      <path d="M20.4 26.9h2.2M20.9 26.9v2l-1.9 3.3a.7.7 0 0 0 .6 1h3.8a.7.7 0 0 0 .6-1l-1.9-3.3v-2" fill="none" stroke="#fff" strokeWidth=".9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  mtr: (
    <svg viewBox="0 0 30 38" aria-hidden="true">
      <path d="M3.5 1.5h17l6 6v29h-23z" fill="#fff" stroke="#bcc4d1" strokeLinejoin="round" />
      <path d="M4.0 2.0h16.3v5.5h-16.3z" fill="currentColor" />
      <rect x="6.5" y="10" width="9" height="1.6" rx="0.8" fill="#8a94a6" />
      {[6.5, 10.7, 14.9, 19.1].map((x) =>
        [13.0, 16.3].map((y) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="4.2" height="3.3" fill={x === 10.7 && y === 16.3 ? 'currentColor' : '#fff'} fillOpacity={x === 10.7 && y === 16.3 ? 0.25 : 1} stroke="#cfd5df" strokeWidth=".7" />
        ))
      )}
      <rect x="6.5" y="22" width="9" height="1.6" rx="0.8" fill="#cfd5df" />
      <rect x="6.5" y="25" width="6" height="1.6" rx="0.8" fill="#cfd5df" />
      <path d="M18.6 31.5l-1.4 5 2.8-1.4 2.8 1.4-1.4-5" fill="currentColor" />
      <circle cx="20" cy="28.5" r="4.6" fill="currentColor" />
      <circle cx="20" cy="28.5" r="3.1" fill="none" stroke="#fff" strokeWidth=".8" strokeDasharray="1 .8" />
    </svg>
  ),
  inv: (
    <svg viewBox="0 0 30 38" aria-hidden="true">
      <path d="M7 1.5h16v31l-2 1.6-2-1.6-2 1.6-2-1.6-2 1.6-2-1.6-2 1.6-2-1.6z" fill="#fff" stroke="#bcc4d1" strokeLinejoin="round" />
      <path d="M7.5 2h15v5.5h-15z" fill="currentColor" />
      {[11.0, 14.2, 17.4, 20.6].map((y) => (
        <g key={y}>
          <rect x="10" y={y} width="6" height="1.6" rx="0.8" fill="#cfd5df" />
          <rect x="18" y={y} width="3" height="1.6" rx="0.8" fill="#cfd5df" />
        </g>
      ))}
      <path d="M10 24.5h11" stroke="#cfd5df" strokeWidth=".8" strokeDasharray="1.2 1" />
      <rect x="10" y="26.5" width="11" height="4" rx="1" fill="currentColor" />
      <rect x="11.5" y="27.7" width="5" height="1.6" rx="0.8" fill="#fff" />
    </svg>
  ),
};
const TONE = { coa: '#00647a', mtr: '#493ee5', inv: '#DD7A0E' };

// The kinds of system shown as words, each with its own small icon.
const CAT = {
  LIMS: 'M9 3h6M10 3v6l-5 9a2 2 0 001.8 3h10.4a2 2 0 001.8-3l-5-9V3',
  QMS: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z M8.5 12l2.5 2.5 4.5-5',
  MES: 'M3 21V10l5 3V10l5 3V6h3l1 15z M3 21h18',
};

const curve = (x1, y1, x2, y2, c1, c2) => `M${x1} ${y1} C ${c1} ${y1}, ${c2} ${y2}, ${x2} ${y2}`;

function Group({ g, refFn, style }) {
  return (
    <div className="cxn-group" ref={refFn} style={style}>
      <h4>
        {g.name} <small>{g.text}</small>
      </h4>
      <ul>
        {(g.tags || []).map((t) => (
          <li key={t} className="cxn-cat">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={CAT[t]} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <span>{t}</span>
          </li>
        ))}
        {g.logos.map(([name, file, words]) => (
          <li key={name} className="cxn-lg">
            <img src={`${SYS}${file}`} alt={words ? '' : name} />
            {words && <span>{words}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Doc({ d, style }) {
  const [key, name, text] = d;
  return (
    <div className="cxn-doc" style={style}>
      <span className="cxn-di" style={{ color: TONE[key] }}>
        {ICON[key]}
      </span>
      <span className="cxn-dt">
        <b>{name}</b>
        <small>{text}</small>
      </span>
    </div>
  );
}

function Core({ className = '', style }) {
  return (
    <div className={`cxn-core ${className}`} style={style}>
      <div className="cxn-rings" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="cxn-core-in">
        <img src={LOGO} alt="" width="132" height="100" />
        <b>Star AI</b>
        <span>Extract, understand, validate</span>
      </div>
    </div>
  );
}

function Hub() {
  const wrap = useRef(null);
  const groups = useRef([]);
  const reduced = usePrefersReducedMotion();
  const [scale, setScale] = useState(1);
  const [heights, setHeights] = useState(C_INTEG.groups.map(() => 140));

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return undefined;
    const measure = () => {
      setScale(Math.min(1, el.clientWidth / W));
      const hs = groups.current.map((g) => (g ? g.offsetHeight : 140));
      setHeights((prev) => (prev.join() === hs.join() ? prev : hs));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    groups.current.forEach((g) => g && ro.observe(g));
    return () => ro.disconnect();
  }, []);

  const H = heights.reduce((a, b) => a + b, 0) + GAP * (heights.length - 1) + PAD * 2;
  const tops = heights.map((_, i) => PAD + heights.slice(0, i).reduce((a, b) => a + b, 0) + GAP * i);
  const n = C_INTEG.docs.length;
  const docH = (H - PAD * 2 - GAP * (n - 1)) / n;
  const docTops = C_INTEG.docs.map((_, i) => PAD + i * (docH + GAP));
  const cy = H / 2;
  const ins = docTops.map((t) => curve(DOC_W, t + docH / 2, CORE_X + CORE_IN, cy, 380, 390));
  const outs = tops.map((t, i) => curve(CORE_X + CORE - CORE_IN, cy, GROUP_X, t + heights[i] / 2, 722, 732));

  return (
    <div ref={wrap} className="cxn-wrap" style={{ height: H * scale }}>
      <div className="cxn-stage" style={{ height: H, transform: `scale(${scale})` }} role="img" aria-label="Certificates of analysis, mill test reports and invoices flow into Star AI, which extracts, understands and validates them, then sends data to ERP, CRM, workflow and quality systems.">
        <svg className="cxn-lines" viewBox={`0 0 ${W} ${H}`} style={{ height: H }} aria-hidden="true">
          {ins.map((d, i) => (
            <g key={`i${i}`}>
              <path d={d} />
              {!reduced && (
                <circle r="3.5">
                  <animateMotion dur="2.8s" repeatCount="indefinite" begin={`${(i * 0.55).toFixed(2)}s`} path={d} />
                </circle>
              )}
            </g>
          ))}
          {outs.map((d, i) => (
            <g key={`o${i}`}>
              <path d={d} />
              {!reduced && (
                <circle r="3.5" className="is-out">
                  <animateMotion dur="2.8s" repeatCount="indefinite" begin={`${(1.4 + i * 0.55).toFixed(2)}s`} path={d} />
                </circle>
              )}
            </g>
          ))}
        </svg>
        {C_INTEG.docs.map((d, i) => (
          <Doc key={d[0]} d={d} style={{ top: docTops[i], height: docH }} />
        ))}
        <Core style={{ top: cy - CORE / 2 }} />
        {C_INTEG.groups.map((g, i) => (
          <Group key={g.name} g={g} refFn={(el) => (groups.current[i] = el)} style={{ top: tops[i] }} />
        ))}
      </div>
    </div>
  );
}

// Under 980px: the documents in a row, Star AI, then the systems in two
// columns.
function HubMobile() {
  return (
    <div className="cxn-mobile">
      <div className="cxn-m-docs">
        {C_INTEG.docs.map(([key, name]) => (
          <div key={key} className="cxn-m-doc">
            <span className="cxn-di" style={{ color: TONE[key] }}>
              {ICON[key]}
            </span>
            <b>{name}</b>
          </div>
        ))}
      </div>
      <Core className="cxn-m-orb" />
      <div className="cxn-m-groups">
        {C_INTEG.groups.map((g) => (
          <Group key={g.name} g={g} />
        ))}
      </div>
    </div>
  );
}

export default function Integrations() {
  return (
    <section id="integrations" className="mx-sec mx-sec--soft cxi" aria-labelledby="cxi-title">
      <div className="mt-wrap">
        <SecHead id="cxi-title" label="Integrations" title={C_INTEG.title} accent={C_INTEG.titleEnd} lead={C_INTEG.lead} />
        <div className="cxn" data-reveal="scale" style={{ '--rv-delay': '120ms' }}>
          <Hub />
          <HubMobile />
          <div className="cxn-flow">
            <p className="cxn-k">The COA data flow</p>
            <ol>
              {C_INTEG.stages.map(([name]) => (
                <li key={name}>{name}</li>
              ))}
            </ol>
            <p className="cxn-sub">{C_INTEG.flowNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
