import React, { useEffect, useRef, useState } from 'react';
import { BadgeCheck, Check, Database, FolderOpen, Pause, Play, ScanText, Send, TriangleAlert, UserCheck } from 'lucide-react';
import { useInView, usePrefersReducedMotion, useStepper } from '../../hooks/useMotion';

// "Four steps. One controlled flow." Each step's card has a small screen of
// that step at work; the active one plays, the ones before it stay
// finished, the ones after wait. Visitors can pick a step (autoplay picks
// up again a little later) or pause. The figures are the same illustrative
// ones as the hero and the review card.

const STEP_MS = [2900, 2900, 3100, 2900];
// How long a picked step stays before autoplay carries on.
const HOLD_MS = 7000;
const ICONS = [ScanText, BadgeCheck, UserCheck, Send];

function ExtractScreen() {
  return (
    <div className="wf-screen wf-screen--extract">
      <div className="wf-doc">
        <span className="wf-doc-head" />
        <span className="wf-doc-line" style={{ width: '78%' }} />
        <span className="wf-doc-line" style={{ width: '62%' }} />
        <span className="wf-doc-grid">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
        <span className="wf-scan" />
      </div>
      <div className="wf-out">
        <span className="wf-chip" style={{ '--d': 0 }}>
          C <b>0.19 %</b>
        </span>
        <span className="wf-chip" style={{ '--d': 1 }}>
          Yield <b>58 ksi</b>
        </span>
        <span className="wf-chip" style={{ '--d': 2 }}>
          Elong. <b>19 %</b>
        </span>
      </div>
    </div>
  );
}

const RULES = [
  { field: 'Carbon', rule: '0.19 ≤ 0.23', ok: true },
  { field: 'Yield', rule: '58 ≥ 50', ok: true },
  { field: 'Elong.', rule: '19 ≥ 21', ok: false },
];

function CheckScreen() {
  return (
    <div className="wf-screen wf-screen--check">
      <span className="wf-spec">ASTM A572 Gr. 50</span>
      <ul className="wf-rules">
        {RULES.map((r, i) => (
          <li key={r.field} className={r.ok ? 'is-ok' : 'is-warn'} style={{ '--d': i }}>
            <span className="wf-rule-field">{r.field}</span>
            <span className="wf-rule">{r.rule}</span>
            <span className="wf-rule-mark">{r.ok ? <Check size={11} strokeWidth={3} /> : <TriangleAlert size={11} />}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReviewScreen() {
  return (
    <div className="wf-screen wf-screen--review">
      <span className="wf-gauge">
        <svg viewBox="0 0 44 44" aria-hidden="true">
          <circle className="wf-gauge-track" cx="22" cy="22" r="18" />
          <circle className="wf-gauge-fill" cx="22" cy="22" r="18" pathLength="100" />
        </svg>
        <span className="wf-gauge-value">
          94<small>%</small>
        </span>
      </span>
      <div className="wf-route">
        <span className="wf-person">
          <span className="wf-avatar">
            <UserCheck size={12} />
          </span>
          <span>
            <b>QA reviewer</b>
            Elongation exception
          </span>
        </span>
        <span className="wf-buttons">
          <span className="wf-btn wf-btn--go">Approve</span>
          <span className="wf-btn">Retest</span>
        </span>
      </div>
    </div>
  );
}

function HandoffScreen() {
  return (
    <div className="wf-screen wf-screen--handoff">
      <span className="wf-record">
        <Check size={11} strokeWidth={3} /> MTR record
      </span>
      <span className="wf-fork" aria-hidden="true">
        <span className="wf-fork-dot" />
      </span>
      <span className="wf-targets">
        <span className="wf-target" style={{ '--d': 0 }}>
          <Database size={13} /> ERP
          <span className="wf-target-ok">
            <Check size={10} strokeWidth={3.5} />
          </span>
        </span>
        <span className="wf-target" style={{ '--d': 1 }}>
          <FolderOpen size={13} /> Documents
          <span className="wf-target-ok">
            <Check size={10} strokeWidth={3.5} />
          </span>
        </span>
      </span>
    </div>
  );
}

const SCREENS = [ExtractScreen, CheckScreen, ReviewScreen, HandoffScreen];

export default function WorkflowFlow({ steps }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { threshold: 0.35 });
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const playing = inView && !reduced && !paused && !holding;
  const [active, goTo] = useStepper(STEP_MS, playing);

  // A picked step holds for a while, then autoplay carries on from it.
  useEffect(() => {
    if (!holding) return undefined;
    const t = setTimeout(() => setHolding(false), HOLD_MS);
    return () => clearTimeout(t);
  }, [holding, active]);

  const pick = (i) => {
    goTo(i);
    setHolding(true);
  };

  const count = steps.length;
  const shown = reduced ? count - 1 : active;

  return (
    <div ref={ref} className={`wf${reduced ? ' is-still' : ''}${playing ? ' is-playing' : ''}`}>
      <ol className="wf-steps">
        {steps.map((step, i) => {
          const state = reduced || i < shown ? 'done' : i === shown ? 'active' : 'next';
          const Screen = SCREENS[i];
          const Icon = ICONS[i];
          return (
            <li
              key={step.title}
              className={`wf-step is-${state}`}
              data-reveal
              style={{ '--rv-delay': `${i * 110}ms` }}
              onClick={() => pick(i)}
            >
              {i > 0 && (
                <span className={`wf-link${i <= shown ? ' is-lit' : ''}${i === shown && !reduced ? ' is-moving' : ''}`} aria-hidden="true">
                  <span className="wf-link-dot" />
                </span>
              )}
              <div className="wf-card">
                {/* Remounted on each turn so its animation plays from the start. */}
                <div className="wf-stage" key={state === 'active' ? 'run' : 'still'} aria-hidden="true">
                  <Screen />
                </div>
                <div className="wf-body">
                  <span className="wf-meta">
                    <span className="wf-icon">
                      <Icon size={16} />
                    </span>
                    <span className="wf-n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="wf-state">{state === 'done' ? 'Done' : state === 'active' ? 'Running' : 'Next'}</span>
                  </span>
                  <h3 className="mt-h3 wf-title">
                    <button type="button" className="wf-title-btn" onClick={() => pick(i)} aria-pressed={state === 'active'}>
                      {step.title}
                    </button>
                  </h3>
                  <p className="mt-text">{step.text}</p>
                </div>
                {state === 'active' && !reduced && (
                  <span
                    key={`p-${active}`}
                    className="wf-progress"
                    style={{ animationDuration: `${STEP_MS[i]}ms`, animationPlayState: playing ? 'running' : 'paused' }}
                    aria-hidden="true"
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="wf-control">
        <button
          type="button"
          className="wf-control-btn"
          onClick={() => {
            setPaused((p) => !p);
            setHolding(false);
          }}
          aria-label={paused || reduced ? 'Play the steps' : 'Pause the steps'}
          disabled={reduced}
        >
          {paused || reduced ? <Play size={13} /> : <Pause size={13} />}
        </button>
        <span className="wf-control-text">
          Step {shown + 1} of {count} · <strong>{steps[shown].title}</strong>
        </span>
        <span className="wf-control-dots" aria-hidden="true">
          {steps.map((step, i) => (
            <span key={step.title} className={i <= shown ? 'is-on' : ''} />
          ))}
        </span>
      </div>
    </div>
  );
}
