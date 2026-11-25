import { useRef, useState } from 'react';
import { AlertTriangle, ArrowRight, BookOpen, Check, Database, DraftingCompass, History, Mail, RotateCcw, Sparkles, Table2 } from 'lucide-react';
import SecHead from '../mtrx/SecHead';
import { useLoop } from '../mtrx/motion';
import { R_INVESTIGATE } from '../../data/rfqX';

export const ICONS = { drawing: DraftingCompass, sheet: Table2, book: BookOpen, mail: Mail, erp: Database, history: History };
const SPAN = 8; // ticks per stage
const MS = 650;

// The files sorted at intake: [kind, count].
const SORT = [
  ['Drawings', 22],
  ['BOM', 1],
  ['Specification', 1],
  ['Email + notes', 2],
];

function Intake({ sub }) {
  const d = R_INVESTIGATE;
  return (
    <div className="rqi-intake">
      <div className="rqi-sort">
        <p className="rqi-lab">26 files sorted</p>
        {SORT.map(([k, n], i) => (
          <p key={k} className={sub > i ? 'is-on' : ''}>
            <span>{k}</span>
            <i style={{ '--w': `${Math.max(8, (n / 22) * 100)}%` }} />
            <b>{n}</b>
          </p>
        ))}
      </div>
      <div className="rqi-record">
        <p className="rqi-lab">RFQ record</p>
        {d.intake.map(([k, v, src], i) => (
          <p key={k} className={`${sub > i + 1 ? 'is-on' : ''}${k === 'Missing' ? ' is-warn' : ''}`}>
            <span>{k}</span>
            <b>{v}</b>
            <small>{src}</small>
          </p>
        ))}
      </div>
    </div>
  );
}

