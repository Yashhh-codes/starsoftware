import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useInView, usePrefersReducedMotion } from '../../hooks/useMotion';

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

// A name in a logo row: its logo, or a wordmark until there is one.
export function Brand({ item, className = '' }) {
  return item.logo ? (
    <img
      className={`mt-logo ${className}`}
      src={item.logo}
      alt={item.name}
      loading="lazy"
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

export function PartnerStrip({ items }) {
  return (
    <section className="mt-partners" aria-label="Integration partners">
      <div className="mt-wrap mt-partners-inner">
        <p className="mt-customers-label" data-reveal>
          Works with
        </p>
        <ul className="mt-partners-list">
          {items.map((item, i) => (
            <li key={item.name} className="mt-partner" data-reveal style={{ '--rv-delay': `${i * 60}ms` }}>
              <Brand item={item} />
            </li>
          ))}
        </ul>
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

export function FaqSection({ copy }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="mt-sec mt-sec--soft" aria-labelledby="mt-faq-title">
      <div className="mt-wrap mt-split mt-split--faq">
        <div>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h2 id="mt-faq-title" className="mt-h2" data-reveal>
            {copy.title}
          </h2>
        </div>
        <div className="mt-faq">
          {copy.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className={`mt-faq-item${isOpen ? ' is-open' : ''}`} data-reveal style={{ '--rv-delay': `${i * 60}ms` }}>
                <h3>
                  <button
                    type="button"
                    className="mt-faq-q"
                    aria-expanded={isOpen}
                    aria-controls={`mt-faq-a-${i}`}
                    id={`mt-faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span className="mt-faq-n">{pad2(i + 1)}</span>
                    <span className="mt-faq-text">{item.q}</span>
                    <span className="mt-faq-ic" aria-hidden="true" />
                  </button>
                </h3>
                <div className="mt-faq-a" id={`mt-faq-a-${i}`} role="region" aria-labelledby={`mt-faq-q-${i}`}>
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
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
