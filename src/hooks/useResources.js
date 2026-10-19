import { useEffect, useState } from 'react';
import { fetchArticle, fetchArticles } from '../api/wordpress';
import { ARTICLES } from '../data/resourcesData';

// Live data from WordPress, with the bundled snapshot (resourcesData.js and
// articleContent.js) as the fallback when the API can't be reached, so the
// hub never shows an empty page. The saved post bodies are only fetched
// (as their own small file) when that fallback is actually needed.
//
// status: 'loading' | 'live' | 'fallback'

export function useArticles() {
  const [state, setState] = useState({ status: 'loading', articles: [] });

  useEffect(() => {
    let active = true;
    fetchArticles()
      .then((articles) => active && setState({ status: 'live', articles }))
      .catch((error) => {
        console.warn('Resource hub: showing saved articles, WordPress API unavailable.', error);
        if (active) setState({ status: 'fallback', articles: ARTICLES });
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}

// status: 'loading' | 'live' | 'fallback' | 'notfound'
export function useArticle(slug) {
  const [state, setState] = useState({ slug, status: 'loading', article: null, sections: null });

  useEffect(() => {
    let active = true;
    setState({ slug, status: 'loading', article: null, sections: null });
    fetchArticle(slug)
      .then((result) => {
        if (!active) return;
        setState(
          result
            ? { slug, status: 'live', article: result.article, sections: result.sections }
            : { slug, status: 'notfound', article: null, sections: null }
        );
      })
      .catch(async (error) => {
        if (!active) return;
        console.warn(`Article "${slug}": showing saved copy, WordPress API unavailable.`, error);
        const article = ARTICLES.find((item) => item.slug === slug);
        if (!article) {
          setState({ slug, status: 'notfound', article: null, sections: null });
          return;
        }
        const { ARTICLE_CONTENT } = await import('../data/articleContent').catch(() => ({ ARTICLE_CONTENT: {} }));
        if (active) setState({ slug, status: 'fallback', article, sections: ARTICLE_CONTENT[slug]?.sections || null });
      });
    return () => {
      active = false;
    };
  }, [slug]);

  // Until the effect above resets it, state can still describe the previous slug.
  return state.slug === slug ? state : { slug, status: 'loading', article: null, sections: null };
}
