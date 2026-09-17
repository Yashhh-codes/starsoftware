import React, { useState, useEffect, useRef } from 'react';

const WORDS = ['documents', 'workflows', 'processes', 'data'];
const CYCLE_INTERVAL_MS = 3200;
const ANIMATION_DURATION_MS = 550;

export default function AnimatedKeyword({ initialIndex = 0 }) {
  const [activeWordIndex, setActiveWordIndex] = useState(initialIndex);
  const [exitingWordIndex, setExitingWordIndex] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [widths, setWidths] = useState({});

  const measureRefs = useRef({});
  const timerRef = useRef(null);
  const animTimeoutRef = useRef(null);

  // Measure natural rendered text widths of each word across viewports
  useEffect(() => {
    const measureAll = () => {
      const nextWidths = {};
      WORDS.forEach((word) => {
        const el = measureRefs.current[word];
        if (el) {
          const rect = el.getBoundingClientRect();
          nextWidths[word] = Math.ceil(rect.width);
        }
      });
      setWidths(nextWidths);
    };

    measureAll();

    // Re-measure after custom fonts finish loading
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measureAll);
    }

    window.addEventListener('resize', measureAll);
    return () => {
      window.removeEventListener('resize', measureAll);
    };
  }, []);

  // Automatic cycling timer with tab visibility pause
  useEffect(() => {
    const tick = () => {
      setActiveWordIndex((prevActive) => {
        const nextActive = (prevActive + 1) % WORDS.length;
        setExitingWordIndex(prevActive);
        setIsTransitioning(true);

        if (animTimeoutRef.current) {
          clearTimeout(animTimeoutRef.current);
        }

        animTimeoutRef.current = setTimeout(() => {
          setExitingWordIndex(null);
          setIsTransitioning(false);
        }, ANIMATION_DURATION_MS);

        return nextActive;
      });
    };

    const startTimer = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(tick, CYCLE_INTERVAL_MS);
    };

    const stopTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    };

    startTimer();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopTimer();
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const activeWord = WORDS[activeWordIndex];
  const exitingWord = exitingWordIndex !== null ? WORDS[exitingWordIndex] : null;
  const activeWidth = widths[activeWord];

  return (
    <>
      {/* Dynamic Animated Pill */}
      <span
        className="hero-highlight-pill"
        style={{
          width: activeWidth ? `${activeWidth}px` : undefined,
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="hero-pill-viewport">
          {/* Invisible in-flow ghost word establishing exact baseline & height */}
          <span className="hero-pill-ghost" aria-hidden="true">
            {activeWord}
          </span>

          {/* Exiting word animation */}
          {exitingWord && (
            <span
              key={`exit-${exitingWord}`}
              className="hero-pill-word hero-pill-word-exit"
              aria-hidden="true"
            >
              {exitingWord}
            </span>
          )}

          {/* Entering / Active word animation */}
          <span
            key={`active-${activeWord}`}
            className={`hero-pill-word ${
              isTransitioning ? 'hero-pill-word-enter' : 'hero-pill-word-active'
            }`}
          >
            {activeWord}
          </span>
        </span>
      </span>

      {/* Hidden off-screen measurer sharing exact headline typography */}
      <span className="hero-pill-measurer" aria-hidden="true">
        {WORDS.map((word) => (
          <span
            key={word}
            ref={(el) => {
              measureRefs.current[word] = el;
            }}
            className="hero-pill-measure-item"
          >
            {word}
          </span>
        ))}
      </span>
    </>
  );
}
