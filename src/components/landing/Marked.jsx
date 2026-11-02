import React from 'react';

// Headlines with their key phrase set apart, the copy unchanged: as a
// token (an inline chip with an icon, like a field in the product) or in
// the ribbon gradient. Styles: mt-token in MtrLanding.css.

export function Token({ icon: Icon, tone = 'violet', scan = false, children }) {
  return (
    <span className={`mt-token mt-token--${tone}${scan ? ' mt-token--scan' : ''}`}>
      <span className="mt-token-ic" aria-hidden="true">
        <Icon />
      </span>
      {children}
    </span>
  );
}

// `text` with each mark's phrase (its first occurrence) rendered by the
// mark: [{ phrase, render: (phrase) => node }]. With `sentences`, each
// sentence stays whole on a line where it fits (mt-sentence).
export function Marked({ text, marks, sentences = false }) {
  if (sentences) {
    return text.split(/(?<=[.?!])\s+/).map((sentence, i) => (
      <React.Fragment key={i}>
        {i > 0 && ' '}
        <span className="mt-sentence">
          <Marked text={sentence} marks={marks} />
        </span>
      </React.Fragment>
    ));
  }
  let parts = [text];
  for (const mark of marks) {
    parts = parts.flatMap((part) => {
      if (typeof part !== 'string') return [part];
      const at = part.indexOf(mark.phrase);
      if (at < 0) return [part];
      return [part.slice(0, at), mark.render(mark.phrase), part.slice(at + mark.phrase.length)];
    });
  }
  return parts.map((part, i) => <React.Fragment key={i}>{part}</React.Fragment>);
}

export const gradient = (phrase) => <em>{phrase}</em>;
