import { useRef } from 'react';
import { AlertTriangle, ArrowDown, Check, CircleHelp, Clock3, FlaskConical, Mail, UserCheck, X } from 'lucide-react';
import { useLoop } from '../mtrx/motion';
import SecHead from '../mtrx/SecHead';
import { C_DECIDE } from '../../data/coaX';

// The questions Star asks of the lot, in order: [question, answer, ok,
// what it found]. ok: true yes, false a failure, 'warn' a note.
const QS = [
  ['Is the supplier approved for this material?', 'Yes', true, 'NovaChem is on the approved supplier list'],
  ['Was it made at an approved site?', 'No', false, 'Site B is not approved for propylene glycol'],
  ['Does the COA cite the current specification?', 'No', false, 'Rev. 11 cited, Rev. 12 is current'],
  ['Are all required tests reported?', 'No', false, '3 tests required by Rev. 12 are missing'],
  ['Are reported results within limits?', 'Yes', 'warn', 'DEG 0.07% is in spec but above this supplier’s usual'],
  ['Can production wait for QA?', 'Needed tomorrow', 'warn', 'QA asked to review today'],
];
const OUTCOMES = [
  ['Release', 'ok'],
  ['Hold for QA', 'hold'],
  ['Reject', 'bad'],
];
const ACTIONS = [
  [Mail, 'Supplier asked for a Rev. 12 COA and the missing tests'],
  [UserCheck, 'QA reviews site approval with the supplier quality team'],
  [Clock3, 'Lot PG-261004 stays in quarantine until both arrive'],
];
const N = QS.length;
// 0: the lot arrives · 1..N: a question each · N+1: the outcome · then it
// rests.
const OUT = N + 1;
const LENGTH = OUT + 7;

export default function Decide() {
  const ref = useRef(null);
  const [tick] = useLoop(ref, { ms: 1050, length: LENGTH, rest: LENGTH - 1, threshold: 0.3 });
  const decided = tick >= OUT;
  const fails = QS.filter((q, i) => q[2] === false && tick > i).length;

  return (
    <section id="decide" className="mx-sec mx-sec--soft cxd" aria-labelledby="cxd-title">
      <div className="mt-wrap">
        <SecHead id="cxd-title" label="How the AI decides" title={C_DECIDE.title} accent="Star decides the release." statement={{ dark: C_DECIDE.title, grey: C_DECIDE.lead }}>
          {C_DECIDE.story.map((p) => (
            <p key={p.slice(0, 12)} className="mx-lead cxd-story">
              {p}
            </p>
          ))}
        </SecHead>

        <div ref={ref} className={`cxd-board${decided ? ' is-decided' : ''}`} data-reveal="scale" style={{ '--rv-delay': '120ms' }}>
          {/* The lot */}
          <aside className="cxd-lot">
            <div className="cxd-lot-top">
              <span aria-hidden="true">
                <FlaskConical size={18} />
              </span>
              <div>
                <small>Lot PG-261004 · received</small>
                <b>Propylene Glycol USP</b>
              </div>
            </div>
            <dl>
              <div>
                <dt>Supplier</dt>
                <dd>NovaChem Ingredients</dd>
              </div>
              <div>
                <dt>Supplier status</dt>
                <dd className={`cxd-pass${decided ? ' is-over' : ''}`}>Pass</dd>
              </div>
              <div>
                <dt>Needed by</dt>
                <dd>Production, tomorrow</dd>
              </div>
              <div>
                <dt>Issues found</dt>
                <dd className="cxd-fails">{fails}</dd>
              </div>
            </dl>
            <p className="cxd-q">
              <CircleHelp size={16} aria-hidden="true" />
              {C_DECIDE.question}
            </p>
            <div className="cxd-basis">
              <small>Checked against</small>
              <ul>
                {C_DECIDE.basis.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </aside>

          {/* The tree */}
          <div className="cxd-tree">
            <ol className="cxd-qs">
              {QS.map(([q, a, ok, found], i) => {
                const state = tick > i + 1 || decided ? 'is-done' : tick === i + 1 ? 'is-now' : '';
                const tone = ok === true ? 'ok' : ok === false ? 'bad' : 'warn';
                return (
                  <li key={q} className={`cxd-node ${state} is-${tone}`}>
                    <span className="cxd-dot" aria-hidden="true">
                      {state === 'is-done' ? tone === 'ok' ? <Check size={13} strokeWidth={3.2} /> : tone === 'bad' ? <X size={13} strokeWidth={3.2} /> : <AlertTriangle size={12} strokeWidth={2.6} /> : i + 1}
                    </span>
                    <div className="cxd-qbox">
                      <p>{q}</p>
                      <em>{state ? a : '…'}</em>
                    </div>
                    <span className="cxd-branch" aria-hidden="true" />
                    <div className="cxd-found">
                      <small>{tone === 'ok' ? 'Confirmed' : tone === 'bad' ? 'Issue' : 'Note'}</small>
                      <p>{found}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="cxd-outs">
              <span className="cxd-down" aria-hidden="true">
                <ArrowDown size={16} />
              </span>
              <div className="cxd-opts" role="radiogroup" aria-label="Release decision">
                {OUTCOMES.map(([label, tone]) => (
                  <span key={label} role="radio" aria-checked={decided && tone === 'hold'} className={`cxd-opt cxd-opt--${tone}${decided && tone === 'hold' ? ' is-on' : ''}`}>
                    {label}
                  </span>
                ))}
              </div>
              <ul className="cxd-acts">
                {ACTIONS.map(([Icon, text], i) => (
                  <li key={text} style={{ '--d': `${0.3 + i * 0.25}s` }}>
                    <Icon size={15} aria-hidden="true" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
