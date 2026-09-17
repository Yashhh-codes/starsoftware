import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Link as LinkIcon, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ArticleDetailPreview.css';

const WorkflowStage = ({ number, label, isActive }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltips = {
    1: 'Incoming material test report document',
    2: 'AI-powered field extraction',
    3: 'Automatic heat batch identification',
    4: 'Cross-reference validation',
    5: 'Compliance verification',
    6: 'Real-time ERP sync',
  };

  return (
    <div
      className={`workflow-stage ${isActive ? 'active' : ''}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="stage-box">
        <div className="stage-number">{number}</div>
        <div className="stage-label">{label}</div>
      </div>
      {number < 6 && <div className="stage-arrow">→</div>}
      {showTooltip && <div className="stage-tooltip">{tooltips[number]}</div>}
    </div>
  );
};

const SkeletonLine = ({ width = '100%', height = '1rem', marginBottom = '0.75rem' }) => (
  <div
    className="skeleton-line"
    style={{
      width,
      height,
      marginBottom,
    }}
  />
);

export default function ArticleDetailPreview() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="article-detail-page">
      <Navbar variant="solid" />

      {/* Reading Progress Bar */}
      <div className="article-progress-bar" style={{ width: `${scrollProgress}%` }} />

      <article className="article-container">
        {/* Article Header */}
        <header className="article-header">
          <div className="article-utilities">
            <Link to="/resources" className="article-back">
              <ArrowLeft size={18} />
              <span>Back to Resources</span>
            </Link>
            <div className="article-share-controls">
              <button className="share-button" title="Share article">
                <Share2 size={18} />
              </button>
              <button className="share-button" title="Copy link">
                <LinkIcon size={18} />
              </button>
            </div>
          </div>

          <div className="article-badge">Article</div>

          <div className="article-breadcrumb">
            Resources / Articles / MTR Automation
          </div>

          <div className="article-category">MTR AUTOMATION</div>

          <h1 className="article-title">
            Material Test Report (MTR) Automation for Steel Service Centers: An Implementation Guide
          </h1>

          <div className="article-metadata">
            <span>Aug 02, 2026</span>
            <span>·</span>
            <span>6 min read</span>
            <span>·</span>
            <span>Star Software</span>
          </div>

          <p className="article-intro">
            How steel distributors automate yield strength, tensile testing, and heat-number extraction directly into their ERP without manual data entry.
          </p>
        </header>

        <div className="article-main-layout">
          {/* Main Content */}
          <main className="article-content">
            {/* Section 1: Overview */}
            <section className="article-section">
              <h2 className="article-heading">Overview</h2>
              <SkeletonLine width="100%" />
              <SkeletonLine width="95%" />
              <SkeletonLine width="88%" />
              <SkeletonLine width="92%" marginBottom="1.5rem" />

              <SkeletonLine width="100%" />
              <SkeletonLine width="98%" />
              <SkeletonLine width="91%" marginBottom="2rem" />

              <div className="article-highlight-block">
                <div className="highlight-icon">⚡</div>
                <div className="highlight-content">
                  <SkeletonLine width="80%" height="0.875rem" marginBottom="0.5rem" />
                  <SkeletonLine width="75%" height="0.875rem" />
                </div>
              </div>
            </section>

            {/* Workflow Visualization */}
            <section className="article-section">
              <h2 className="article-heading">MTR Automation Workflow</h2>
              <div className="workflow-container">
                <WorkflowStage number={1} label="MTR Document" isActive={true} />
                <WorkflowStage number={2} label="Data Extraction" isActive={true} />
                <WorkflowStage number={3} label="Heat Number" isActive={false} />
                <WorkflowStage number={4} label="Validation" isActive={false} />
                <WorkflowStage number={5} label="Standards Check" isActive={false} />
                <WorkflowStage number={6} label="ERP" isActive={false} />
              </div>
            </section>

            {/* Section 2: MTR Data Extraction */}
            <section className="article-section">
              <h2 className="article-heading">MTR Data Extraction</h2>
              <SkeletonLine width="100%" />
              <SkeletonLine width="97%" />
              <SkeletonLine width="89%" marginBottom="1.5rem" />

              <div className="document-preview">
                <div className="doc-header">Material Test Report Sample</div>
                <div className="doc-field">
                  <span className="field-label">Heat Number</span>
                  <SkeletonLine width="40%" height="0.75rem" />
                </div>
                <div className="doc-field">
                  <span className="field-label">Yield Strength</span>
                  <SkeletonLine width="35%" height="0.75rem" />
                </div>
                <div className="doc-field">
                  <span className="field-label">Tensile Strength</span>
                  <SkeletonLine width="38%" height="0.75rem" />
                </div>
              </div>
            </section>

            {/* Section 3: Heat Number Extraction */}
            <section className="article-section">
              <h2 className="article-heading">Heat Number Extraction</h2>
              <SkeletonLine width="100%" />
              <SkeletonLine width="96%" marginBottom="1.5rem" />

              <div className="steps-list">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <SkeletonLine width="60%" height="0.875rem" marginBottom="0.5rem" />
                    <SkeletonLine width="95%" height="0.75rem" marginBottom="0.5rem" />
                    <SkeletonLine width="88%" height="0.75rem" />
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <SkeletonLine width="65%" height="0.875rem" marginBottom="0.5rem" />
                    <SkeletonLine width="92%" height="0.75rem" marginBottom="0.5rem" />
                    <SkeletonLine width="85%" height="0.75rem" />
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <SkeletonLine width="55%" height="0.875rem" marginBottom="0.5rem" />
                    <SkeletonLine width="89%" height="0.75rem" marginBottom="0.5rem" />
                    <SkeletonLine width="91%" height="0.75rem" />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Validation */}
            <section className="article-section">
              <h2 className="article-heading">Custom Document Validation</h2>
              <SkeletonLine width="100%" />
              <SkeletonLine width="94%" marginBottom="1.5rem" />

              <div className="validation-preview">
                <div className="validation-row">
                  <div className="validation-check">✓</div>
                  <div className="validation-text">
                    <SkeletonLine width="70%" height="0.75rem" />
                  </div>
                </div>
                <div className="validation-row">
                  <div className="validation-check">✓</div>
                  <div className="validation-text">
                    <SkeletonLine width="65%" height="0.75rem" />
                  </div>
                </div>
                <div className="validation-row">
                  <div className="validation-check">✓</div>
                  <div className="validation-text">
                    <SkeletonLine width="72%" height="0.75rem" />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Standards */}
            <section className="article-section">
              <h2 className="article-heading">Standards Validation</h2>
              <SkeletonLine width="100%" />
              <SkeletonLine width="95%" marginBottom="2rem" />

              <SkeletonLine width="100%" />
              <SkeletonLine width="97%" />
              <SkeletonLine width="91%" marginBottom="2rem" />
            </section>
          </main>

          {/* Right Sidebar */}
          <aside className="article-sidebar">
            <div className="sidebar-content">
              <button
                className="sidebar-toggle-mobile"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                On this page
                <ChevronDown size={18} />
              </button>

              <nav className={`sidebar-nav ${mobileMenuOpen ? 'open' : ''}`}>
                <p className="sidebar-title">ON THIS PAGE</p>
                {[
                  { id: 1, label: 'Overview' },
                  { id: 2, label: 'MTR Data Extraction' },
                  { id: 3, label: 'Heat Number Extraction' },
                  { id: 4, label: 'Custom Document Validation' },
                  { id: 5, label: 'Standards Validation' },
                  { id: 6, label: 'ERP Integration' },
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#section-${item.id}`}
                    className={`sidebar-link ${activeSection === item.id ? 'active' : ''}`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <span className="sidebar-number">{String(item.id).padStart(2, '0')}</span>
                    <span className="sidebar-text">{item.label}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </article>

      <Footer />
    </div>
  );
}
