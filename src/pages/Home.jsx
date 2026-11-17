import { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Company,
  Compliance,
  ContactCta,
  Hero,
  IconSprite,
  Industries,
  OrderAutomation,
  Products,
  Scale,
  Security,
  Solutions,
  useHashScroll,
  VideoModal,
  WorkflowStudio,
} from '../components/home/HomeSections';
import './Home.css';

// The homepage (/): the redesigned site's homepage, section for section,
// with this site's navbar and footer. Sections: src/components/home/;
// styles, scoped to .home-page: ./Home.css; media: public/home/.
export default function Home() {
  const [videoOpen, setVideoOpen] = useState(false);
  const openVideo = useCallback(() => setVideoOpen(true), []);
  const closeVideo = useCallback(() => setVideoOpen(false), []);
  useHashScroll();

  // The hero headline's typeface, for this page only.
  useEffect(() => {
    const href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap';
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }, []);

  return (
    <div className="home-page">
      <IconSprite />
      <Navbar />
      <main>
        <Hero />
        <Solutions />
        <OrderAutomation onWatch={openVideo} />
        <WorkflowStudio />
        <Industries />
        <Scale />
        <Company />
        <Products />
        <Security />
        <Compliance />
        <ContactCta />
      </main>
      <Footer />
      <VideoModal open={videoOpen} onClose={closeVideo} src="/home/media/order-automation.mp4" />
    </div>
  );
}
