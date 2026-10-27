import React, { useEffect, useRef, useState } from 'react';
import { FileText, Flag, Lock, LockOpen, Scale, Search, Split } from 'lucide-react';
import { useInView, usePrefersReducedMotion } from '../../hooks/useMotion';
import { pad2 } from '../landing/LandingParts';

// The problem section's path from a received supplier COA to a lot release
// decision: the COA and the release at its ends, and the four things your
// team still has to do along it, alternating above and below the line. Once on screen the line draws
// from the COA, each step lights as it is reached, and the release at the
// end turns from on hold to ready for a decision. Reduced motion shows it
// finished.

const ICONS = [Search, Scale, Flag, Split];
// From the COA to the first step, between steps, and on to the release.
const FIRST_MS = 450;
const STEP_MS = 620;

export default function ReleasePath({ steps }) {
  const ref = useRef(null);
  const seen = useInView(ref, { threshold: 0.4, once: true });
  const reduced = usePrefersReducedMotion();
  const [reached, setReached] = useState(0);
  // The steps, then the release.
  const stops = steps.length + 1;

  useEffect(() => {
    if (!seen) return undefined;
    if (reduced) {
      setReached(stops);
      return undefined;
    }
    if (reached >= stops) return undefined;
    const t = setTimeout(() => setReached((n) => n + 1), reached === 0 ? FIRST_MS : STEP_MS);
    return () => clearTimeout(t);
  }, [seen, reached, stops, reduced]);

  const released = reached >= stops;

  return (
    <div ref={ref} className={`rp${released ? ' is-done' : ''}`} style={{ '--k': reached }}>
      <span className="rp-line" aria-hidden="true">
        <span className="rp-line-fill" />
      </span>

      <div className="rp-end rp-end--start" aria-hidden="true">
        <span className="rp-dot is-on" />
        <span className="rp-end-card">
          <span className="rp-end-ic">
            <FileText size={16} />
          </span>
          <span>
            <b>Supplier COA</b>
            <span className="rp-end-status rp-end-status--ok">Data received</span>
          </span>
        </span>
      </div>

      <ol className="rp-steps">
        {steps.map((step, i) => {
          const Icon = ICONS[i];
          return (
            <li
              key={step.title}
              className={`rp-step rp-step--${i % 2 ? 'low' : 'high'}${i < reached ? ' is-on' : ''}`}
              data-reveal
              style={{ '--rv-delay': `${i * 90}ms` }}
            >
              <span className="rp-dot" aria-hidden="true" />
              <div className="rp-card">
                <span className="rp-meta">
                  <span className="rp-icon" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <span className="rp-n">{pad2(i + 1)}</span>
                </span>
                <h3 className="mt-h3">{step.title}</h3>
                <p className="mt-text">{step.text}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="rp-end rp-end--release" aria-hidden="true">
        <span className={`rp-dot${released ? ' is-on' : ''}`} />
        <span className="rp-end-card">
          <span className="rp-end-ic">{released ? <LockOpen size={16} /> : <Lock size={16} />}</span>
          <span>
            <b>Lot release</b>
            <span className="rp-end-status">{released ? 'Decision ready' : 'On hold'}</span>
          </span>
        </span>
      </div>
    </div>
  );
}
