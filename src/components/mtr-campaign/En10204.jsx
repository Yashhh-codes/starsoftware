import { useRef } from 'react';
import { Icon } from './icons';
import { useStepLoop } from './hooks';

// The four certificate types as a ladder of assurance. The rungs climb in,
// then the PO's 3.2 and the supplier's 3.1 are tagged and the mismatch is
// flagged, and it plays again.
export default function En10204({ en }) {
  const ref = useRef(null);
  const step = useStepLoop(ref, 7, { step: 520, hold: 3400 });
  return (
    <section className="sec en-sec" id="en10204">
      <div className="wrap">
        <div className="en-head">
          <p className="oa-k">
            <i aria-hidden="true" />
            {en.kicker}
          </p>
          <h2 className="en-h">{en.heading}</h2>
          <p className="en-lead">{en.lead}</p>
        </div>

        <div className="en-ladder" ref={ref}>
          {en.types.map(([type, description], i) => (
            <div
              key={type}
              className={`en-rung${step > i ? ' is-in' : ''}${type === '3.2' ? ' is-ordered' : ''}${type === '3.1' ? ' is-supplied' : ''}`}
              style={{ '--i': i }}
            >
              {type === '3.2' && (
                <span className={`en-tag is-po${step > 4 ? ' is-in' : ''}`}>
                  <Icon name="doc" />
                  PO requires
                </span>
              )}
              {type === '3.1' && (
                <span className={`en-tag is-sup${step > 5 ? ' is-in' : ''}`}>
                  <Icon name="upload" />
                  Supplier sent
                </span>
              )}
              <b className="en-t">{type}</b>
              <p className="en-name">{en.names[i]}</p>
              <p className="en-d">{description}</p>
              <span className="en-bar" aria-hidden="true">
                <i style={{ width: `${(i + 1) * 25}%` }} />
              </span>
            </div>
          ))}
          <div className={`en-flag${step > 6 ? ' is-in' : ''}`} role="status">
            <span>
              <Icon name="alert" />
            </span>
            <div>
              <b>Certificate type mismatch</b>
              <small>3.1 supplied where the order needs 3.2. Correct chemistry doesn’t fix the wrong document. Held for QA.</small>
            </div>
          </div>
          <p className="en-axis" aria-hidden="true">
            <span>Less independent assurance</span>
            <span>More independent assurance</span>
          </p>
        </div>

        <div className="en-foot">
          <div>
            <h4>How Star helps</h4>
            <p>{en.how}</p>
          </div>
          <div>
            <h4>Why this matters</h4>
            <p>{en.why}</p>
          </div>
          <div>
            <p className="sd-note">{en.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
