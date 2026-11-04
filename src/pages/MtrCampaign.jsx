import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CampaignNavbar from '../components/mtr-campaign/CampaignNavbar';
import Hero from '../components/mtr-campaign/Hero';
import WorkflowStage from '../components/mtr-campaign/WorkflowStage';
import Comparison from '../components/mtr-campaign/Comparison';
import ChapterNav from '../components/mtr-campaign/ChapterNav';
import Steps from '../components/mtr-campaign/Steps';
import SendMtr from '../components/mtr-campaign/SendMtr';
import CampaignFooter from '../components/mtr-campaign/CampaignFooter';
import Decision from '../components/mtr-campaign/Decision';
import Compliance from '../components/mtr-campaign/Compliance';
import Standards from '../components/mtr-campaign/Standards';
import En10204 from '../components/mtr-campaign/En10204';
import Agents from '../components/mtr-campaign/Agents';
import Integrations from '../components/mtr-campaign/Integrations';
import CampaignFaq from '../components/mtr-campaign/CampaignFaq';
import { IconSprite } from '../components/mtr-campaign/icons';
import {
  AGENTS,
  CERT,
  CHAPTERS,
  COMPANY,
  COMPARISON,
  COMPLIANCE,
  COMPLIANCE_CHECKS,
  DECISION,
  EN10204,
  FAQ,
  HERO,
  INTEGRATIONS,
  SECTORS,
  SEGMENTS,
  SEND,
  STEPS,
} from '../data/mtrCampaign';
import './MtrCampaign.css';

// The MTR campaign page (/mtr-campaign): the redesigned site's MTR
// automation page, without its Try it, Resources, Industries and contact
// sections or its footer, and carrying the campaign email's message: its
// headline, the digitized-versus-intelligent comparison, the two steps and
// the closing "send us your toughest MTR". Separate from /mtr-automation;
// its styles are scoped to .mc-page so they stay on this page. Copy:
// src/data/mtrCampaign.jsx.
export default function MtrCampaign() {
  const { hash } = useLocation();

  useEffect(() => {
    const previous = document.title;
    document.title = 'MTR automation | Star Software';
    return () => {
      document.title = previous;
    };
  }, []);

  // Kept out of search results, so it doesn't compete with /mtr-automation.
  // The server sends the same as an X-Robots-Tag header (vercel.json); this
  // is the in-page copy, gone again when the visitor leaves the page.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  // A #section in the address scrolls to it once the page has drawn.
  useEffect(() => {
    if (!hash) return undefined;
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <div className="mc-page mc-cert">
      <IconSprite />
      <CampaignNavbar />
      <main>
        {/* First in main, so it is already stuck to the top whenever it
            shows, rather than appearing between two sections. */}
        <ChapterNav chapters={CHAPTERS} />
        <Hero hero={HERO} />
        <WorkflowStage />
        <Comparison comparison={COMPARISON} />
        <Steps steps={STEPS} />
        <Decision decision={DECISION} live dark />
        <Compliance intro={COMPLIANCE} checks={COMPLIANCE_CHECKS} />
        <Standards sectors={SECTORS} segments={SEGMENTS} cert={CERT} />
        <En10204 en={EN10204} />
        <Agents agents={AGENTS} />
        <Integrations integrations={INTEGRATIONS} />
        <CampaignFaq faq={FAQ} />
        <SendMtr send={SEND} />
      </main>
      <CampaignFooter company={COMPANY} />
    </div>
  );
}
