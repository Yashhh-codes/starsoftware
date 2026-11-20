import { useEffect, useRef, useState } from 'react';
import { BookOpen, Check, Lightbulb, Sparkles, TriangleAlert } from 'lucide-react';
import { useInView, usePrefersReducedMotion } from '../../hooks/useMotion';
import { CERT, SECTORS, SEGMENTS } from '../../data/mtrCampaign';
import SecHead from './SecHead';

const ADVANCE_MS = 6500;

// What Star finds on the sample certificate for the zone a standard is about.
const FOUND = {
  spec: [['ok', 'ASTM A516/A516M named'], ['ok', 'ASTM A6/A6M general requirements']],
  grade: [['ok', 'Grade A516 Gr. 70 matches the PO'], ['ok', 'Stencil NSM 24A8871 on the plate']],
  product: [['ok', 'Plate 1.25 × 96 × 240 in'], ['ok', 'Size matches the order']],
  heat: [['ok', 'Heat 24A8871 on the certificate'], ['ok', 'Linked to PO 44-1180 · Lot 3']],
  chem: [['ok', 'C 0.21 ≤ 0.27'], ['ok', 'Mn 1.05 within 0.85–1.20'], ['ok', 'P 0.010 ≤ 0.025']],
  mech: [['ok', 'Yield 47.5 ≥ 38 ksi'], ['ok', 'Tensile 79.0 within 70–90'], ['ok', 'Elongation 24% ≥ 17%']],
  supp: [['bad', 'Charpy at −46 °C not reported'], ['ok', 'Other supplementary items present']],
};
const VIEWS = [
  ['how', 'How Star helps', Sparkles],
  ['what', 'What it covers', BookOpen],
  ['why', 'Why it matters', Lightbulb],
];

// The open standard: what Star found on the certificate, then the detail
// one view at a time.
function Detail({ std }) {
  const [view, setView] = useState('how');
  const V = VIEWS.find((v) => v[0] === view);
  const Icon = V[2];
  return (
    <div className="mxs-detail">
      <div className="mxs-dh">
        <b>{std.code}</b>
        <small>{std.title}</small>
      </div>
      <ul className="mxs-found" aria-label="What Star found on the certificate">
        {FOUND[std.pin].map(([t, text], i) => (
          <li key={text} className={`is-${t}`} style={{ '--i': i }}>
            {t === 'ok' ? <Check size={12} strokeWidth={3.2} aria-hidden="true" /> : <TriangleAlert size={12} strokeWidth={2.6} aria-hidden="true" />}
            {text}
          </li>
        ))}
      </ul>
      <div className="mxs-views" role="tablist" aria-label={`About ${std.code}`}>
        {VIEWS.map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={view === k} className={view === k ? 'is-on' : ''} onClick={() => setView(k)}>
            {label}
          </button>
        ))}
      </div>
      <div className={`mxs-view mxs-view--${view}`} role="tabpanel" key={view}>
        <span className="mxs-d-ic" aria-hidden="true">
          <Icon size={15} />
        </span>
        <p>{std[view]}</p>
      </div>
      {std.note && <p className="mxs-note">{std.note}</p>}
    </div>
  );
}

