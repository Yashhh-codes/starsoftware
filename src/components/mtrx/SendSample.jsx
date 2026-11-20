import { useRef } from 'react';
import { AlertTriangle, ArrowRight, Check, FileCheck2, FileText, FileUp, MessagesSquare, Sparkles } from 'lucide-react';
import { useLoop } from './motion';
import { Eyebrow } from '../landing/LandingParts';
import { X_SEND } from '../../data/mtrX';
import { BOOKING_URL } from '../../data/mtrLanding';

const ICONS = [FileUp, FileCheck2, MessagesSquare];
const FIELDS = [
  ['Grade', 'A516 Gr. 70'],
  ['Heat', '24A8871'],
  ['Chemistry', '5 of 5 within limits'],
  ['Mechanical', '3 of 3 within limits'],
];

// 0: your file arrives · 1: fields come out · 2: checks · 3: the action
// · then it rests on the finished walkthrough.
export default function SendSample() {
  const ref = useRef(null);
  const [tick] = useLoop(ref, { ms: 1500, length: 7, rest: 6 });
  const step = Math.min(tick, 3);
  return (
    <section className="mx-sec mxf mxf2" aria-labelledby="mxf-title">
      <div className="mxf-bg" aria-hidden="true" />
      <div className="mt-wrap mxf2-inner">
        <div className="mxf2-copy">
          <Eyebrow>Send a sample</Eyebrow>
          <h2 id="mxf-title" className="mx-h2" data-reveal>
            What would Star extract <span>from your MTRs?</span>
          </h2>
          <p className="mx-lead" data-reveal style={{ '--rv-delay': '80ms' }}>
            {X_SEND.text}
          </p>
          <ol className="mxf2-steps" data-reveal style={{ '--rv-delay': '140ms' }}>
            {X_SEND.steps.map((s, i) => {
              const Icon = ICONS[i];
              const on = i === 0 ? step >= 0 : i === 1 ? step >= 1 : step >= 3;
              return (
                <li key={s} className={on ? 'is-on' : ''}>
                  <span aria-hidden="true">
                    <Icon size={17} />
                  </span>
                  <b>{s}</b>
                </li>
              );
            })}
          </ol>
          <div className="mxf-actions mxf2-actions" data-reveal style={{ '--rv-delay': '200ms' }}>
            <a className="mt-btn mt-btn--primary" href={BOOKING_URL}>
              <span>{X_SEND.cta}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="mxf-alt" href={BOOKING_URL}>
              {X_SEND.alt}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
          <p className="mxf-note">One document is enough. Your file is used only to prepare your walkthrough.</p>
        </div>

        <div ref={ref} className="mxf2-card" data-reveal="scale" style={{ '--rv-delay': '160ms' }} aria-hidden="true">
          <div className="mxf2-top">
            <span className="mxf2-ai">
              <Sparkles size={12} />
              Your walkthrough
            </span>
            <small>Prepared by the Star team</small>
          </div>
          <div className={`mxf2-file${step >= 0 ? ' is-on' : ''}`}>
            <span className="mxf2-file-ic">
              <FileText size={18} />
            </span>
            <div>
              <b>your-mill-cert.pdf</b>
              <small>2 pages · received</small>
            </div>
            <span className="mxf2-file-ok">
              <Check size={12} strokeWidth={3} />
            </span>
          </div>
          <div className={`mxf2-block${step >= 1 ? ' is-on' : ''}`}>
            <p className="mxf2-lab">Extracted data</p>
            {FIELDS.map(([k, v], i) => (
              <p key={k} className="mxf2-row" style={{ '--i': i }}>
                <span>{k}</span>
                <b>{v}</b>
              </p>
            ))}
          </div>
          <div className={`mxf2-block${step >= 2 ? ' is-on' : ''}`}>
            <p className="mxf2-lab">Checks against your specs</p>
            <div className="mxf2-checks">
              <span className="is-ok">
                <Check size={12} strokeWidth={3} />
                12 passed
              </span>
              <span className="is-warn">
                <AlertTriangle size={12} strokeWidth={2.6} />1 needs a look
              </span>
            </div>
          </div>
          <div className={`mxf2-act${step >= 3 ? ' is-on' : ''}`}>
            <span>
              <AlertTriangle size={16} />
            </span>
            <div>
              <small>What the agent would do</small>
              <b>Hold for QA, ask the mill for the impact test</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
