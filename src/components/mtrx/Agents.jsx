import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, FileText, Globe, Mail, ScanLine, Search } from 'lucide-react';
import { useInView, usePrefersReducedMotion } from '../../hooks/useMotion';
import { AGENTS } from '../../data/mtrCampaign';
import SecHead from './SecHead';

const ADVANCE_MS = 7000;

// 1 · Management: MTRs arrive from three channels and are filed by heat.
function Manage() {
  const files = [
    ['24A8871', 'PO 44-1180', 'A516 Gr. 70'],
    ['24B1032', 'PO 44-1162', 'A36 plate'],
    ['23C7740', 'PO 43-0981', '304L sheet'],
    ['25D0415', 'PO 45-0217', 'A572 Gr. 50'],
  ];
  return (
    <div className="mxa-v mxa-manage">
      <div className="mxa-sources">
        {[
          [Mail, 'Email'],
          [Globe, 'Supplier portal'],
          [ScanLine, 'Scanner'],
        ].map(([Icon, label], i) => (
          <span key={label} style={{ '--i': i }}>
            <Icon size={15} />
            {label}
            <i className="mxa-fly" />
          </span>
        ))}
      </div>
      <div className="mxa-cab">
        <div className="mxa-search">
          <Search size={14} />
          <span className="mxa-typed">grade: A516 Gr. 70</span>
        </div>
        <ul>
          {files.map(([heat, po, grade], i) => (
            <li key={heat} style={{ '--i': i }} className={i === 0 ? 'is-hit' : ''}>
              <FileText size={15} />
              <b>Heat {heat}</b>
              <span>{po}</span>
              <span>{grade}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// 2 · Extraction: the hard ones, a skewed scan with a handwritten note.
function Extract() {
  return (
    <div className="mxa-v mxa-extract">
      <div className="mxa-scan">
        <div className="mxa-scan-paper">
          <b>MILL CERT · 7731</b>
          {['Heat no.  77Q120', 'Grade  X65 PSL2', 'Yield  68.2 ksi', 'Tensile  80.9 ksi', 'CVN  52 J @ −20 °C'].map((r) => (
            <span key={r}>{r}</span>
          ))}
          <em>re-tested, OK — J.R.</em>
        </div>
        <i className="mxa-lens" />
      </div>
      <div className="mxa-out">
        <span className="mxa-out-tag">Exceptions only</span>
        {[
          ['Heat no.', '77Q120'],
          ['Grade', 'X65 PSL2'],
          ['Yield', '68.2 ksi'],
          ['Tensile', '80.9 ksi'],
          ['Handwritten', 're-tested, OK'],
        ].map(([k, v], i) => (
          <p key={k} style={{ '--i': i }}>
            <small>{k}</small>
            <b>{v}</b>
            <Check size={12} strokeWidth={3} />
          </p>
        ))}
      </div>
    </div>
  );
}

// 3 · Compliance: values against the standard's limits, exception explained.
function Comply() {
  const rows = [
    ['C', 0.21, 0.27, 'max 0.27', true],
    ['Mn', 1.05, 1.2, '0.85–1.20', true],
    ['Yield', 47.5, 60, 'min 38 ksi', true],
    ['CVN −46 °C', 0, 1, 'required by PO', false],
  ];
  return (
    <div className="mxa-v mxa-comply">
      <div className="mxa-std">
        <span>ASTM A516 Gr. 70</span>
        <span>+ PO 44-1180</span>
      </div>
      <ul>
        {rows.map(([k, v, max, lim, ok], i) => (
          <li key={k} className={ok ? '' : 'is-bad'} style={{ '--i': i, '--w': ok ? v / max : 1 }}>
            <small>{k}</small>
            <span className="mxa-meter">
              <i />
            </span>
            <em>{ok ? lim : 'Not reported'}</em>
          </li>
        ))}
      </ul>
      <div className="mxa-why">
        <AlertTriangle size={15} />
        <p>
          <b>Exception explained:</b> the PO asks for a Charpy impact test at −46 °C. The certificate doesn’t report one.
        </p>
      </div>
    </div>
  );
}

// 4 · Integration: the validated record travels to the systems.
function Integrate() {
  return (
    <div className="mxa-v mxa-int">
      <div className="mxa-rec">
        <small>Validated MTR</small>
        <b>Heat 24A8871</b>
        <span>A516 Gr. 70 · PO 44-1180</span>
        <span>Receipt RC-55102</span>
      </div>
      <div className="mxa-pipes">
        {['QMS', 'ERP', 'DMS'].map((s, i) => (
          <div key={s} className="mxa-pipe" style={{ '--i': i }}>
            <i />
            <span>
              <b>{s}</b>
              <Check size={12} strokeWidth={3} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5 · Supplier analysis: each mill's record over time.
function Analyze() {
  const mills = [
    ['Northfield', 2, 'NCRs · impact tests'],
    ['Ridgeline', 0, ''],
    ['Lakeshore', 1, ''],
    ['Bayport', 0, ''],
    ['Granite Mill', 4, 'Missing tests'],
  ];
  return (
    <div className="mxa-v mxa-ana">
      <div className="mxa-chart">
        {mills.map(([name, n, note], i) => (
          <div key={name} className={`mxa-bar${n >= 2 ? ' is-hot' : ''}`} style={{ '--h': 0.12 + n / 4.5, '--i': i }}>
            <span className="mxa-bar-v">{n}</span>
            <i />
            <small>{name}</small>
            {note && <em>{note}</em>}
          </div>
        ))}
      </div>
      <p className="mxa-ana-cap">Deviations and NCRs per mill · last 6 months</p>
    </div>
  );
}

const VISUALS = [Manage, Extract, Comply, Integrate, Analyze];

export default function Agents() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.3 });
  const reduced = usePrefersReducedMotion();
  const running = inView && !paused && !reduced;

  useEffect(() => {
    if (!running) return undefined;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % AGENTS.items.length), ADVANCE_MS);
    return () => window.clearTimeout(t);
  }, [running, active]);

  const agent = AGENTS.items[active];
  const Visual = VISUALS[active];

  return (
    <section className="mx-sec mx-sec--soft mxa" aria-labelledby="mxa-title">
      <div className="mt-wrap">
        <SecHead id="mxa-title" label="Pre-built agents" title="Agents you can" accent="put to work today." lead={AGENTS.heading[1]} />

        <div ref={ref} className="mxa-board" data-reveal="scale" style={{ '--rv-delay': '100ms' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="mxa-tabs" role="tablist" aria-label="Pre-built agents">
            {AGENTS.items.map((a, i) => (
              <button key={a.title} type="button" role="tab" aria-selected={i === active} className={i === active ? 'is-on' : ''} style={{ '--c': a.c }} onClick={() => setActive(i)}>
                <span className="mxa-tab-ic" aria-hidden="true">
                  <svg viewBox="0 0 24 24">{a.icon}</svg>
                </span>
                <span className="mxa-tab-t">
                  <b>{a.title}</b>
                  {a.tag && <small>{a.tag}</small>}
                </span>
                <span className="mxa-tab-n">{String(i + 1).padStart(2, '0')}</span>
                <i className="mxa-prog" aria-hidden="true">
                  <u key={`${active}-${running}`} className={i === active && running ? 'is-run' : ''} style={{ animationDuration: `${ADVANCE_MS}ms` }} />
                </i>
              </button>
            ))}
          </div>

          <div className="mxa-stage" role="tabpanel" aria-label={agent.title} style={{ '--c': agent.c }}>
            <div className="mxa-stage-top" key={`t${active}`}>
              <span className="mxa-tab-ic" aria-hidden="true">
                <svg viewBox="0 0 24 24">{agent.icon}</svg>
              </span>
              <div>
                <b>{agent.title}</b>
                <p>{agent.text}</p>
              </div>
            </div>
            <div className="mxa-canvas" key={`v${active}`}>
              <Visual />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
