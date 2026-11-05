import { useEffect, useState } from 'react';
import { useOnScreen, useReducedMotion } from '../mtr-campaign/hooks';

// Counts 0 → total once the element is on screen, one step every `every`
// ms. Live, it plays again after a pause, for as long as it stays on
// screen. With reduced motion it shows the end.
export function useReplay(ref, total, every = 380, live = false) {
  const reduced = useReducedMotion();
  const onScreen = useOnScreen(ref, { threshold: 0.2, once: !live });
  const [step, setStep] = useState(reduced ? total : 0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reduced || !onScreen) return undefined;
    setStep(0);
    const timers = Array.from({ length: total }, (_, i) => setTimeout(() => setStep(i + 1), 300 + i * every));
    if (live) timers.push(setTimeout(() => setRun((n) => n + 1), 300 + total * every + 5000));
    return () => timers.forEach(clearTimeout);
  }, [reduced, onScreen, total, every, live, run]);

  return step;
}
