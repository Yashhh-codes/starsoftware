import { useEffect, useRef, useState } from 'react';
import { Icon } from './icons';
import { useOnScreen, useReducedMotion } from './hooks';

const DOC_LINES = [90, 70, 84, 60, 78, 66];

// The decision played out left to right: the certificate, then each source
// the AI consults, then its checks, then the recommendation. Live, it steps
// slower, shows a status bar and replays after a pause.
function DecisionFlow({ decision, live = false }) {
  const { incoming, sources, checks, rec, agents, refs } = decision;
  const evalAt = 2 + sources.length;
  const doneAt = evalAt + checks.length;
  const ref = useRef(null);
  const reduced = useReducedMotion();
  // Narrow screens stack the flow into a tall column; start it sooner.
  const [threshold] = useState(() => (window.innerWidth < 1100 ? 0.04 : 0.25));
  const onScreen = useOnScreen(ref, { threshold, once: !live });
  const [step, setStep] = useState(reduced ? doneAt : 0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reduced || !onScreen) return undefined;
    const every = live ? 620 : 300;
    setStep(0);
    const timers = Array.from({ length: doneAt }, (_, i) => setTimeout(() => setStep(i + 1), 350 + i * every));
    if (live) timers.push(setTimeout(() => setRun((n) => n + 1), 350 + doneAt * every + 4800));
    return () => timers.forEach(clearTimeout);
  }, [reduced, onScreen, doneAt, live, run]);

  const checking = step >= evalAt && step < doneAt;
  const status = step >= doneAt ? 'Recommendation ready' : checking ? 'Checking…' : step >= 2 ? 'Gathering context…' : 'Reading certificate…';

  return (
    <>
      <div className={`dc${live ? ' is-live' : ''}`} ref={ref}>
        {live && (
          <div className="dc-bar" aria-hidden="true">
            <span className="mh-bot">
              <i />
              Star AI bot
            </span>
            <b>{incoming.title}: QA decision</b>
            <em className={step >= doneAt ? 'is-done' : undefined}>{status}</em>
          </div>
        )}

        <div className={`dc-col dc-mtr${step >= 1 ? ' is-in' : ''}`}>
          <span className="dc-n">1</span>
          <h4>{incoming.title}</h4>
          <p className="dc-q">Supplier certificate</p>
          <div className="dc-doc" aria-hidden="true">
            <b>{incoming.docTitle}</b>
            {DOC_LINES.map((width) => (
              <i key={width} style={{ width: `${width}%` }} />
            ))}
            <span className="dc-pdf">PDF</span>
          </div>
          <p className="dc-a">{incoming.text}</p>
        </div>

        <span className={`dc-arrow${step >= 2 ? ' is-in' : ''}`} aria-hidden="true" />

        <ol className="dc-col dc-sources">
          {sources.map((source, i) => (
            <li key={source.title} className={step >= 2 + i ? 'is-in' : undefined} style={{ '--c': source.c }}>
              <span className="dc-ic">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {source.icon}
                </svg>
              </span>
              <div>
                <h4>
                  <span>{i + 2}.</span> {source.title}
                </h4>
                <p className="dc-q">{source.q}</p>
                <p className="dc-a">{source.a}</p>
              </div>
            </li>
          ))}
        </ol>

        <span className={`dc-arrow${step >= evalAt ? ' is-in' : ''}`} aria-hidden="true" />

        <div className={`dc-col dc-eval${step >= evalAt ? ' is-in' : ''}`}>
          <h4>
            <span className="dc-spark" aria-hidden="true">
              ✦
            </span>
            AI evaluation
          </h4>
          <ul>
            {checks.map((check, i) => (
              <li key={check} className={step >= evalAt + i ? 'is-in' : undefined}>
                <span>
                  <Icon name="check" />
                </span>
                {check}
              </li>
            ))}
          </ul>
          {agents && (
            <div className="dc-agents">
              <p>AI agents involved</p>
              <ul>
                {agents.map((agent) => (
                  <li key={agent}>{agent}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <span className={`dc-arrow${step >= doneAt ? ' is-in' : ''}`} aria-hidden="true" />

        <div className={`dc-col dc-rec${step >= doneAt ? ' is-in' : ''}`}>
          <p className="dc-rec-k">
            <Icon name="alert" />
            AI recommendation
          </p>
          <p className="dc-rec-h">{rec.title}</p>
          {rec.groups.map((group) => (
            <div key={group.heading || 'findings'}>
              {group.heading && <p className="dc-find-h">{group.heading}</p>}
              <ul className="dc-find">
                {group.items.map(([severity, text]) => (
                  <li key={text} className={`is-${severity}`}>
                    <span>
                      <Icon name={severity === 'x' ? 'x' : 'alert'} />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="dc-next-h">Suggested next steps</p>
          <ol className="dc-next">
            {rec.next.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          {rec.impact && (
            <p className="dc-impact">
              <b>
                {'Production impact: '}
                {rec.impact[0]}.
              </b>{' '}
              {rec.impact[1]}
            </p>
          )}
        </div>
      </div>

      {refs && (
        <div className="dc-refs">
          <p>
            <Icon name="book" />
            Guidelines referenced
          </p>
          <ul>
            {refs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default function Decision({ decision, live = false, dark = false }) {
  return (
    <section className={`sec ${dark ? 'sec-dark dc-dark' : 'sec-soft'}`} id="decide">
      <div className="wrap">
        <div className="dc-intro">
          <h2 className="statement">
            {decision.heading[0]} <span>{decision.heading[1]}</span>
          </h2>
          <div className="dc-story">
            {decision.story.map((text, i) => (
              <p key={text}>
                {text}
                {i === decision.story.length - 1 && (
                  <>
                    {' '}
                    <b>{decision.question}</b>
                  </>
                )}
              </p>
            ))}
          </div>
        </div>
        <DecisionFlow decision={decision} live={live} />
      </div>
    </section>
  );
}
