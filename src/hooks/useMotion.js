import { useEffect, useRef, useState } from 'react';

// Motion helpers for the landing pages: scroll reveals, "is it on screen",
// and a step player for the animated sequences. Everything settles to its
// finished state for people who ask for reduced motion.

const REDUCED = '(prefers-reduced-motion: reduce)';

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(REDUCED).matches : false
  );
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const query = window.matchMedia(REDUCED);
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

// Reported at every tenth, so "on screen" can end as well as begin: with a
// single threshold the observer stays quiet as the element goes on out.
const STEPS = Array.from({ length: 11 }, (_, i) => i / 10);

// Whether at least `threshold` of the element is on screen (an element
// taller than the screen counts once it fills most of it). With `once`, it
// stays true after the first time.
export function useInView(ref, { threshold = 0.25, rootMargin = '0px', once = false } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        const height = entry.boundingClientRect.height;
        const fits = entry.rootBounds && height ? (entry.rootBounds.height / height) * 0.9 : 1;
        if (entry.isIntersecting && entry.intersectionRatio >= Math.min(threshold, fits)) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: STEPS, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin, once]);
  return inView;
}

function usePageVisible() {
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);
  return visible;
}

// Elements marked data-reveal inside `rootRef` fade and rise into place as
// they come on screen, once; --rv-delay staggers them. Styles in the page's
// CSS (`.mt-anim [data-reveal]`). Revealed elements get data-in rather than
// a class: React rewrites the class of an element whose state changes, and
// would take a reveal class off with it.
export function useReveal(rootRef, key) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const items = [...root.querySelectorAll('[data-reveal]:not([data-in])')];
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.setAttribute('data-in', ''));
      return undefined;
    }
    const reveal = (el) => {
      el.setAttribute('data-in', '');
      observer.unobserve(el);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    items.forEach((el) => observer.observe(el));

    // A jump (a #section link, a fling, a slow frame on a big screen) can
    // carry an element from below the screen to above it between two
    // observations, which the observer never reports: whatever the page
    // has scrolled past is shown too.
    let frame = 0;
    const catchUp = () => {
      frame = 0;
      for (const el of items) {
        if (!el.hasAttribute('data-in') && el.getBoundingClientRect().bottom <= 0) reveal(el);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(catchUp);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rootRef, key]);
}

// Steps through `durations` (ms per step) in a loop while `playing`, the
// element is on screen and the tab is visible. Returns [step, goTo].
export function useStepper(durations, playing) {
  const [step, setStep] = useState(0);
  const visible = usePageVisible();
  const timer = useRef(null);

  useEffect(() => {
    if (!playing || !visible) return undefined;
    timer.current = setTimeout(() => setStep((s) => (s + 1) % durations.length), durations[step]);
    return () => clearTimeout(timer.current);
  }, [step, playing, visible, durations]);

  return [step, setStep];
}
