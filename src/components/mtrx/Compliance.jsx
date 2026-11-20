import { useRef } from 'react';
import { AlertTriangle, Check, FileBadge, ClipboardList, X } from 'lucide-react';
import SecHead from './SecHead';
import { useLoop } from './motion';
import { COMPLIANCE } from '../../data/mtrCampaign';

// What the order requires, and what the MTR proves for it. `ok` false is a
// gap: the evidence isn't there, or isn't what was ordered.
const ROWS = [
  { std: 'ASTM A6/A6M', req: 'Grade A516 Gr. 70, chemistry within limits', ev: 'A516 Gr. 70 · C 0.21 · Mn 1.05 · P 0.010', ok: true },
  { std: 'ASTM A370', req: 'Yield, tensile and elongation reported', ev: 'YS 47.5 · TS 79.0 ksi · El 24%', ok: true },
  { std: 'Customer PO', req: 'Charpy impact test at −46 °C', ev: 'Not on the certificate', ok: false },
  { std: 'ISO 9001 8.5.2', req: 'Heat traced to the receipt', ev: 'Heat 24A8871 → receipt RC-55102', ok: true },
  { std: 'EN 10204', req: 'Inspection certificate, type 3.2', ev: 'Type 3.1 supplied', ok: false },
];
const N = ROWS.length;
// 0: both documents open; 1..N: one requirement is matched per tick;
// N+1: the verdict; then it rests.
const VERDICT = N + 1;
const LENGTH = VERDICT + 6;

export default function Compliance() {
  const ref = useRef(null);
  const [tick] = useLoop(ref, { ms: 1250, length: LENGTH, rest: LENGTH - 1, threshold: 0.35 });
  const done = Math.max(0, Math.min(N, tick));
  const proven = ROWS.filter((r, i) => r.ok && i < done).length;
  const gaps = ROWS.filter((r, i) => !r.ok && i < done).length;
  const verdict = tick >= VERDICT;

  return (
    <section className="mx-sec mxc2" aria-labelledby="mxc-title">
      <div className="mt-wrap">
        <SecHead
          id="mxc-title"
          label="Compliance and traceability"
          title="Every shipment has a spec."
          accent="Does the MTR prove it?"
          lead="Star reads the certificate and matches every requirement on the order to the evidence on the MTR, so gaps are caught before they become delays, rejected shipments or rework."
        >
          <p className="px-vh">{COMPLIANCE.text}</p>
        </SecHead>

        <div ref={ref} className={`mxc2-board${verdict ? ' is-done' : ''}`} data-reveal="scale" style={{ '--rv-delay': '120ms' }}>
          <span className="mxc2-panel mxc2-panel--spec" aria-hidden="true" />
          <span className="mxc2-panel mxc2-panel--mtr" aria-hidden="true" />

          <div className="mxc2-h mxc2-h--spec">
            <span className="mxc2-h-ic" aria-hidden="true">
              <ClipboardList size={18} />
            </span>
            <div>
              <small>What the order requires</small>
              <b>PO 44-1180 · A516 Gr. 70 plate</b>
            </div>
          </div>
          <div className="mxc2-h mxc2-h--mid" aria-hidden="true">
            <span>Star matches</span>
          </div>
          <div className="mxc2-h mxc2-h--mtr">
            <span className="mxc2-h-ic" aria-hidden="true">
              <FileBadge size={18} />
            </span>
            <div>
              <small>What the MTR proves</small>
              <b>Northfield Steel Mill · Heat 24A8871</b>
            </div>
          </div>

          {ROWS.map((r, i) => {
            const state = i < done ? (r.ok ? 'is-ok' : 'is-gap') : i === done && tick > 0 ? 'is-now' : '';
            return (
              <div key={r.std} className={`mxc2-row ${state}`} style={{ '--r': i + 2 }}>
                <div className="mxc2-req">
                  <span className="mxc2-std">{r.std}</span>
                  <p>{r.req}</p>
                </div>
                <div className="mxc2-link" aria-hidden="true">
                  <i className="mxc2-wire mxc2-wire--l" />
                  <span className="mxc2-node">{r.ok ? <Check size={14} strokeWidth={3.2} /> : <X size={14} strokeWidth={3.2} />}</span>
                  <i className="mxc2-wire mxc2-wire--r" />
                </div>
                <div className="mxc2-ev">
                  <p>{r.ev}</p>
                  <span className="mxc2-tag">{r.ok ? 'Proven' : 'Gap'}</span>
                </div>
                <span className="px-vh">{`${r.std}: ${r.req}. On the MTR: ${r.ev}. ${r.ok ? 'Proven.' : 'Gap, flagged for QA.'}`}</span>
              </div>
            );
          })}

          <div className="mxc2-sum" style={{ '--r': N + 2 }}>
            <div className="mxc2-ring" aria-hidden="true">
              <svg viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" />
                <circle className="mxc2-ring-v" cx="32" cy="32" r="26" pathLength="100" style={{ strokeDasharray: `${(proven / N) * 100} 100` }} />
              </svg>
              <b>
                {proven}/{N}
              </b>
            </div>
            <div className="mxc2-sum-t">
              <small>Proof score</small>
              <b>
                {proven} requirements proven · <em>{gaps} gaps</em>
              </b>
            </div>
            <div className={`mxc2-out${verdict ? ' is-on' : ''}`} role="status">
              <AlertTriangle size={16} aria-hidden="true" />
              <span>
                <b>Held before the material moves.</b> The supplier is asked for the impact test and a 3.2 certificate.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
