import React, { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { getArticlePromo, PROMO_LINK } from '../data/articlePromos';
import './ArticleToc.css';

// Headings are read from the rendered article rather than from article data,
// so the contents work the same for today's JSX sections and for HTML fetched
// from a CMS later: render the body inside the element `contentRef` points at
// and every <h2> in it becomes an entry.
const HEADING_SELECTOR = 'h2';

// How far below the viewport top a heading must pass to count as the one
// being read: the fixed navbar plus a little breathing room.
const ACTIVE_OFFSET_PX = 120;

function slugify(text) {
  return (
    text
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  );
}

// Gives each heading a stable id (keeping any the content already set) and
// returns the list. Ids are deduped against the whole document, since a
// fetched article can repeat a heading or clash with an id on the page.
function collectHeadings(root) {
  const used = new Set();
  return [...root.querySelectorAll(HEADING_SELECTOR)]
    .map((heading) => {
      const text = heading.textContent.trim();
      if (!text) return null;
      if (!heading.id) {
        const base = slugify(text);
        let id = base;
        for (let n = 2; used.has(id) || document.getElementById(id); n += 1) id = `${base}-${n}`;
        heading.id = id;
      }
      // Lets the heading take focus after a jump, so keyboard and screen
      // reader users continue reading from there.
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
      used.add(heading.id);
      return { id: heading.id, text };
    })
    .filter(Boolean);
}

function sameHeadings(a, b) {
  return a.length === b.length && a.every((item, i) => item.id === b[i].id && item.text === b[i].text);
}

// `articleKey` (the slug) re-runs the scan when the page switches articles,
// including from a not-found page, where the content element didn't exist.
export function useArticleHeadings(contentRef, articleKey) {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) {
      setHeadings([]);
      return undefined;
    }
    // A link straight to a section (/resources/slug#heading) can only land
    // once the heading has its generated id, so honour it on the first scan
    // that finds it.
    let hashPending = Boolean(window.location.hash);
    const update = () => {
      const next = collectHeadings(root);
      setHeadings((prev) => (sameHeadings(prev, next) ? prev : next));
      if (hashPending) {
        const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
        if (target && root.contains(target)) {
          hashPending = false;
          target.scrollIntoView({ block: 'start' });
        }
      }
    };
    update();
    // Content that arrives or changes after the first render (a fetch, a
    // client-side move to another article) rebuilds the list. Only child and
    // text changes are watched, so the ids set above don't retrigger it.
    const observer = new MutationObserver(update);
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [contentRef, articleKey]);

  return headings;
}

// Tracks which heading is being read, and jumps to one when its entry is
// clicked. During a jump the clicked entry stays highlighted until the scroll
// settles: otherwise tracking would walk the highlight through every heading
// the page passes on the way, which reads as flicker. Tracking picks up again
// on the reader's next scroll.
function useTocNavigation(headings) {
  const [activeId, setActiveId] = useState(null);
  // { id, timer } while a jump's smooth scroll is under way.
  const jumpRef = useRef(null);

  const endJump = useCallback(() => {
    const jump = jumpRef.current;
    if (!jump) return;
    jumpRef.current = null;
    clearTimeout(jump.timer);
    // Moved only once the scroll is done, so it can't interrupt it.
    document.getElementById(jump.id)?.focus({ preventScroll: true });
  }, []);

  // A jump ends when the browser reports `scrollend`, or else once scrolling
  // has been quiet for a moment (also covering a jump that needs no scroll).
  const armJumpEnd = useCallback(
    (delay) => {
      const jump = jumpRef.current;
      if (!jump) return;
      clearTimeout(jump.timer);
      jump.timer = setTimeout(endJump, delay);
    },
    [endJump]
  );

  useEffect(() => {
    if (headings.length === 0) return undefined;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let current = headings[0].id;
      for (const { id } of headings) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= ACTIVE_OFFSET_PX) current = id;
      }
      // A short last section can never reach the offset line, so mark it once
      // the page can't scroll any further.
      if (atBottom) {
        const last = document.getElementById(headings[headings.length - 1].id);
        if (last && last.getBoundingClientRect().top < window.innerHeight) current = last.id;
      }
      setActiveId(current);
    };
    const scheduleMeasure = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const onScroll = () => {
      if (jumpRef.current) armJumpEnd(150);
      else scheduleMeasure();
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scrollend', endJump);
    window.addEventListener('resize', scheduleMeasure);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scrollend', endJump);
      window.removeEventListener('resize', scheduleMeasure);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [headings, armJumpEnd, endJump]);

  useEffect(() => () => clearTimeout(jumpRef.current?.timer), []);

  const jump = useCallback(
    (event, id) => {
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      clearTimeout(jumpRef.current?.timer);
      jumpRef.current = { id, timer: 0 };
      armJumpEnd(300);
      setActiveId(id);
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      // Keep the router's own history state so back/forward still work.
      window.history.replaceState(window.history.state, '', `#${id}`);
    },
    [armJumpEnd]
  );

  return [activeId, jump];
}

