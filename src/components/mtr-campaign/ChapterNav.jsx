import { useEffect, useRef, useState } from 'react';

// The sticky "On this page" bar. It appears once the first chapter comes up
// the screen, marks the chapter being read, and on narrow screens scrolls
// that chapter's link into the middle of the bar.
export default function ChapterNav({ chapters }) {
  const [current, setCurrent] = useState(null);
  const [shown, setShown] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const first = document.getElementById(chapters[0][0]);
      setShown(!!first && first.getBoundingClientRect().top < window.innerHeight * 0.6);
      let reading = null;
      chapters.forEach(([id]) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) reading = id;
      });
      setCurrent(reading);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [chapters]);

  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector('.is-on');
    if (link && list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2, behavior: 'smooth' });
    }
  }, [current]);

  return (
    <nav className={`cn${shown ? ' is-shown' : ''}`} aria-label="On this page">
      <ol ref={listRef}>
        {chapters.map(([id, label], i) => (
          <li key={id}>
            <a href={`#${id}`} className={current === id ? 'is-on' : undefined} aria-current={current === id ? 'location' : undefined}>
              <span>{i + 1}</span>
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
