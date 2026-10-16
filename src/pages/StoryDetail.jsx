import React, { useEffect, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArticleAside, InlineToc, useArticleHeadings } from '../components/ArticleToc';
import { StoryCard, STORY_TOPICS, kindLabel } from '../components/StoriesSection';
import { STORIES } from '../data/customerStories';
import { splitSections } from '../utils/postHtml';
import { enhanceArticleSections } from '../utils/enhanceArticle';
import './ResourceHub.css';
import '../components/ArticleBlocks.css';
import '../components/ResourceExtras.css';
import './ResourceResponsive.css';

// A case study or success story from starsoftware.co, in the article
// layout: sections from its headings, the "On this page" column, and the
// same automatic callouts and number cards (from the story's own figures).

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

  const sections = useMemo(() => (story ? enhanceArticleSections(splitSections(story.html)) : null), [story]);

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
            {kindLabel(story.kind)} &middot; {STORY_TOPICS[story.topic]}
          </span>
          <h1 className="rh-article-h1">{story.title}</h1>
          <div className="rh-article-meta">
            <Building2 size={16} aria-hidden="true" />
            <span>{story.company}</span>
          </div>
        </header>

        <div className="rh-article-body">
          <p className="rh-article-lede">{story.summary}</p>
          {story.image && <img className="rx-story-hero" src={story.image} alt="" />}

          <InlineToc headings={headings} />

          <div className="rh-article-content" ref={contentRef}>
            {sections.map((section) => (
              <section
                key={section.id}
                style={{ marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}
              >
                {section.title && (
                  <h2
                    style={{
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: '#0a101d',
                      lineHeight: 1.3,
                      marginBottom: '1.75rem',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {section.title}
                  </h2>
                )}
                {/* Captured story HTML, cleaned to an allowlist of tags and
                    attributes (src/data/customerStories.js). */}
                <div
                  className="rh-article-html"
                  style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#3c4257' }}
                  dangerouslySetInnerHTML={{ __html: section.html }}
                />
              </section>
            ))}
          </div>

          <a className="rx-story-source" href={story.sourceUrl}>
            Also on starsoftware.co <ArrowRight size={15} aria-hidden="true" />
          </a>

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
              <h2 className="rh-h2">See what Star Software can do for your documents</h2>
              <p className="rh-crosssell-copy">
                Talk to the team about automating your {STORY_TOPICS[story.topic].replace(' automation', '')} workflows.
              </p>
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
