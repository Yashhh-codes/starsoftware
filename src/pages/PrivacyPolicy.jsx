import { Fragment, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, BellOff, ChevronRight, Clock3, EyeOff, Mail, MapPin, Phone, Printer, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import starLogo from '../assets/star-software-logo.png';
import { PRIVACY } from '../data/privacyPolicy';
import './PrivacyPolicy.css';

const MAIL = 'info@starsoftware.co';
const PHONE = '+1 (254) 326-1661';

// The commitments in the band under the header, each from the policy's
// own words.
const COMMITMENTS = [
  [EyeOff, 'Never resold', 'Not data about you, nor data from your uploads.'],
  [ShieldCheck, 'Kept secure', 'Technical and organizational safeguards.'],
  [Clock3, '30-day replies', 'To every request about your data.'],
  [BellOff, 'Opt out anytime', 'Unsubscribe from any marketing email.'],
];


const WORDS = JSON.stringify(PRIVACY).split(/\s+/).length;
const READ_MIN = Math.max(1, Math.round(WORDS / 230));


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
          <div className="pp-wrap pp-hero-in">
            <div className="pp-hero-copy">
              <nav className="pp-crumbs" aria-label="Breadcrumb">
                <a href="/">Home</a>
                <ChevronRight size={14} aria-hidden="true" />
                <span>Legal</span>
                <ChevronRight size={14} aria-hidden="true" />
                <span aria-current="page">Privacy policy</span>
              </nav>
              <h1>Privacy policy</h1>
              <p className="pp-lead">
                How Star Software collects, uses, shares and protects personal information across our websites, services and events, and the
                choices you have about it.
              </p>
              <dl className="pp-facts">
                <div>
                  <dt>Applies to</dt>
                  <dd>
                    starsoftware.co
                    <br />
                    platform.starsoftware.co
                  </dd>
                </div>
                <div>
                  <dt>Length</dt>
                  <dd>
                    {PRIVACY.sections.length} sections
                    <br />
                    {READ_MIN} min read
                  </dd>
                </div>
                <div>
                  <dt>Contact</dt>
                  <dd>
                    <a href={`mailto:${MAIL}`}>{MAIL}</a>
                  </dd>
                </div>
              </dl>
              <a className="pp-btn" href="#s1">
                Read the policy
                <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>

            <div className="pp-paper" aria-hidden="true">
              <span className="pp-paper-sheet pp-paper-sheet--3" />
              <span className="pp-paper-sheet pp-paper-sheet--2" />
              <div className="pp-paper-sheet pp-paper-front">
                <div className="pp-paper-top">
                  <img src={starLogo} alt="" />
                  <span>Legal</span>
                </div>
                <p className="pp-paper-title">Privacy Policy</p>
                <p className="pp-paper-sub">Websites, services and events</p>
                <ol>
                  {PRIVACY.sections.slice(0, 7).map((sec) => (
                    <li key={sec.n}>
                      <span>{sec.n.padStart(2, '0')}</span>
                      <b>{sec.title.replace(/\?$/, '')}</b>
                    </li>
                  ))}
                </ol>
                <p className="pp-paper-more">+ {PRIVACY.sections.length - 7} more sections</p>
                <div className="pp-paper-foot">
                  <span />
                  <small>info@starsoftware.co</small>
                </div>
              </div>
              <div className="pp-seal">
                <span>
                  <ShieldCheck size={20} strokeWidth={2} />
                </span>
                <div>
                  <b>Never resold</b>
                  <small>Your data belongs to you</small>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="pp-band">
          <ul className="pp-wrap pp-pillars" aria-label="Our commitments">
            {COMMITMENTS.map(([Icon, title, text]) => (
              <li key={title}>
                <span aria-hidden="true">
                  <Icon size={18} />
                </span>
                <div>
                  <b>{title}</b>
                  <small>{text}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>

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
