import React, { useEffect, useRef, useState } from 'react';
import { Check, FileSearch, Pause, Play, RotateCcw, TriangleAlert, UserCheck } from 'lucide-react';
import { useInView, usePrefersReducedMotion, useStepper } from '../../hooks/useMotion';

// The reviewer section's animated card: values come off an MTR, are checked
// against the requirement, the exception shows its source, goes to a
// quality reviewer, and the reviewer picks the next action. Visitors can
// jump between stages, pause it, and choose the action themselves. Labelled
// as an illustration (REVIEWER.visualLabel), not a product screenshot.

export const STAGES = [
  { label: 'Extract', ms: 2600 },
  { label: 'Check', ms: 2600 },
  { label: 'Context', ms: 3000 },
  { label: 'Route', ms: 2800 },
  { label: 'Act', ms: 4600 },
];
const STAGE_MS = STAGES.map((s) => s.ms);
const ACT = STAGES.length - 1;

// ASTM A572 Grade 50 limits; the values are made up for the illustration.
const SPEC = 'ASTM A572 Grade 50';
const ROWS = [
  { field: 'Carbon (C)', value: '0.19 %', req: '≤ 0.23 %', conf: 99, ok: true },
  { field: 'Yield strength', value: '58 ksi', req: '≥ 50 ksi', conf: 98, ok: true },
  { field: 'Tensile strength', value: '74 ksi', req: '≥ 65 ksi', conf: 97, ok: true },
  { field: 'Elongation (2 in)', value: '19 %', req: '≥ 21 %', conf: 94, ok: false },
];

const ACTIONS = [
  { id: 'approve', label: 'Approve with note', done: 'Approved with note' },
  { id: 'retest', label: 'Request retest', done: 'Retest requested' },
  { id: 'hold', label: 'Hold material', done: 'Material on hold' },
];
// What the card picks itself when the visitor doesn't.
const AUTO_ACTION = 'retest';

function statusOf(row, step, choice) {
  if (step < 1) return { tone: 'idle', text: '' };
  if (row.ok) return step >= 3 ? { tone: 'ok', text: 'Auto-approved' } : { tone: 'ok', text: 'Pass' };
  if (step < 3) return { tone: 'warn', text: 'Exception' };
  if (step === ACT && choice) return { tone: 'done', text: ACTIONS.find((a) => a.id === choice).done };
  return { tone: 'warn', text: 'With reviewer' };
}

