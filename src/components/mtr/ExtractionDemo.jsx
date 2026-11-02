import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUp,
  Braces,
  Check,
  Copy,
  FileImage,
  FileText,
  FlaskConical,
  Gauge,
  ListChecks,
  Lock,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/useMotion';
import { fly } from '../landing/fly';

// The extraction demo after the workflow, as a small app: documents down
// the left (a drop for the visitor's own MTR, and two samples), the page in
// the middle, read by a scan that boxes each value it finds, and the
// fields on the right, each with its confidence, filling as the values fly
// across from the page; or the record as JSON.
//
// Demo mode: only the samples are read, and their values are made up for
// the illustration. A visitor's own file stays in the browser and isn't
// read, which the demo says, pointing them to a proof review instead. To
// read real files, send the file to the extraction API in pickFile and show
// what comes back the way a sample's fields are shown.

const OPEN_MS = 650;
const READ_MS = 1900;
const STRUCT_MS = 600; // scoring and structuring, after the read
const REVIEW_BELOW = 80; // confidence (%) under which a value goes to review
const MAX_BYTES = 10 * 1024 * 1024;
const KINDS = { 'application/pdf': 'pdf', 'image/jpeg': 'image', 'image/png': 'image' };

// Each sample's fields in the order they're shown: the value, the
// confidence, its label on the certificate (short) and its place in the
// JSON record (path).
const SAMPLES = [
  {
    id: 'plate',
    name: 'Plate MTR.pdf',
    kind: 'pdf',
    meta: 'Digital PDF · 1 page',
    size: '248 KB',
    groups: [
      {
        title: 'Certificate',
        fields: [
          { k: 'spec', label: 'Specification', short: 'Specification', value: 'ASTM A572', conf: 99, path: ['specification'] },
          { k: 'grade', label: 'Grade', short: 'Grade', value: '50', conf: 99, path: ['grade'] },
          { k: 'heat', label: 'Heat number', short: 'Heat no.', value: '••••••', conf: 98, path: ['heat_number'] },
          { k: 'product', label: 'Product', short: 'Product', value: 'Plate, 0.75 in', conf: 97, path: ['product'] },
        ],
      },
      {
        title: 'Chemical composition',
        fields: [
          { k: 'C', label: 'Carbon (C)', short: 'C', value: '0.19', unit: '%', conf: 99, path: ['chemistry_pct', 'C'], num: 0.19 },
          { k: 'Mn', label: 'Manganese (Mn)', short: 'Mn', value: '1.12', unit: '%', conf: 99, path: ['chemistry_pct', 'Mn'], num: 1.12 },
          { k: 'P', label: 'Phosphorus (P)', short: 'P', value: '0.012', unit: '%', conf: 98, path: ['chemistry_pct', 'P'], num: 0.012 },
          { k: 'S', label: 'Sulfur (S)', short: 'S', value: '0.008', unit: '%', conf: 98, path: ['chemistry_pct', 'S'], num: 0.008 },
          { k: 'Si', label: 'Silicon (Si)', short: 'Si', value: '0.22', unit: '%', conf: 97, path: ['chemistry_pct', 'Si'], num: 0.22 },
        ],
      },
      {
        title: 'Mechanical properties',
        fields: [
          { k: 'yield', label: 'Yield strength', short: 'Yield (ksi)', value: '58', unit: 'ksi', conf: 98, path: ['mechanical', 'yield_ksi'], num: 58 },
          { k: 'tensile', label: 'Tensile strength', short: 'Tensile (ksi)', value: '74', unit: 'ksi', conf: 98, path: ['mechanical', 'tensile_ksi'], num: 74 },
          { k: 'elong', label: 'Elongation (2 in)', short: 'Elong. (%)', value: '19', unit: '%', conf: 96, path: ['mechanical', 'elongation_2in_pct'], num: 19 },
        ],
      },
    ],
  },
  {
    id: 'scan',
    name: 'Scanned MTR.jpg',
    kind: 'image',
    meta: 'Phone scan · skewed',
    size: '1.9 MB',
    scan: true,
    note: 'smudged on the scan',
    groups: [
      {
        title: 'Certificate',
        fields: [
          { k: 'spec', label: 'Specification', short: 'Specification', value: 'ASTM A500', conf: 96, path: ['specification'] },
          { k: 'grade', label: 'Grade', short: 'Grade', value: 'C', conf: 94, path: ['grade'] },
          { k: 'heat', label: 'Heat number', short: 'Heat no.', value: '••••••', conf: 93, path: ['heat_number'] },
          { k: 'product', label: 'Product', short: 'Product', value: 'Tube, 4 × 4 × 0.25 in', conf: 91, path: ['product'] },
        ],
      },
      {
        title: 'Chemical composition',
        fields: [
          { k: 'C', label: 'Carbon (C)', short: 'C', value: '0.21', unit: '%', conf: 95, path: ['chemistry_pct', 'C'], num: 0.21 },
          { k: 'Mn', label: 'Manganese (Mn)', short: 'Mn', value: '0.84', unit: '%', conf: 94, path: ['chemistry_pct', 'Mn'], num: 0.84 },
          { k: 'P', label: 'Phosphorus (P)', short: 'P', value: '0.011', unit: '%', conf: 92, path: ['chemistry_pct', 'P'], num: 0.011 },
          { k: 'S', label: 'Sulfur (S)', short: 'S', value: '0.006', unit: '%', conf: 91, path: ['chemistry_pct', 'S'], num: 0.006 },
          { k: 'Cu', label: 'Copper (Cu)', short: 'Cu', value: '0.31', unit: '%', conf: 72, path: ['chemistry_pct', 'Cu'], num: 0.31, smudge: true },
        ],
      },
      {
        title: 'Mechanical properties',
        fields: [
          { k: 'yield', label: 'Yield strength', short: 'Yield (ksi)', value: '57', unit: 'ksi', conf: 93, path: ['mechanical', 'yield_ksi'], num: 57 },
          { k: 'tensile', label: 'Tensile strength', short: 'Tensile (ksi)', value: '68', unit: 'ksi', conf: 92, path: ['mechanical', 'tensile_ksi'], num: 68 },
          { k: 'elong', label: 'Elongation (2 in)', short: 'Elong. (%)', value: '27', unit: '%', conf: 88, path: ['mechanical', 'elongation_2in_pct'], num: 27 },
        ],
      },
    ],
  },
];

