# Star Software — design system

How the site looks and why, written from the code as it is now. Use it when
adding a section, a component or a page so new work matches what's there.

The resources section (`/resources` and its article and story pages) has the
fuller system and most of this document. The homepage is older and uses its
own simpler tokens; see [Homepage](#homepage) at the end.

## Principles

These came out of reviewing the pages as a first-time visitor would.

- **Readable without effort.** Body text is never smaller than 15px, and
  labels never smaller than 12px. Text that people are meant to read (QA
  descriptions, FAQ answers, article bodies) is 16–18px in a dark colour, not
  a pale grey.
- **Say what a section is for.** A section opens with a small eyebrow and a
  plain-language title ("Free checklists for checking steel paperwork", not
  just "QA Engineering Resource Center"). Lead with the task a visitor wants
  to do, and put official document names second.
- **Premium, subtle, clean.** White cards on a pale blue-white page, one
  hairline border, barely-there shadows, one purple accent. No heavy
  gradients or dark panels; colour is saved for actions and numbers.
- **Long content doesn't become a long scroll.** Long FAQ answers open in a
  side panel; card shelves swipe on phones; the library pages rather than
  growing.
- **New content styles itself.** Posts come live from WordPress, so number
  cards, callouts, FAQ cards and pull quotes are picked out of each post's
  own text automatically (`src/utils/enhanceArticle.js`) instead of being
  added by hand.

## Tokens

All defined on `.resource-hub-page` in `src/pages/ResourceHub.css`, so they
can't leak into the homepage. Use the variables, not the raw values.

### Colour

| Token                    | Value                     | Use                                              |
| ------------------------ | ------------------------- | ------------------------------------------------ |
| `--rh-primary`           | `#493ee5`                 | The accent: buttons, links, eyebrows, numbers    |
| `--rh-primary-hover`     | `#635bff`                 | Hover on primary buttons                         |
| `--rh-on-primary`        | `#ffffff`                 | Text on primary                                  |
| `--rh-primary-fixed`     | `#e2dfff`                 | Soft lavender fills (badges, eyebrow pills)      |
| `--rh-on-primary-fixed`  | `#0f0069`                 | Text on lavender                                 |
| `--rh-tertiary`          | `#00647a`                 | Teal end of the brand ribbon                     |
| `--rh-tertiary-fixed`    | `#b4ebff`                 | Pale teal in artwork placeholders                |
| `--rh-tertiary-fixed-dim`| `#3cd7ff`                 | Bright end of the top ribbon                     |
| `--rh-on-surface`        | `#071c32`                 | Headings and main text (deep navy, not black)    |
| `--rh-secondary`         | `#4e5f78`                 | Supporting text: descriptions, meta, labels      |
| `--rh-surface`           | `#f8f9ff`                 | Page background                                  |
| `--rh-surface-lowest`    | `#ffffff`                 | Cards                                            |
| `--rh-surface-low`       | `#eff4ff`                 | Quiet panels (the closing call to action)        |
| `--rh-surface-container` … `-highest` | `#e6eeff` → `#d3e4ff` | Deeper tints, used sparingly             |
| `--rh-outline-variant`   | `#c7c4d8`                 | Dividers where a hairline isn't enough           |
| `--rh-card-border`       | `rgba(7, 28, 50, 0.07)`   | The one hairline every white card shares         |

Two colours sit outside the tokens on purpose:

- **Article lavender** — `#eeefff` fill with a `rgba(73, 62, 229, 0.22)`
  border, for callouts and number cards inside posts.
- **Readable body grey** — `#33465e` for long descriptions (QA rows), a step
  darker than `--rh-secondary` so it reads comfortably.

### Type

Fonts are loaded in `index.html` from Google Fonts.

- `--rh-font`: **Hanken Grotesk** (400–700) for everything.
- `--rh-font-mono`: **JetBrains Mono** for the small labels on article
  callouts.

| Role                         | Size / line-height | Weight | Notes                               |
| ---------------------------- | ------------------ | ------ | ----------------------------------- |
| Hero title                   | 60–92px / 1.12     | 700    | Scales with width; −0.03em tracking |
| Section title                | 38px / 1.15        | 700    | −0.02em                             |
| Section eyebrow              | 18px / 24px        | 700    | Uppercase, 0.08em, primary          |
| Article body                 | 17.6px / 1.8       | 400    | `1.1rem`                            |
| Card title                   | 19px / 26px        | 700    | Stories 18px, QA tasks 19px         |
| FAQ question                 | 17px / 1.45        | 700    |                                     |
| Long-read text (QA, FAQ)     | 16px / 1.6         | 400    | `#33465e`                           |
| Card description             | 15px / 22px        | 400    | Secondary; clamped to 3 lines       |
| Buttons, nav links           | 15px               | 600–700|                                     |
| Meta (date · read time)      | 13px               | 500    | Secondary                           |
| Kicker, counts, small labels | 12px / 16px        | 700    | Uppercase kickers, 0.04em           |
| Big numbers                  | 28–44px            | 700    | Primary; tabular figures            |

Headings use slight negative tracking; uppercase labels use positive
tracking. Never go below 12px.

### Shape and depth

| Token              | Value                                    | Use                              |
| ------------------ | ---------------------------------------- | -------------------------------- |
| `--rh-radius-sm`   | 4px                                      | Tiny badges                      |
| `--rh-radius-md`   | 8px                                      | Inputs, small tiles              |
| `--rh-radius-lg`   | 12px                                     | Compact cards on phones          |
| `--rh-radius-xl`   | 16px                                     | Cards, panels, dialogs           |
| `--rh-radius-full` | 9999px                                   | Buttons, pills, segmented tabs   |
| `--rh-shadow-sm`   | `0 1px 2px rgba(7,28,50,.05)`            | Resting cards                    |
| `--rh-shadow-md`   | `0 4px 6px -1px …, 0 2px 4px -2px …`     | Cards on hover                   |

Cards lift 2px on hover with the deeper shadow. Every white card has
`1px solid var(--rh-card-border)` so they read as one family.

### Layout and spacing

| Token                | Value  | Use                                              |
| -------------------- | ------ | ------------------------------------------------ |
| `--rh-content-max`   | 76rem  | Width of the content column (1216px)             |
| `--rh-gutter`        | 1.5rem | Side padding                                     |
| `--rh-gutter-mobile` | 1rem   | Side padding at 640px and below                  |
| `--rh-nav-height`    | 72px   | Fixed navbar; also the top offset for anchors    |

- Sections are stacked with a **72px** gap (`.rh-main` is a flex column).
- Card grids use **20–32px** gaps (library 32px, shelves 20px).
- Every section shares the same left edge: the hero and all sections use
  `--rh-content-max`.
- Anchored sections use `scroll-margin-top: calc(var(--rh-nav-height) + 1.5rem)`
  so a `#section` link lands just under the navbar.

## Components

### Section head

`SectionHead` in `src/components/ResourceSections.jsx`: eyebrow, title, and
an optional action on the right (a tab control, a "Show all" link). Every
shelf uses it; don't hand-roll a heading.

### Buttons

| Kind      | Look                                                                 |
| --------- | -------------------------------------------------------------------- |
| Primary   | `--rh-primary` fill, white 15px/700 text, full pill, 12px × 24px     |
| Secondary | White fill, navy text, no border, full pill                          |
| Text link | 15px/700 with a right arrow whose gap widens on hover ("Read guide →"). Their styles ask for primary purple, but they render navy because of the `color: inherit` rule below |
| Navbar CTA| "Get a Demo": homepage brand blue `#0055FF`, 6px radius              |

Filled buttons must keep white text — see the `color: inherit` gotcha below.

### Pills and tabs

- **Hero topic chips** ("Browse topics"): white with an outline-variant
  border, 14px/600 secondary text and a small count; the border turns primary
  on hover. Two even rows on desktop, one swipeable row on phones.
- **Library category pills**: `--rh-surface-low` fill, no border, 15px/600
  secondary text with a count. Selected: navy fill, white text. The row
  scrolls sideways when it can't fit, with a fade on the cut edge.
- **Segmented tabs** (story type, FAQ category): a pill track; the active
  segment is navy with white 14px/600 text and its count.

### Cards

- **Article card** (`rh-card`): 16:10 artwork (or a topic icon on a
  lavender-to-teal gradient), kicker, title, three-line description, then
  date · read time and "Read guide →". On phones it becomes a compact row:
  thumbnail left, text right, no description.
- **Story card** (`rx-story`): logo/artwork with a "Success story" or "Case
  study" badge, company and topic, title, summary, "Read the story".
- **Comparison sheet** (`rs-sheet`): the two contenders with a "vs" badge.
- **QA row** (`rx-qa-row`): icon, the task in plain words, a kind badge
  (Guide / Checklist / Reference chart) with the official title, the full
  description, and a primary "Download PDF" button.
- **Stat tile** (`rh-metric-tile`, `rh-hero-stats`): a big primary number
  over a short label. Numbers roll into place (below).

### Article blocks

Created automatically from a post's text (`src/utils/enhanceArticle.js`),
styled in `src/components/ArticleBlocks.css`:

- **Callout**: lavender panel, mono label, 17px text.
- **Number cards**: lavender cards, 44px primary figure, 16px label, a soft
  disc in the corner; three across (two when there are two or four). When a
  post has no figures of its own, Star Software's product figures are shown
  under a "Star Software by the numbers" caption.
- **FAQ cards**, **feature lists**, and **pull quotes** (4px primary left
  rule, 22px/600 primary text).

### Article and story pages

Two columns on desktop: the article and a sticky **"On this page"** sidebar
(contents with the current section highlighted, plus a promo card matched to
the post's topic). The sidebar sits in place from the top of the page, not
only after scrolling. On narrower screens the contents move inline above the
article.

### FAQ

Category tabs, six questions shown with "Show all". Short answers expand in
place. Long answers (over ~1,400 characters) open to a two-paragraph preview,
a "What this answer covers" list and a "Read the full answer" button, which
opens the **reader**: a full-height side panel with its own contents and
scroll, closed by the X, the backdrop or Escape.

### Motion

- **Rolling numbers** (`src/components/RollingNumber.jsx`): each digit rolls
  through a full 0–9 loop to its value, left to right 140ms apart, over about
  1.9s with a soft ease-out; symbols (`M`, `+`, `%`) fade in after. Runs once,
  when the number is mostly on screen. Screen readers get the plain value.
- Hovers are 150–300ms. Card lift is 2px.
- Everything respects `prefers-reduced-motion`: animations are skipped and
  final states shown.

## Screen sizes

Rules live in `src/pages/ResourceResponsive.css`, loaded last.

| Width        | Behaviour                                                                 |
| ------------ | ------------------------------------------------------------------------- |
| ≤ 640px      | 1rem gutters; library as compact rows; stat tiles as single rows; QA "Made for" chips hidden |
| ≤ 699px      | Stories, comparison sheets and QA checklists become **swipe rows**        |
| ≤ 899px      | Whitepapers, long reads and topic tiles become swipe rows                 |
| 640–1100px   | Card grids go to two columns (library from 640px, stories and sheets from 700px) |
| ≥ 1024px     | Three columns (library from 1024px, stories and sheets from 1100px); QA explanation panel sticks beside its list |
| 1440px       | The reference size the design is drawn at                                  |
| ≥ 1600px     | The whole page scales up: ×1.1 at 1600, ×1.2 at 1800, ×1.35 at 2100, ×1.55 at 2500 |

**Swipe rows:** each card is `min(84%, 21rem)` wide so the next one peeks in;
they snap to cards, bleed to the screen edge and hide the scrollbar.

**Large-screen scaling:** CSS `zoom` on everything below the navbar, driven by
`--rh-zoom`. The navbar keeps its size (it's shared with the homepage) but
its row widens to line up with the scaled content. Dialogs cancel the zoom on
their frame and re-apply it to their contents, so they still fit the screen.

## Gotchas

- **Coloured links need a scoped selector.** `.resource-hub-page a` sets
  `color: inherit`, which beats a single class. A link that sets its own
  colour (a filled button, the navbar CTA) needs
  `.resource-hub-page .your-class { color: … }`.
- **Dialogs need `margin: auto`.** The global reset zeroes every margin,
  which stops a modal `<dialog>` centring itself.
- **Use `overflow-x: clip`, not `hidden`,** on page wrappers: `hidden` makes
  a scroll container and breaks `position: sticky` inside it.
- **Grid columns use `minmax(0, 1fr)`** so long words or tables can't push a
  column wider than the screen.
- **Anything sized to the screen inside the scaled content** (`100vh`,
  `100vw`) is multiplied by the zoom on large screens; divide by
  `var(--rh-zoom)` or follow the dialog pattern above.

## Homepage

The homepage (`src/index.css`) predates the resources system:

- **Inter** for text, with the black-and-white palette (`#0A101D` text,
  `#3C4257` secondary, `#667085` muted).
- **Brand blue `#0055FF`** for its actions, which is why the navbar's "Get a
  Demo" is blue while resources buttons are purple.
- A 1440px container and the same 72px navbar.

The navbar and footer are shared: their layout and colours come from the
homepage styles, while on the resources pages they pick up Hanken Grotesk.
If the homepage is redesigned, moving it onto the resources tokens would make
the two match.
