import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Columns3,
  GitCompareArrows,
  Factory,
  FlaskConical,
  GraduationCap,
  Layers,
  Newspaper,
  Receipt,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { formatResourceDate } from '../data/resourcesData';
import './ResourceSections.css';

// The curated shelves above the full library on the Resources page. Each one
// picks its posts from the live list by rule (newest, longest, topic, title
// pattern), so nothing has to be chosen by hand as posts are published.

export const TOPIC_ICONS = {
  ap: Receipt,
  ar: TrendingUp,
  coa: FlaskConical,
  mtr: Factory,
  qa: ShieldCheck,
  transcript: GraduationCap,
  others: Newspaper,
};

function Meta({ article }) {
  return (
    <span className="rs-meta">
      {formatResourceDate(article.date)} &middot; {article.readMinutes} min read
    </span>
  );
}

function Thumb({ article, className }) {
  const Icon = TOPIC_ICONS[article.category] || Layers;
  return (
    <div className={`rs-thumb ${className || ''}`}>
      {article.image ? (
        <img src={article.image} alt="" loading="lazy" />
      ) : (
        <Icon size={40} strokeWidth={1.5} aria-hidden="true" />
      )}
    </div>
  );
}

export function SectionHead({ id, eyebrow, title, action }) {
  return (
    <div className="rs-head">
      <div>
        <span className="rh-section-eyebrow">{eyebrow}</span>
        <h2 id={id} className="rh-h2">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

function SeeAll({ children, onClick }) {
  return (
    <button type="button" className="rs-see-all" onClick={onClick}>
      {children}
      <ArrowRight size={16} aria-hidden="true" />
    </button>
  );
}

// 1 large card for the newest post, the next two stacked beside it.
export function LatestSection({ articles }) {
  const [lead, ...rest] = articles;
  if (!lead) return null;
  return (
    <section id="latest" className="rs-section" aria-labelledby="rs-latest-heading">
      <SectionHead id="rs-latest-heading" eyebrow="Just published" title="Latest from Star Software" />
      <div className="rs-latest">
        <article className="rs-lead">
          <Thumb article={lead} className="rs-thumb--lead" />
          <div className="rs-lead-body">
            <span className="rs-kicker">{lead.categoryLabel}</span>
            <Link to={`/resources/${lead.slug}`} className="rs-title-link">
              <h3 className="rs-lead-title">{lead.title}</h3>
            </Link>
            <p className="rs-desc">{lead.description}</p>
            <div className="rs-lead-foot">
              <Meta article={lead} />
              <Link to={`/resources/${lead.slug}`} className="rs-read">
                Read article <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </article>
        <div className="rs-side">
          {rest.map((article) => (
            <article className="rs-compact" key={article.slug}>
              <Thumb article={article} className="rs-thumb--compact" />
              <div className="rs-compact-body">
                <span className="rs-kicker">{article.categoryLabel}</span>
                <Link to={`/resources/${article.slug}`} className="rs-title-link">
                  <h3 className="rs-compact-title">{article.title}</h3>
                </Link>
                <Meta article={article} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// The biggest topics as tiles (count + newest post), the rest as chips.
export function TopicsSection({ topics, onPick }) {
  const tiles = topics.slice(0, 3);
  const chips = topics.slice(3);
  return (
    <section className="rs-section" aria-labelledby="rs-topics-heading">
      <SectionHead id="rs-topics-heading" eyebrow="Browse by topic" title="Find guides for your documents" />
      <div className="rs-topic-tiles">
        {tiles.map((topic) => {
          const Icon = TOPIC_ICONS[topic.id] || Layers;
          return (
            <button type="button" key={topic.id} className="rs-topic-tile" onClick={() => onPick(topic.id)}>
              <span className="rs-topic-icon" aria-hidden="true">
                <Icon size={22} />
              </span>
              <span className="rs-topic-name">{topic.label}</span>
              <span className="rs-topic-count">
                {topic.count} article{topic.count === 1 ? '' : 's'}
              </span>
              {topic.latest && (
                <span className="rs-topic-latest">
                  <span className="rs-topic-latest-label">Latest</span>
                  {topic.latest.title}
                </span>
              )}
              <span className="rs-topic-go">
                Browse {topic.label} <ArrowRight size={16} aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </div>
      {chips.length > 0 && (
        <div className="rs-topic-chips">
          <span className="rs-topic-chips-label">More topics</span>
          {chips.map((topic) => {
            const Icon = TOPIC_ICONS[topic.id] || Layers;
            return (
              <button type="button" key={topic.id} className="rs-topic-chip" onClick={() => onPick(topic.id)}>
                <Icon size={16} aria-hidden="true" />
                {topic.label}
                <span className="rs-topic-chip-count">{topic.count}</span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

// The longest reads, reading time up front.
export function GuidesSection({ articles, onSeeAll }) {
  if (!articles.length) return null;
  return (
    <section className="rs-section" aria-labelledby="rs-guides-heading">
      <SectionHead
        id="rs-guides-heading"
        eyebrow="In-depth guides"
        title="Long reads worth the time"
        action={<SeeAll onClick={onSeeAll}>All long reads</SeeAll>}
      />
      <div className="rs-guides">
        {articles.map((article) => (
          <article className="rs-guide" key={article.slug}>
            <div className="rs-guide-time">
              <BookOpen size={18} aria-hidden="true" />
              <span>
                <strong>{article.readMinutes}</strong> min read
              </span>
            </div>
            <span className="rs-kicker">{article.categoryLabel}</span>
            <Link to={`/resources/${article.slug}`} className="rs-title-link">
              <h3 className="rs-guide-title">{article.title}</h3>
            </Link>
            <p className="rs-desc">{article.description}</p>
            <Link to={`/resources/${article.slug}`} className="rs-read">
              Read the guide <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

// Market, policy and trend pieces as a dated list: they age quickly, so a
// compact list suits them better than big cards.
export function NewsSection({ articles, onSeeAll }) {
  if (!articles.length) return null;
  return (
    <section className="rs-section" aria-labelledby="rs-news-heading">
      <SectionHead
        id="rs-news-heading"
        eyebrow="Industry news and trends"
        title="What's moving in manufacturing and finance"
        action={<SeeAll onClick={onSeeAll}>All industry articles</SeeAll>}
      />
      <ul className="rs-news">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link to={`/resources/${article.slug}`} className="rs-news-row">
              <time className="rs-news-date" dateTime={article.date}>
                {formatResourceDate(article.date)}
              </time>
              <span className="rs-news-main">
                <span className="rs-news-title">{article.title}</span>
                <span className="rs-news-sub">
                  {article.categoryLabel} &middot; {article.readMinutes} min read
                </span>
              </span>
              <ArrowRight size={18} className="rs-news-arrow" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// A comparison post, by title: "X vs Y", "versus", "a comprehensive
// comparison", "the difference(s) between X and Y", "what sets them apart".
// ("…do differently" doesn't count.)
const COMPARISON_TITLE =
  /\bvs\.?(?=\s)|\bversus\b|\bcompar(?:ison|ed|ing)\b|\bdifferences?\s+between\b|\bunderstanding the differences\b|\bwhat sets (?:them|it) apart\b/i;

export function isComparison(article) {
  return COMPARISON_TITLE.test(article.title);
}

// "Certificate of Analysis (CoA)" -> "CoA"; otherwise the name as written.
function shortName(text) {
  const abbreviation = text.match(/\(([A-Za-z]{2,6})\)/);
  return (abbreviation ? abbreviation[1] : text).replace(/[.?!]+$/, '').trim();
}

// The things a comparison post weighs up, read from its title:
//   "CoC vs. CoA vs. MTR: Understanding…"            -> CoC, CoA, MTR
//   "The Truth About AR Automation: Myths vs. Realities" -> Myths, Realities
//   "…Difference between IDP and OCR Technologies…"  -> IDP, OCR
// Empty when the title doesn't name them ("Best MTR software compared").
export function contendersOf(title) {
  const between = title.match(
    /differences?\s+between\s+(.+?)\s+and\s+(.+?)(?=\s+(?:in|for|technolog\w*|solutions?|systems?)\b|[:?.–—]|$)/i
  );
  if (between) return [between[1], between[2]].map(shortName);

  const parts = title.split(/\s+(?:vs\.?|versus)\s+/i);
  if (parts.length < 2) return [];
  const first = parts[0].split(/:\s*|\s+[–—]\s+/).pop();
  const last = parts[parts.length - 1].split(/\s*[:?–—]\s*|\s+-\s+|-(?=[A-Z])/)[0];
  return [first, ...parts.slice(1, -1), last].map(shortName).filter(Boolean);
}

const COMPARISONS_SHOWN = 6;

function ComparisonSheet({ article }) {
  const contenders = contendersOf(article.title);
  const long = contenders.some((name) => name.length > 10);
  return (
    <article className="rs-sheet">
      <Link to={`/resources/${article.slug}`} className="rs-sheet-board" tabIndex={-1} aria-hidden="true">
        <span className="rs-sheet-tag">
          <Columns3 size={14} />
          {contenders.length ? `${contenders.length} compared` : 'Side by side'}
        </span>
        {contenders.length ? (
          <span className={`rs-sheet-vs${long ? ' rs-sheet-vs--long' : ''}`}>
            {contenders.map((name, index) => (
              <React.Fragment key={name + index}>
                {index > 0 && <span className="rs-sheet-vs-badge">vs</span>}
                <span className="rs-sheet-side">{name}</span>
              </React.Fragment>
            ))}
          </span>
        ) : (
          <span className="rs-sheet-generic">
            <GitCompareArrows size={30} />
            <span>Tools compared</span>
          </span>
        )}
      </Link>
      <div className="rs-sheet-body">
        <span className="rs-kicker">{article.categoryLabel}</span>
        <Link to={`/resources/${article.slug}`} className="rs-title-link">
          <h3 className="rs-sheet-title">{article.title}</h3>
        </Link>
        <p className="rs-desc rs-sheet-desc">{article.description}</p>
        <div className="rs-sheet-foot">
          <span className="rs-meta">{article.readMinutes} min read</span>
          <Link to={`/resources/${article.slug}`} className="rs-read">
            Open comparison <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

// Every comparison post, newest first; more than six fold behind a button.
export function ComparisonsSection({ articles }) {
  const [expanded, setExpanded] = useState(false);
  if (!articles.length) return null;
  const shown = expanded ? articles : articles.slice(0, COMPARISONS_SHOWN);
  return (
    <section id="comparisons" className="rs-section rs-comparisons" aria-labelledby="rs-comparisons-heading">
      <SectionHead
        id="rs-comparisons-heading"
        eyebrow="Comparison sheets"
        title="Side-by-side breakdowns, before you decide"
        action={
          <span className="rs-count-note">
            {articles.length} comparison{articles.length === 1 ? '' : 's'}
          </span>
        }
      />
      <div className="rs-sheets">
        {shown.map((article) => (
          <ComparisonSheet article={article} key={article.slug} />
        ))}
      </div>
      {articles.length > COMPARISONS_SHOWN && (
        <button
          type="button"
          className="rs-see-all rs-sheets-more"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Show fewer' : `Show all ${articles.length} comparisons`}
          <ChevronDown size={16} aria-hidden="true" className={expanded ? 'rs-chevron--up' : undefined} />
        </button>
      )}
    </section>
  );
}

// Placeholders shaped like the shelves while posts load.
export function ShelvesLoading() {
  return (
    <div className="rs-loading" aria-busy="true" aria-label="Loading resources">
      <div className="rs-latest" aria-hidden="true">
        <div className="rh-skeleton rs-skel-lead" />
        <div className="rs-side">
          <div className="rh-skeleton rs-skel-compact" />
          <div className="rh-skeleton rs-skel-compact" />
        </div>
      </div>
      <div className="rs-topic-tiles" aria-hidden="true">
        <div className="rh-skeleton rs-skel-tile" />
        <div className="rh-skeleton rs-skel-tile" />
        <div className="rh-skeleton rs-skel-tile" />
      </div>
    </div>
  );
}
