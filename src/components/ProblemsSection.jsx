import React, { useState, useEffect, useRef } from 'react';

const ProblemVisual = ({ problemIndex }) => {
  const visuals = [
    // 01 - Manual Data Entry
    <svg key="vis-1" className="problem-visual" viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="docGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,85,255,0.08)" />
          <stop offset="100%" stopColor="rgba(0,85,255,0.02)" />
        </linearGradient>
      </defs>
      {/* Document outline */}
      <rect x="40" y="30" width="120" height="190" fill="url(#docGrad1)" stroke="rgba(0,85,255,0.3)" strokeWidth="1" rx="2" />
      {/* Document lines (data) */}
      <line x1="55" y1="55" x2="145" y2="55" stroke="rgba(0,85,255,0.5)" strokeWidth="2" />
      <line x1="55" y1="75" x2="145" y2="75" stroke="rgba(0,85,255,0.5)" strokeWidth="2" />
      <line x1="55" y1="95" x2="145" y2="95" stroke="rgba(0,85,255,0.5)" strokeWidth="2" />
      {/* Hand/cursor entering data */}
      <circle cx="180" cy="60" r="8" fill="rgba(0,85,255,0.6)" />
      <line x1="180" y1="68" x2="165" y2="80" stroke="rgba(0,85,255,0.6)" strokeWidth="1.5" />
      {/* Additional document sheets */}
      <rect x="45" y="35" width="120" height="190" fill="none" stroke="rgba(0,85,255,0.15)" strokeWidth="0.5" rx="2" />
      <rect x="50" y="40" width="120" height="190" fill="none" stroke="rgba(0,85,255,0.1)" strokeWidth="0.5" rx="2" />
    </svg>,

    // 02 - Inconsistent Documents
    <svg key="vis-2" className="problem-visual" viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="docGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,85,255,0.1)" />
          <stop offset="100%" stopColor="rgba(0,85,255,0.02)" />
        </linearGradient>
      </defs>
      {/* Document 1 - standard format */}
      <rect x="30" y="40" width="75" height="120" fill="url(#docGrad2)" stroke="rgba(0,85,255,0.3)" strokeWidth="1" rx="2" />
      <line x1="40" y1="60" x2="95" y2="60" stroke="rgba(0,85,255,0.4)" strokeWidth="1.5" />
      <line x1="40" y1="75" x2="95" y2="75" stroke="rgba(0,85,255,0.4)" strokeWidth="1.5" />
      <line x1="40" y1="90" x2="85" y2="90" stroke="rgba(0,85,255,0.4)" strokeWidth="1.5" />

      {/* Document 2 - different format */}
      <rect x="125" y="30" width="75" height="140" fill="url(#docGrad2)" stroke="rgba(0,85,255,0.3)" strokeWidth="1" rx="2" />
      <circle cx="150" cy="55" r="6" fill="rgba(0,85,255,0.3)" />
      <circle cx="175" cy="55" r="6" fill="rgba(0,85,255,0.3)" />
      <line x1="135" y1="75" x2="185" y2="75" stroke="rgba(0,85,255,0.4)" strokeWidth="1.5" />
      <line x1="135" y1="100" x2="185" y2="100" stroke="rgba(0,85,255,0.4)" strokeWidth="1.5" />

      {/* Document 3 - another format */}
      <rect x="220" y="50" width="60" height="110" fill="url(#docGrad2)" stroke="rgba(0,85,255,0.3)" strokeWidth="1" rx="2" />
      <rect x="228" y="65" width="44" height="15" fill="rgba(0,85,255,0.1)" stroke="rgba(0,85,255,0.3)" strokeWidth="0.5" />
      <rect x="228" y="90" width="44" height="15" fill="rgba(0,85,255,0.1)" stroke="rgba(0,85,255,0.3)" strokeWidth="0.5" />
      <rect x="228" y="115" width="44" height="8" fill="rgba(0,85,255,0.1)" stroke="rgba(0,85,255,0.3)" strokeWidth="0.5" />
    </svg>,

    // 03 - Validation Takes Time
    <svg key="vis-3" className="problem-visual" viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="docGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,85,255,0.08)" />
          <stop offset="100%" stopColor="rgba(0,85,255,0.02)" />
        </linearGradient>
      </defs>
      {/* Document with validation fields */}
      <rect x="50" y="40" width="140" height="170" fill="url(#docGrad3)" stroke="rgba(0,85,255,0.3)" strokeWidth="1" rx="2" />

      {/* Field 1 - under review */}
      <line x1="65" y1="60" x2="130" y2="60" stroke="rgba(0,85,255,0.4)" strokeWidth="2" />
      <circle cx="145" cy="60" r="5" fill="none" stroke="rgba(0,85,255,0.5)" strokeWidth="1.5" />

      {/* Field 2 - checking */}
      <line x1="65" y1="90" x2="130" y2="90" stroke="rgba(0,85,255,0.4)" strokeWidth="2" />
      <path d="M 140 85 Q 145 90 150 85" fill="none" stroke="rgba(0,85,255,0.6)" strokeWidth="1.5" />

      {/* Field 3 - validated */}
      <line x1="65" y1="120" x2="130" y2="120" stroke="rgba(0,85,255,0.3)" strokeWidth="2" />
      <path d="M 138 115 L 145 123 L 155 108" fill="none" stroke="rgba(0,85,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Field 4 - pending */}
      <line x1="65" y1="150" x2="130" y2="150" stroke="rgba(0,85,255,0.4)" strokeWidth="2" />
      <circle cx="145" cy="150" r="4" fill="rgba(0,85,255,0.2)" stroke="rgba(0,85,255,0.5)" strokeWidth="1.5" />
    </svg>,

    // 04 - Disconnected Workflows
    <svg key="vis-4" className="problem-visual" viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,85,255,0.12)" />
          <stop offset="100%" stopColor="rgba(0,85,255,0.04)" />
        </linearGradient>
      </defs>
      {/* System/Node 1 */}
      <rect x="30" y="60" width="70" height="70" fill="url(#nodeGrad)" stroke="rgba(0,85,255,0.3)" strokeWidth="1.5" rx="4" />
      <line x1="40" y1="80" x2="90" y2="80" stroke="rgba(0,85,255,0.3)" strokeWidth="1" />
      <line x1="40" y1="95" x2="90" y2="95" stroke="rgba(0,85,255,0.3)" strokeWidth="1" />
      <line x1="40" y1="110" x2="75" y2="110" stroke="rgba(0,85,255,0.3)" strokeWidth="1" />

      {/* System/Node 2 */}
      <rect x="130" y="30" width="70" height="70" fill="url(#nodeGrad)" stroke="rgba(0,85,255,0.3)" strokeWidth="1.5" rx="4" />
      <line x1="140" y1="50" x2="190" y2="50" stroke="rgba(0,85,255,0.3)" strokeWidth="1" />
      <line x1="140" y1="65" x2="190" y2="65" stroke="rgba(0,85,255,0.3)" strokeWidth="1" />
      <line x1="140" y1="80" x2="180" y2="80" stroke="rgba(0,85,255,0.3)" strokeWidth="1" />

      {/* System/Node 3 */}
      <rect x="230" y="70" width="70" height="70" fill="url(#nodeGrad)" stroke="rgba(0,85,255,0.3)" strokeWidth="1.5" rx="4" />
      <line x1="240" y1="90" x2="290" y2="90" stroke="rgba(0,85,255,0.3)" strokeWidth="1" />
      <line x1="240" y1="105" x2="290" y2="105" stroke="rgba(0,85,255,0.3)" strokeWidth="1" />
      <line x1="240" y1="120" x2="280" y2="120" stroke="rgba(0,85,255,0.3)" strokeWidth="1" />

      {/* Broken/struggling connections */}
      <line x1="100" y1="85" x2="130" y2="60" stroke="rgba(0,85,255,0.2)" strokeWidth="1" strokeDasharray="3,3" />
      <line x1="200" y1="65" x2="230" y2="100" stroke="rgba(0,85,255,0.2)" strokeWidth="1" strokeDasharray="3,3" />

      {/* Manual transfer indicator */}
      <circle cx="115" cy="75" r="6" fill="rgba(0,85,255,0.3)" />
      <path d="M 110 75 L 120 75" stroke="rgba(0,85,255,0.5)" strokeWidth="1.5" />
    </svg>,
  ];

  return visuals[problemIndex];
};

