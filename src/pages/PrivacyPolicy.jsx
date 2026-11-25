import { Fragment, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUp, Check, Mail, MapPin, Phone, Printer, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PRIVACY } from '../data/privacyPolicy';
import './PrivacyPolicy.css';

const MAIL = 'info@starsoftware.co';
const PHONE = '+1 (254) 326-1661';

// The commitments in the header, each from the policy's own words.
const COMMITMENTS = [
  ['We never resell your data', 'Not data about our users, and not data extracted from documents you upload.'],
  ['You control your information', 'Access, correct, delete, restrict, move or object to how it is used.'],
  ['Requests answered in 30 days', 'Write to us to review, update or delete what we hold.'],
  ['No marketing you can’t stop', 'Unsubscribe from any email, or change your preferences, at any time.'],
];

const SCOPE = ['starsoftware.co', 'platform.starsoftware.co', 'Star Software services and events'];

// Email addresses and web addresses in the policy's text become links.
const LINK = /(info@starsoftware\.co|https?:\/\/[^\s,)]+[^\s,.)])/g;
function Rich({ text }) {
  return text.split(LINK).map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    const mail = part.includes('@');
    return (
      <a key={i} href={mail ? `mailto:${part}` : part} {...(mail ? {} : { target: '_blank', rel: 'noreferrer' })}>
        {part}
      </a>
    );
  });
}

// "Section 8 of this Privacy Policy separately covers…" recurs at the end
// of several sections: it reads as an aside, so it is set as one.
const ASIDE = /^Section 8 of this Privacy Policy separately covers/;

function Blocks({ blocks }) {
  return blocks.map(([type, value], i) => {
    if (type === 'h4') return <h3 key={i} className="pp-sub">{value}</h3>;
    if (type === 'ul')
      return (
        <ul key={i}>
          {value.map((item) => (
            <li key={item}>
              <Rich text={item} />
            </li>
          ))}
        </ul>
      );
    if (ASIDE.test(value))
      return (
        <p key={i} className="pp-aside">
          <Rich text={value} />
        </p>
      );
    return (
      <p key={i}>
        <Rich text={value} />
      </p>
    );
  });
}

// The privacy policy (/privacy-policy), word for word from
// starsoftware.co/privacy-policy/: the commitments up top, then the policy
// with a contents list that follows along as you read.
export default function PrivacyPolicy() {
  const [active, setActive] = useState(null);
  const [progress, setProgress] = useState(0);
  const docRef = useRef(null);

  useEffect(() => {
    const previous = document.title;
    document.title = 'Privacy policy | Star Software';
    return () => {
      document.title = previous;
    };
  }, []);

  // The section being read, and how far through the policy you are.
  useEffect(() => {
    const els = PRIVACY.sections.map((s) => document.getElementById(`s${s.n}`)).filter(Boolean);
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), {
      rootMargin: '-25% 0px -65% 0px',
    });
    els.forEach((el) => io.observe(el));
    const onScroll = () => {
      const el = docRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setProgress(Math.min(1, Math.max(0, (window.innerHeight * 0.35 - r.top) / (r.height - window.innerHeight * 0.4))));
      if (r.top > window.innerHeight * 0.3) setActive(null);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="pp-page">
      <Navbar variant="solid" />
      <main>
        <header className="pp-hero">
          <div className="pp-hero-bg" aria-hidden="true" />
          <div className="pp-wrap pp-hero-in">
            <div className="pp-hero-copy">
              <p className="pp-eyebrow">Legal · Star Software</p>
              <h1>Privacy policy</h1>
              <p className="pp-lead">
                How we collect, use, share and protect personal information across our websites, services and events, and the choices you
                have about it.
              </p>
              <dl className="pp-meta">
                <div>
                  <dt>Applies to</dt>
                  <dd>{SCOPE.join(' · ')}</dd>
                </div>
                <div>
                  <dt>Questions</dt>
                  <dd>
                    <a href={`mailto:${MAIL}`}>{MAIL}</a>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="pp-glance" aria-label="Our commitments">
              <p className="pp-glance-h">
                <ShieldCheck size={16} aria-hidden="true" />
                Our commitments
              </p>
              <ul>
                {COMMITMENTS.map(([title, text]) => (
                  <li key={title}>
                    <span aria-hidden="true">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <div>
                      <b>{title}</b>
                      <small>{text}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>

        <div className="pp-wrap pp-body">
          <aside className="pp-toc" aria-label="Contents">
            <p className="pp-toc-h">
              Contents
              <em>{Math.round(progress * 100)}%</em>
            </p>
            <span className="pp-toc-track" aria-hidden="true">
              <i style={{ transform: `scaleX(${progress})` }} />
            </span>
            <ol>
              {PRIVACY.sections.map((s) => (
                <li key={s.n}>
                  <a href={`#s${s.n}`} className={active === `s${s.n}` ? 'is-on' : undefined}>
                    <span>{s.n.padStart(2, '0')}</span>
                    {s.title.replace(/\?$/, '')}
                  </a>
                </li>
              ))}
            </ol>
            <div className="pp-toc-tools">
              <button type="button" onClick={() => window.print()}>
                <Printer size={15} aria-hidden="true" />
                Print or save as PDF
              </button>
              <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <ArrowUp size={15} aria-hidden="true" />
                Back to top
              </a>
            </div>
          </aside>

          <article className="pp-doc" ref={docRef}>
            <div className="pp-note">
              <p className="pp-note-k">Note</p>
              <p>{PRIVACY.note}</p>
            </div>
            <div className="pp-intro">
              <Blocks blocks={PRIVACY.intro} />
            </div>
            {PRIVACY.sections.map((s) => (
              <section key={s.n} id={`s${s.n}`} className="pp-sec" aria-labelledby={`s${s.n}-h`}>
                <p className="pp-sec-n">Section {s.n.padStart(2, '0')}</p>
                <h2 id={`s${s.n}-h`}>{s.title}</h2>
                <Blocks blocks={s.blocks} />
              </section>
            ))}
          </article>
        </div>

        <section className="pp-wrap pp-contact" aria-labelledby="pp-contact-h">
          <div className="pp-contact-in">
            <div className="pp-contact-copy">
              <p className="pp-eyebrow">Privacy requests</p>
              <h2 id="pp-contact-h">Questions about your data?</h2>
              <p>Ask to see, update or delete what we hold about you, or raise a concern. We respond within 30 days.</p>
              <a className="pp-btn" href={`mailto:${MAIL}?subject=${encodeURIComponent('Privacy request')}`}>
                Send a privacy request
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>
            <ul className="pp-contact-list">
              <li>
                <span>
                  <Mail size={17} aria-hidden="true" />
                </span>
                <div>
                  <small>Email</small>
                  <a href={`mailto:${MAIL}`}>{MAIL}</a>
                </div>
              </li>
              <li>
                <span>
                  <Phone size={17} aria-hidden="true" />
                </span>
                <div>
                  <small>Phone</small>
                  <a href="tel:+12543261661">{PHONE}</a>
                </div>
              </li>
              <li>
                <span>
                  <MapPin size={17} aria-hidden="true" />
                </span>
                <div>
                  <small>Post</small>
                  <p>Star Software, 35, Sector A, Govindpura Industrial Area, Bhopal, Madhya Pradesh 462023, India</p>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
