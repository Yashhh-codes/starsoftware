import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ClipboardCheck,
  FlaskConical,
  Gauge,
  PackageSearch,
  ServerCog,
  ShieldCheck,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CoaHeroStage from '../components/coa/CoaHeroStage';
import ExceptionReview from '../components/coa/ExceptionReview';
import ReleasePath from '../components/coa/ReleasePath';
import VerifyCompare from '../components/coa/VerifyCompare';
import WorkflowTour from '../components/coa/WorkflowTour';
import {
  CustomerStrip,
  Eyebrow,
  FaqSection,
  FinalCta,
  PartnerStrip,
  PrimaryCta,
  ProofOffer,
  useDocumentMeta,
} from '../components/landing/LandingParts';
import { usePrefersReducedMotion, useReveal } from '../hooks/useMotion';
import {
  AUDIENCE,
  CUSTOMERS,
  DIFFERENCE,
  FAQS,
  FINAL_CTA,
  HERO,
  PARTNERS,
  PROBLEM,
  PROOF,
  PROOF_REVIEW_URL,
  REVIEWER,
  WORKFLOW,
} from '../data/coaLanding';
import './MtrLanding.css';
import './CoaLanding.css';

// The COA automation landing page (/coa-automation), from "COA Landing Page
// Copy.pdf". It is the MTR page's sibling: the same design language and
// motion, its shared sections from components/landing/LandingParts, and
// the base styles of MtrLanding.css (scoped to .mtr-page, which this page
// carries too) with its own in CoaLanding.css. Copy: src/data/coaLanding.js.

// ---------------------------------------------------------------- Hero

// A centred headline over the stage, where a COA is read and then checked.
function Hero() {
  return (
    <section className="mt-hero" aria-labelledby="mt-hero-title">
      <div className="mt-hero-bg" aria-hidden="true" />
      <div className="mt-wrap">
        <div className="mt-hero-head">
          <p className="mt-chip" data-reveal>
            <FlaskConical size={14} aria-hidden="true" />
            {HERO.eyebrow}
          </p>
          <h1 id="mt-hero-title" className="mt-h1 mt-h1--hero" data-reveal style={{ '--rv-delay': '80ms' }}>
            {HERO.title} <em>{HERO.titleHighlight}</em>
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
          <CoaHeroStage />
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------- Problem

// The headline beside its lead, over the path from a received COA to a
// lot release decision, with the team's four steps along it.
function Problem() {
  return (
    <section className="mt-sec co-problem" aria-labelledby="mt-problem-title">
      <div className="mt-wrap">
        <div className="co-headsplit">
          <div>
            <Eyebrow>{PROBLEM.eyebrow}</Eyebrow>
            <h2 id="mt-problem-title" className="mt-h2" data-reveal>
              {PROBLEM.title}
            </h2>
          </div>
          <p className="mt-lead" data-reveal style={{ '--rv-delay': '80ms' }}>
            {PROBLEM.text}
          </p>
        </div>
        <ReleasePath steps={PROBLEM.steps} />
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
            {WORKFLOW.title}
          </h2>
          <p className="mt-lead" data-reveal style={{ '--rv-delay': '80ms' }}>
            {WORKFLOW.text}
          </p>
        </div>
        <div data-reveal="scale" style={{ '--rv-delay': '120ms' }}>
          <WorkflowTour steps={WORKFLOW.steps} />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------- Difference

function Difference() {
  return (
    <section className="mt-sec" aria-labelledby="co-difference-title">
      <div className="mt-wrap mt-split co-split">
        <div>
          <Eyebrow>{DIFFERENCE.eyebrow}</Eyebrow>
          <h2 id="co-difference-title" className="mt-h2" data-reveal>
            {DIFFERENCE.title}
          </h2>
          <p className="mt-lead" data-reveal style={{ '--rv-delay': '80ms' }}>
            {DIFFERENCE.text}
          </p>
          <div className="mt-actions" data-reveal style={{ '--rv-delay': '160ms' }}>
            <a className="mt-btn mt-btn--outline" href="#proof">
              {DIFFERENCE.cta}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div data-reveal="scale" style={{ '--rv-delay': '120ms' }}>
          <VerifyCompare columns={DIFFERENCE.columns} rows={DIFFERENCE.rows} />
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------ Reviewer

function Reviewer() {
  const [stage, setStage] = useState(0);
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
              <li key={point} className={`mt-point${stage === i ? ' is-active' : ''}${stage > i ? ' is-past' : ''}`} data-reveal style={{ '--rv-delay': `${140 + i * 80}ms` }}>
                <span className="mt-point-ic" aria-hidden="true">
                  <ArrowRight size={14} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-demo" data-reveal="scale" style={{ '--rv-delay': '120ms' }}>
          <ExceptionReview onStage={setStage} />
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------ Audience

const TEAM_ICONS = [ClipboardCheck, Gauge, PackageSearch, ServerCog];

function Audience() {
  return (
    <section className="mt-sec mt-sec--soft" aria-labelledby="co-audience-title">
      <div className="mt-wrap">
        <div className="mt-head mt-head--center">
          <Eyebrow>{AUDIENCE.eyebrow}</Eyebrow>
          <h2 id="co-audience-title" className="mt-h2" data-reveal>
            {AUDIENCE.title}
          </h2>
          <p className="mt-lead" data-reveal style={{ '--rv-delay': '80ms' }}>
            {AUDIENCE.text}
          </p>
          {/* The industries the sentence names, as a row to scan. */}
          <ul className="co-industries" aria-hidden="true">
            {AUDIENCE.industries.map((name, i) => (
              <li key={name} data-reveal style={{ '--rv-delay': `${140 + i * 60}ms` }}>
                {name}
              </li>
            ))}
          </ul>
        </div>
        <ul className="co-teams">
          {AUDIENCE.teams.map((team, i) => {
            const Icon = TEAM_ICONS[i];
            return (
              <li key={team.title} className="mt-benefit co-team" data-reveal style={{ '--rv-delay': `${i * 90}ms` }}>
                <span className="mt-icon mt-icon--lg">
                  <Icon size={22} />
                </span>
                <h3 className="mt-h3">{team.title}</h3>
                <p className="mt-text">{team.text}</p>
                <span className="mt-benefit-glow" aria-hidden="true" />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default function CoaLanding() {
  const pageRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  useDocumentMeta('COA automation | Star Software', HERO.text);
  useReveal(pageRef);

  return (
    // mt-anim turns the reveals on; without it (reduced motion) everything
    // simply shows.
    <div ref={pageRef} className={`mtr-page coa-page${reduced ? '' : ' mt-anim'}`}>
      <Navbar variant="solid" />
      <main className="mtr-main">
        <Hero />
        <CustomerStrip items={CUSTOMERS} />
        <Problem />
        <Workflow />
        <Difference />
        <Reviewer />
        <Audience />
        <PartnerStrip items={PARTNERS} running />
        <ProofOffer copy={PROOF} href={PROOF_REVIEW_URL} />
        <FaqSection copy={FAQS} />
        <FinalCta copy={FINAL_CTA} href={PROOF_REVIEW_URL} icon={ShieldCheck} />
      </main>
      <Footer />
    </div>
  );
}
