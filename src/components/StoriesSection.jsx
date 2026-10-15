import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import { STORIES } from '../data/customerStories';
import { SectionHead } from './ResourceSections';
import './ResourceExtras.css';

// Case studies and success stories from starsoftware.co in one section.
// ?stories=case-study|success-story preselects the filter, which is how the
// navbar's Case Study and Success Story items land here.

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
};

export function kindLabel(kind) {
  return STORY_KINDS.find((item) => item.id === kind)?.label || 'Customer story';
}

export function StoryCard({ story }) {
  return (
    <article className="rx-story">
      <Link to={`/resources/stories/${story.slug}`} className="rx-story-media" tabIndex={-1} aria-hidden="true">
        {story.image ? <img src={story.image} alt="" loading="lazy" /> : <Building2 size={40} />}
        <span className={`rx-story-kind rx-story-kind--${story.kind}`}>{kindLabel(story.kind)}</span>
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

export default function StoriesSection() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const fromUrl = searchParams.get('stories');
  const known = STORY_KINDS.some((kind) => kind.id === fromUrl);
  const [filter, setFilter] = useState(known ? fromUrl : 'all');

  // Each navigation here (Case Study / Success Story in the navbar) sets
  // the filter from the link, or back to every story when it names none.
  useEffect(() => {
    setFilter(STORY_KINDS.some((kind) => kind.id === fromUrl) ? fromUrl : 'all');
  }, [fromUrl, location.key]);

  const counts = useMemo(() => {
    const result = { all: STORIES.length };
    STORY_KINDS.forEach((kind) => {
      result[kind.id] = STORIES.filter((story) => story.kind === kind.id).length;
    });
    return result;
  }, []);

  const list = filter === 'all' ? STORIES : STORIES.filter((story) => story.kind === filter);
  const options = [{ id: 'all', plural: 'All stories' }, ...STORY_KINDS];

  return (
    <section id="stories" className="rs-section" aria-labelledby="rx-stories-heading">
      <SectionHead
        id="rx-stories-heading"
        eyebrow="Customer stories"
        title="How teams automate with Star Software"
        action={
          <div className="rx-segmented" role="tablist" aria-label="Story type">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={filter === option.id}
                className={`rx-segment${filter === option.id ? ' rx-segment--active' : ''}`}
                onClick={() => setFilter(option.id)}
              >
                {option.plural}
                <span className="rx-segment-count">{counts[option.id]}</span>
              </button>
            ))}
          </div>
        }
      />
      <div className="rx-stories">
        {list.map((story) => (
          <StoryCard story={story} key={story.slug} />
        ))}
      </div>
    </section>
  );
}
