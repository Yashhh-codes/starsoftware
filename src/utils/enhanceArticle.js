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
// And the structured blocks (modelled on Docsumo's long-form posts):
//
// - Item cards (.rh-item): a run of numbered sub-headings ("1. MetalTrace",
//   "2️⃣ Healthcare") with real content under each. Labelled lines inside
//   become fact rows; a closing "Best fit" / "Impact" fact becomes the
//   card's footer; Star Software's own entry is highlighted.
// - Steps (.rh-steps): the same run when every item is a line or two, and
//   ordered lists whose items open with a bold title.
// - Fact rows (.rh-facts): two or more labelled lines in a row
//   ("Challenge: …", "Solution: …", "What it measures:" plus text or a list).
// - Process flows (.rh-flow): "A → B → C" lines.
// - Card grids (.rh-cards): short lists of three to six bold-titled items.
// - Tables (.rh-table): a framed table with a header row and Star Software's
//   row highlighted.
//
// Runs in the browser (it uses DOMParser) and returns new sections; the
// input is left untouched.

import { buildRollingNumber } from './rollingNumber';

const MAX_STATS = 3;
const MIN_STATS = 2;

// A figure worth a stat card: money, a percentage, a multiplier or a
// duration, optionally approximate ("~60%") or a range ("15–30 minutes",
// "80% to 90%", "$12 to $30", "60 to 70 percent").
const FIGURE_SOURCE =
  '(?:[~≈]\\s?)?(?:\\$\\s?\\d[\\d,]*(?:\\.\\d+)?(?:\\s?(?:[–-]|to)\\s?\\$\\s?\\d[\\d,]*(?:\\.\\d+)?)?\\s?(?:million|billion|[kmb]\\b)?\\+?|\\d[\\d,]*(?:\\.\\d+)?(?:%?\\s?[–-]\\s?\\d[\\d,]*(?:\\.\\d+)?|%?\\s+to\\s+\\d[\\d,]*(?:\\.\\d+)?(?=\\s?(?:%|percent\\b|x\\b|×|\\+?\\s?(?:hours?|hrs?|days?|weeks?|minutes?|mins?|months?|years?|seconds?)\\b)))?\\s?(?:%|percent\\b|x\\b|×|\\+?\\s?(?:hours?|hrs?|days?|weeks?|minutes?|mins?|months?|years?|seconds?)\\b))';
const FIGURES = new RegExp(FIGURE_SOURCE, 'gi');

// A value set out as an example or a spec ("Carbon = 0.31%") is that,
// wherever else it comes up in the post, not a figure for a card.
const SPEC_VALUES = new RegExp(`=\\s*(${FIGURE_SOURCE})`, 'gi');

// Words left dangling at the end of the text before a figure ("…reduced
// onboarding time by" 70%, "…by a staggering" 90%).
const TRAILING_FILLER =
  /\s+(?:by|of|to|at|in|for|from|with|on|nearly|about|around|over|under|than|more|less|only|just|up|almost|approximately|approx|roughly|some|the|a|an|is|are|was|were|be|been|as|much|many|reportedly|average|estimated|staggering|whopping|impressive|remarkable)$/i;

// Of those, the ones that tie the figure to the words before it: with one,
// those words read as what the figure measures ("Turnaround time reduced
// by" 40%); without one the figure is their object ("…formats and hit"
// 30%), and the words after it say more ("30% recycling by 2028").
const LINKING_WORD = /^(?:by|of|to|at|in|for|from|with|on|than)$/i;

// Symbols left at the end of the text before a figure ("plateaued at ~",
// "Carbon =", "reading “").
const TRAILING_SYMBOLS = /[\s~≈=“"‘'(\[{\-–—:/&+#*]+$/;

// Text after a figure that reads well straight after it ("40% of U.S.
// undergraduates…").
const READS_AFTER = /^(?:of|per|in|on|faster|fewer|less|more|lower|higher|reduction|increase|decrease|savings?|cut|drop|growth)\b/i;

// Words a label can't start on, as part of a sentence rather than a whole
// ("to 90% of…", "or 10× volume").
const CONTINUATION_START = /^(?:to|and|or|but|nor|than|vs)\b/i;

// Words a label can't end on and still read as a whole ("McKinsey &
// Company highlights that").
const DANGLING_END =
  /\b(?:and|or|nor|but|that|which|who|whom|whose|where|when|if|because|while|whether|than|like|including|such as|vs)$/i;

// Text after a figure that opens with one of these is a new clause or an
// aside ("…60%, with no real productivity gain", "…in 2023"), not what the
// figure counts.
const FUNCTION_START =
  /^(?:a|an|the|and|or|but|nor|so|yet|as|at|by|for|from|in|into|of|off|on|onto|out|over|per|to|up|upon|with|within|without|than|that|this|these|those|which|who|whom|whose|what|when|where|while|why|how|is|are|was|were|be|been|being|has|have|had|do|does|did|can|could|will|would|shall|should|may|might|must|it|its|they|their|them|we|our|you|your|he|she|his|her|i|my|me|us|if|because|since|until|after|before|during|across|between|among|through|via|vs)\b/i;

// A question's opening words ("What happens to accuracy at 5×…?").
const QUESTION_START = /^(?:what|how|why|when|where|which|who|does|do|did|is|are|can|could|would|will|should)\b/i;

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

// "1. Title", "1) Title", "1: Title", or a keycap emoji ("1️⃣ Title").
// "5.1 Title" (a sub-point) and "2025: …" don't match.
const ITEM_NUMBER = /^\s*(?:(\d{1,2})\s*[.):]\s+|(\d)️?⃣\s*|(🔟)\s*)/u;

