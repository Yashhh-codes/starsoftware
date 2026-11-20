import { useRef } from 'react';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  CalendarClock,
  Check,
  Clock3,
  FileText,
  Info,
  Mail,
  ShieldCheck,
  Sparkles,
  Truck,
  UserCheck,
  X,
} from 'lucide-react';
import { useLoop } from './motion';
import { Eyebrow } from '../landing/LandingParts';
import { DECISION } from '../../data/mtrCampaign';

// The case, as facts rather than paragraphs (the full story stays in the
// page for readers of the text).
const FACTS = [
  { icon: Truck, tone: 'info', k: 'Arrived today', v: 'A516 Gr. 70 plate · production needs it now' },
  { icon: ShieldCheck, tone: 'ok', k: 'On the MTR', v: 'Chemistry and mechanicals within ASTM limits' },
  { icon: FileText, tone: 'bad', k: 'The PO asks for', v: 'Charpy impact test at −46 °C and heat-treatment evidence' },
  { icon: BarChart3, tone: 'warn', k: 'This supplier', v: 'Two similar issues in the last six months' },
];

// What Star checks, where each requirement comes from, what the evidence
// shows and the result: ok, bad (missing / incomplete), warn or info.
const ROWS = [
  { req: 'Chemistry within limits', src: 'ASTM A516', srcIcon: BookOpen, ev: 'C 0.21 · Mn 1.05 · P 0.010', res: 'ok', label: 'Pass' },
  { req: 'Mechanical properties', src: 'ASTM A516', srcIcon: BookOpen, ev: 'YS 47.5 · TS 79.0 ksi · El 24%', res: 'ok', label: 'Pass' },
  { req: 'Charpy impact at −46 °C', src: 'Customer PO', srcIcon: FileText, ev: 'Not reported on the MTR', res: 'bad', label: 'Missing' },
  { req: 'Normalized heat treatment', src: 'Customer spec', srcIcon: FileText, ev: 'Records partial, no chart', res: 'bad', label: 'Incomplete' },
  { req: 'Supplier record, this grade', src: 'Supplier history', srcIcon: BarChart3, ev: '2 impact-test NCRs in 6 months', res: 'warn', label: 'Risk' },
  { req: 'When it’s needed', src: 'Schedule', srcIcon: CalendarClock, ev: 'Line 2, today', res: 'info', label: 'Urgent' },
];
const RES_ICON = { ok: Check, bad: X, warn: AlertTriangle, info: Info };

const STEPS = ['Read the MTR', 'Check the evidence', 'Weigh the risk', 'Decide', 'Act'];
const OPTIONS = [
  ['Release', 'ok', 9],
  ['Hold', 'hold', 84],
  ['Escalate', 'esc', 7],
];
const ACTIONS = [
  { icon: Mail, text: 'Requested the impact test and heat-treatment records from Northfield', at: 'Sent' },
  { icon: UserCheck, text: 'QA lead asked to review now, a deviation is possible if the line can’t wait', at: 'Notified' },
  { icon: Clock3, text: 'Heat 24A8871 releases on its own once acceptable documents arrive', at: 'Watching' },
];

// The clock: 0 read · 1–6 a row each · 7 weigh · 8 decide · 9–11 act ·
// then it rests on the outcome.
const ROW0 = 1;
const WEIGH = ROW0 + ROWS.length; // 7
const DECIDE = WEIGH + 1; // 8
const ACT = DECIDE + 1; // 9
const LENGTH = ACT + ACTIONS.length + 6;
const STEP_AT = [0, ROW0, WEIGH, DECIDE, ACT];
const stepOf = (t) => (t >= ACT ? 4 : t >= DECIDE ? 3 : t >= WEIGH ? 2 : t >= ROW0 ? 1 : 0);

const MTR = [
  ['Grade', 'A516 Gr. 70'],
  ['Heat', '24A8871'],
  ['C / Mn', '0.21 / 1.05'],
  ['P / S', '0.010 / 0.003'],
  ['Yield', '47.5 ksi'],
  ['Tensile', '79.0 ksi'],
  ['Elong.', '24%'],
  ['Charpy', '—'],
];

