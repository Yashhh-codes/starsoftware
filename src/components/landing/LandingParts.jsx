import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useInView, usePrefersReducedMotion } from '../../hooks/useMotion';
import PageFaq, { textToHtml } from '../PageFaq';

// What the product landing pages (/mtr-automation, /coa-automation) have in
// common: the same sections in the same design language, each filled from
// the page's own copy file. Styles: src/pages/MtrLanding.css.

export const pad2 = (n) => String(n).padStart(2, '0');

export function useDocumentMeta(title, description) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    const previous = meta?.getAttribute('content');
    if (meta) meta.setAttribute('content', description);
    return () => {
      document.title = previousTitle;
      if (meta && previous != null) meta.setAttribute('content', previous);
    };
  }, [title, description]);
}

export function Eyebrow({ children, dark = false }) {
  return <p className={`mt-eyebrow${dark ? ' mt-eyebrow--dark' : ''}`}>{children}</p>;
}

export function PrimaryCta({ href, children }) {
  return (
    <a className="mt-btn mt-btn--primary" href={href}>
      <span>{children}</span>
      <ArrowRight size={18} aria-hidden="true" />
    </a>
  );
}

// A name in a logo row: its logo, or a wordmark until there is one. `eager`
// for logos that slide into view (the running strip), which lazy loading
// can miss, leaving an empty box as they arrive.
export function Brand({ item, className = '', eager = false }) {
  return item.logo ? (
    <img
      className={`mt-logo ${className}`}
      src={item.logo}
      alt={item.name}
      loading={eager ? 'eager' : 'lazy'}
      style={item.logoHeight ? { height: item.logoHeight } : undefined}
    />
  ) : (
    <span className={`mt-wordmark ${className}`}>{item.name}</span>
  );
}

export function CustomerStrip({ items }) {
  return (
    <section className="mt-customers" aria-label="Customers">
      <div className="mt-wrap mt-customers-inner">
        <p className="mt-customers-label" data-reveal>
          Trusted by teams at
        </p>
        <ul className="mt-customers-list">
          {items.map((item, i) => (
            <li key={item.name} data-reveal style={{ '--rv-delay': `${80 + i * 70}ms` }}>
              <Brand item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// The logos in a row; `running`, in full colour on an endless scroll that
// pauses under the pointer (a second, hidden copy closes the loop).
export function PartnerStrip({ items, running = false }) {
  return (
    <section className={`mt-partners${running ? ' mt-partners--running' : ''}`} aria-label="Integration partners">
      <div className="mt-wrap mt-partners-inner">
        <p className="mt-customers-label" data-reveal>
          Works with
        </p>
        {running ? (
          <div className="mt-marquee" data-reveal style={{ '--rv-delay': '80ms' }}>
            <ul className="mt-marquee-track">
              {[0, 1].map((copy) =>
                items.map((item) => (
                  <li key={`${copy}-${item.name}`} className="mt-partner" aria-hidden={copy ? true : undefined}>
                    <Brand item={item} eager />
                  </li>
                ))
              )}
            </ul>
          </div>
        ) : (
          <ul className="mt-partners-list">
            {items.map((item, i) => (
              <li key={item.name} className="mt-partner" data-reveal style={{ '--rv-delay': `${i * 60}ms` }}>
                <Brand item={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// --------------------------------------------------------------- Proof

export function ProofOffer({ copy, href }) {
  const listRef = useRef(null);
  const seen = useInView(listRef, { threshold: 0.45, once: true });
  const reduced = usePrefersReducedMotion();
  const [ticked, setTicked] = useState(0);
  const total = copy.list.length;

  // Ticks the list off one item at a time once it's on screen.
  useEffect(() => {
    if (!seen) return undefined;
    if (reduced) {
      setTicked(total);
      return undefined;
    }
    if (ticked >= total) return undefined;
    const t = setTimeout(() => setTicked((n) => n + 1), ticked === 0 ? 350 : 420);
    return () => clearTimeout(t);
  }, [seen, ticked, total, reduced]);

  return (
    <section id="proof" className="mt-sec" aria-labelledby="mt-proof-title">
      <div className="mt-wrap">
        <div className="mt-proof" data-reveal="scale">
          <div className="mt-proof-copy">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <h2 id="mt-proof-title" className="mt-h2">
              {copy.title}
            </h2>
            <p className="mt-lead">{copy.text}</p>
            <div className="mt-actions">
              <PrimaryCta href={href}>{copy.cta}</PrimaryCta>
            </div>
          </div>
          <div ref={listRef} className="mt-checklist">
            <div className="mt-checklist-head">
              <p className="mt-checklist-title">{copy.listTitle}</p>
              <span className="mt-checklist-count">
                {ticked}/{total} ready
              </span>
            </div>
            <span className="mt-checklist-bar" aria-hidden="true">
              <span style={{ width: `${(ticked / total) * 100}%` }} />
            </span>
            <ul>
              {copy.list.map((item, i) => (
                <li key={item} className={`mt-check${i < ticked ? ' is-on' : ''}`}>
                  <span className="mt-check-box" aria-hidden="true">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------- FAQ

// The page's FAQ in the shared design (src/components/PageFaq.jsx): its
// questions, and the help card linking to the full FAQ in Resources.
export function FaqSection({ copy }) {
  const items = copy.items.map((item, i) => ({ id: `q${i}`, question: item.q, html: textToHtml(item.a) }));
  return <PageFaq items={items} topicLabel={copy.topic} heading={copy.title} lede={copy.lede} moreHref={copy.more} />;
}

// ----------------------------------------------------------- Final CTA

export function FinalCta({ copy, href, icon: Icon }) {
  return (
    <section className="mt-sec mt-sec--dark mt-final" aria-labelledby="mt-final-title">
      <div className="mt-final-bg" aria-hidden="true">
        <span className="mt-orb mt-orb--a" />
        <span className="mt-orb mt-orb--b" />
      </div>
      <div className="mt-wrap mt-final-inner">
        <span className="mt-final-ic" data-reveal="scale" aria-hidden="true">
          <Icon size={26} />
        </span>
        <h2 id="mt-final-title" className="mt-h2 mt-h2--light" data-reveal>
          {copy.title}
        </h2>
        <p className="mt-lead mt-lead--light" data-reveal style={{ '--rv-delay': '80ms' }}>
          {copy.text}
        </p>
        <div className="mt-actions mt-actions--center" data-reveal style={{ '--rv-delay': '160ms' }}>
          <PrimaryCta href={href}>{copy.cta}</PrimaryCta>
        </div>
      </div>
    </section>
  );
}
