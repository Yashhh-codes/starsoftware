import { useRef } from 'react';
import { ClipboardCheck, FileSearch, FileText, GitCompareArrows, History, ShieldAlert, Inbox, ScanText, Route, UserCheck } from 'lucide-react';
import { useLoop } from '../mtrx/motion';
import SecHead from '../mtrx/SecHead';
import { C_CONTROLS } from '../../data/coaX';

const STEP_ICONS = [Inbox, ScanText, GitCompareArrows, ShieldAlert, UserCheck];
const CONTROL_ICONS = [FileSearch, ClipboardCheck, History, Route];
// Which steps each control is at work in.
const CONTROL_AT = [[0, 1, 2], [2], [4], [3]];
// One audit-trail line per step.
const LOG = [
  ['09:14:02', 'COA received from NovaChem by email'],
  ['09:14:05', '18 fields extracted · lot PG-261004'],
  ['09:14:06', 'Matched to PG-USP-004 Rev. 12'],
  ['09:14:06', '3 exceptions routed to QA'],
  ['09:31:40', 'QA review by J. Patel · held, supplier contacted'],
];
const N = C_CONTROLS.steps.length;
const LENGTH = N + 5;

export default function Controls() {
  const ref = useRef(null);
  const [tick] = useLoop(ref, { ms: 1200, length: LENGTH, rest: LENGTH - 1, threshold: 0.35 });
  const at = Math.min(tick, N - 1);

  return (
    <section className="mx-sec mx-sec--soft cxc" aria-labelledby="cxc-title">
      <div className="mt-wrap">
        <SecHead id="cxc-title" label="Compliance controls" title={C_CONTROLS.title} accent={C_CONTROLS.titleEnd} lead={C_CONTROLS.lead} />

        <div ref={ref} className="cxc-board" data-reveal="scale" style={{ '--rv-delay': '120ms' }}>
          <ol className="cxc-track" style={{ '--p': at / (N - 1) }}>
            <span className="cxc-rail" aria-hidden="true">
              <i />
            </span>
            {C_CONTROLS.steps.map((s, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <li key={s} className={`${i < at || tick >= N ? 'is-done' : ''}${i === at && tick < N ? ' is-now' : ''}`}>
                  <span className="cxc-node" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <small>{String(i + 1).padStart(2, '0')}</small>
                  <b>{s}</b>
                </li>
              );
            })}
            <span className="cxc-token" aria-hidden="true">
              <FileText size={14} />
              COA
            </span>
          </ol>

          <div className="cxc-grid">
            <ul className="cxc-controls">
              {C_CONTROLS.controls.map(([t, d], i) => {
                const Icon = CONTROL_ICONS[i];
                const live = CONTROL_AT[i].includes(at) && tick < N;
                return (
                  <li key={t} className={live ? 'is-live' : ''}>
                    <span aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    <div>
                      <b>{t}</b>
                      <p>{d}</p>
                    </div>
                    <em>{live ? 'Running' : 'On'}</em>
                  </li>
                );
              })}
            </ul>

            <div className="cxc-log">
              <div className="cxc-log-top">
                <History size={15} aria-hidden="true" />
                <b>Audit trail</b>
                <span>Lot PG-261004</span>
              </div>
              <ol>
                {LOG.map(([time, text], i) => (
                  <li key={text} className={i <= at || tick >= N ? 'is-on' : ''}>
                    <time>{time}</time>
                    <span>{text}</span>
                  </li>
                ))}
              </ol>
              <p className="cxc-log-foot">Every value links back to the page of the certificate it came from.</p>
            </div>
          </div>
          <p className="cxc-note">{C_CONTROLS.note}</p>
        </div>
      </div>
    </section>
  );
}
