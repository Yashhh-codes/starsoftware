import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Check, Clock, Mail, MessageSquareText, Video } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CONTACT_URL, DEMO_PATH, LEAD_STORAGE_KEY, SCHEDULER_URL } from '../data/demo';
import { splitName } from '../utils/hubspot';
import '../components/demo/demo.css';

// The details from the form: passed along with the page change, or kept in
// this tab's storage so a reload still has them. A direct visit has none.
function readLead(state) {
  if (state?.lead) return state.lead;
  try {
    return JSON.parse(sessionStorage.getItem(LEAD_STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

// The scheduler's address with the visitor's name and email filled in:
// Calendly and HubSpot meetings each take them by their own names.
function schedulerSrc(lead) {
  const url = new URL(SCHEDULER_URL);
  const set = (key, value) => value && url.searchParams.set(key, value);
  if (url.hostname.endsWith('calendly.com')) {
    set('embed_domain', window.location.hostname);
    set('embed_type', 'Inline');
    set('hide_gdpr_banner', '1');
    set('hide_event_type_details', '1');
    set('primary_color', '0055ff');
    set('name', lead?.name);
    set('email', lead?.email);
  } else {
    const { first, last } = splitName(lead?.name || '');
    set('embed', 'true');
    set('firstName', first);
    set('lastName', last);
    set('email', lead?.email);
  }
  return url.toString();
}

// The scheduler reports how tall its content is (Calendly as
// "calendly.page_height", HubSpot meetings as meetingsHeight), so the frame
// can match it and the calendar never scrolls inside the page. The small
// heights sent while it loads are ignored.
function useSchedulerHeight() {
  const [height, setHeight] = useState(null);
  useEffect(() => {
    const onMessage = (event) => {
      const { origin, data } = event;
      let reported = null;
      if (origin === 'https://calendly.com' && data?.event === 'calendly.page_height') reported = parseInt(data.payload?.height, 10);
      if (origin.startsWith('https://') && origin.endsWith('.hubspot.com') && data?.meetingsHeight) reported = Number(data.meetingsHeight);
      if (reported >= 400) setHeight(reported);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);
  return height;
}

// Step two with a calendar: a summary of the request beside the scheduler.
function Scheduler({ lead, firstName }) {
  const src = useMemo(() => schedulerSrc(lead), [lead]);
  const height = useSchedulerHeight();
  return (
    <div className="dm-book">
      <aside className="dm-summary">
        <span className="dm-aside-glow" aria-hidden="true" />
        <div className="dm-progress dm-progress--dark" aria-label="Step 2 of 2: pick a time">
          <span className="dm-progress-label">
            Step 2 <i>of 2</i>
          </span>
          <span className="dm-progress-bar is-full" aria-hidden="true">
            <span />
          </span>
        </div>
        <h1 className="dm-summary-title">{firstName ? `Almost there, ${firstName}.` : 'Pick a time for your demo.'}</h1>
        <p className="dm-summary-text">Choose a slot in the calendar to confirm your demo.</p>

        <dl className="dm-summary-meta">
          <div>
            <dt>
              <Clock size={15} aria-hidden="true" /> Duration
            </dt>
            <dd>15 minutes</dd>
          </div>
          <div>
            <dt>
              <Video size={15} aria-hidden="true" /> Where
            </dt>
            <dd>Video call, link in your invite</dd>
          </div>
          {lead?.email && (
            <div>
              <dt>
                <Mail size={15} aria-hidden="true" /> Invite to
              </dt>
              <dd>{lead.email}</dd>
            </div>
          )}
        </dl>

        <ol className="dm-timeline">
          <li className="is-done">
            <span>
              <Check size={12} strokeWidth={3} aria-hidden="true" />
            </span>
            Details received
          </li>
          <li className="is-on">
            <span>2</span>
            Pick a time that suits you
          </li>
          <li>
            <span>3</span>
            Calendar invite lands in your inbox
          </li>
        </ol>
      </aside>

      <div className="dm-calendar">
        <iframe
          src={src}
          title="Pick a time for your Star Software demo"
          loading="eager"
          style={height ? { height: `${height}px` } : undefined}
        />
      </div>
    </div>
  );
}

// Without a calendar: what happens next. It only says the team will be in
// touch when HubSpot took the request; otherwise (not connected yet, or it
// failed) it points to the contact page, so no request is lost unseen. A
// visit with no request at all is pointed to the form.
function Confirmation({ lead, firstName }) {
  if (!lead) {
    return (
      <div className="dm-confirm">
        <h1 className="dm-page-title">Book a demo</h1>
        <p className="dm-page-text">Tell us who you are and our team will get in touch to arrange a time.</p>
        <div className="dm-confirm-actions">
          <Link className="dm-submit dm-btn" to={DEMO_PATH}>
            Request a demo <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  if (lead.sent) {
    return (
      <div className="dm-confirm">
        <span className="dm-confirm-icon is-done" aria-hidden="true">
          <Check size={26} strokeWidth={2.5} />
        </span>
        <h1 className="dm-page-title">Thanks, {firstName}. We&rsquo;ve got your request.</h1>
        <p className="dm-page-text">
          Our team will be in touch at <strong>{lead.email}</strong> to arrange a time for your demo.
        </p>
        <div className="dm-confirm-actions">
          <Link className="dm-btn dm-btn--ghost" to="/resources">
            Browse resources while you wait
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dm-confirm">
      <span className="dm-confirm-icon" aria-hidden="true">
        <MessageSquareText size={26} />
      </span>
      <h1 className="dm-page-title">Thanks, {firstName}. One more step.</h1>
      <p className="dm-page-text">
        Please send us a quick message through our contact page, and our team will get back to you to arrange a time
        for your demo.
      </p>
      <div className="dm-confirm-actions">
        <a className="dm-submit dm-btn" href={CONTACT_URL}>
          Go to the contact page <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

// /book-a-demo/thank-you: after the form. Kept out of search results; it
// only makes sense after the form.
export default function DemoThankYou() {
  const { state } = useLocation();
  const lead = useMemo(() => readLead(state), [state]);
  const first = lead ? splitName(lead.name).first : '';
  const firstName = first.charAt(0).toUpperCase() + first.slice(1);

  useEffect(() => {
    const previous = document.title;
    document.title = SCHEDULER_URL ? 'Pick a time for your demo | Star Software' : 'Thank you | Star Software';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => {
      document.title = previous;
      robots.remove();
    };
  }, []);

  return (
    <div className="dm-page">
      <Navbar variant="solid" />
      <main className={`dm-page-main dm-thanks${SCHEDULER_URL ? ' dm-thanks--book' : ' dm-thanks--note'}`}>
        {SCHEDULER_URL ? <Scheduler lead={lead} firstName={firstName} /> : <Confirmation lead={lead} firstName={firstName} />}
      </main>
      <Footer />
    </div>
  );
}
