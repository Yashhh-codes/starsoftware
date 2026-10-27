import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, CircleHelp, Mail, Pause, Play, ScanText, ShieldCheck, TriangleAlert, UserCheck } from 'lucide-react';
import { useInView, usePrefersReducedMotion, useStepper } from '../../hooks/useMotion';
import { fly } from '../landing/fly';
import { ON_CERTIFICATE, PRODUCT, SPEC, TESTS } from './sample';

// The COA hero's stage, on the MTR hero's stage (hs-* styles): the
// difference between reading a COA and checking it. A supplier certificate
// that marks everything "Conforms" is scanned and its results fly into the
// panel as reported. The panel then switches to checking them against the
// buyer's specification: the requirements come in, a row the certificate
// never reported appears, two results need attention, and those are
// emailed to the QA reviewer for the reviewer-led next step. Labelled as an
// illustration; the figures are made up (./sample).

const PHASES = [
  { id: 'intro', ms: 900 },
  { id: 'extract', ms: 3400 },
  { id: 'spec', ms: 2000 },
  { id: 'compare', ms: 2300 },
  { id: 'notify', ms: 2300 },
  { id: 'next', ms: 2000 },
  { id: 'done', ms: 2600 },
];
const PHASE_MS = PHASES.map((p) => p.ms);
const P = Object.fromEntries(PHASES.map((p, i) => [p.id, i]));

const STATUS = {
  intro: 'Waiting for supplier COA',
  extract: 'Reading values',
  spec: 'Applying your spec',
  compare: 'Comparing results',
  notify: 'Emailing exceptions',
  next: 'Review opened',
  done: 'With QA reviewer',
};

// The step in the progress bar each phase belongs to, as in the workflow
// section below.
const HUD = ['Extract', 'Verify', 'Review', 'Progress'];
const HUD_OF = { intro: -1, extract: 0, spec: 1, compare: 1, notify: 2, next: 3, done: 4 };

// When each result leaves the certificate (ms into the extract phase), as
// the scan passes its row.
const LIFT_AT = [950, 1250, 1550, 1850];
const FLIGHT_MS = 1100;

const VERDICTS = {
  ok: { icon: Check, text: 'Within', className: ' is-pass' },
  range: { icon: TriangleAlert, text: 'Out of range', className: ' is-warn' },
  missing: { icon: CircleHelp, text: 'Missing', className: ' is-warn' },
};
const WITHIN = TESTS.filter((t) => t.tone === 'ok').length;
const EXCEPTIONS = TESTS.filter((t) => t.tone !== 'ok');

