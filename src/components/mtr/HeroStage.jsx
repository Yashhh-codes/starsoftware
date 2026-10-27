import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Check, Database, Pause, Play, TriangleAlert, UserCheck } from 'lucide-react';
import { useInView, usePrefersReducedMotion, useStepper } from '../../hooks/useMotion';

// The hero's stage: a supplier MTR is scanned, its values lift off the page
// and fly into the review panel, are checked against the specification, the
// exception is reviewed, and the approved record flies on to the ERP. The
// certificate is the same illustrative one the reviewer section examines;
// it is labelled as an illustration and carries no customer data. The
// approved product screenshot or GIF replaces it when there is one.

const PHASES = [
  { id: 'intro', ms: 900 },
  { id: 'extract', ms: 3500 },
  { id: 'check', ms: 1900 },
  { id: 'route', ms: 1600 },
  { id: 'approve', ms: 1300 },
  { id: 'handoff', ms: 1900 },
  { id: 'done', ms: 2400 },
];
const PHASE_MS = PHASES.map((p) => p.ms);
const P = Object.fromEntries(PHASES.map((p, i) => [p.id, i]));

const STATUS = {
  intro: 'Waiting for supplier MTR',
  extract: 'Extracting values',
  check: 'Checking ASTM A572 Gr. 50',
  route: 'Exception routed to QA',
  approve: 'Approved with note',
  handoff: 'Sending to ERP',
  done: 'Record in ERP',
};

// The step in the progress bar each phase belongs to.
const HUD = ['Extract', 'Check', 'Review', 'Handoff'];
const HUD_OF = { intro: -1, extract: 0, check: 1, route: 2, approve: 2, handoff: 3, done: 4 };

// ASTM A572 Grade 50 limits; the values are made up for the illustration.
const FIELDS = [
  { key: 'c', field: 'Carbon', value: '0.19', unit: '%', req: '≤ 0.23 %', ok: true },
  { key: 'mn', field: 'Manganese', value: '1.12', unit: '%', req: '≤ 1.35 %', ok: true },
  { key: 'ys', field: 'Yield strength', value: '58', unit: 'ksi', req: '≥ 50 ksi', ok: true },
  { key: 'ts', field: 'Tensile strength', value: '74', unit: 'ksi', req: '≥ 65 ksi', ok: true },
  { key: 'el', field: 'Elongation (2 in)', value: '19', unit: '%', req: '≥ 21 %', ok: false },
];
// When each value leaves the certificate (ms into the extract phase),
// following the scan down the page.
const LIFT_AT = [650, 860, 1560, 1770, 1980];
const FLIGHT_MS = 1150;

const CHEMISTRY = [
  { el: 'C', value: '0.19', key: 'c' },
  { el: 'Mn', value: '1.12', key: 'mn' },
  { el: 'P', value: '0.012' },
  { el: 'S', value: '0.008' },
  { el: 'Si', value: '0.22' },
];
const MECHANICAL = [
  { el: 'Yield (ksi)', value: '58', key: 'ys' },
  { el: 'Tensile (ksi)', value: '74', key: 'ts' },
  { el: 'Elong. (%)', value: '19', key: 'el' },
];

// A small element flown from one box to another along an arc, in the
// stage's own (unzoomed) units.
function fly(stage, layer, { className, text, from, to, duration, lift = 70 }) {
  const box = stage.getBoundingClientRect();
  const scale = box.width / stage.offsetWidth || 1;
  const node = document.createElement('span');
  node.className = className;
  node.textContent = text;
  layer.appendChild(node);
  const w = node.offsetWidth;
  const h = node.offsetHeight;
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const x0 = (a.left + a.width / 2 - box.left) / scale - w / 2;
  const y0 = (a.top + a.height / 2 - box.top) / scale - h / 2;
  const x1 = (b.left + b.width / 2 - box.left) / scale - w / 2;
  const y1 = (b.top + b.height / 2 - box.top) / scale - h / 2;
  const mx = x0 + (x1 - x0) * 0.55;
  const my = Math.min(y0, y1) - lift;
  const animation = node.animate(
    [
      { transform: `translate(${x0}px, ${y0}px) scale(0.85)`, opacity: 0 },
      { transform: `translate(${x0}px, ${y0 - 16}px) scale(1.1)`, opacity: 1, offset: 0.16 },
      { transform: `translate(${mx}px, ${my}px) scale(1.14)`, opacity: 1, offset: 0.56 },
      { transform: `translate(${x1}px, ${y1}px) scale(1)`, opacity: 1, offset: 0.9 },
      { transform: `translate(${x1}px, ${y1}px) scale(0.92)`, opacity: 0 },
    ],
    { duration, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'forwards' }
  );
  const done = animation.finished.then(
    () => node.remove(),
    () => node.remove()
  );
  return { animation, done };
}

