import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bot,
  BrainCircuit,
  ChartLine,
  ChevronDown,
  CircleCheck,
  Database,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  FlaskConical,
  GitCompareArrows,
  GraduationCap,
  Mail,
  MessageSquareMore,
  Network,
  Quote,
  Receipt,
  Route,
  ScanText,
  SearchX,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Stamp,
  Target,
  Timer,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  Workflow,
  Zap,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Eyebrow, useDocumentMeta } from '../components/landing/LandingParts';
import { gradient, Marked } from '../components/landing/Marked';
import { usePrefersReducedMotion, useReveal } from '../hooks/useMotion';
import {
  AGENTS,
  APPROACH,
  BELIEF,
  CAPABILITIES,
  CHALLENGE,
  CONTACT_URL,
  DEMO_URL,
  HERO,
  MISSION,
  OUTCOMES,
  photo,
  PHOTOS,
  SOLUTIONS,
  STORY,
} from '../data/about';
import './MtrLanding.css';
import './About.css';

// The About page (/about-us), from "NEW - About Star Software". It shares the
// landing pages' design language and the base styles of MtrLanding.css
// (scoped to .mtr-page, which this page carries too), with its own in
// About.css. Copy: src/data/about.js; photos from Unsplash.

// A photo from the set, at a few widths for the browser to choose from.
function Photo({ name, sizes, eager = false, className = '' }) {
  const { id, alt } = PHOTOS[name];
  return (
    <img
      className={className}
      src={photo(id, 1200)}
      srcSet={[600, 900, 1200, 1800].map((w) => `${photo(id, w)} ${w}w`).join(', ')}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

// An in-page link that glides to its section (stopping clear of the
// navbar, by its scroll-margin) and leaves the address as it is.
function scrollToSection(e) {
  const target = document.querySelector(e.currentTarget.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

// ---------------------------------------------------------------- Hero

const BAND_ICONS = [FlaskConical, Receipt, ShoppingCart, GraduationCap];

// The headline beside its promise, over a band of the places Star's work
// happens, joined by one line.
function Hero() {
  return (
    <section className="ab-hero" aria-labelledby="ab-hero-title">
      <div className="ab-hero-bg" aria-hidden="true" />
      <div className="mt-wrap">
        <p className="mt-chip ab-hero-chip" data-reveal>
          <Sparkles aria-hidden="true" />
          {HERO.eyebrow}
        </p>
        <div className="ab-hero-grid">
          <h1 id="ab-hero-title" className="ab-h1" data-reveal style={{ '--rv-delay': '80ms' }}>
            <Marked text={HERO.title} marks={[{ phrase: HERO.titleHighlight, render: gradient }]} />
          </h1>
          <div className="ab-hero-side" data-reveal style={{ '--rv-delay': '180ms' }}>
            <p className="ab-hero-text">{HERO.text}</p>
            <div className="mt-actions">
              <a className="mt-btn mt-btn--primary" href={CONTACT_URL}>
                {HERO.primaryCta}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className="mt-btn mt-btn--ghost" href="#solutions" onClick={scrollToSection}>
                {HERO.secondaryCta}
                <ChevronDown size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="ab-band-wrap">
        <ul className="ab-band" aria-label="Where Star works">
          {HERO.band.map((item, i) => {
            const Icon = BAND_ICONS[i];
            return (
              <li key={item.label} className="ab-band-item" data-reveal="scale" style={{ '--rv-delay': `${200 + i * 90}ms` }}>
                <Photo name={item.photo} sizes="(max-width: 760px) 50vw, 25vw" eager={i < 2} />
                <span className="ab-band-label">
                  <span className="ab-band-ic" aria-hidden="true">
                    <Icon size={14} />
                  </span>
                  {item.label}
                </span>
              </li>
            );
          })}
        </ul>
        <span className="ab-band-line" aria-hidden="true" />
      </div>
    </section>
  );
}

// --------------------------------------------------------------- Story

const STORY_ICONS = [ShoppingCart, Receipt, FileCheck2, FlaskConical, GraduationCap];

// The documents a business runs on, each with what it sets going.
function Story() {
  return (
    <section className="mt-sec ab-story" aria-labelledby="ab-story-title">
      <div className="mt-wrap ab-story-grid">
        <div className="ab-story-copy">
          <h2 id="ab-story-title" className="mt-h2 ab-h2-xl" data-reveal>
            <Marked text={STORY.title} marks={[{ phrase: 'information.', render: gradient }]} />
          </h2>
          <p className="ab-story-text" data-reveal style={{ '--rv-delay': '100ms' }}>
            {STORY.text}
          </p>
        </div>
        <ol className="ab-docs">
          {STORY.documents.map((d, i) => {
            const Icon = STORY_ICONS[i];
            return (
              <li key={d.doc} className="ab-doc" data-reveal style={{ '--rv-delay': `${i * 90}ms` }}>
                <span className="ab-doc-ic" aria-hidden="true">
                  <Icon size={19} />
                </span>
                <p className="ab-doc-text">
                  <b>{d.doc}</b> {d.role}
                </p>
                <span className="ab-doc-n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

// ----------------------------------------------------------- Challenge

const SOURCE_ICONS = [FileText, Mail, FileSpreadsheet, Truck, Database];
const WORK_ICONS = [ScanText, GitCompareArrows, ShieldCheck, SearchX, Stamp];

// The paperwork, with where its information is scattered pinned over it,
// beside what that costs the team.
function Challenge() {
  return (
    <section className="mt-sec mt-sec--soft ab-challenge" aria-labelledby="ab-challenge-title">
      <div className="mt-wrap ab-challenge-grid">
        <figure className="ab-scatter" data-reveal="scale">
          <Photo name="paperwork" sizes="(max-width: 1023px) 100vw, 45vw" />
          <span className="ab-scatter-shade" aria-hidden="true" />
          <ul className="ab-sources" aria-label="Where the information sits">
            {CHALLENGE.sources.map((s, i) => {
              const Icon = SOURCE_ICONS[i];
              return (
                <li key={s} className={`ab-source ab-source--${i + 1}`}>
                  <Icon size={14} aria-hidden="true" />
                  {s}
                </li>
              );
            })}
          </ul>
        </figure>
        <div className="ab-challenge-copy">
          <Eyebrow>{CHALLENGE.eyebrow}</Eyebrow>
          <h2 id="ab-challenge-title" className="mt-h2" data-reveal>
            <Marked text={CHALLENGE.title} marks={[{ phrase: 'The context and actions are not.', render: gradient }]} sentences />
          </h2>
          <p className="mt-lead" data-reveal style={{ '--rv-delay': '80ms' }}>
            {CHALLENGE.text}
          </p>
          <ul className="ab-work">
            {CHALLENGE.work.map((w, i) => {
              const Icon = WORK_ICONS[i];
              return (
                <li key={w} className="ab-work-item" data-reveal style={{ '--rv-delay': `${120 + i * 60}ms` }}>
                  <span className="ab-work-ic" aria-hidden="true">
                    <Icon size={15} />
                  </span>
                  {w}
                  <span className="ab-work-tag">Manual</span>
                </li>
              );
            })}
          </ul>
          <p className="ab-closing" data-reveal>
            <Timer size={18} aria-hidden="true" />
            {CHALLENGE.closing}
          </p>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------- Mission

function Mission() {
  return (
    <section className="mt-sec mt-sec--dark ab-mission" aria-labelledby="ab-mission-title">
      <div className="ab-mission-bg" aria-hidden="true">
        <span className="mt-orb mt-orb--a" />
        <span className="mt-orb mt-orb--b" />
      </div>
      <div className="mt-wrap">
        <h2 id="ab-mission-title" className="mt-h2 mt-h2--light ab-mission-title" data-reveal>
          {MISSION.title}
        </h2>
        <div className="ab-mission-grid">
          <p className="ab-mission-lead" data-reveal style={{ '--rv-delay': '80ms' }}>
            {MISSION.lead}
          </p>
          <p className="ab-mission-text" data-reveal style={{ '--rv-delay': '160ms' }}>
            {MISSION.text}
          </p>
        </div>
        <blockquote className="ab-quote" data-reveal="scale">
          <Quote size={28} className="ab-quote-mark" aria-hidden="true" />
          <p>
            <Marked text={MISSION.quote} marks={[{ phrase: 'intelligence drives action.', render: gradient }]} />
          </p>
        </blockquote>
      </div>
    </section>
  );
}

// ------------------------------------------------------------ Approach

const APPROACH_ICONS = [ScanText, GitCompareArrows, BrainCircuit, Workflow, Network];

// The five verbs, then the five ways Star does them, along one line.
function Approach() {
  const verbs = APPROACH.title.split(' ');
  return (
    <section className="mt-sec ab-approach" aria-labelledby="ab-approach-title">
      <div className="mt-wrap">
        <div className="mt-head mt-head--center ab-approach-head">
          <Eyebrow>{APPROACH.eyebrow}</Eyebrow>
          <h2 id="ab-approach-title" className="mt-h2 ab-verbs" data-reveal>
            {verbs.map((v, i) => (
              <React.Fragment key={v}>
                {i > 0 && ' '}
                <span className="ab-verb" style={{ '--i': i }}>
                  {v}
                </span>
              </React.Fragment>
            ))}
          </h2>
        </div>
        <ol className="ab-steps">
          <span className="ab-steps-line" aria-hidden="true" />
          {APPROACH.steps.map((s, i) => {
            const Icon = APPROACH_ICONS[i];
            return (
              <li key={s.title} className="ab-step" data-reveal style={{ '--rv-delay': `${i * 100}ms`, '--i': i }}>
                <span className="ab-step-node" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <span className="ab-step-n">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="ab-step-title">{s.title}</h3>
                <p className="ab-step-text">{s.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

// ----------------------------------------------------------- Solutions

const AREA_ICONS = { 'Manufacturing Quality': FlaskConical, Finance: Receipt, Procurement: ShoppingCart, Education: GraduationCap };

function SolutionCard({ item, feature = false, index }) {
  const Icon = AREA_ICONS[item.area];
  return (
    <article className={`ab-sol${feature ? ' ab-sol--feature' : ''}`} data-reveal style={{ '--rv-delay': `${index * 90}ms` }}>
      <div className="ab-sol-media">
        <Photo name={item.photo} sizes={feature ? '(max-width: 1023px) 100vw, 50vw' : '(max-width: 760px) 100vw, (max-width: 1023px) 50vw, 33vw'} />
        <span className="ab-sol-area">
          <Icon size={14} aria-hidden="true" />
          {item.area}
        </span>
      </div>
      <div className="ab-sol-body">
        <h3 className="ab-sol-title">{item.title}</h3>
        <p className="ab-sol-text">{item.text}</p>
        {item.links && (
          <div className="ab-sol-links">
            {item.links.map((l) => (
              <Link key={l.to} className="ab-sol-link" to={l.to}>
                {l.label}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function Solutions() {
  const [feature, ...rest] = SOLUTIONS.items;
  const { studio } = SOLUTIONS;
  return (
    <section id="solutions" className="mt-sec mt-sec--soft ab-solutions" aria-labelledby="ab-solutions-title">
      <div className="mt-wrap">
        <div className="ab-sol-head">
          <div>
            <Eyebrow>{SOLUTIONS.eyebrow}</Eyebrow>
            <h2 id="ab-solutions-title" className="mt-h2" data-reveal>
              <Marked text={SOLUTIONS.title} marks={[{ phrase: 'Beyond Individual Documents', render: gradient }]} />
            </h2>
          </div>
          <p className="mt-lead" data-reveal style={{ '--rv-delay': '80ms' }}>
            {SOLUTIONS.text}
          </p>
        </div>

        <div className="ab-sols">
          <SolutionCard item={feature} feature index={0} />
          {rest.map((item, i) => (
            <SolutionCard key={item.title} item={item} index={i + 1} />
          ))}
          <article className="ab-studio" data-reveal>
            <div className="ab-studio-body">
              <span className="ab-studio-area">
                <Workflow size={14} aria-hidden="true" />
                {studio.area}
              </span>
              <h3 className="ab-studio-title">{studio.title}</h3>
              <p className="ab-studio-text">{studio.text}</p>
              <ul className="ab-studio-parts" aria-label="What Workflow Studio brings together">
                {['Documents', 'AI agents', 'Business rules', 'People', 'Enterprise applications'].map((p, i) => (
                  <li key={p} style={{ '--i': i }}>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="ab-studio-media">
              <Photo name={studio.photo} sizes="(max-width: 1023px) 100vw, 45vw" />
            </div>
          </article>
        </div>

        <p className="ab-vision" data-reveal>
          <Marked
            text={SOLUTIONS.closing}
            marks={[{ phrase: 'it connects information, decisions and actions across the enterprise.', render: gradient }]}
          />
        </p>
      </div>
    </section>
  );
}

// -------------------------------------------------------------- Agents

const AGENT_ICONS = [ScanText, GitCompareArrows, BadgeCheck, ChartLine, SearchX];
const ACTION_ICONS = [Route, Zap, MessageSquareMore, Users, Activity];

// Agents on one side, the workflow they feed on the other, the work
// passing between them; then the person who decides.
function Agents() {
  return (
    <section className="mt-sec ab-agents" aria-labelledby="ab-agents-title">
      <div className="mt-wrap">
        <div className="ab-agents-head">
          <Eyebrow>{AGENTS.eyebrow}</Eyebrow>
          <h2 id="ab-agents-title" className="mt-h2" data-reveal>
            <Marked text={AGENTS.title} marks={[{ phrase: 'Workflows That Move It Forward.', render: gradient }]} sentences />
          </h2>
        </div>
        <div className="ab-agents-grid">
          <div className="ab-agents-copy">
            <p className="ab-agents-lead" data-reveal style={{ '--rv-delay': '80ms' }}>
              {AGENTS.lead}
            </p>
            {AGENTS.text.map((t, i) => (
              <p key={t.slice(0, 20)} className="ab-agents-text" data-reveal style={{ '--rv-delay': `${140 + i * 60}ms` }}>
                {t}
              </p>
            ))}
          </div>

          <div className="ab-lanes" data-reveal="scale" aria-hidden="true">
            <div className="ab-lane">
              <p className="ab-lane-title">
                <Bot size={15} />
                AI agents
              </p>
              <ul>
                {AGENTS.agentTasks.map((t, i) => {
                  const Icon = AGENT_ICONS[i];
                  return (
                    <li key={t} className="ab-agent" style={{ '--i': i }}>
                      <Icon size={14} />
                      {t}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="ab-lanes-link">
              <span />
            </div>
            <div className="ab-lane ab-lane--flow">
              <p className="ab-lane-title">
                <Workflow size={15} />
                Workflow
              </p>
              <ul>
                {AGENTS.workflowActions.map((t, i) => {
                  const Icon = ACTION_ICONS[i];
                  return (
                    <li key={t} className="ab-action" style={{ '--i': i }}>
                      <Icon size={14} />
                      {t}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <figure className="ab-human" data-reveal="scale">
          <Photo name="expert" sizes="(max-width: 1023px) 100vw, 80vw" />
          <figcaption className="ab-human-caption">
            <span className="ab-human-ic" aria-hidden="true">
              <UserCheck size={20} />
            </span>
            <p>{AGENTS.human}</p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

// -------------------------------------------------------- Capabilities

const CAP_ICONS = [ScanText, ShieldCheck, BrainCircuit, Workflow, ChartLine, Network];

function Capabilities() {
  return (
    <section className="mt-sec mt-sec--soft ab-caps" aria-labelledby="ab-caps-title">
      <div className="mt-wrap">
        <div className="mt-head mt-head--center">
          <Eyebrow>{CAPABILITIES.eyebrow}</Eyebrow>
          <h2 id="ab-caps-title" className="mt-h2" data-reveal>
            <Marked text={CAPABILITIES.title} marks={[{ phrase: 'Core Capabilities', render: gradient }]} />
          </h2>
        </div>
        <ul className="ab-cap-grid">
          {CAPABILITIES.items.map((c, i) => {
            const Icon = CAP_ICONS[i];
            return (
              <li key={c.title} className="ab-cap" data-reveal style={{ '--rv-delay': `${(i % 3) * 90 + Math.floor(i / 3) * 120}ms` }}>
                <span className="ab-cap-top">
                  <span className="ab-cap-ic" aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <span className="ab-cap-n" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </span>
                <h3 className="ab-cap-title">{c.title}</h3>
                <p className="ab-cap-text">{c.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ------------------------------------------------------------ Outcomes

const AIM_ICONS = [TrendingUp, Timer, ShieldCheck, CircleCheck, Target];

// The network drawn over the bulb photo, in the photo's own coordinates
// (1500 × 1000, cropped the same way as the photo), so it stays on the bulb
// whatever shape the figure takes. Nodes are [x, y, radius]: the inner ring
// sends rays into the bulb, and every node joins its near neighbours.
const BULB = [727, 455];
const NET_INNER = [[575, 390, 7], [600, 545, 5], [690, 290, 8], [862, 340, 6], [890, 505, 9], [790, 612, 5]];
const NET_OUTER = [
  [420, 300, 4], [470, 470, 6], [400, 610, 5], [525, 190, 7], [505, 655, 5], [640, 150, 6], [830, 180, 8], [960, 250, 5],
  [1060, 335, 6], [1010, 445, 7], [1110, 520, 5], [975, 610, 6], [1075, 680, 4], [580, 720, 5], [895, 720, 6], [740, 760, 5],
];
const NET_DUST = [[460, 380], [560, 280], [930, 170], [1120, 420], [1040, 560], [450, 540], [660, 660], [850, 660], [380, 200], [1100, 240], [720, 200], [990, 330]];
const NET_NODES = [...NET_INNER, ...NET_OUTER];
const NET_LINKS = NET_NODES.flatMap((a, i) =>
  NET_NODES.slice(i + 1)
    .filter((b) => Math.hypot(a[0] - b[0], a[1] - b[1]) < 185)
    .map((b) => [a, b])
);

function IdeaNetwork() {
  return (
    <svg className="ab-net" viewBox="0 0 1500 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="ab-net-halo">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {NET_LINKS.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
      ))}
      {NET_INNER.map(([x, y]) => (
        <line key={`ray-${x}-${y}`} className="ab-net-ray" x1={x} y1={y} x2={BULB[0]} y2={BULB[1]} />
      ))}
      {NET_NODES.map(([x, y, r], i) => (
        <g key={`${x}-${y}`} className="ab-net-node" style={{ '--i': i }}>
          <circle className="ab-net-halo" cx={x} cy={y} r={r * 3.2} />
          <circle cx={x} cy={y} r={r} />
        </g>
      ))}
      {NET_DUST.map(([x, y]) => (
        <circle key={`dust-${x}-${y}`} className="ab-net-dust" cx={x} cy={y} r="2.5" />
      ))}
    </svg>
  );
}

function Outcomes() {
  const { objective } = OUTCOMES;
  return (
    <section className="mt-sec ab-outcomes" aria-labelledby="ab-outcomes-title">
      <div className="mt-wrap">
        <div className="ab-outcomes-grid">
          <div className="ab-outcomes-copy">
            <Eyebrow>{OUTCOMES.eyebrow}</Eyebrow>
            <h2 id="ab-outcomes-title" className="mt-h2" data-reveal>
              <Marked text={OUTCOMES.title} marks={[{ phrase: 'Business Outcomes', render: gradient }]} />
            </h2>
            <p className="ab-outcomes-lead" data-reveal style={{ '--rv-delay': '80ms' }}>
              {OUTCOMES.lead}
            </p>
            {OUTCOMES.text.map((t, i) => (
              <p key={t.slice(0, 20)} className="ab-outcomes-text" data-reveal style={{ '--rv-delay': `${140 + i * 60}ms` }}>
                {t}
              </p>
            ))}
          </div>
          <figure className="ab-objective" data-reveal="scale">
            <Photo name="idea" sizes="(max-width: 1023px) 100vw, 45vw" />
            <IdeaNetwork />
            <figcaption className="ab-objective-card">
              <span className="ab-objective-label">
                <Target size={13} aria-hidden="true" />
                {objective.label}
              </span>
              <p className="ab-objective-title">{objective.title}</p>
            </figcaption>
          </figure>
        </div>

        <div className="ab-aims">
          <p className="ab-aims-text" data-reveal>
            {objective.text}
          </p>
          <ul className="ab-aim-list">
            {objective.aims.map((a, i) => {
              const Icon = AIM_ICONS[i];
              return (
                <li key={a} className="ab-aim" data-reveal style={{ '--rv-delay': `${i * 70}ms` }}>
                  <span className="ab-aim-ic" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  {a}
                </li>
              );
            })}
            <li className="ab-aim ab-aim--people" data-reveal style={{ '--rv-delay': '350ms' }}>
              <span className="ab-aim-ic" aria-hidden="true">
                <UserCheck size={18} />
              </span>
              People stay in control
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------- Belief

const BELIEF_ICONS = [FileText, Sparkles, Zap];

// The belief in three lines, each a step further, then the way in.
function Belief() {
  return (
    <section className="mt-sec mt-sec--dark ab-belief" aria-labelledby="ab-belief-title">
      <div className="ab-belief-bg" aria-hidden="true" />
      <div className="mt-wrap">
        <Eyebrow dark>{BELIEF.eyebrow}</Eyebrow>
        <h2 id="ab-belief-title" className="ab-belief-lines">
          {BELIEF.lines.map((line, i) => {
            const Icon = BELIEF_ICONS[i];
            return (
              <span key={line} className={`ab-belief-line ab-belief-line--${i + 1}`} data-reveal style={{ '--rv-delay': `${i * 140}ms` }}>
                <span className="ab-belief-ic" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <span>{i === 2 ? <Marked text={line} marks={[{ phrase: 'turns insight into action.', render: gradient }]} /> : line}</span>
              </span>
            );
          })}
        </h2>
        <div className="ab-belief-foot">
          <p className="ab-belief-text" data-reveal>
            {BELIEF.text}
          </p>
          <div className="mt-actions" data-reveal style={{ '--rv-delay': '100ms' }}>
            <a className="mt-btn mt-btn--primary" href={CONTACT_URL}>
              {BELIEF.primaryCta}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="mt-btn ab-btn-light" href={DEMO_URL}>
              {BELIEF.secondaryCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  const pageRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  useDocumentMeta('About | Star Software', HERO.text);
  useReveal(pageRef);

  return (
    <div ref={pageRef} className={`mtr-page about-page${reduced ? '' : ' mt-anim'}`}>
      <Navbar variant="solid" />
      <main className="mtr-main">
        <Hero />
        <Story />
        <Challenge />
        <Mission />
        <Approach />
        <Solutions />
        <Agents />
        <Capabilities />
        <Outcomes />
        <Belief />
      </main>
      <Footer />
    </div>
  );
}
