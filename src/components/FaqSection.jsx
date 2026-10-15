import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, ChevronDown, MessageCircleQuestion, X } from 'lucide-react';
import { FAQ_CATEGORIES, FAQS } from '../data/faqData';
import './ArticleBlocks.css';
import './ResourceExtras.css';

// Star Software's FAQs (captured from starsoftware.co), filterable by
// product. ?faq=invoice|mtr|transcript preselects a category, which is how
// the navbar's FAQ sub-items land here.

const SHOWN = 6;
// Answers longer than this open to a preview and a topic list; the whole
// answer reads in a side panel, so the FAQ never turns into a long scroll.
const LONG_ANSWER_CHARS = 1400;
// Paragraphs from the start of a long answer shown in its preview.
const PREVIEW_PARAGRAPHS = 2;
// Topics listed in the preview before "+ N more".
const PREVIEW_TOPICS = 6;

const CATEGORY_IDS = FAQ_CATEGORIES.map((category) => category.id);

// A long answer split for reading: a short preview, the full HTML with ids on
// its headings, the outline of those headings, and a reading time.
function prepareLongAnswer(html, idPrefix) {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  const outline = [];
  doc.body.querySelectorAll('h2, h3').forEach((heading, index) => {
    heading.id = `${idPrefix}-t${index}`;
    outline.push({ id: heading.id, text: heading.textContent.trim(), level: heading.tagName === 'H2' ? 2 : 3 });
  });

  const preview = [];
  for (const node of doc.body.children) {
    if (/^H[1-6]$/.test(node.tagName) || preview.length >= PREVIEW_PARAGRAPHS) break;
    if (node.tagName === 'P') preview.push(node.outerHTML);
  }

  const words = doc.body.textContent.split(/\s+/).filter(Boolean).length;
  return {
    previewHtml: preview.join(''),
    fullHtml: doc.body.innerHTML,
    outline,
    minutes: Math.max(1, Math.round(words / 225)),
  };
}

