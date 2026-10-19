// Turns WordPress post HTML into the hub's article sections: an allowlist
// sanitiser (the HTML is rendered with dangerouslySetInnerHTML) and a split
// into { id, title, html } sections at the post's top heading level.

const KEEP = new Set([
  'p', 'h2', 'h3', 'h4', 'h5', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'br', 'blockquote', 'figure',
  'figcaption', 'code', 'pre', 'sup', 'sub',
]);
// h1 belongs to the page title, so a post's own h1s become h2s; h6 is the
// smallest level kept as h5. Unkept, they'd lose their tag and leave bare
// text.
const RENAME = { b: 'strong', i: 'em', h1: 'h2', h6: 'h5' };
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
  // A link with no (safe) address, such as text pasted from a chat tool,
  // isn't a link: keep its text.
  if (tag === 'a' && !el.getAttribute('href')) return children;
  el.append(...children);
  return [el];
}

// Text and inline tags left loose at the top level (from an unwrapped
// <div> or <span>: "————", "More FAQs", an italic line) are wrapped in a
// paragraph, run by run, so they get the same spacing as the rest.
const INLINE = new Set(['STRONG', 'EM', 'A', 'SUP', 'SUB', 'CODE', 'BR', 'IMG']);

function wrapLooseInline(doc) {
  let run = null;
  for (const node of [...doc.body.childNodes]) {
    const loose = node.nodeType === Node.TEXT_NODE ? Boolean(node.textContent.trim()) || Boolean(run) : INLINE.has(node.nodeName);
    if (!loose) {
      run = null;
      continue;
    }
    if (!run) {
      run = doc.createElement('p');
      node.before(run);
    }
    run.append(node);
  }
  // Line breaks at the very start or end of a paragraph or list item only
  // add a blank line (an uneven gap), so they go.
  const blank = (n) => n && (n.nodeName === 'BR' || (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()));
  for (const el of doc.body.querySelectorAll('p, li')) {
    while (blank(el.lastChild)) el.lastChild.remove();
    while (blank(el.firstChild)) el.firstChild.remove();
  }
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

// The labels a chat assistant's code block brings along when it's copied
// into a post ("</>code", "Copy code"), on a line of their own.
const PASTE_LEFTOVER = /^(?:<\/>\s*[\w+#.-]*|copy code)$/i;

function dropPasteLeftovers(root) {
  for (const el of [...root.querySelectorAll('p, li, h2, h3, h4, h5')]) {
    if (PASTE_LEFTOVER.test(textIn(el)) && !el.querySelector('img')) el.remove();
  }
}

export function cleanPostHtml(html) {
  const source = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  const out = document.implementation.createHTMLDocument('');
  const nodes = [...source.body.childNodes].flatMap((n) => cleanNode(n, out));
  out.body.append(...nodes);
  wrapLooseInline(out);
  dropEmpty(out.body);
  dropPasteLeftovers(out.body);
  return out.body.innerHTML.replace(/\n\s*\n+/g, '\n').trim();
}

export function textOf(html) {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  return doc.body.textContent.replace(/\s+/g, ' ').trim();
}

const NUMBERED = /^\s*\d+[.)]\s/;

const LEVELS = ['H2', 'H3', 'H4', 'H5'];

const countAt = (body, tag) => body.querySelectorAll(`:scope > ${tag}`).length;

// The level that divides the post into sections: the highest heading level
// with at least two headings (one lone h2, such as an FAQ heading, doesn't
// structure a post), else whichever single heading there is. Older posts
// use h4 or h5 for their sections.
function sectionLevel(body) {
  return LEVELS.find((tag) => countAt(body, tag) >= 2) || LEVELS.find((tag) => countAt(body, tag) > 0) || null;
}

// Bold lines that are labels, not headings: they belong to the callout and
// fact-row blocks (src/utils/enhanceArticle.js).
const LABEL_LINE =
  /^(example|note|tip|pro tip|impact|outcome|results?|solution|challenge|problem|fact|why it matters|key takeaways?|takeaway|real[- ]world example|in practice|bottom line|important|warning)$/i;
const HEADING_MAX_WORDS = 16;

const textIn = (el) => (el.textContent || '').replace(/\s+/g, ' ').trim();

// Bold text that reads as a heading: short, not a label ("Example",
// "What it measures:"), and not a sentence.
function headingText(text) {
  if (!text || text.split(' ').length > HEADING_MAX_WORDS) return false;
  if (/[:：.,;]$/.test(text) || LABEL_LINE.test(text)) return false;
  return /[a-z]/i.test(text);
}

// The first child that isn't whitespace text.
const firstFilled = (el) => [...el.childNodes].find((n) => n.nodeType === 1 || (n.textContent || '').trim());

// Posts written without heading tags mark their headings in bold instead.
// When a post has no heading level to split on, these become headings:
// - a one-item numbered list holding only bold text ("1. The Peak Season
//   Crunch"), the post's numbered sections;
// - a paragraph of only bold text;
// - bold text then a line break, then the paragraph ("<b>Myth 1: …</b><br>…").
// With numbered-list headings, the bold paragraphs are their sub-headings.
function promoteBoldHeadings(doc, body) {
  const listHeads = [];
  const lineHeads = [];
  for (const el of [...body.children]) {
    if (el.tagName === 'OL' && el.children.length === 1) {
      const li = el.firstElementChild;
      const bold = firstFilled(li);
      if (bold && bold.nodeType === 1 && /^(STRONG|B)$/.test(bold.tagName) && textIn(bold) === textIn(li) && headingText(textIn(li))) {
        listHeads.push({ el, text: textIn(li) });
      }
      continue;
    }
    if (el.tagName !== 'P') continue;
    const bold = firstFilled(el);
    if (!bold || bold.nodeType !== 1 || !/^(STRONG|B)$/.test(bold.tagName)) continue;
    const text = textIn(bold);
    if (!headingText(text)) continue;
    if (text === textIn(el)) {
      lineHeads.push({ el, text });
      continue;
    }
    // "<b>Heading</b><br>Body…": the bold is followed directly by a break.
    let next = bold.nextSibling;
    while (next && next.nodeType === 3 && !next.textContent.trim()) next = next.nextSibling;
    if (next && next.nodeName === 'BR') lineHeads.push({ el, text, bold, br: next });
  }

  const sections = listHeads.length >= 2 ? listHeads : lineHeads.length >= 2 ? lineHeads : null;
  if (!sections) return false;
  const subs = sections === listHeads ? lineHeads : [];

  const promote = ({ el, text, bold, br }, tag) => {
    const heading = doc.createElement(tag);
    heading.textContent = text.replace(/^[“"]|[”"]$/g, '');
    if (bold) {
      // Keep the paragraph's body, minus the bold heading and its break.
      bold.remove();
      br.remove();
      el.before(heading);
      if (!textIn(el) && !el.querySelector('img')) el.remove();
    } else {
      el.replaceWith(heading);
    }
  };
  sections.forEach((item) => promote(item, 'h2'));
  subs.forEach((item) => promote(item, 'h3'));
  return true;
}

// The last resort, for posts with no heading of any kind: their main
// points become the sections, so every post has a contents list.
// - Paragraphs that open with a bold label ("<b>Cost Savings:</b> One of
//   the most…"), at least three of them: the label becomes the heading.
// - Otherwise the post's longest list whose items each open with a bold
//   title (at least three, with a real passage after each title): each item
//   becomes a heading and its text; a numbered list keeps its numbers.
function promotePoints(doc, body) {
  const leadOf = (el) => {
    const first = firstFilled(el);
    const holder = first && first.nodeType === 1 && first.tagName === 'P' ? first : el;
    const lead = firstFilled(holder);
    if (!lead) return null;
    let title;
    let rest;
    if (lead.nodeType === 1 && /^(STRONG|B)$/.test(lead.tagName)) {
      title = textIn(lead).replace(/\s*[:：–—-]\s*$/, '');
      rest = textIn(holder).slice(textIn(lead).length).replace(/^\s*[:：–—-]\s*/, '');
    } else if (lead.nodeType === 3) {
      // A plain-text title before a colon ("Cost Savings: One of…"): a short
      // phrase in title case.
      const m = lead.textContent.match(/^\s*([A-Z][^:.!?]{2,60}):\s+/);
      if (!m || !titleCased(m[1])) return null;
      title = m[1].trim();
      rest = textIn(holder).slice(m[0].trim().length);
    } else {
      return null;
    }
    if (!title || title.split(' ').length > 10 || LABEL_LINE.test(title) || /[.?!]$/.test(title)) return null;
    if (rest.split(' ').filter(Boolean).length < 8) return null;
    return { holder, lead, title };
  };

  // Takes the title off the front of its holder.
  const dropTitle = ({ holder, lead, title }) => {
    if (lead.nodeType === 1) lead.remove();
    else lead.textContent = lead.textContent.replace(/^\s*/, '').slice(title.length).replace(/^\s*:/, '');
    trimLeadIn(holder);
  };

  const labelled = [...body.children].filter((el) => el.tagName === 'P').map((p) => ({ p, lead: leadOf(p) })).filter((x) => x.lead);
  if (labelled.length >= 3) {
    for (const { p, lead } of labelled) {
      const heading = doc.createElement('h2');
      heading.textContent = lead.title;
      dropTitle(lead);
      p.before(heading);
    }
    return true;
  }

  const lists = [...body.children]
    .filter((el) => /^(UL|OL)$/.test(el.tagName))
    .map((list) => ({ list, items: [...list.children].filter((li) => li.tagName === 'LI') }))
    .filter(({ items }) => items.length >= 3 && items.every((li) => leadOf(li)))
    .sort((a, b) => b.items.length - a.items.length);
  if (!lists.length) return false;

  const { list, items } = lists[0];
  const numbered = list.tagName === 'OL';
  const start = Number(list.getAttribute('start')) || 1;
  const parts = [];
  items.forEach((li, i) => {
    const lead = leadOf(li);
    const { holder, title } = lead;
    const heading = doc.createElement('h2');
    heading.textContent = numbered ? `${start + i}. ${title}` : title;
    dropTitle(lead);
    parts.push(heading);
    // The item's text, as paragraphs.
    if (holder === li) {
      const p = doc.createElement('p');
      p.append(...li.childNodes);
      parts.push(p);
    } else {
      parts.push(...li.childNodes);
    }
  });
  list.replaceWith(...parts);
  return true;
}

// Most words capitalised ("Streamlined Data Management", "Return on
// Investment"), as a title is and a sentence isn't.
function titleCased(text) {
  const all = text.trim().split(/\s+/);
  if (all.length < 2 || all.length > 6) return false;
  const minor = /^(a|an|and|as|at|by|for|in|of|on|or|the|to|with|vs\.?)$/i;
  const major = all.filter((w) => !minor.test(w));
  return major.length > 0 && major.every((w) => /^[A-Z0-9(“"]/.test(w));
}

// Drops the colon, dash or break left at the start once a bold title is
// taken off.
function trimLeadIn(el) {
  for (;;) {
    const first = el.firstChild;
    if (!first) return;
    if (first.nodeName === 'BR' || (first.nodeType === 3 && !first.textContent.trim())) {
      first.remove();
      continue;
    }
    if (first.nodeType === 3) first.textContent = first.textContent.replace(/^\s*[:：–—-]?\s*/, '');
    return;
  }
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

// Headings longer than this are sentences set in heading style.
const SENTENCE_HEADING_WORDS = 16;

// Tidies headings before the split:
// - no trailing colon ("Sources:", "Related FAQs:");
// - a heading that runs on into its sentence ("MTR Automation Is a Risk
//   Decision – Unlike invoices…") keeps its title and the rest becomes the
//   first paragraph; a heading that is just a long sentence becomes one.
function tidyHeadings(doc, body) {
  for (const h of [...body.querySelectorAll(':scope > h2, :scope > h3, :scope > h4, :scope > h5')]) {
    const last = [...h.childNodes].reverse().find((n) => (n.textContent || '').trim());
    const lastText = last && (last.nodeType === 3 ? last : [...last.childNodes].reverse().find((n) => n.nodeType === 3 && n.textContent.trim()));
    if (lastText) lastText.textContent = lastText.textContent.replace(/\s*[:：]\s*$/, '');

    const text = textIn(h);
    if (text.split(' ').length <= SENTENCE_HEADING_WORDS) continue;
    const m = text.match(/^(.{8,120}?)\s+[–—-]\s+(.+)$/) || text.match(/^(.{8,120}?):\s+(.+)$/);
    const titleWords = m ? m[1].split(' ').length : 0;
    if (m && titleWords >= 3 && titleWords <= 14) {
      const p = doc.createElement('p');
      p.textContent = m[2];
      h.textContent = m[1];
      h.after(p);
    } else {
      const p = doc.createElement('p');
      p.append(...h.childNodes);
      h.replaceWith(p);
    }
  }
}

// "5. Title" (not "5.5 Title").
const WHOLE_NUMBERED = /^\s*(\d{1,2})[.)]\s+\S/;
const numberOf = (heading) => {
  const m = textIn(heading).match(WHOLE_NUMBERED);
  return m ? Number(m[1]) : null;
};

// The numbered sequence 1, 2, 3… running through a post's headings, when it
// is the post's outline: at least four, starting from 1 at the section
// level. A deeper heading joins only when it continues the count and that
// number isn't already used at the section level (so "1.", "2." items
// inside a section don't). Returns null for other posts.
function outlineSections(body, level, levelHeadings) {
  const numberedAtLevel = levelHeadings.filter((h) => numberOf(h) !== null);
  if (numberedAtLevel.length < 4 || numberOf(numberedAtLevel[0]) !== 1) return null;
  // The post opens with "1."; numbered points that follow an intro heading
  // ("What does deep learning bring?" then "1. Supplier detection") are
  // that section's sub-points instead.
  if (levelHeadings[0] !== numberedAtLevel[0]) return null;
  // Numbering that starts again ("Challenges" 1–4, then "Solutions" 1–3)
  // is lists inside sections, not an outline.
  if (numberedAtLevel.filter((h) => numberOf(h) === 1).length > 1) return null;
  const levelNumbers = new Set(numberedAtLevel.map(numberOf));
  const rank = Number(level[1]);
  const order = [...body.children].filter((el) => /^H[2-5]$/.test(el.tagName));
  const picked = new Set();
  let expect = 1;
  for (const h of order) {
    const n = numberOf(h);
    if (n !== expect) continue;
    const depth = Number(h.tagName[1]);
    const atLevel = depth <= rank;
    if (atLevel || (picked.size && !levelNumbers.has(n))) {
      picked.add(h);
      expect += 1;
    }
  }
  if (picked.size < 4) return null;
  const indexes = [...picked].map((h) => order.indexOf(h));
  return { picked, order, first: Math.min(...indexes), last: Math.max(...indexes) };
}

// "Step 1: …", "1. …": a sub-point title.
const STEP_TITLE = /^\s*(?:step\s*\d+\b|\d{1,2}\s*[.):])/i;

// A section heading with nothing under it ("How it works" straight into
// "Step 1", "Step 2") takes the step or numbered sections that follow as its
// sub-sections, or else the one section after it.
function absorbEmptySections(doc, sections) {
  const hasContent = (section) =>
    section.nodes.some((n) => (n.textContent || '').trim() || (n.nodeType === 1 && n.querySelector?.('img')) || n.nodeName === 'IMG');
  const out = [];
  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    out.push(section);
    if (section.title === null || hasContent(section) || i === sections.length - 1) continue;
    let j = i + 1;
    const absorb = (next) => {
      const sub = doc.createElement('h3');
      sub.textContent = next.title;
      section.nodes.push(sub, ...next.nodes);
    };
    if (sections[j].title && STEP_TITLE.test(sections[j].title)) {
      while (j < sections.length && sections[j].title && STEP_TITLE.test(sections[j].title)) {
        absorb(sections[j]);
        j += 1;
      }
    } else {
      absorb(sections[j]);
      j += 1;
    }
    i = j - 1;
  }
  return out;
}

export function splitSections(html) {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  const body = doc.body;
  // Empty headings (left by the editor between sections) aren't sections.
  body.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    if (!textIn(h) && !h.querySelector('img')) h.remove();
  });
  tidyHeadings(doc, body);
  if (!LEVELS.some((tag) => countAt(body, tag) >= 2) && !promoteBoldHeadings(doc, body)) {
    promotePoints(doc, body);
  }
  const level = sectionLevel(body);
  if (!level) return [{ id: 1, title: null, html: body.innerHTML }];

  // Headings above the section level start sections too (a lone h3
  // "Conclusion" in a post sectioned by h4s).
  const rank = Number(level[1]);
  const isSectionHeading = (node) =>
    node.nodeType === Node.ELEMENT_NODE && /^H[2-5]$/.test(node.tagName) && Number(node.tagName[1]) <= rank;
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
  if (level !== 'H2') {
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
  // Sub-points only while the post keeps at least two sections of its own;
  // otherwise (one intro heading over the whole numbered list) the numbered
  // headings are the sections, so the post still has a contents list.
  const starts = [...body.children].filter((el) => isSectionHeading(el) && !subPoints.has(el)).length;
  if (starts < 2) subPoints.clear();

  // Numbered-outline posts ("1. What is…", "2. Why…", … "14. The future…"):
  // the numbered sequence is the post's sections, whatever heading level the
  // editor gave each one, and the headings between them ("Strengths", "Best
  // fit", "5.5 DocumentIQ") are sub-headings inside them. Headings before
  // section 1 and after the last numbered one ("Conclusion") stay sections.
  const outline = outlineSections(body, level, headings);
  const startsSection = outline
    ? (node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return false;
        if (outline.picked.has(node)) return true;
        if (!isSectionHeading(node)) return false;
        const at = outline.order.indexOf(node);
        return at < outline.first || at > outline.last;
      }
    : (node) => isSectionHeading(node) && !subPoints.has(node);

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

  return absorbEmptySections(doc, sections).map((section, i) => {
    const holder = doc.createElement('div');
    holder.append(...section.nodes);
    return { id: i + 1, title: section.title, html: holder.innerHTML.trim() };
  });
}