const fieldsOf = (sample) => sample.groups.flatMap((g) => g.fields);
const toReview = (f) => f.conf < REVIEW_BELOW;

// The record the fields make, as the JSON an ERP or document system would
// take in.
function recordOf(sample) {
  const record = { document: sample.name };
  for (const f of fieldsOf(sample)) {
    let at = record;
    for (const key of f.path.slice(0, -1)) {
      if (!at[key]) at[key] = {};
      at = at[key];
    }
    at[f.path[f.path.length - 1]] = f.num ?? f.value;
  }
  record.for_review = fieldsOf(sample).filter(toReview).map((f) => f.label);
  return JSON.stringify(record, null, 2);
}

// The JSON in colour: keys, strings and numbers.
function highlight(json) {
  const out = [];
  const re = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?)/g;
  let last = 0;
  let m;
  while ((m = re.exec(json))) {
    if (m.index > last) out.push(json.slice(last, m.index));
    if (m[1]) {
      out.push(
        <span key={m.index} className={m[2] ? 'xd-j-key' : 'xd-j-str'}>
          {m[1]}
        </span>,
        m[2] || ''
      );
    } else {
      out.push(
        <span key={m.index} className="xd-j-num">
          {m[3]}
        </span>
      );
    }
    last = re.lastIndex;
  }
  out.push(json.slice(last));
  return out;
}

function sizeOf(bytes) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function kindOf(file) {
  return KINDS[file.type] || (/\.pdf$/i.test(file.name) ? 'pdf' : /\.(jpe?g|png)$/i.test(file.name) ? 'image' : null);
}

const KindIcon = ({ kind, size = 18 }) => (kind === 'image' ? <FileImage size={size} /> : <FileText size={size} />);

