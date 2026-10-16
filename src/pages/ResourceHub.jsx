import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Search, ArrowRight, ArrowLeft, Zap, Calendar, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhitepaperSection from '../components/WhitepaperSection';
import FaqSection from '../components/FaqSection';
import QaCenterSection from '../components/QaCenterSection';
import StoriesSection from '../components/StoriesSection';
import RollingNumber from '../components/RollingNumber';
import ArticleCard from '../components/ArticleCard';
import {
  ComparisonsSection,
  GuidesSection,
  isComparison,
  LatestSection,
  NewsSection,
  SectionHead,
  ShelvesLoading,
  TopicsSection,
} from '../components/ResourceSections';
import { CATEGORIES, RESOURCE_TYPES, formatResourceDate } from '../data/resourcesData';
import { useArticles } from '../hooks/useResources';
import './ResourceHub.css';
import './ResourceResponsive.css';

const SORT_OPTIONS = [
  { id: 'recent', label: 'Most Recent' },
  { id: 'deep-dive', label: 'Longest Read First' },
];

const ITEMS_PER_PAGE = 6;

const LATEST_COUNT = 3;
const GUIDE_COUNT = 3;
// Long enough to count as an in-depth guide.
const GUIDE_MIN_MINUTES = 6;
const NEWS_COUNT = 5;
// Titles about markets, policy and trends, for the news shelf alongside
// posts filed under no automation topic.
const TREND_TITLE = /tariff|trade|policy|regulat|trend|future|outlook|market|economy|dollar|stimulus/i;

// Unknown or missing ids fall back to 'all' so a stale link can't break the page.
function toKnownId(options, value) {
  return options.some((option) => option.id === value) ? value : 'all';
}

// Whether an article is filed under a topic. Live posts list every topic
// they belong to (a CoA & MTR post shows under both); saved ones only have
// their primary topic.
function inTopic(article, topic) {
  return article.categories ? article.categories.includes(topic) : article.category === topic;
}

// Page buttons to show: every page when there are few, otherwise the first,
// the last and the current page's neighbours, with gaps marked '…'.
function pageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const keep = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((n) => keep.add(n));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => keep.add(n));
  const pages = [...keep].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  return pages.flatMap((n, i) => (i > 0 && n - pages[i - 1] > 1 ? [`gap-${n}`, n] : [n]));
}

function useDocumentMeta(title, description) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    let metaDescription = document.querySelector('meta[name="description"]');
    let createdMeta = false;
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
      createdMeta = true;
    }
    const previousDescription = metaDescription.getAttribute('content');
    metaDescription.setAttribute('content', description);

    return () => {
      document.title = previousTitle;
      if (createdMeta) {
        metaDescription.remove();
      } else if (previousDescription !== null) {
        metaDescription.setAttribute('content', previousDescription);
      }
    };
  }, [title, description]);
}