const ProblemItem = ({ number, title, description, isActive, onClick, index }) => {
  return (
    <button
      className={`problem-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
      aria-pressed={isActive}
      role="tab"
      aria-selected={isActive}
    >
      <div className="problem-item-number">{number}</div>
      <div className="problem-item-text">
        <h3 className="problem-item-title">{title}</h3>
        <p className="problem-item-description">{description}</p>
      </div>
    </button>
  );
};

export default function ProblemsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const rotationIntervalRef = useRef(null);

  const problems = [
    {
      number: '01',
      title: 'Manual Data Entry',
      description: 'Teams spend hours entering information.',
    },
    {
      number: '02',
      title: 'Inconsistent Documents',
      description: 'Every supplier/customer uses different formats.',
    },
    {
      number: '03',
      title: 'Validation Takes Time',
      description: 'Important information needs to be manually checked.',
    },
    {
      number: '04',
      title: 'Disconnected Workflows',
      description: 'Data still has to move between systems.',
    },
  ];

  useEffect(() => {
    if (!isHovering) {
      rotationIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % problems.length);
      }, 4500);
    } else if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current);
    }

    return () => {
      if (rotationIntervalRef.current) clearInterval(rotationIntervalRef.current);
    };
  }, [isHovering, problems.length]);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const handleProblemClick = (index) => {
    setActiveIndex(index);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowDown' && index < problems.length - 1) {
      setActiveIndex(index + 1);
    } else if (e.key === 'ArrowUp' && index > 0) {
      setActiveIndex(index - 1);
    }
  };

  return (
    <section className="problems-section" aria-label="Problem Statement">
      <div className="problems-container">
        {/* Hero/Intro Area */}
        <div className="problems-hero">
          <div className="problems-hero-left">
            <div className="problems-eyebrow">THE PROBLEM</div>
            <h2 className="problems-headline">
              Manual document processing shouldn't slow your business down.
            </h2>
            <p className="problems-description">
              Manual workflows create unnecessary delays, inconsistent data, and validation bottlenecks across document-heavy operations.
            </p>
          </div>
          <div className="problems-hero-right">
            <ProblemVisual problemIndex={activeIndex} />
          </div>
        </div>

        {/* Interactive Problem Explorer */}
        <div
          className="problems-explorer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="tablist"
        >
          {/* Left: Problem List with Vertical Line */}
          <div className="problems-list-container">
            <div className="problems-list-line"></div>
            <ul className="problems-list" role="presentation">
              {problems.map((problem, idx) => (
                <li key={idx} role="presentation">
                  <ProblemItem
                    {...problem}
                    isActive={activeIndex === idx}
                    onClick={() => handleProblemClick(idx)}
                    index={idx}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Active Problem Content */}
          <div className="problems-content-panel">
            <div className="problems-content-wrapper">
              <div className="problems-content-number">
                {problems[activeIndex].number}
              </div>
              <div className="problems-content-body">
                <h3 className="problems-content-title">
                  {problems[activeIndex].title}
                </h3>
                <p className="problems-content-description">
                  {problems[activeIndex].description}
                </p>
              </div>
            </div>
            <div className="problems-content-visual">
              <ProblemVisual problemIndex={activeIndex} />
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="problems-progress" aria-hidden="true">
          {problems.map((_, idx) => (
            <div
              key={idx}
              className={`problems-progress-dot ${
                idx === activeIndex ? 'active' : ''
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
