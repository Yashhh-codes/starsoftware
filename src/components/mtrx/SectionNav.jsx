import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/useMotion';

const IDLE_MS = 1200;

// A sticky "on this page" bar: marks the section being read and keeps its
// pill in view. When the mouse rests, the bar fades out of the way of the
// content; the moment the mouse moves it comes back. It stays put while the
// pointer is over it or it has keyboard focus, and never fades on touch
// screens, which have no cursor to rest.
// items: [{ id, label, selector? }]; selector finds sections without an id.
export default function SectionNav({ items, cta }) {
  const [active, setActive] = useState(null);
  const [idle, setIdle] = useState(false);
  const barRef = useRef(null);
  const hover = useRef(false);
  const reduced = usePrefersReducedMotion();

  const target = (it) => document.getElementById(it.id) || (it.selector ? document.querySelector(it.selector) : null);

  // Which section is in the middle of the screen.
  useEffect(() => {
    const els = items.map((it) => [it.id, target(it)]).filter(([, el]) => el);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const hit = els.find(([, el]) => el === e.target);
          if (hit) setActive(hit[0]);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach(([, el]) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Keep the active pill in view on narrow screens.
  useEffect(() => {
    const bar = barRef.current;
    const a = bar && active ? bar.querySelector(`[data-id="${active}"]`) : null;
    if (a && bar.scrollWidth > bar.clientWidth) {
      bar.scrollTo({ left: a.offsetLeft - bar.clientWidth / 2 + a.offsetWidth / 2, behavior: reduced ? 'auto' : 'smooth' });
    }
  }, [active, reduced]);

  // Fade while the mouse is still.
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    let timer = 0;
    const arm = () => {
      window.clearTimeout(timer);
      setIdle(false);
      timer = window.setTimeout(() => {
        const bar = barRef.current;
        if (hover.current || (bar && bar.contains(document.activeElement))) return;
        setIdle(true);
      }, IDLE_MS);
    };
    window.addEventListener('mousemove', arm, { passive: true });
    window.addEventListener('wheel', arm, { passive: true });
    window.addEventListener('keydown', arm);
    arm();
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('mousemove', arm);
      window.removeEventListener('wheel', arm);
      window.removeEventListener('keydown', arm);
    };
  }, []);

  const go = (e, it) => {
    const el = target(it);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    if (it.id && window.history.replaceState) window.history.replaceState(null, '', `#${it.id}`);
  };

  return (
    <nav className={`mxn2${idle ? ' is-idle' : ''}`} aria-label="On this page">
      <div
        ref={barRef}
        className="mxn2-in"
        onMouseEnter={() => {
          hover.current = true;
          setIdle(false);
        }}
        onMouseLeave={() => {
          hover.current = false;
        }}
        onFocus={() => setIdle(false)}
      >
        {items.map((it) => (
          <a key={it.id} href={`#${it.id}`} data-id={it.id} className={active === it.id ? 'is-on' : ''} aria-current={active === it.id ? 'true' : undefined} onClick={(e) => go(e, it)}>
            {it.label}
          </a>
        ))}
        {cta && (
          <a className="mxn2-cta" href={cta.href}>
            {cta.label}
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        )}
      </div>
    </nav>
  );
}
