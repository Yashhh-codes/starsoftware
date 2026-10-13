// Turns plain post HTML (from WordPress, now as saved data and later from the
// REST API) into the hub's richer article blocks, by recognising patterns
// that recur across posts rather than anything specific to one article:
//
// - Stat cards (.rh-stats): real figures found in the post's text (%, $,
//   multipliers, durations), shown before the first heading. Only when a
//   post has at least two; numbers are never invented.
// - Callouts (.rh-callout): "Real-World Example:" or "Risk if missed:"
//   paragraphs; a lead-in followed by a list, when the lead is a bold
//   instruction ("What finance must scrutinize") or says what something
//   enables/provides/ensures (the list then reads as checked benefits); the
//   list in a "Benefits" or "Best practices" section; "Final thoughts" or
//   "Conclusion" passages, and a closing section set off by a divider line.
// - Feature cards (.rh-feature-list): lists whose every item opens with a
//   bold title.
// - Pull quotes (.rh-pullquote): a standalone question, or a quoted line.
// - FAQ sections become expandable question cards.
//
// Runs in the browser (it uses DOMParser) and returns new sections; the
// input is left untouched.

const MAX_STATS = 3;
const MIN_STATS = 2;

// A figure worth a stat card: money, a percentage, a multiplier or a
// duration, optionally as a range ("15–30 minutes").
const FIGURE =
  /(?:\$\s?\d[\d,]*(?:\.\d+)?\s?(?:million|billion|[kmb]\b)?|\d[\d,]*(?:\.\d+)?(?:\s?[–-]\s?\d[\d,]*(?:\.\d+)?)?\s?(?:%|x\b|×|\+?\s?(?:hours?|hrs?|days?|weeks?|minutes?|mins?|months?|years?|seconds?)\b))/i;

// Words left dangling at the end of the text before a figure ("…reduced
// onboarding time by" 70%).
const TRAILING_FILLER =
  /\s+(?:by|of|to|at|in|for|from|with|nearly|about|around|over|under|than|more|less|only|just|up|almost|approximately|roughly|some|the|a|an|is|are|was|were|be|been|as|much|many|reportedly)$/i;

// Text after a figure that reads well straight after it ("40% of U.S.
// undergraduates…").
const READS_AFTER = /^(?:of|per|in|on|faster|fewer|less|more|lower|higher|reduction|increase|decrease|savings?|cut|drop|growth)\b/i;

const LABELLED_PARAGRAPH =
  /^(real[- ]world example|example|case in point|key takeaways?|takeaway|note|tip|pro tip|did you know\??|quick fact|in practice|bottom line|risks? if (?:missed|mishandled|ignored|skipped)|why it matters|important|warning|caution|the result|result|outcome|impact)$/i;

// A bold lead-in that introduces a list of things to check or do.
const INSTRUCTION_LEAD = /\b(must|ensure|scrutini[sz]e|checklist|require|requires|key steps|steps to|best practices|tips|with automation|how to)\b/i;

// A plain lead-in saying what something gives you ("AR automation enables:");
// its list reads naturally as checked benefits.
const BENEFIT_LEAD = /\b(enables?|provides?|helps?|ensures?|allows?|will|delivers?|improves?|benefits?)\b/i;

const CLOSING_HEADING = /^(final thoughts|conclusion|in conclusion|the bottom line|in summary|summary|key takeaways?)\b/i;

const LIST_SECTIONS = [
  [/best practices?/i, 'Best practices'],
  [/key takeaways?/i, 'Key takeaways'],
  [/benefits?/i, 'Key benefits'],
  [/advantages?/i, 'Key advantages'],
];

const FAQ_SECTION = /frequently asked questions|\bfaqs?\b/i;

const words = (text) => text.split(/\s+/).filter(Boolean);

function clean(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function sentencesOf(text) {
  // Not after initials such as "U.S." mid-sentence.
  return clean(text).split(/(?<=[a-z0-9)”"%][.!?])\s+(?=[A-Z“"])/);
}

