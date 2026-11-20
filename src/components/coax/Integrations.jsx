import { useRef } from 'react';
import { Database, FileText } from 'lucide-react';
import { useLoop } from '../mtrx/motion';
import SecHead from '../mtrx/SecHead';
import { C_INTEG } from '../../data/coaX';

const S = C_INTEG.stages;
const LENGTH = S.length + 4;

// A certificate's data moves through the six stages, then lands in the
// systems of record, which light up in turn.
export default function Integrations() {
  const ref = useRef(null);
  const [tick] = useLoop(ref, { ms: 900, length: LENGTH, rest: LENGTH - 1, threshold: 0.35 });
  const at = Math.min(tick, S.length - 1);
  const landed = tick >= S.length;

  return (
    <section id="integrations" className="mx-sec mx-sec--soft cxi" aria-labelledby="cxi-title">
      <div className="mt-wrap">
        <SecHead id="cxi-title" label="Integrations" title={C_INTEG.title} accent={C_INTEG.titleEnd} lead={C_INTEG.lead} />

        <div ref={ref} className={`cxi-board${landed ? ' is-landed' : ''}`} data-reveal="scale" style={{ '--rv-delay': '120ms' }}>
          <ol className="cxi-pipe" style={{ '--p': at }}>
            {S.map(([name, text], i) => (
              <li key={name} className={`${i < at || landed ? 'is-done' : ''}${i === at && !landed ? ' is-now' : ''}`}>
                <span className="cxi-chev">
                  <small>{String(i + 1).padStart(2, '0')}</small>
                  <b>{name}</b>
                </span>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <div className="cxi-packet" style={{ '--p': at }} aria-hidden="true">
            <FileText size={13} />
            COA data
          </div>

          <div className="cxi-land">
            <div className="cxi-land-h">
              <span aria-hidden="true">
                <Database size={16} />
              </span>
              <b>Systems of record</b>
              <ul>
                {C_INTEG.kinds.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </div>
            <ul className="cxi-sys">
              {C_INTEG.systems.map((s, i) => (
                <li key={s.name} style={{ '--d': `${i * 0.12}s` }}>
                  <img src={s.logo} alt={s.name} loading="lazy" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
