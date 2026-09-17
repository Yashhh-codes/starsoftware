import React, { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ARTICLES, formatResourceDate } from '../data/resourcesData';
import './ResourceHub.css';

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

export default function ArticleDetail() {
  const { slug } = useParams();
  const article = useMemo(() => ARTICLES.find((item) => item.slug === slug), [slug]);

  useDocumentMeta(
    article ? `${article.title} | Star Software Resources` : 'Resource not found | Star Software',
    article ? article.description : undefined
  );

  const related = useMemo(() => {
    if (!article) return [];
    return ARTICLES.filter(
      (item) => item.slug !== article.slug && item.category === article.category
    ).slice(0, 4);
  }, [article]);

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
    <div className="resource-hub-page">
      <Navbar variant="solid" />

      <article>
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

          <p className="rh-article-note">
            This guide is being expanded with the full write-up. In the meantime, reach out via{' '}
            <a href="/#contact">Talk to us</a> if you'd like to discuss {article.categoryLabel.toLowerCase()}{' '}
            for your team.
          </p>

          {related.length > 0 && (
            <>
              <h2 className="rh-related-heading">Related resources</h2>
              <div className="rh-related-grid">
                {related.map((item) => (
                  <Link className="rh-related-card" to={`/resources/${item.slug}`} key={item.slug}>
                    <span className="rh-related-card-category">{item.categoryLabel}</span>
                    <p className="rh-related-card-title">{item.title}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
}
