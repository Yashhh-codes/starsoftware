import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChapterNav from '../components/mtr-campaign/ChapterNav';
import { IconSprite } from '../components/mtr-campaign/icons';
import RfqHero from '../components/rfq/RfqHero';
import Investigation from '../components/rfq/Investigation';
import RiskRadar from '../components/rfq/RiskRadar';
import Roi from '../components/rfq/Roi';
import RfqFaq from '../components/rfq/RfqFaq';
import RfqContact from '../components/rfq/RfqContact';
import { CHAPTERS, CONTACT, FAQ, HERO, INVESTIGATION, RADAR, ROI, WIN } from '../data/rfqLanding';
import './RfqLanding.css';

// The RFQ to quote page (/rfq-to-quote): the redesigned site's page, with
// this site's navbar and footer. Its styles are scoped to .rq-page, so
// they stay on this page. Copy: src/data/rfqLanding.js.
export default function RfqLanding() {
  const { hash } = useLocation();

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
      <div className="rq-page rq-cert">
        <IconSprite />
        <Navbar />
        <main>
          <RfqHero hero={HERO} win={WIN} />
          <ChapterNav chapters={CHAPTERS} />
          <Investigation investigation={INVESTIGATION} />
          <RiskRadar radar={RADAR} />
          <Roi roi={ROI} />
          <RfqFaq faq={FAQ} />
          <RfqContact contact={CONTACT} />
        </main>
      </div>
      <Footer />
    </>
  );
}
