import React, { useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeftRight, Check, FileText, ScanText, UserCheck } from 'lucide-react';
import { useInView, usePrefersReducedMotion, useStepper } from '../../hooks/useMotion';

// The system fit diagram (from the copy document's figure): a supplier MTR
// goes through Star Software's workflow and on to the ERP, with SharePoint
// as a document source or destination. On wide screens the connectors are
// drawn between the boxes as measured, and data moves along them; narrow
// screens stack the boxes with simple connectors in CSS.

const WORKFLOW = [
  { label: 'Extract', Icon: ScanText },
  { label: 'Check', Icon: Check },
  { label: 'Review', Icon: UserCheck },
];
const WORKFLOW_MS = [1400, 1400, 1400];

function Mark({ system, className = '' }) {
  return (
    <span className={`sf-mark ${className}`}>
      {system.logo ? (
        <img
          src={system.logo}
          alt={system.name}
          loading="lazy"
          style={system.logoHeight ? { height: system.logoHeight } : undefined}
        />
      ) : (
        <span className="sf-word">{system.name}</span>
      )}
    </span>
  );
}

// A rounded right-angle route: along from the start, down or up the bus at
// x = bus, then along to the end.
function busPath([x1, y1], [x2, y2], bus) {
  if (Math.abs(y2 - y1) < 1) return `M ${x1} ${y1} H ${x2}`;
  const r = Math.min(12, Math.abs(y2 - y1) / 2);
  const dir = y2 > y1 ? 1 : -1;
  return `M ${x1} ${y1} H ${bus - r} Q ${bus} ${y1} ${bus} ${y1 + dir * r} V ${y2 - dir * r} Q ${bus} ${y2} ${bus + r} ${y2} H ${x2}`;
}

export default function SystemFitDiagram({ erps, documentSystem, note }) {
  const wrap = useRef(null);
  const source = useRef(null);
  const star = useRef(null);
  const docSystem = useRef(null);
  const targets = useRef([]);
  const [lines, setLines] = useState(null);
  const reduced = usePrefersReducedMotion();
  const drawn = useInView(wrap, { threshold: 0.2, once: true });
  const live = useInView(wrap, { threshold: 0.1 });
  const [active] = useStepper(WORKFLOW_MS, live && !reduced);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return undefined;
    const measure = () => {
      if (getComputedStyle(el).getPropertyValue('--sf-layout').trim() !== 'wide') {
        setLines(null);
        return;
      }
      const box = el.getBoundingClientRect();
      // On large screens the page is scaled with CSS zoom; the drawing is
      // in the unscaled units the boxes are laid out in.
      const scale = box.width / el.offsetWidth || 1;
      const at = (node, h, v) => {
        const r = node.getBoundingClientRect();
        const x = h === 'l' ? r.left : h === 'r' ? r.right : (r.left + r.right) / 2;
        const y = v === 't' ? r.top : v === 'b' ? r.bottom : (r.top + r.bottom) / 2;
        return [(x - box.left) / scale, (y - box.top) / scale];
      };
      const from = at(star.current, 'r', 'm');
      const ends = targets.current.filter(Boolean).map((node) => at(node, 'l', 'm'));
      const bus = from[0] + (ends[0][0] - from[0]) * 0.42;
      const [sx, sy] = at(source.current, 'r', 'm');
      const [ix, iy] = at(star.current, 'l', 'm');
      setLines({
        width: box.width / scale,
        height: box.height / scale,
        intake: `M ${sx} ${sy} C ${sx + (ix - sx) * 0.5} ${sy}, ${sx + (ix - sx) * 0.5} ${iy}, ${ix} ${iy}`,
        outs: ends.map((end) => busPath(from, end, bus)),
        doc: (() => {
          const [ax, ay] = at(star.current, 'c', 'b');
          const [, by] = at(docSystem.current, 'c', 't');
          return `M ${ax} ${ay} V ${by}`;
        })(),
        dots: [[sx, sy], [ix, iy], from, ...ends],
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    // The layout switch happens with the window; this covers browsers that
    // report the box's resize late.
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [erps.length]);

  const packets = !reduced && lines;

  return (
    <figure ref={wrap} className={`sf${drawn ? ' is-drawn' : ''}`}>
      {lines && (
        <svg className="sf-lines" viewBox={`0 0 ${lines.width} ${lines.height}`} aria-hidden="true">
          <path id="sf-intake" className="sf-line" d={lines.intake} pathLength="1" />
          {lines.outs.map((d, i) => (
            <path key={d} id={`sf-out-${i}`} className="sf-line" d={d} pathLength="1" style={{ '--i': i + 1 }} />
          ))}
          <path id="sf-doc" className="sf-line sf-line--doc" d={lines.doc} pathLength="1" style={{ '--i': 2 }} />
          {lines.dots.map(([x, y]) => (
            <circle key={`${x}-${y}`} className="sf-node" cx={x} cy={y} r="4" />
          ))}
          {packets && (
            <g className="sf-packets">
              <circle r="3.5">
                <animateMotion dur="2.4s" repeatCount="indefinite">
                  <mpath href="#sf-intake" />
                </animateMotion>
              </circle>
              {lines.outs.map((d, i) => (
                <circle key={d} r="3.5">
                  <animateMotion dur="2.8s" begin={`${0.9 + i * 0.35}s`} repeatCount="indefinite">
                    <mpath href={`#sf-out-${i}`} />
                  </animateMotion>
                </circle>
              ))}
              <circle r="3.5" className="sf-packet--doc">
                <animateMotion dur="2.2s" begin="0.4s" repeatCount="indefinite">
                  <mpath href="#sf-doc" />
                </animateMotion>
              </circle>
              <circle r="3.5" className="sf-packet--doc">
                <animateMotion dur="2.2s" begin="1.5s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
                  <mpath href="#sf-doc" />
                </animateMotion>
              </circle>
            </g>
          )}
        </svg>
      )}

      <div className="sf-grid">
        <div ref={source} className="sf-source">
          <span className="sf-source-head">
            <FileText size={16} /> Supplier MTR
          </span>
          <span className="sf-skel" style={{ width: '78%' }} />
          <span className="sf-skel" style={{ width: '56%' }} />
          <span className="sf-skel-table">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} />
            ))}
          </span>
        </div>

        <div className="sf-center">
          <div ref={star} className="sf-star">
            <span className="sf-star-name">Star Software</span>
            <span className="sf-star-sub">MTR workflow</span>
            <span className="sf-steps">
              {WORKFLOW.map(({ label, Icon }, i) => (
                <span key={label} className={`sf-step sf-step--${label.toLowerCase()}${active === i ? ' is-active' : ''}`}>
                  <Icon size={15} />
                  {label}
                </span>
              ))}
            </span>
          </div>
          <div ref={docSystem} className="sf-doc">
            <Mark system={documentSystem} />
            <span className="sf-doc-note">
              <ArrowLeftRight size={13} /> Document source or destination
            </span>
          </div>
        </div>

        <ul className="sf-targets">
          {erps.map((system, i) => (
            <li
              key={system.name}
              ref={(node) => {
                targets.current[i] = node;
              }}
              className={`sf-target${system.featured ? ' is-featured' : ''}`}
              style={{ '--i': i }}
            >
              <Mark system={system} />
            </li>
          ))}
        </ul>
      </div>

      <figcaption className="sf-note">{note}</figcaption>
    </figure>
  );
}