// Steps instead of cards when every item is at most this long.
const STEP_MAX_WORDS = 45;

// A labelled line: "<strong>Label:</strong> text" with a short label.
const FACT_LABEL_MAX_WORDS = 5;

// Facts that close an item card, shown in its footer strip.
const FOOT_LABEL =
  /^(best (?:fit|for)|ideal for|who it'?s for|good for|impact|business impact|outcome|results?|the result|bottom line|verdict|key takeaway)$/i;

// Arrows between the stages of a process ("Upload → Extract → Validate").
const ARROW = /\s*(?:→|->|⟶|➝|➔|⇒)\s*/;

// A star software name in a card title or table row marks our own entry.
const OURS = /\bstar\s?software\b/i;

const CHECK_ICON =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

const words = (text) => text.split(/\s+/).filter(Boolean);

function clean(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function sentencesOf(text) {
  // Not after initials such as "U.S." mid-sentence.
  return clean(text).split(/(?<=[a-z0-9)”"%][.!?])\s+(?=[A-Z“"])/);
}

// Elements that end a line of text: line breaks, blocks, and the titles
// the passes above set apart (a feature's bold title loses its colon, so
// its text would otherwise run straight into the sentence after it:
// "Faster ProcessingProcessing time…").
const LINE_BREAKING = /^(?:BR|P|DIV|LI|UL|OL|DL|DT|DD|H[1-6]|BLOCKQUOTE|FIGURE|FIGCAPTION|TABLE|TR|TD|TH)$/;
const TITLE_CLASSES = '.rh-feature-title, .rh-step-t, .rh-item-title, .rh-callout-label, .rh-flow-label';

function linesOf(block) {
  let text = '';
  const walk = (node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === 3) text += child.textContent;
      if (child.nodeType !== 1) continue;
      const breaks = LINE_BREAKING.test(child.tagName) || child.matches(TITLE_CLASSES);
      if (breaks) text += '\n';
      walk(child);
      if (breaks) text += '\n';
    }
  };
  walk(block);
  return text.split('\n').map(clean).filter(Boolean);
}

// Lines that pair a field with its value ("Heat Number: 98% confidence"),
// three or more to a block, are sample output, read like a table.
function isListing(lines) {
  return lines.filter((line) => /^[^:]{2,40}:\s*[~≈$]?\d/.test(line)).length >= 3;
}

// The value as a card shows it: "80% to 90%" and "60 to 70 percent" as
// "80–90%" and "60–70%".
function valueOf(figure) {
  return clean(figure)
    .replace(/^([~≈])\s+/, '$1')
    .replace(/\s?percent\b/i, '%')
    .replace(/%?\s*(?:[–-]|\bto\b)\s*(?=[$\d])/, '–');
}

const letterWords = (text) => words(text).filter((word) => /[a-z]/i.test(word)).length;

// Whether a label reads as a whole: two words or more, not opening or
// closing mid-sentence.
function readsWhole(label) {
  return letterWords(label) >= 2 && !CONTINUATION_START.test(label) && !DANGLING_END.test(label);
}

