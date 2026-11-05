import { useId, useState } from 'react';
import Statement from '../mtr-campaign/Statement';
import { Icon } from '../mtr-campaign/icons';

const pad = (n) => String(n).padStart(2, '0');
const NARROW = '(max-width: 860px)';

// The same content as Coverage, lighter: a switch between the two groups,
// then one panel with the group's items as a list on the left and the
// picked one's description on the right. On a phone the list is an
// accordion, each description opening under its item.
export default function CoverageList({ coverage }) {
  const base = useId();
  const [groupId, setGroupId] = useState(coverage.groups[0].id);
  // Each group remembers its own pick; -1 is all closed (phone only).
  const [picked, setPicked] = useState(() => Object.fromEntries(coverage.groups.map((g) => [g.id, 0])));
  const group = coverage.groups.find((g) => g.id === groupId);
  const total = group.items.length;
  const active = picked[groupId];
  const shown = Math.max(active, 0);

  const pick = (i) => setPicked((p) => ({ ...p, [groupId]: (i + total) % total }));

  // On a phone, tapping the open item closes it.
  const onItem = (i) => {
    if (i === active && window.matchMedia(NARROW).matches) setPicked((p) => ({ ...p, [groupId]: -1 }));
    else pick(i);
  };

  // Up and down step from the focused item, wrapping at the ends.
  const onListKey = (event) => {
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const from = [...event.currentTarget.children].indexOf(event.target.closest('li'));
    const next = ((from < 0 ? shown : from) + step + total) % total;
    pick(next);
    document.getElementById(`${base}-item-${next}`)?.focus();
  };

  const onSwitchKey = (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const at = coverage.groups.findIndex((g) => g.id === groupId);
    const next = coverage.groups[(at + step + coverage.groups.length) % coverage.groups.length];
    setGroupId(next.id);
    document.getElementById(`${base}-tab-${next.id}`)?.focus();
  };

  return (
    <section className="sec sec-soft rq-cl" id="coverage-list">
      <div className="wrap">
        <header className="rq-cl-head">
          <Statement text={coverage.title} />
          <p>{coverage.text}</p>
        </header>

        <div className="rq-cl-switch" role="tablist" aria-label="Browse by" onKeyDown={onSwitchKey} data-at={coverage.groups.findIndex((g) => g.id === groupId)}>
          {coverage.groups.map((g) => (
            <button
              key={g.id}
              id={`${base}-tab-${g.id}`}
              type="button"
              role="tab"
              aria-selected={g.id === groupId}
              aria-controls={`${base}-panel`}
              tabIndex={g.id === groupId ? 0 : -1}
              className={g.id === groupId ? 'is-on' : ''}
              onClick={() => setGroupId(g.id)}
            >
              {g.title.split(' / ')[0]}
              <span>{g.items.length}</span>
            </button>
          ))}
        </div>
        <p className="rq-cl-question" key={`q-${groupId}`}>
          {group.question}
        </p>

        <div className={`rq-cl-panel is-${groupId}`} id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-tab-${groupId}`}>
          <ol className="rq-cl-list" onKeyDown={onListKey}>
            {group.items.map(([itemTitle, itemText], i) => (
              <li key={itemTitle} className={i === active ? 'is-on' : ''}>
                <button id={`${base}-item-${i}`} type="button" aria-expanded={i === active} onClick={() => onItem(i)}>
                  <span className="rq-cl-n">{pad(i + 1)}</span>
                  <span className="rq-cl-t">{itemTitle}</span>
                  <Icon name="right" className="rq-cl-go" />
                </button>
                {/* Shown only on a phone, where the list is an accordion. */}
                <div className="rq-cl-inline">
                  <p>{itemText}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Every description in one cell, so the tallest sets the height
              and the panel doesn't move as you pick. */}
          <div className="rq-cl-detail">
            <span className="rq-cl-big" aria-hidden="true" key={`${groupId}-${shown}`}>
              {pad(shown + 1)}
            </span>
            <div className="rq-cl-copies" aria-live="polite">
              {group.items.map(([itemTitle, itemText], i) => (
                <div key={itemTitle} className={`rq-cl-copy${i === shown ? ' is-on' : ''}`} aria-hidden={i !== shown}>
                  <span className="rq-cl-of">
                    {pad(i + 1)} / {pad(total)} · {group.unit}
                  </span>
                  <h3>{itemTitle}</h3>
                  <p>{itemText}</p>
                </div>
              ))}
            </div>
            <div className="rq-cl-step">
              <button type="button" onClick={() => pick(shown - 1)} aria-label="Previous">
                <Icon name="left" />
              </button>
              <button type="button" className="rq-cl-next" onClick={() => pick(shown + 1)}>
                <span>Next</span>
                <b>{group.items[(shown + 1) % total][0]}</b>
                <Icon name="right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
