import { useRef, useState } from 'react';
import { Icon } from './icons';

// A numbered pin on the certificate zone a standard checks.
function Pin({ standard, index, active, onSelect }) {
  if (!standard) return null;
  return (
    <button
      type="button"
      className={`sm-pin${active ? ' is-active' : ''}`}
      style={{ '--d': `${index * 0.12}s` }}
      onClick={() => onSelect(index)}
      aria-pressed={active}
      aria-label={`${standard.code}: ${standard.title}`}
    >
      <span>{index + 1}</span>
      {standard.code}
    </button>
  );
}

// The sample certificate, each zone carrying the pin of the standard that
// checks it.
function Certificate({ cert, standards, active, onSelect }) {
  const indexOf = (zone) => standards.findIndex((standard) => standard.pin === zone);
  const zone = (name, content, extra = '') => {
    const index = indexOf(name);
    return (
      <div key={name} className={`sm-z${extra}${index >= 0 ? ' is-pinned' : ''}${index === active ? ' is-active' : ''}`}>
        {content}
        <Pin standard={standards[index]} index={index} active={index === active} onSelect={onSelect} />
      </div>
    );
  };
  return (
    <div className="sm-cert">
      <div className="sm-cert-top">
        <div>
          <b>Northfield Steel Mill</b>
          <small>Plate mill · Unit 2</small>
        </div>
        <span className="sm-type">
          Inspection certificate
          <br />
          <em>EN 10204 · 3.1</em>
        </span>
      </div>
      {cert.fields.map(([name, label, value]) =>
        zone(
          name,
          <>
            <span>{label}</span>
            <b>{value}</b>
          </>
        )
      )}
      {zone(
        'chem',
        <>
          <span>Chemical composition (%)</span>
          <div className="sm-grid">
            {cert.chemistry.map(([element, value]) => (
              <div key={element}>
                <small>{element}</small>
                <b>{value}</b>
              </div>
            ))}
          </div>
        </>,
        ' is-table'
      )}
      {zone(
        'mech',
        <>
          <span>Mechanical properties</span>
          <div className="sm-grid is-3">
            {cert.mechanical.map(([property, value]) => (
              <div key={property}>
                <small>{property}</small>
                <b>{value}</b>
              </div>
            ))}
          </div>
        </>,
        ' is-table'
      )}
      {zone(
        'supp',
        <>
          <span>Supplementary requirements</span>
          <b>
            {'Charpy at −46 °C: '}
            <s>not reported</s>
            {' · Heat treatment: '}
            <s>not stated</s>
          </b>
        </>
      )}
      <div className="sm-sign" aria-hidden="true">
        <svg viewBox="0 0 120 30">
          <path d="M4 22c10-14 18-16 20-6s8 10 14-4 12-8 14 2 10 10 18-2 14-6 20 4 12 6 26-2" />
        </svg>
        <small>Certified by the mill’s authorized QA representative</small>
      </div>
    </div>
  );
}

// What the picked standard addresses, how Star helps and why it matters.
// Keyed by the standard so it plays its entrance again on each pick.
function StandardDetail({ standard }) {
  return (
    <article key={standard.code + standard.title} className="sm-detail">
      <span className="sd-code">{standard.code}</span>
      <h4>{standard.title}</h4>
      {standard.sub && <p className="sd-sub">{standard.sub}</p>}
      <dl>
        <div>
          <dt>What the standard addresses</dt>
          <dd>{standard.what}</dd>
        </div>
        <div className="is-star">
          <dt>
            <span className="mh-bot">
              <i />
              Star
            </span>
            How Star helps
          </dt>
          <dd>{standard.how}</dd>
        </div>
        <div>
          <dt>Why it matters</dt>
          <dd>{standard.why}</dd>
        </div>
      </dl>
      {standard.note && <p className="sd-note">{standard.note}</p>}
    </article>
  );
}

const ARROW_STEP = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };

export default function Standards({ sectors, segments, cert }) {
  const [sectorIndex, setSectorIndex] = useState(0);
  const [standardIndex, setStandardIndex] = useState(0);
  const tabsRef = useRef(null);
  const segment = segments[sectors[sectorIndex].segment];

  const pickSector = (index) => {
    setSectorIndex(index);
    setStandardIndex(sectors[index].focus || 0);
  };
  // The sector tabs move with the arrow keys, wrapping at the ends.
  const onTabKeyDown = (event, index) => {
    const step = ARROW_STEP[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (index + step + sectors.length) % sectors.length;
    pickSector(next);
    tabsRef.current.children[next].focus();
  };

  return (
    <section className="sec sec-soft sm-sec" id="standards">
      <div className="wrap">
        <h2 className="statement">
          {'The standards your customers actually care about. '}
          <span>Pick your business, then tap a pin to see what each standard checks on the certificate.</span>
        </h2>
        <div className="sm">
          <div className="sm-sectors" role="tablist" aria-label="Sector" aria-orientation="vertical" ref={tabsRef}>
            {sectors.map((sector, i) => (
              <button
                key={sector.sector}
                type="button"
                role="tab"
                aria-selected={i === sectorIndex}
                tabIndex={i === sectorIndex ? 0 : -1}
                onClick={() => pickSector(i)}
                onKeyDown={(event) => onTabKeyDown(event, i)}
              >
                <b>{sector.sector}</b>
                <span className="sm-stds">
                  {sector.standards.split(', ').map((code) => (
                    <em key={code}>{code}</em>
                  ))}
                </span>
                <small>
                  <Icon name="check" />
                  {sector.helps}
                </small>
              </button>
            ))}
          </div>
          {/* Keyed by sector so the stage plays its entrance again. */}
          <div key={sectorIndex} className="sm-stage">
            <div className="sm-head">
              <p className="sd-seg">{segment.name}</p>
              <h3>{segment.headline}</h3>
              <p>{segment.lead}</p>
            </div>
            <div className="sm-body">
              <Certificate cert={cert} standards={segment.standards} active={standardIndex} onSelect={setStandardIndex} />
              <StandardDetail standard={segment.standards[standardIndex]} />
            </div>
            <div className="sd-cta">
              <p>{segment.cta}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
