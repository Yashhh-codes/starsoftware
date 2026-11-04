import { useEffect, useState } from 'react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

// Whether the visitor asks for less motion; follows the setting live.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(REDUCED_MOTION).matches);
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

// Whether the element is on screen. It turns false again when it leaves,
// so an animation can restart, unless `once` keeps it true.
export function useOnScreen(ref, { threshold = 0.2, once = false } = {}) {
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      setOnScreen(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOnScreen(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setOnScreen(false);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, once]);
  return onScreen;
}

// Counts 0 → total while the element is on screen, one step at a time,
// holds on the last, then starts again. With reduced motion it stays at
// the end.
export function useStepLoop(ref, total, { step = 650, hold = 2600 } = {}) {
  const reduced = useReducedMotion();
  const onScreen = useOnScreen(ref, { threshold: 0.3 });
  const [count, setCount] = useState(reduced ? total : 0);
  useEffect(() => {
    if (reduced || !onScreen) return undefined;
    const delay = count >= total ? hold : count === 0 ? 400 : step;
    const timer = setTimeout(() => setCount((n) => (n >= total ? 0 : n + 1)), delay);
    return () => clearTimeout(timer);
  }, [count, total, step, hold, reduced, onScreen]);
  return count;
}
