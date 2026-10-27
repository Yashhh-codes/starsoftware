import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Bot,
  Check,
  FileText,
  ListChecks,
  Mail,
  Pause,
  Play,
  Plus,
  RotateCcw,
  ShieldCheck,
  TriangleAlert,
  UserCheck,
} from 'lucide-react';
import { useInView, usePrefersReducedMotion, useStepper } from '../../hooks/useMotion';
import { PRODUCT, SPEC } from './sample';

// The reviewer section's animation: only what happens when a value needs
// human attention (the hero shows the whole workflow). The supplier's
// result and the product requirement come together as review context, the
// reason for attention shows, the reviewer-led path is taken, and the QA
// reviewer is emailed with the next action. One stage per point beside it
// (onStage). Visitors can pause or replay it; reduced motion shows it all.

const STAGES = [2800, 2600, 2600, 3800];
const LAST = STAGES.length - 1;

export default function ExceptionReview({ onStage }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { threshold: 0.35 });
  const [paused, setPaused] = useState(false);
  const playing = inView && !paused && !reduced;
  const [step, goTo] = useStepper(STAGES, playing);
  const [run, setRun] = useState(0);
  const s = reduced ? LAST : step;

  // Each time round, the flow is drawn afresh so its first stage plays.
  useEffect(() => {
    if (step === 0) setRun((r) => r + 1);
  }, [step]);

  useEffect(() => {
    onStage?.(s);
  }, [s, onStage]);

  const on = (stage) => (s >= stage ? ' is-on' : '');

  return (
    <div ref={ref} className={`xr${playing ? ' is-playing' : ''}${reduced ? ' is-still' : ''}`}>
      <div className="xr-top">
        <span className="xr-label">Illustrative exception review</span>
        <div className="xr-controls">
          <button
            type="button"
            className="xr-btn-icon"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused || reduced ? 'Play the review' : 'Pause the review'}
            disabled={reduced}
          >
            {paused || reduced ? <Play size={14} /> : <Pause size={14} />}
          </button>
          <button
            type="button"
            className="xr-btn-icon"
            onClick={() => {
              goTo(0);
              setRun((r) => r + 1);
              setPaused(false);
            }}
            aria-label="Replay the review"
            disabled={reduced}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      <div
        key={run}
        className="xr-flow"
        role="img"
        aria-label={`Illustration: the supplier's water result of 0.62 % and the product requirement of at most 0.50 % are shown together, the reason for attention is that the result is outside the required range, the reviewer-led path is taken, and the QA reviewer is emailed to review the result against the source COA.`}
      >
        <div className="xr-inputs">
          <div className="xr-card xr-in xr-in--source">
            <span className="xr-kicker">
              <FileText size={13} /> Supplier COA
            </span>
            <span className="xr-field">Water (KF)</span>
            <span className={`xr-value${on(1)}`}>0.62 %</span>
            <span className="xr-note">Supplier limit ≤ 1.0 % · Conforms</span>
          </div>
          <span className="xr-plus">
            <Plus size={14} strokeWidth={2.5} />
          </span>
          <div className="xr-card xr-in xr-in--req">
            <span className="xr-kicker">
              <ShieldCheck size={13} /> Product requirement
            </span>
            <span className="xr-field">{SPEC}</span>
            <span className="xr-value">≤ 0.50 %</span>
            <span className="xr-note">{PRODUCT}</span>
          </div>
        </div>

        <span className="xr-link xr-link--a">
          <span className="xr-link-dot" />
        </span>

        <div className="xr-card xr-context">
          <span className="xr-kicker">
            <ListChecks size={13} /> Review context
          </span>
          <div className="xr-compare">
            <span className="xr-side">
              <small>Reported</small>
              <b>0.62 %</b>
            </span>
            <span className="xr-vs">vs</span>
            <span className="xr-side">
              <small>Required</small>
              <b>≤ 0.50 %</b>
            </span>
            <span className={`xr-over${on(1)}`}>+0.12 % over</span>
          </div>
          <p className={`xr-reason${on(1)}`}>
            <TriangleAlert size={14} /> Outside the required range
          </p>
          <div className={`xr-paths${on(2)}`}>
            <span className="xr-path xr-path--auto">
              <Bot size={14} /> Automated
            </span>
            <span className="xr-path xr-path--review">
              <UserCheck size={14} /> Reviewer-led
              <span className="xr-path-ok">
                <Check size={10} strokeWidth={3.5} />
              </span>
            </span>
          </div>
        </div>

        <span className={`xr-link xr-link--b${on(3)}`}>
          <span className="xr-link-dot" />
        </span>

        <div className={`xr-card xr-notify${on(3)}`}>
          <span className="xr-kicker">
            <Mail size={13} /> QA notification
          </span>
          <div className="xr-mail">
            <span className="xr-avatar">
              <UserCheck size={14} />
            </span>
            <span className="xr-mail-text">
              <b>To: QA reviewer</b>
              Water (KF) outside the required range
            </span>
            <span className="xr-sent">
              <Check size={11} strokeWidth={3} /> Sent
            </span>
          </div>
          <div className="xr-next">
            <span className="xr-next-text">
              <small>Next action</small>
              Review the result against the source COA
            </span>
            <span className="xr-next-btn">
              Open review <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
