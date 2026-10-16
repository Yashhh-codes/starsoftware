# Star Software website

The redesigned Star Software marketing site: a homepage hero and the
Resources section, which pulls its blog posts live from starsoftware.co's
WordPress.

**Live site:** https://starsoftware.vercel.app

Built with React 19, Vite 6 and React Router 7, with lucide-react for icons.
Styles are plain CSS files beside the components (no CSS framework).

## Getting started

You need Node.js 18 or newer.

```bash
npm install
npm run dev
```

The site runs at http://localhost:3000.

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload          |
| `npm run build`   | Build the production site into `dist/`        |
| `npm run preview` | Serve the built `dist/` locally to check it   |

### Environment

One optional setting, `VITE_WP_API_URL`: the WordPress REST API the posts
come from. It defaults to `https://starsoftware.co/wp-json/wp/v2`, so nothing
needs setting to run the site. To point it at a staging WordPress, copy
`.env.example` to `.env.local` and change the URL (and set the same variable
in Vercel's project settings for deploys).

## Pages

| Path                       | Page                                                           |
| -------------------------- | -------------------------------------------------------------- |
| `/`                        | Homepage: hero video, customer logos, COA feature cards        |
| `/resources`               | Resources landing page (all sections below)                    |
| `/resources/:slug`         | A blog post, with its "On this page" sidebar                   |
| `/resources/stories/:slug` | A case study or success story                                  |

The resources page, top to bottom: hero with search and topic pills, Latest,
the article library (filters, sort, pages), Browse by topic, Whitepapers, QA
Engineering Resource Center, Comparison sheets, Customer stories, Long reads,
Industry news, FAQs, and a closing call to action.

Links like `/resources#faqs`, `/resources?stories=case-study#stories` or
`/resources?type=guide&category=mtr#library` open the page at that section
with the matching tab or filter selected. The navbar's Resources menu
(`src/data/resourceNav.js`) uses these.

## Where the content comes from

| Content                        | Source                                              | Updates                    |
| ------------------------------ | --------------------------------------------------- | -------------------------- |
| Blog posts (all of them)       | WordPress REST API, fetched in the browser          | Live, on every page load   |
| FAQs                           | `src/data/faqData.js`, copied from starsoftware.co  | By hand                    |
| Case studies, success stories  | `src/data/customerStories.js`, copied likewise      | By hand                    |
| QA checklist PDFs              | `src/data/qaResources.js`, links to starsoftware.co | By hand                    |
| Whitepapers                    | `src/data/whitepapersData.js`                       | **Placeholder content**    |

- **Blog posts** are fetched by `src/api/wordpress.js` and the hooks in
  `src/hooks/useResources.js`. A new post on WordPress shows up on the next
  page load with no code change. If the API can't be reached, the hub falls
  back to a saved snapshot (`src/data/resourcesData.js` and
  `articleContent.js`) so it never shows an empty page.
- **Post bodies** are cleaned to an allowlist of tags (`src/utils/postHtml.js`)
  and then dressed up automatically (`src/utils/enhanceArticle.js`): item
  cards, numbered steps, fact rows, process flows, card grids, framed tables,
  callouts, number cards, FAQ cards and pull quotes are picked out of the
  post's own structure and text, so new posts get them too (see DESIGN.md).
- **FAQs, stories and QA PDFs** aren't available through the WordPress API, so
  they were copied from the live pages. When those pages change, rebuild the
  data files from them rather than editing by hand.
- **Whitepapers** are topic outlines only, with no PDFs attached yet; their
  download buttons stay disabled until each entry gets a `file` URL.

## Project layout

```
src/
  api/wordpress.js       WordPress REST client (posts, categories, tags, media)
  hooks/useResources.js  Live posts with the saved-snapshot fallback
  pages/                 ResourceHub, ArticleDetail, StoryDetail
  components/            Navbar, Footer, homepage sections, resource sections
  data/                  Navbar links, FAQs, stories, QA PDFs, whitepapers,
                         product stats and the saved post snapshot
  utils/                 Post HTML cleaning, section splitting, enhancements
vid2/                    The homepage hero video
public/feature-videos/   The two COA feature videos on the homepage
```

Layout across screen sizes is handled in `src/pages/ResourceResponsive.css`:
on phones the card shelves swipe sideways, and from 1600px wide the resources
pages scale up as a whole so they don't look small on large monitors.

## Deploying

Vercel builds and deploys automatically on every push to `main`
(`vercel.json` holds the settings, including the rewrite that lets
`/resources/...` URLs load directly).

If a push doesn't appear on the live site, check the project's
**Deployments** tab on vercel.com: if no deployment was created for the
commit, use **Redeploy** on the latest one.

The tag `before-resources-redesign` marks the resources page before the live
WordPress feed and the shelves redesign, in case it's ever needed again.
