import { Check, Clock, Video } from 'lucide-react';
import starLogo from '../../assets/star-software-logo.png';

// The dark panel beside the demo form (over the page and on /book-a-demo):
// what the call is and what it covers.
export default function DemoAside() {
  return (
    <aside className="dm-aside">
      <span className="dm-aside-glow" aria-hidden="true" />
      <img className="dm-aside-logo" src={starLogo} alt="Star Software" />
      <p className="dm-aside-kicker">Live product demo</p>
      <p className="dm-aside-title">See your own documents processed, start to finish.</p>
      <ul className="dm-aside-list">
        <li>
          <Check size={15} strokeWidth={2.5} aria-hidden="true" />
          Extraction from your MTRs, COAs, invoices or RFQs
        </li>
        <li>
          <Check size={15} strokeWidth={2.5} aria-hidden="true" />
          Checks against your specs and business rules
        </li>
        <li>
          <Check size={15} strokeWidth={2.5} aria-hidden="true" />
          Hand-off into the ERP you already run
        </li>
      </ul>
      <div className="dm-aside-meta">
        <span>
          <Clock size={15} aria-hidden="true" /> 15 minutes
        </span>
        <span>
          <Video size={15} aria-hidden="true" /> Video call
        </span>
      </div>
    </aside>
  );
}
