import { useRef } from 'react';
import { AlertTriangle, Check, ClipboardList, FileText, Gauge, ShieldCheck, ShoppingCart, Sparkles, TrendingUp, Users, X } from 'lucide-react';
import { useLoop } from '../mtrx/motion';
import SecHead from '../mtrx/SecHead';
import { C_FLOW } from '../../data/coaX';

const ICONS = { po: ShoppingCart, spec: ClipboardList, rules: ShieldCheck, history: Users, trend: TrendingUp };
const CTX = C_FLOW.context.length + 1; // the certificate, then each piece of context
const CK = C_FLOW.checks.length;
// 1..CTX: the certificate and its context are gathered · then each check
// runs · REC: the recommendation lands, its parts one tick apart · rest.
const CK0 = CTX + 1;
const REC = CK0 + CK;
const LENGTH = REC + 11;

// The decision from inside: context gathered on the left, the agents'
// checks in the middle, the recommendation on the right. It plays while
// on screen; with reduced motion it shows the finished board.
export default function Flow() {
  const d = C_FLOW;
  const ref = useRef(null);
  const [tick] = useLoop(ref, { ms: 650, length: LENGTH, rest: REC + 5, threshold: 0.25 });
  const phase = tick >= REC ? 'rec' : tick >= CK0 ? 'eval' : tick >= 1 ? 'ctx' : 'idle';
  const nowCheck = phase === 'eval' ? tick - CK0 : -1;
  const used = new Set(d.checks.slice(0, phase === 'eval' ? nowCheck + 1 : phase === 'rec' ? CK : 0).map((c) => c[1]));
  const nowAgent = nowCheck >= 0 ? d.checks[nowCheck][1] : null;
  const status = {
    idle: 'Waiting for a COA',
    ctx: tick === 1 ? 'COA received · review started' : `Gathering context · ${tick - 1} of ${CTX - 1}`,
    eval: `Evaluating · ${nowCheck + 1} of ${CK}`,
    rec: 'Recommendation ready',
  }[phase];
  const at = (k) => (tick >= REC + k ? ' is-in' : '');

  return (
    <section id="decide-flow" className="mx-sec cxw-sec" aria-labelledby="cxw-title">
      <div className="mt-wrap">
        <SecHead id="cxw-title" label={d.label} title={d.title} accent={d.accent} lead={d.lead} />

        <div
          ref={ref}
          className={`cxw is-${phase}`}
          role="img"
          aria-label={`Star gathers the certificate, the purchase order, the approved specification, FDA and USP rules, supplier history and the trend for lot ${d.coa.lot}; its agents run ${CK} checks; and it recommends: ${d.verdict}.`}
        >
          <div className="cxw-bar" aria-hidden="true">
            <span className="cxw-bot">
              <Sparkles size={12} />
              Star AI
            </span>
            <b>
              Incoming COA: QA decision <span>· Lot {d.coa.lot}</span>
            </b>
            <ol className="cxw-phases">
              {['Context', 'Evaluation', 'Recommendation'].map((p, i) => {
                const k = ['ctx', 'eval', 'rec'].indexOf(phase);
                return (
                  <li key={p} className={`${k === i ? 'is-now' : ''}${k > i ? ' is-done' : ''}`}>
                    <i>{k > i ? <Check size={10} strokeWidth={3.4} /> : i + 1}</i>
                    {p}
                  </li>
                );
              })}
            </ol>
            <em className={`cxw-status is-${phase}`}>{status}</em>
          </div>

          <div className="cxw-grid" aria-hidden="true">
            {/* 1 · Context */}
            <div className="cxw-col">
              <p className="cxw-lab">
                <span>1</span>Starts with the incoming COA
              </p>
              <div className={`cxw-coa${tick >= 1 ? ' is-on' : ''}${tick === 1 ? ' is-now' : ''}`}>
                <span className="cxw-start">
                  <i />
                  Start
                </span>
                <span className="cxw-doc">
                  <i />
                  <i />
                  <i />
                  <i />
                  <em>PDF</em>
                </span>
                <div>
                  <small>Incoming COA · from the supplier</small>
                  <b>{d.coa.product}</b>
                  <p>
                    Lot {d.coa.lot} · {d.coa.supplier}
                  </p>
                  <span className="cxw-pass">{d.coa.status}</span>
                </div>
              </div>
              <div className="cxw-tree">
                <p className={`cxw-pull${tick >= 2 ? ' is-on' : ''}`}>The COA starts the review. Star pulls in:</p>
                <ul className="cxw-ctx">
                  {d.context.map(([icon, title, , finding, tone, from], i) => {
                    const Icon = ICONS[icon];
                    const k = i + 2;
                    return (
                      <li key={title} className={`is-${tone}${tick >= k ? ' is-on' : ''}${tick === k ? ' is-now' : ''}`}>
                        <span className="cxw-seg" />
                        <span className="cxw-branch" />
                        <span className="cxw-ctx-ic">
                          <Icon size={16} />
                        </span>
                        <div>
                          <b>
                            {title}
                            <em>{from}</em>
                          </b>
                          <p>{finding}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <span className={`cxw-pipe${phase === 'ctx' || phase === 'eval' ? ' is-on' : ''}${phase === 'rec' ? ' is-done' : ''}`}>
              <i />
            </span>

            {/* 2 · AI evaluation */}
            <div className="cxw-col">
              <p className="cxw-lab">
                <span>2</span>AI evaluation
              </p>
              <div className="cxw-core">
                <div className="cxw-core-h">
                  <span className="cxw-spark">
                    <Sparkles size={18} />
                  </span>
                  <div>
                    <b>Star AI evaluation</b>
                    <small>{phase === 'rec' ? `${CK} of ${CK} checks complete` : phase === 'eval' ? `Running check ${nowCheck + 1} of ${CK}` : 'Starts when the context is in'}</small>
                  </div>
                </div>
                <i className="cxw-core-bar" style={{ '--p': phase === 'rec' ? 1 : phase === 'eval' ? nowCheck / CK : 0 }} />
                <ol className="cxw-checks">
                  {d.checks.map(([what, agent], i) => {
                    const done = phase === 'rec' || (phase === 'eval' && i < nowCheck);
                    const now = i === nowCheck;
                    return (
                      <li key={what} className={`${done ? 'is-done' : ''}${now ? ' is-now' : ''}`}>
                        <span className="cxw-tick">{done ? <Check size={11} strokeWidth={3.4} /> : <i />}</span>
                        <p>{what}</p>
                        <em>{agent.replace(' agent', '')}</em>
                      </li>
                    );
                  })}
                </ol>
                <div className="cxw-agents">
                  <p>AI agents involved</p>
                  <ul>
                    {d.agents.map((a) => (
                      <li key={a} className={`${used.has(a) ? 'is-used' : ''}${a === nowAgent ? ' is-now' : ''}`}>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <span className={`cxw-pipe${phase === 'rec' ? ' is-on is-out' : ''}`}>
              <i />
            </span>

            {/* 3 · Recommendation */}
            <div className="cxw-col">
              <p className="cxw-lab">
                <span>3</span>Recommendation
              </p>
              <div className={`cxw-rec${phase === 'rec' ? ' is-on' : ''}`}>
                <div className="cxw-rec-h">
                  <small>
                    <AlertTriangle size={13} />
                    AI recommendation
                  </small>
                  <span className={`cxw-stamp${at(0)}`}>{d.verdict}</span>
                  {phase !== 'rec' && <span className="cxw-wait">Appears when every check is done</span>}
                </div>

                <div className={`cxw-block${at(1)}`}>
                  <p className="cxw-bh">
                    Critical findings <b>{d.critical.length}</b>
                  </p>
                  <ul className="cxw-list is-bad">
                    {d.critical.map((t) => (
                      <li key={t}>
                        <span>
                          <X size={10} strokeWidth={3.4} />
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`cxw-block${at(2)}`}>
                  <p className="cxw-bh">
                    Risk signals <b>{d.risks.length}</b>
                  </p>
                  <ul className="cxw-list is-warn">
                    {d.risks.map((t) => (
                      <li key={t}>
                        <span>
                          <AlertTriangle size={10} strokeWidth={2.8} />
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`cxw-block${at(3)}`}>
                  <p className="cxw-bh">Suggested next steps</p>
                  <ol className="cxw-steps">
                    {d.steps.map((t, i) => (
                      <li key={t}>
                        <span>{i + 1}</span>
                        {t}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className={`cxw-impact${at(4)}`}>
                  <span className="cxw-impact-ic">
                    <Gauge size={16} />
                  </span>
                  <div>
                    <b>
                      Production impact: <em>{d.impact[0]}</em>
                    </b>
                    <small>{d.impact[1]}</small>
                  </div>
                  <i className="cxw-meter">
                    <i />
                    <i />
                    <i />
                  </i>
                </div>
              </div>
            </div>
          </div>

          <div className="cxw-foot" aria-hidden="true">
            <p>
              <FileText size={14} />
              Guidelines referenced
            </p>
            <ul>
              {d.basis.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
