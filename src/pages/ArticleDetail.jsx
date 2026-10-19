import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Copy, Mail, ScanLine } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArticleAside, InlineToc, useArticleHeadings } from '../components/ArticleToc';
import ArticleCard from '../components/ArticleCard';
import { getArticlePromo, PROMO_LINK } from '../data/articlePromos';
import { useRollingNumbers } from '../components/RollingNumber';
import { formatResourceDate } from '../data/resourcesData';
import { useArticle, useArticles } from '../hooks/useResources';
import { dropRepeatedTitle, enhanceArticleSections, withMarkup } from '../utils/enhanceArticle';
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
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`, '_blank');
  };

  const shareOnX = () => {
    const text = `Check out "${articleTitle}" from Star Software - ${articleUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = `Check out: ${articleTitle}`;
    const body = `I thought you'd find this article interesting: ${articleTitle}\n\n${articleUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="rh-share">
      <div className="rh-share-group">
        <p className="rh-share-label" id="rh-share-label">
          Share this article
        </p>
        <div className="rh-share-buttons" role="group" aria-labelledby="rh-share-label">
          <button type="button" className="rh-share-btn" onClick={shareOnLinkedIn} title="Share on LinkedIn" aria-label="Share on LinkedIn">
            <span className="rh-share-in" aria-hidden="true">
              in
            </span>
          </button>
          <button type="button" className="rh-share-btn" onClick={shareOnX} title="Share on X" aria-label="Share on X">
            <span aria-hidden="true">𝕏</span>
          </button>
          <button
            type="button"
            className="rh-share-btn"
            onClick={handleCopyLink}
            title={copied ? 'Link copied' : 'Copy link'}
            aria-label={copied ? 'Link copied' : 'Copy link'}
          >
            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          </button>
          <button type="button" className="rh-share-btn" onClick={shareViaEmail} title="Share by email" aria-label="Share by email">
            <Mail size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="rh-share-group">
        <p className="rh-share-label" id="rh-helpful-label">
          Was this article helpful?
        </p>
        <div className="rh-share-buttons" role="group" aria-labelledby="rh-helpful-label">
          <button
            type="button"
            className={`rh-helpful-btn${helpful === true ? ' rh-helpful-btn--yes' : ''}`}
            aria-pressed={helpful === true}
            onClick={() => setHelpful(true)}
          >
            Yes
          </button>
          <button
            type="button"
            className={`rh-helpful-btn${helpful === false ? ' rh-helpful-btn--no' : ''}`}
            aria-pressed={helpful === false}
            onClick={() => setHelpful(false)}
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

  // A post written as plain prose has no headings to list; its contents
  // then lists the page's own parts, so every article has one.
  const tocHeadings = useMemo(() => {
    if (headings.length >= 2) return headings;
    return [
      { id: 'rh-overview', text: 'Overview' },
      ...headings,
      ...(related.length ? [{ id: 'rh-keep-title', text: 'Keep reading' }] : []),
      { id: 'rh-explore', text: 'Next steps' },
    ];
  }, [headings, related]);

  // Plain post HTML in, stat cards / callouts / FAQ cards out. Posts without
  // figures of their own show Star Software's results for their topic.
  const sections = useMemo(() => {
    if (!postSections) return null;
    return withMarkup(
      enhanceArticleSections(dropRepeatedTitle(postSections, article?.title), {
        stats: getProductStats(article?.category),
        caption: PRODUCT_STATS_LABEL,
      })
    );
  }, [postSections, article]);

  // The number cards in the post roll into place as they come into view.
  useRollingNumbers(contentRef, sections);

  // A larger rendition from the live API; the saved copy only has the card image.
  const cover = article?.cover || (article?.image ? { src: article.image } : null);

  // The inline product card sits after the middle section (after the only
  // section of a post written as one), so every post has one.
  const promoAfter = sections && sections.length ? Math.max(0, Math.floor(sections.length / 2) - 1) : -1;

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

        <div className="rh-article-body" id="rh-overview" tabIndex={-1}>
          {cover && (
            // The post's featured image; its artwork repeats the title, so
            // it's decorative for screen readers.
            <figure className="rh-article-cover">
              <img
                src={cover.src}
                alt=""
                width={cover.width || undefined}
                height={cover.height || undefined}
                decoding="async"
                fetchPriority="high"
              />
            </figure>
          )}

          <p className="rh-article-lede">{article.description}</p>

          <InlineToc headings={tocHeadings} />

          {/* The contents list is built from the <h2>s rendered in here, so
              article HTML fetched later can be rendered into this element
              (e.g. with dangerouslySetInnerHTML) and gets the list for free. */}
          <div className="rh-article-content" ref={contentRef}>
            {sections
              ? sections.map((section, index) => (
                  <React.Fragment key={section.id}>
                  <section className="rh-article-section">
                    {/* The opening section (text before a post's first heading) has no title. */}
                    {section.title && <h2 className="rh-article-section-title">{section.title}</h2>}
                    {/* Post HTML cleaned to an allowlist of tags and attributes
                        (src/utils/postHtml.js) before it gets here. */}
                    <div className="rh-article-html" dangerouslySetInnerHTML={section.markup} />
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

          <ArticleSharing articleTitle={article.title} articleUrl={window.location.href} />

          {/* KEEP READING */}
          {related.length > 0 && (
            <section className="rh-keep" aria-labelledby="rh-keep-title">
              <div className="rh-keep-head">
                <h2 id="rh-keep-title" className="rh-keep-title" tabIndex={-1}>
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

          {/* One closing call to action, in the hub's style. */}
          <aside className="rh-article-cta" id="rh-explore" tabIndex={-1} aria-labelledby="rh-article-cta-title">
            <p className="rh-article-cta-kicker">Star Software</p>
            <h2 id="rh-article-cta-title" className="rh-article-cta-title">
              Ready to automate your document workflows?
            </h2>
            <p className="rh-article-cta-text">
              Talk to our team about document extraction, validation and workflow automation, or keep exploring
              guides from the resource hub.
            </p>
            <div className="rh-article-cta-actions">
              <a className="rh-btn-primary" href="/#contact">
                Get a Demo <ArrowRight size={16} aria-hidden="true" />
              </a>
              <Link className="rh-btn-secondary" to="/resources">
                Explore resources
              </Link>
            </div>
          </aside>

          <p className="rh-article-foot-meta">
            <strong>Star Software</strong>
            <span aria-hidden="true">&middot;</span>
            <span>{article.categoryLabel}</span>
            <span aria-hidden="true">&middot;</span>
            <span>Updated {formatResourceDate(article.date)}</span>
          </p>
        </div>

        <ArticleAside headings={tocHeadings} category={article.category} />
        </article>

        <Footer />
      </div>
    </div>
  );
}