export default function HeroStage() {
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const cells = useRef({});
  const slots = useRef({});
  const recordRef = useRef(null);
  const erpRef = useRef(null);
  const [wire, setWire] = useState(null);

  const reduced = usePrefersReducedMotion();
  const inView = useInView(stageRef, { threshold: 0.3 });
  const [paused, setPaused] = useState(false);
  const playing = inView && !paused && !reduced;
  const [playingPhase] = useStepper(PHASE_MS, playing);
  const phase = reduced ? P.done : playingPhase;
  const id = PHASES[phase].id;

  const [landed, setLanded] = useState(0);
  const [received, setReceived] = useState(false);

  // A new run starts clean.
  useEffect(() => {
    if (phase !== P.intro) return;
    setLanded(0);
    setReceived(false);
    Object.values(cells.current).forEach((cell) => cell?.removeAttribute('data-lifted'));
  }, [phase]);

  // Extract: each value lifts off the certificate and flies to its row.
  useEffect(() => {
    if (phase !== P.extract || reduced) return undefined;
    const stage = stageRef.current;
    const layer = layerRef.current;
    const flights = [];
    const timers = FIELDS.map((field, i) =>
      setTimeout(() => {
        const from = cells.current[field.key];
        const to = slots.current[field.key];
        if (!from || !to) return;
        from.setAttribute('data-lifted', '');
        const flight = fly(stage, layer, {
          className: 'hs-chip',
          text: `${field.value} ${field.unit}`,
          from,
          to,
          duration: FLIGHT_MS,
        });
        flights.push(flight);
        flight.animation.finished.then(() => setLanded((n) => Math.max(n, i + 1)), () => {});
      }, LIFT_AT[i])
    );
    return () => {
      timers.forEach(clearTimeout);
      flights.forEach((f) => f.animation.cancel());
    };
  }, [phase, reduced]);

  // Handoff: the approved record flies along the wire to the ERP.
  useEffect(() => {
    if (phase !== P.handoff || reduced) return undefined;
    const flight = fly(stageRef.current, layerRef.current, {
      className: 'hs-packet',
      text: 'MTR record',
      from: recordRef.current,
      to: erpRef.current,
      duration: 1250,
      lift: 30,
    });
    flight.animation.finished.then(() => setReceived(true), () => {});
    return () => flight.animation.cancel();
  }, [phase, reduced]);

  // The wire from the record to the ERP, measured from where they sit.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const measure = () => {
      const box = stage.getBoundingClientRect();
      const scale = box.width / stage.offsetWidth || 1;
      const a = recordRef.current.getBoundingClientRect();
      const b = erpRef.current.getBoundingClientRect();
      const x1 = (b.left + b.width / 2 - box.left) / scale;
      const y1 = (b.top + b.height / 2 - box.top) / scale;
      // From the side of the record that faces the ERP: its right end when
      // the ERP is beside the panel, its bottom when it's below (narrower
      // screens), so the wire never crosses the panel.
      const below = b.top > a.bottom;
      const x0 = below ? (a.left + a.width / 2 - box.left) / scale : (a.right - box.left) / scale;
      const y0 = below ? (a.bottom - box.top) / scale : (a.top + a.height / 2 - box.top) / scale;
      setWire({ x: x0, y: y0, length: Math.hypot(x1 - x0, y1 - y0), angle: Math.atan2(y1 - y0, x1 - x0) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // The scene leans a little towards the pointer.
  const lean = (event) => {
    if (reduced || event.pointerType === 'touch') return;
    const r = stageRef.current.getBoundingClientRect();
    stageRef.current.style.setProperty('--px', ((event.clientX - r.left) / r.width - 0.5).toFixed(3));
    stageRef.current.style.setProperty('--py', ((event.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const unlean = () => {
    stageRef.current.style.setProperty('--px', '0');
    stageRef.current.style.setProperty('--py', '0');
  };

  const filled = phase > P.extract ? FIELDS.length : phase === P.extract ? landed : 0;
  const checked = phase >= P.check;
  const routed = phase >= P.route;
  const approved = phase >= P.approve;
  const inErp = phase === P.done || (phase === P.handoff && received);
  const hud = HUD_OF[id];

  return (
    <div
      ref={stageRef}
      className={`hs${playing ? ' is-playing' : ''}`}
      data-phase={id}
      onPointerMove={lean}
      onPointerLeave={unlean}
    >
      <div className="hs-backdrop" aria-hidden="true">
        <span className="hs-aurora hs-aurora--a" />
        <span className="hs-aurora hs-aurora--b" />
        <span className="hs-floor" />
      </div>

      <span className="hs-tag" aria-hidden="true">
        <span className="hs-tag-dot" />
        Illustrative
      </span>
      <button
        type="button"
        className="hs-pause"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused || reduced ? 'Play the illustration' : 'Pause the illustration'}
        disabled={reduced}
      >
        {paused || reduced ? <Play size={14} /> : <Pause size={14} />}
      </button>

      {/* The scene is described once; its parts are decoration. */}
      <div
        className="hs-scene"
        role="img"
        aria-label="Illustration: a supplier MTR is scanned, its values are extracted and checked against ASTM A572 Grade 50, an elongation exception is approved by a quality reviewer, and the approved record is sent to the ERP."
      >
        <div className="hs-paper-float" aria-hidden="true">
          <div className="hs-paper">
            <div className="hs-paper-head">
              <span className="hs-paper-kicker">Material test report</span>
              <span className="hs-bar" style={{ width: '46%' }} />
            </div>
            <dl className="hs-paper-meta">
              <div>
                <dt>Heat no.</dt>
                <dd className="hs-mask">•••••••</dd>
              </div>
              <div>
                <dt>Specification</dt>
                <dd>ASTM A572 Gr. 50</dd>
              </div>
              <div>
                <dt>Supplier</dt>
                <dd>
                  <span className="hs-bar" style={{ width: '70%' }} />
                </dd>
              </div>
            </dl>

            <p className="hs-paper-section">Chemical composition (%)</p>
            <div className="hs-table hs-table--chem">
              {CHEMISTRY.map((c) => (
                <span key={c.el} className="hs-th">
                  {c.el}
                </span>
              ))}
              {CHEMISTRY.map((c) => (
                <span
                  key={`${c.el}-v`}
                  className="hs-td"
                  ref={(node) => {
                    if (c.key) cells.current[c.key] = node;
                  }}
                >
                  {c.value}
                </span>
              ))}
            </div>

            <p className="hs-paper-section">Mechanical properties</p>
            <div className="hs-table hs-table--mech">
              {MECHANICAL.map((c) => (
                <span key={c.el} className="hs-th">
                  {c.el}
                </span>
              ))}
              {MECHANICAL.map((c) => (
                <span
                  key={`${c.el}-v`}
                  className="hs-td"
                  ref={(node) => {
                    cells.current[c.key] = node;
                  }}
                >
                  {c.value}
                </span>
              ))}
            </div>

            <div className="hs-paper-foot">
              <span className="hs-bar" style={{ width: '38%' }} />
              <span className="hs-stamp">Certified</span>
            </div>
            <span className="hs-beam" />
          </div>
        </div>

        <div className="hs-panel" aria-hidden="true">
          <div className="hs-panel-head">
            <span className="hs-panel-title">Review-ready data</span>
            <span className={`hs-live${inErp ? ' is-done' : ''}`}>
              <span className="hs-live-dot" />
              {STATUS[id]}
            </span>
          </div>

          <div className="hs-rows">
            {FIELDS.map((field, i) => {
              const isFilled = i < filled;
              let state = '';
              if (checked) state = field.ok ? ' is-pass' : approved ? ' is-approved' : ' is-warn';
              return (
                <div key={field.key} className={`hs-row${isFilled ? ' is-filled' : ''}${state}`} style={{ '--i': i }}>
                  <span className="hs-row-field">{field.field}</span>
                  <span
                    className="hs-row-value"
                    ref={(node) => {
                      slots.current[field.key] = node;
                    }}
                  >
                    {isFilled ? `${field.value} ${field.unit}` : ''}
                  </span>
                  <span className="hs-row-req">{checked ? field.req : ''}</span>
                  <span className="hs-row-status">
                    {checked &&
                      (field.ok ? (
                        <>
                          <Check size={12} strokeWidth={3} /> Pass
                        </>
                      ) : approved ? (
                        <>
                          <Check size={12} strokeWidth={3} /> Approved
                        </>
                      ) : (
                        <>
                          <TriangleAlert size={12} /> Below min.
                        </>
                      ))}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="hs-panel-foot">
            <span className={`hs-reviewer${routed ? ' is-on' : ''}${approved ? ' is-done' : ''}`}>
              <span className="hs-avatar">
                <UserCheck size={13} />
              </span>
              {approved ? 'Quality reviewer approved with note' : 'Elongation exception → quality reviewer'}
            </span>
            <span
              ref={recordRef}
              className={`hs-record${approved ? ' is-ready' : ''}${phase === P.handoff && !inErp ? ' is-sending' : ''}${inErp ? ' is-sent' : ''}`}
            >
              {inErp ? 'Sent to ERP' : 'MTR record'}
            </span>
          </div>
        </div>

        {wire && (
          <span
            className={`hs-wire${phase >= P.handoff ? ' is-live' : ''}`}
            aria-hidden="true"
            style={{
              left: wire.x,
              top: wire.y,
              width: wire.length,
              transform: `rotate(${wire.angle}rad)`,
            }}
          />
        )}

        <div ref={erpRef} className={`hs-erp${inErp ? ' is-in' : ''}`} aria-hidden="true">
          <span className="hs-erp-ring" />
          <span className="hs-erp-core">
            <Database size={22} />
          </span>
          <span className="hs-erp-badge">
            <Check size={12} strokeWidth={3} />
          </span>
          <span className="hs-erp-label">
            ERP
            <span>{inErp ? 'Approved record received' : 'Waiting for approval'}</span>
          </span>
        </div>
      </div>

      <ol className="hs-hud" aria-hidden="true">
        {HUD.map((label, i) => (
          <li key={label} className={`hs-hud-step${hud === i ? ' is-active' : ''}${hud > i ? ' is-done' : ''}`}>
            <span className="hs-hud-n">{hud > i ? <Check size={11} strokeWidth={3} /> : `0${i + 1}`}</span>
            {label}
          </li>
        ))}
      </ol>

      <div ref={layerRef} className="hs-flights" aria-hidden="true" />
    </div>
  );
}
