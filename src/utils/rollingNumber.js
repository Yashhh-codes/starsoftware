// Rolling numbers, shared by the RollingNumber component (resources page)
// and the number cards inside posts, which enhanceArticle.js builds as HTML.
// Styles: src/components/RollingNumber.css.
//
// Each digit sits on a strip of 0–9 twice over and rolls to its value, so
// every digit turns at least one full loop. Digits start left to right, a
// beat apart. Text before the first digit ("Up to") shows straight away,
// separators inside a number ("2.5", "15–30") arrive with the digit after
// them, and trailing text ("%", "M+", "minutes") fades in as the digits
// settle.

export const LOOP = 10;
export const STAGGER_MS = 140;
// Trailing text follows once the digits are mostly turned.
const SYMBOL_LAG_MS = 600;

// The value as words (the line can wrap between them), each a list of parts:
// { digit, delay } or { text, delay }.
export function rollingWords(value) {
  const chars = [...value.trim()];
  const digitTotal = chars.filter((char) => /\d/.test(char)).length;
  const settle = digitTotal * STAGGER_MS + SYMBOL_LAG_MS;

  const words = [[]];
  let digitsSeen = 0;
  for (const char of chars) {
    if (/\s/.test(char)) {
      if (words[words.length - 1].length) words.push([]);
      continue;
    }
    const parts = words[words.length - 1];
    if (/\d/.test(char)) {
      parts.push({ digit: Number(char), delay: digitsSeen * STAGGER_MS });
      digitsSeen += 1;
      continue;
    }
    const delay = digitsSeen === 0 ? 0 : digitsSeen < digitTotal ? digitsSeen * STAGGER_MS : settle;
    const last = parts[parts.length - 1];
    if (last && last.text !== undefined && last.delay === delay) last.text += char;
    else parts.push({ text: char, delay });
  }
  return words.filter((parts) => parts.length);
}

// The same markup as the component, as DOM nodes in `doc` (a DOMParser
// document), for HTML that's rendered with dangerouslySetInnerHTML.
export function buildRollingNumber(doc, value) {
  const el = (tag, className, text) => {
    const node = doc.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const root = el('span', 'rn');
  root.append(el('span', 'rn-sr', value));
  const visual = el('span', 'rn-visual');
  visual.setAttribute('aria-hidden', 'true');

  for (const parts of rollingWords(value)) {
    const word = el('span', 'rn-word');
    for (const part of parts) {
      if (part.text !== undefined) {
        const sym = el('span', 'rn-sym', part.text);
        sym.setAttribute('style', `--rn-delay: ${part.delay}ms`);
        word.append(sym);
        continue;
      }
      const digit = el('span', 'rn-digit');
      const strip = el('span', 'rn-strip');
      strip.setAttribute('style', `--rn-to: ${LOOP + part.digit}; --rn-delay: ${part.delay}ms`);
      for (let n = 0; n < LOOP * 2; n += 1) strip.append(el('span', null, String(n % LOOP)));
      digit.append(strip);
      word.append(digit);
    }
    visual.append(word);
  }
  root.append(visual);
  return root;
}

// Rolls every number under `root` once, when most of it is on screen,
// including numbers that arrive later (the HTML under `root` can be
// replaced after this runs). Returns a cleanup function.
export function rollWhenSeen(root) {
  const unrolled = () => root.querySelectorAll('.rn:not(.rn--rolled)');

  if (!('IntersectionObserver' in window)) {
    const rollAll = () => unrolled().forEach((number) => number.classList.add('rn--rolled'));
    rollAll();
    const added = new MutationObserver(rollAll);
    added.observe(root, { childList: true, subtree: true });
    return () => added.disconnect();
  }

  const seen = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('rn--rolled');
        seen.unobserve(entry.target);
      }
    },
    { threshold: 0.6 }
  );
  // Observing a number twice is harmless, so new content just re-scans.
  const watch = () => unrolled().forEach((number) => seen.observe(number));
  watch();
  const added = new MutationObserver(watch);
  added.observe(root, { childList: true, subtree: true });
  return () => {
    seen.disconnect();
    added.disconnect();
  };
}
