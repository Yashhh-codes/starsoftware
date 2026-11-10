import { useEffect, useRef, useState } from 'react';
import { Icon } from '../mtr-campaign/icons';
import { useOnScreen, useReducedMotion } from '../mtr-campaign/hooks';
import { DEMO_PATH } from '../../data/demo';

const TICK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

// The strip under the buttons: RFQ to quote, one step lit at a time, the
// done ones behind it, then round again.
function FlowStrip({ flow }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const onScreen = useOnScreen(ref, { threshold: 0.4 });
  const [step, setStep] = useState(reduced ? flow.length - 1 : 0);

  useEffect(() => {
    if (reduced || !onScreen) return undefined;
    const timer = setTimeout(() => setStep((n) => (n + 1) % (flow.length + 2)), step >= flow.length - 1 ? 1600 : 700);
    return () => clearTimeout(timer);
  }, [step, reduced, onScreen, flow.length]);

  return (
    <ol className="rq-flow" aria-label="RFQ to quote steps" ref={ref}>
      {flow.map((label, i) => (
        <li key={label} className={i <= step ? (i === step ? 'is-on' : 'is-done') : undefined}>
          {label}
        </li>
      ))}
    </ol>
  );
}

// An RFQ arrives at 9:02, the bots read, build and price it, and the quote
// goes out first, the clock running to 9:44; then what that means.
function QuoteWin({ win }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const onScreen = useOnScreen(ref, { threshold: 0.35 });
  const [step, setStep] = useState(reduced ? 9 : 0);
  const [minute, setMinute] = useState(reduced ? 44 : 2);

  useEffect(() => {
    if (reduced || !onScreen) return undefined;
    setStep(0);
    setMinute(2);
    const timers = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => setTimeout(() => setStep(n), 300 + n * 420));
    const start = performance.now() + 1500;
    let frame = 0;
    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / 1600));
      setMinute(Math.round(2 + 42 * t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(frame);
    };
  }, [reduced, onScreen]);

  const sent = step >= 5;
  return (
    <div className={`rfw${sent ? ' sent' : ''}`} ref={ref}>
      <p className="rfw-kicker">
        {'RFQ-to-quote automation '}
        <span>·</span>
        {' Star AI bots'}
      </p>
      <h4 className="rfw-h">
        {'Never lose a job '}
        <span>to a faster quote again.</span>
      </h4>
      <p className="rfw-sub">While others are still re-keying drawings, your quote is priced and sent.</p>
      <div className="rfw-flow">
        <div className={`rfw-card${step >= 1 ? ' in' : ''}`}>
          <div className="rfw-top">
            <span className="rfw-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 5h18v14H3z M3.5 5.5l8.5 6.5 8.5-6.5" />
              </svg>
            </span>
            <div>
              <b>RFQ received</b>
              <small>Drawings + datasheet</small>
            </div>
          </div>
          <div className="rfw-foot">
            <span className="rfw-time">9:02 AM</span>
            <em>Received</em>
          </div>
        </div>
        <span className={`rfw-arrow${step >= 2 ? ' in' : ''}`} aria-hidden="true" />
        <div className={`rfw-bot${step >= 2 ? ' in' : ''}`}>
          <p>
            Star AI bots
            <i aria-hidden="true" />
          </p>
          <ul>
            {win.bots.map((item, i) => (
              <li key={item} className={step >= 2 + i ? 'on' : undefined}>
                <span>{TICK}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <span className={`rfw-arrow${sent ? ' in' : ''}`} aria-hidden="true" />
        <div className={`rfw-card rfw-done${sent ? ' in' : ''}`}>
          <div className="rfw-top">
            <span className="rfw-ico rfw-ok">{TICK}</span>
            <div>
              <b>Quote sent</b>
              <small>$179,150 · 42 parts</small>
            </div>
          </div>
          <div className="rfw-foot">
            <span className="rfw-time rfw-time-on">
              9:{String(minute).padStart(2, '0')}
              {' AM'}
            </span>
            <em className="rfw-first">First in</em>
          </div>
        </div>
      </div>
      <div className={`rfw-sum${step >= 6 ? ' in' : ''}`}>
        <div className="rfw-ttq">
          <small>Time to quote</small>
          <p>
            <s>3 days</s>
            <span aria-hidden="true">→</span>
            <b>42 min</b>
          </p>
        </div>
        <ul className="rfw-wins">
          {win.wins.map((item, i) => (
            <li key={item} className={step >= 7 + i ? 'on' : undefined}>
              <span>{TICK}</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="rfw-team">
          Same team.
          <b>More wins.</b>
        </p>
      </div>
    </div>
  );
}

export default function RfqHero({ hero, win }) {
  return (
    <section className="mh rq-hero">
      <div className="wrap mh-grid">
        <div className="mh-copy">
          <p className="oa-k">
            <i aria-hidden="true" />
            {hero.kicker}
          </p>
          <h1 className="mh-h">
            {hero.title[0]} <em>{hero.title[1]}</em>
          </h1>
          <p className="mh-p">{hero.text}</p>
          <div className="mh-cta">
            <a className="btn btn-primary btn-lg" href={DEMO_PATH}>
              Book a demo
              <Icon name="arr" />
            </a>
            <a className="btn btn-outline btn-lg" href="#investigation">
              See how it works
            </a>
          </div>
          <FlowStrip flow={hero.flow} />
        </div>
        <div className="rq-hero-art">
          <QuoteWin win={win} />
        </div>
      </div>
    </section>
  );
}
