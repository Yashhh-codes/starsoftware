import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUpDown,
  BadgeCheck,
  Check,
  FileText,
  Inbox,
  Pause,
  Play,
  ScanText,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useInView, usePrefersReducedMotion, useStepper } from '../../hooks/useMotion';

// System fit as an orbit: Star Software at the centre, the documents on the
// left (the supplier MTR, and SharePoint as a document source or
// destination) and the ERPs fanned out on the right, the two the copy
// names first nearest the middle. Each run, the MTR beams into the core, is
// worked through, and the approved record beams out to the next ERP, or to
// the one a visitor picks. Wide screens lay it out on an ellipse drawn in
// the same units as the boxes; narrow ones stack it. Illustrative.

// The drawing's units: the boxes are sized in them too (--u in the CSS).
const W = 1100;
const H = 560;
const CX = 550;
const CY = 282;
const RX = 420;
const RY = 232;

const at = (deg) => {
  const r = (deg * Math.PI) / 180;
  return { x: CX + RX * Math.cos(r), y: CY + RY * Math.sin(r) };
};
const place = ({ x, y }) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });

// The ERPs' places on the right of the orbit, top to bottom, evenly spaced
// down it; and the documents' on the left.
const SLOTS = [-0.9, -0.54, -0.18, 0.18, 0.54, 0.9].map((s) => ({
  x: CX + RX * Math.sqrt(1 - s * s),
  y: CY + RY * s,
}));
const MTR = at(207);
const DOC = at(153);
const STATUS = { x: CX, y: CY + 140 };

const PHASE_MS = [1000, 600, 600, 600, 1000, 2400];
const DELIVER = 4;
const RECEIVED = 5;
const STAGES = [
  { label: 'Receiving', Icon: Inbox },
  { label: 'Extract', Icon: ScanText },
  { label: 'Check', Icon: ShieldCheck },
  { label: 'Review', Icon: UserCheck },
  { label: 'Approved', Icon: BadgeCheck },
  { label: 'Approved', Icon: BadgeCheck },
];

// Which slot each ERP takes: the featured two in the middle.
function slotsFor(erps) {
  const featured = erps.map((_, i) => i).filter((i) => erps[i].featured);
  const rest = erps.map((_, i) => i).filter((i) => !erps[i].featured);
  if (erps.length !== 6 || featured.length !== 2) return erps.map((_, i) => i);
  const order = [rest[0], rest[1], featured[0], featured[1], rest[2], rest[3]];
  return erps.map((_, i) => order.indexOf(i));
}

// A system's logo, or its name until there is one.
function Mark({ system }) {
  return system.logo ? (
    <img
      className={`so-logo${system.logoHeight ? ' so-logo--tall' : ''}`}
      src={system.logo}
      alt={system.name}
      loading="lazy"
    />
  ) : (
    <span className="so-word">{system.name}</span>
  );
}