// The certificate the standards pin to: each zone lights when the open
// standard is about it.
function Certificate({ pin, flash }) {
  const zone = (key) => `mxs-z${pin === key ? ' is-on' : ''}`;
  return (
    <div className="mxs-cert" aria-hidden="true">
      <div className="mxs-cert-top">
        <span className="mxs-cert-mark">N</span>
        <div>
          <b>Northfield Steel Mill</b>
          <small>Plate mill · Unit 2</small>
        </div>
        <span className="mxs-cert-type">
          Inspection certificate
          <em>EN 10204 · 3.1</em>
        </span>
      </div>
      {CERT.fields.map(([key, label, value]) => (
        <div key={key} className={zone(key)}>
          <small>{label}</small>
          <b>{value}</b>
          <span className="mxs-ok">
            <Check size={11} strokeWidth={3.2} />
            Checked
          </span>
        </div>
      ))}
      <div className={zone('chem')}>
        <small>Chemical composition (%)</small>
        <div className="mxs-chem">
          {CERT.chemistry.map(([el, v]) => (
            <span key={el}>
              <i>{el}</i>
              {v}
            </span>
          ))}
        </div>
        <span className="mxs-ok">
          <Check size={11} strokeWidth={3.2} />
          Checked
        </span>
      </div>
      <div className={zone('mech')}>
        <small>Mechanical properties</small>
        <div className="mxs-chem mxs-chem--mech">
          {CERT.mechanical.map(([el, v]) => (
            <span key={el}>
              <i>{el}</i>
              {v}
            </span>
          ))}
        </div>
        <span className="mxs-ok">
          <Check size={11} strokeWidth={3.2} />
          Checked
        </span>
      </div>
      <div className={`${zone('supp')} mxs-z--flag`}>
        <small>Supplementary requirements</small>
        <b>Charpy at −46 °C: not reported</b>
        <span className="mxs-flag">
          <TriangleAlert size={11} strokeWidth={2.6} />
          Flagged
        </span>
      </div>
      <i className={`mxs-scan${flash ? ' is-on' : ''}`} key={flash} />
    </div>
  );
}

export default function Standards() {
  const [sector, setSector] = useState(0);
  const segIndex = SECTORS[sector].segment;
  const seg = SEGMENTS[segIndex];
  const [open, setOpen] = useState(SECTORS[0].focus || 0);
  const [paused, setPaused] = useState(false);
  const boardRef = useRef(null);
  const inView = useInView(boardRef, { threshold: 0.3 });
  const reduced = usePrefersReducedMotion();
  const running = inView && !paused && !reduced;

  useEffect(() => {
    if (!running) return undefined;
    const t = window.setTimeout(() => setOpen((o) => (o + 1) % seg.standards.length), ADVANCE_MS);
    return () => window.clearTimeout(t);
  }, [running, open, seg]);

  const pick = (i) => {
    setSector(i);
    setOpen(SECTORS[i].focus || 0);
  };
  const std = seg.standards[open];

  return (
    <section className="mx-sec mx-sec--soft mxs" aria-labelledby="mxs-title">
      <div className="mt-wrap">
        <SecHead
          id="mxs-title"
          label="Standards by business"
          title="The standards your customers"
          accent="actually care about."
          lead="Pick your business to see which standards apply, what each one covers and how Star checks the MTR against it."
        />

        <div className="mxs-tabs" role="tablist" aria-label="Your business" data-reveal style={{ '--rv-delay': '80ms' }}>
          {SECTORS.map((s, i) => (
            <button key={s.sector} type="button" role="tab" aria-selected={sector === i} className={sector === i ? 'is-on' : ''} onClick={() => pick(i)}>
              {s.sector}
              <small>{s.standards.split(',').length} standards</small>
            </button>
          ))}
        </div>

        <div
          ref={boardRef}
          className="mxs-board"
          data-reveal="scale"
          style={{ '--rv-delay': '120ms' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="mxs-left" key={segIndex}>
            <p className="mxs-seg">{seg.name}</p>
            <h3 className="mxs-headline">{seg.headline}</h3>
            <p className="mxs-lead">{seg.lead}</p>

            <ol className="mxs-list">
              {seg.standards.map((s, i) => (
                <li key={s.code} className={i === open ? 'is-open' : ''}>
                  <button type="button" aria-expanded={i === open} onClick={() => setOpen(i)}>
                    <span className="mxs-code">{s.code}</span>
                    <span className="mxs-title">{s.title}</span>
                    <i className="mxs-bar" aria-hidden="true">
                      <u key={`${segIndex}-${open}`} className={i === open && running ? 'is-run' : ''} style={{ animationDuration: `${ADVANCE_MS}ms` }} />
                    </i>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="mxs-right">
            <Certificate pin={std.pin} flash={`${segIndex}-${open}`} />
            <Detail std={std} key={`${segIndex}-${open}`} />
          </div>
        </div>
        <p className="mxs-cta" data-reveal>
          {seg.cta}
        </p>
      </div>
    </section>
  );
}
