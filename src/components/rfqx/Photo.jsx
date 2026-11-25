// A real photo with a short caption, for the RFQ page's section heads and
// closing section. Lazy, with its size given so the page doesn't shift.
export default function Photo({ src, alt, w, h, children, className = '' }) {
  return (
    <figure className={`rqx-photo ${className}`} data-reveal="scale">
      <img src={`/home/img/${src}`} alt={alt} width={w} height={h} loading="lazy" decoding="async" />
      {children && (
        <figcaption>
          <span aria-hidden="true" />
          {children}
        </figcaption>
      )}
    </figure>
  );
}
