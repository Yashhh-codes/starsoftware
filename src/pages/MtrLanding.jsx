import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  FileOutput,
  FileSearch,
  FolderSearch,
  Repeat,
  ScanText,
  Send,
  Shuffle,
  UserCheck,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RollingNumber from '../components/RollingNumber';
import HeroStage from '../components/mtr/HeroStage';
import ReviewDemo from '../components/mtr/ReviewDemo';
import SystemFitDiagram from '../components/mtr/SystemFitDiagram';
import { useInView, usePrefersReducedMotion, useReveal, useStepper } from '../hooks/useMotion';
import {
  BENEFITS,
  CUSTOMERS,
  FAQS,
  FINAL_CTA,
  HERO,
  PARTNERS,
  PROBLEM,
  PROOF,
  PROOF_REVIEW_URL,
  REVIEWER,
  SYSTEM_FIT,
  WORKFLOW,
} from '../data/mtrLanding';
import './MtrLanding.css';

// The MTR automation landing page (/mtr-automation), from "MTR Landing Page
// Copy.pdf", in the homepage's design language: Hanken Grotesk with mono
// labels, the violet-to-teal ribbon, white / soft / dark sections, and
// sections that animate in as they're reached. Copy: src/data/mtrLanding.js.

const pad2 = (n) => String(n).padStart(2, '0');