const GROUP_ICONS = [FileText, FlaskConical, Gauge];

// What happens to a file, step by step, shown in the documents panel as
// the sample's read.
const PIPELINE = ['Open the file', 'Find each value', 'Score confidence', 'Structure the record'];
const FRESH_MS = 900; // how long a value's tag shows on the page once it's read

// A page in miniature, for the documents list.
function Thumb({ kind, scan }) {
  return (
    <span className={`xd-thumb${scan ? ' xd-thumb--scan' : ''}`} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <span className={`xd-thumb-type xd-thumb-type--${kind}`}>{kind === 'pdf' ? 'PDF' : 'JPG'}</span>
    </span>
  );
}

// A value's confidence, tagged on the page beside it.
const Tag = ({ f }) => (
  <span className={`xd-tag${toReview(f) ? ' xd-tag--review' : ''}`} aria-hidden="true">
    {toReview(f) ? `Review · ${f.conf}%` : `${f.conf}%`}
  </span>
);

// The certificate: the fields where they sit on the page, each boxed (and
// tagged with its confidence) as the scan reads it.
function Paper({ sample, cell, reading, readT, runId, paperRef }) {
  const [cert, chem, mech] = sample.groups;
  return (
    <div key={runId} ref={paperRef} className={`xd-paper${sample.scan ? ' xd-paper--scan' : ''}`}>
      <div className="xd-paper-head">
        <span className="xd-paper-kicker">Material test report</span>
        <span className="xd-paper-from" aria-hidden="true">
          <span className="xd-paper-logo" />
          <span className="xd-paper-lines">
            <span className="xd-line" style={{ width: '62%' }} />
            <span className="xd-line" style={{ width: '40%' }} />
          </span>
        </span>
      </div>
      <dl className="xd-paper-meta">
        {cert.fields.map((f) => (
          <div key={f.k} {...cell(f)}>
            <dt>{f.short}</dt>
            <dd>{f.value}</dd>
            <Tag f={f} />
          </div>
        ))}
      </dl>
      <p className="xd-paper-sec">Chemical composition (%)</p>
      <div className="xd-grid" style={{ '--n': chem.fields.length }}>
        {chem.fields.map((f) => (
          <div key={f.k} {...cell(f)}>
            <span className="xd-th">{f.short}</span>
            <span className="xd-td">{f.value}</span>
            <Tag f={f} />
          </div>
        ))}
      </div>
      <p className="xd-paper-sec">Mechanical properties</p>
      <div className="xd-grid" style={{ '--n': mech.fields.length }}>
        {mech.fields.map((f) => (
          <div key={f.k} {...cell(f)}>
            <span className="xd-th">{f.short}</span>
            <span className="xd-td">{f.value}</span>
            <Tag f={f} />
          </div>
        ))}
      </div>
      <div className="xd-paper-cert" aria-hidden="true">
        <span className="xd-line" />
        <span className="xd-line" style={{ width: '78%' }} />
      </div>
      <div className="xd-paper-foot">
        <span className="xd-line" style={{ width: '34%' }} />
        <span className="xd-stamp">Certified</span>
      </div>
      {reading && (
        <>
          <span className="xd-scanned" style={{ height: `${readT * 100}%` }} aria-hidden="true" />
          <span className="xd-beam" style={{ top: `${readT * 100}%` }} aria-hidden="true" />
        </>
      )}
    </div>
  );
}

