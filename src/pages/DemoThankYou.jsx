import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LEAD_STORAGE_KEY, SCHEDULER_URL } from '../data/demo';
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

// /book-a-demo/thank-you: step two, booking a slot. Kept out of search
// results; it only makes sense after the form.
export default function DemoThankYou() {
  const { state } = useLocation();
  const lead = useMemo(() => readLead(state), [state]);
  const src = useMemo(() => schedulerSrc(lead), [lead]);
  const firstName = lead ? splitName(lead.name).first : '';
  const height = useSchedulerHeight();

  useEffect(() => {
    const previous = document.title;
    document.title = 'Pick a time for your demo | Star Software';
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
      <main className="dm-page-main dm-thanks">
        <header className="dm-thanks-head">
          <ol className="dm-steps" aria-label="Booking steps">
            <li className="is-done">
              <span>
                <Check size={12} strokeWidth={3} aria-hidden="true" />
              </span>
              Your details
            </li>
            <li className="is-on" aria-current="step">
              <span>2</span> Pick a time
            </li>
          </ol>
          <h1 className="dm-page-title">{firstName ? `Thanks, ${firstName}. Now pick a time.` : 'Pick a time for your demo'}</h1>
          <p className="dm-page-text">
            Choose a slot that suits you below. You&rsquo;ll get a calendar invite by email with the details.
          </p>
        </header>
        <div className="dm-scheduler">
          <iframe
            src={src}
            title="Book a time with Star Software"
            loading="eager"
            style={height ? { height: `${height}px` } : undefined}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
