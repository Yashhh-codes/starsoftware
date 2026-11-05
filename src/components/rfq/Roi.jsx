import { useState } from 'react';
import Statement from '../mtr-campaign/Statement';
import { Icon } from '../mtr-campaign/icons';

const money = (n) => `$${n.toLocaleString('en-US')}`;

// The calculator: estimators × RFQ hours a week, the share Star takes off,
// and what those hours cost in a year at the median estimator's wage.
function RoiCalculator({ roi }) {
  const [estimators, setEstimators] = useState(3);
  const [hours, setHours] = useState(20);
  const hourly = roi.annualWage / 52 / 40;
  const total = estimators * hours;
  const saved = total * roi.reduction;
  const annual = Math.round(saved * hourly * 52);

  return (
    <div className="ro-example">
      <p className="ro-k">
        {'Illustrative ROI calculator '}
        <span>(labor only)</span>
      </p>
      <div className="ro-sliders">
        <label>
          <span>
            {'Number of estimators '}
            <b>{estimators}</b>
          </span>
          <input type="range" min="1" max="20" value={estimators} onChange={(e) => setEstimators(+e.target.value)} />
        </label>
        <label>
          <span>
            {'RFQ hours per estimator per week '}
            <b>{hours}</b>
          </span>
          <input type="range" min="5" max="40" step="1" value={hours} onChange={(e) => setHours(+e.target.value)} />
        </label>
      </div>
      <dl>
        <div>
          <dt>Total RFQ hours per week</dt>
          <dd>{total}</dd>
        </div>
        <div>
          <dt>Manual effort reduction with Star</dt>
          <dd>{Math.round(roi.reduction * 100)}%</dd>
        </div>
        <div>
          <dt>Hours saved per week</dt>
          <dd>{Math.round(saved * 10) / 10}</dd>
        </div>
        <div>
          <dt>Hourly cost (based on {money(roi.annualWage)}/year)</dt>
          <dd>${hourly.toFixed(2)}</dd>
        </div>
        <div className="ro-total" aria-live="polite">
          <dt>Annual labor capacity released</dt>
          <dd>{money(annual)}</dd>
        </div>
      </dl>
      <small>{roi.exampleSource}</small>
    </div>
  );
}

export default function Roi({ roi }) {
  return (
    <section className="sec sec-soft" id="roi">
      <div className="wrap">
        <Statement text={roi.heading} />
        <div className="ro-stats">
          {roi.stats.map(([value, label, text, icon]) => (
            <div key={label} className="ro-stat">
              <p>
                <span className="ico">
                  <Icon name={icon} />
                </span>
                {label}
              </p>
              <b>
                {'↑ '}
                {value}
              </b>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div className="ro-grid">
          <div className="ro-bench">
            <p className="ro-k">Industry benchmark</p>
            <div className="ro-donuts">
              {roi.benchmarks.map(([value, text]) => (
                <div key={value}>
                  <span className="ro-donut" style={{ '--p': parseInt(value, 10) }}>
                    <b>{value}</b>
                  </span>
                  <p>{text}</p>
                </div>
              ))}
            </div>
            <small>{roi.benchmarkSource}</small>
            <blockquote>{roi.quote}</blockquote>
          </div>
          <RoiCalculator roi={roi} />
        </div>
      </div>
    </section>
  );
}
