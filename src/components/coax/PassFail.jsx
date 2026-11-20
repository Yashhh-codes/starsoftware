import { useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useLoop } from '../mtrx/motion';
import SecHead from '../mtrx/SecHead';
import { C_PASSFAIL } from '../../data/coaX';

const F = C_PASSFAIL.findings.length; // 4
// 0: the supplier's COA says Pass · 1: Star starts its own review ·
// 2..5: a finding each, pinned to its line · 6: the stamp is overruled ·
// then it rests.
const REVIEW = 1;
const OVERRULE = REVIEW + F + 1;
const LENGTH = OVERRULE + 6;

function Pin({ n, tick }) {
  if (!n) return null;
  return <span className={`cxp-pin${tick >= REVIEW + n ? ' is-on' : ''}${C_PASSFAIL.findings[n - 1][0] === 'warn' ? ' is-warn' : ''}`}>{n}</span>;
}

export default function PassFail() {
  const ref = useRef(null);
  const [tick] = useLoop(ref, { ms: 1100, length: LENGTH, rest: LENGTH - 1, threshold: 0.35 });
  const { cert } = C_PASSFAIL;
  const overruled = tick >= OVERRULE;

  return (
    <section id="pass-fail" className="mx-sec cxp" aria-labelledby="cxp-title">
      <div className="mt-wrap">
        <SecHead id="cxp-title" label="Pass is not release" title={C_PASSFAIL.title} accent={C_PASSFAIL.titleEnd} lead={C_PASSFAIL.lead} />

        <div ref={ref} className={`cxp-board${overruled ? ' is-over' : ''}${tick >= REVIEW ? ' is-review' : ''}`} data-reveal="scale" style={{ '--rv-delay': '120ms' }}>
          <div className="cxp-coa">
            <div className="cxp-coa-top">
              <b>{cert.supplier}</b>
              <em>Certificate of analysis</em>
            </div>
            <dl className="cxp-fields">
              {cert.fields.map(([k, v, pin]) => (
                <div key={k} className={pin && tick >= REVIEW + pin ? 'is-hit' : ''}>
                  <dt>{k}</dt>
                  <dd>
                    {v}
                    <Pin n={pin} tick={tick} />
                  </dd>
                </div>
              ))}
            </dl>
            <div className="cxp-tests">
              <p className="cxp-th">
                <span>Test</span>
                <span>Limit</span>
                <span>Result</span>
              </p>
              {cert.tests.map(([t, lim, res, pin]) => (
                <p key={t} className={`${pin && tick >= REVIEW + pin ? 'is-hit' : ''}${pin === 1 ? ' is-missing' : ''}`}>
                  <span>{t}</span>
                  <span>{lim}</span>
                  <b>
                    {res}
                    <Pin n={pin} tick={tick} />
                  </b>
                </p>
              ))}
            </div>
            <div className="cxp-qa">
              <small>Quality assurance</small>
              <span className="cxp-sig" />
            </div>
            <span className={`cxp-stamp cxp-stamp--pass${overruled ? ' is-struck' : ''}`} aria-hidden="true">
              Pass
            </span>
            <span className={`cxp-stamp cxp-stamp--hold${overruled ? ' is-on' : ''}`} aria-hidden="true">
              Hold for QA review
            </span>
            <i className={`cxp-scan${tick >= REVIEW && !overruled ? ' is-on' : ''}`} aria-hidden="true" />
          </div>

          <div className="cxp-side">
            <div className="cxp-says">
              <span className="cxp-says-a">
                <small>The supplier says</small>
                <b>Pass</b>
              </span>
              <span className="cxp-says-arrow" aria-hidden="true" />
              <span className={`cxp-says-b${overruled ? ' is-on' : ''}`}>
                <small>Star says</small>
                <b>{overruled ? 'Hold for QA' : tick >= REVIEW ? 'Reviewing…' : '—'}</b>
              </span>
            </div>
            <ol className="cxp-find">
              {C_PASSFAIL.findings.map(([sev, k, v], i) => (
                <li key={k} className={`is-${sev}${tick >= REVIEW + i + 1 ? ' is-on' : ''}`}>
                  <span className="cxp-n">{i + 1}</span>
                  <div>
                    <b>{k}</b>
                    <p>{v}</p>
                  </div>
                  {sev === 'warn' ? <AlertTriangle size={15} aria-hidden="true" /> : <X size={15} strokeWidth={3} aria-hidden="true" />}
                </li>
              ))}
            </ol>
            <p className="cxp-close">{C_PASSFAIL.close}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
