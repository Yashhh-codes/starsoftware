import React, { useEffect, useRef, useState } from 'react';
import { LOOP, rollingWords, rollWhenSeen } from '../utils/rollingNumber';
import './RollingNumber.css';

// A number that rolls into place when it scrolls into view; how it moves is
// described in src/utils/rollingNumber.js.

const STRIP = Array.from({ length: LOOP * 2 }, (_, n) => n % LOOP);

export default function RollingNumber({ value, className = '' }) {
  const ref = useRef(null);
  const [rolled, setRolled] = useState(false);

  // Roll once, when most of the number is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      setRolled(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRolled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={`rn${rolled ? ' rn--rolled' : ''} ${className}`.trim()}>
      <span className="rn-sr">{value}</span>
      <span className="rn-visual" aria-hidden="true">
        {rollingWords(value).map((parts, w) => (
          <span key={w} className="rn-word">
            {parts.map((part, i) =>
              part.text !== undefined ? (
                <span key={i} className="rn-sym" style={{ '--rn-delay': `${part.delay}ms` }}>
                  {part.text}
                </span>
              ) : (
                <span key={i} className="rn-digit">
                  <span className="rn-strip" style={{ '--rn-to': LOOP + part.digit, '--rn-delay': `${part.delay}ms` }}>
                    {STRIP.map((n, k) => (
                      <span key={k}>{n}</span>
                    ))}
                  </span>
                </span>
              )
            )}
          </span>
        ))}
      </span>
    </span>
  );
}

// For rolling numbers inside HTML rendered with dangerouslySetInnerHTML (the
// number cards in posts): rolls each one as it comes into view. `key`
// changes when that HTML does.
export function useRollingNumbers(ref, key) {
  useEffect(() => {
    if (!ref.current) return undefined;
    return rollWhenSeen(ref.current);
  }, [ref, key]);
}
