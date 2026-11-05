import { useRef } from 'react';
import Statement from '../mtr-campaign/Statement';
import { Icon } from '../mtr-campaign/icons';
import { useReplay } from './useReplay';

// Six checks either side of a gauge: each lands in turn as the score
// climbs to its value, then the verdict.
export default function RiskRadar({ radar }) {
  const ref = useRef(null);
  const count = radar.items.length;
  const step = useReplay(ref, count + 2, 320);
  const shown = Math.min(step, count);
  const score = Math.round((radar.score * Math.min(step, count + 1)) / (count + 1));

  const check = ([area, status, findings, level], i) => (
    <div key={area} className={`rd-c is-${level}${shown > i ? ' is-in' : ''}`}>
      <p>
        <span className="rd-ic">
          <Icon name={level === 'ok' ? 'check' : 'alert'} />
        </span>
        <b>{area}</b>
        <em>{status}</em>
      </p>
      <ul>
        {findings.map((finding) => (
          <li key={finding}>{finding}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="sec" id="radar">
      <div className="wrap">
        <Statement text={radar.heading} />
        <div className="rd" ref={ref}>
          <div className="rd-col">{radar.items.slice(0, 3).map((item, i) => check(item, i))}</div>
          <div className="rd-gauge" role="img" aria-label={`Quote risk score ${radar.score} out of 100`}>
            <span className="rd-sweep" aria-hidden="true" />
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="50" className="rd-track" />
              <circle cx="60" cy="60" r="50" className="rd-fill" style={{ strokeDashoffset: 314 - (314 * score) / 100 }} />
            </svg>
            <div>
              <b>{score}</b>
              <span>/ 100</span>
              <small>Quote risk score</small>
            </div>
          </div>
          <div className="rd-col">{radar.items.slice(3).map((item, i) => check(item, i + 3))}</div>
          <div className={`rd-verdict${step > count ? ' is-in' : ''}`}>
            <Icon name="alert" />
            <b>{radar.verdict[0]}</b>
            <span>{radar.verdict[1]}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
