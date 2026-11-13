import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { DEMO_PATH } from '../data/demo';
import './Footer.css';

const LOGO = '/home/img/star-software-logo-color.png';
const PHONE = '+1 (254) 326-1661';
const MAIL = 'info@starsoftware.co';

// The site's pages go through the router; pages on starsoftware.co are
// plain links.
const COLUMNS = [
  {
    heading: 'Agents',
    links: [
      { label: 'MTR verification', to: '/mtr-automation' },
      { label: 'COA verification', to: '/coa-automation' },
      { label: 'RFQ to quote', to: '/rfq-to-quote' },
      { label: 'Accounts payable', to: '/ap-automation' },
      { label: 'Cash application', to: '/cash-application' },
      { label: 'Supplier onboarding', to: '/supplier-onboarding-automation' },
      { label: 'Procurement', to: '/procurement-automation' },
      { label: 'AR automation', to: '/ar-automation' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Customer stories', to: '/resources#stories' },
      { label: 'Blog', to: '/resources#library' },
      { label: 'QA checklists', to: '/resources#qa-center' },
      { label: 'FAQs', to: '/resources#faqs' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About us', to: '/about-us' },
      { label: 'How we work', href: 'https://starsoftware.co/how-we-work/' },
      { label: 'Careers', href: 'https://starsoftware.co/career/' },
      { label: 'Contact', href: 'https://starsoftware.co/contact/' },
    ],
  },
];

const OFFICES = [
  { country: 'Canada', lines: ['4333 St. Catherine West, Suite 201', 'Montreal, Quebec H3Z 1P9'] },
  { country: 'India', lines: ['35, Sector A, Govindpura Industrial Area', 'Bhopal, Madhya Pradesh 462023'] },
];

const SOCIAL = [
  {
    label: 'Star Software on LinkedIn',
    href: 'https://www.linkedin.com/company/starsoftware-official/',
    icon: (
      <path d="M6.94 8.5H3.56V20h3.38zM5.25 3a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92M20.5 13.4c0-3.17-1.69-4.65-3.95-4.65-1.82 0-2.64 1-3.1 1.71V8.5H10.1c.04.94 0 11.5 0 11.5h3.36v-6.42c0-.34.02-.69.13-.93.27-.69.9-1.4 1.95-1.4 1.37 0 1.92 1.05 1.92 2.58V20h3.04z" fill="currentColor" />
    ),
  },
  {
    label: 'Star Software on YouTube',
    href: 'https://www.youtube.com/@StarSoftware-AI',
    icon: (
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.78 2 12 2 12s0 3.22.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.73 19 12 19 12 19s6.27 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.22 22 12 22 12s0-3.22-.4-4.8M10 15V9l5.2 3z" fill="currentColor" />
    ),
  },
];

function FooterLink({ link }) {
  return link.to ? (
    <Link className="ft-link" to={link.to}>
      {link.label}
    </Link>
  ) : (
    <a className="ft-link" href={link.href}>
      {link.label}
    </a>
  );
}

// The site footer: a closing call to action, then the company, its links
// and offices, then the legal line.
export default function Footer() {
  return (
    <footer className="ft">
      <div className="ft-in">
        <div className="ft-cta">
          <div>
            <p className="ft-cta-k">Ready when you are</p>
            <p className="ft-cta-h">See Star read your own documents.</p>
          </div>
          <a className="ft-cta-btn" href={DEMO_PATH}>
            Book a demo <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>

        <div className="ft-grid">
          <div className="ft-brand">
            <Link to="/" aria-label="Star Software home">
              <img src={LOGO} alt="Star Software" width="200" height="44" />
            </Link>
            <p>AI agents that verify documents, catch discrepancies and act across your workflows and ERP.</p>
            <ul className="ft-contact">
              <li>
                <a href={`tel:${PHONE.replace(/[^\d+]/g, '')}`}>
                  <span className="ft-ic"><Phone size={14} aria-hidden="true" /></span>
                  {PHONE}
                </a>
              </li>
              <li>
                <a href={`mailto:${MAIL}`}>
                  <span className="ft-ic"><Mail size={14} aria-hidden="true" /></span>
                  {MAIL}
                </a>
              </li>
            </ul>
            <div className="ft-social">
              {SOCIAL.map((s) => (
                <a key={s.href} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((column) => (
            <nav className="ft-col" key={column.heading} aria-label={column.heading}>
              <p className="ft-h">{column.heading}</p>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="ft-col ft-offices">
            <p className="ft-h">Offices</p>
            {OFFICES.map((office) => (
              <address key={office.country}>
                <span className="ft-country">
                  <MapPin size={13} aria-hidden="true" />
                  {office.country}
                </span>
                {office.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            ))}
          </div>
        </div>

        <div className="ft-bottom">
          <p>© 2012–{new Date().getFullYear()} Star Software. All rights reserved.</p>
          <a href="https://starsoftware.co/privacy-policy/">Privacy policy</a>
        </div>
      </div>
      <p className="ft-mark" aria-hidden="true">
        Star Software
      </p>
    </footer>
  );
}