export default function ReviewDemo({ onStage }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { threshold: 0.35 });
  const [paused, setPaused] = useState(false);
  const playing = inView && !paused && !reduced;
  const [step, goTo] = useStepper(STAGE_MS, playing);
  const [choice, setChoice] = useState(null);
  const [picked, setPicked] = useState(false);

  // People who ask for reduced motion get the finished review to read.
  useEffect(() => {
    if (reduced) goTo(ACT);
  }, [reduced, goTo]);

  // A new run starts with no action chosen; on the last stage the card
  // chooses one itself, unless the visitor got there first.
  useEffect(() => {
    if (step !== ACT) {
      setChoice(null);
      setPicked(false);
      return undefined;
    }
    if (picked || !playing) return undefined;
    const t = setTimeout(() => setChoice(AUTO_ACTION), 1700);
    return () => clearTimeout(t);
  }, [step, picked, playing]);

  useEffect(() => {
    onStage?.(step);
  }, [step, onStage]);

  const choose = (id) => {
    setChoice(id);
    setPicked(true);
    setPaused(true);
  };

  const replay = () => {
    setPaused(false);
    goTo(0);
  };

  const exception = ROWS.find((row) => !row.ok);

  return (
    <div ref={ref} className={`rd${playing ? ' is-playing' : ''}`} data-step={step}>
      <div className="rd-top">
        <span className="rd-label">Illustrative MTR review workflow</span>
        <div className="rd-controls">
          <button
            type="button"
            className="rd-icon-btn"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Play the review' : 'Pause the review'}
            disabled={reduced}
          >
            {paused || reduced ? <Play size={14} /> : <Pause size={14} />}
          </button>
          <button type="button" className="rd-icon-btn" onClick={replay} aria-label="Replay from the start">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      <div className="rd-tabs" role="group" aria-label="Review stages">
        {STAGES.map((stage, i) => (
          <button
            key={stage.label}
            type="button"
            aria-pressed={step === i}
            className={`rd-tab${step === i ? ' is-active' : ''}${step > i ? ' is-past' : ''}`}
            onClick={() => goTo(i)}
          >
            <span className="rd-tab-n">{i + 1}</span>
            {stage.label}
            {step === i && (
              <span
                key={`${step}-${playing}`}
                className="rd-tab-progress"
                style={{ animationDuration: `${stage.ms}ms`, animationPlayState: playing ? 'running' : 'paused' }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="rd-meta">
        <span className="rd-pill">Supplier MTR</span>
        <span className="rd-pill">
          Spec <strong>{SPEC}</strong>
        </span>
        <span className="rd-pill">
          Heat no. <span className="rd-mask">••••••</span>
        </span>
      </div>

      <div className="rd-table" role="table" aria-label="Values checked against the requirement">
        <div className="rd-tr rd-th" role="row">
          <span role="columnheader">Field</span>
          <span role="columnheader">Value</span>
          <span role="columnheader" className="rd-col-req">
            Requirement
          </span>
          <span role="columnheader" className="rd-col-conf">
            Confidence
          </span>
          <span role="columnheader">Status</span>
        </div>
        {ROWS.map((row, i) => {
          const status = statusOf(row, step, choice);
          return (
            <div
              key={row.field}
              role="row"
              className={`rd-tr${!row.ok && step >= 1 ? ' is-exception' : ''}${!row.ok && step === 2 ? ' is-source' : ''}`}
              style={{ '--i': i }}
            >
              <span role="cell" className="rd-field">
                {row.field}
              </span>
              <span role="cell" className="rd-value">
                {row.value}
              </span>
              <span role="cell" className="rd-req rd-col-req">
                {step >= 1 ? row.req : '—'}
              </span>
              <span role="cell" className="rd-conf rd-col-conf">
                <span className="rd-conf-bar">
                  <span style={{ width: `${row.conf}%` }} />
                </span>
                {row.conf}%
              </span>
              <span role="cell">
                {status.text && (
                  <span className={`rd-status is-${status.tone}`}>
                    {status.tone === 'ok' && <Check size={12} strokeWidth={3} />}
                    {status.tone === 'warn' && <TriangleAlert size={12} />}
                    {status.tone === 'done' && <Check size={12} strokeWidth={3} />}
                    {status.text}
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* One panel per stage, crossfading in a space of fixed height. */}
      <div className="rd-stage">
        <div className={`rd-panel${step === 0 ? ' is-on' : ''}`}>
          <p className="rd-panel-title">Reading values from the supplier MTR</p>
          <span className="rd-progress">
            <span key={step === 0 ? 'run' : 'idle'} style={{ animationDuration: `${STAGES[0].ms}ms` }} />
          </span>
          <p className="rd-panel-note">Chemical, mechanical and hardness data, wherever the supplier put it.</p>
        </div>

        <div className={`rd-panel${step === 1 ? ' is-on' : ''}`}>
          <p className="rd-panel-title">Compared with {SPEC}</p>
          <div className="rd-summary">
            <span className="rd-status is-ok">
              <Check size={12} strokeWidth={3} /> 3 within requirement
            </span>
            <span className="rd-status is-warn">
              <TriangleAlert size={12} /> 1 exception
            </span>
          </div>
          <p className="rd-panel-note">Values that pass can be approved automatically; exceptions go to a reviewer.</p>
        </div>

        <div className={`rd-panel rd-source${step === 2 ? ' is-on' : ''}`}>
          <div className="rd-snippet">
            <span className="rd-snippet-head">
              <FileSearch size={13} /> Source · mechanical properties table
            </span>
            <span className="rd-snippet-row">
              <span className="rd-bar" />
              <span className="rd-bar rd-bar--s" />
            </span>
            <span className="rd-snippet-row is-hit">
              <span>{exception.field}</span>
              <strong>{exception.value}</strong>
            </span>
            <span className="rd-snippet-row">
              <span className="rd-bar" />
              <span className="rd-bar rd-bar--s" />
            </span>
          </div>
          <div className="rd-rule">
            <span className="rd-rule-label">Requirement</span>
            <strong>
              {exception.req} <span>{SPEC}</span>
            </strong>
            <span className="rd-rule-gap">2 points below the minimum</span>
          </div>
        </div>

        <div className={`rd-panel rd-route${step === 3 ? ' is-on' : ''}`}>
          <span className="rd-route-auto">
            <Check size={13} strokeWidth={3} /> 3 values auto-approved
          </span>
          <span className="rd-route-line" />
          <span className="rd-person">
            <span className="rd-avatar">
              <UserCheck size={15} />
            </span>
            <span>
              <strong>Quality reviewer</strong>
              Elongation exception, with its source and requirement
            </span>
          </span>
        </div>

        <div className={`rd-panel rd-act${step === ACT ? ' is-on' : ''}${choice ? ' is-chosen' : ''}`}>
          <p className="rd-panel-title">Next action for the exception</p>
          <div className="rd-actions">
            {ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                className={`rd-action${choice === action.id ? ' is-picked' : ''}`}
                onClick={() => choose(action.id)}
                tabIndex={step === ACT ? 0 : -1}
              >
                {action.label}
              </button>
            ))}
          </div>
          <p className="rd-result" aria-live="polite">
            {choice ? (
              <>
                <Check size={13} strokeWidth={3} /> {ACTIONS.find((a) => a.id === choice).done}, recorded with the MTR
              </>
            ) : (
              'Pick one, or watch the reviewer decide.'
            )}
          </p>
          {!picked && playing && step === ACT && <span className="rd-cursor" aria-hidden="true" />}
        </div>
      </div>
    </div>
  );
}