function Agents({ sub }) {
  return (
    <div className="rqi-agents">
      {R_INVESTIGATE.agents.map(([name, icon, finds], i) => {
        const Icon = ICONS[icon];
        const shown = Math.max(0, sub - i);
        const done = shown > finds.length;
        return (
          <div key={name} className={`rqi-agent${shown > 0 ? ' is-on' : ''}${done ? ' is-done' : ''}`}>
            <p className="rqi-agent-h">
              <span className="rqi-agent-ic">
                <Icon size={16} />
              </span>
              <b>{name}</b>
              <em>{done ? 'Done' : shown > 0 ? 'Reading' : 'Queued'}</em>
            </p>
            <ul>
              {finds.map((f, k) => (
                <li key={f} className={shown > k ? 'is-on' : ''}>
                  <Check size={12} strokeWidth={3} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function Flag({ sub }) {
  return (
    <div className="rqi-flags">
      {R_INVESTIGATE.risks.map(([title, detail, team, sev], i) => (
        <div key={title} className={`rqi-flag is-${sev}${sub > i * 2 ? ' is-on' : ''}${sub > i * 2 + 1 ? ' is-sent' : ''}`}>
          <span className="rqi-flag-ic">
            <AlertTriangle size={15} />
          </span>
          <div className="rqi-flag-t">
            <b>{title}</b>
            <small>{detail}</small>
          </div>
          <span className="rqi-wire" aria-hidden="true">
            <i />
          </span>
          <span className="rqi-team">
            <small>Routed to</small>
            <b>{team}</b>
          </span>
        </div>
      ))}
    </div>
  );
}

function Build({ sub }) {
  const d = R_INVESTIGATE;
  return (
    <div className="rqi-build">
      <ol>
        {d.build.map(([title, text, value], i) => (
          <li key={title} className={`${sub > i * 2 ? 'is-on' : ''}${i === 2 ? ' is-final' : ''}`}>
            <span className="rqi-build-n">{i === 2 ? <Sparkles size={14} /> : i + 1}</span>
            <div>
              <b>{title}</b>
              <small>{text}</small>
            </div>
            <em>{value}</em>
          </li>
        ))}
      </ol>
      <div className={`rqi-open${sub >= 6 ? ' is-on' : ''}`}>
        <p className="rqi-lab">Before it goes out</p>
        {d.risks.map(([title, , team, sev]) => (
          <span key={title} className={`is-${sev}`}>
            {title}
            <small>{team}</small>
          </span>
        ))}
      </div>
    </div>
  );
}

const PANELS = [Intake, Agents, Flag, Build];
const STATUS = ['Reading the package…', 'Agents investigating…', 'Checking risks…', 'Conditional quote ready'];

// The investigation as a four-stage walkthrough beside the RFQ package. It
// plays on its own while on screen; choosing a stage holds it there.
export default function Investigate() {
  const d = R_INVESTIGATE;
  const ref = useRef(null);
  const [tick, setTick] = useLoop(ref, { ms: MS, length: SPAN * 4, rest: SPAN * 4 - 1, threshold: 0.2 });
  const [held, setHeld] = useState(null);
  const stage = held ?? Math.floor(tick / SPAN);
  const sub = held != null ? SPAN : tick % SPAN;
  const Panel = PANELS[stage];
  const read = stage > 0 ? 4 : Math.min(4, sub);
  const secs = held != null ? [12, 24, 33, 41][held] : Math.round(((tick + 1) / (SPAN * 4)) * 41);

  return (
    <section id="investigation" className="mx-sec rqx-sec rqx-inv" aria-labelledby="rqi-title">
      <div className="mt-wrap">
        <SecHead id="rqi-title" label={d.label} title={d.title} accent={d.accent} lead={d.lead} />

        <div ref={ref} className="rqi" data-reveal="scale">
          <div className="rqi-bar">
            <span className="rqi-bot">
              <i aria-hidden="true" />
              Star AI agents
            </span>
            <b>
              {d.rfq[0]} <span>· {d.rfq[1]}</span>
            </b>
            <small className="rqi-due">{d.rfq[2]}</small>
            <em className={`rqi-status${stage === 3 && sub >= 6 ? ' is-done' : ''}`} aria-live="polite">
              {stage === 3 && sub >= 6 ? STATUS[3] : STATUS[Math.min(stage, 2)]}
            </em>
            <span className="rqi-clock" aria-hidden="true">
              0:{String(secs).padStart(2, '0')}
            </span>
            {held != null && (
              <button type="button" className="rqi-replay" onClick={() => { setHeld(null); setTick(0); }}>
                <RotateCcw size={13} />
                Play all
              </button>
            )}
          </div>

          <div className="rqi-body">
            <aside className="rqi-pack" aria-label="The RFQ package">
              <p className="rqi-lab">The package</p>
              {d.package.map(([name, count, fmt, icon], i) => {
                const Icon = ICONS[icon];
                return (
                  <div key={name} className={`rqi-file${read > i ? ' is-read' : ''}${stage === 0 && sub === i ? ' is-now' : ''}`}>
                    <span className="rqi-file-ic">
                      <Icon size={17} />
                    </span>
                    <div>
                      <b>{name}</b>
                      <small>
                        {count} · {fmt}
                      </small>
                    </div>
                    <span className="rqi-file-ok" aria-hidden="true">
                      <Check size={11} strokeWidth={3.2} />
                    </span>
                    <span className="rqi-file-bar" aria-hidden="true" />
                  </div>
                );
              })}
              <div className="rqi-pack-sum">
                <ArrowRight size={14} aria-hidden="true" />
                <span>
                  <b>26 files</b> in, <b>43 line items</b> out
                </span>
              </div>
            </aside>

            <div className="rqi-main">
              <div className="rqi-steps" role="tablist" aria-label="Stages of the investigation">
                {d.stages.map(([n, name, text], i) => (
                  <button
                    key={n}
                    type="button"
                    role="tab"
                    aria-selected={stage === i}
                    className={`rqi-step${stage === i ? ' is-on' : ''}${stage > i ? ' is-past' : ''}`}
                    onClick={() => setHeld(i)}
                  >
                    <span className="rqi-step-n">{stage > i ? <Check size={12} strokeWidth={3} /> : n}</span>
                    <span className="rqi-step-t">
                      <b>{name}</b>
                      <small>{text}</small>
                    </span>
                    <i className="rqi-step-fill" style={{ '--p': stage === i ? Math.min(1, (sub + 1) / SPAN) : stage > i ? 1 : 0 }} aria-hidden="true" />
                  </button>
                ))}
              </div>
              <div className="rqi-panel" role="tabpanel" key={stage}>
                <Panel sub={sub} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
