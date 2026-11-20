import { useRef, useState } from 'react';
import { BarChart3, FileText, Gavel, ListChecks, ScanText, ShieldCheck, TrendingUp } from 'lucide-react';
import { useLoop } from '../mtrx/motion';
import SecHead from '../mtrx/SecHead';
import { C_AGENTS } from '../../data/coaX';

const ICONS = { doc: ScanText, spec: ListChecks, comp: ShieldCheck, risk: BarChart3, trend: TrendingUp, dec: Gavel };
const A = C_AGENTS.items;
const N = A.length;
const LENGTH = N + 6;
const R = 108;
const C = 2 * Math.PI * R;
const GAP = 6;

// The agents switch on one by one, each filling its part of the ring
// around the certificate. Click one to read what it does.
export default function Agents() {
  const ref = useRef(null);
  const [tick] = useLoop(ref, { ms: 1000, length: LENGTH, rest: LENGTH - 1, threshold: 0.35 });
  const [picked, setPicked] = useState(null);
  const on = Math.min(tick, N);
  const focus = picked ?? Math.max(0, on - 1);
  const f = A[focus];
  const FIcon = ICONS[f.key];
  const seg = C / N;

  return (
    <section id="agents" className="mx-sec cxa" aria-labelledby="cxa-title">
      <div className="mt-wrap">
        <SecHead id="cxa-title" label="Pre-built agents" title={C_AGENTS.title} accent={C_AGENTS.titleEnd} lead={C_AGENTS.lead} />

        <div ref={ref} className="cxa-board" data-reveal="scale" style={{ '--rv-delay': '120ms' }}>
          <ul className="cxa-list">
            {A.map((a, i) => {
              const Icon = ICONS[a.key];
              const isOn = i < on;
              return (
                <li key={a.key}>
                  <button type="button" className={`${isOn ? 'is-on' : ''}${i === focus ? ' is-focus' : ''}`} style={{ '--c': a.c }} onClick={() => setPicked(i)} aria-pressed={i === focus}>
                    <span className="cxa-ic" aria-hidden="true">
                      <Icon size={17} />
                    </span>
                    <span className="cxa-t">
                      <b>{a.title}</b>
                      {a.tag && <small>{a.tag}</small>}
                    </span>
                    <span className="cxa-sw" aria-hidden="true">
                      <i />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="cxa-ring-wrap">
            <svg className="cxa-ring" viewBox="0 0 260 260" aria-hidden="true">
              <circle cx="130" cy="130" r={R} className="cxa-ring-base" />
              {A.map((a, i) => (
                <circle
                  key={a.key}
                  cx="130"
                  cy="130"
                  r={R}
                  className={`cxa-seg${i < on ? ' is-on' : ''}${i === focus ? ' is-focus' : ''}`}
                  style={{ stroke: a.c, strokeDasharray: `${seg - GAP} ${C - seg + GAP}`, strokeDashoffset: -(i * seg) - GAP / 2 }}
                />
              ))}
            </svg>
            <div className="cxa-core">
              <span className="cxa-core-ic" aria-hidden="true">
                <FileText size={22} />
              </span>
              <b>
                {on} of {N}
              </b>
              <small>agents on</small>
            </div>
          </div>

          <div className="cxa-detail" key={focus} style={{ '--c': f.c }}>
            <span className="cxa-d-ic" aria-hidden="true">
              <FIcon size={20} />
            </span>
            <small>{String(focus + 1).padStart(2, '0')} · {f.tag || 'Agent'}</small>
            <b>{f.title}</b>
            <p>{f.text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
