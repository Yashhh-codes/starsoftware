// Live posts from the starsoftware.co WordPress REST API, mapped to the
// article shape the hub and article pages use. The API sends CORS headers for
// any origin, so the browser calls it directly.
//
// - fetchArticles(): every post's card fields, without bodies (~70 KB per
//   100 posts), plus tag names and card-sized images. Fetched once per visit.
// - fetchArticle(slug): one post with its body, cleaned and split into the
//   sections ArticleDetail renders.
//
// Card fields come from Yoast's head data where possible (description,
// author, reading time, image), which saves fetching users and bodies.

import { cleanPostHtml, splitSections, textOf } from '../utils/postHtml';

export const WP_API_URL = (import.meta.env.VITE_WP_API_URL || 'https://starsoftware.co/wp-json/wp/v2').replace(/\/$/, '');

const REQUEST_TIMEOUT_MS = 15000;
const PER_PAGE = 100;

const CARD_FIELDS = [
  'id',
  'slug',
  'date',
  'title',
  'categories',
  'tags',
  'sticky',
  'featured_media',
  'yoast_head_json.description',
  'yoast_head_json.twitter_misc',
  'yoast_head_json.og_image',
].join(',');

const POST_FIELDS = `${CARD_FIELDS},content,excerpt`;

// WordPress category slug -> hub category id, in the order labels list them.
// Posts filed only under "Article" or "Others" become 'others'.
const CATEGORY_BY_WP_SLUG = [
  ['ap-automation', 'ap', 'AP'],
  ['ar-automation', 'ar', 'AR'],
  ['coa', 'coa', 'CoA'],
  ['mtr', 'mtr', 'MTR'],
  ['qa-automation', 'qa', 'QA'],
  ['transcript-automation', 'transcript', 'Transcript'],
];

// Posts written under the site's admin accounts aren't bylines.
const AUTHOR_FALLBACK = 'Star Software';
const ADMIN_AUTHOR = /\badmin\b/i;

