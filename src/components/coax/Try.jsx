import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, FileText, FlaskConical, Play, RotateCcw, Upload, X } from 'lucide-react';
import { useInView, usePrefersReducedMotion } from '../../hooks/useMotion';
import SecHead from '../mtrx/SecHead';
import { C_TRY } from '../../data/coaX';

const STEP_MS = 420;
const ICON = { ok: Check, warn: AlertTriangle, bad: X };

// Pick a sample: its results come off the certificate one by one, each
// against your specification, and the outcome follows.
export default function Try() {
  const [pick, setPick] = useState(null);
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.35, once: true });
  const reduced = usePrefersReducedMotion();
  const sample = pick == null ? null : C_TRY.samples[pick];
  const total = sample ? sample.rows.length : 0;

  // The first sample starts on its own the first time the demo is seen.
  useEffect(() => {
    if (inView && pick == null) {
      const t = window.setTimeout(() => setPick(0), 700);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [inView, pick]);

  useEffect(() => {
    if (!sample) return undefined;
    if (reduced) {
      setN(total);
      return undefined;
    }
    if (n >= total) return undefined;
    const t = window.setTimeout(() => setN((x) => x + 1), STEP_MS);
    return () => window.clearTimeout(t);
  }, [sample, n, total, reduced]);

  const choose = (i) => {
    setPick(i);
    setN(0);
  };
  const done = sample && n >= total;
  let lastGroup = '';

  return (
    <section id="try" className="mx-sec cxt" aria-labelledby="cxt-title">
      <div className="mt-wrap">
        <SecHead id="cxt-title" label="Extraction demo" title={C_TRY.title} accent={C_TRY.titleEnd} lead={C_TRY.note} />

        <div ref={ref} className="cxt-board" data-reveal="scale" style={{ '--rv-delay': '120ms' }}>
          <div className="cxt-side">
            <p className="cxt-lab">Try a sample</p>
            {C_TRY.samples.map((s, i) => (
              <button key={s.file} type="button" className={`cxt-file${pick === i ? ' is-on' : ''}`} onClick={() => choose(i)}>
                <span className="cxt-file-ic" aria-hidden="true">
                  <FileText size={18} />
                </span>
                <span className="cxt-file-t">
                  <b>{s.file}</b>
                  <small>{s.supplier}</small>
                </span>
                <span className="cxt-file-go" aria-hidden="true">
                  {pick === i && done ? <RotateCcw size={14} /> : <Play size={13} />}
                </span>
              </button>
            ))}
            <a className="cxt-up" href="#send">
              <Upload size={18} aria-hidden="true" />
              <b>Upload your COA</b>
              <small>We’ll walk you through what Star finds</small>
            </a>
          </div>

          <div className="cxt-main" aria-live="polite">
            <div className="cxt-head">
              <span className="cxt-flask" aria-hidden="true">
                <FlaskConical size={17} />
              </span>
              <div>
                <b>{sample ? sample.supplier : 'Pick a sample to start'}</b>
                <small>{sample ? sample.sub : 'Certificate of analysis'}</small>
              </div>
              <span className="cxt-count">
                <b>{sample ? Math.min(n, total) : 0}</b> / {total || '—'} fields
              </span>
            </div>
            <div className="cxt-prog" aria-hidden="true">
              <i style={{ width: total ? `${(Math.min(n, total) / total) * 100}%` : 0 }} />
            </div>

            <div className="cxt-table">
              <div className="cxt-row cxt-row--h">
                <span>Test</span>
                <span>Your specification</span>
                <span>Result</span>
                <span />
              </div>
              {(sample ? sample.rows : C_TRY.samples[0].rows).map(([group, test, spec, result, status], i) => {
                const groupHead = group !== lastGroup;
                lastGroup = group;
                const shown = sample && i < n;
                const Icon = ICON[status];
                return (
                  <div key={`${pick}-${test}`} className="cxt-group">
                    {groupHead && <p className="cxt-g">{group}</p>}
                    <div className={`cxt-row${shown ? ` is-on is-${status}` : ''}${sample && i === n ? ' is-now' : ''}`}>
                      <span className="cxt-test">{test}</span>
                      <span className="cxt-spec">{shown ? spec : ''}</span>
                      <span className="cxt-res">{shown ? result : ''}</span>
                      <span className="cxt-st">{shown && <Icon size={12} strokeWidth={3} aria-hidden="true" />}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`cxt-out${done ? ` is-on is-${sample.outcome[0]}` : ''}`}>
              {done ? (
                <>
                  <span className="cxt-out-ic" aria-hidden="true">
                    {sample.outcome[0] === 'ok' ? <Check size={18} strokeWidth={3} /> : <AlertTriangle size={18} />}
                  </span>
                  <div>
                    <small>Recommendation · {sample.product} · {sample.lot}</small>
                    <b>{sample.outcome[1]}</b>
                  </div>
                  <span className="cxt-out-why">{sample.outcome[2]}</span>
                </>
              ) : (
                <span className="cxt-out-wait">{sample ? 'Reading the certificate…' : 'The recommendation appears here'}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
