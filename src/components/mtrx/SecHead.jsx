import { createContext, useContext } from 'react';
import { Eyebrow } from '../landing/LandingParts';

// How a page sets its section heads: 'split' (the default) or
// 'statement', one sentence in ink with its second half in slate, the way
// an editorial page sets them.
export const HeadStyle = createContext('split');

// One section head for the MTR and COA pages.
// split: the "— label" eyebrow and the headline on the left, the
// supporting line (and anything else passed as children) on the right.
// statement: `dark` (title and accent by default) in ink, `grey` (the lead
// by default) in slate, then `below` and any children underneath.
export default function SecHead({ id, label, title, accent, lead, dark = false, children, statement }) {
  const style = useContext(HeadStyle);

  if (style === 'statement') {
    const ink = statement?.dark ?? [title, accent].filter(Boolean).join(' ');
    const slate = statement && 'grey' in statement ? statement.grey : lead;
    const below = statement?.below;
    return (
      <div className="mx-st">
        <h2 id={id} className="mx-st-h" data-reveal>
          {ink}
          {slate && <span> {slate}</span>}
        </h2>
        {(below || children) && (
          <div className="mx-st-below" data-reveal style={{ '--rv-delay': '80ms' }}>
            {below && <p className="mx-st-lead">{below}</p>}
            {children}
          </div>
        )}
      </div>
    );
  }

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
