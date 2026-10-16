import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { TOPIC_ICONS } from './ResourceSections';
import { formatResourceDate } from '../data/resourcesData';

// An article card: artwork, topic kicker, title, summary, date and read
// time. Used by the hub's library and an article's "Keep reading" row.
export default function ArticleCard({ article }) {
  const MediaIcon = TOPIC_ICONS[article.category] || Layers;
  return (
    <article className="rh-card">
      {/* The artwork carries its own headline text, so nothing sits on top
          of it and the frame matches its 16:10 shape. */}
      <div className="rh-card-media">
        {article.image ? (
          <img src={article.image} alt="" className="rh-card-image" loading="lazy" />
        ) : (
          <MediaIcon size={56} strokeWidth={1.5} className="rh-card-media-icon" />
        )}
      </div>
      <div className="rh-card-body">
        <div>
          <p className="rh-card-kicker">
            {article.categoryLabel}
            {article.tag && (
              <>
                <span aria-hidden="true"> · </span>
                {article.tag}
              </>
            )}
          </p>
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
            {article.type === 'case-study' ? 'Read case study' : 'Read guide'}{' '}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
