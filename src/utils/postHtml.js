// Turns WordPress post HTML into the hub's article sections: an allowlist
// sanitiser (the HTML is rendered with dangerouslySetInnerHTML) and a split
// into { id, title, html } sections at the post's top heading level.

const KEEP = new Set([
  'p', 'h2', 'h3', 'h4', 'h5', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'br', 'blockquote', 'figure',
  'figcaption', 'code', 'pre', 'sup', 'sub',
]);
const RENAME = { b: 'strong', i: 'em' };
// Removed along with everything inside them. Anything else not kept (div,
// section, span, hr…) is unwrapped: its content stays, the tag goes.
const DROP = new Set([
  'script', 'style', 'noscript', 'iframe', 'svg', 'form', 'object', 'embed',
  'link', 'meta', 'template', 'button', 'input', 'select', 'textarea',
]);
const ATTRS = {
  a: ['href'],
  img: ['src', 'srcset', 'sizes', 'alt', 'width', 'height'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan'],
};
// Web, mail and phone links, and same-site paths or fragments.
const SAFE_URL = /^(?:https?:|mailto:|tel:|\/(?!\/)|#)/i;
const SITE_HOST = /(^|\.)starsoftware\.co$/i;

function safeUrl(value) {
  const url = value.trim();
  return SAFE_URL.test(url) ? url : null;
}

function safeSrcset(value) {
  const candidates = value.split(',').map((c) => c.trim()).filter(Boolean);
  return candidates.every((c) => /^https?:\/\//i.test(c)) ? candidates.join(', ') : null;
}

function cleanNode(node, doc) {
  if (node.nodeType === Node.TEXT_NODE) {
    return [doc.createTextNode(node.textContent.replace(/ /g, ' '))];
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return [];

  const name = node.tagName.toLowerCase();
  if (DROP.has(name)) return [];
  const children = [...node.childNodes].flatMap((child) => cleanNode(child, doc));
  const tag = RENAME[name] || name;
  if (!KEEP.has(tag)) return children;

  const el = doc.createElement(tag);
  for (const attr of ATTRS[tag] || []) {
    const raw = node.getAttribute(attr);
    if (raw == null) continue;
    let value = raw;
    if (attr === 'href' || attr === 'src') value = safeUrl(raw);
    if (attr === 'srcset') value = safeSrcset(raw);
    if (attr === 'width' || attr === 'height') value = /^\d+$/.test(raw) ? raw : null;
    if (value != null) el.setAttribute(attr, value);
  }
  if (tag === 'img') {
    if (!el.getAttribute('src')) return [];
    el.setAttribute('loading', 'lazy');
  }
  if (tag === 'a' && /^https?:/i.test(el.getAttribute('href') || '')) {
    try {
      if (!SITE_HOST.test(new URL(el.getAttribute('href')).hostname)) {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }
    } catch {
      el.removeAttribute('href');
    }
  }
  el.append(...children);
  return [el];
}

// Editor leftovers: empty paragraphs, list items and emphasis.
function dropEmpty(root) {
  for (const el of [...root.querySelectorAll('p, li, strong, em')].reverse()) {
    if (!el.textContent.trim() && !el.querySelector('img, br')) el.remove();
  }
  for (const p of root.querySelectorAll('p')) {
    if (!p.textContent.trim() && !p.querySelector('img')) p.remove();
  }
}

export function cleanPostHtml(html) {
  const source = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  const out = document.implementation.createHTMLDocument('');
  const nodes = [...source.body.childNodes].flatMap((n) => cleanNode(n, out));
  out.body.append(...nodes);
  dropEmpty(out.body);
  return out.body.innerHTML.replace(/\n\s*\n+/g, '\n').trim();
}

export function textOf(html) {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  return doc.body.textContent.replace(/\s+/g, ' ').trim();
}

const NUMBERED = /^\s*\d+[.)]\s/;

// The level that divides the post into sections: h2 when there are at least
// two (one lone h2, such as an FAQ heading, doesn't structure a post), else
// h3, else whichever single heading there is.
function sectionLevel(body) {
  const h2 = body.querySelectorAll(':scope > h2').length;
  const h3 = body.querySelectorAll(':scope > h3').length;
  if (h2 >= 2) return 'H2';
  if (h3 >= 2) return 'H3';
  return h2 ? 'H2' : h3 ? 'H3' : null;
}

// Words of text from a heading up to the next heading of its level.
function wordsUntilNext(heading, level) {
  let count = 0;
  for (let node = heading.nextSibling; node && node.nodeName !== level; node = node.nextSibling) {
    count += (node.textContent || '').split(/\s+/).filter(Boolean).length;
  }
  return count;
}

// Splits at the post's section heading level. Text before the first heading
// becomes an untitled opening section. Posts built from h3s often use them
// for sub-points too, which stay inside their section as sub-headings:
// - numbered ones mixed with plain ones ("What deep learning brings", then
//   "1. Supplier detection", "2. …");
// - short ones over a short passage ("Extract", "Validate", "Manual data
//   entry" with a sentence or two each), in posts with many headings; in a
//   post with only a handful, short headings ("Overview", "Challenges") are
//   its sections.
const MANY_HEADINGS = 12;

export function splitSections(html) {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  const body = doc.body;
  const level = sectionLevel(body);
  if (!level) return [{ id: 1, title: null, html: body.innerHTML }];

  const headings = [...body.querySelectorAll(`:scope > ${level}`)];
  const numbered = (h) => NUMBERED.test(h.textContent);
  const short = (h) => h.textContent.trim().split(/\s+/).length <= 3 && wordsUntilNext(h, level) < 70;
  // Numbered sub-points don't make a post "heading-heavy"; plain headings do.
  const many = headings.filter((h) => !numbered(h)).length >= MANY_HEADINGS;

  // Numbered headings are sub-points only under a plain heading that just
  // introduces them ("What does deep learning bring?" plus a line or two,
  // or "Challenges" straight into "1. …", "2. …"). Numbered headings that
  // open the post's body are its sections.
  const subPoints = new Set();
  if (level === 'H3') {
    let intro = null;
    headings.forEach((h, i) => {
      const next = headings[i + 1];
      if (numbered(h)) {
        if (intro) subPoints.add(h);
      } else if (next && numbered(next) && wordsUntilNext(h, level) < 80) {
        intro = h;
      } else if (many && short(h)) {
        subPoints.add(h);
      } else {
        intro = wordsUntilNext(h, level) < 80 ? h : null;
      }
    });
  }
  const startsSection = (node) =>
    node.nodeType === Node.ELEMENT_NODE && node.tagName === level && !subPoints.has(node);

  const sections = [];
  let current = { title: null, nodes: [] };
  for (const node of [...body.childNodes]) {
    if (startsSection(node)) {
      if (current.title !== null || current.nodes.some((n) => n.textContent.trim())) sections.push(current);
      current = { title: node.textContent.replace(/\s+/g, ' ').trim(), nodes: [] };
    } else {
      current.nodes.push(node);
    }
  }
  sections.push(current);

  return sections.map((section, i) => {
    const holder = doc.createElement('div');
    holder.append(...section.nodes);
    return { id: i + 1, title: section.title, html: holder.innerHTML.trim() };
  });
}