// Picks the words around a figure that best describe it, or null when
// neither side makes a readable label.
function labelFor(sentence, match) {
  const start = match.index;
  const end = start + match[0].length;
  const head = sentence.slice(0, start);

  // "From an average of 50% to 95%", "from $9.15 billion in 2022 to…": a
  // change, which no one figure from it describes.
  if (/\bfrom\b(?:\s+\S+){0,3}\s*$/i.test(head) || /\bfrom\b.*\d.*\bto\b(?:\s+\S+){0,2}\s*$/i.test(head)) {
    return null;
  }

  // Less the closing quote of a quoted figure ("reading “0.02%” as…").
  const tail = sentence.slice(end).replace(/^\s*[”"’')\]]+/, '');
  // "…by 65% and cut down review times": what follows "and" is a clause of
  // its own, not what the figure counts.
  const joined = /^\s*(?:and|but|while)\s/i.test(tail);
  const after = tail
    // A full stop ends the clause only before a capital or the end, so
    // "U.S. undergraduates" stays whole; so does "but" or "while" ("$1
    // billion in fines and settlements but also…").
    .split(/[,;:—()]|\.(?=\s+[A-Z“"]|\s*$)|\s(?:but|while|whereas)\s/)[0]
    .trim()
    .replace(/[.?!…\s]+$/, '');

  // "Average Processing Time: 45 minutes per transcript" — a lead-in label,
  // with its "per …" ("Processing time per MTR").
  const leadIn = head.match(/^\s*([A-Z][^:]{2,60}):\s*$/);
  if (leadIn) {
    const per = /^per\s+\S+(?:\s+\S+)?$/i.test(after) ? ` ${after}` : '';
    return `${leadIn[1]}${per}`;
  }

  let before = head
    .split(/[,;:—–()]/)
    .pop()
    .trim()
    .replace(/^(?:and|but|so|while|with|yet)\s+/i, '');
  let linked = false;
  for (let last = null; last !== before; ) {
    last = before;
    before = before.replace(TRAILING_SYMBOLS, '');
    const filler = before.match(TRAILING_FILLER);
    if (filler) {
      if (LINKING_WORD.test(filler[0].trim())) linked = true;
      before = before.slice(0, filler.index);
    }
  }

  // In a question only the words straight after the figure read as a fact
  // ("…lose an average of $11 per invoice…?").
  const question = /\?\s*$/.test(sentence);
  const afterOk = !joined && readsWhole(after);
  const beforeOk =
    !question &&
    readsWhole(before) &&
    !QUESTION_START.test(before) &&
    // Not a verb waiting for the figure ("Instead of reviewing").
    !/\b[a-z]+ing$/.test(before);

  const pick =
    (afterOk && READS_AFTER.test(after) && words(after).length >= 3 && after) ||
    // The thing the figure counts ("85% touchless document matching"), not
    // an aside ("$52 billion globally in 2023").
    (!question && afterOk && !linked && /^[a-z]/.test(after) && !FUNCTION_START.test(after) &&
      !/^[a-z]+ly\b/.test(after) && words(after).length >= 3 && after) ||
    (beforeOk && before) ||
    (!question && afterOk && words(after).length >= 3 && after) ||
    null;
  if (!pick || words(pick).length > 16) return null;
  return pick;
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
    // Rolls into place on screen (the article page starts it).
    v.append(buildRollingNumber(doc, value));
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
    if (p.closest('.rh-item, .rh-facts, .rh-steps')) continue;
    const first = p.firstElementChild;
    if (!first || first.tagName !== 'STRONG' || p.firstChild !== first) continue;
    const label = clean(first.textContent).replace(/:$/, '');
    if (!LABELLED_PARAGRAPH.test(label)) continue;
    // A label on its own line ("<b>Impact:</b>") labels the list after it;
    // with no list it's left as it is rather than emptied.
    if (!clean(p.textContent.slice(first.textContent.length)).replace(/^:/, '')) {
      const list = p.nextElementSibling;
      if (list && /^(UL|OL)$/.test(list.tagName) && !list.className) {
        const box = makeCallout(doc, label);
        p.replaceWith(box);
        box.append(asChecklist(list));
      }
      continue;
    }
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
    if (p.closest('.rh-callout, table, details, .rh-item, .rh-facts, .rh-steps') || p.className) continue;
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

    // "<strong>Title</strong>: text" (or "– text") puts the title on its own
    // line, minus the colon. A bold opening that runs into its sentence
    // ("<strong>Admissions Teams</strong> cannot…") stays inline.
    const separated = items.map((li) => {
      const strong = li.querySelector('strong');
      const next = strong.nextSibling;
      const ownColon = /[:–—-]\s*$/.test(strong.textContent);
      const after = next && next.nodeType === 3 && /^\s*[:–—-]/.test(next.textContent);
      return ownColon || after ? { strong, next: after ? next : null } : null;
    });

    // Three to six short, titled items read best as a grid of cards.
    const asCards =
      list.tagName === 'UL' &&
      items.length <= 6 &&
      !list.closest('.rh-item') &&
      separated.every(Boolean) &&
      items.every((li) => words(clean(li.textContent)).length <= 32);
    list.classList.add(asCards ? 'rh-cards' : 'rh-feature-list');

    items.forEach((li, i) => {
      const sep = separated[i];
      if (!sep) return;
      const { strong, next } = sep;
      strong.classList.add('rh-feature-title');
      strong.textContent = strong.textContent.replace(/\s*[:–—-]\s*$/, '');
      if (next) next.textContent = next.textContent.replace(/^\s*[:–—-]\s*/, '');
      if (asCards) {
        const icon = doc.createElement('span');
        icon.className = 'rh-cards-ic';
        icon.innerHTML = CHECK_ICON;
        li.prepend(icon);
      }
    });
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

// ---------------------------------------------------------------------------
// Structured blocks
// ---------------------------------------------------------------------------

const pad2 = (n) => String(n).padStart(2, '0');

// The first node with something in it (skipping whitespace text).
function firstMeaningful(nodes) {
  return [...nodes].find((n) => n.nodeType === 1 || clean(n.textContent || ''));
}

// Drops a leading colon, dash and line breaks left behind once a label is
// taken off the front of some content.
function trimLead(holder) {
  for (;;) {
    const first = holder.firstChild;
    if (!first) return;
    if (first.nodeName === 'BR' || (first.nodeType === 3 && !clean(first.textContent))) {
      first.remove();
      continue;
    }
    if (first.nodeType === 3) {
      first.textContent = first.textContent.replace(/^\s*[:：–—-]?\s*/, '');
      if (!first.textContent) {
        first.remove();
        continue;
      }
    }
    return;
  }
}

// A bold label at the start of some nodes: { label, strong } or null. The
// label needs a colon (in the bold or straight after it) unless nothing
// follows it, so a bold opening that runs into its sentence isn't a label.
function leadLabel(nodes) {
  const first = firstMeaningful(nodes);
  if (!first || first.nodeType !== 1 || !/^(STRONG|B)$/.test(first.tagName)) return null;
  const raw = clean(first.textContent);
  const label = raw.replace(/\s*[:：]\s*$/, '');
  if (!label || words(label).length > FACT_LABEL_MAX_WORDS || /[.?!]$/.test(label)) return null;
  const list = [...nodes];
  const rest = clean(list.slice(list.indexOf(first) + 1).map((n) => n.textContent || '').join(' '));
  const colon = /[:：]$/.test(raw) || /^[:：–—-]/.test(rest);
  if (!colon && rest) return null;
  return { label, strong: first, empty: !rest.replace(/^[:：–—-]\s*/, '') };
}

// The facts in one paragraph: "<b>A:</b> x<br><b>B:</b> y" is two, a label
// with the rest of the paragraph after it (even past a <br>) is one.
function paragraphFacts(doc, p) {
  if (p.tagName !== 'P' || p.className) return null;
  const segments = [[]];
  for (const node of [...p.childNodes]) {
    if (node.nodeName === 'BR') segments.push([]);
    else segments[segments.length - 1].push(node);
  }
  const filled = segments.filter((seg) => seg.some((n) => clean(n.textContent || '')));
  const leads = filled.map(leadLabel);
  if (!leads[0]) return null;

  // Copies, not the nodes themselves: a paragraph is only replaced once its
  // run of facts is long enough, and until then it must stay whole.
  const valueOf = (nodes, strong) => {
    const dd = doc.createElement('dd');
    dd.append(...nodes.filter((n) => n !== strong).map((n) => n.cloneNode(true)));
    trimLead(dd);
    return dd;
  };

  if (filled.length >= 2 && leads.every((lead) => lead && !lead.empty)) {
    return filled.map((seg, i) => ({ label: leads[i].label, value: valueOf(seg, leads[i].strong) }));
  }
  // One label; its value is the rest of the paragraph, even when the label
  // sits on its own line ("<b>What it measures:</b><br>The share of…").
  const value = valueOf([...p.childNodes], leads[0].strong);
  const hasValue = clean(value.textContent) || value.querySelector('img');
  return [{ label: leads[0].label, value: hasValue ? value : null }];
}

function buildFact(doc, label, value) {
  const row = doc.createElement('div');
  row.className = 'rh-fact';
  const dt = doc.createElement('dt');
  dt.textContent = label;
  row.append(dt, value);
  return row;
}

// Runs of labelled lines among `container`'s children become one <dl>. A
// label with nothing after it takes the list that follows as its value.
// Runs shorter than `minRun` are left for the callout passes.
function factRows(doc, container, minRun) {
  const flush = (run) => {
    if (run.facts.length < minRun) return;
    const dl = doc.createElement('dl');
    dl.className = 'rh-facts';
    run.first.before(dl);
    for (const { label, value } of run.facts) dl.append(buildFact(doc, label, value));
    run.used.forEach((el) => el.remove());
  };

  let run = null;
  for (const el of [...container.children]) {
    if (run && run.used.includes(el)) continue;
    const facts = el.tagName === 'P' ? paragraphFacts(doc, el) : null;
    let usable = null;
    if (facts) {
      const [only] = facts;
      if (facts.length === 1 && !only.value) {
        const list = el.nextElementSibling;
        if (list && /^(UL|OL)$/.test(list.tagName) && !list.className) {
          // A copy too; the list itself goes only if the run is used.
          const dd = doc.createElement('dd');
          dd.append(list.cloneNode(true));
          usable = { facts: [{ label: only.label, value: dd }], used: [el, list] };
        }
      } else {
        usable = { facts, used: [el] };
      }
    }
    if (usable) {
      if (!run) run = { first: el, facts: [], used: [] };
      run.facts.push(...usable.facts);
      run.used.push(...usable.used);
    } else if (run) {
      flush(run);
      run = null;
    }
  }
  if (run) flush(run);
}

const isItemHeading = (el) => /^H[3-5]$/.test(el.tagName) && ITEM_NUMBER.test(el.textContent) && itemTitle(el);

function itemTitle(heading) {
  return clean(heading.textContent).replace(ITEM_NUMBER, '').replace(/^[:.\-–—\s]+/, '').trim();
}

function itemNumber(heading) {
  const m = clean(heading.textContent).match(ITEM_NUMBER);
  return m[1] || m[2] || (m[3] ? '10' : '');
}

// Groups of consecutive numbered headings at one level, each item running
// to the next heading of its level or above.
function itemGroups(body) {
  const groups = [];
  let el = body.firstElementChild;
  while (el) {
    if (!isItemHeading(el)) {
      el = el.nextElementSibling;
      continue;
    }
    const tag = el.tagName;
    const level = Number(tag[1]);
    const group = [];
    let h = el;
    while (h && h.tagName === tag && isItemHeading(h)) {
      const nodes = [];
      let n = h.nextElementSibling;
      while (n && !(/^H[1-6]$/.test(n.tagName) && Number(n.tagName[1]) <= level)) {
        nodes.push(n);
        n = n.nextElementSibling;
      }
      group.push({ heading: h, nodes });
      h = n;
    }
    if (group.length >= 2) groups.push(group);
    el = h;
  }
  return groups;
}

function buildSteps(doc, group) {
  const ol = doc.createElement('ol');
  ol.className = 'rh-steps';
  group.forEach(({ heading, nodes }, i) => {
    const li = doc.createElement('li');
    li.dataset.n = pad2(itemNumber(heading) || i + 1);
    const title = doc.createElement(heading.tagName.toLowerCase());
    title.className = 'rh-step-t';
    title.textContent = itemTitle(heading);
    li.append(title);
    if (nodes.length) {
      const b = doc.createElement('div');
      b.className = 'rh-step-b';
      b.append(...nodes);
      li.append(b);
    }
    ol.append(li);
  });
  group[0].heading.before(ol);
  group.forEach(({ heading }) => heading.remove());
}

function buildCard(doc, { heading, nodes }) {
  // A numbered heading with nothing under it stays a heading; a card with
  // only a title looks broken.
  if (!nodes.some((n) => clean(n.textContent) || n.querySelector?.('img'))) return;
  const title = itemTitle(heading);
  const card = doc.createElement('article');
  card.className = 'rh-item';
  const ours = OURS.test(title);
  if (ours) card.classList.add('rh-item--ours');

  const head = doc.createElement('header');
  head.className = 'rh-item-head';
  const num = doc.createElement('span');
  num.className = 'rh-item-n';
  num.textContent = pad2(itemNumber(heading));
  const h = doc.createElement(heading.tagName.toLowerCase());
  h.className = 'rh-item-title';
  h.textContent = title;
  head.append(num, h);
  if (ours) {
    const badge = doc.createElement('span');
    badge.className = 'rh-badge';
    badge.textContent = 'Our product';
    head.append(badge);
  }

  const body = doc.createElement('div');
  body.className = 'rh-item-body';
  body.append(...nodes);
  card.append(head, body);
  heading.replaceWith(card);

  // Inside a card every labelled line is a fact row.
  factRows(doc, body, 1);

  const first = body.firstElementChild;
  if (first && first.tagName === 'P' && !first.className) first.classList.add('rh-item-over');

  // A closing "Best fit" / "Impact" fact moves to the footer strip.
  const last = body.lastElementChild;
  const lastFact = last && last.classList.contains('rh-facts') ? last.lastElementChild : null;
  if (lastFact && FOOT_LABEL.test(clean(lastFact.firstElementChild.textContent))) {
    const foot = doc.createElement('div');
    foot.className = 'rh-item-foot';
    const label = doc.createElement('span');
    label.className = 'rh-item-foot-label';
    label.textContent = lastFact.firstElementChild.textContent;
    const value = doc.createElement('div');
    value.className = 'rh-item-foot-value';
    value.append(...lastFact.lastElementChild.childNodes);
    foot.append(label, value);
    lastFact.remove();
    if (!last.children.length) last.remove();
    card.append(foot);
  }
  if (!body.children.length && !clean(body.textContent)) body.remove();
}

// Numbered sub-headings: steps when every item is a line or two of text,
// cards otherwise.
function numberedItems(doc) {
  for (const group of itemGroups(doc.body)) {
    const short = group.every(
      ({ nodes }) =>
        nodes.length <= 2 &&
        nodes.every((n) => n.tagName === 'P' && !leadLabel(n.childNodes)) &&
        words(clean(nodes.map((n) => n.textContent).join(' '))).length <= STEP_MAX_WORDS
    );
    if (short) buildSteps(doc, group);
    else group.forEach((item) => buildCard(doc, item));
  }
}

// <ol> whose items open with a bold title: "<li><strong>Upload</strong>: …"
// or "<li><p><strong>Upload</strong> – …</p></li>".
function orderedSteps(doc) {
  for (const ol of [...doc.body.querySelectorAll('ol')]) {
    if (ol.className || ol.closest('table, details, .rh-callout, .rh-item')) continue;
    const items = [...ol.children].filter((el) => el.tagName === 'LI');
    if (items.length < 3 || items.length > 12) continue;

    const leadOf = (li) => {
      const first = firstMeaningful(li.childNodes);
      const holder = first && first.nodeType === 1 && first.tagName === 'P' ? first : li;
      const lead = firstMeaningful(holder.childNodes);
      return lead && lead.nodeType === 1 && /^(STRONG|B)$/.test(lead.tagName) && words(clean(lead.textContent)).length <= 10
        ? { holder, lead }
        : null;
    };
    const leads = items.map(leadOf);
    if (!leads.every(Boolean)) continue;

    const start = Number(ol.getAttribute('start')) || 1;
    ol.className = 'rh-steps';
    items.forEach((li, i) => {
      const { holder, lead } = leads[i];
      li.dataset.n = pad2(start + i);
      const title = doc.createElement('p');
      title.className = 'rh-step-t';
      title.textContent = clean(lead.textContent).replace(/\s*[:：–—-]\s*$/, '');
      lead.remove();
      trimLead(holder);
      if (holder !== li && !clean(holder.textContent) && !holder.querySelector('img')) holder.remove();
      const body = doc.createElement('div');
      body.className = 'rh-step-b';
      body.append(...li.childNodes);
      trimLead(body);
      li.append(title);
      if (clean(body.textContent) || body.querySelector('img')) li.append(body);
    });
  }
}

// "Upload → Extract → Validate → ERP" as a row of numbered stages. A bold
// label just before it ("Flow Diagram:") becomes the figure's label.
function flows(doc) {
  for (const p of [...doc.body.querySelectorAll('p')]) {
    if (p.closest('table, details, li')) continue;
    const parts = clean(p.textContent)
      .split(ARROW)
      // Quotes come off only when they wrap the whole stage.
      .map((part) => part.replace(/^[“"'](.*)[”"']$/, '$1').trim());
    if (parts.length < 3 || parts.length > 9 || parts.some((part) => !part || words(part).length > 7)) continue;

    const fig = doc.createElement('figure');
    fig.className = 'rh-flow';
    const prev = p.previousElementSibling;
    const lead = prev && prev.tagName === 'P' ? leadLabel(prev.childNodes) : null;
    if (lead && lead.empty) {
      const label = doc.createElement('p');
      label.className = 'rh-flow-label';
      label.textContent = lead.label;
      fig.append(label);
      prev.remove();
    }
    const ol = doc.createElement('ol');
    ol.className = 'rh-flow-steps';
    parts.forEach((part, i) => {
      const li = doc.createElement('li');
      const n = doc.createElement('span');
      n.className = 'rh-flow-n';
      n.textContent = pad2(i + 1);
      const t = doc.createElement('span');
      t.className = 'rh-flow-t';
      t.textContent = part;
      li.append(n, t);
      ol.append(li);
    });
    fig.append(ol);
    p.replaceWith(fig);
  }
}

// Tables framed, with a header row (a first row of <th> or all-bold cells
// counts) and Star Software's row highlighted.
function tables(doc) {
  for (const table of [...doc.body.querySelectorAll('table')]) {
    if (table.closest('.rh-table')) continue;
    // A first row that is one cell across the whole table is its title.
    const rowsAll = [...table.querySelectorAll('tr')];
    const widest = Math.max(0, ...rowsAll.map((tr) => tr.children.length));
    const titleRow = rowsAll[0];
    if (titleRow && titleRow.children.length === 1 && widest > 1 && clean(titleRow.textContent)) {
      const caption = doc.createElement('caption');
      caption.textContent = clean(titleRow.textContent);
      titleRow.remove();
      table.prepend(caption);
    }
    // Rows with nothing in them.
    for (const tr of [...table.querySelectorAll('tr')]) {
      if (!clean(tr.textContent) && !tr.querySelector('img')) tr.remove();
    }
    if (!table.querySelector('thead')) {
      const first = table.querySelector('tr');
      const cells = first ? [...first.children] : [];
      // Bold (or mostly bold: "P<b>aramete</b>r") cells; an empty corner
      // cell is fine.
      const boldOnly = (c) => {
        const bold = [...c.querySelectorAll('strong, b')].map((b) => b.textContent).join('').replace(/\s/g, '');
        return bold.length >= c.textContent.replace(/\s/g, '').length * 0.6;
      };
      const filled = cells.filter((c) => clean(c.textContent));
      if (filled.length >= 2 && table.querySelectorAll('tr').length >= 2 && cells.every((c) => c.tagName === 'TH' || !clean(c.textContent) || boldOnly(c))) {
        const thead = doc.createElement('thead');
        for (const c of cells) {
          if (c.tagName === 'TH') continue;
          const th = doc.createElement('th');
          th.innerHTML = c.innerHTML;
          c.replaceWith(th);
        }
        thead.append(first);
        table.prepend(thead);
      }
    }
    const rows = [...table.querySelectorAll('tbody tr')];
    if (rows.length >= 2) {
      for (const tr of rows) {
        const cell = tr.firstElementChild;
        if (!cell || !OURS.test(clean(cell.textContent))) continue;
        tr.classList.add('rh-row-ours');
        const badge = doc.createElement('span');
        badge.className = 'rh-badge';
        badge.textContent = 'Our product';
        cell.append(badge);
      }
    }
    const frame = doc.createElement('div');
    frame.className = 'rh-table';
    table.replaceWith(frame);
    frame.append(table);
  }
}

// ---------------------------------------------------------------------------
// Tidying, so every post reads the same whatever its editor did
// ---------------------------------------------------------------------------

// One list split into several ("<ul><li>A</li></ul><ul><li>B</li></ul>")
// becomes one list again.
function mergeAdjacentLists(doc) {
  for (const list of [...doc.body.querySelectorAll('ul, ol')]) {
    if (!list.isConnected || list.className) continue;
    let next = list.nextElementSibling;
    while (next && next.tagName === list.tagName && !next.className && list.nextSibling && onlySpaceBetween(list, next)) {
      list.append(...next.children);
      next.remove();
      next = list.nextElementSibling;
    }
  }
}

function onlySpaceBetween(a, b) {
  for (let n = a.nextSibling; n && n !== b; n = n.nextSibling) {
    if (n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())) return false;
  }
  return true;
}

// Paragraphs typed as bullets ("• Duplicate Check: …") become a list.
function typedBullets(doc) {
  const BULLET = /^\s*[•●▪◦‣]\s*/;
  let list = null;
  for (const p of [...doc.body.children]) {
    if (p.tagName !== 'P' || !BULLET.test(p.textContent)) {
      list = null;
      continue;
    }
    const li = doc.createElement('li');
    li.append(...p.childNodes);
    const first = [...li.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
    if (first) first.textContent = first.textContent.replace(BULLET, '');
    if (!list) {
      list = doc.createElement('ul');
      p.before(list);
    }
    list.append(li);
    p.remove();
  }
}

// A paragraph of dashes ("————") is a divider line.
function dividers(doc) {
  for (const p of [...doc.body.querySelectorAll('p')]) {
    if (/^[\s\-–—_=~*•.]{3,}$/.test(p.textContent) && !p.querySelector('img')) {
      const hr = doc.createElement('hr');
      hr.className = 'rh-divider';
      p.replaceWith(hr);
    }
  }
}

// A paragraph that is only bold text, used as a sub-heading, becomes a real
// sub-heading so it looks like the others; a bold question becomes a pull
// quote. Labels ("Example", "What it measures:") were taken by the callout
// and fact-row passes before this runs.
function boldSubheadings(doc) {
  for (const p of [...doc.body.querySelectorAll('p')]) {
    if (p.className || p.closest('.rh-callout, .rh-item, .rh-facts, .rh-steps, details, li, td, th, blockquote, figure')) continue;
    const bold = firstMeaningful(p.childNodes);
    if (!bold || bold.nodeType !== 1 || !/^(STRONG|B)$/.test(bold.tagName)) continue;
    const text = clean(p.textContent);
    if (clean(bold.textContent) !== text || !text || words(text).length > 12) continue;
    if (/[:：.,;]$/.test(text) || LABELLED_PARAGRAPH.test(text.replace(/:$/, ''))) continue;
    if (!p.nextElementSibling) continue;
    if (/\?$/.test(text)) {
      p.classList.add('rh-pullquote');
      continue;
    }
    const h = doc.createElement('h3');
    h.textContent = text;
    p.replaceWith(h);
  }
}

// Images in a post come at whatever size the editor inserted (often a 300px
// thumbnail). One with a large enough rendition in its srcset fills the
// column, the browser picking a sharp one; a small one stays its own size,
// centred. An image alone in its paragraph becomes a figure.
const FULL_IMAGE_MIN_PX = 700;

function images(doc) {
  for (const img of [...doc.body.querySelectorAll('img')]) {
    if (img.closest('table, .rh-cards, .rh-item-head')) continue;
    const widths = (img.getAttribute('srcset') || '')
      .split(',')
      .map((candidate) => parseInt(candidate.trim().split(/\s+/)[1], 10))
      .filter((w) => w > 0);
    const largest = Math.max(Number(img.getAttribute('width')) || 0, ...widths);
    if (largest >= FULL_IMAGE_MIN_PX) {
      img.classList.add('rh-img-full');
      img.setAttribute('sizes', '(max-width: 860px) 100vw, 920px');
    } else {
      img.classList.add('rh-img-small');
    }
    // Also when wrapped in bold or a link: the wrapper (and its link) stays.
    const p = img.closest('p');
    if (p && !p.className && !clean(p.textContent) && p.querySelectorAll('img').length === 1) {
      const figure = doc.createElement('figure');
      figure.className = 'rh-figure';
      p.replaceWith(figure);
      figure.append(...p.childNodes);
    }
  }
}

// Paragraphs emptied along the way (a title or label moved out of them).
function dropEmptyParagraphs(doc) {
  for (const p of [...doc.body.querySelectorAll('p')]) {
    if (!clean(p.textContent) && !p.querySelector('img')) p.remove();
  }
}

// A section heading that repeats the post's own title (already the page's
// h1) is dropped; its text stays.
export function dropRepeatedTitle(sections, postTitle) {
  const same = (a) => clean(a || '').toLowerCase() === clean(postTitle || '').toLowerCase();
  return sections.map((section) => (section.title && same(section.title) ? { ...section, title: null } : section));
}

// Adds each section's `dangerouslySetInnerHTML` prop, made once. React 19
// rewrites an element's HTML whenever that prop is a new object, which
// would undo what the page adds to the rendered post (heading ids, rolled
// numbers) on every re-render.
export function withMarkup(sections) {
  return sections.map((section) => ({ ...section, markup: { __html: section.html } }));
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
    // Editor leftovers first (split lists, typed bullets, dash lines), then
    // structure (flows take their label line, cards take their numbered
    // headings), then fact rows, then the single-callout passes for
    // whatever labelled lines are left, and last the bold lines still
    // standing in for sub-headings.
    mergeAdjacentLists(doc);
    typedBullets(doc);
    dividers(doc);
    flows(doc);
    tables(doc);
    numberedItems(doc);
    factRows(doc, doc.body, 2);
    orderedSteps(doc);
    labelledParagraphs(doc);
    leadInLists(doc);
    closingPassages(doc);
    if (title) sectionList(doc, title);
    featureLists(doc);
    pullQuotes(doc);
    boldSubheadings(doc);
    images(doc);
    dropEmptyParagraphs(doc);
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
  // Spec and example values count as already used.
  const seen = new Set(
    docs.flatMap(({ doc }) => [...doc.body.textContent.matchAll(SPEC_VALUES)].map((m) => valueOf(m[1])))
  );
  for (const { doc } of docs) {
    for (const block of doc.body.querySelectorAll('p, li')) {
      if (pooled.length >= MAX_STATS) return pooled;
      if (block.closest('table, details')) continue;
      const lines = linesOf(block);
      if (isListing(lines)) continue;
      const stat = firstStat(lines.flatMap(sentencesOf), seen);
      if (!stat) continue;
      seen.add(stat.value);
      pooled.push({ ...stat, block });
    }
  }
  return pooled;
}

// The first figure in these sentences with a readable label.
function firstStat(sentences, seen) {
  for (const sentence of sentences) {
    for (const match of sentence.matchAll(FIGURES)) {
      const value = valueOf(match[0]);
      if (seen.has(value)) continue;
      const label = labelFor(sentence, match);
      if (label) return { value, label };
    }
  }
  return null;
}