export default function CoaHeroStage() {
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const cells = useRef({});
  const slots = useRef({});
  const pillRef = useRef(null);
  const mailRef = useRef(null);

  const reduced = usePrefersReducedMotion();
  const inView = useInView(stageRef, { threshold: 0.3 });
  const [paused, setPaused] = useState(false);
  const playing = inView && !paused && !reduced;
  const [playingPhase] = useStepper(PHASE_MS, playing);
  const phase = reduced ? P.done : playingPhase;
  const id = PHASES[phase].id;

  const [landed, setLanded] = useState(0);
  const [delivered, setDelivered] = useState(false);

  // A new run starts clean.
  useEffect(() => {
    if (phase !== P.intro) return;
    setLanded(0);
    setDelivered(false);
    Object.values(cells.current).forEach((cell) => cell?.removeAttribute('data-lifted'));
  }, [phase]);

  // Extract: each result lifts off the certificate and flies to its row.
  useEffect(() => {
    if (phase !== P.extract || reduced) return undefined;
    const stage = stageRef.current;
    const layer = layerRef.current;
    const flights = [];
    const timers = ON_CERTIFICATE.map((test, i) =>
      setTimeout(() => {
        const from = cells.current[test.key];
        const to = slots.current[test.key];
        if (!from || !to) return;
        from.setAttribute('data-lifted', '');
        const flight = fly(stage, layer, { className: 'hs-chip', text: test.value, from, to, duration: FLIGHT_MS });
        flights.push(flight);
        flight.animation.finished.then(() => setLanded((n) => Math.max(n, i + 1)), () => {});
      }, LIFT_AT[i])
    );
    return () => {
      timers.forEach(clearTimeout);
      flights.forEach((f) => f.animation.cancel());
    };
  }, [phase, reduced]);

  // Notify: the exceptions fly from the panel to the reviewer's inbox.
  useEffect(() => {
    if (phase !== P.notify || reduced) return undefined;
    let flight = null;
    const t = setTimeout(() => {
      flight = fly(stageRef.current, layerRef.current, {
        className: 'hs-packet ch-packet',
        text: `${EXCEPTIONS.length} exceptions`,
        from: pillRef.current,
        to: mailRef.current,
        duration: 1150,
        lift: 40,
      });
      flight.animation.finished.then(() => setDelivered(true), () => {});
    }, 450);
    return () => {
      clearTimeout(t);
      flight?.animation.cancel();
    };
  }, [phase, reduced]);

  // The certificate leans a little towards the pointer.
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

  const filled = phase > P.extract ? ON_CERTIFICATE.length : phase === P.extract ? landed : 0;
  const checking = phase >= P.spec;
  const compared = phase >= P.compare;
  const notified = phase >= P.notify;
  const inInbox = phase > P.notify || (phase === P.notify && delivered);
  const onNext = phase >= P.next;
  const hud = HUD_OF[id];

  let summary;
  if (compared) {
    summary = (
      <>
        <span className="ch-dot ch-dot--ok" />
        {WITHIN} within spec
        <span className="ch-dot ch-dot--warn" />
        {EXCEPTIONS.length} need attention
      </>
    );
  } else if (checking) {
    summary = `Checking ${TESTS.length} requirements`;
  } else if (filled === ON_CERTIFICATE.length) {
    summary = (
      <>
        Supplier marked: <b>Conforms</b>
      </>
    );
  } else {
    summary = `${filled} of ${ON_CERTIFICATE.length} results captured`;
  }

  return (
    <div
      ref={stageRef}
      className={`hs hs--coa${playing ? ' is-playing' : ''}${checking ? ' is-checking' : ''}`}
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
        aria-label="Illustration: a supplier COA marked as conforming is read, then checked against the buyer's product specification. Water is out of the required range and iron is not reported, so both are emailed to the QA reviewer for the reviewer-led next step."
      >
        <div className="hs-paper-float" aria-hidden="true">
          <div className="hs-paper">
            <div className="hs-paper-head">
              <span className="hs-paper-kicker">Certificate of analysis</span>
              <span className="ch-paper-product">{PRODUCT}</span>
            </div>
            <dl className="hs-paper-meta">
              <div>
                <dt>Lot</dt>
                <dd className="hs-mask">••••••</dd>
              </div>
              <div>
                <dt>Supplier</dt>
                <dd>
                  <span className="hs-bar" style={{ width: '78%' }} />
                </dd>
              </div>
              <div>
                <dt>Issued</dt>
                <dd>
                  <span className="hs-bar" style={{ width: '64%' }} />
                </dd>
              </div>
            </dl>

            <p className="hs-paper-section">Test results</p>
            <div className="hs-table ch-paper-table">
              <span className="hs-th">Test</span>
              <span className="hs-th">Limit</span>
              <span className="hs-th">Result</span>
              {ON_CERTIFICATE.map((test) => (
                <React.Fragment key={test.key}>
                  <span className="hs-td ch-td-test">{test.test}</span>
                  <span className="hs-td ch-td-limit">{test.limit}</span>
                  <span
                    className="hs-td"
                    ref={(node) => {
                      cells.current[test.key] = node;
                    }}
                  >
                    {test.value}
                  </span>
                </React.Fragment>
              ))}
            </div>

            <div className="hs-paper-foot">
              <span className="hs-bar" />
              <span className="hs-stamp">Conforms</span>
            </div>
            <span className="hs-beam" />
          </div>
        </div>

        <div className="hs-panel ch-panel" aria-hidden="true">
          <div className="ch-mode">
            <span className="ch-mode-thumb" />
            <span className={`ch-mode-opt${checking ? '' : ' is-on'}`}>
              <ScanText size={14} /> Reading the COA
            </span>
            <span className={`ch-mode-opt${checking ? ' is-on' : ''}`}>
              <ShieldCheck size={14} /> Checking your spec
            </span>
          </div>

          <div className="hs-panel-head">
            <span className="hs-panel-title">
              {checking ? (
                <>
                  Against <span className="ch-spec">{SPEC}</span>
                </>
              ) : (
                'What the supplier reported'
              )}
            </span>
            <span className={`hs-live${phase === P.done ? ' is-done' : ''}`}>
              <span className="hs-live-dot" />
              {STATUS[id]}
            </span>
          </div>

          <div className="ch-cols">
            <span>Test</span>
            <span>Reported</span>
            <span className="ch-col-spec">Required</span>
            <span className="ch-col-spec">Result</span>
          </div>

          <div className="hs-rows">
            {TESTS.map((test, i) => {
              const reported = Boolean(test.value);
              const isFilled = reported ? i < filled : checking;
              const verdict = VERDICTS[test.tone];
              const Icon = verdict.icon;
              return (
                <div
                  key={test.key}
                  className={`hs-row${isFilled ? ' is-filled' : ''}${compared ? verdict.className : ''}${reported ? '' : ' ch-row-added'}`}
                  style={{ '--i': i }}
                >
                  <span className="hs-row-field">{test.test}</span>
                  <span
                    className={`hs-row-value${reported ? '' : ' ch-unreported'}`}
                    ref={(node) => {
                      slots.current[test.key] = node;
                    }}
                  >
                    {reported ? (isFilled ? test.value : '') : 'Not reported'}
                  </span>
                  <span className="hs-row-req">{test.req}</span>
                  <span className="hs-row-status">
                    {compared && (
                      <>
                        <Icon size={12} strokeWidth={test.tone === 'ok' ? 3 : 2.25} /> {verdict.text}
                      </>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="hs-panel-foot">
            <span className="ch-summary">{summary}</span>
            <span ref={pillRef} className={`hs-reviewer${notified ? ' is-on' : ''}${onNext ? ' is-next' : ''}`}>
              <span className="hs-avatar">
                <UserCheck size={13} />
              </span>
              {onNext ? 'Reviewer-led next step' : 'Exceptions → QA reviewer'}
            </span>
          </div>
        </div>

        <div ref={mailRef} className={`ch-mail${inInbox ? ' is-in' : ''}${onNext ? ' is-next' : ''}`} aria-hidden="true">
          <div className="ch-mail-head">
            <span className="ch-mail-ic">
              <Mail size={16} />
            </span>
            <span className="ch-mail-who">
              <b>QA reviewer</b>
              {inInbox ? 'New email · just now' : 'Defined person'}
            </span>
            <span className="ch-mail-badge">{EXCEPTIONS.length}</span>
          </div>
          <div className="ch-mail-body">
            <p className="ch-mail-subject">COA exceptions · {PRODUCT}</p>
            <ul className="ch-mail-items">
              {EXCEPTIONS.map((test) => (
                <li key={test.key} className={`is-${test.tone}`}>
                  {test.tone === 'missing' ? <CircleHelp size={13} /> : <TriangleAlert size={13} />}
                  <span>
                    <b>{test.test}</b>
                    {test.value ? `${test.value} · required ${test.req}` : `Not reported · required ${test.req}`}
                  </span>
                </li>
              ))}
            </ul>
            <span className="ch-mail-btn">
              Open review <ArrowRight size={13} />
            </span>
          </div>
          <p className="ch-mail-idle">Waiting for exceptions</p>
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
