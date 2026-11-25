import { useRef, useState } from 'react';
import { Clock3, Gauge, Layers, TrendingUp } from 'lucide-react';
import SecHead from '../mtrx/SecHead';
import { useCountUp } from '../mtrx/motion';
import { R_ROI } from '../../data/rfqX';

const money = (n) => `$${Math.round(n).toLocaleString('en-US')}`;
const STAT_ICONS = [Gauge, Layers, Clock3, TrendingUp];
const STAT_FILL = [0.6, 0.75, 0.9, 0.5];

function Stat({ stat, i }) {
  const ref = useRef(null);
  const [to, pre, suf, label, text] = stat;
  const v = useCountUp(ref, to, { duration: 1300 + i * 150 });
  const Icon = STAT_ICONS[i];
  return (
    <div ref={ref} className="rqo-stat" data-reveal style={{ '--rv-delay': `${i * 70}ms`, '--f': (v / to) * STAT_FILL[i] }}>
      <p>
        <span>
          <Icon size={16} />
        </span>
        {label}
      </p>
      <b>
        {pre}
        {Math.round(v)}
        {suf}
      </b>
      <small>{text}</small>
      <i className="rqo-meter" aria-hidden="true" />
    </div>
  );
}

function Ring({ value, text, i }) {
  const ref = useRef(null);
  const v = useCountUp(ref, value, { duration: 1400 });
  return (
    <div ref={ref} className="rqo-ring">
      <span style={{ '--p': v }} className={i ? 'is-b' : ''}>
        <b>{Math.round(v)}%</b>
      </span>
      <p>{text}</p>
    </div>
  );
}

// The ROI: four outcomes that count up, the buyer benchmark, and the
// calculator, whose bars redraw as the sliders move.
export default function Roi() {
  const d = R_ROI;
  const [estimators, setEstimators] = useState(3);
  const [hours, setHours] = useState(20);
  const hourly = d.annualWage / 52 / 40;
  const total = estimators * hours;
  const saved = total * d.reduction;
  const annual = saved * hourly * 52;
  const fte = (saved / 40).toFixed(1);

  return (
    <section id="roi" className="mx-sec mx-sec--soft rqx-sec rqx-roi" aria-labelledby="rqo-title">
      <div className="mt-wrap">
        <SecHead id="rqo-title" label={d.label} title={d.title} accent={d.accent} lead={d.lead} />

        <div className="rqo-stats">
          {d.stats.map((s, i) => (
            <Stat key={s[3]} stat={s} i={i} />
          ))}
        </div>

        <div className="rqo-grid">
          <div className="rqo-calc" data-reveal style={{ '--rv-delay': '60ms' }}>
            <div className="rqo-calc-h">
              <p className="rqi-lab">ROI calculator · labor only</p>
              <small>Move the sliders to match your team</small>
            </div>
            <div className="rqo-sliders">
              <label>
                <span>
                  Estimators <b>{estimators}</b>
                </span>
                <input type="range" min="1" max="20" value={estimators} onChange={(e) => setEstimators(+e.target.value)} style={{ '--v': `${((estimators - 1) / 19) * 100}%` }} />
              </label>
              <label>
                <span>
                  RFQ hours per estimator, per week <b>{hours}</b>
                </span>
                <input type="range" min="5" max="40" value={hours} onChange={(e) => setHours(+e.target.value)} style={{ '--v': `${((hours - 5) / 35) * 100}%` }} />
              </label>
            </div>

            <div className="rqo-bars" aria-hidden="true">
              <p>
                <span>Today</span>
                <i style={{ '--w': 1 }} />
                <b>{total} h / week</b>
              </p>
              <p className="is-star">
                <span>With Star</span>
                <i style={{ '--w': 1 - d.reduction }} />
                <b>{Math.round((total - saved) * 10) / 10} h / week</b>
              </p>
            </div>

            <div className="rqo-out" aria-live="polite">
              <div>
                <small>Hours released per week</small>
                <b>{Math.round(saved * 10) / 10}</b>
                <span>about {fte} estimators’ worth</span>
              </div>
              <div className="rqo-big">
                <small>Annual labor capacity released</small>
                <b>{money(annual)}</b>
                <span>
                  at ${hourly.toFixed(2)} an hour, {Math.round(d.reduction * 100)}% less manual effort
                </span>
              </div>
            </div>
            <p className="rqo-src">{d.exampleSource}</p>
          </div>

          <div className="rqo-bench" data-reveal style={{ '--rv-delay': '120ms' }}>
            <p className="rqi-lab">What buyers say</p>
            <div className="rqo-rings">
              {d.benchmarks.map(([v, t], i) => (
                <Ring key={v} value={v} text={t} i={i} />
              ))}
            </div>
            <blockquote>{d.quote}</blockquote>
            <small className="rqo-src">Source: {d.benchmarkSource}</small>
          </div>
        </div>
      </div>
    </section>
  );
}
