import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowRight, Braces, Check, FileText, ListChecks, Lock, Play, RotateCcw, Upload } from 'lucide-react';
import { useInView, usePrefersReducedMotion } from '../../hooks/useMotion';
import SecHead from '../mtrx/SecHead';
import { C_TRY } from '../../data/coaX';

const OPEN_MS = 650;
const STEP_MS = 230;
const MAX_BYTES = 10 * 1024 * 1024;

const fieldsOf = (sample) => sample.groups.flatMap(([group, fields]) => fields.map((f) => ({ group, f })));
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

// The record the extraction hands on, as JSON, keyed by section and field.
function recordOf(sample) {
  const rec = { supplier: sample.supplier, document: sample.file };
  sample.groups.forEach(([group, fields]) => {
    rec[slug(group)] = Object.fromEntries(fields.map(([label, value, conf]) => [slug(label), { value, confidence: conf / 100 }]));
  });
  return JSON.stringify(rec, null, 2);
}

// A few colours for the JSON view: keys, strings and numbers.
function Json({ text }) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(/("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?)/g)) {
    out.push(text.slice(last, m.index));
    const cls = m[3] ? 'n' : m[2] ? 'k' : 's';
    out.push(
      <span key={m.index} className={`cxe-j-${cls}`}>
        {m[1] || m[3]}
      </span>
    );
    if (m[2]) out.push(m[2]);
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return out;
}

// The sample's page: the supplier's certificate, read top to bottom. The
// row being read is outlined, read rows tint, and the page slides so the
// row being read stays in view.
function Paper({ sample, at, reading }) {
  const box = useRef(null);
  const rows = useRef([]);
  let i = -1;
  useEffect(() => {
    const b = box.current;
    if (!b) return;
    const el = rows.current[at];
    // Read to the end: back to the top of the page.
    if (!el) {
      if (at > 0) b.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const top = el.offsetTop - b.clientHeight * 0.4;
    b.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, [at]);
  return (
    <div className="cxe-paper" aria-hidden="true">
      <div className="cxe-paper-scroll" ref={box}>
      <div className="cxe-paper-in">
        <div className="cxe-paper-head">
          <div>
            <b>{sample.supplier}</b>
            <small>{sample.site}</small>
          </div>
          <span>Certificate of analysis</span>
        </div>
        <p className="cxe-paper-std">{sample.standard}</p>
        {sample.groups.map(([group, fields]) => (
          <div key={group} className="cxe-paper-g">
            <p className="cxe-paper-gh">{group}</p>
            {fields.map(([label, value]) => {
              i += 1;
              const k = i;
              return (
                <p key={label} ref={(el) => (rows.current[k] = el)} className={`${k < at ? 'is-read' : ''}${k === at && reading ? ' is-now' : ''}`}>
                  <span>{label}</span>
                  <b>{value}</b>
                </p>
              );
            })}
          </div>
        ))}
        <p className="cxe-paper-sign">Approved by QA · {sample.lot}</p>
      </div>
      </div>
      {reading && <span className="cxe-scan" />}
    </div>
  );
}

// Try your COA: drop a certificate or run a sample. The sample's page is
// read field by field, each value lands with its confidence, what needs a
// look is flagged, and the recommendation follows. Demo mode: only the
// samples are read; a visitor's own file stays in the browser.
export default function Try() {
  const [pick, setPick] = useState(null);
  const [own, setOwn] = useState(null);
  const [n, setN] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle · open · read · done
  const [view, setView] = useState('fields');
  const [drag, setDrag] = useState(false);
  const ref = useRef(null);
  const list = useRef(null);
  const items = useRef([]);
  const inView = useInView(ref, { threshold: 0.3, once: true });
  const reduced = usePrefersReducedMotion();
  const sample = pick == null ? null : C_TRY.samples[pick];
  const all = sample ? fieldsOf(sample) : [];
  const total = all.length;

  const run = (i) => {
    setOwn(null);
    setPick(i);
    setN(0);
    setPhase(reduced ? 'done' : 'open');
    if (reduced) setN(fieldsOf(C_TRY.samples[i]).length);
  };

  // The first sample runs on its own the first time the demo is seen.
  useEffect(() => {
    if (inView && pick == null && !own) {
      const t = window.setTimeout(() => run(0), 600);
      return () => window.clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    if (phase === 'open') {
      const t = window.setTimeout(() => setPhase('read'), OPEN_MS);
      return () => window.clearTimeout(t);
    }
    if (phase === 'read') {
      if (n >= total) {
        setPhase('done');
        return undefined;
      }
      const t = window.setTimeout(() => setN((x) => x + 1), STEP_MS);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [phase, n, total]);

  // Keep the field being read in view inside the list, without moving the
  // page; once done, back to the top, where the first flags show.
  useEffect(() => {
    const b = list.current;
    if (!b) return;
    if (phase === 'done') {
      b.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = items.current[Math.max(0, n - 1)];
    if (!el || phase !== 'read') return;
    const top = el.offsetTop - b.clientHeight * 0.55;
    b.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, [n, phase]);

  const takeFile = (file) => {
    setDrag(false);
    if (!file) return;
    setOwn({ name: file.name, big: file.size > MAX_BYTES });
    setPick(null);
    setPhase('idle');
    setN(0);
  };

  const flags = all.filter(({ f }) => f[3]);
  const reading = phase === 'read';
  const done = phase === 'done';
  const pct = total ? Math.round((Math.min(n, total) / total) * 100) : 0;
  const status = own
    ? ['Not read in demo mode', 'warn']
    : !sample
      ? ['Waiting for a certificate', '']
      : phase === 'open'
        ? ['Opening the file…', 'run']
        : reading
          ? [`Reading · ${Math.min(n, total)} of ${total}`, 'run']
          : [`Done · ${total} fields read`, 'ok'];
  let k = -1;

  return (
    <section id="try" className="mx-sec cxt" aria-labelledby="cxt-title">
      <div className="mt-wrap">
        <SecHead id="cxt-title" label="Extraction demo" title={C_TRY.title} accent={C_TRY.titleEnd} lead={C_TRY.note} />

        <div ref={ref} className="cxe" data-reveal="scale" style={{ '--rv-delay': '120ms' }}>
          {/* The input: the visitor's file or a sample */}
          <div className="cxe-side">
            <div className="cxe-side-h">
              <span className="cxe-live">
                <i aria-hidden="true" />
                Live demo
              </span>
              <h3>Live COA extraction demo</h3>
              <p>Drop a certificate or run a sample. Star reads every result, scores it, and flags what needs a look.</p>
            </div>

            <label
              className={`cxe-drop${drag ? ' is-drag' : ''}${own ? ' has-file' : ''}`}
              onDragEnter={() => setDrag(true)}
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                takeFile(e.dataTransfer.files[0]);
              }}
            >
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => takeFile(e.target.files[0])} />
              <span className="cxe-stack" aria-hidden="true">
                <i />
                <i />
                <i>
                  <em />
                  <em />
                  <em />
                </i>
                <b>
                  <Upload size={18} strokeWidth={2.4} />
                </b>
              </span>
              <b className="cxe-drop-t">{own ? own.name : 'Drop your COA here'}</b>
              <small>{own ? 'Received · stays in your browser' : 'PDF, JPG or PNG · up to 10 MB'}</small>
              <span className="cxe-btn">{own ? 'Choose another' : 'Choose COA'}</span>
            </label>

            <p className="cxe-or">
              <span>or run a sample</span>
            </p>

            <div className="cxe-samples">
              {C_TRY.samples.map((s, i) => {
                const on = pick === i;
                const state = on ? (done ? 'done' : 'run') : 'idle';
                return (
                  <button key={s.file} type="button" className={`cxe-sample is-${state}${on ? ' is-on' : ''}`} style={{ '--tone': s.tone }} onClick={() => run(i)}>
                    <span className="cxe-thumb" aria-hidden="true">
                      <i />
                      <em />
                      <em />
                      <em />
                      <em />
                    </span>
                    <span className="cxe-sample-t">
                      <b>{s.file}</b>
                      <small>{s.supplier}</small>
                      <em>{s.tag}</em>
                    </span>
                    <span className="cxe-sample-go" style={{ '--p': on ? pct : 0 }} aria-hidden="true">
                      {state === 'done' ? <RotateCcw size={14} strokeWidth={2.4} /> : state === 'run' ? <b>{pct}</b> : <Play size={13} strokeWidth={2.6} />}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="cxe-safe">
              <Lock size={13} aria-hidden="true" />
              Demo mode reads the two samples only. Your own file never leaves your browser.
            </p>
          </div>

          {/* The output: the page as read, and the fields */}
          <div className="cxe-main">
            <div className="cxe-top">
              <p>
                <b>Extracted fields</b>
                <small>{sample ? `${Math.min(n, total)} fields · ${done ? sample.secs : '…'}` : '—'}</small>
              </p>
              <div className="cxe-tabs" role="tablist" aria-label="Show the result as">
                <button type="button" role="tab" aria-selected={view === 'fields'} className={view === 'fields' ? 'is-on' : ''} onClick={() => setView('fields')}>
                  <ListChecks size={14} aria-hidden="true" />
                  Fields
                </button>
                <button type="button" role="tab" aria-selected={view === 'json'} className={view === 'json' ? 'is-on' : ''} onClick={() => setView('json')}>
                  <Braces size={14} aria-hidden="true" />
                  JSON
                </button>
              </div>
            </div>

            <div className={`cxe-file is-${status[1] || 'idle'}`}>
              <span className="cxe-file-ic" aria-hidden="true">
                <FileText size={18} />
              </span>
              <div>
                <b>{own ? own.name : sample ? sample.file : 'No certificate yet'}</b>
                <small>{own ? 'Your file' : sample ? `Sample COA · ${sample.supplier}` : 'Pick a sample or drop a file'}</small>
              </div>
              <em aria-live="polite">
                {status[1] === 'ok' && <Check size={14} strokeWidth={3} aria-hidden="true" />}
                {status[0]}
              </em>
              <i className="cxe-file-bar" style={{ '--p': own ? 0 : pct / 100 }} aria-hidden="true" />
            </div>

            {own ? (
              <div className="cxe-own">
                <span className="cxe-own-ic" aria-hidden="true">
                  <FileText size={22} />
                </span>
                <b>{own.big ? 'That file is over 10 MB.' : 'Demo mode reads the sample certificates only.'}</b>
                <p>
                  {own.big ? 'Send a smaller file, or a single page of it.' : <>We didn’t read <b>{own.name}</b>. Send it to us and we’ll walk you through what Star extracts, checks and flags on your own COAs.</>}
                </p>
                <a className="mt-btn mt-btn--primary" href="#send">
                  <span>Send your COA</span>
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
                <button type="button" className="cxe-own-alt" onClick={() => run(0)}>
                  Or run a sample
                </button>
              </div>
            ) : view === 'json' && sample ? (
              <pre className="cxe-json" aria-label="Extracted record as JSON">
                <Json text={done ? recordOf(sample) : '{ "status": "reading" }'} />
              </pre>
            ) : (
              <div className="cxe-grid">
                {sample ? <Paper sample={sample} at={phase === 'open' ? -1 : n} reading={reading} /> : <div className="cxe-paper cxe-paper--empty" aria-hidden="true" />}
                <div className="cxe-fields" ref={list}>
                  {(sample || C_TRY.samples[0]).groups.map(([group, fields]) => (
                    <div key={group} className="cxe-fg">
                      <p className="cxe-fg-h">{group}</p>
                      {fields.map(([label, value, conf, flag]) => {
                        k += 1;
                        const idx = k;
                        const shown = sample && idx < n;
                        return (
                          <div
                            key={label}
                            ref={(el) => (items.current[idx] = el)}
                            className={`cxe-f${shown ? ' is-on' : ''}${shown && flag ? ` is-${flag[0]}` : ''}${sample && reading && idx === n - 1 ? ' is-new' : ''}`}
                          >
                            <span className="cxe-f-l">
                              {label}
                              {shown && flag && <small>{flag[1]}</small>}
                            </span>
                            <b className="cxe-f-v">{shown ? value : <i aria-hidden="true" />}</b>
                            <em className="cxe-f-c">{shown ? (flag ? (flag[0] === 'bad' ? 'Check' : 'Review') : `${conf}%`) : ''}</em>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={`cxe-out${done && sample ? ` is-on is-${sample.outcome[0]}` : ''}`}>
              {done && sample ? (
                <>
                  <span className="cxe-out-ic" aria-hidden="true">
                    {sample.outcome[0] === 'ok' ? <Check size={18} strokeWidth={3} /> : <AlertTriangle size={18} />}
                  </span>
                  <div>
                    <small>
                      Recommendation · {sample.product} · {sample.lot}
                    </small>
                    <b>{sample.outcome[1]}</b>
                  </div>
                  <p className="cxe-out-why">{sample.outcome[2]}</p>
                  <span className="cxe-out-n">
                    {flags.length ? (
                      <>
                        <AlertTriangle size={12} strokeWidth={2.6} aria-hidden="true" />
                        {flags.length} flagged
                      </>
                    ) : (
                      <>
                        <Check size={12} strokeWidth={3} aria-hidden="true" />
                        Nothing flagged
                      </>
                    )}
                  </span>
                </>
              ) : (
                <span className="cxe-out-wait">{own ? 'Send your COA to see Star’s recommendation on it' : sample ? 'Checking each result against your specification…' : 'The recommendation appears here'}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
