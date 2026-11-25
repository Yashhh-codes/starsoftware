import { ArrowRight } from 'lucide-react';
import { Eyebrow } from '../landing/LandingParts';
import Photo from './Photo';
import { SampleForm } from '../rfq/RfqContact';
import { CONTACT } from '../../data/rfqLanding';
import { R_CONTACT } from '../../data/rfqX';

// The closing invitation: what happens to a package you send, beside the
// sample form (which opens the visitor's email app with the details in).
export default function Contact() {
  const d = R_CONTACT;
  return (
    <section id="contact" className="mx-sec rqx-sec rqx-contact" aria-labelledby="rqc-title">
      <span id="demo" className="rqx-anchor" aria-hidden="true" />
      <div className="rqc-bg" aria-hidden="true" />
      <div className="mt-wrap rqc">
        <div className="rqc-copy">
          <Eyebrow>{d.label}</Eyebrow>
          <h2 id="rqc-title" className="mx-h2" data-reveal>
            {d.title} <span>{d.accent}</span>
          </h2>
          <p className="mx-lead" data-reveal style={{ '--rv-delay': '80ms' }}>
            {d.text}
          </p>
          <ol className="rqc-steps" data-reveal style={{ '--rv-delay': '140ms' }}>
            {d.steps.map(([t, s], i) => (
              <li key={t}>
                <span>{i + 1}</span>
                <div>
                  <b>{t}</b>
                  <small>{s}</small>
                </div>
              </li>
            ))}
          </ol>
          <Photo src="cert/mtr-shop.webp" alt="A fabricator moving steel beams on a busy shop floor" w={1600} h={1067} className="rqx-photo--contact" />
          <a className="rqc-alt" href={CONTACT.demoUrl} data-reveal style={{ '--rv-delay': '200ms' }}>
            Prefer a live walkthrough? Request a demo
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="rqc-card" data-reveal="scale" style={{ '--rv-delay': '120ms' }}>
          <div className="rqc-card-h">
            <b>Send your RFQ package</b>
            <small>The email, drawings and specification, as your customer sent them.</small>
          </div>
          <SampleForm contact={CONTACT} />
        </div>
      </div>
    </section>
  );
}
