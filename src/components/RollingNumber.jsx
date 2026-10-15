import React, { useEffect, useRef, useState } from 'react';
import './RollingNumber.css';

// Each digit sits on a strip of 0–9 twice over and rolls to its value, so
// every digit turns at least one full loop. Digits start left to right,
// a beat apart; symbols ("M", "+", "%") fade in as the digits settle.
const LOOP = 10;
const STAGGER_MS = 140;
// Symbols follow once the digits are mostly turned.
const SYMBOL_LAG_MS = 600;

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

  let digitIndex = 0;
  const digitCount = [...value].filter((char) => /\d/.test(char)).length;

  return (
    <span ref={ref} className={`rn${rolled ? ' rn--rolled' : ''} ${className}`.trim()}>
      <span className="rn-sr">{value}</span>
      <span className="rn-visual" aria-hidden="true">
        {[...value].map((char, index) => {
          if (!/\d/.test(char)) {
            return (
              <span
                key={index}
                className="rn-sym"
                style={{ '--rn-delay': `${digitCount * STAGGER_MS + SYMBOL_LAG_MS}ms` }}
              >
                {char}
              </span>
            );
          }
          const delay = digitIndex * STAGGER_MS;
          digitIndex += 1;
          return (
            <span key={index} className="rn-digit">
              <span
                className="rn-strip"
                style={{ '--rn-to': LOOP + Number(char), '--rn-delay': `${delay}ms` }}
              >
                {Array.from({ length: LOOP * 2 }, (_, n) => (
                  <span key={n}>{n % LOOP}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