function useDocumentMeta(title, description) {
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

function Eyebrow({ children, dark = false }) {
  return <p className={`mt-eyebrow${dark ? ' mt-eyebrow--dark' : ''}`}>{children}</p>;
}

function PrimaryCta({ href = PROOF_REVIEW_URL, children }) {
  return (
    <a className="mt-btn mt-btn--primary" href={href}>
      <span>{children}</span>
      <ArrowRight size={18} aria-hidden="true" />
    </a>
  );
}

// A name in a logo row: its logo, or a wordmark until there is one.
function Brand({ item, className = '' }) {
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

// ---------------------------------------------------------------- Hero

// A centred headline over the stage, where the whole workflow plays out.
function Hero() {
  return (
    <section className="mt-hero" aria-labelledby="mt-hero-title">
      <div className="mt-hero-bg" aria-hidden="true" />
      <div className="mt-wrap">
        <div className="mt-hero-head">
          <p className="mt-chip" data-reveal>
            <ScanText size={14} aria-hidden="true" />
            {HERO.eyebrow}
          </p>
          <h1 id="mt-hero-title" className="mt-h1 mt-h1--hero" data-reveal style={{ '--rv-delay': '80ms' }}>
            {HERO.title} <em>{HERO.titleHighlight}</em>
          </h1>
          <p className="mt-lead" data-reveal style={{ '--rv-delay': '160ms' }}>
            {HERO.text}
          </p>
          <div className="mt-actions mt-actions--center" data-reveal style={{ '--rv-delay': '240ms' }}>
            <PrimaryCta>{HERO.primaryCta}</PrimaryCta>
            <a className="mt-btn mt-btn--ghost" href="#workflow">
              {HERO.secondaryCta}
              <ChevronDown size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="mt-hero-stage" data-reveal="scale" style={{ '--rv-delay': '320ms' }}>
          <HeroStage />
        </div>
      </div>
    </section>
  );
}

function CustomerStrip() {
  return (
    <section className="mt-customers" aria-label="Customers">
      <div className="mt-wrap mt-customers-inner">
        <p className="mt-customers-label" data-reveal>
          Trusted by teams at
        </p>
        <ul className="mt-customers-list">
          {CUSTOMERS.map((item, i) => (
            <li key={item.name} data-reveal style={{ '--rv-delay': `${80 + i * 70}ms` }}>
              <Brand item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ------------------------------------------------------------- Problem

// The four steps light up in turn as the list scrolls through the screen,
// along a rail that fills with it.
function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return undefined;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const start = window.innerHeight * 0.78;
      const p = (start - r.top) / (r.height + start - window.innerHeight * 0.35);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, reduced]);
  return progress;
}

function Problem() {
  const listRef = useRef(null);
  const progress = useScrollProgress(listRef);
  const count = PROBLEM.steps.length;
  return (
    <section className="mt-sec" aria-labelledby="mt-problem-title">
      <div className="mt-wrap mt-split">
        <div className="mt-problem-copy">
          <Eyebrow>{PROBLEM.eyebrow}</Eyebrow>
          <h2 id="mt-problem-title" className="mt-h2" data-reveal>
            {PROBLEM.title}
          </h2>
          <p className="mt-lead" data-reveal style={{ '--rv-delay': '80ms' }}>
            {PROBLEM.text}
          </p>
          <div className="mt-callout" data-reveal="scale" style={{ '--rv-delay': '160ms' }}>
            <p className="mt-callout-title">
              <RollingNumber value={PROBLEM.callout.value} className="mt-callout-value" /> {PROBLEM.callout.title}
            </p>
            <p className="mt-callout-text">{PROBLEM.callout.text}</p>
          </div>
        </div>

        <ol ref={listRef} className="mt-rail" style={{ '--p': progress }}>
          <span className="mt-rail-track" aria-hidden="true">
            <span className="mt-rail-fill" />
          </span>
          {PROBLEM.steps.map((step, i) => (
            <li
              key={step.title}
              className={`mt-rail-item${progress >= (i + 0.35) / count ? ' is-on' : ''}`}
              data-reveal
              style={{ '--rv-delay': `${i * 90}ms` }}
            >
              <span className="mt-rail-n">{pad2(i + 1)}</span>
              <div>
                <h3 className="mt-h3">{step.title}</h3>
                <p className="mt-text">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ------------------------------------------------------------ Workflow

const WORKFLOW_ICONS = [ScanText, BadgeCheck, UserCheck, Send];
const WORKFLOW_MS = [1700, 1700, 1700, 1900];

function Workflow() {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { threshold: 0.35 });
  const [active] = useStepper(WORKFLOW_MS, inView && !reduced);
  const count = WORKFLOW.steps.length;
  return (
    <section id="workflow" className="mt-sec mt-sec--soft" aria-labelledby="mt-workflow-title">
      <div className="mt-wrap">
        <div className="mt-head mt-head--center">
          <Eyebrow>{WORKFLOW.eyebrow}</Eyebrow>
          <h2 id="mt-workflow-title" className="mt-h2" data-reveal>
            {WORKFLOW.title}
          </h2>
          <p className="mt-lead" data-reveal style={{ '--rv-delay': '80ms' }}>
            {WORKFLOW.text}
          </p>
        </div>

        <div ref={ref} className={`mt-flow${reduced ? ' is-still' : ''}`} style={{ '--active': reduced ? count - 1 : active, '--count': count }}>
          <span className="mt-flow-rail" aria-hidden="true">
            <span className="mt-flow-fill" />
            <span className="mt-flow-pulse" />
          </span>
          <ol className="mt-flow-steps">
            {WORKFLOW.steps.map((step, i) => {
              const Icon = WORKFLOW_ICONS[i];
              const state = reduced || i <= active ? (i === active && !reduced ? ' is-active' : ' is-done') : '';
              return (
                <li key={step.title} className={`mt-flow-step${state}`} data-reveal style={{ '--rv-delay': `${i * 110}ms` }}>
                  <span className="mt-flow-node" aria-hidden="true" />
                  <div className="mt-flow-card">
                    <span className="mt-flow-top">
                      <span className="mt-flow-n">{pad2(i + 1)}</span>
                      <span className="mt-flow-arrows" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                        <span />
                      </span>
                    </span>
                    <span className="mt-icon">
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-h3">{step.title}</h3>
                    <p className="mt-text">{step.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------ Benefits

const BENEFIT_ICONS = [Repeat, Shuffle, FolderSearch, FileOutput];

function Benefits() {
  return (
    <section className="mt-sec" aria-labelledby="mt-benefits-title">
      <div className="mt-wrap mt-split mt-split--wide">
        <div className="mt-sticky">
          <Eyebrow>{BENEFITS.eyebrow}</Eyebrow>
          <h2 id="mt-benefits-title" className="mt-h2" data-reveal>
            {BENEFITS.title}
          </h2>
          <p className="mt-lead" data-reveal style={{ '--rv-delay': '80ms' }}>
            {BENEFITS.text}
          </p>
          <div className="mt-actions" data-reveal style={{ '--rv-delay': '160ms' }}>
            <a className="mt-btn mt-btn--outline" href="#proof">
              {BENEFITS.cta}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
        <ul className="mt-benefits">
          {BENEFITS.items.map((item, i) => {
            const Icon = BENEFIT_ICONS[i];
            return (
              <li key={item.title} className="mt-benefit" data-reveal style={{ '--rv-delay': `${(i % 2) * 90 + Math.floor(i / 2) * 120}ms` }}>
                <span className="mt-icon mt-icon--lg">
                  <Icon size={22} />
                </span>
                <h3 className="mt-h3">{item.title}</h3>
                <p className="mt-text">{item.text}</p>
                <span className="mt-benefit-glow" aria-hidden="true" />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ------------------------------------------------------------ Reviewer

function Reviewer() {
  const [stage, setStage] = useState(0);
  // Stage 1 (Check) onwards maps to one point each.
  const activePoint = stage - 1;
  return (
    <section className="mt-sec mt-sec--dark" aria-labelledby="mt-reviewer-title">
      <div className="mt-dark-glow" aria-hidden="true" />
      <div className="mt-wrap mt-split mt-split--demo">
        <div>
          <Eyebrow dark>{REVIEWER.eyebrow}</Eyebrow>
          <h2 id="mt-reviewer-title" className="mt-h2 mt-h2--light" data-reveal>
            {REVIEWER.title}
          </h2>
          <p className="mt-lead mt-lead--light" data-reveal style={{ '--rv-delay': '80ms' }}>
            {REVIEWER.text}
          </p>
          <ul className="mt-points">
            {REVIEWER.points.map((point, i) => (
              <li key={point} className={`mt-point${activePoint === i ? ' is-active' : ''}${activePoint > i ? ' is-past' : ''}`} data-reveal style={{ '--rv-delay': `${140 + i * 80}ms` }}>
                <span className="mt-point-ic" aria-hidden="true">
                  <ArrowRight size={14} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-demo" data-reveal="scale" style={{ '--rv-delay': '120ms' }}>
          <ReviewDemo onStage={setStage} />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------- System fit

function SystemFit() {
  return (
    <section className="mt-sec mt-sec--soft" aria-labelledby="mt-fit-title">
      <div className="mt-wrap">
        <div className="mt-head">
          <Eyebrow>{SYSTEM_FIT.eyebrow}</Eyebrow>
          <h2 id="mt-fit-title" className="mt-h2" data-reveal>
            {SYSTEM_FIT.title}
          </h2>
          <p className="mt-lead" data-reveal style={{ '--rv-delay': '80ms' }}>
            {SYSTEM_FIT.text}
          </p>
        </div>
        <div data-reveal="scale" style={{ '--rv-delay': '120ms' }}>
          <SystemFitDiagram erps={SYSTEM_FIT.erps} documentSystem={SYSTEM_FIT.documentSystem} note={SYSTEM_FIT.note} />
        </div>
      </div>
    </section>
  );
}

function PartnerStrip() {
  return (
    <section className="mt-partners" aria-label="Integration partners">
      <div className="mt-wrap mt-partners-inner">
        <p className="mt-customers-label" data-reveal>
          Works with
        </p>
        <ul className="mt-partners-list">
          {PARTNERS.map((item, i) => (
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

function Proof() {
  const listRef = useRef(null);
  const seen = useInView(listRef, { threshold: 0.45, once: true });
  const reduced = usePrefersReducedMotion();
  const [ticked, setTicked] = useState(0);
  const total = PROOF.list.length;

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
            <Eyebrow>{PROOF.eyebrow}</Eyebrow>
            <h2 id="mt-proof-title" className="mt-h2">
              {PROOF.title}
            </h2>
            <p className="mt-lead">{PROOF.text}</p>
            <div className="mt-actions">
              <PrimaryCta>{PROOF.cta}</PrimaryCta>
            </div>
          </div>
          <div ref={listRef} className="mt-checklist">
            <div className="mt-checklist-head">
              <p className="mt-checklist-title">{PROOF.listTitle}</p>
              <span className="mt-checklist-count">
                {ticked}/{total} ready
              </span>
            </div>
            <span className="mt-checklist-bar" aria-hidden="true">
              <span style={{ width: `${(ticked / total) * 100}%` }} />
            </span>
            <ul>
              {PROOF.list.map((item, i) => (
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

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="mt-sec mt-sec--soft" aria-labelledby="mt-faq-title">
      <div className="mt-wrap mt-split mt-split--faq">
        <div>
          <Eyebrow>{FAQS.eyebrow}</Eyebrow>
          <h2 id="mt-faq-title" className="mt-h2" data-reveal>
            {FAQS.title}
          </h2>
        </div>
        <div className="mt-faq">
          {FAQS.items.map((item, i) => {
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

function FinalCta() {
  return (
    <section className="mt-sec mt-sec--dark mt-final" aria-labelledby="mt-final-title">
      <div className="mt-final-bg" aria-hidden="true">
        <span className="mt-orb mt-orb--a" />
        <span className="mt-orb mt-orb--b" />
      </div>
      <div className="mt-wrap mt-final-inner">
        <span className="mt-final-ic" data-reveal="scale" aria-hidden="true">
          <FileSearch size={26} />
        </span>
        <h2 id="mt-final-title" className="mt-h2 mt-h2--light" data-reveal>
          {FINAL_CTA.title}
        </h2>
        <p className="mt-lead mt-lead--light" data-reveal style={{ '--rv-delay': '80ms' }}>
          {FINAL_CTA.text}
        </p>
        <div className="mt-actions mt-actions--center" data-reveal style={{ '--rv-delay': '160ms' }}>
          <PrimaryCta>{FINAL_CTA.cta}</PrimaryCta>
        </div>
      </div>
    </section>
  );
}

export default function MtrLanding() {
  const pageRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  useDocumentMeta('MTR automation | Star Software', HERO.text);
  useReveal(pageRef);

  return (
    // mt-anim turns the reveals on; without it (reduced motion) everything
    // simply shows.
    <div ref={pageRef} className={`mtr-page${reduced ? '' : ' mt-anim'}`}>
      <Navbar variant="solid" />
      <main className="mtr-main">
        <Hero />
        <CustomerStrip />
        <Problem />
        <Workflow />
        <Benefits />
        <Reviewer />
        <SystemFit />
        <PartnerStrip />
        <Proof />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
