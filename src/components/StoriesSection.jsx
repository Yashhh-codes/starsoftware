import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, ChevronDown } from 'lucide-react';
import { STORIES } from '../data/customerStories';
import { SectionHead } from './ResourceSections';
import './ResourceExtras.css';

// Case studies and success stories (src/data/customerStories.js), all in
// one section and one list, with no split between the two kinds.

// In tab order: success stories first.
export const STORY_KINDS = [
  { id: 'success-story', label: 'Success story', plural: 'Success stories' },
  { id: 'case-study', label: 'Case study', plural: 'Case studies' },
];

export const STORY_TOPICS = {
  ap: 'AP automation',
  ar: 'AR automation',
  coa: 'CoA & MTR automation',
  mtr: 'MTR automation',
  po: 'Sales order automation',
};

export function kindLabel(kind) {
  return STORY_KINDS.find((item) => item.id === kind)?.label || 'Customer story';
}

export function StoryCard({ story }) {
  return (
    <article className="rx-story">
      <Link to={`/resources/stories/${story.slug}`} className="rx-story-media" tabIndex={-1} aria-hidden="true">
        {story.image ? <img src={story.image} alt="" loading="lazy" /> : <Building2 size={40} />}
        <span className="rx-story-kind rx-story-kind--success-story">Customer story</span>
      </Link>
      <div className="rx-story-body">
        <p className="rx-story-company">
          <Building2 size={15} aria-hidden="true" />
          {story.company}
          <span className="rx-story-topic">{STORY_TOPICS[story.topic]}</span>
        </p>
        <Link to={`/resources/stories/${story.slug}`} className="rs-title-link">
          <h3 className="rx-story-title">{story.title}</h3>
        </Link>
        <p className="rs-desc rx-story-desc">{story.summary}</p>
        <Link to={`/resources/stories/${story.slug}`} className="rs-read rx-story-read">
          Read the story <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

// The first six; the rest behind "Show more stories".
const FIRST = 6;

export default function StoriesSection() {
  const [all, setAll] = useState(false);
  const list = all ? STORIES : STORIES.slice(0, FIRST);
  return (
    <section id="stories" className="rs-section" aria-labelledby="rx-stories-heading">
      <SectionHead id="rx-stories-heading" eyebrow="Case studies & success stories" title="How teams automate with Star Software" />
      <div className="rx-stories">
        {list.map((story) => (
          <StoryCard story={story} key={story.slug} />
        ))}
      </div>
      {STORIES.length > FIRST && (
        <div className="rx-more">
          <button type="button" className="rx-more-btn" aria-expanded={all} onClick={() => setAll((v) => !v)}>
            {all ? 'Show fewer stories' : 'Show more stories'}
            <ChevronDown size={18} aria-hidden="true" style={all ? { transform: 'rotate(180deg)' } : undefined} />
          </button>
        </div>
      )}
    </section>
  );
}