async function getJSON(path, params) {
  const url = new URL(`${WP_API_URL}/${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`WordPress API ${response.status} for ${path}`);
    return { data: await response.json(), totalPages: Number(response.headers.get('X-WP-TotalPages')) || 1 };
  } finally {
    clearTimeout(timer);
  }
}

// Every page of a collection: the first tells us how many there are, the rest
// load in parallel.
async function getAllPages(path, params) {
  const first = await getJSON(path, { ...params, per_page: PER_PAGE, page: 1 });
  const rest = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, i) =>
      getJSON(path, { ...params, per_page: PER_PAGE, page: i + 2 }).then((r) => r.data)
    )
  );
  return first.data.concat(...rest);
}

// `include` lookups, chunked to the API's 100-per-request limit.
async function getByIds(path, ids, fields) {
  const unique = [...new Set(ids)].filter(Boolean);
  const chunks = [];
  for (let i = 0; i < unique.length; i += PER_PAGE) chunks.push(unique.slice(i, i + PER_PAGE));
  const results = await Promise.all(
    chunks.map((chunk) => getJSON(path, { include: chunk.join(','), per_page: PER_PAGE, _fields: fields }).then((r) => r.data))
  );
  return results.flat();
}

let categoriesPromise = null;
function fetchCategories() {
  if (!categoriesPromise) {
    categoriesPromise = getJSON('categories', { per_page: PER_PAGE, _fields: 'id,slug' })
      .then(({ data }) => new Map(data.map((c) => [c.id, c.slug])))
      .catch((error) => {
        categoriesPromise = null;
        throw error;
      });
  }
  return categoriesPromise;
}

function decode(html) {
  return textOf(html || '');
}

function categoryFields(post, categorySlugs) {
  const slugs = new Set(post.categories.map((id) => categorySlugs.get(id)));
  const hits = CATEGORY_BY_WP_SLUG.filter(([wpSlug]) => slugs.has(wpSlug));
  if (!hits.length) return { category: 'others', categories: ['others'], categoryLabel: 'Others' };
  return {
    category: hits[0][1],
    categories: hits.map(([, id]) => id),
    categoryLabel: `${hits.map(([, , stem]) => stem).join(' & ')} Automation`,
  };
}

// First tag that doesn't just repeat the category ("AR automation" on an AR
// post); empty when a post has none.
function tagFor(post, tagNames, categoryLabel) {
  const names = post.tags.map((id) => tagNames.get(id)).filter(Boolean);
  const label = categoryLabel.toLowerCase();
  const stem = label.split(' ')[0];
  return names.find((name) => !label.includes(name.toLowerCase()) && !name.toLowerCase().includes(stem)) || names[0] || '';
}

function readMinutesFrom(post, bodyText) {
  const yoast = post.yoast_head_json?.twitter_misc?.['Est. reading time'];
  const minutes = parseInt(yoast, 10);
  if (minutes > 0) return minutes;
  const words = (bodyText || '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 225));
}

function toArticle(post, { categorySlugs, tagNames, cardImages }, bodyText) {
  const yoast = post.yoast_head_json || {};
  const { category, categories, categoryLabel } = categoryFields(post, categorySlugs);
  const writtenBy = yoast.twitter_misc?.['Written by'];
  return {
    id: post.id,
    slug: post.slug,
    featured: Boolean(post.sticky),
    type: 'guide',
    // `category` is the primary topic (labels, promo card, number cards);
    // `categories` is every hub topic the post is filed under, for filters.
    category,
    categories,
    categoryLabel,
    tag: tagFor(post, tagNames, categoryLabel),
    title: decode(post.title?.rendered),
    description: yoast.description || decode(post.excerpt?.rendered).replace(/\s*\[…\]\s*$/, '…'),
    author: writtenBy && !ADMIN_AUTHOR.test(writtenBy) ? writtenBy : AUTHOR_FALLBACK,
    date: post.date.slice(0, 10),
    readMinutes: readMinutesFrom(post, bodyText),
    // A card-sized rendition when we have one; the full share image otherwise.
    image: cardImages.get(post.featured_media) || yoast.og_image?.[0]?.url || null,
  };
}

async function fetchTagNames(posts) {
  const tags = await getByIds('tags', posts.flatMap((p) => p.tags), 'id,name').catch(() => []);
  return new Map(tags.map((t) => [t.id, decode(t.name)]));
}

// medium_large (768w) suits the 16:10 card; the full uploads are ~1.5k px PNGs.
// _fields can't reach deeper than media_details, so the whole object comes
// back (~300 bytes per image gzipped).
async function fetchCardImages(posts) {
  const media = await getByIds(
    'media',
    posts.map((p) => p.featured_media),
    'id,source_url,media_details'
  ).catch(() => []);
  return new Map(
    media.map((m) => [
      m.id,
      m.media_details?.sizes?.medium_large?.source_url || m.media_details?.sizes?.large?.source_url || m.source_url,
    ])
  );
}

let articlesPromise = null;

// Newest first. Cached for the visit; a failed attempt can be retried.
export function fetchArticles() {
  if (!articlesPromise) {
    articlesPromise = (async () => {
      const [posts, categorySlugs] = await Promise.all([
        getAllPages('posts', { _fields: CARD_FIELDS, orderby: 'date', order: 'desc' }),
        fetchCategories(),
      ]);
      const [tagNames, cardImages] = await Promise.all([fetchTagNames(posts), fetchCardImages(posts)]);
      return posts.map((post) => toArticle(post, { categorySlugs, tagNames, cardImages }));
    })().catch((error) => {
      articlesPromise = null;
      throw error;
    });
  }
  return articlesPromise;
}

const articleCache = new Map();

// One post with its body: { article, sections }, or null when no post has
// that slug.
export function fetchArticle(slug) {
  if (!articleCache.has(slug)) {
    const request = (async () => {
      const [{ data }, categorySlugs] = await Promise.all([
        getJSON('posts', { slug, _fields: POST_FIELDS }),
        fetchCategories(),
      ]);
      const post = data[0];
      if (!post) return null;
      const [tagNames, cardImages] = await Promise.all([fetchTagNames([post]), fetchCardImages([post])]);
      const body = cleanPostHtml(post.content?.rendered || '');
      return {
        article: toArticle(post, { categorySlugs, tagNames, cardImages }, textOf(body)),
        sections: splitSections(body),
      };
    })().catch((error) => {
      articleCache.delete(slug);
      throw error;
    });
    articleCache.set(slug, request);
  }
  return articleCache.get(slug);
}
