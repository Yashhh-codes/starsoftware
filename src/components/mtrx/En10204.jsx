import { useRef } from 'react';
import { FileText, ShieldAlert, Sparkles, TriangleAlert } from 'lucide-react';
import SecHead from './SecHead';
import { useLoop } from './motion';
import { EN10204 } from '../../data/mtrCampaign';

// 0: the four types stand; 1: the supplier's certificate lands on 3.1;
// 2: the order's requirement rises over 3.2; 3: Star compares the two;
// 4: the mismatch is called and the material held; then it rests.
const SENT = 1;
const REQ = 2;
const CMP = 3;
const HELD = 4;
const LENGTH = 11;
// Who signs each type, as the stamp at the foot of its step.
const SIGNED = ['Manufacturer', 'Manufacturer', 'Mill QA representative', 'Independent inspector'];

export default function En10204() {
  const ref = useRef(null);
  const [tick] = useLoop(ref, { ms: 1100, length: LENGTH, rest: LENGTH - 1, threshold: 0.35 });

  return (
    <section className="mx-sec mxe" aria-labelledby="mxe-title">
      <div className="mt-wrap">
        <SecHead id="mxe-title" label={EN10204.kicker} title="Is it the certificate" accent="your customer ordered?" lead={EN10204.lead} />

        <div ref={ref} className={`mxe-board${tick >= HELD ? ' is-held' : ''}`} data-reveal="scale" style={{ '--rv-delay': '120ms' }}>
          <div className="mxe-stairs" role="list" aria-label="EN 10204 inspection document types, from least to most independent assurance">
            {EN10204.types.map(([type, text], i) => {
              const sent = type === '3.1';
              const req = type === '3.2';
              return (
                <div key={type} role="listitem" className={`mxe-step mxe-step--${i}${sent && tick >= SENT ? ' is-sent' : ''}${req && tick >= REQ ? ' is-req' : ''}${(sent || req) && tick === CMP ? ' is-cmp' : ''}`} style={{ '--i': i }}>
                  <div className="mxe-marker" aria-hidden="true">
                    {sent && (
                      <span className={`mxe-doc${tick >= SENT ? ' is-on' : ''}`}>
                        <FileText size={14} />
                        Supplier sent
                      </span>
                    )}
                    {req && (
                      <span className={`mxe-flag${tick >= REQ ? ' is-on' : ''}`}>
                        <ShieldAlert size={14} />
                        PO requires
                      </span>
                    )}
                  </div>
                  <div className="mxe-block">
                    <b>{type}</b>
                    <strong>{EN10204.names[i]}</strong>
                    <p>{text}</p>
                    <span className="mxe-stamp" aria-hidden="true">
                      <i />
                      {SIGNED[i]}
                    </span>
                  </div>
                </div>
              );
            })}
            <div className={`mxe-ne${tick >= CMP ? ' is-on' : ''}${tick >= HELD ? ' is-bad' : ''}`} aria-hidden="true">
              <b>≠</b>
              <small>{tick >= HELD ? 'Mismatch' : 'Comparing'}</small>
            </div>
          </div>

          <div className="mxe-axis" aria-hidden="true">
            <span>Less independent assurance</span>
            <i />
            <span>More independent assurance</span>
          </div>

          <div className={`mxe-alert${tick >= HELD ? ' is-on' : ''}`} role="status">
            <span className="mxe-alert-ic" aria-hidden="true">
              <TriangleAlert size={18} />
            </span>
            <div>
              <b>Certificate type mismatch</b>
              <p>3.1 supplied where the order needs 3.2. Correct chemistry doesn’t fix the wrong document.</p>
            </div>
            <span className="mxe-alert-pill">Held for QA</span>
          </div>
        </div>

        <div className="mxe-notes">
          <div className="mxe-note mxe-note--star" data-reveal>
            <span aria-hidden="true">
              <Sparkles size={16} />
            </span>
            <div>
              <small>How Star helps</small>
              <p>{EN10204.how}</p>
            </div>
          </div>
          <div className="mxe-note" data-reveal style={{ '--rv-delay': '80ms' }}>
            <span aria-hidden="true">
              <ShieldAlert size={16} />
            </span>
            <div>
              <small>Why this matters</small>
              <p>{EN10204.why}</p>
            </div>
          </div>
        </div>
        <p className="mxe-src">
          {EN10204.note} <span>Source: NEN EN 10204 standard.</span>
        </p>
      </div>
    </section>
  );
}
