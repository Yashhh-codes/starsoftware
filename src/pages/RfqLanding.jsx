import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { IconSprite } from '../components/mtr-campaign/icons';
import RfqHero from '../components/rfq/RfqHero';
import Coverage from '../components/rfq/Coverage';
import RfqFaq from '../components/rfq/RfqFaq';
import SectionNav from '../components/mtrx/SectionNav';
import Investigate from '../components/rfqx/Investigate';
import DrawingCost from '../components/rfqx/DrawingCost';
import Radar from '../components/rfqx/Radar';
import Roi from '../components/rfqx/Roi';
import Contact from '../components/rfqx/Contact';
import { usePrefersReducedMotion, useReveal } from '../hooks/useMotion';
import { COVERAGE, FAQ, HERO, WIN } from '../data/rfqLanding';
import { DEMO_PATH } from '../data/demo';
import './RfqLanding.css';
import './MtrLanding.css';
import './MtrX.css';
import './RfqX.css';

const SECTIONS = [
  { id: 'investigation', label: 'How Star investigates' },
  { id: 'drawing', label: 'Drawing to cost' },
  { id: 'radar', label: 'Quote risk radar' },
  { id: 'roi', label: 'ROI' },
  { id: 'coverage', label: 'Processes & industries' },
  { id: 'faq', label: 'FAQ', selector: '.page-faq-wrap' },
  { id: 'contact', label: 'Try it on your RFQ' },
];

// The RFQ to quote page (/rfq-to-quote). The hero and "Processes &
// industries" are the redesigned site's, kept as they are in .rq-page
// blocks (styles: RfqLanding.css). The sections between them are new, in
// the MTR and COA pages' style (src/components/rfqx, styles: RfqX.css,
// copy: src/data/rfqX.js), under the sections nav that fades while the
// mouse rests.
export default function RfqLanding() {
  const { hash } = useLocation();
  const pageRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  useReveal(pageRef);

  useEffect(() => {
    const previous = document.title;
    document.title = 'RFQ to quote automation | Star Software';
    return () => {
      document.title = previous;
    };
  }, []);

  // A #section in the address scrolls to it once the page has drawn.
  useEffect(() => {
    if (!hash) return undefined;
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <>
      <div ref={pageRef} className={`rqx-page${reduced ? '' : ' mt-anim'}`}>
        <div className="rq-page rq-cert">
          <IconSprite />
          <Navbar />
        </div>
        <main>
          <div className="rq-page rq-cert">
            <RfqHero hero={HERO} win={WIN} />
          </div>
          <SectionNav items={SECTIONS} cta={{ href: DEMO_PATH, label: 'Book a demo' }} />
          <Investigate />
          <DrawingCost />
          <Radar />
          <Roi />
          <div className="rq-page rq-cert">
            <Coverage coverage={COVERAGE} />
          </div>
          <RfqFaq faq={FAQ} />
          <Contact />
        </main>
      </div>
      <Footer />
    </>
  );
}
