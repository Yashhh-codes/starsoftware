// The campaign page's icons: drawn once into a hidden SVG sprite and used by
// name, so each one is a single <use> wherever it appears.
const ICONS = {
  arr: ['0 0 10 10', <path d="M3.5 2l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />],
  left: ['0 0 16 16', <path d="M13 8H3M7 4L3 8l4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />],
  right: ['0 0 16 16', <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />],
  expand: ['0 0 16 16', <path d="M9.5 3H13v3.5M13 3L9 7M6.5 13H3V9.5M3 13l4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />],
  plus: ['0 0 16 16', <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />],
  close: ['0 0 20 20', <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />],
  check: ['0 0 16 16', <path d="M3.5 8.4l2.9 2.9 6.1-6.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />],
  x: ['0 0 16 16', <path d="M4.5 4.5l7 7m0-7l-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />],
  alert: ['0 0 16 16', <path d="M8 4.2v4.6M8 11.3v.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />],
  play: ['0 0 16 16', <path d="M5 3.2v9.6L12.6 8z" fill="currentColor" />],
  doc: ['0 0 20 20', <path d="M5 2.5h7l3.5 3.5v11.5H5z M12 2.5V6h3.5 M7.5 10h5 M7.5 13h5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />],
  mail: ['0 0 20 20', <path d="M3 5h14v10.5H3z M3 5.5l7 5.5 7-5.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />],
  pin: [
    '0 0 20 20',
    <>
      <path d="M10 17.5s5.5-5 5.5-9.3a5.5 5.5 0 00-11 0c0 4.3 5.5 9.3 5.5 9.3z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="10" cy="8.2" r="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </>,
  ],
  phone: [
    '0 0 20 20',
    <path
      d="M6.6 3.5H4.6a1 1 0 00-1 1.1c.6 6.3 5.5 11.2 11.8 11.8a1 1 0 001.1-1v-2a1 1 0 00-.8-1l-2.6-.6a1 1 0 00-.9.3l-1.3 1.3a10 10 0 01-4.4-4.4l1.3-1.3a1 1 0 00.3-.9l-.6-2.6a1 1 0 00-1-.7z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />,
  ],
  chat: ['0 0 20 20', <path d="M3.5 4h13v9h-7l-4 3.5V13h-2z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />],
  book: [
    '0 0 20 20',
    <path d="M3 4.5h5c1 0 2 .8 2 2V17c0-.8-.7-1.5-1.5-1.5H3z M17 4.5h-5c-1 0-2 .8-2 2V17c0-.8.7-1.5 1.5-1.5H17z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />,
  ],
  checkSquare: [
    '0 0 20 20',
    <>
      <rect x="3" y="3" width="14" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.8 10.2l2.2 2.2 4.3-4.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>,
  ],
  layers: ['0 0 20 20', <path d="M10 3l7 3.6-7 3.6-7-3.6z M3 10.2l7 3.6 7-3.6 M3 13.6l7 3.6 7-3.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />],
  route: [
    '0 0 20 20',
    <>
      <circle cx="5" cy="5" r="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="15" cy="15" r="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 5h4.5a3 3 0 010 6h-3a3 3 0 000 6H13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>,
  ],
  factory: ['0 0 20 20', <path d="M2.5 17.5V8.5l4.5 3v-3l4.5 3V5h3.5l1 12.5z M1.5 17.5h17" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />],
  shield: ['0 0 20 20', <path d="M10 2.5l6 2.5v4.5c0 3.8-2.5 6.7-6 8-3.5-1.3-6-4.2-6-8V5z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />],
  user: [
    '0 0 20 20',
    <>
      <circle cx="10" cy="7" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.8 17c.8-3.2 3.3-5 6.2-5s5.4 1.8 6.2 5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>,
  ],
  list: ['0 0 20 20', <path d="M7 5.5h10M7 10h10M7 14.5h10M3.5 5.5h.1M3.5 10h.1M3.5 14.5h.1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />],
  trace: [
    '0 0 20 20',
    <>
      <circle cx="5" cy="5" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="15" cy="15" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 5h4a3 3 0 013 3v4.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2" />
    </>,
  ],
  clock: [
    '0 0 20 20',
    <>
      <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 6v4.2l2.8 1.8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>,
  ],
  pulse: ['0 0 20 20', <path d="M2 10.5h3.5l2-5 3.5 9 2-4.5H18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />],
  upload: ['0 0 20 20', <path d="M10 13V4M6 7.5l4-4 4 4M4 13.5v2.5h12v-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />],
};

// Rendered once at the top of the page.
export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      {Object.entries(ICONS).map(([name, [viewBox, shape]]) => (
        <symbol key={name} id={`mc-i-${name}`} viewBox={viewBox}>
          {shape}
        </symbol>
      ))}
    </svg>
  );
}

export function Icon({ name, className }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#mc-i-${name}`} />
    </svg>
  );
}
