import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Building2, Car, Check, Factory, Fuel, Plane, Warehouse } from 'lucide-react';
import { useInView, usePrefersReducedMotion } from '../../hooks/useMotion';
import { X_INDUSTRIES } from '../../data/mtrX';
import SecHead from './SecHead';

const ICONS = { steel: Warehouse, mfg: Factory, auto: Car, aero: Plane, oil: Fuel, build: Building2 };
const ADVANCE_MS = 5500;

export default function Industries() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.3 });
  const reduced = usePrefersReducedMotion();
  const running = inView && !paused && !reduced;

  useEffect(() => {
    if (!running) return undefined;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % X_INDUSTRIES.items.length), ADVANCE_MS);
    return () => window.clearTimeout(t);
  }, [running, active]);

  const it = X_INDUSTRIES.items[active];
  const Icon = ICONS[it.key];

  return (
    <section className="mx-sec mx-sec--soft mxn" aria-labelledby="mxn-title">
      <div className="mt-wrap">
        <SecHead
          id="mxn-title"
          label="Industries"
          title="One engine for every"
          accent="industry that buys metal."
          lead="Quality workflows for steel and metals, manufacturing, automotive, aerospace, oil and gas and construction."
        />

        <div ref={ref} className="mxn-board" data-reveal="scale" style={{ '--rv-delay': '100ms' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="mxn-rail" role="tablist" aria-label="Industries">
            {X_INDUSTRIES.items.map((x, i) => {
              const I = ICONS[x.key];
              return (
                <button key={x.key} type="button" role="tab" aria-selected={i === active} className={i === active ? 'is-on' : ''} onClick={() => setActive(i)}>
                  <span className="mxn-ic" aria-hidden="true">
                    <I size={18} />
                  </span>
                  {x.name}
                  <i className="mxa-prog" aria-hidden="true">
                    <u key={`${active}-${running}`} className={i === active && running ? 'is-run' : ''} style={{ animationDuration: `${ADVANCE_MS}ms` }} />
                  </i>
                </button>
              );
            })}
          </div>

          <div className="mxn-panel" role="tabpanel" key={it.key}>
            <div className="mxn-copy">
              <p className="mxn-k">{it.name}</p>
              <h3>{it.title}</h3>
              <p className="mxn-text">{it.text}</p>
              <ul className="mxn-gains">
                {it.gains.map((g, i) => (
                  <li key={g} style={{ '--i': i }}>
                    <Check size={13} strokeWidth={3} aria-hidden="true" />
                    {g}
                  </li>
                ))}
              </ul>
              {it.href && (
                <a className="mxn-link" href={it.href}>
                  Explore {it.name.toLowerCase()}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              )}
            </div>
            <div className="mxn-visual" aria-hidden="true">
              <span className="mxn-orbit">
                <i />
                <i />
                <i />
              </span>
              <span className="mxn-disc">
                <Icon size={30} strokeWidth={1.6} />
              </span>
              <div className="mxn-stack">
                <span className="mxn-sheet mxn-sheet--3">
                  <b>Receiving record</b>
                  <i />
                  <i />
                </span>
                <span className="mxn-sheet mxn-sheet--2">
                  <b>Purchase order</b>
                  <i />
                  <i />
                </span>
                <div className="mxn-doc">
                  <div className="mxn-doc-top">
                    <b>{it.doc[0]}</b>
                    <small>{it.doc[2]}</small>
                  </div>
                  {[
                    ['Grade', it.doc[1]],
                    ['Chemistry', 'Within limits'],
                    ['Mechanical', 'Within limits'],
                    ['Traceability', 'Linked to receipt'],
                  ].map(([k, v]) => (
                    <p key={k}>
                      <span>{k}</span>
                      <b>{v}</b>
                      <Check size={11} strokeWidth={3.2} />
                    </p>
                  ))}
                  <i className="mxn-beam" />
                  <span className="mxn-doc-ok">
                    <Check size={13} strokeWidth={3} />
                    Verified by Star
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
