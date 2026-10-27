import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Database,
  FileOutput,
  FileSearch,
  FileText,
  FolderSearch,
  Hourglass,
  MessageSquareText,
  Repeat,
  ScanText,
  Shuffle,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RollingNumber from '../components/RollingNumber';
import HeroStage from '../components/mtr/HeroStage';
import ReviewDemo from '../components/mtr/ReviewDemo';
import SystemFitDiagram from '../components/mtr/SystemFitDiagram';
import WorkflowFlow from '../components/mtr/WorkflowFlow';
import { gradient, Marked, Token } from '../components/landing/Marked';
import {
  CustomerStrip,
  Eyebrow,
  FaqSection,
  FinalCta,
  PartnerStrip,
  pad2,
  PrimaryCta,
  ProofOffer,
  useDocumentMeta,
} from '../components/landing/LandingParts';
import { usePrefersReducedMotion, useReveal } from '../hooks/useMotion';
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
// sections that animate in as they're reached. Copy: src/data/mtrLanding.js;
// the sections it shares with the COA page: components/landing/LandingParts.

// ---------------------------------------------------------------- Hero

// A centred headline over the stage, where the whole workflow plays out.
// The incoming MTR is framed as a scanner captures it, and the line from
// the certificate ends on the ERP as a destination that receives it.
function Hero() {
  const toErp = HERO.titleHighlight.replace(/\s*ERP$/, '');
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
            <Marked
              text={HERO.title}
              marks={[
                {
                  phrase: 'incoming MTR',
                  render: (p) => (
                    <span className="mt-capture">
                      {p}
                      <i aria-hidden="true" />
                      <i aria-hidden="true" />
                      <i aria-hidden="true" />
                      <i aria-hidden="true" />
                    </span>
                  ),
                },
              ]}
            />{' '}
            <span className="mt-hero-line">
              <em>{toErp}</em>{' '}
              <span className="mt-dest">
                <span className="mt-dest-ic" aria-hidden="true">
                  <Database />
                </span>
                ERP
              </span>
            </span>
          </h1>
          <p className="mt-lead" data-reveal style={{ '--rv-delay': '160ms' }}>
            {HERO.text}
          </p>
          <div className="mt-actions mt-actions--center" data-reveal style={{ '--rv-delay': '240ms' }}>
            <PrimaryCta href={PROOF_REVIEW_URL}>{HERO.primaryCta}</PrimaryCta>
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
            <Marked
              text={PROBLEM.title}
              marks={[{ phrase: 'certificate', render: (p) => <Token icon={FileText}>{p}</Token> }]}
            />
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

function Workflow() {
  return (
    <section id="workflow" className="mt-sec mt-sec--soft" aria-labelledby="mt-workflow-title">
      <div className="mt-wrap">
        <div className="mt-head mt-head--center">
          <Eyebrow>{WORKFLOW.eyebrow}</Eyebrow>
          <h2 id="mt-workflow-title" className="mt-h2" data-reveal>
            <Marked text={WORKFLOW.title} marks={[{ phrase: 'One controlled flow.', render: gradient }]} />
          </h2>
          <p className="mt-lead" data-reveal style={{ '--rv-delay': '80ms' }}>
            {WORKFLOW.text}
          </p>
        </div>
        <WorkflowFlow steps={WORKFLOW.steps} />
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
            <Marked text={BENEFITS.title} marks={[{ phrase: 'the workaround', render: gradient }]} />
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
            <Marked
              text={REVIEWER.title}
              marks={[{ phrase: 'the reason', render: (p) => <Token icon={MessageSquareText} tone="dark">{p}</Token> }]}
            />
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
            <Marked text={SYSTEM_FIT.title} marks={[{ phrase: 'your existing systems.', render: gradient }]} />
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
        <CustomerStrip items={CUSTOMERS} />
        <Problem />
        <Workflow />
        <Benefits />
        <Reviewer />
        <SystemFit />
        <PartnerStrip items={PARTNERS} />
        <ProofOffer
          copy={{ ...PROOF, title: <Marked text={PROOF.title} marks={[{ phrase: 'your MTRs.', render: gradient }]} /> }}
          href={PROOF_REVIEW_URL}
        />
        <FaqSection copy={FAQS} />
        <FinalCta
          copy={{
            ...FINAL_CTA,
            title: (
              <Marked
                text={FINAL_CTA.title}
                marks={[{ phrase: 'manual drag', render: (p) => <Token icon={Hourglass} tone="dark">{p}</Token> }]}
              />
            ),
          }}
          href={PROOF_REVIEW_URL}
          icon={FileSearch}
        />
      </main>
      <Footer />
    </div>
  );
}
