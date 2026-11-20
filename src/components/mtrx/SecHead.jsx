import { Eyebrow } from '../landing/LandingParts';

// One section head for the whole MTR page, in the extraction demo's style:
// the "— label" eyebrow and the headline on the left, the supporting line
// (and anything else passed as children) on the right.
export default function SecHead({ id, label, title, accent, lead, dark = false, children }) {
  return (
    <div className="mxk-head">
      <div>
        <Eyebrow dark={dark}>{label}</Eyebrow>
        <h2 id={id} className={`mx-h2${dark ? ' mx-h2--light' : ''}`} data-reveal>
          {title} {accent && <span>{accent}</span>}
        </h2>
      </div>
      {(lead || children) && (
        <div className="mxk-side" data-reveal style={{ '--rv-delay': '80ms' }}>
          {lead && <p className="mx-lead">{lead}</p>}
          {children}
        </div>
      )}
    </div>
  );
}
