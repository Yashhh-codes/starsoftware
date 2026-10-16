import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Copy, Mail, ScanLine } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArticleAside, InlineToc, useArticleHeadings } from '../components/ArticleToc';
import ArticleCard from '../components/ArticleCard';
import { getArticlePromo, PROMO_LINK } from '../data/articlePromos';
import { useRollingNumbers } from '../components/RollingNumber';
import { formatResourceDate } from '../data/resourcesData';
import { useArticle, useArticles } from '../hooks/useResources';
import { enhanceArticleSections, withMarkup } from '../utils/enhanceArticle';
import { getProductStats, PRODUCT_STATS_LABEL } from '../data/productStats';
import starLogo from '../assets/star-software-logo.png';
import './ResourceHub.css';
import '../components/ArticleBlocks.css';
import './ResourceResponsive.css';

function useDocumentMeta(title, description) {
  useEffect(() => {
    if (!title) return undefined;
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
    if (description) metaDescription.setAttribute('content', description);

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

function ArticleSharing({ articleTitle, articleUrl }) {
  const [copied, setCopied] = useState(false);
  const [helpful, setHelpful] = useState(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnLinkedIn = () => {
    const text = `${articleTitle} - Star Software Resource Hub`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
      '_blank'
    );
  };

  const shareOnX = () => {
    const text = `Check out "${articleTitle}" from Star Software - ${articleUrl}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  const shareViaEmail = () => {
    const subject = `Check out: ${articleTitle}`;
    const body = `I thought you'd find this article interesting: ${articleTitle}\n\n${articleUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div>
      {/* Sharing buttons */}
      <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #f0f0f0' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0a101d', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          Share this article
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={shareOnLinkedIn}
            title="Share on LinkedIn"
            aria-label="Share on LinkedIn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              color: '#0055ff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: 0,
              fontSize: '0.75rem',
              fontWeight: 700,
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 85, 255, 0.08)';
              e.currentTarget.style.borderColor = '#d0deff';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.2)';
              e.currentTarget.style.borderColor = '#0055ff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            in
          </button>

          <button
            onClick={shareOnX}
            title="Share on X"
            aria-label="Share on X"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              color: '#0055ff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: 0,
              fontSize: '0.9rem',
              fontWeight: 700,
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 85, 255, 0.08)';
              e.currentTarget.style.borderColor = '#d0deff';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.2)';
              e.currentTarget.style.borderColor = '#0055ff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            𝕏
          </button>

          <button
            onClick={handleCopyLink}
            title={copied ? 'Link copied!' : 'Copy link'}
            aria-label="Copy link"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: copied ? 'rgba(34, 197, 94, 0.1)' : '#ffffff',
              color: copied ? '#22c55e' : '#0055ff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: 0,
              fontSize: '0.75rem',
              fontWeight: 700,
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (!copied) {
                e.currentTarget.style.background = 'rgba(0, 85, 255, 0.08)';
                e.currentTarget.style.borderColor = '#d0deff';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = copied ? '0 0 0 3px rgba(34, 197, 94, 0.2)' : '0 0 0 3px rgba(0, 85, 255, 0.2)';
              e.currentTarget.style.borderColor = copied ? '#22c55e' : '#0055ff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <Copy size={16} style={{ marginRight: '2px' }} /> {copied ? '✓' : ''}
          </button>

          <button
            onClick={shareViaEmail}
            title="Share via email"
            aria-label="Share via email"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              color: '#0055ff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: 0,
              fontSize: '0.75rem',
              fontWeight: 700,
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 85, 255, 0.08)';
              e.currentTarget.style.borderColor = '#d0deff';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.2)';
              e.currentTarget.style.borderColor = '#0055ff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <Mail size={16} />
          </button>
        </div>
      </div>

      {/* Was this helpful */}
      <div style={{ paddingTop: '1.5rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#667085', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          Was this article helpful?
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setHelpful(true)}
            aria-pressed={helpful === true}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              background: helpful === true ? 'rgba(0, 85, 255, 0.1)' : '#ffffff',
              color: helpful === true ? '#0055ff' : '#667085',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (helpful !== true) {
                e.currentTarget.style.borderColor = '#d0deff';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 85, 255, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (helpful !== true) {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 85, 255, 0.2)';
              e.currentTarget.style.borderColor = '#0055ff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            Yes
          </button>
          <button
            onClick={() => setHelpful(false)}
            aria-pressed={helpful === false}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              background: helpful === false ? 'rgba(220, 38, 38, 0.1)' : '#ffffff',
              color: helpful === false ? '#dc2626' : '#667085',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (helpful !== false) {
                e.currentTarget.style.borderColor = '#fecaca';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(220, 38, 38, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (helpful !== false) {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(220, 38, 38, 0.15)';
              e.currentTarget.style.borderColor = '#dc2626';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

// "Star Software for this" inside the article, partway down: the product
// that does what the post describes, picked by its topic (the same card as
// the sidebar's, laid out across the column).
function InlinePromo({ category }) {
  const promo = getArticlePromo(category);
  return (
    <aside className="rh-inline-promo" aria-label="Star Software for this">
      <span className="rh-inline-promo-ic" aria-hidden="true">
        <ScanLine size={22} />
      </span>
      <div className="rh-inline-promo-text">
        <p className="rh-inline-promo-kicker">Star Software for this</p>
        <p className="rh-inline-promo-title">{promo.title}</p>
        <p className="rh-inline-promo-desc">{promo.description}</p>
      </div>
      <a className="rh-inline-promo-cta" href={PROMO_LINK}>
        See how it works <ArrowRight size={16} aria-hidden="true" />
      </a>
    </aside>
  );
}

export default function ArticleDetail() {
  const { slug } = useParams();
  // The post itself, from the WordPress REST API (saved copy as fallback),
  // and the post list for related articles.
  const { status, article, sections: postSections } = useArticle(slug);
  const { articles } = useArticles();

  useDocumentMeta(
    article
      ? `${article.title} | Star Software Resources`
      : status === 'loading'
        ? 'Resources | Star Software'
        : 'Resource not found | Star Software',
    article ? article.description : undefined
  );

  // "Keep reading": three posts on the same topic, topped up with the
  // newest others when the topic has fewer.
  const related = useMemo(() => {
    if (!article) return [];
    const others = articles.filter((item) => item.slug !== article.slug);
    const sameTopic = others.filter((item) => item.category === article.category);
    const rest = others.filter((item) => item.category !== article.category);
    return [...sameTopic, ...rest].slice(0, 3);
  }, [article, articles]);

  const contentRef = useRef(null);
  // Keyed on the load status too: the body only mounts once the post has
  // loaded, and the contents list must scan it then.
  const headings = useArticleHeadings(contentRef, `${slug}:${status}`);

  // Plain post HTML in, stat cards / callouts / FAQ cards out. Posts without
  // figures of their own show Star Software's results for their topic.
  const sections = useMemo(() => {
    if (!postSections) return null;
    return withMarkup(
      enhanceArticleSections(postSections, {
        stats: getProductStats(article?.category),
        caption: PRODUCT_STATS_LABEL,
      })
    );
  }, [postSections, article]);

  // The number cards in the post roll into place as they come into view.
  useRollingNumbers(contentRef, sections);

  // The inline product card sits after the middle section (after the first
  // of two).
  const promoAfter = sections && sections.length >= 2 ? Math.max(0, Math.floor(sections.length / 2) - 1) : -1;

  if (status === 'loading') {
    return (
      <div className="resource-hub-page rh-article-page">
        <Navbar variant="solid" />
        <div className="rh-article-layout" aria-busy="true" aria-label="Loading article">
          <header className="rh-article-header">
            <Link to="/resources" className="rh-article-back">
              <ArrowLeft size={16} />
              Back to Resource Hub
            </Link>
            <span className="rh-skeleton rh-skeleton-line rh-skeleton-line--kicker" aria-hidden="true" />
            <span className="rh-skeleton rh-article-skeleton-title" aria-hidden="true" />
            <span className="rh-skeleton rh-article-skeleton-title rh-article-skeleton-title--short" aria-hidden="true" />
            <span className="rh-skeleton rh-skeleton-line rh-skeleton-line--meta" aria-hidden="true" />
          </header>
          <div className="rh-article-body" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => (
              <span
                key={index}
                className={`rh-skeleton rh-skeleton-line rh-article-skeleton-line${index % 3 === 2 ? ' rh-skeleton-line--short' : ''}`}
              />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="resource-hub-page">
        <Navbar variant="solid" />
        <div className="rh-not-found">
          <h1 className="rh-h1" style={{ fontSize: 28 }}>
            Resource not found
          </h1>
          <p className="rh-hero-copy">This guide may have moved or been retired.</p>
          <Link to="/resources" className="rh-featured-link" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
            <ArrowLeft size={18} />
            <span>Back to Resource Hub</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="resource-hub-page rh-article-page" style={{ position: 'relative' }}>
      {/* Watermarks */}
      <div className="watermark-left" style={{
        position: 'fixed',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%) rotate(-28deg)',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.18,
      }}>
        <img
          src={starLogo}
          alt=""
          style={{
            width: '320px',
            height: 'auto',
            userSelect: 'none',
            WebkitUserDrag: 'none',
            display: 'block',
          }}
        />
      </div>

      <div className="watermark-right" style={{
        position: 'fixed',
        top: '50%',
        transform: 'translateY(-50%) rotate(-28deg)',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.18,
      }}>
        <img
          src={starLogo}
          alt=""
          style={{
            width: '320px',
            height: 'auto',
            userSelect: 'none',
            WebkitUserDrag: 'none',
            display: 'block',
          }}
        />
      </div>

      <Navbar variant="solid" />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <article className="rh-article-layout">
        <header className="rh-article-header">
          <Link to="/resources" className="rh-article-back">
            <ArrowLeft size={16} />
            Back to Resource Hub
          </Link>
          <span className="rh-article-category">{article.categoryLabel}</span>
          <h1 className="rh-article-h1">{article.title}</h1>
          <div className="rh-article-meta">
            <span>{article.author}</span>
            <span>&middot;</span>
            <span>{formatResourceDate(article.date)}</span>
            <span>&middot;</span>
            <span>{article.readMinutes} min read</span>
          </div>
        </header>

        <div className="rh-article-body">
          <p className="rh-article-lede">{article.description}</p>

          <InlineToc headings={headings} />

          {/* The contents list is built from the <h2>s rendered in here, so
              article HTML fetched later can be rendered into this element
              (e.g. with dangerouslySetInnerHTML) and gets the list for free. */}
          <div className="rh-article-content" ref={contentRef}>
            {sections
              ? sections.map((section, index) => (
                  <React.Fragment key={section.id}>
                  <section style={{ marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                    {/* The opening section (text before a post's first heading) has no title. */}
                    {section.title && (
                      <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0a101d', lineHeight: 1.3, marginBottom: '1.75rem', letterSpacing: '-0.01em' }}>
                        {section.title}
                      </h2>
                    )}
                    {/* Post HTML cleaned to an allowlist of tags and attributes
                        (src/utils/postHtml.js) before it gets here. */}
                    <div
                      className="rh-article-html"
                      style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#3c4257' }}
                      dangerouslySetInnerHTML={section.markup}
                    />
                  </section>
                  {index === promoAfter && <InlinePromo category={article.category} />}
                  </React.Fragment>
                ))
              : (
                <p className="rh-article-note">
                  This guide is being expanded with the full write-up. In the meantime, reach out via{' '}
                  <a href="/#contact">Talk to us</a> if you'd like to discuss {article.categoryLabel.toLowerCase()}{' '}
                  for your team.
                </p>
              )}
          </div>

          {/* ARTICLE SHARING & FEEDBACK SECTION */}
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
            <ArticleSharing articleTitle={article.title} articleUrl={window.location.href} />
          </div>

          {/* KEEP READING */}
          {related.length > 0 && (
            <section className="rh-keep" aria-labelledby="rh-keep-title">
              <div className="rh-keep-head">
                <h2 id="rh-keep-title" className="rh-keep-title">
                  Keep reading
                </h2>
                <Link
                  to={`/resources?type=guide&category=${article.category}#library`}
                  className="rh-keep-more"
                >
                  More on {article.categoryLabel} <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
              <div className="rh-article-grid">
                {related.map((item) => (
                  <ArticleCard article={item} key={item.slug} />
                ))}
              </div>
            </section>
          )}

          {/* EXPLORE MORE RESOURCES CTA */}
          <div style={{ marginTop: '5rem', padding: '2.5rem', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(0, 85, 255, 0.03) 0%, rgba(124, 58, 237, 0.02) 100%)', border: '1px solid #e0d9ff', textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0a101d', marginBottom: '0.75rem' }}>Explore more resources</p>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#3c4257', marginBottom: '1.5rem' }}>Explore practical guides, engineering insights and automation resources from Star Software.</p>
            <Link to="/resources" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '9999px', background: '#0055ff', color: 'white', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.2s ease', outline: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0047cc'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 85, 255, 0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0055ff'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }} onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.2)'; }} onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>
              Explore Resources
              <span>→</span>
            </Link>
          </div>

          {/* DEMO REQUEST CTA */}
          <div style={{ marginTop: '5rem', position: 'relative', padding: '2rem', borderRadius: '12px', background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 100%)', border: '1px solid #d0deff', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #0055ff 0%, #7c3aed 100%)', opacity: 0.6 }}></div>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#0a101d', fontWeight: 700, margin: '0 0 0.75rem 0' }}>
              Ready to automate your document workflows?
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#3c4257', margin: '0 0 1.5rem 0' }}>
              Talk to the Star Software team about document extraction, validation and workflow automation.
            </p>
            <a href="/#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '9999px', background: '#0055ff', color: 'white', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.2s ease', outline: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0047cc'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 85, 255, 0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0055ff'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }} onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.2)'; }} onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>
              Get a Demo
              <span>→</span>
            </a>
          </div>

          {/* ARTICLE FOOTER METADATA */}
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: '#667085', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, color: '#0a101d' }}>Star Software</span>
              <span>&middot;</span>
              <span>{article.categoryLabel}</span>
              <span>&middot;</span>
              <span>Updated {formatResourceDate(article.date)}</span>
            </div>
          </div>
        </div>

        <ArticleAside headings={headings} category={article.category} />
        </article>

        <Footer />
      </div>
    </div>
  );
}
