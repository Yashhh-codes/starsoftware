import { useRef } from 'react';
import Statement from './Statement';
import { Icon } from './icons';
import { useOnScreen } from './hooks';

// Each part plays its entrance once, when it comes on screen; side by side,
// the second card waits for the first (MtrCampaign.css, the steps' motion).
function useEntrance() {
  const ref = useRef(null);
  const on = useOnScreen(ref, { threshold: 0.25, once: true });
  return [ref, on ? ' is-on' : ''];
}

// A step: its bar draws across, then each item lands and its check ticks.
function StepCard({ step, index }) {
  const [ref, on] = useEntrance();
  return (
    <article ref={ref} className={`mc-step${on}`} style={{ '--c': step.c, '--n': index }}>
      <p className="mc-step-k">{step.label}</p>
      <h3>{step.title}</h3>
      <ul className="mc-step-list">
        {step.items.map(([title, text], i) => (
          <li key={title} style={{ '--i': i }}>
            <span className="mc-step-mark">
              <Icon name="check" />
            </span>
            <div>
              <b>{title}</b>
              <p>{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

// The arrow from one step to the next, with a dot running between them.
function StepLink() {
  const [ref, on] = useEntrance();
  return (
    <span ref={ref} className={`mc-steps-link${on}`} aria-hidden="true">
      <span className="mc-vs-arrow">
        <Icon name="right" />
      </span>
    </span>
  );
}

function Focus({ focus }) {
  const [ref, on] = useEntrance();
  return (
    <p ref={ref} className={`mc-focus${on}`}>
      <i aria-hidden="true" />
      <span>
        <b>{focus[0]}</b>
        {focus[1]}
      </span>
    </p>
  );
}

// The two steps, understanding the certificate then acting on it, each a
// card in its own colour, and the line on what Star is focused on.
export default function Steps({ steps }) {
  const [first, second] = steps.steps;
  return (
    <section className="sec mc-steps" id="how-it-works">
      <div className="wrap">
        <Statement text={steps.heading} />
        <div className="mc-steps-grid">
          <StepCard step={first} index={0} />
          <StepLink />
          <StepCard step={second} index={1} />
        </div>
        <Focus focus={steps.focus} />
      </div>
    </section>
  );
}
