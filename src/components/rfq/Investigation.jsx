import { useRef } from 'react';
import Statement from '../mtr-campaign/Statement';
import { Icon } from '../mtr-campaign/icons';
import { useReplay } from './useReplay';

// One RFQ package investigated live: the inputs, the intake agent, the
// four agents, then the risks found and the cost, price and quote models.
// It replays while on screen.
export default function Investigation({ investigation }) {
  const ref = useRef(null);
  const step = useReplay(ref, 6, 620, true);
  const { inputs, intake, agents, risks, model } = investigation;
  const status = step >= 6 ? 'Conditional quote ready' : step >= 4 ? 'Checking risks…' : step >= 3 ? 'Agents investigating…' : 'Reading the package…';

  return (
    <section className="sec sec-dark dc-dark" id="investigation">
      <div className="wrap">
        <Statement text={investigation.heading} />
        <div className="iv is-live" ref={ref}>
          <div className="dc-bar" aria-hidden="true">
            <span className="mh-bot">
              <i />
              Star AI agents
            </span>
            <b>RFQ-2291 · Northline Fabrication</b>
            <em className={step >= 6 ? 'is-done' : undefined}>{status}</em>
          </div>

          <div className={`iv-inputs${step >= 1 ? ' is-in' : ''}`}>
            {inputs.map(([count, name, format, icon, color]) => (
              <div key={name} className="iv-in" style={{ '--c': color }}>
                <span className="iv-ic">
                  <Icon name={icon} />
                </span>
                <div>
                  <b>{count}</b> {name}
                  {format && <small>{format}</small>}
                </div>
              </div>
            ))}
          </div>

          <span className={`iv-down${step >= 2 ? ' is-in' : ''}`} aria-hidden="true" />
          <div className={`iv-intake${step >= 2 ? ' is-in' : ''}`}>
            <span className="iv-spark" aria-hidden="true">
              ✦
            </span>
            <b>{intake[0]}</b>
            <span>{intake[1]}</span>
            <small>{intake[2]}</small>
          </div>

          <span className={`iv-down${step >= 3 ? ' is-in' : ''}`} aria-hidden="true" />
          <div className="iv-agents">
            {agents.map(([name, findings, icon, color], i) => (
              <div key={name} className={`iv-agent${step >= 3 ? ' is-in' : ''}`} style={{ '--c': color, transitionDelay: `${i * 0.12}s` }}>
                <p>
                  <span className="iv-ic">
                    <Icon name={icon} />
                  </span>
                  {name}
                </p>
                <ul>
                  {findings.map((finding) => (
                    <li key={finding}>{finding}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <span className={`iv-down${step >= 4 ? ' is-in' : ''}`} aria-hidden="true" />
          <div className="iv-bottom">
            <div className={`iv-risk${step >= 4 ? ' is-in' : ''}`}>
              <p className="iv-risk-h">
                <Icon name="alert" />
                {'Quote risk agent '}
                <span>
                  {risks.length}
                  {' issues found that require attention'}
                </span>
              </p>
              <div className="iv-risks">
                {risks.map(([title, detail, route, severity]) => (
                  <div key={title} className={`iv-r is-${severity}`}>
                    <b>{title}</b>
                    <small>{detail}</small>
                    <em>
                      {'→ '}
                      {route}
                    </em>
                  </div>
                ))}
              </div>
            </div>
            <ol className="iv-model">
              {model.map(([title, detail], i) => (
                <li key={title} className={`${step >= 5 + (i === 2 ? 1 : 0) ? 'is-in' : ''}${i === 2 ? ' is-ready' : ''}`}>
                  <b>{title}</b>
                  <small>{detail}</small>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
