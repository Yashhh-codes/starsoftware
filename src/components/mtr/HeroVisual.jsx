import React, { useRef } from 'react';
import { Check, Database, FileText, TriangleAlert, UserCheck } from 'lucide-react';
import { useInView, usePrefersReducedMotion, useStepper } from '../../hooks/useMotion';

// The hero's illustration: a supplier MTR is read, its values captured and
// checked, one goes to review, and the approved record moves to the ERP.
// It is labelled as an illustration and carries no values or customer
// data; the approved product screenshot or GIF replaces it when there is
// one.

const STEP_MS = [1100, 1700, 2100, 1900, 1700, 2300];
const FINISHED = STEP_MS.length - 1;

const STATUS_LINE = [
  'Waiting for supplier MTR',
  'Reading the certificate',
  'Capturing values',
  'Checking ASTM requirements',
  'Exception reviewed',
  'Approved results sent to ERP',
];

const ROWS = ['Chemical composition', 'Mechanical properties', 'Hardness', 'Heat & grade'];
// The row that needs a reviewer before it's approved.
const EXCEPTION = 2;

function rowState(i, step) {
  if (step < 2) return 'idle';
  if (step < 3) return 'captured';
  if (i === EXCEPTION && step < 4) return 'review';
  return i === EXCEPTION ? 'approved' : 'pass';
}

const CHIP = {
  idle: null,
  captured: 'Captured',
  pass: 'Checked',
  review: 'Review',
  approved: 'Approved',
};

export default function HeroVisual() {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { threshold: 0.3 });
  const [playingStep] = useStepper(STEP_MS, inView && !reduced);
  const step = reduced ? FINISHED : playingStep;

  return (
    <div
      ref={ref}
      className="mv"
      data-step={step}
      role="img"
      aria-label="Illustration: a supplier MTR is read, its values checked against ASTM requirements, an exception reviewed, and the approved results sent to the ERP."
    >
      <span className="mv-tag" aria-hidden="true">
        Illustrative
      </span>

      <div className="mv-paper" aria-hidden="true">
        <div className="mv-paper-head">
          <span className="mv-paper-ic">
            <FileText size={16} />
          </span>
          <span className="mv-paper-title">Supplier MTR</span>
          <span className="mv-bar mv-bar--chip" />
        </div>
        <div className="mv-paper-lines">
          <span className="mv-bar" style={{ width: '72%' }} />
          <span className="mv-bar" style={{ width: '54%' }} />
        </div>
        <div className="mv-paper-table">
          {ROWS.map((row, i) => (
            <div key={row} className="mv-paper-row" style={{ '--i': i }}>
              <span className="mv-bar" style={{ width: `${46 + ((i * 17) % 30)}%` }} />
              <span className="mv-bar mv-bar--short" />
              <span className="mv-bar mv-bar--short" />
            </div>
          ))}
        </div>
        <span className="mv-scan" />
      </div>

      <div className="mv-panel" aria-hidden="true">
        <div className="mv-panel-head">
          <span className="mv-panel-title">Review-ready data</span>
          <span className={`mv-live${step === FINISHED ? ' is-done' : ''}`}>
            <span className="mv-live-dot" />
            {STATUS_LINE[step]}
          </span>
        </div>
        <ul className="mv-rows">
          {ROWS.map((row, i) => {
            const state = rowState(i, step);
            return (
              <li key={row} className={`mv-row is-${state}`} style={{ '--i': i }}>
                <span className="mv-row-label">{row}</span>
                <span className="mv-row-value">
                  <span className="mv-bar" />
                </span>
                <span className="mv-chip">
                  {state === 'review' && <TriangleAlert size={12} />}
                  {(state === 'pass' || state === 'approved') && <Check size={12} strokeWidth={3} />}
                  {CHIP[state] || <span className="mv-dots" />}
                </span>
              </li>
            );
          })}
        </ul>
        <div className={`mv-reviewer${step >= 3 ? ' is-on' : ''}${step >= 4 ? ' is-done' : ''}`}>
          <span className="mv-reviewer-ic">
            <UserCheck size={14} />
          </span>
          {step >= 4 ? 'Quality reviewer approved the exception' : 'Exception routed to a quality reviewer'}
        </div>
      </div>

      <div className={`mv-erp${step === FINISHED ? ' is-on' : ''}`} aria-hidden="true">
        <span className="mv-erp-ic">
          <Database size={18} />
        </span>
        <span className="mv-erp-text">
          <strong>ERP</strong>
          <span>{step === FINISHED ? 'Approved record received' : 'Waiting for approval'}</span>
        </span>
      </div>
      <span className={`mv-link${step === FINISHED ? ' is-on' : ''}`} aria-hidden="true" />
    </div>
  );
}
