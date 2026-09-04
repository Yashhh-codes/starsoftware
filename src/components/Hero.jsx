import React from 'react';
import HeroVideo from './HeroVideo';

export default function Hero() {
  return (
    <section className="hero-section" aria-label="Hero Section">
      <div className="hero-container">
        {/* Left/Center-Left Editorial Content */}
        <div className="hero-content">
          <h1 className="hero-headline">
            Automate the documents that run your business.
          </h1>

          <p className="hero-supporting-text">
            AI-powered document processing that extracts, validates and moves business data automatically.
          </p>

          <div className="hero-cta-wrapper">
            <a href="#demo" className="hero-primary-cta">
              <span>Get a Demo</span>
              <svg
                className="cta-arrow"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M6 3.5L10.5 8L6 12.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Large Animated Mesh Video Component Layered Behind & Extending Behind Navbar */}
      <div className="hero-visual-area">
        <HeroVideo />
      </div>
    </section>
  );
}
