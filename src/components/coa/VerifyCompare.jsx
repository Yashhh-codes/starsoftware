import React, { useRef } from 'react';
import { Plus, ScanText, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useInView, usePrefersReducedMotion } from '../../hooks/useMotion';
import { SPEC } from './sample';

// "Extraction vs verification": the copy's comparison table, under one
// value from the hero's certificate read and then checked. Once on screen
// the extraction column comes in, then verification adds to it row by row.

export default function VerifyCompare({ columns, rows }) {
  const ref = useRef(null);
  const seen = useInView(ref, { threshold: 0.35, once: true });
  const reduced = usePrefersReducedMotion();
  return (
    <div ref={ref} className={`vx${seen || reduced ? ' is-on' : ''}`}>
      <div className="vx-example" aria-hidden="true">
        <span className="vx-ex vx-ex--read">
          <small>Read</small>
          <span>
            Water (KF) <b>0.62 %</b>
          </span>
        </span>
        <span className="vx-ex-plus">
          <Plus size={14} strokeWidth={2.5} />
        </span>
        <span className="vx-ex vx-ex--check">
          <small>Verified · {SPEC}</small>
          <span>
            <b>0.62 %</b> vs ≤ 0.50 %
            <em>
              <TriangleAlert size={12} /> Needs attention
            </em>
          </span>
        </span>
      </div>

      <table className="vx-table">
        <thead>
          <tr>
            <th scope="col">
              <span className="vx-th">
                <ScanText size={16} aria-hidden="true" />
                {columns[0]}
              </span>
            </th>
            <th scope="col">
              <span className="vx-th">
                <ShieldCheck size={16} aria-hidden="true" />
                {columns[1]}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([established, added], i) => (
            <tr key={established} style={{ '--i': i }}>
              <td>{established}</td>
              <td>
                <span className="vx-plus" aria-hidden="true">
                  <Plus size={12} strokeWidth={3} />
                </span>
                {added}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
