import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ExtractionDemo from '../components/mtr/ExtractionDemo';
import { gradient, Marked } from '../components/landing/Marked';
import { Eyebrow, FaqSection, useDocumentMeta } from '../components/landing/LandingParts';
import { usePrefersReducedMotion, useReveal } from '../hooks/useMotion';
import { BOOKING_URL, FAQS, HERO, TRY_IT } from '../data/mtrLanding';
import { X_HERO } from '../data/mtrX';
import XHero from '../components/mtrx/Hero';
import XDecision from '../components/mtrx/Decision';
import XCompliance from '../components/mtrx/Compliance';
import XStandards from '../components/mtrx/Standards';
import XEn10204 from '../components/mtrx/En10204';
import XAgents from '../components/mtrx/Agents';
import XIntegrations from '../components/mtrx/Integrations';
import XResources from '../components/mtrx/Resources';
import XIndustries from '../components/mtrx/Industries';
import XSendSample from '../components/mtrx/SendSample';
import './MtrLanding.css';
import './MtrX.css';

// The MTR automation landing page (/mtr-automation). Its sections follow the
// redesigned site's MTR page: the hero, the extraction demo to try, how the
// AI decides, compliance, standards by business, EN 10204, the agents,
// integrations with a customer story, resources, industries, the FAQ and
// the closing invitation to send a sample. The new sections live in
// src/components/mtrx (styles: MtrX.css); the extraction demo and the FAQ
// are the shared ones (styles: MtrLanding.css).

// -------------------------------------------------------------- Try it

// The extraction to try by hand, on sample MTRs.
function TryIt() {
  return (
    <section id="try" className="mt-sec" aria-labelledby="mt-try-title">
      <div className="mt-wrap">
        <div className="mt-head">
          <Eyebrow>{TRY_IT.eyebrow}</Eyebrow>
          <h2 id="mt-try-title" className="mt-h2" data-reveal>
            <Marked text={TRY_IT.title} marks={[{ phrase: 'structured data.', render: gradient }]} />
          </h2>
          <p className="mt-lead" data-reveal style={{ '--rv-delay': '80ms' }}>
            {TRY_IT.text}
          </p>
        </div>
        <div className="mt-try-stage" data-reveal="scale" style={{ '--rv-delay': '140ms' }}>
          <ExtractionDemo cta={{ href: BOOKING_URL, label: HERO.primaryCta }} />
        </div>
      </div>
    </section>
  );
}

export default function MtrLanding() {
  const pageRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  useDocumentMeta('MTR automation | Star Software', X_HERO.text);
  useReveal(pageRef);

  return (
    // mt-anim turns the reveals on; without it (reduced motion) everything
    // simply shows.
    <div ref={pageRef} className={`mtr-page${reduced ? '' : ' mt-anim'}`}>
      <Navbar variant="solid" />
      <main className="mtr-main">
        <XHero />
        <TryIt />
        <XDecision />
        <XCompliance />
        <XStandards />
        <XEn10204 />
        <XAgents />
        <XIntegrations />
        <XResources />
        <XIndustries />
        <FaqSection copy={FAQS} />
        <XSendSample />
      </main>
      <Footer />
    </div>
  );
}