function TocList({ headings, activeId, onJump }) {
  return (
    <ol className="rh-toc-list">
      {headings.map(({ id, text }) => (
        <li key={id} className={`rh-toc-item${id === activeId ? ' rh-toc-item--active' : ''}`}>
          <a
            href={`#${id}`}
            className="rh-toc-link"
            aria-current={id === activeId ? 'location' : undefined}
            onClick={(event) => onJump(event, id)}
          >
            {text}
          </a>
        </li>
      ))}
    </ol>
  );
}

// Desktop: sticky column beside the article with the contents and the
// product card for the article's category.
export function ArticleAside({ headings, category }) {
  const [activeId, jump] = useTocNavigation(headings);
  const promo = getArticlePromo(category);
  const splitAt = promo.title.lastIndexOf(' ') + 1;
  const titleLead = promo.title.slice(0, splitAt);
  const titleEnd = promo.title.slice(splitAt);

  return (
    <aside className="rh-article-aside">
      <div className="rh-article-aside-inner">
        {headings.length > 1 && (
          <nav className="rh-toc" aria-labelledby="rh-toc-title">
            <p id="rh-toc-title" className="rh-toc-title">
              On this page
            </p>
            <TocList headings={headings} activeId={activeId} onJump={jump} />
          </nav>
        )}

        <a className="rh-promo" href={PROMO_LINK}>
          <span className="rh-promo-kicker">Star Software for this</span>
          <span className="rh-promo-title">
            {titleLead}
            {/* The arrow wraps with the last word instead of on its own. */}
            <span className="rh-promo-title-end">
              {titleEnd}
              <ArrowRight size={18} aria-hidden="true" />
            </span>
          </span>
          <span className="rh-promo-desc">{promo.description}</span>
        </a>
      </div>
    </aside>
  );
}

// Below the desktop breakpoint the column is hidden; this collapsible copy of
// the contents sits at the top of the article instead.
export function InlineToc({ headings }) {
  const [activeId, jump] = useTocNavigation(headings);
  const [open, setOpen] = useState(false);

  if (headings.length < 2) return null;

  return (
    <nav className="rh-toc-inline" aria-labelledby="rh-toc-inline-title">
      <button
        type="button"
        id="rh-toc-inline-title"
        className="rh-toc-inline-toggle"
        aria-expanded={open}
        aria-controls="rh-toc-inline-list"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="rh-toc-title">On this page</span>
        <ChevronDown size={18} aria-hidden="true" className="rh-toc-inline-chevron" />
      </button>
      <div id="rh-toc-inline-list" hidden={!open}>
        <TocList
          headings={headings}
          activeId={activeId}
          onJump={(event, id) => {
            // Collapse first: closing the list shortens the page above the
            // target, so scrolling before it closes would land short.
            flushSync(() => setOpen(false));
            jump(event, id);
          }}
        />
      </div>
    </nav>
  );
}
