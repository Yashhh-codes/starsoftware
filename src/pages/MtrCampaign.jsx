import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CampaignNavbar from '../components/mtr-campaign/CampaignNavbar';
import Hero from '../components/mtr-campaign/Hero';
import WorkflowStage from '../components/mtr-campaign/WorkflowStage';
import ChapterNav from '../components/mtr-campaign/ChapterNav';
import Decision from '../components/mtr-campaign/Decision';
import Compliance from '../components/mtr-campaign/Compliance';
import Standards from '../components/mtr-campaign/Standards';
import En10204 from '../components/mtr-campaign/En10204';
import Agents from '../components/mtr-campaign/Agents';
import Integrations from '../components/mtr-campaign/Integrations';
import Faq from '../components/mtr-campaign/Faq';
import { IconSprite } from '../components/mtr-campaign/icons';
import {
  AGENTS,
  CERT,
  CHAPTERS,
  COMPLIANCE,
  COMPLIANCE_CHECKS,
  DECISION,
  EN10204,
  FAQ,
  HERO,
  INTEGRATIONS,
  SECTORS,
  SEGMENTS,
} from '../data/mtrCampaign';
import './MtrCampaign.css';

// The MTR campaign page (/mtr-campaign): the redesigned site's MTR
// automation page, without its Try it, Resources, Industries and contact
// sections or its footer. Separate from /mtr-automation; its styles are
// scoped to .mc-page so they stay on this page. Copy: src/data/mtrCampaign.jsx.
export default function MtrCampaign() {
  const { hash } = useLocation();

  useEffect(() => {
    const previous = document.title;
    document.title = 'MTR automation | Star Software';
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
    <div className="mc-page mc-cert">
      <IconSprite />
      <CampaignNavbar />
      <main>
        <Hero hero={HERO} />
        <WorkflowStage />
        <ChapterNav chapters={CHAPTERS} />
        <Decision decision={DECISION} live dark />
        <Compliance intro={COMPLIANCE} checks={COMPLIANCE_CHECKS} />
        <Standards sectors={SECTORS} segments={SEGMENTS} cert={CERT} />
        <En10204 en={EN10204} />
        <Agents agents={AGENTS} />
        <Integrations integrations={INTEGRATIONS} />
        <Faq faq={FAQ} />
      </main>
    </div>
  );
}