// Picks the words around a figure that best describe it, or null when
// neither side makes a readable label.
function labelFor(sentence, match) {
  const start = match.index;
  const end = start + match[0].length;

  // "Average Processing Time: 45 minutes per transcript" — a lead-in label.
  const leadIn = sentence.slice(0, start).match(/^\s*([A-Z][^:]{2,60}):\s*$/);
  if (leadIn) return leadIn[1];

  const before = sentence
    .slice(0, start)
    .split(/[,;:—–()]/)
    .pop()
    .trim()
    .replace(/^(?:and|but|so|while|with|yet)\s+/i, '');
  let trimmedBefore = before;
  while (TRAILING_FILLER.test(trimmedBefore)) trimmedBefore = trimmedBefore.replace(TRAILING_FILLER, '');

  const after = sentence
    .slice(end)
    // A full stop ends the clause only before a capital or the end, so
    // "U.S. undergraduates" stays whole.
    .split(/[,;:—()]|\.(?=\s+[A-Z“"]|\s*$)/)[0]
    .trim()
    .replace(/^(?:and|but|while)\s+/i, '');

  const pick =
    (READS_AFTER.test(after) && words(after).length >= 3 && after) ||
    (words(trimmedBefore).length >= 2 && trimmedBefore) ||
    (words(after).length >= 3 && after) ||
    null;
  if (!pick || words(pick).length > 16) return null;
  return pick.replace(/[.\s]+$/, '');
}

function buildStats(doc, stats, caption) {
  const row = doc.createElement('div');
  row.className = 'rh-stats';
  if (caption) {
    // Fills the row's first grid line; see .rh-stats-caption.
    const c = doc.createElement('p');
    c.className = 'rh-stats-caption';
    c.textContent = caption;
    row.append(c);
  }
  for (const { value, label } of stats) {
    const card = doc.createElement('div');
    card.className = 'rh-stat';
    const v = doc.createElement('p');
    // Long values ("15–30 minutes") drop a size so they fit the card.
    v.className = value.length > 6 ? 'rh-stat-value rh-stat-value--long' : 'rh-stat-value';
    v.textContent = value;
    const l = doc.createElement('p');
    l.className = 'rh-stat-label';
    l.textContent = label;
    card.append(v, l);
    row.append(card);
  }
  return row;
}

function makeCallout(doc, label) {
  const box = doc.createElement('div');
  box.className = 'rh-callout';
  if (label) {
    const p = doc.createElement('p');
    p.className = 'rh-callout-label';
    p.textContent = label;
    box.append(p);
  }
  return box;
}

function asChecklist(list) {
  if (list.tagName === 'UL') list.classList.add('rh-checklist');
  return list;
}

// <p><strong>Real-World Example</strong>:<br>A B2B distributor…</p>
function labelledParagraphs(doc) {
  for (const p of [...doc.body.querySelectorAll('p')]) {
    const first = p.firstElementChild;
    if (!first || first.tagName !== 'STRONG' || p.firstChild !== first) continue;
    const label = clean(first.textContent).replace(/:$/, '');
    if (!LABELLED_PARAGRAPH.test(label)) continue;
    first.remove();
    // Drop the colon and line break that followed the label.
    while (p.firstChild && (p.firstChild.nodeName === 'BR' || !clean(p.firstChild.textContent || '').replace(/^:/, ''))) {
      p.firstChild.remove();
    }
    if (p.firstChild && p.firstChild.nodeType === 3) {
      p.firstChild.textContent = p.firstChild.textContent.replace(/^\s*:\s*/, '');
    }
    if (!clean(p.textContent)) continue;
    const box = makeCallout(doc, label);
    p.replaceWith(box);
    box.append(p);
  }
}

// A lead-in paragraph and the list it introduces, boxed together:
//   <p><strong>What finance must scrutinize</strong></p><ul>…</ul>
//   <p><strong>With automation</strong>:</p><ul>…</ul>
//   <p>AR automation enables:</p><ul>…</ul>
// A short lead becomes the box's label; a longer one stays as its first line.
function leadInLists(doc) {
  for (const p of [...doc.body.querySelectorAll('p')]) {
    const list = p.nextElementSibling;
    if (!list || !/^(UL|OL)$/.test(list.tagName)) continue;
    if (p.closest('.rh-callout, table, details') || p.className) continue;
    const text = clean(p.textContent);
    const bare = text.replace(/:$/, '');
    const strong = p.querySelector('strong');
    const allBold = strong && clean(strong.textContent).replace(/:$/, '') === bare;

    const instruction = allBold && words(bare).length <= 8 && (/:$/.test(text) || INSTRUCTION_LEAD.test(bare));
    const benefit = !allBold && /:$/.test(text) && words(text).length <= 25 && BENEFIT_LEAD.test(text);
    if (!instruction && !benefit) continue;

    const short = words(bare).length <= 6 && instruction;
    const box = makeCallout(doc, short ? bare : null);
    p.replaceWith(box);
    if (!short) {
      p.classList.add('rh-callout-lead');
      box.append(p);
    }
    box.append(asChecklist(list));
  }
}

// h3/h4 "Final Thoughts" plus what follows it, up to the next heading.
function closingPassages(doc) {
  for (const heading of [...doc.body.querySelectorAll('h3, h4')]) {
    const label = clean(heading.textContent);
    if (!CLOSING_HEADING.test(label)) continue;
    const box = makeCallout(doc, label);
    let next = heading.nextElementSibling;
    while (next && !/^H[1-4]$/.test(next.tagName)) {
      const after = next.nextElementSibling;
      box.append(next);
      next = after;
    }
    if (box.children.length > 1) heading.replaceWith(box);
  }
}

function sectionList(doc, title) {
  const hit = LIST_SECTIONS.find(([pattern]) => pattern.test(title));
  if (!hit) return;
  const list = [...doc.body.children].find((el) => /^(UL|OL)$/.test(el.tagName));
  if (!list || list.closest('.rh-callout')) return;
  const box = makeCallout(doc, hit[1]);
  list.replaceWith(box);
  box.append(asChecklist(list));
}

// Each question heading and its answer becomes a <details> card.
function faqItems(doc) {
  const questions = [...doc.body.querySelectorAll('h3, h4')];
  for (const q of questions) {
    const details = doc.createElement('details');
    details.className = 'rh-faq';
    const summary = doc.createElement('summary');
    summary.textContent = clean(q.textContent);
    const answer = doc.createElement('div');
    answer.className = 'rh-faq-answer';
    let next = q.nextElementSibling;
    while (next && !/^H[1-4]$/.test(next.tagName)) {
      const after = next.nextElementSibling;
      answer.append(next);
      next = after;
    }
    details.append(summary, answer);
    q.replaceWith(details);
  }
}

// <ul><li><strong>Seamless ERP Integration</strong>: …</li>…</ul>
function featureLists(doc) {
  for (const list of doc.body.querySelectorAll('ul, ol')) {
    if (list.closest('.rh-callout, table, details') || list.classList.length) continue;
    const items = [...list.children].filter((el) => el.tagName === 'LI');
    if (items.length < 3) continue;
    const titled = items.every((li) => {
      const first = [...li.childNodes].find((n) => n.nodeType === 1 || clean(n.textContent || ''));
      return first && first.nodeName === 'STRONG' && words(clean(first.textContent)).length <= 10;
    });
    if (!titled) continue;
    list.classList.add('rh-feature-list');
    // "<strong>Title</strong>: text" puts the title on its own line, minus
    // the colon. A bold opening that runs into its sentence ("<strong>Admissions
    // Teams</strong> cannot…") stays inline.
    for (const li of items) {
      const strong = li.querySelector('strong');
      const next = strong.nextSibling;
      const ownColon = /:\s*$/.test(strong.textContent);
      const colonAfter = next && next.nodeType === 3 && /^\s*:/.test(next.textContent);
      if (!ownColon && !colonAfter) continue;
      strong.classList.add('rh-feature-title');
      strong.textContent = strong.textContent.replace(/\s*:\s*$/, '');
      if (colonAfter) next.textContent = next.textContent.replace(/^\s*:\s*/, '');
    }
  }
}

// A question standing alone after a lead-in ("…the question becomes:"), or a
// paragraph that is itself a quotation.
function pullQuotes(doc) {
  for (const p of doc.body.querySelectorAll('p')) {
    if (p.closest('.rh-callout, table, details, li') || p.className || p.querySelector('img')) continue;
    const text = clean(p.textContent);
    const n = words(text).length;
    const prev = p.previousElementSibling;
    const askedAfterLead = /\?$/.test(text) && n <= 22 && prev && /:$/.test(clean(prev.textContent));
    const quoted = /^[“"]/.test(text) && /[”"]$/.test(text) && n <= 40;
    if (askedAfterLead || quoted) p.classList.add('rh-pullquote');
  }
}

// `fallback` ({ stats, caption }) supplies number cards for a post that
// states fewer than two figures of its own, under a caption saying where
// they come from.
export function enhanceArticleSections(sections, fallback = null) {
  const parser = new DOMParser();
  const docs = sections.map((section) => ({
    // Divider lines some posts use as headings ("———") aren't sections; the
    // text after one is the post's sign-off.
    title: section.title && /[a-z0-9]/i.test(section.title) ? section.title : null,
    afterDivider: Boolean(section.title) && !/[a-z0-9]/i.test(section.title),
    id: section.id,
    doc: parser.parseFromString(`<body>${section.html}</body>`, 'text/html'),
  }));

  for (const { title, afterDivider, doc } of docs) {
    if (title && FAQ_SECTION.test(title)) {
      faqItems(doc);
      continue;
    }
    labelledParagraphs(doc);
    leadInLists(doc);
    closingPassages(doc);
    if (title) sectionList(doc, title);
    featureLists(doc);
    pullQuotes(doc);
    if (afterDivider && doc.body.children.length) {
      const box = makeCallout(doc, 'The bottom line');
      box.append(...doc.body.children);
      doc.body.append(box);
    }
  }

  // Figures are gathered across the whole post, then shown at the end of the
  // opening text (before the first heading); a post with no headings gets
  // them after the passage holding the first figure. Without enough figures
  // of its own, a post shows the fallback cards at the end of its opening.
  const found = findStats(docs);
  const ownFigures = found.length >= MIN_STATS;
  const stats = ownFigures ? found : fallback?.stats || [];
  if (stats.length >= MIN_STATS) {
    const opening = docs[0];
    const row = buildStats(opening.doc, stats.slice(0, MAX_STATS), ownFigures ? null : fallback.caption);
    if (!ownFigures || docs.length > 1 || opening.title) {
      opening.doc.body.append(row);
    } else {
      const anchor = stats[0].block.closest('body > *') || opening.doc.body.lastElementChild;
      anchor.after(row);
    }
  }

  return docs.map(({ id, title, doc }) => ({ id, title, html: doc.body.innerHTML }));
}

// The first few figures in reading order that have a readable label, one
// per sentence and no value twice. Paragraphs and list items carry the
// prose; tables (spec values) and FAQ answers are left out.
function findStats(docs) {
  const pooled = [];
  const seen = new Set();
  for (const { doc } of docs) {
    for (const block of doc.body.querySelectorAll('p, li')) {
      if (pooled.length >= MAX_STATS) return pooled;
      if (block.closest('table, details')) continue;
      for (const sentence of sentencesOf(block.textContent)) {
        const match = sentence.match(FIGURE);
        if (!match) continue;
        const value = clean(match[0]).replace(/\s?[–-]\s?/, '–');
        if (seen.has(value)) continue;
        const label = labelFor(sentence, match);
        if (!label) continue;
        seen.add(value);
        pooled.push({ value, label, block });
        break;
      }
    }
  }
  return pooled;
}