export default function ResourceHub() {
  useDocumentMeta(
    'Resources | Star Software — Insights for Smarter Document Automation',
    'Practical guides on MTR, CoA, AP/AR, QA, and transcript automation from the Star Software team — for enterprises processing mission-critical documents at scale.'
  );

  // Posts from the WordPress REST API; the saved snapshot if it's unreachable.
  const { status: articlesStatus, articles } = useArticles();
  const isLoading = articlesStatus === 'loading';

  const searchInputRef = useRef(null);
  const libraryRef = useRef(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const typeFromUrl = toKnownId(RESOURCE_TYPES, searchParams.get('type'));
  const categoryFromUrl = toKnownId(CATEGORIES, searchParams.get('category'));
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState(typeFromUrl);
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl);

  // Navbar links deep-link here via ?type= / ?category=. The page stays mounted
  // when moving between them, so re-apply on every navigation — keyed on
  // location.key so re-selecting the same link still resets a changed filter.
  // A search left in the box would keep the page in results, so it clears too.
  useEffect(() => {
    setActiveType(typeFromUrl);
    setActiveCategory(categoryFromUrl);
    setSearchQuery('');
  }, [location.key, typeFromUrl, categoryFromUrl]);

  // React Router doesn't scroll to #fragments, so links like
  // /resources#whitepapers would otherwise land at the top of the page. The
  // target is remembered per navigation (the scroll itself runs further down,
  // once the page's view is known).
  const pendingHashRef = useRef(null);
  useEffect(() => {
    pendingHashRef.current = location.hash ? decodeURIComponent(location.hash.slice(1)) : null;
  }, [location.key, location.hash]);
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage] = useState(1);

  // The category row scrolls sideways when it can't fit (its scrollbar is
  // hidden), so fade whichever edge has more pills past it — otherwise the
  // last pill just looks cut off.
  const pillsRef = useRef(null);
  const [pillsFade, setPillsFade] = useState({ start: false, end: false });
  const updatePillsFade = () => {
    const el = pillsRef.current;
    if (!el) return;
    const start = el.scrollLeft > 1;
    const end = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    setPillsFade((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  };
  useEffect(() => {
    const el = pillsRef.current;
    if (!el) return undefined;
    updatePillsFade();
    const observer = new ResizeObserver(updatePillsFade);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeType, activeCategory, sortBy]);

  // Newest first, whatever order the source gave.
  const byDate = useMemo(
    () => [...articles].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [articles]
  );

  // Every topic with its post count and newest post, biggest first; the
  // catch-all "Industry & Trends" always last.
  const topics = useMemo(
    () =>
      CATEGORIES.filter((category) => category.id !== 'all')
        .map((category) => {
          const posts = byDate.filter((article) => inTopic(article, category.id));
          return { id: category.id, label: category.label, count: posts.length, latest: posts[0] };
        })
        .filter((topic) => topic.count > 0)
        .sort((a, b) => (a.id === 'others') - (b.id === 'others') || b.count - a.count),
    [byDate]
  );

  const categoryCounts = useMemo(() => {
    const counts = { all: articles.length };
    topics.forEach((topic) => {
      counts[topic.id] = topic.count;
    });
    return counts;
  }, [articles, topics]);

  // The shelves above the library, each chosen by rule. Comparison sheets
  // list every comparison post; otherwise a post appears on at most one shelf.
  const shelves = useMemo(() => {
    const latest = byDate.slice(0, LATEST_COUNT);
    const comparisons = byDate.filter(isComparison);
    const used = new Set([...latest, ...comparisons].map((article) => article.slug));
    const guides = byDate
      .filter((article) => !used.has(article.slug) && article.readMinutes >= GUIDE_MIN_MINUTES)
      .sort((a, b) => b.readMinutes - a.readMinutes)
      .slice(0, GUIDE_COUNT);
    guides.forEach((article) => used.add(article.slug));
    const news = byDate
      .filter(
        (article) =>
          !used.has(article.slug) && (inTopic(article, 'others') || TREND_TITLE.test(article.title))
      )
      .slice(0, NEWS_COUNT);
    return { latest, comparisons, guides, news };
  }, [byDate]);

  // A type filter only counts when it narrows the list. Every live post is a
  // guide, so the navbar's Blogs link (?type=guide) leaves the full page in
  // place instead of hiding every shelf behind a filter that removes nothing.
  const typeNarrows =
    activeType !== 'all' && !isLoading && articles.some((article) => article.type !== activeType);

  // Searching or filtering switches the page to results: the shelves step
  // aside and the library follows the search box.
  const isFiltering = Boolean(searchQuery.trim()) || typeNarrows || activeCategory !== 'all';

  // Jump to the remembered #fragment once its section is on the page: a link
  // that clears a filter only brings the shelves back a render later, and
  // posts arriving push sections down, so it aims again until they've loaded.
  useEffect(() => {
    const id = pendingHashRef.current;
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (articlesStatus !== 'loading') pendingHashRef.current = null;
  }, [location.key, location.hash, articlesStatus, isFiltering]);

  // In the default view (no filter, newest first) the library leaves out
  // the posts Latest already shows above it; searching, filtering or
  // re-sorting covers every post.
  const libraryDefault = !isFiltering && sortBy === 'recent';

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const latestSlugs = new Set(shelves.latest.map((article) => article.slug));
    const pool = libraryDefault ? byDate.filter((article) => !latestSlugs.has(article.slug)) : byDate;
    let list = pool.filter((article) => {
      const matchesType = activeType === 'all' || article.type === activeType;
      const matchesCategory = activeCategory === 'all' || inTopic(article, activeCategory);
      const matchesQuery =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.categoryLabel.toLowerCase().includes(query);
      return matchesType && matchesCategory && matchesQuery;
    });

    if (sortBy === 'deep-dive') {
      list = [...list].sort((a, b) => b.readMinutes - a.readMinutes);
    }
    return list;
  }, [byDate, shelves, libraryDefault, activeType, activeCategory, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(pageStart, pageStart + ITEMS_PER_PAGE);

  // After the layout settles (shelves hide or show), bring the library's top
  // into view, clear of the navbar.
  const scrollToLibrary = () => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => libraryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    );
  };

  const goToPage = (pageNumber) => {
    setPage(pageNumber);
    scrollToLibrary();
  };

  const pickTopic = (topicId) => {
    setActiveCategory((current) => (current === topicId ? 'all' : topicId));
    scrollToLibrary();
  };

  const showLongReads = () => {
    setActiveCategory('all');
    setSortBy('deep-dive');
    scrollToLibrary();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveType('all');
    setActiveCategory('all');
  };

  const activeTopic = topics.find((topic) => topic.id === activeCategory);
  const activeTypeLabel = RESOURCE_TYPES.find((type) => type.id === activeType)?.label;
  const query = searchQuery.trim();
  const libraryTitle = query
    ? `Results for “${query}”`
    : isFiltering
      ? activeTopic?.label || activeTypeLabel || 'Filtered articles'
      : sortBy === 'recent'
        ? 'More articles, newest first'
        : 'Every article, longest first';

  return (
    <div className="resource-hub-page">
      <Navbar variant="solid" />
      <div className="rh-ribbon" aria-hidden="true" />

      <section className="rh-hero">
        <div className="rh-hero-aura-a" aria-hidden="true" />
        <div className="rh-hero-aura-b" aria-hidden="true" />
        <div className="rh-container rh-hero-inner rh-hero-grid">
          <div className="rh-hero-main">
          <span className="rh-eyebrow">Resources &amp; Insights</span>
          <h1 className="rh-h1">Insights for Smarter Document Automation</h1>
          <p className="rh-hero-copy">
            Explore practical guides and automation engineering write-ups to help your enterprise process
            mission-critical documents faster, error-free, and at scale.
          </p>

          <div className="rh-search-wrap">
            <div className="rh-search-bar">
              <span className="rh-search-icon" aria-hidden="true">
                <Search size={18} />
              </span>
              <input
                ref={searchInputRef}
                id="resource-search"
                type="search"
                className="rh-search-input"
                placeholder={`Search ${isLoading ? '' : `${articles.length} `}guides, MTR parsing, AP workflows...`}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label="Search resources"
              />
              <kbd className="rh-search-kbd">Ctrl + K</kbd>
            </div>
          </div>

          <nav className="rh-topic-links" aria-label="Topics">
            <span className="rh-topic-links-label">Browse topics</span>
            <div className="rh-topic-chips">
              {(isLoading ? CATEGORIES.filter((c) => c.id !== 'all') : topics).map((topic, index) => {
                const isCurrent = activeCategory === topic.id;
                return (
                  <React.Fragment key={topic.id}>
                    <button
                      type="button"
                      className={`rh-topic-link${isCurrent ? ' rh-topic-link--current' : ''}`}
                      aria-pressed={isCurrent}
                      onClick={() => pickTopic(topic.id)}
                    >
                      {topic.label}
                      <span className="rh-topic-link-count">{isLoading ? '…' : topic.count}</span>
                    </button>
                    {/* Comparisons are a format rather than a topic, so this one
                        jumps to the Comparison sheets section (clearing any
                        filter on the way) after the three biggest topics. */}
                    {index === 2 && (isLoading || shelves.comparisons.length > 0) && (
                      <Link to="/resources#comparisons" className="rh-topic-link rh-topic-link--format">
                        Comparisons
                        <span className="rh-topic-link-count">{isLoading ? '…' : shelves.comparisons.length}</span>
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </nav>
          </div>

          {/* The library at a glance, from the live posts. */}
          <aside className="rh-hero-panel" aria-label="Library at a glance">
            <p className="rh-hero-panel-label">At a glance</p>
            <dl className="rh-hero-stats">
              <div>
                <dt>Articles</dt>
                <dd>{isLoading ? '…' : <RollingNumber value={String(articles.length)} />}</dd>
              </div>
              <div>
                <dt>Automation topics</dt>
                <dd>
                  {isLoading ? '…' : (
                    <RollingNumber value={String(topics.filter((topic) => topic.id !== 'others').length)} />
                  )}
                </dd>
              </div>
              <div>
                <dt>Comparison sheets</dt>
                <dd>{isLoading ? '…' : <RollingNumber value={String(shelves.comparisons.length)} />}</dd>
              </div>
            </dl>
            {!isLoading && byDate[0] && (
              <a className="rh-hero-panel-latest" href="#latest">
                <span className="rh-hero-panel-dot" aria-hidden="true" />
                <span>
                  Last published <strong>{formatResourceDate(byDate[0].date)}</strong>
                </span>
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            )}
          </aside>
        </div>
      </section>

      <div className="rh-main">
        {/* Page order: Latest, the library, then the curated shelves (topics,
            whitepapers, comparisons, long reads, news). With a search or
            filter active the shelves step aside and the library leads. */}
        {!isFiltering && (isLoading ? <ShelvesLoading /> : <LatestSection articles={shelves.latest} />)}

        <section id="library" className="rh-grid-section rh-library" aria-labelledby="resource-grid-heading" ref={libraryRef}>
          <SectionHead
            id="resource-grid-heading"
            eyebrow="Knowledge library"
            title={libraryTitle}
            action={
              isFiltering ? (
                <button type="button" className="rs-see-all" onClick={clearFilters}>
                  <X size={16} aria-hidden="true" />
                  Clear filters
                </button>
              ) : null
            }
          />

          <div className="rh-library-bar">
            <div className="rh-category-row">
              <div
                ref={pillsRef}
                className="rh-category-pills"
                role="tablist"
                aria-label="Topic"
                data-fade-start={pillsFade.start || undefined}
                data-fade-end={pillsFade.end || undefined}
                onScroll={updatePillsFade}
              >
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === category.id}
                    className={`rh-pill${activeCategory === category.id ? ' rh-pill--active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.label}
                    {!isLoading && <span className="rh-pill-count">{categoryCounts[category.id] ?? 0}</span>}
                  </button>
                ))}
              </div>
              <div className="rh-meta-sort">
                <span className="rh-meta-count">
                  <strong>{isLoading ? '…' : filteredArticles.length}</strong> article
                  {filteredArticles.length === 1 ? '' : 's'}
                </span>
                <div className="rh-sort">
                  <label className="rh-sort-label" htmlFor="resource-sort">
                    Sort:
                  </label>
                  <select
                    id="resource-sort"
                    className="rh-sort-select"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option value={option.id} key={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {typeNarrows && (
              <button type="button" className="rh-type-chip" onClick={() => setActiveType('all')}>
                {activeTypeLabel}
                <X size={14} aria-label="Remove filter" />
              </button>
            )}
            {articlesStatus === 'fallback' && (
              <p className="rh-feed-note" role="status">
                Showing saved articles — the live feed couldn&rsquo;t be reached.
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="rh-article-grid" aria-busy="true" aria-label="Loading resources">
              {Array.from({ length: ITEMS_PER_PAGE }, (_, index) => (
                <div className="rh-card rh-card--loading" key={index} aria-hidden="true">
                  <div className="rh-card-media rh-skeleton" />
                  <div className="rh-card-body">
                    <div>
                      <span className="rh-skeleton rh-skeleton-line rh-skeleton-line--kicker" />
                      <span className="rh-skeleton rh-skeleton-line rh-skeleton-line--title" />
                      <span className="rh-skeleton rh-skeleton-line rh-skeleton-line--title-short" />
                      <span className="rh-skeleton rh-skeleton-line" />
                      <span className="rh-skeleton rh-skeleton-line rh-skeleton-line--short" />
                    </div>
                    <span className="rh-skeleton rh-skeleton-line rh-skeleton-line--meta" />
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedArticles.length === 0 ? (
            <div className="rh-empty-state">
              No articles match {query ? `“${query}”` : 'these filters'} yet. Try another topic or clear your
              search — new guides are published every month.
            </div>
          ) : (
            <div className="rh-article-grid">
              {paginatedArticles.map((article) => (
                <ArticleCard article={article} key={article.slug} />
              ))}
            </div>
          )}

          {!isLoading && filteredArticles.length > 0 && (
            <div className="rh-pagination">
              <span className="rh-pagination-note">
                Showing{' '}
                <strong>
                  {pageStart + 1}&ndash;
                  {Math.min(pageStart + ITEMS_PER_PAGE, filteredArticles.length)}
                </strong>{' '}
                of <strong>{filteredArticles.length}</strong> article
                {filteredArticles.length === 1 ? '' : 's'}
              </span>
              {totalPages > 1 && (
                <div className="rh-pagination-controls">
                  <button
                    type="button"
                    className="rh-page-btn"
                    disabled={currentPage === 1}
                    onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  >
                    <ArrowLeft size={16} aria-hidden="true" />
                    <span className="rh-page-btn-text">Prev</span>
                  </button>
                  <div className="rh-page-numbers">
                    {pageList(currentPage, totalPages).map((pageNumber) =>
                      typeof pageNumber === 'string' ? (
                        <span key={pageNumber} className="rh-page-gap" aria-hidden="true">
                          &hellip;
                        </span>
                      ) : (
                        <button
                          key={pageNumber}
                          type="button"
                          className={`rh-page-number${pageNumber === currentPage ? ' rh-page-number--active' : ''}`}
                          onClick={() => goToPage(pageNumber)}
                          aria-label={`Page ${pageNumber}`}
                          aria-current={pageNumber === currentPage ? 'page' : undefined}
                        >
                          {pageNumber}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    type="button"
                    className="rh-page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                  >
                    <span className="rh-page-btn-text">Next</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {!isFiltering && !isLoading && <TopicsSection topics={topics} onPick={pickTopic} />}

        {!isFiltering && <WhitepaperSection />}
        {!isFiltering && <QaCenterSection />}

        {!isFiltering && !isLoading && <ComparisonsSection articles={shelves.comparisons} />}
        {!isFiltering && <StoriesSection />}

        {!isFiltering && !isLoading && (
          <>
            <GuidesSection articles={shelves.guides} onSeeAll={showLongReads} />
            <NewsSection articles={shelves.news} onSeeAll={() => pickTopic('others')} />
          </>
        )}

        {!isFiltering && <FaqSection />}


        <section className="rh-crosssell" aria-labelledby="crosssell-heading">
          <div className="rh-crosssell-stripe" aria-hidden="true" />
          <div className="rh-crosssell-inner">
            <span className="rh-eyebrow">
              <Zap size={14} /> Enterprise Automation Engine
            </span>
            <h2 id="crosssell-heading" className="rh-h2">
              Turn insights into production automation
            </h2>
            <p className="rh-crosssell-copy">
              See how Star Software extracts, validates, and moves document data directly into the systems
              your finance, quality, and operations teams already run on.
            </p>
            {/* Figures published on starsoftware.co's homepage. */}
            <div className="rh-metrics">
              <div className="rh-metric-tile">
                <RollingNumber className="rh-metric-value" value="10M+" />
                <span className="rh-metric-label">Documents processed</span>
              </div>
              <div className="rh-metric-tile">
                <RollingNumber className="rh-metric-value" value="95%" />
                <span className="rh-metric-label">Increase in data-entry efficiency</span>
              </div>
              <div className="rh-metric-tile">
                <RollingNumber className="rh-metric-value" value="82%" />
                <span className="rh-metric-label">Fewer manual review errors</span>
              </div>
            </div>
            <div className="rh-crosssell-ctas">
              <a className="rh-btn-primary" href="/#solutions">
                <span>Explore Star Software Solutions</span>
                <ArrowRight size={18} />
              </a>
              <a className="rh-btn-secondary" href="/#demo">
                <Calendar size={18} />
                <span>Schedule a Live Demo</span>
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
