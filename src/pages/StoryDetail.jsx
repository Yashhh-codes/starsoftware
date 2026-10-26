import React, { useEffect, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArticleAside, InlineToc, useArticleHeadings } from '../components/ArticleToc';
import { StoryCard, STORY_TOPICS, kindLabel } from '../components/StoriesSection';
import { STORIES } from '../data/customerStories';
import { splitSections } from '../utils/postHtml';
import { enhanceArticleSections, withMarkup } from '../utils/enhanceArticle';
import RollingNumber, { useRollingNumbers } from '../components/RollingNumber';
import './ResourceHub.css';
import '../components/ArticleBlocks.css';
import '../components/ResourceExtras.css';
import './ResourceResponsive.css';

// A case study or success story (src/data/customerStories.js) in the
// article layout: its number cards under the intro, sections from its
// headings with the "On this page" column, and its own call to action.

function useDocumentMeta(title, description) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    const previous = meta?.getAttribute('content');
    if (meta && description) meta.setAttribute('content', description);
    return () => {
      document.title = previousTitle;
      if (meta && previous != null) meta.setAttribute('content', previous);
    };
  }, [title, description]);
}

export default function StoryDetail() {
  const { slug } = useParams();
  const story = STORIES.find((item) => item.slug === slug);

  useDocumentMeta(
    story ? `${story.company}: ${kindLabel(story.kind)} | Star Software Resources` : 'Story not found | Star Software',
    story?.summary
  );

  const contentRef = useRef(null);
  const headings = useArticleHeadings(contentRef, slug);

  const sections = useMemo(
    // The story's number cards are its own (story.metrics), so none are
    // made from the figures in its text.
    () => (story ? withMarkup(enhanceArticleSections(splitSections(story.html), null, { figures: false })) : null),
    [story]
  );
  useRollingNumbers(contentRef, sections);

  // Other stories, same topic first.
  const related = useMemo(() => {
    if (!story) return [];
    const others = STORIES.filter((item) => item.slug !== story.slug);
    return [...others.filter((item) => item.topic === story.topic), ...others.filter((item) => item.topic !== story.topic)].slice(0, 2);
  }, [story]);

  if (!story) {
    return (
      <div className="resource-hub-page">
        <Navbar variant="solid" />
        <div className="rh-not-found">
          <h1 className="rh-h1" style={{ fontSize: 28 }}>
            Story not found
          </h1>
          <p className="rh-hero-copy">This story may have moved.</p>
          <Link to="/resources#stories" className="rh-featured-link" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
            <ArrowLeft size={18} />
            <span>All customer stories</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="resource-hub-page rh-article-page">
      <Navbar variant="solid" />

      <article className="rh-article-layout">
        <header className="rh-article-header">
          <Link to="/resources#stories" className="rh-article-back">
            <ArrowLeft size={16} />
            All customer stories
          </Link>
          <span className="rh-article-category">
            {kindLabel(story.kind)} &middot; {story.label || STORY_TOPICS[story.topic]}
          </span>
          <h1 className="rh-article-h1">{story.title}</h1>
          <div className="rh-article-meta">
            <Building2 size={16} aria-hidden="true" />
            <span>{story.company}</span>
          </div>
        </header>

        <div className="rh-article-body">
          <p className="rh-article-lede">{story.summary}</p>
          {story.metrics?.length > 0 && (
            <div className="rh-stats rx-story-metrics">
              {story.metrics.map((metric) => (
                <div className="rh-stat" key={metric.label}>
                  {/* Long values ("Hours → Seconds") drop a size, as in posts. */}
                  <p className={metric.value.length > 6 ? 'rh-stat-value rh-stat-value--long' : 'rh-stat-value'}>
                    <RollingNumber value={metric.value} />
                  </p>
                  <p className="rh-stat-label">{metric.label}</p>
                  {metric.note && <p className="rh-stat-note">{metric.note}</p>}
                </div>
              ))}
            </div>
          )}
          {story.image && <img className="rx-story-hero" src={story.image} alt="" />}

          <InlineToc headings={headings} />

          <div className="rh-article-content" ref={contentRef}>
            {sections.map((section) => (
              <section key={section.id} className="rh-article-section">
                {section.title && <h2 className="rh-article-section-title">{section.title}</h2>}
                {/* Captured story HTML, cleaned to an allowlist of tags and
                    attributes (src/data/customerStories.js). */}
                <div className="rh-article-html" dangerouslySetInnerHTML={section.markup} />
              </section>
            ))}
          </div>

          {related.length > 0 && (
            <div className="rx-related">
              <span className="rh-section-eyebrow">More customer stories</span>
              <div className="rx-stories">
                {related.map((item) => (
                  <StoryCard story={item} key={item.slug} />
                ))}
              </div>
            </div>
          )}

          <div className="rh-crosssell" style={{ marginTop: '4rem' }}>
            <div className="rh-crosssell-stripe" aria-hidden="true" />
            <div className="rh-crosssell-inner" style={{ display: 'block' }}>
              <h2 className="rh-h2">{story.cta ? story.cta.replace(/\.$/, '') : 'See what Star Software can do for your documents'}</h2>
              <p className="rh-crosssell-copy">See how it works on your own documents in a live demo with the Star Software team.</p>
              <div className="rh-crosssell-ctas">
                <a className="rh-btn-primary" href="/#demo">
                  <span>Schedule a live demo</span>
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <ArticleAside headings={headings} category={story.topic === 'coa' ? 'coa' : story.topic} />
      </article>

      <Footer />
    </div>
  );
}
