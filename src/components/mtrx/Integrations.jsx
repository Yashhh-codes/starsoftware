import { useRef } from 'react';
import { ArrowRight, Check, Clock3, Sparkles } from 'lucide-react';
import { useLoop } from './motion';
import { Eyebrow } from '../landing/LandingParts';
import { INTEGRATIONS } from '../../data/mtrCampaign';
import { X_STORY } from '../../data/mtrX';

const LOGOS = `${import.meta.env.BASE_URL}mtr/logos/`;
// The systems around the record, clockwise from the top.
const SYSTEMS = [
  { name: 'SAP', logo: `${LOGOS}sap.svg` },
  { name: 'NetSuite', logo: `${LOGOS}netsuite.png` },
  { name: 'Dynamics 365', logo: `${LOGOS}dynamics365.svg`, tall: true },
  { name: 'Epicor', c: '#e4002b' },
  { name: 'Infor', logo: `${LOGOS}infor.png` },
  { name: 'Acumatica', c: '#1f6fd1' },
  { name: 'Aptean', c: '#00857c' },
  { name: 'Plex', c: '#6b3fa0' },
];
const RECORD = [
  ['Heat number', '24A8871'],
  ['Grade', 'ASTM A516 Gr. 70'],
  ['Chemistry', 'Within limits'],
  ['Mechanical', 'Within limits'],
  ['Release status', 'Released to inventory'],
];

function Hub() {
  const ref = useRef(null);
  const [tick] = useLoop(ref, { ms: 900, length: SYSTEMS.length, rest: 0 });
  return (
    <div ref={ref} className="mxi-hub" role="img" aria-label={`A validated MTR record flows to ${SYSTEMS.map((s) => s.name).join(', ')} and your custom ERP.`}>
      <span className="mxi-ring mxi-ring--1" aria-hidden="true" />
      <span className="mxi-ring mxi-ring--2" aria-hidden="true" />
      {SYSTEMS.map((s, i) => {
        const a = (i / SYSTEMS.length) * 360 - 90;
        return (
          <div key={s.name} className={`mxi-spoke${tick === i ? ' is-on' : ''}`} style={{ '--a': `${a}deg` }} aria-hidden="true">
            <i className="mxi-beam" />
            <span className="mxi-node">
              {s.logo ? <img src={s.logo} alt="" className={s.tall ? 'is-tall' : ''} loading="lazy" /> : (
                <span className="mxi-wm" style={{ '--c': s.c }}>
                  <i>{s.name[0]}</i>
                  {s.name}
                </span>
              )}
              <em>
                <Check size={10} strokeWidth={3.4} />
              </em>
            </span>
          </div>
        );
      })}
      <div className="mxi-rec" aria-hidden="true">
        <div className="mxi-rec-top">
          <span className="mxi-ai">
            <Sparkles size={12} />
            Star AI
          </span>
          <b>Validated MTR record</b>
        </div>
        {RECORD.map(([k, v], i) => (
          <p key={k} className={i === RECORD.length - 1 ? 'is-rel' : ''}>
            <small>{k}</small>
            <b>{v}</b>
          </p>
        ))}
      </div>
    </div>
  );
}

function Story() {
  const ref = useRef(null);
  const [tick] = useLoop(ref, { ms: 1000, length: 8, rest: 7 });
  const after = tick >= 3;
  return (
    <a ref={ref} className="mxi-story" href={X_STORY.href}>
      <small className="mxi-story-k">{X_STORY.kicker}</small>
      <div className="mxi-times">
        <div className={`mxi-t mxi-t--was${after ? ' is-past' : ''}`}>
          <span>Before</span>
          <b>
            {X_STORY.was}
            <i> {X_STORY.wasUnit}</i>
          </b>
          <span className="mxi-track">
            <u />
          </span>
        </div>
        <div className={`mxi-t mxi-t--now${after ? ' is-on' : ''}`}>
          <span>With Star</span>
          <b>{X_STORY.now}</b>
          <span className="mxi-track">
            <u />
          </span>
        </div>
      </div>
      <p className="mxi-story-sub">
        <Clock3 size={14} aria-hidden="true" />
        {X_STORY.sub}
      </p>
      <span className="mxi-story-cta">
        Read the case study
        <ArrowRight size={16} aria-hidden="true" />
      </span>
    </a>
  );
}

export default function Integrations() {
  return (
    <section className="mx-sec mx-sec--dark mxi" aria-labelledby="mxi-title">
      <div className="mxd-bg" aria-hidden="true" />
      <div className="mt-wrap mxi-inner">
        <div className="mxi-copy">
          <Eyebrow dark>Integrations</Eyebrow>
          <h2 id="mxi-title" className="mx-h2 mx-h2--light" data-reveal>
            Fits into the systems <span>you already use.</span>
          </h2>
          <p className="mx-lead" data-reveal style={{ '--rv-delay': '60ms' }}>
            {INTEGRATIONS.heading[1]}
          </p>
          <ul className="mxi-flows" data-reveal style={{ '--rv-delay': '100ms' }}>
            {['ERP', 'QMS', 'MES', 'Document systems'].map((f) => (
              <li key={f}>{f}</li>
            ))}
            <li className="is-also">and your custom ERP</li>
          </ul>
          <Story />
        </div>
        <div data-reveal="scale" style={{ '--rv-delay': '140ms' }}>
          <Hub />
        </div>
      </div>
    </section>
  );
}
