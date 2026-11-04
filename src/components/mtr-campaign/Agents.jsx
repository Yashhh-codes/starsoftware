import { useRef } from 'react';
import Statement from './Statement';
import { useOnScreen } from './hooks';

// The agents as a staggered relay along one track: each card spans two
// columns and alternates high and low, and a pulse runs the track while
// the row is on screen.
export default function Agents({ agents }) {
  const ref = useRef(null);
  const onScreen = useOnScreen(ref, { threshold: 0.3 });
  const count = agents.items.length;
  return (
    <section className="sec al-sec" id="agents">
      <div className="wrap">
        <Statement text={agents.heading} />
        <div
          className={`al${onScreen ? ' is-on' : ''}`}
          ref={ref}
          style={{ '--n': count, '--cols': count + 1, '--dur': `${count * 1.4}s` }}
        >
          <div className="al-track" aria-hidden="true">
            <i />
          </div>
          {agents.items.map((agent, i) => (
            <article
              key={agent.title}
              className={`al-card${i % 2 ? ' is-low' : ''}`}
              style={{ '--c': agent.c, '--i': i, gridColumn: `${i + 1} / span 2` }}
            >
              <span className="al-node" aria-hidden="true">
                {i + 1}
              </span>
              <div className="al-top">
                <span className="ma-ic">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {agent.icon}
                  </svg>
                </span>
                {agent.tag && <span className="ma-tag">{agent.tag}</span>}
              </div>
              <h3>{agent.title}</h3>
              <p>{agent.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
