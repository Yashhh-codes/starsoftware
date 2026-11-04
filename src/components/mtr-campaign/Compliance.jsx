import { useRef } from 'react';
import { Icon } from './icons';
import { useStepLoop } from './hooks';

// The checks an MTR goes through, landing one by one, then the count of
// what was flagged.
function ComplianceChecks({ checks }) {
  const ref = useRef(null);
  const shown = useStepLoop(ref, checks.length + 1);
  const flagged = checks.slice(0, Math.min(shown, checks.length)).filter(([, , status]) => status === 'warn').length;
  return (
    <div
      className="ci-art"
      ref={ref}
      role="img"
      aria-label="An MTR checked against ASTM A6, ASTM A370, the customer PO, ISO 9001 and EN 10204, with two items flagged for review"
    >
      <ul className="ci-checks" aria-hidden="true">
        {checks.map(([standard, what, status], i) => (
          <li key={standard} className={`is-${status}${shown > i ? ' is-in' : ''}`}>
            <span className="ci-ic">
              <Icon name={status === 'ok' ? 'check' : 'alert'} />
            </span>
            <div>
              <b>{standard}</b>
              <small>{what}</small>
            </div>
          </li>
        ))}
      </ul>
      <p className={`ci-result${shown > checks.length ? ' is-in' : ''}`} aria-hidden="true">
        <Icon name="alert" />
        {flagged}
        {' items flagged before the material moves'}
      </p>
    </div>
  );
}

export default function Compliance({ intro, checks }) {
  // The question in two parts, its key word set apart.
  const [lead, rest] = intro.question.split('. ');
  const [before, after] = rest.split('prove');
  return (
    <section className="sec ci-sec" id="compliance">
      <div className="wrap">
        <p className="oa-k ci-k">
          <i aria-hidden="true" />
          {intro.heading}
        </p>
        <h2 className="ci-big">
          {lead}
          {'. '}
          <span>
            {before}
            <em>prove</em>
            {after}
          </span>
        </h2>
        <div className="ci-grid">
          <p className="ci-p">{intro.text}</p>
          <ComplianceChecks checks={checks} />
        </div>
      </div>
    </section>
  );
}
