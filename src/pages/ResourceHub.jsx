import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
  Workflow,
  Zap,
  Calendar,
  Factory,
  Layers,
  Car,
  GraduationCap,
  Landmark,
  FlaskConical,
  Receipt,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  ARTICLES,
  CATEGORIES,
  RESOURCE_TYPES,
  INDUSTRIES,
  formatResourceDate,
} from '../data/resourcesData';
import './ResourceHub.css';

const QUICK_TAGS = [
  'Invoice Matching',
  'Mill Test Reports',
  'CoA Verification',
  'AP 3-Way Match',
  'Steel Standards',
];

const INDUSTRY_ICONS = {
  Factory,
  Layers,
  Car,
  GraduationCap,
  Landmark,
  FlaskConical,
};

const CATEGORY_MEDIA_ICON = {
  mtr: Factory,
  ap: Receipt,
  ar: TrendingUp,
  coa: FlaskConical,
  qa: ShieldCheck,
  transcript: GraduationCap,
};

const SORT_OPTIONS = [
  { id: 'recent', label: 'Most Recent' },
  { id: 'deep-dive', label: 'Longest Read First' },
];

const ITEMS_PER_PAGE = 6;

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

  const searchInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage] = useState(1);

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

  const featured = useMemo(() => ARTICLES.find((article) => article.featured), []);
  const nonFeatured = useMemo(() => ARTICLES.filter((article) => !article.featured), []);

  const typeCounts = useMemo(() => {
    const counts = { all: nonFeatured.length };
    RESOURCE_TYPES.forEach((type) => {
      if (type.id === 'all') return;
      counts[type.id] = nonFeatured.filter((article) => article.type === type.id).length;
    });
    return counts;
  }, [nonFeatured]);

  const categoryCounts = useMemo(() => {
    const counts = { all: nonFeatured.length };
    CATEGORIES.forEach((category) => {
      if (category.id === 'all') return;
      counts[category.id] = nonFeatured.filter((article) => article.category === category.id).length;
    });
    return counts;
  }, [nonFeatured]);

  const isFiltering = Boolean(searchQuery.trim()) || activeType !== 'all' || activeCategory !== 'all';

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let list = nonFeatured.filter((article) => {
      const matchesType = activeType === 'all' || article.type === activeType;
      const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
      const matchesQuery =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.categoryLabel.toLowerCase().includes(query);
      return matchesType && matchesCategory && matchesQuery;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === 'deep-dive') {
        return b.readMinutes - a.readMinutes;
      }
      return new Date(b.date) - new Date(a.date);
    });

    return list;
  }, [nonFeatured, activeType, activeCategory, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(pageStart, pageStart + ITEMS_PER_PAGE);

  const showFeatured = !isFiltering && currentPage === 1;

  return (
    <div className="resource-hub-page">
      <Navbar variant="solid" />
      <div className="rh-ribbon" aria-hidden="true" />

      <section className="rh-hero">
        <div className="rh-hero-aura-a" aria-hidden="true" />
        <div className="rh-hero-aura-b" aria-hidden="true" />
        <div className="rh-container rh-hero-inner">
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
                placeholder="Search guides, MTR parsing, AP workflows..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label="Search resources"
              />
              <kbd className="rh-search-kbd">Ctrl + K</kbd>
            </div>
            <div className="rh-quick-filters">
              <span className="rh-quick-filters-label">Popular:</span>
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="rh-quick-tag"
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rh-filter-bar" aria-label="Filter resources">
        <div className="rh-filter-bar-inner">
          <div className="rh-type-tabs">
            <div className="rh-type-tabs-list" role="tablist" aria-label="Resource type">
              {RESOURCE_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  role="tab"
                  aria-selected={activeType === type.id}
                  className={`rh-type-tab${activeType === type.id ? ' rh-type-tab--active' : ''}`}
                  onClick={() => setActiveType(type.id)}
                >
                  {type.label} <span className="rh-type-tab-count">({typeCounts[type.id] ?? 0})</span>
                </button>
              ))}
            </div>
            <div className="rh-index-note">
              <span className="rh-index-dot" aria-hidden="true" />
              <span>Curated by the Star Software team</span>
            </div>
          </div>

          <div className="rh-category-row">
            <div className="rh-category-pills" role="tablist" aria-label="Automation category">
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
                </button>
              ))}
            </div>
            <div className="rh-meta-sort">
              <span className="rh-meta-count">
                Showing <strong>{filteredArticles.length}</strong> resource
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
        </div>
      </section>

      <div className="rh-main">
        {showFeatured && featured && (
          <section className="rh-featured-section" aria-labelledby="featured-resource-heading">
            <div className="rh-featured-head">
              <div className="rh-featured-flag">
                <span className="rh-pulse-dot" aria-hidden="true" />
                <span className="rh-featured-flag-text">Editor's Pick &middot; Featured In-Depth Guide</span>
              </div>
            </div>

            <article className="rh-featured-card">
              <div className="rh-featured-stripe" aria-hidden="true" />
              <div className="rh-featured-grid">
                <div className="rh-featured-visual" aria-hidden="true">
                  <div className="rh-featured-visual-head">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="rh-featured-visual-tag">SCHEMA_VALIDATOR</span>
                      <span className="rh-featured-visual-label">Document structural comparison</span>
                    </div>
                    <span className="rh-featured-confidence">
                      <BadgeCheck size={16} /> High-confidence parsing
                    </span>
                  </div>
                  <div className="rh-doc-compare">
                    <div className="rh-doc-block">
                      <div>
                        <span className="rh-doc-block-kicker">Compliance</span>
                        <p className="rh-doc-block-title">CoC</p>
                        <p className="rh-doc-block-desc">Standard conformity attestation</p>
                      </div>
                      <div>
                        <div className="rh-doc-track">
                          <div className="rh-doc-track-fill" style={{ width: '80%' }} />
                        </div>
                        <span className="rh-doc-track-label">Entity match</span>
                      </div>
                    </div>
                    <div className="rh-doc-block">
                      <div>
                        <span className="rh-doc-block-kicker">Analytical</span>
                        <p className="rh-doc-block-title">CoA</p>
                        <p className="rh-doc-block-desc">Quantitative lab assay metrics</p>
                      </div>
                      <div>
                        <div className="rh-doc-track">
                          <div className="rh-doc-track-fill" style={{ width: '92%', backgroundColor: 'var(--rh-tertiary)' }} />
                        </div>
                        <span className="rh-doc-track-label">Purity spec</span>
                      </div>
                    </div>
                    <div className="rh-doc-block">
                      <div>
                        <span className="rh-doc-block-kicker">Metallurgical</span>
                        <p className="rh-doc-block-title">MTR</p>
                        <p className="rh-doc-block-desc">Tensile, heat &amp; chemistry</p>
                      </div>
                      <div>
                        <div className="rh-doc-track">
                          <div className="rh-doc-track-fill" style={{ width: '100%' }} />
                        </div>
                        <span className="rh-doc-track-label">Yield spec</span>
                      </div>
                    </div>
                  </div>
                  <div className="rh-featured-footnote">
                    <span className="rh-featured-footnote-text">
                      <Workflow size={18} color="var(--rh-primary)" />
                      Automated receipt routing &amp; ERP ingestion trigger
                    </span>
                    <span className="rh-featured-footnote-badge">Zero-Touch Flow</span>
                  </div>
                </div>

                <div className="rh-featured-editorial">
                  <span className="rh-featured-kicker">{featured.categoryLabel} &middot; Technical Guide</span>
                  <Link to={`/resources/${featured.slug}`}>
                    <h2 id="featured-resource-heading" className="rh-featured-title">
                      {featured.title}
                    </h2>
                  </Link>
                  <p className="rh-featured-desc">{featured.description}</p>
                  <div className="rh-featured-byline">
                    <span className="rh-avatar" aria-hidden="true">
                      <Zap size={18} />
                    </span>
                    <div>
                      <span className="rh-byline-name">{featured.author}</span>
                      <span className="rh-byline-meta">
                        {formatResourceDate(featured.date)} &middot; {featured.readMinutes} min read
                      </span>
                    </div>
                  </div>
                  <Link to={`/resources/${featured.slug}`} className="rh-featured-link">
                    <span>Read complete technical guide</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </article>
          </section>
        )}

        <section className="rh-grid-section" aria-labelledby="resource-grid-heading">
          <div className="rh-grid-head">
            <div>
              <span className="rh-section-eyebrow">Knowledge Library</span>
              <h2 id="resource-grid-heading" className="rh-h2">
                Latest Resources &amp; Practical Automation Guides
              </h2>
            </div>
            <span className="rh-grid-head-note">Displaying verified engineering guides</span>
          </div>

          {paginatedArticles.length === 0 ? (
            <div className="rh-empty-state">
              No resources match these filters yet. Try a different category or clear your search — new
              guides are published regularly.
            </div>
          ) : (
            <div className="rh-article-grid">
              {paginatedArticles.map((article) => {
                const MediaIcon = CATEGORY_MEDIA_ICON[article.category] || Layers;
                return (
                  <article className="rh-card" key={article.slug}>
                    <div className="rh-card-media">
                      {article.image ? (
                        <img src={article.image} alt={article.title} className="rh-card-image" />
                      ) : (
                        <MediaIcon size={56} strokeWidth={1.5} className="rh-card-media-icon" />
                      )}
                      <span className="rh-card-badge">{article.categoryLabel}</span>
                      <span className="rh-card-tag">{article.tag}</span>
                    </div>
                    <div className="rh-card-body">
                      <div>
                        <Link to={`/resources/${article.slug}`}>
                          <h3 className="rh-card-title">{article.title}</h3>
                        </Link>
                        <p className="rh-card-desc">{article.description}</p>
                      </div>
                      <div className="rh-card-footer">
                        <span className="rh-card-meta">
                          {formatResourceDate(article.date)} &middot; {article.readMinutes} min read
                        </span>
                        <Link to={`/resources/${article.slug}`} className="rh-card-link">
                          Read guide <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <div className="rh-pagination">
          <span className="rh-pagination-note">
            Showing{' '}
            <strong>
              {filteredArticles.length === 0 ? 0 : pageStart + 1}&ndash;
              {Math.min(pageStart + ITEMS_PER_PAGE, filteredArticles.length)}
            </strong>{' '}
            of <strong>{filteredArticles.length}</strong> resources
          </span>
          <div className="rh-pagination-controls">
            <button
              type="button"
              className="rh-page-btn"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ArrowLeft size={16} /> Prev
            </button>
            <div className="rh-page-numbers">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={`rh-page-number${pageNumber === currentPage ? ' rh-page-number--active' : ''}`}
                  onClick={() => setPage(pageNumber)}
                  aria-current={pageNumber === currentPage ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="rh-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <section className="rh-industries-section" aria-labelledby="industries-heading">
          <div className="rh-industries-head">
            <span className="rh-section-eyebrow">Industry Verticals</span>
            <h2 id="industries-heading" className="rh-h2">
              Explore Document Automation by Industry
            </h2>
            <p className="rh-industries-copy">
              Tailored validation rules, compliance frameworks, and document models engineered for your
              sector.
            </p>
          </div>
          <div className="rh-industries-grid">
            {INDUSTRIES.map((industry) => {
              const Icon = INDUSTRY_ICONS[industry.icon] || Layers;
              return (
                <div className="rh-industry-card" key={industry.id}>
                  <div>
                    <span className="rh-industry-icon" aria-hidden="true">
                      <Icon size={22} />
                    </span>
                    <h3 className="rh-industry-title">{industry.title}</h3>
                    <p className="rh-industry-desc">{industry.description}</p>
                  </div>
                  <a className="rh-industry-link" href="/#solutions">
                    Explore solutions <ArrowRight size={16} />
                  </a>
                </div>
              );
            })}
          </div>
        </section>

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
            <div className="rh-metrics">
              <div className="rh-metric-tile">
                <span className="rh-metric-value">99.4%</span>
                <span className="rh-metric-label">Extraction Accuracy</span>
              </div>
              <div className="rh-metric-tile">
                <span className="rh-metric-value">10M+</span>
                <span className="rh-metric-label">Documents Processed</span>
              </div>
              <div className="rh-metric-tile">
                <span className="rh-metric-value">SOC 2</span>
                <span className="rh-metric-label">Type II Certified</span>
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
