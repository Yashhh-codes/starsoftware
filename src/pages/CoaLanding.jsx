import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaqSection, useDocumentMeta } from '../components/landing/LandingParts';
import { usePrefersReducedMotion, useReveal } from '../hooks/useMotion';
import { FAQS } from '../data/coaLanding';
import { C_HERO, C_RESOURCES } from '../data/coaX';
import CxHero from '../components/coax/Hero';
import CxTry from '../components/coax/Try';
import CxPassFail from '../components/coax/PassFail';
import CxDecide from '../components/coax/Decide';
import CxRegs from '../components/coax/Regulations';
import CxControls from '../components/coax/Controls';
import CxAgents from '../components/coax/Agents';
import CxInteg from '../components/coax/Integrations';
import Resources from '../components/mtrx/Resources';
import CxContact from '../components/coax/Contact';
import SectionNav from '../components/mtrx/SectionNav';
import { HeadStyle } from '../components/mtrx/SecHead';
import { BOOKING_URL } from '../data/coaLanding';

const SECTIONS = [
  { id: 'try', label: 'Try it' },
  { id: 'pass-fail', label: 'Pass vs release' },
  { id: 'decide', label: 'How AI decides' },
  { id: 'regulations', label: 'Regulations' },
  { id: 'controls', label: 'Controls' },
  { id: 'agents', label: 'Agents' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'resources', label: 'Resources' },
  { id: 'faq', label: 'FAQ', selector: '.page-faq-wrap' },
];
import './MtrLanding.css';
import './CoaLanding.css';
import './MtrX.css';
import './CoaX.css';

// The COA automation landing page (/coa-automation). Its sections follow
// the redesigned site's COA page: the hero, the extraction demo to try,
// why "Pass" isn't release, how the AI decides, regulations by industry,
// compliance controls, the agents, integrations, resources, the FAQ and
// the closing invitation to send a sample. New sections live in
// src/components/coax (styles: CoaX.css); the head style, resources and
// closing section are shared with the MTR page (src/components/mtrx).
export default function CoaLanding() {
  const pageRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  useDocumentMeta('COA automation | Star Software', C_HERO.text);
  useReveal(pageRef);

  return (
    // mt-anim turns the reveals on; without it (reduced motion) everything
    // simply shows.
    <div ref={pageRef} className={`mtr-page coa-page${reduced ? '' : ' mt-anim'}`}>
      <Navbar variant="solid" />
      <HeadStyle.Provider value="statement">
      <main className="mtr-main">
        <CxHero />
        <SectionNav items={SECTIONS} cta={{ href: BOOKING_URL, label: 'Book a demo' }} />
        <CxTry />
        <CxPassFail />
        <CxDecide />
        <CxRegs />
        <CxControls />
        <CxAgents />
        <CxInteg />
        <Resources data={C_RESOURCES} covers={[0, 'paper', 'clock', 'flow']} />
        <FaqSection copy={FAQS} />
        <CxContact />
      </main>
      </HeadStyle.Provider>
      <Footer />
    </div>
  );
}
