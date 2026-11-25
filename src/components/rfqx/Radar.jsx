import { useRef, useState } from 'react';
import { AlertTriangle, ArrowRight, Check } from 'lucide-react';
import SecHead from '../mtrx/SecHead';
import { useLoop } from '../mtrx/motion';
import { R_RADAR } from '../../data/rfqX';

const C = 200;
const R = 140;
const pt = (i, r, n) => {
  const a = (-90 + (360 / n) * i) * (Math.PI / 180);
  return [C + Math.cos(a) * r, C + Math.sin(a) * r];
};
const poly = (vals) => vals.map((v, i) => pt(i, Math.max(v, 0.04) * R, vals.length).join(',')).join(' ');

// The quote risk radar: six checks on a hexagonal chart. The sweep finds
// them one at a time; each plots its risk, lands in the register and adds
// to the score; then the verdict. Pointing at a row lights its axis.
export default function Radar() {
  const d = R_RADAR;
  const n = d.items.length;
  const ref = useRef(null);
  const [tick] = useLoop(ref, { ms: 850, length: n + 7, rest: n + 2 });
  const [hover, setHover] = useState(null);
  const shown = Math.min(n, tick);
  const score = Math.round((d.score * shown) / n);
  const vals = d.items.map((it, i) => (i < shown ? it[2] : 0));
  const open = d.items.filter((it) => it[5] !== 'ok').length;

  return (
    <section id="radar" className="mx-sec rqx-sec rqx-radar" aria-labelledby="rqr-title">
      <div className="mt-wrap">
        <SecHead id="rqr-title" label={d.label} title={d.title} accent={d.accent} lead={d.lead} />

        <div ref={ref} className="rqr" data-reveal="scale">
          <div className="rqr-chart">
            <div className="rqr-score" role="img" aria-label={`Quote risk score ${d.score} out of 100`}>
              <b>{score}</b>
              <span>/ 100</span>
              <small>Quote risk score</small>
            </div>
            <svg viewBox="0 0 400 400" aria-hidden="true">
              <defs>
                <radialGradient id="rqr-fill" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#dc2f45" stopOpacity=".05" />
                  <stop offset="100%" stopColor="#dc2f45" stopOpacity=".22" />
                </radialGradient>
                <linearGradient id="rqr-sweep" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#635bff" stopOpacity="0" />
                  <stop offset="100%" stopColor="#635bff" stopOpacity=".28" />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75, 1].map((k) => (
                <polygon key={k} className={`rqr-ring${k === 0.75 ? ' is-limit' : ''}`} points={poly(Array(n).fill(k))} />
              ))}
              {d.items.map((it, i) => {
                const [x, y] = pt(i, R, n);
                return <line key={it[0]} className={`rqr-axis${hover === i ? ' is-hot' : ''}`} x1={C} y1={C} x2={x} y2={y} />;
              })}
              <g className="rqr-sweep">
                <path d={`M${C} ${C} L${C} ${C - R - 14} A${R + 14} ${R + 14} 0 0 1 ${C + (R + 14) * Math.sin(Math.PI / 4)} ${C - (R + 14) * Math.cos(Math.PI / 4)} Z`} fill="url(#rqr-sweep)" />
              </g>
              <polygon className="rqr-area" points={poly(vals)} />
              {d.items.map((it, i) => {
                const [x, y] = pt(i, Math.max(vals[i], 0.04) * R, n);
                return <circle key={it[0]} className={`rqr-pt is-${it[5]}${i < shown ? ' is-on' : ''}${hover === i ? ' is-hot' : ''}`} cx={x} cy={y} r="6" />;
              })}
              {d.items.map((it, i) => {
                const [x, y] = pt(i, R + 30, n);
                return (
                  <text key={it[0]} className={`rqr-lbl${i < shown ? ' is-on' : ''}${hover === i ? ' is-hot' : ''}`} x={x} y={y + 4} textAnchor={x > C + 5 ? 'start' : x < C - 5 ? 'end' : 'middle'}>
                    {it[0]}
                  </text>
                );
              })}
            </svg>
            <p className="rqr-key">
              <span>
                <i className="is-limit" /> Review line
              </span>
              <span>
                <i className="is-area" /> Risk found
              </span>
            </p>
          </div>

          <div className="rqr-reg">
            <p className="rqr-reg-h">
              <span className="rqi-lab">Risk register · RFQ-2291</span>
              <em>
                {Math.min(shown, n)} of {n} checked
              </em>
            </p>
            <ul>
              {d.items.map(([area, status, , finding, route, level], i) => (
                <li
                  key={area}
                  className={`is-${level}${i < shown ? ' is-on' : ''}${hover === i ? ' is-hot' : ''}`}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <span className="rqr-ic">{level === 'ok' ? <Check size={13} strokeWidth={3} /> : <AlertTriangle size={13} />}</span>
                  <div className="rqr-t">
                    <b>{area}</b>
                    <small>{finding}</small>
                  </div>
                  <div className="rqr-s">
                    <em>{status}</em>
                    {route && (
                      <small>
                        <ArrowRight size={11} />
                        {route}
                      </small>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className={`rqr-verdict${tick > n ? ' is-on' : ''}`}>
              <span>
                <AlertTriangle size={18} />
              </span>
              <div>
                <b>{d.verdict[0]}</b>
                <small>{d.verdict[1]}</small>
              </div>
              <em>{open} open</em>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
