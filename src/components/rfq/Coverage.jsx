import { useEffect, useId, useRef, useState } from 'react';
import Statement from '../mtr-campaign/Statement';
import { Icon } from '../mtr-campaign/icons';
import { useReducedMotion } from '../mtr-campaign/hooks';

const pad = (n) => String(n).padStart(2, '0');

// One group as a card: its items as a numbered grid, and the picked one's
// description in a panel below, stepped with the arrows too. Every
// description sits in the same place, so the panel is as tall as the
// longest and nothing moves as you pick. On a phone the items are one row
// you swipe, which keeps the picked one in view.
function CoverageCard({ group }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const list = useRef(null);
  const reduced = useReducedMotion();
  const total = group.items.length;
  const pick = (i) => setActive((i + total) % total);

  useEffect(() => {
    const row = list.current;
    const item = row?.children[active];
    if (!item || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: item.offsetLeft - (row.clientWidth - item.offsetWidth) / 2, behavior: reduced ? 'auto' : 'smooth' });
  }, [active, reduced]);

  // The pills move with the arrow keys, wrapping at the ends.
  const onKeyDown = (event) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (active + step + total) % total;
    pick(next);
    document.getElementById(`${base}-tab-${next}`)?.focus();
  };

  return (
    <article className={`rq-cov-card is-${group.id}`}>
      <header className="rq-cov-head">
        <span className="rq-cov-ic" aria-hidden="true">
          <Icon name={group.icon} />
        </span>
        <div>
          <h3>{group.title}</h3>
          <p>{group.question}</p>
        </div>
      </header>

      <div className="rq-cov-chips" ref={list} role="tablist" aria-label={group.title} onKeyDown={onKeyDown}>
        {group.items.map(([title], i) => (
          <button
            key={title}
            id={`${base}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${base}-panel`}
            tabIndex={i === active ? 0 : -1}
            className={`rq-cov-chip${i === active ? ' is-on' : ''}`}
            onClick={() => pick(i)}
          >
            <span className="rq-cov-chip-n">{pad(i + 1)}</span>
            <span>{title}</span>
          </button>
        ))}
      </div>

      <div className="rq-cov-panel" id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-tab-${active}`}>
        <div className="rq-cov-panel-top">
          <span className="rq-cov-n">
            {pad(active + 1)} / {pad(total)}
            <small>{group.unit}</small>
          </span>
          <span className="rq-cov-nav">
            <button type="button" aria-label="Previous" onClick={() => pick(active - 1)}>
              <Icon name="left" />
            </button>
            <button type="button" aria-label="Next" onClick={() => pick(active + 1)}>
              <Icon name="right" />
            </button>
          </span>
        </div>
        <div className="rq-cov-bodies">
          {group.items.map(([title, text], i) => (
            <div key={title} className={`rq-cov-body${i === active ? ' is-on' : ''}`} aria-hidden={i !== active}>
              <h4>{title}</h4>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

// What Star automates, by process and by industry: the two cards side by
// side under the heading, the counts beside its introduction.
export default function Coverage({ coverage }) {
  return (
    <section className="sec rq-cov" id="coverage">
      <div className="wrap">
        <div className="rq-cov-intro">
          <Statement text={coverage.title} />
          <div>
            <p className="rq-cov-lede">{coverage.text}</p>
            <p className="rq-cov-stats">
              {coverage.groups.map((group) => (
                <span key={group.id} className={`is-${group.id}`}>
                  <b>{group.items.length}</b> {group.unit}
                </span>
              ))}
            </p>
          </div>
        </div>
        <div className="rq-cov-grid">
          {coverage.groups.map((group) => (
            <CoverageCard key={group.id} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}
