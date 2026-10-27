import React from 'react';
import { Bot, Check, CircleHelp, FileText, Mail, MailCheck, Send, TriangleAlert, UserCheck } from 'lucide-react';
import { ON_CERTIFICATE, PRODUCT, SPEC, TESTS } from './sample';

// The workflow console's scenes (WorkflowTour), one per step, on the same
// illustrative certificate as the hero: values found on the COA, measured
// against the specification's ranges, the exceptions emailed to the
// reviewer, and each result sent on to its next step. Each plays from the
// start when its step comes round (ts-* styles in CoaLanding.css).

const WITHIN = TESTS.filter((t) => t.tone === 'ok');
const EXCEPTIONS = TESTS.filter((t) => t.tone !== 'ok');

function ExceptionIcon({ tone, size = 13 }) {
  return tone === 'missing' ? <CircleHelp size={size} /> : <TriangleAlert size={size} />;
}

// 01 Extract: each value is boxed where it sits on the certificate and
// numbered, and the same number lists it as captured.
function ExtractScene() {
  return (
    <div className="ts ts--extract">
      <div className="ts-doc">
        <span className="ts-doc-kicker">Certificate of analysis</span>
        <span className="ts-doc-title">{PRODUCT}</span>
        <span className="ts-doc-meta">
          <span className="ts-bar" style={{ width: '30%' }} />
          <span className="ts-bar" style={{ width: '20%' }} />
        </span>
        <div className="ts-doc-table">
          <span className="ts-doc-th">Test</span>
          <span className="ts-doc-th ts-doc-th--limit">Limit</span>
          <span className="ts-doc-th">Result</span>
          {ON_CERTIFICATE.map((test, i) => (
            <React.Fragment key={test.key}>
              <span>{test.test}</span>
              <span className="ts-doc-limit">{test.limit}</span>
              <span className="ts-doc-hit" style={{ '--d': i }}>
                {test.value}
                <i className="ts-num">{i + 1}</i>
              </span>
            </React.Fragment>
          ))}
        </div>
        <span className="ts-doc-stamp">Conforms</span>
        <span className="ts-scan" />
      </div>

      <div className="ts-list">
        <p className="ts-label">Captured values</p>
        <ul>
          {ON_CERTIFICATE.map((test, i) => (
            <li key={test.key} style={{ '--d': i }}>
              <i className="ts-num">{i + 1}</i>
              <span className="ts-list-field">{test.test}</span>
              <b>{test.value}</b>
              <span className="ts-src">p. 1</span>
            </li>
          ))}
        </ul>
        <p className="ts-foot ts-foot--ok">
          <Check size={13} strokeWidth={3} /> {ON_CERTIFICATE.length} values captured
        </p>
      </div>
    </div>
  );
}

// Where each requirement's range and each result sit on their gauge (%),
// for the illustration's figures.
const GAUGES = {
  assay: { from: 25, to: 75, at: 35 },
  water: { from: 0, to: 62.5, at: 77.5 },
  ash: { from: 0, to: 62.5, at: 37.5 },
  pb: { from: 0, to: 62.5, at: 25 },
  fe: { from: 0, to: 62.5, at: null },
};

const VERDICTS = { ok: 'Within', range: 'Out of range', missing: 'Missing' };