export default function ExtractionDemo({ cta }) {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef(null);
  const layerRef = useRef(null);
  const inputRef = useRef(null);
  const viewerRef = useRef(null);
  const paperRef = useRef(null);
  const copiedTimer = useRef(0);
  const flown = useRef(new Set());
  // phase: idle, run (opening then reading a sample), done, own (a
  // visitor's file, not read).
  const [state, setState] = useState({ phase: 'idle', sample: SAMPLES[0], runId: 0, file: null });
  const [elapsed, setElapsed] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('fields');
  const [focus, setFocus] = useState(null);
  const [copied, setCopied] = useState(false);
  // Each sample's outcome once it's been read: 'ok', or how many to review.
  const [history, setHistory] = useState({});
  // How far down the page each field sits (0 to 1), so it's read as the
  // scan passes it.
  const [depth, setDepth] = useState({});
  // The values whose flight has landed: a field shows its value then, or at
  // once where nothing flies (a narrow card, reduced motion).
  const [landed, setLanded] = useState(() => new Set());

  const { phase, sample, runId, file } = state;
  const stateRef = useRef(state);
  stateRef.current = state;

  // The run's clock, frame by frame, until the sample's been read.
  useEffect(() => {
    if (phase !== 'run') return undefined;
    const start = performance.now();
    let frame = 0;
    const tick = () => {
      const t = performance.now() - start;
      if (t >= OPEN_MS + READ_MS + STRUCT_MS) {
        setState((s) => (s.runId === runId ? { ...s, phase: 'done' } : s));
        return;
      }
      setElapsed(t);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, runId]);

  useLayoutEffect(() => {
    const paper = paperRef.current;
    if (!paper) return;
    const next = {};
    for (const el of paper.querySelectorAll('[data-k]')) {
      next[el.dataset.k] = (el.offsetTop + el.offsetHeight / 2) / paper.offsetHeight + (el.offsetLeft / paper.offsetWidth) * 0.12;
    }
    setDepth(next);
  }, [runId, sample]);

  useEffect(() => {
    if (phase !== 'done') return;
    const n = fieldsOf(sample).filter(toReview).length;
    setHistory((h) => ({ ...h, [sample.id]: n || 'ok' }));
  }, [phase, sample]);

  // A dropped image is shown from memory; let it go when it's replaced.
  useEffect(() => () => file?.url && URL.revokeObjectURL(file.url), [file]);
  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  // Where the page sits below the documents (narrow screens), it's brought
  // up to be watched.
  const showViewer = () =>
    requestAnimationFrame(() => {
      const viewer = viewerRef.current;
      if (viewer && viewer.getBoundingClientRect().top > window.innerHeight * 0.55) {
        viewer.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      }
    });

  const runSample = (next) => {
    setError(null);
    setView('fields');
    setFocus(null);
    setElapsed(0);
    flown.current = new Set();
    setLanded(new Set());
    const flying = !reduced && (rootRef.current?.offsetWidth ?? 0) >= 760;
    setState((s) => ({ ...s, phase: reduced ? 'done' : 'run', sample: next, runId: s.runId + 1, flying }));
    showViewer();
  };

  const pickFile = (picked) => {
    if (!picked) return;
    const kind = kindOf(picked);
    if (!kind) {
      setError('Use a PDF, JPG or PNG file.');
      return;
    }
    if (picked.size > MAX_BYTES) {
      setError('That file is over 10 MB.');
      return;
    }
    setError(null);
    setFocus(null);
    setState((s) => ({
      ...s,
      phase: 'own',
      runId: s.runId + 1,
      file: { name: picked.name, size: sizeOf(picked.size), kind, url: kind === 'image' ? URL.createObjectURL(picked) : null },
    }));
    showViewer();
  };

  const opening = phase === 'run' && elapsed < OPEN_MS;
  const structuring = phase === 'run' && elapsed >= OPEN_MS + READ_MS;
  const reading = phase === 'run' && !opening && !structuring;
  const readT = phase === 'done' || structuring ? 1 : reading ? (elapsed - OPEN_MS) / READ_MS : 0;
  // The pipeline step under way: none before a run, all four after.
  const step =
    phase === 'done' ? PIPELINE.length : opening ? 0 : reading ? 1 : structuring ? (elapsed < OPEN_MS + READ_MS + STRUCT_MS / 2 ? 2 : 3) : -1;
  const readAt = (f) => OPEN_MS + (depth[f.k] ?? 1) * READ_MS;
  const isRead = (f) => (phase === 'run' || phase === 'done') && (depth[f.k] ?? 1) <= readT;
  const isFresh = (f) => phase === 'run' && isRead(f) && elapsed - readAt(f) < FRESH_MS;
  const isShown = (f) => isRead(f) && (phase === 'done' || !state.flying || landed.has(f.k));
  const fields = fieldsOf(sample);
  const read = fields.filter(isRead);
  const shown = fields.filter(isShown);
  const review = fields.filter(toReview);
  const reviewShown = shown.filter(toReview).length;
  const avg = shown.length ? Math.round(shown.reduce((n, f) => n + f.conf, 0) / shown.length) : null;
  const done = phase === 'done';
  const own = phase === 'own';
  const idle = phase === 'idle';
  const other = SAMPLES.find((s) => s.id !== sample.id);

  // Each value, as it's read, flies from the page to its field (where the
  // two sit side by side).
  useEffect(() => {
    if (phase !== 'run' || !state.flying) return;
    const root = rootRef.current;
    const paper = paperRef.current;
    if (!root || !paper || !layerRef.current) return;
    for (const f of read) {
      if (flown.current.has(f.k)) continue;
      flown.current.add(f.k);
      const from = paper.querySelector(`[data-k="${f.k}"]`);
      const to = root.querySelector(`[data-row="${f.k}"] .xd-row-value`);
      const land = () => setLanded((l) => new Set(l).add(f.k));
      if (!from || !to) {
        land();
        continue;
      }
      const { done: arrived } = fly(root, layerRef.current, {
        className: `xd-flight${toReview(f) ? ' is-review' : ''}`,
        text: f.unit ? `${f.value} ${f.unit}` : f.value,
        from,
        to,
        duration: 760,
        lift: 36,
      });
      const run = runId;
      arrived.then(() => {
        if (stateRef.current.runId === run) land();
      });
    }
  });

  const hover = (f) =>
    isRead(f)
      ? {
          onMouseEnter: () => setFocus(f.k),
          onMouseLeave: () => setFocus(null),
          onClick: () => setFocus((k) => (k === f.k ? null : f.k)),
        }
      : {};
  const cell = (f) => {
    const on = isRead(f);
    const flag = on && toReview(f);
    return {
      'data-k': f.k,
      className: `xd-cell${on ? ' is-read' : ''}${flag ? ' is-review' : ''}${focus === f.k ? ' is-focus' : ''}${isFresh(f) || flag || focus === f.k ? ' is-tagged' : ''}${f.smudge ? ' is-smudged' : ''}`,
      ...hover(f),
    };
  };

  const json = done ? recordOf(sample) : '';
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // No clipboard (an insecure page, or refused): nothing to do.
    }
  };

  const status = own
    ? { tone: 'own', text: 'Not read · demo mode' }
    : idle
      ? { tone: 'idle', text: 'Waiting' }
      : opening
        ? { tone: 'run', text: `Opening ${Math.round((elapsed / OPEN_MS) * 100)}%` }
        : reading
          ? { tone: 'run', text: `Reading ${read.length}/${fields.length}` }
          : structuring
            ? { tone: 'run', text: 'Structuring' }
            : { tone: review.length ? 'warn' : 'ok', text: review.length ? `${review.length} for review` : 'All fields read' };

  const onDrag = {
    onDragEnter: (e) => {
      if (![...(e.dataTransfer?.types || [])].includes('Files')) return;
      e.preventDefault();
      setDragging(true);
    },
    onDragOver: (e) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    },
    onDragLeave: (e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
    },
    onDrop: (e) => {
      e.preventDefault();
      setDragging(false);
      pickFile(e.dataTransfer?.files?.[0]);
    },
  };

  const docState = (s) => {
    if (!own && sample.id === s.id && phase === 'run') return <span className="xd-spin" aria-label="Reading" />;
    const h = history[s.id];
    if (h === 'ok') return <Check size={14} strokeWidth={2.8} className="xd-doc-ok" aria-label="Read" />;
    if (h) return <span className="xd-doc-flag" aria-label={`${h} for review`}>{h}</span>;
    return <ArrowRight size={14} className="xd-doc-go" aria-hidden="true" />;
  };

  return (
    <div ref={rootRef} className={`xd xd--${phase}${dragging ? ' is-dragging' : ''}`} {...onDrag}>
      <div className="xd-window">
        <span className="xd-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <p className="xd-window-title">MTR extraction</p>
        <span className="xd-illus">Illustrative</span>
        <span className="xd-mode">
          <span className="xd-mode-dot" aria-hidden="true" />
          Demo mode
        </span>
      </div>

      <div className="xd-app">
        {/* Documents: the drop, the visitor's file, the samples. */}
        <aside className="xd-rail" aria-label="Documents">
          <div className="xd-col-head">
            <p className="xd-col-title">Documents</p>
            <span className="xd-count">{SAMPLES.length + (file ? 1 : 0)}</span>
          </div>
          <div className="xd-rail-body">
            <button type="button" className={`xd-upload${error ? ' is-error' : ''}`} onClick={() => inputRef.current?.click()}>
              <span className="xd-upload-ic" aria-hidden="true">
                <ArrowUp size={18} strokeWidth={2.4} />
              </span>
              <span className="xd-upload-text">
                <span className="xd-upload-title">
                  <span className="xd-pointer">Drop your MTR here</span>
                  <span className="xd-touch">Upload your MTR</span>
                </span>
                <span className="xd-upload-hint">
                  <span className="xd-pointer">or </span>
                  <u>choose a file</u> · PDF, JPG, PNG up to 10 MB
                </span>
              </span>
            </button>
            <input
              ref={inputRef}
              className="xd-input"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              tabIndex={-1}
              aria-hidden="true"
              onChange={(e) => {
                pickFile(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
            {error && (
              <p className="xd-upload-error" role="alert">
                <TriangleAlert size={13} aria-hidden="true" />
                {error}
              </p>
            )}

            {file && (
              <div className="xd-docs-group">
                <p className="xd-rail-label">Your file</p>
                <ul className="xd-docs">
                  <li>
                    <button type="button" className={`xd-doc${own ? ' is-on' : ''}`} onClick={() => setState((s) => ({ ...s, phase: 'own' }))}>
                      <Thumb kind={file.kind} />
                      <span className="xd-doc-text">
                        <span className="xd-doc-name">{file.name}</span>
                        <span className="xd-doc-meta">{file.size} · stays on this device</span>
                      </span>
                      <Lock size={13} className="xd-doc-lock" aria-hidden="true" />
                    </button>
                  </li>
                </ul>
              </div>
            )}

            <div className="xd-docs-group">
              <p className="xd-rail-label">Samples</p>
              <ul className="xd-docs">
                {SAMPLES.map((s) => {
                  const on = !own && !idle && sample.id === s.id;
                  return (
                    <li key={s.id}>
                      <button type="button" className={`xd-doc${on ? ' is-on' : ''}`} onClick={() => runSample(s)} aria-pressed={on}>
                        <Thumb kind={s.kind} scan={s.scan} />
                        <span className="xd-doc-text">
                          <span className="xd-doc-name">{s.name}</span>
                          <span className="xd-doc-meta">{s.meta}</span>
                        </span>
                        <span className="xd-doc-state">{docState(s)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="xd-pipe-wrap">
              <p className="xd-rail-label">Pipeline</p>
              <ol className="xd-pipe">
                {PIPELINE.map((label, i) => {
                  const st = i < step ? 'done' : i === step ? 'on' : 'off';
                  const detail =
                    i === 1 && step >= 1
                      ? `${read.length} of ${fields.length} values`
                      : i === 2 && step >= 2
                        ? `Avg. ${avg}% · ${review.length} for review`
                        : i === 3 && step >= 3
                          ? 'Fields and JSON ready'
                          : i === 0 && step >= 0
                            ? sample.size
                            : null;
                  return (
                    <li key={label} className={`xd-pipe-step is-${st}`}>
                      <span className="xd-pipe-dot" aria-hidden="true">
                        {st === 'done' && <Check size={10} strokeWidth={3.4} />}
                      </span>
                      <span className="xd-pipe-text">
                        <span className="xd-pipe-label">{label}</span>
                        {detail && <span className="xd-pipe-detail">{detail}</span>}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
          <p className="xd-privacy">
            <Lock size={12} aria-hidden="true" />
            Nothing leaves your browser in demo mode.
          </p>
        </aside>

        {/* The page being read. */}
        <figure ref={viewerRef} className="xd-viewer" aria-label={own ? 'Your file' : 'The certificate'}>
          <div className="xd-col-head">
            <p className="xd-viewer-title">
              <span className="xd-viewer-ic" aria-hidden="true">
                <KindIcon kind={own ? file.kind : sample.kind} size={14} />
              </span>
              <span className="xd-viewer-name">{own ? file.name : idle ? 'No document open' : sample.name}</span>
            </p>
            <span className={`xd-status xd-status--${status.tone}`} aria-live="polite">
              {status.tone === 'run' && <span className="xd-status-pulse" aria-hidden="true" />}
              {status.tone === 'ok' && <Check size={12} strokeWidth={3} aria-hidden="true" />}
              {status.tone === 'warn' && <TriangleAlert size={12} aria-hidden="true" />}
              {status.tone === 'own' && <Lock size={11} aria-hidden="true" />}
              {status.text}
            </span>
            {phase === 'run' && (
              <span className="xd-open-bar" style={{ '--p': opening ? elapsed / OPEN_MS : 1 }} aria-hidden="true" />
            )}
          </div>
          <div className="xd-canvas">
            {own ? (
              <div className="xd-own-doc">
                {file.url ? (
                  <img src={file.url} alt="" />
                ) : (
                  <span className="xd-own-pdf" aria-hidden="true">
                    <FileText size={34} strokeWidth={1.5} />
                    PDF
                  </span>
                )}
                <span className="xd-own-tag">
                  <Lock size={12} aria-hidden="true" />
                  Kept on this device
                </span>
              </div>
            ) : (
              <Paper sample={sample} cell={cell} reading={reading} readT={readT} runId={runId} paperRef={paperRef} />
            )}
            {idle && (
              <div className="xd-empty">
                <p className="xd-empty-title">Read a certificate</p>
                <p className="xd-empty-text">Pick a sample, or drop an MTR anywhere on this window.</p>
                <button type="button" className="mt-btn mt-btn--primary xd-empty-btn" onClick={() => runSample(SAMPLES[0])}>
                  Read the plate MTR
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </figure>

        {/* What was read. */}
        <section className="xd-insp" aria-label="Extracted fields">
          <div className="xd-col-head">
            <p className="xd-col-title">Extracted fields</p>
            <div className="xd-view" role="group" aria-label="Show the fields as">
              <button type="button" className={view === 'fields' ? 'is-on' : ''} onClick={() => setView('fields')} disabled={!done} aria-pressed={view === 'fields'}>
                <ListChecks size={13} aria-hidden="true" />
                Fields
              </button>
              <button type="button" className={view === 'json' ? 'is-on' : ''} onClick={() => setView('json')} disabled={!done} aria-pressed={view === 'json'}>
                <Braces size={13} aria-hidden="true" />
                JSON
              </button>
            </div>
          </div>

          {/* The fields always hold the panel's height, so the JSON or a
              visitor's file shows in their place without moving the page. */}
          <div className="xd-insp-body">
            <div className={`xd-fields${own || (done && view === 'json') ? ' is-hidden' : ''}`}>
              <div className="xd-kpis">
                <div className="xd-kpi">
                  <span className="xd-kpi-label">Fields read</span>
                  <span className="xd-kpi-value">
                    {shown.length}
                    <small>/{fields.length}</small>
                  </span>
                  <span className="xd-kpi-bar" style={{ '--p': shown.length / fields.length }} aria-hidden="true" />
                </div>
                <div className="xd-kpi">
                  <span className="xd-kpi-label">Avg. confidence</span>
                  <span className="xd-kpi-value">
                    {avg ?? '–'}
                    {avg != null && <small>%</small>}
                  </span>
                </div>
                <div className={`xd-kpi${reviewShown ? ' is-warn' : ''}`}>
                  <span className="xd-kpi-label">For review</span>
                  <span className="xd-kpi-value">{idle ? '–' : reviewShown}</span>
                </div>
              </div>

              {sample.groups.map((g, gi) => {
                const Icon = GROUP_ICONS[gi];
                return (
                  <div key={g.title} className="xd-group">
                    <p className="xd-group-title">
                      <span className="xd-group-ic" aria-hidden="true">
                        <Icon size={13} />
                      </span>
                      {g.title}
                      <span className="xd-group-count">
                        {g.fields.filter(isShown).length}/{g.fields.length}
                      </span>
                    </p>
                    <ul>
                      {g.fields.map((f) => {
                        const on = isShown(f);
                        return (
                          <li key={f.k} data-row={f.k} className={`xd-row${on ? ' is-read' : ''}${focus === f.k ? ' is-focus' : ''}`} {...hover(f)}>
                            <span className="xd-row-label">{f.label}</span>
                            <span className="xd-row-value">
                              {on ? (
                                <>
                                  {f.value}
                                  {f.unit && <small> {f.unit}</small>}
                                </>
                              ) : (
                                <span className="xd-skel" aria-hidden="true" />
                              )}
                            </span>
                            <span className="xd-row-conf">
                              {on &&
                                (toReview(f) ? (
                                  <span className="xd-flag">
                                    <TriangleAlert size={11} aria-hidden="true" />
                                    Review
                                  </span>
                                ) : (
                                  <span className="xd-meter" style={{ '--c': f.conf / 100 }}>
                                    <span className="xd-meter-track" aria-hidden="true">
                                      <span />
                                    </span>
                                    {f.conf}%
                                  </span>
                                ))}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>

            {own && (
              <div className="xd-own">
                <span className="xd-own-ic" aria-hidden="true">
                  <ShieldCheck size={22} />
                </span>
                <p className="xd-own-title">Your file stays on your device</p>
                <p className="xd-own-text">
                  Demo mode reads the sample certificates only, so <b>{file.name}</b> wasn’t read. To see Star read your own MTRs, bring a few to a
                  proof review.
                </p>
                <a className="mt-btn mt-btn--primary xd-btn-sm" href={cta.href}>
                  {cta.label}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
            )}

            {!own && done && view === 'json' && (
              <div className="xd-json-wrap">
                <button type="button" className="xd-copy" onClick={copy}>
                  {copied ? <Check size={13} strokeWidth={2.6} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <pre className="xd-json" tabIndex={0} aria-label="The record as JSON">
                  <code>
                    {json.split('\n').map((line, i) => (
                      <span key={i} className="xd-jl">
                        <span className="xd-jn" aria-hidden="true">
                          {i + 1}
                        </span>
                        {highlight(line)}
                      </span>
                    ))}
                  </code>
                </pre>
              </div>
            )}
          </div>

          <div className="xd-insp-foot">
            <p className="xd-foot-text">
              {done && review.length > 0 && (
                <>
                  <b>{review.map((f) => f.label).join(', ')}</b> goes to review{sample.note ? `, ${sample.note}` : ''}.
                </>
              )}
              {done && !review.length && (
                <>
                  <b>All {fields.length} fields</b> read with high confidence.
                </>
              )}
              {phase === 'run' && 'Each value lands here as it’s found.'}
              {idle && 'Fields fill in as the page is read.'}
              {own && 'Demo mode reads the sample certificates only.'}
            </p>
            {phase !== 'run' && (
              <button type="button" className="xd-next" onClick={() => runSample(done ? other : SAMPLES[0])}>
                {done ? `Try the ${other.id === 'scan' ? 'scanned' : 'plate'} MTR` : 'Run a sample'}
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        </section>
      </div>

      <div ref={layerRef} className="xd-flights" aria-hidden="true" />
      <div className="xd-dropping" aria-hidden="true">
        <span>
          <ArrowUp size={18} strokeWidth={2.4} />
          Drop to add your MTR
        </span>
      </div>
    </div>
  );
}
