import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Statement from '../mtr-campaign/Statement';
import { Icon } from '../mtr-campaign/icons';
import { useReducedMotion } from '../mtr-campaign/hooks';

const pad = (n) => String(n).padStart(2, '0');

// The same content as Coverage, a third way: tabs for the two groups, then
// the group's items as a row of slim cards you swipe or step through with
// the arrows. Every description is on show, nothing to open; a thin line
// under the row shows how far along you are.
export default function CoverageCards({ coverage }) {
  const base = useId();
  const row = useRef(null);
  const reduced = useReducedMotion();
  const [groupId, setGroupId] = useState(coverage.groups[0].id);
  const [view, setView] = useState({ start: true, end: false, size: 1, at: 0 });
  const group = coverage.groups.find((g) => g.id === groupId);

  // Where the row is scrolled to: the line's length and place, and whether
  // either arrow has anywhere to go.
  const measure = useCallback(() => {
    const el = row.current;
    if (!el) return;
    const room = el.scrollWidth - el.clientWidth;
    setView({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft >= room - 2,
      size: el.clientWidth / el.scrollWidth,
      at: room > 0 ? el.scrollLeft / room : 0,
    });
  }, []);

  useEffect(() => {
    row.current?.scrollTo({ left: 0 });
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [groupId, measure]);

  // An arrow moves by as many whole cards as fit.
  const step = (dir) => {
    const el = row.current;
    const card = el?.firstElementChild;
    if (!card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const width = card.offsetWidth + gap;
    const count = Math.max(1, Math.floor((el.clientWidth + gap) / width));
    el.scrollBy({ left: dir * count * width, behavior: reduced ? 'auto' : 'smooth' });
  };

  const onTabsKey = (event) => {
    const move = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!move) return;
    event.preventDefault();
    const at = coverage.groups.findIndex((g) => g.id === groupId);
    const next = coverage.groups[(at + move + coverage.groups.length) % coverage.groups.length];
    setGroupId(next.id);
    document.getElementById(`${base}-tab-${next.id}`)?.focus();
  };

  return (
    <section className="sec rq-cc" id="coverage-cards">
      <div className="wrap">
        <div className="rq-cc-head">
          <Statement text={coverage.title} />
          <p>{coverage.text}</p>
        </div>

        <div className="rq-cc-bar">
          <div className="rq-cc-tabs" role="tablist" aria-label="Browse by" onKeyDown={onTabsKey}>
            {coverage.groups.map((g) => (
              <button
                key={g.id}
                id={`${base}-tab-${g.id}`}
                type="button"
                role="tab"
                aria-selected={g.id === groupId}
                aria-controls={`${base}-row`}
                tabIndex={g.id === groupId ? 0 : -1}
                className={`is-${g.id}${g.id === groupId ? ' is-on' : ''}`}
                onClick={() => setGroupId(g.id)}
              >
                {g.title.split(' / ')[0]}
                <span>{g.items.length}</span>
              </button>
            ))}
          </div>
          <div className="rq-cc-arrows">
            <button type="button" aria-label="Scroll back" onClick={() => step(-1)} disabled={view.start}>
              <Icon name="left" />
            </button>
            <button type="button" aria-label="Scroll on" onClick={() => step(1)} disabled={view.end}>
              <Icon name="right" />
            </button>
          </div>
        </div>
        <p className="rq-cc-question" key={`q-${groupId}`}>
          {group.question}
        </p>

        <ul
          className={`rq-cc-row is-${groupId}${view.end ? ' is-end' : ''}`}
          id={`${base}-row`}
          ref={row}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${groupId}`}
          tabIndex={0}
          onScroll={measure}
          key={groupId}
        >
          {group.items.map(([title, text], i) => (
            <li key={title} className="rq-cc-card" style={{ '--i': i }}>
              <span className="rq-cc-n">
                {pad(i + 1)}
                <small>/ {pad(group.items.length)}</small>
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>

        <div className={`rq-cc-track is-${groupId}`} aria-hidden="true">
          <span style={{ width: `${view.size * 100}%`, left: `${view.at * (1 - view.size) * 100}%` }} />
        </div>
      </div>
    </section>
  );
}
