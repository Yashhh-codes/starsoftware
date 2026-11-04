import Statement from './Statement';
import { Icon } from './icons';

// The two steps, understanding the certificate then acting on it, each a
// card in its own colour, and the line on what Star is focused on.
export default function Steps({ steps }) {
  const [first, second] = steps.steps;
  const card = (step) => (
    <article className="mc-step" style={{ '--c': step.c }}>
      <p className="mc-step-k">{step.label}</p>
      <h3>{step.title}</h3>
      <ul className="mc-step-list">
        {step.items.map(([title, text]) => (
          <li key={title}>
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
  return (
    <section className="sec mc-steps" id="how-it-works">
      <div className="wrap">
        <Statement text={steps.heading} />
        <div className="mc-steps-grid">
          {card(first)}
          <span className="mc-vs-arrow" aria-hidden="true">
            <Icon name="right" />
          </span>
          {card(second)}
        </div>
        <p className="mc-focus">
          <i aria-hidden="true" />
          <span>
            <b>{steps.focus[0]}</b>
            {steps.focus[1]}
          </span>
        </p>
      </div>
    </section>
  );
}
