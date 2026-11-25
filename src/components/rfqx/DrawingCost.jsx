import { useRef } from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { Eyebrow } from '../landing/LandingParts';
import Photo from './Photo';
import { useLoop } from '../mtrx/motion';
import { R_DRAWING } from '../../data/rfqX';

const money = (n, d = 2) => `$${n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })}`;
const TONES = ['#493ee5', '#635bff', '#0092b8', '#0e9f6e', '#d97706', '#8a97aa'];

// The part drawing, drawn: a base plate with a gusset, its holes,
// dimensions and the title block. Pure line work in the drawing's blue.
function Sheet() {
  return (
    <svg className="rqd-svg" viewBox="0 0 560 380" aria-hidden="true">
      <defs>
        <pattern id="rqd-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="rgba(73,62,229,.07)" strokeWidth="1" />
        </pattern>
        <marker id="rqd-ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L8 4L0 8z" fill="#5b6b82" />
        </marker>
      </defs>
      <rect x="0" y="0" width="560" height="380" fill="url(#rqd-grid)" />
      <rect x="10" y="10" width="540" height="360" fill="none" stroke="#c9cfe0" strokeWidth="1.2" />
      {/* Front view: the plate */}
      <g className="rqd-part" fill="none" stroke="#24345a" strokeWidth="1.8">
        <rect x="60" y="70" width="330" height="170" rx="4" />
        {[110, 225, 340].map((x) => (
          <g key={x}>
            <circle cx={x} cy="110" r="11" />
            <circle cx={x} cy="200" r="11" />
            <path d={`M${x - 17} 110h34M${x} 93v34M${x - 17} 200h34M${x} 183v34`} stroke="#9aa6c2" strokeWidth=".8" strokeDasharray="4 3" />
          </g>
        ))}
        {/* Side view: plate and gusset */}
        <rect x="440" y="70" width="18" height="170" />
        <path d="M458 240L520 240L458 120Z" />
        <path d="M458 236l6 -6M466 236l6 -6M474 236l6 -6M458 228l6 -6M458 218l6 -6" stroke="#493ee5" strokeWidth="1.2" />
      </g>
      {/* Dimensions */}
      <g className="rqd-dim" stroke="#5b6b82" strokeWidth="1" fill="#5b6b82" fontFamily="JetBrains Mono, monospace" fontSize="11">
        <path d="M60 262v14M390 262v14" />
        <path d="M64 270H386" markerStart="url(#rqd-ar)" markerEnd="url(#rqd-ar)" />
        <text x="225" y="264" textAnchor="middle" stroke="none">
          420 ±0.5
        </text>
        <path d="M38 70h14M38 240h14" />
        <path d="M45 74V236" markerStart="url(#rqd-ar)" markerEnd="url(#rqd-ar)" />
        <text x="30" y="160" textAnchor="middle" stroke="none" transform="rotate(-90 30 160)">
          220
        </text>
        <text x="440" y="60" stroke="none">
          ¾″ PL
        </text>
      </g>
      {/* Title block */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#24345a">
        <rect x="300" y="300" width="250" height="70" fill="#fff" stroke="#c9cfe0" />
        <path d="M300 322H550M300 346H550M420 300V370" stroke="#c9cfe0" />
        <text x="308" y="315">DWG 1047</text>
        <text x="428" y="315" fill="#dc2f45" fontWeight="700">
          REV C
        </text>
        <text x="308" y="338">A572 GR 50</text>
        <text x="428" y="338">QTY 40</text>
        <text x="308" y="362">GALV · MT 4.3.2</text>
        <text x="428" y="362">NORTHLINE</text>
      </g>
      <g fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#5b6b82">
        <text x="60" y="318">NOTES</text>
        <text x="60" y="334">1. WELD BOTH SIDES, 6 FILLET</text>
        <text x="60" y="348">2. HOT-DIP GALVANIZE AFTER FAB</text>
        <text x="60" y="362">3. INSPECT PER SPEC 4.3.2</text>
      </g>
    </svg>
  );
}

// One part from drawing to costed line: the agent reads the notes on the
// drawing one by one, each lands as a costed operation, then the line is
// priced with the margin rule. Loops while on screen.
export default function DrawingCost() {
  const d = R_DRAWING;
  const ref = useRef(null);
  const N = d.callouts.length;
  // 0 scan · 1..5 callouts and their costs · 6 overhead · 7 flag · 8 cost · 9 price · rest
  const [tick] = useLoop(ref, { ms: 900, length: 15, rest: 12 });
  const marks = Math.min(N, tick);
  const rows = tick >= 6 ? d.costs.length : marks;
  const cost = d.costs.reduce((s, c) => s + c[1], 0);
  const shownCost = d.costs.slice(0, rows).reduce((s, c) => s + c[1], 0);
  const price = cost / (1 - d.margin);

  return (
    <section id="drawing" className="mx-sec mx-sec--soft rqx-sec rqx-draw" aria-labelledby="rqd-title">
      <div className="mt-wrap">
        <div className="mxk-head rqx-head-photo">
          <div>
            <Eyebrow>{d.label}</Eyebrow>
            <h2 id="rqd-title" className="mx-h2" data-reveal>
              {d.title} <span>{d.accent}</span>
            </h2>
            <p className="mx-lead" data-reveal style={{ '--rv-delay': '80ms' }}>
              {d.lead}
            </p>
          </div>
          <Photo src="photos/rfq-parts-drawing.webp" alt="Two machined metal parts resting on their engineering drawings" w={1600} h={900} className="rqx-photo--head" />
        </div>

        <div ref={ref} className="rqd" data-reveal="scale">
          <div className="rqd-sheet">
            <div className="rqd-sheet-bar">
              <span className="rqd-chip">
                <Sparkles size={12} />
                Drawing agent
              </span>
              <b>
                {d.part[0]} · {d.part[1]}
              </b>
              <small>
                {d.part[2]} · {d.part[3]}
              </small>
            </div>
            <div className="rqd-canvas">
              <Sheet />
              <span className={`rqd-beam${tick < 6 ? ' is-on' : ''}`} aria-hidden="true" />
              {d.callouts.map(([m, text, lands, x, y], i) => (
                <span
                  key={m}
                  className={`rqd-mark${marks > i ? ' is-on' : ''}${marks === i + 1 && tick <= N ? ' is-now' : ''}${m === '5' ? ' is-flag' : ''}`}
                  style={{ left: `${x}%`, top: `${y}%`, '--d': `${i * 40}ms` }}
                >
                  <i>{m}</i>
                  <span className="rqd-tip">
                    <b>{text}</b>
                    <small>→ {lands}</small>
                  </span>
                </span>
              ))}
            </div>
            <ol className="rqd-legend" aria-label="What the drawing agent read">
              {d.callouts.map(([m, text, lands, , , ], i) => (
                <li key={m} className={`${marks > i ? 'is-on' : ''}${m === '5' ? ' is-flag' : ''}`}>
                  <i>{m}</i>
                  <span>
                    {text}
                    <small>{lands}</small>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rqd-line">
            <div className="rqd-line-h">
              <p className="rqi-lab">Line 07 · costed per part</p>
              <b className="rqd-total">{money(shownCost)}</b>
            </div>
            <div className="rqd-stack" aria-hidden="true">
              {d.costs.map(([name, v], i) => (
                <i key={name} style={{ flexGrow: rows > i ? v : 0.0001, background: TONES[i] }} />
              ))}
            </div>
            <ul className="rqd-rows">
              {d.costs.map(([name, v, m, flagged], i) => (
                <li key={name} className={`${rows > i ? 'is-on' : ''}${flagged ? ' is-flag' : ''}${flagged && tick >= 7 ? ' is-lit' : ''}`}>
                  <span className="rqd-dot" style={{ background: TONES[i] }} aria-hidden="true" />
                  {m ? <span className="rqd-m">{m}</span> : <span className="rqd-m rqd-m--none">+</span>}
                  <span className="rqd-name">
                    {name}
                    {flagged && <em>Added from spec</em>}
                  </span>
                  <b>{money(v)}</b>
                </li>
              ))}
            </ul>
            <div className={`rqd-warn${tick >= 7 ? ' is-on' : ''}`}>
              <AlertTriangle size={15} aria-hidden="true" />
              <span>{d.note}</span>
            </div>
            <div className="rqd-sum">
              <p className={tick >= 8 ? 'is-on' : ''}>
                <span>Cost per part</span>
                <b>{money(cost)}</b>
              </p>
              <p className={tick >= 9 ? 'is-on' : ''}>
                <span>Margin rule</span>
                <b>{(d.margin * 100).toFixed(1)}%</b>
              </p>
              <p className={`rqd-price${tick >= 9 ? ' is-on' : ''}`}>
                <span>
                  Price per part <small>× {d.qty}</small>
                </span>
                <b>
                  {money(price)}
                  <small>{money(price * d.qty)} line total</small>
                </b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