export default function Decision() {
  const ref = useRef(null);
  const [tick, setTick] = useLoop(ref, { ms: 1000, length: LENGTH, rest: LENGTH - 1, threshold: 0.3 });
  const step = stepOf(tick);
  const rowsDone = Math.max(0, Math.min(ROWS.length, tick - ROW0 + 1));
  const weighed = tick >= WEIGH;
  const decided = tick >= DECIDE;
  const acted = tick >= ACT ? Math.min(ACTIONS.length, tick - ACT + 1) : 0;
  const pass = ROWS.filter((r, i) => r.res === 'ok' && i < rowsDone).length;
  const flags = ROWS.filter((r, i) => r.res !== 'ok' && i < rowsDone).length;

  return (
    <section id="decision" className="mx-sec mx-sec--soft mxd mxq" aria-labelledby="mxd-title">
      <div className="mxd-bg" aria-hidden="true" />
      <div className="mt-wrap">
        <div className="mxq-head">
          <div>
            <Eyebrow>How the AI decides</Eyebrow>
            <h2 id="mxd-title" className="mx-h2" data-reveal>
              Extraction is only <span>the first step.</span>
            </h2>
            <p className="mx-lead" data-reveal style={{ '--rv-delay': '60ms' }}>
              {DECISION.heading[1]} Here is how it works through one real case, from the certificate to the decision.
            </p>
          </div>
          <div className="mxq-case" data-reveal style={{ '--rv-delay': '100ms' }}>
            <p className="mxq-case-k">The case · Heat 24A8871</p>
            <ul>
              {FACTS.map(({ icon: Icon, tone, k, v }) => (
                <li key={k} className={`is-${tone}`}>
                  <span aria-hidden="true">
                    <Icon size={16} />
                  </span>
                  <div>
                    <small>{k}</small>
                    <b>{v}</b>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mxq-ask">{DECISION.question}</p>
            <div className="px-vh">
              {DECISION.story.map((p) => (
                <p key={p.slice(0, 16)}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        <div ref={ref} className={`mxq-board${decided ? ' is-decided' : ''}`} data-reveal="scale" style={{ '--rv-delay': '120ms' }}>
          {/* The five steps, clickable */}
          <div className="mxq-top">
            <span className="mxq-gate">
              <Sparkles size={15} aria-hidden="true" />
              Star QA agent
            </span>
            <ol className="mxq-steps" aria-label="How the agent works through the case">
              {STEPS.map((s, i) => (
                <li key={s} className={`${i < step ? 'is-done' : ''}${i === step ? ' is-now' : ''}`}>
                  <button type="button" onClick={() => setTick(STEP_AT[i])}>
                    <i>{i < step ? <Check size={11} strokeWidth={3.4} /> : i + 1}</i>
                    {s}
                  </button>
                </li>
              ))}
            </ol>
            <span className={`mxq-status${decided ? ' is-hold' : ''}`}>{decided ? 'Held for QA' : STEPS[step] + '…'}</span>
          </div>

          <div className="mxq-grid">
            {/* 1 · The incoming certificate */}
            <div className={`mxq-mtr${step === 0 ? ' is-reading' : ''}`}>
              <div className="mxq-mtr-top">
                <span>N</span>
                <div>
                  <b>Northfield Steel Mill</b>
                  <small>MTR · PO 44-1180</small>
                </div>
              </div>
              {MTR.map(([k, v]) => (
                <p key={k} className={k === 'Charpy' ? 'is-gap' : ''}>
                  <small>{k}</small>
                  <b>{v}</b>
                </p>
              ))}
              <i className="mxq-beam" aria-hidden="true" />
              <span className="mxq-mtr-note">
                <AlertTriangle size={12} aria-hidden="true" />
                No impact test reported
              </span>
            </div>

            {/* 2 · Requirement by requirement */}
            <div className="mxq-ev">
              <div className="mxq-ev-head">
                <span>Requirement</span>
                <span>Required by</span>
                <span>Evidence found</span>
                <span>Result</span>
              </div>
              <ul>
                {ROWS.map((r, i) => {
                  const Src = r.srcIcon;
                  const Res = RES_ICON[r.res];
                  const state = i < rowsDone ? `is-done is-${r.res}` : i === rowsDone && step === 1 ? 'is-now' : '';
                  return (
                    <li key={r.req} className={state}>
                      <b>{r.req}</b>
                      <span className="mxq-src">
                        <Src size={13} aria-hidden="true" />
                        {r.src}
                      </span>
                      <span className="mxq-evd">{r.ev}</span>
                      <span className="mxq-res">
                        <Res size={12} strokeWidth={3} aria-hidden="true" />
                        {r.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="mxq-tally">
                <span className="is-ok">
                  <b>{pass}</b> passed
                </span>
                <span className="is-bad">
                  <b>{flags}</b> need attention
                </span>
                <span className="mxq-tally-bar" aria-hidden="true">
                  <i style={{ width: `${(rowsDone / ROWS.length) * 100}%` }} />
                </span>
              </div>
            </div>

            {/* 4 · The gate */}
            <div className="mxq-decide">
              <p className="mxq-lab">QA decision</p>
              <ul className="mxq-opts">
                {OPTIONS.map(([label, tone, pct]) => (
                  <li key={label} className={`mxq-opt mxq-opt--${tone}${decided && tone === 'hold' ? ' is-on' : ''}`}>
                    <span className="mxq-opt-l">
                      <i aria-hidden="true" />
                      {label}
                    </span>
                    <span className="mxq-opt-bar" aria-hidden="true">
                      <u style={{ width: decided ? `${pct}%` : '0%' }} />
                    </span>
                    <span className="mxq-opt-p">{decided ? `${pct}%` : '–'}</span>
                  </li>
                ))}
              </ul>
              <div className="mxq-verdict">
                <span aria-hidden="true">
                  <AlertTriangle size={18} />
                </span>
                <div>
                  <small>Recommendation</small>
                  <b>{DECISION.rec.title}</b>
                </div>
              </div>
              <p className="mxq-why">Two customer requirements aren’t evidenced and this supplier has failed the same test before. Holding costs a few hours; releasing risks a rejected vessel.</p>
            </div>
          </div>

          <div className="mxq-grid2">
            {/* 3 · The scale */}
            <div className={`mxq-weigh${weighed ? ' is-on' : ''}`}>
              <p className="mxq-lab">Weighing the risk</p>
              <div className="mxq-scale" aria-hidden="true">
                <div className="mxq-beam-arm">
                  <div className="mxq-pan mxq-pan--l">
                    <small>For release</small>
                    <span className="is-ok">Chemistry ✓</span>
                    <span className="is-ok">Mechanicals ✓</span>
                    <span className="is-info">Needed today</span>
                  </div>
                  <div className="mxq-pan mxq-pan--r">
                    <small>For hold</small>
                    <span className="is-bad">No impact test</span>
                    <span className="is-bad">HT incomplete</span>
                    <span className="is-warn">2 prior NCRs</span>
                  </div>
                </div>
                <span className="mxq-fulcrum" />
              </div>
              <div className="mxq-gauge">
                <svg viewBox="0 0 120 66" aria-hidden="true">
                  <path className="mxq-g-base" d="M10 60 A50 50 0 0 1 110 60" pathLength="100" />
                  <path className="mxq-g-val" d="M10 60 A50 50 0 0 1 110 60" pathLength="100" style={{ strokeDasharray: `${weighed ? 78 : 0} 100` }} />
                </svg>
                <b>{weighed ? 78 : 0}</b>
                <small>Release risk · high</small>
              </div>
            </div>

            {/* 5 · What happens next */}
            <div className="mxq-act">
              <p className="mxq-lab">What Star does next</p>
              <ol>
                {ACTIONS.map(({ icon: Icon, text, at }, i) => (
                  <li key={at} className={i < acted ? 'is-on' : ''}>
                    <span className="mxq-act-ic" aria-hidden="true">
                      <Icon size={15} />
                    </span>
                    <p>{text}</p>
                    <em>{i < acted ? at : 'Queued'}</em>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