// The full answer in a side panel: its own scroll, with the outline beside it
// (above it on phones) to jump between topics.
function AnswerReader({ faq, label, prepared, onClose }) {
  const dialogRef = useRef(null);
  const bodyRef = useRef(null);
  // While a jump's smooth scroll runs, the clicked topic stays highlighted
  // instead of stepping through every topic it passes.
  const jumpingRef = useRef(null);
  const [current, setCurrent] = useState(prepared.outline[0]?.id);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  // Highlight the topic being read as the panel scrolls.
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return undefined;
    const onScroll = () => {
      if (jumpingRef.current) {
        clearTimeout(jumpingRef.current);
        jumpingRef.current = setTimeout(() => {
          jumpingRef.current = null;
        }, 150);
        return;
      }
      const top = body.getBoundingClientRect().top + 24;
      let id = prepared.outline[0]?.id;
      for (const item of prepared.outline) {
        const el = body.querySelector(`#${CSS.escape(item.id)}`);
        if (el && el.getBoundingClientRect().top <= top) id = item.id;
      }
      setCurrent(id);
    };
    body.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      body.removeEventListener('scroll', onScroll);
      clearTimeout(jumpingRef.current);
    };
  }, [prepared]);

  // Closes and cleans up directly rather than waiting on the dialog's
  // `close` event, which can arrive late (the event stays the catch-all for
  // Escape); onClose is safe to run twice.
  const close = () => {
    dialogRef.current?.close();
    onClose();
  };

  const jump = (event, id) => {
    event.preventDefault();
    const el = bodyRef.current?.querySelector(`#${CSS.escape(id)}`);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    clearTimeout(jumpingRef.current);
    jumpingRef.current = setTimeout(() => {
      jumpingRef.current = null;
    }, 400);
    bodyRef.current.scrollTo({ top: el.offsetTop - 16, behavior: reduce ? 'auto' : 'smooth' });
    setCurrent(id);
  };

  return (
    <dialog
      ref={dialogRef}
      className="rx-reader"
      aria-labelledby="rx-reader-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="rx-reader-panel">
        <header className="rx-reader-head">
          <div>
            <span className="rx-faq-tag">
              {label} &middot; {prepared.minutes} min read
            </span>
            <h2 id="rx-reader-title" className="rx-reader-title">
              {faq.question}
            </h2>
          </div>
          <button type="button" className="rx-reader-close" aria-label="Close" onClick={close}>
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="rx-reader-main">
          {prepared.outline.length > 1 && (
            <nav className="rx-reader-toc" aria-label="In this answer">
              <p className="rx-reader-toc-label">In this answer</p>
              <ol>
                {prepared.outline.map((item) => (
                  <li key={item.id} className={item.level === 3 ? 'rx-reader-toc-sub' : undefined}>
                    <a
                      href={`#${item.id}`}
                      className={current === item.id ? 'rx-reader-toc-current' : undefined}
                      aria-current={current === item.id ? 'location' : undefined}
                      onClick={(event) => jump(event, item.id)}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div
            ref={bodyRef}
            className="rh-article-html rx-faq-body rx-reader-body"
            // Captured answer, cleaned to an allowlist of tags and attributes.
            dangerouslySetInnerHTML={{ __html: prepared.fullHtml }}
          />
        </div>
      </div>
    </dialog>
  );
}

function FaqItem({ faq, open, onToggle }) {
  const id = useId();
  const triggerRef = useRef(null);
  const [reading, setReading] = useState(false);
  const long = faq.html.length > LONG_ANSWER_CHARS;
  const label = FAQ_CATEGORIES.find((category) => category.id === faq.category)?.label;
  const prepared = useMemo(
    () => (long ? prepareLongAnswer(faq.html, `rx-${faq.id}`) : null),
    [long, faq.html, faq.id]
  );

  const closeReader = () => {
    setReading(false);
    triggerRef.current?.focus();
  };

  return (
    <li className={`rx-faq${open ? ' rx-faq--open' : ''}`}>
      <h3 className="rx-faq-q">
        <button
          type="button"
          className="rx-faq-trigger"
          aria-expanded={open}
          aria-controls={`${id}-answer`}
          onClick={onToggle}
        >
          <span className="rx-faq-text">{faq.question}</span>
          <span className="rx-faq-icon" aria-hidden="true" />
        </button>
      </h3>
      <div id={`${id}-answer`} className="rx-faq-answer" hidden={!open}>
        <span className="rx-faq-tag">{label}</span>
        {long ? (
          <>
            <div
              className="rh-article-html rx-faq-body"
              // Captured answer, cleaned to an allowlist of tags and attributes.
              dangerouslySetInnerHTML={{ __html: prepared.previewHtml }}
            />
            {prepared.outline.length > 0 && (
              <div className="rx-covers">
                <p className="rx-covers-label">What this answer covers</p>
                <ul className="rx-covers-list">
                  {prepared.outline.slice(0, PREVIEW_TOPICS).map((item) => (
                    <li key={item.id}>{item.text}</li>
                  ))}
                </ul>
                {prepared.outline.length > PREVIEW_TOPICS && (
                  <p className="rx-covers-more">+ {prepared.outline.length - PREVIEW_TOPICS} more topics</p>
                )}
              </div>
            )}
            <button ref={triggerRef} type="button" className="rx-read-full" onClick={() => setReading(true)}>
              <BookOpen size={16} aria-hidden="true" />
              Read the full answer
              <span className="rx-read-full-time">{prepared.minutes} min</span>
            </button>
            {reading && <AnswerReader faq={faq} label={label} prepared={prepared} onClose={closeReader} />}
          </>
        ) : (
          <div
            className="rh-article-html rx-faq-body"
            // Captured answers, cleaned to an allowlist of tags and attributes.
            dangerouslySetInnerHTML={{ __html: faq.html }}
          />
        )}
      </div>
    </li>
  );
}

export default function FaqSection() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const fromUrl = searchParams.get('faq');
  const [category, setCategory] = useState(CATEGORY_IDS.includes(fromUrl) ? fromUrl : 'all');
  const [expanded, setExpanded] = useState(false);
  const [openId, setOpenId] = useState(null);

  // Each navigation here (the navbar's FAQ links) sets the topic from the
  // link, or back to every question when it names none.
  useEffect(() => {
    setCategory(CATEGORY_IDS.includes(fromUrl) ? fromUrl : 'all');
  }, [fromUrl, location.key]);

  useEffect(() => {
    setExpanded(false);
    setOpenId(null);
  }, [category]);

  const counts = useMemo(() => {
    const result = { all: FAQS.length };
    CATEGORY_IDS.forEach((id) => {
      result[id] = FAQS.filter((faq) => faq.category === id).length;
    });
    return result;
  }, []);

  const list = category === 'all' ? FAQS : FAQS.filter((faq) => faq.category === category);
  const shown = expanded ? list : list.slice(0, SHOWN);
  const tabs = [{ id: 'all', label: 'All questions' }, ...FAQ_CATEGORIES];

  return (
    <section id="faqs" className="rs-section rx-faqs" aria-labelledby="rx-faqs-heading">
      <div className="rx-faqs-grid">
        <div className="rx-faqs-side">
          <span className="rh-section-eyebrow">FAQs</span>
          <h2 id="rx-faqs-heading" className="rh-h2">
            Answers to common questions
          </h2>
          <p className="rx-lede">
            How Star Software handles invoices, MTRs and transcripts, from setup and integration to accuracy and
            security.
          </p>

          <div className="rx-faq-tabs" role="tablist" aria-label="FAQ topic">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={category === tab.id}
                className={`rx-faq-tab${category === tab.id ? ' rx-faq-tab--active' : ''}`}
                onClick={() => setCategory(tab.id)}
              >
                <span>{tab.label}</span>
                <span className="rx-faq-tab-count">{counts[tab.id]}</span>
              </button>
            ))}
          </div>

          <div className="rx-faq-help">
            <MessageCircleQuestion size={20} aria-hidden="true" />
            <div>
              <p className="rx-faq-help-title">Still have a question?</p>
              <a href="/#contact" className="rx-faq-help-link">
                Talk to our team <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="rx-faqs-main">
          <ul className="rx-faq-list">
            {shown.map((faq) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                open={openId === faq.id}
                onToggle={() => setOpenId((current) => (current === faq.id ? null : faq.id))}
              />
            ))}
          </ul>
          {list.length > SHOWN && (
            <button
              type="button"
              className="rs-see-all rx-more"
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? 'Show fewer questions' : `Show all ${list.length} questions`}
              <ChevronDown size={16} aria-hidden="true" className={expanded ? 'rx-chevron--up' : undefined} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
