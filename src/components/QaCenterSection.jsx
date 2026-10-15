import React from 'react';
import { ArrowRight, ClipboardCheck, Download, FileText, FlaskConical, ShieldCheck } from 'lucide-react';
import { QA_RESOURCES } from '../data/qaResources';
import { SectionHead } from './ResourceSections';
import './ResourceExtras.css';

// Star Software's QA Engineering Resource Center: free PDF guides and
// checklists hosted on starsoftware.co. Written for someone new to it: a
// plain explanation of what the documents are for, then each one led by the
// task it helps with, the official document name second.

// The task each document helps with, in plain words, and what kind of
// document it is. Matched on the title, so a renamed or new PDF still shows.
const TASKS = [
  { match: /EN\s*10204/i, task: 'Check an EN 10204 3.1 inspection certificate', kind: 'Guide', Icon: ShieldCheck },
  { match: /A36/i, task: 'Validate an ASTM A36 mill test report (MTR)', kind: 'Checklist', Icon: ClipboardCheck },
  { match: /A572/i, task: 'Inspect incoming ASTM A572 Grade 50 steel', kind: 'Checklist', Icon: ClipboardCheck },
  { match: /heat number/i, task: 'Verify heat numbers for traceability', kind: 'Guide', Icon: ShieldCheck },
  { match: /chemical/i, task: 'Look up what each element in an MTR means', kind: 'Reference chart', Icon: FlaskConical },
];

function describe(resource) {
  const hit = TASKS.find((item) => item.match.test(resource.title));
  if (hit) return hit;
  const kind = /checklist/i.test(resource.title) ? 'Checklist' : /chart|reference/i.test(resource.title) ? 'Reference chart' : 'Guide';
  return { task: resource.title, kind, Icon: FileText };
}

const AUDIENCE = ['Quality engineers', 'Receiving inspectors', 'Purchasing teams'];

export default function QaCenterSection() {
  if (!QA_RESOURCES.length) return null;
  return (
    <section id="qa-center" className="rs-section" aria-labelledby="rx-qa-heading">
      <SectionHead
        id="rx-qa-heading"
        eyebrow="QA engineering resource center"
        title="Free checklists for checking steel paperwork"
      />

      <div className="rx-qa-layout">
        <aside className="rx-qa-explain" aria-label="About these guides">
          <p className="rx-qa-explain-label">What&rsquo;s this?</p>
          <p className="rx-qa-explain-text">
            When steel arrives, its paperwork — <strong>mill test reports (MTRs)</strong> and{' '}
            <strong>inspection certificates</strong> — has to be checked against standards like ASTM and EN
            before the material is accepted. These free guides walk you through those checks.
          </p>

          <p className="rx-qa-explain-label">Made for</p>
          <ul className="rx-qa-audience">
            {AUDIENCE.map((who) => (
              <li key={who}>{who}</li>
            ))}
          </ul>

          <p className="rx-qa-explain-label">How to use them</p>
          <ol className="rx-qa-steps">
            <li>Find the check you need to do.</li>
            <li>Download the PDF — free, no sign-up.</li>
            <li>
              Checking hundreds a month?{' '}
              <a href="/#demo" className="rx-qa-steps-link">
                Star Software automates these checks <ArrowRight size={14} aria-hidden="true" />
              </a>
            </li>
          </ol>
        </aside>

        <ul className="rx-qa-list">
          {QA_RESOURCES.map((resource) => {
            const { task, kind, Icon } = describe(resource);
            return (
              <li key={resource.id} className="rx-qa-row">
                <span className="rx-qa-row-icon" aria-hidden="true">
                  <Icon size={22} />
                </span>
                <div className="rx-qa-row-text">
                  <h3 className="rx-qa-row-task">{task}</h3>
                  <p className="rx-qa-row-doc">
                    <span className="rx-qa-row-kind">{kind}</span>
                    {resource.title}
                  </p>
                  <p className="rx-qa-row-desc">{resource.description}</p>
                </div>
                <a
                  className="rx-qa-row-download"
                  href={resource.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Download ${resource.title} (PDF, opens in a new tab)`}
                >
                  <Download size={17} aria-hidden="true" />
                  <span>Download PDF</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