// 02 Verify: every result measured against the range the specification
// allows; water lands outside its range, iron has no result to place.
function VerifyScene() {
  return (
    <div className="ts ts--verify">
      <div className="ts-head">
        <span className="ts-label">Checked against</span>
        <span className="ts-spec">{SPEC}</span>
        <span className="ts-legend">
          <i /> Required range
        </span>
      </div>
      <ul className="ts-gauges">
        {TESTS.map((test, i) => {
          const g = GAUGES[test.key];
          return (
            <li
              key={test.key}
              className={`ts-g is-${test.tone}`}
              style={{ '--d': i, '--from': `${g.from}%`, '--to': `${g.to}%`, '--at': `${g.at ?? 0}%` }}
            >
              <span className="ts-g-name">
                <b>{test.test}</b>
                <small>{test.req}</small>
              </span>
              <span className="ts-g-track">
                <span className="ts-g-band" />
                {test.value ? (
                  <span className="ts-g-mark">
                    <span className="ts-g-val">{test.value}</span>
                  </span>
                ) : (
                  <span className="ts-g-none">Not reported</span>
                )}
              </span>
              <span className="ts-g-verdict">
                {test.tone === 'ok' ? <Check size={12} strokeWidth={3} /> : <ExceptionIcon tone={test.tone} size={12} />}
                <span>{VERDICTS[test.tone]}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <p className="ts-foot">
        <span className="ts-dot ts-dot--ok" />
        {WITHIN.length} within spec
        <span className="ts-dot ts-dot--warn" />
        {EXCEPTIONS.length} need attention
      </p>
    </div>
  );
}

// 03 Review: the exceptions go to the defined person by email.
function ReviewScene() {
  return (
    <div className="ts ts--review">
      <div className="ts-mail">
        <div className="ts-mail-top">
          <span className="ts-mail-title">
            <Mail size={14} /> New message
          </span>
          <span className="ts-mail-state">
            <span className="ts-mail-draft">Draft</span>
            <span className="ts-mail-sent">
              <Check size={11} strokeWidth={3} /> Sent
            </span>
          </span>
        </div>
        <div className="ts-mail-row">
          <span className="ts-mail-k">To</span>
          <span className="ts-mail-to">
            <span className="ts-avatar">
              <UserCheck size={12} />
            </span>
            QA reviewer
            <small>Defined person</small>
          </span>
        </div>
        <div className="ts-mail-row">
          <span className="ts-mail-k">Subject</span>
          <span className="ts-mail-subject">COA exceptions · {PRODUCT}</span>
        </div>
        <ul className="ts-mail-items">
          {EXCEPTIONS.map((test, i) => (
            <li key={test.key} className={`is-${test.tone}`} style={{ '--d': i }}>
              <ExceptionIcon tone={test.tone} />
              <span className="ts-mail-item">
                <b>{test.test}</b>
                {test.value ? `${test.value} reported` : 'Not reported'}
              </span>
              <span className="ts-mail-req">Required {test.req}</span>
            </li>
          ))}
        </ul>
        <div className="ts-mail-foot">
          <span className="ts-src">
            <FileText size={12} /> Source: supplier COA, p. 1
          </span>
          <span className="ts-mail-send">
            Send <Send size={13} />
          </span>
        </div>
      </div>
      <span className="ts-plane" aria-hidden="true">
        <Send size={18} />
      </span>
      <span className="ts-toast">
        <MailCheck size={15} /> Delivered to QA reviewer
      </span>
    </div>
  );
}

// 04 Progress: results within spec go on to the automated step, the
// exceptions to the reviewer-led one.
function ProgressScene() {
  return (
    <div className="ts ts--progress">
      <span className="ts-node">
        <Check size={13} strokeWidth={3} /> Verified COA · {PRODUCT}
      </span>
      <span className="ts-fork" aria-hidden="true">
        <i className="ts-fork-dot ts-fork-dot--l" />
        <i className="ts-fork-dot ts-fork-dot--r" />
      </span>
      <div className="ts-paths">
        <div className="ts-path ts-path--auto">
          <span className="ts-path-head">
            <span className="ts-path-ic">
              <Bot size={17} />
            </span>
            <span>
              <b>Automated step</b>
              <small>{WITHIN.length} results within spec</small>
            </span>
          </span>
          <ul>
            {WITHIN.map((test, i) => (
              <li key={test.key} style={{ '--d': i }}>
                <Check size={12} strokeWidth={3} /> {test.test}
              </li>
            ))}
          </ul>
          <span className="ts-path-next">Next: automated</span>
        </div>
        <div className="ts-path ts-path--review">
          <span className="ts-path-head">
            <span className="ts-path-ic">
              <UserCheck size={17} />
            </span>
            <span>
              <b>Reviewer-led step</b>
              <small>{EXCEPTIONS.length} results need attention</small>
            </span>
          </span>
          <ul>
            {EXCEPTIONS.map((test, i) => (
              <li key={test.key} className={`is-${test.tone}`} style={{ '--d': i }}>
                <ExceptionIcon tone={test.tone} size={12} /> {test.test}
              </li>
            ))}
          </ul>
          <span className="ts-path-next">Next: QA reviewer</span>
        </div>
      </div>
    </div>
  );
}

export const SCENES = [ExtractScene, VerifyScene, ReviewScene, ProgressScene];

// What each scene shows, for screen readers.
export const SCENE_LABELS = [
  'Illustration: four results on a supplier COA are found, numbered and listed as captured values.',
  `Illustration: each result is placed on the range ${SPEC} allows. Water (KF) at 0.62 % is outside its range of at most 0.50 %, and iron is not reported.`,
  'Illustration: an email listing the two exceptions is sent to the QA reviewer, the defined person.',
  'Illustration: the three results within spec go on to the automated step, and the two exceptions to the reviewer-led step.',
];
