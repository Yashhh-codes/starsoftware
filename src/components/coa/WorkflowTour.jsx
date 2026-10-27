import React, { useEffect, useRef, useState } from 'react';
import { Check, Pause, Play } from 'lucide-react';
import { useInView, usePrefersReducedMotion, useStepper } from '../../hooks/useMotion';
import { pad2 } from '../landing/LandingParts';
import { SCENE_LABELS, SCENES } from './tourScenes';

// "From supplier COA to QA review" as a product tour: the steps are tabs
// down the side of one large screen that plays each step in turn (scenes:
// ./tourScenes). It moves on by itself while on screen; picking a step
// holds it there for a while, and the screen's pause button stops it.
// Reduced motion leaves it on the step chosen, finished.

const STEP_MS = [4400, 4800, 4800, 4600];
// How long a picked step stays before the tour carries on.
const HOLD_MS = 9000;

export default function WorkflowTour({ steps }) {
  const ref = useRef(null);
  const tabRefs = useRef([]);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { threshold: 0.35 });
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const playing = inView && !reduced && !paused && !holding;
  const [active, goTo] = useStepper(STEP_MS, playing);
  // Counts each step's turns, so its scene plays from the start each time
  // (and again when the tour comes back on screen) while the one leaving
  // fades out as it was.
  const [runs, setRuns] = useState(() => steps.map(() => 0));

  useEffect(() => {
    if (!inView) return;
    setRuns((r) => r.map((n, i) => (i === active ? n + 1 : n)));
  }, [active, inView]);

  useEffect(() => {
    if (!holding) return undefined;
    const t = setTimeout(() => setHolding(false), HOLD_MS);
    return () => clearTimeout(t);
  }, [holding, active]);

  const pick = (i) => {
    goTo(i);
    setHolding(true);
  };

  // Arrow keys move between the tabs, as in any tab list.
  const onKeyDown = (event) => {
    const last = steps.length - 1;
    const next = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const i = (next + steps.length) % steps.length;
    pick(i);
    tabRefs.current[i]?.focus();
  };

  return (
    <div ref={ref} className={`wt${playing ? ' is-playing' : ''}`}>
      <div className="wt-tabs" role="tablist" aria-label="Workflow steps" aria-orientation="vertical" onKeyDown={onKeyDown}>
        {steps.map((step, i) => {
          const isActive = i === active;
          const isDone = !reduced && i < active;
          return (
            <button
              key={step.title}
              ref={(node) => {
                tabRefs.current[i] = node;
              }}
              type="button"
              role="tab"
              id={`wt-tab-${i}`}
              aria-selected={isActive}
              aria-controls="wt-panel"
              tabIndex={isActive ? 0 : -1}
              className={`wt-tab${isActive ? ' is-active' : ''}${isDone ? ' is-done' : ''}`}
              onClick={() => pick(i)}
            >
              <span className="wt-tab-n" aria-hidden="true">
                {isDone ? <Check size={14} strokeWidth={3} /> : pad2(i + 1)}
              </span>
              <span className="wt-tab-body">
                <span className="wt-tab-title">{step.title}</span>
                <span className="wt-tab-text">{step.text}</span>
              </span>
              {isActive && !reduced && (
                <span
                  key={`p-${active}-${runs[i]}`}
                  className="wt-tab-progress"
                  style={{ animationDuration: `${STEP_MS[i]}ms`, animationPlayState: playing ? 'running' : 'paused' }}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="wt-stage" id="wt-panel" role="tabpanel" aria-labelledby={`wt-tab-${active}`}>
        <div className="wt-bar">
          <span className="wt-bar-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="wt-bar-title">
            COA workflow <span aria-hidden="true">·</span> <b>{steps[active].title}</b>
          </span>
          <span className="wt-tag">Illustrative</span>
          <button
            type="button"
            className="wt-pause"
            onClick={() => {
              setPaused((p) => !p);
              setHolding(false);
            }}
            aria-label={paused || reduced ? 'Play the steps' : 'Pause the steps'}
            disabled={reduced}
          >
            {paused || reduced ? <Play size={13} /> : <Pause size={13} />}
          </button>
        </div>

        <div className="wt-scenes" role="img" aria-label={SCENE_LABELS[active]}>
          {SCENES.map((Scene, i) => (
            <div key={`${i}-${runs[i]}`} className={`wt-scene${i === active ? ' is-on' : ''}`} aria-hidden="true">
              <Scene />
            </div>
          ))}
        </div>

        {/* Narrow screens keep the tabs to their titles and say the step here. */}
        <p className="wt-caption" aria-hidden="true">
          <b>{steps[active].title}.</b> {steps[active].text}
        </p>
      </div>
    </div>
  );
}
