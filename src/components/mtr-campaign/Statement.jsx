// A section heading: the claim, then its explanation in the softer colour.
export default function Statement({ text, small }) {
  return (
    <h2 className={`statement${small ? ' st-sm' : ''}`}>
      {text[0]}
      {text[1] && (
        <>
          {' '}
          <span>{text[1]}</span>
        </>
      )}
    </h2>
  );
}
