import { useEffect, useRef, useState } from 'react';
import { useInView, usePrefersReducedMotion } from '../../hooks/useMotion';

// A looping clock for the MTR page's animated pictures: `tick` counts up
// every `ms` while the element is on screen and the tab is visible, and
// wraps after `length` ticks. With reduced motion it rests on `rest`.
export function useLoop(ref, { ms = 700, length = 10, rest = length - 1, threshold = 0.3 } = {}) {
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { threshold });
  const [tick, setTick] = useState(reduced ? rest : 0);
  const timer = useRef(0);

  useEffect(() => {
    if (reduced) {
      setTick(rest);
      return undefined;
    }
    if (!inView) return undefined;
    const run = () => {
      if (!document.hidden) setTick((t) => (t + 1) % length);
    };
    timer.current = window.setInterval(run, ms);
    return () => window.clearInterval(timer.current);
  }, [reduced, inView, ms, length, rest]);

  return [tick, setTick, reduced];
}

// A value that counts up from 0 to `to` once the element comes on screen.
export function useCountUp(ref, to, { duration = 1400 } = {}) {
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { threshold: 0.4, once: true });
  const [value, setValue] = useState(reduced ? to : 0);
  useEffect(() => {
    if (reduced || !inView) return undefined;
    let frame = 0;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [reduced, inView, to, duration]);
  return value;
}