export default function SystemFitDiagram({ erps, documentSystem, note }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { threshold: 0.3 });
  const [paused, setPaused] = useState(false);
  const playing = inView && !paused && !reduced;
  const [step, goTo] = useStepper(PHASE_MS, playing);
  const p = reduced ? RECEIVED : step;

  const [target, setTarget] = useState(0);
  const [pinned, setPinned] = useState(false);
  // Counts the runs, so the beams fire afresh with each.
  const [run, setRun] = useState(0);
  const last = useRef(step);

  // Each time round, the record goes to the next ERP, unless one was picked.
  useEffect(() => {
    if (step === 0 && last.current === RECEIVED) {
      setRun((r) => r + 1);
      if (!pinned) setTarget((t) => (t + 1) % erps.length);
    }
    last.current = step;
  }, [step, pinned, erps.length]);

  const pick = (i) => {
    setTarget(i);
    setPinned(true);
    setPaused(false);
    goTo(0);
    last.current = 0;
    setRun((r) => r + 1);
  };

  const slots = slotsFor(erps);
  const firing = (phase) => (playing && p === phase ? ' is-run' : '');
  const name = erps[target].name;
  const { label, Icon } = STAGES[p];

  return (
    <figure ref={ref} className={`so${playing ? ' is-playing' : ''}${p >= 1 && p <= 3 ? ' is-busy' : ''}`}>
      <div className="so-top">
        <span className="so-tag">Illustrative</span>
        <button
          type="button"
          className="so-pause"
          onClick={() => setPaused((v) => !v)}
          aria-label={paused || reduced ? 'Play the diagram' : 'Pause the diagram'}
          disabled={reduced}
        >
          {paused || reduced ? <Play size={13} /> : <Pause size={13} />}
        </button>
      </div>

      <div className="so-canvas">
        <svg className="so-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <ellipse className="so-ring" cx={CX} cy={CY} rx={RX} ry={RY} />
          <ellipse className="so-ring so-ring--inner" cx={CX} cy={CY} rx={RX * 0.58} ry={RY * 0.6} />
          <path
            id="so-orbit"
            d={`M ${CX - RX} ${CY} a ${RX} ${RY} 0 1 0 ${RX * 2} 0 a ${RX} ${RY} 0 1 0 ${-RX * 2} 0`}
            fill="none"
          />
          {!reduced && (
            <g className="so-satellites">
              <circle r="3.5">
                <animateMotion dur="18s" repeatCount="indefinite">
                  <mpath href="#so-orbit" />
                </animateMotion>
              </circle>
              <circle r="2.5">
                <animateMotion dur="18s" begin="-9s" repeatCount="indefinite">
                  <mpath href="#so-orbit" />
                </animateMotion>
              </circle>
            </g>
          )}

          <line className="so-beam is-on" x1={MTR.x} y1={MTR.y} x2={CX} y2={CY} />
          <line key={`in-${run}`} className={`so-pulse${firing(0)}`} x1={MTR.x} y1={MTR.y} x2={CX} y2={CY} pathLength="1" />

          <line className={`so-beam so-beam--doc${p >= DELIVER ? ' is-on' : ''}`} x1={CX} y1={CY} x2={DOC.x} y2={DOC.y} />
          <line
            key={`doc-${run}`}
            className={`so-pulse so-pulse--doc${firing(DELIVER)}`}
            x1={CX}
            y1={CY}
            x2={DOC.x}
            y2={DOC.y}
            pathLength="1"
          />

          {erps.map((system, i) => {
            const end = SLOTS[slots[i]];
            const on = i === target && p >= DELIVER;
            return (
              <g key={system.name}>
                <line className={`so-beam${on ? ' is-on is-out' : ''}`} x1={CX} y1={CY} x2={end.x} y2={end.y} />
                {i === target && (
                  <line
                    key={`out-${run}`}
                    className={`so-pulse so-pulse--out${firing(DELIVER)}`}
                    x1={CX}
                    y1={CY}
                    x2={end.x}
                    y2={end.y}
                    pathLength="1"
                  />
                )}
              </g>
            );
          })}
        </svg>

        <span className="so-cap so-cap--docs" style={place({ x: MTR.x, y: MTR.y - 96 })}>
          Documents
        </span>
        <span className="so-cap so-cap--erp" style={place({ x: SLOTS[0].x + 40, y: SLOTS[0].y - 60 })}>
          Your ERP
        </span>

        <div className="so-docs">
          <div className={`so-doc so-doc--mtr${p === 0 ? ' is-on' : ''}`} style={place(MTR)}>
            <span className="so-doc-head">
              <span className="so-doc-ic">
                <FileText />
              </span>
              <b>Supplier MTR</b>
            </span>
            <span className="so-doc-bars" aria-hidden="true">
              <i style={{ width: '82%' }} />
              <i style={{ width: '58%' }} />
            </span>
            <span className="so-doc-spec">ASTM A572 Gr. 50</span>
          </div>
          <div className={`so-doc so-doc--sp${p >= DELIVER ? ' is-on' : ''}`} style={place(DOC)}>
            <Mark system={documentSystem} />
            <span className="so-doc-note">
              <ArrowUpDown /> Document source or destination
            </span>
          </div>
        </div>

        <span className="so-vlink so-vlink--in" aria-hidden="true">
          <i key={`vin-${run}`} className={firing(0).trim()} />
        </span>

        <div className="so-core" style={place({ x: CX, y: CY })}>
          <span className="so-core-name">Star Software</span>
          <span className="so-core-sub">MTR workflow</span>
          <span key={label} className={`so-core-stage${p >= DELIVER ? ' is-done' : ''}`}>
            <Icon /> {label}
          </span>
          <span className="so-core-dots" aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <i key={n} className={p > n ? 'is-done' : p === n ? 'is-on' : ''} />
            ))}
          </span>
        </div>

        <span className={`so-status${p === RECEIVED ? ' is-in' : ''}`} style={place(STATUS)}>
          {p === RECEIVED ? (
            <>
              <Check size={13} strokeWidth={3} /> Approved record in {name}
            </>
          ) : p === DELIVER ? (
            <>Sending to {name}</>
          ) : (
            <>Next: {name}</>
          )}
        </span>

        <span className="so-vlink so-vlink--out" aria-hidden="true">
          <i key={`vout-${run}`} className={firing(DELIVER).trim()} />
        </span>

        <ul className="so-erps" aria-label="ERPs">
          {erps.map((system, i) => {
            const isTarget = i === target;
            return (
              <li key={system.name}>
                <button
                  type="button"
                  className={`so-node${isTarget && p === DELIVER ? ' is-target' : ''}${isTarget && p === RECEIVED ? ' is-in' : ''}${
                    isTarget ? ' is-next' : ''
                  }`}
                  style={place(SLOTS[slots[i]])}
                  aria-pressed={isTarget}
                  aria-label={`Send the record to ${system.name}`}
                  onClick={() => pick(i)}
                >
                  <Mark system={system} />
                  <span className="so-node-ok" aria-hidden="true">
                    <Check strokeWidth={3.5} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <figcaption className="so-note">{note}</figcaption>
    </figure>
  );
}
