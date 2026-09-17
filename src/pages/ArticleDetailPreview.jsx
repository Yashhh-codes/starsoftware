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
              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#3c4257', marginBottom: '1.5rem' }}>
                Material Test Reports (MTRs) are critical compliance documents in manufacturing supply chains, particularly in steel and aerospace industries. These reports contain certified test data—tensile strength, yield points, chemical composition, and heat traceability—that purchasing departments must validate before goods can be received into inventory.
              </p>

              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#3c4257', marginBottom: '2rem' }}>
                Manual MTR review creates significant bottlenecks. Distributors typically spend 15–45 minutes per document cross-referencing supplier data against purchase orders, performing ASTM standard lookups, and creating ERP-ready records. This manual work introduces transcription errors, delays goods receipt, and ties up valuable compliance staff during peak inbound periods.
              </p>

              <div className="article-highlight-block">
                <div className="highlight-icon">⚡</div>
                <div className="highlight-content">
                  <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0055ff', margin: '0 0 0.5rem 0' }}>Key Insight</p>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: 0 }}>Organizations automating MTR ingestion report 6–8 hour daily time savings and 99.7% accuracy, reducing goods receipt cycle time from 2–3 days to 2–4 hours.</p>
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
              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#3c4257', marginBottom: '1.5rem' }}>
                The first automation layer extracts test data directly from MTR documents using computer vision and AI-powered field recognition. Modern systems identify common MTR layouts (supplier-specific formats, standard ASTM formats, and custom test result tables) with 99%+ accuracy, even across inconsistent document quality, scanned PDFs, and handwritten notations.
              </p>

              <div className="document-preview">
                <div className="doc-header">Material Test Report Sample Fields</div>
                <div className="doc-field">
                  <span className="field-label">Heat/Lot Number</span>
                  <span style={{ fontSize: '0.875rem', color: '#667085' }}>Example: H2026-8847-Q3</span>
                </div>
                <div className="doc-field">
                  <span className="field-label">Yield Strength (YS) – ksi</span>
                  <span style={{ fontSize: '0.875rem', color: '#667085' }}>Minimum 50 ksi per ASTM A36</span>
                </div>
                <div className="doc-field">
                  <span className="field-label">Tensile Strength – ksi</span>
                  <span style={{ fontSize: '0.875rem', color: '#667085' }}>58–80 ksi per ASTM A36</span>
                </div>
                <div className="doc-field">
                  <span className="field-label">Elongation %</span>
                  <span style={{ fontSize: '0.875rem', color: '#667085' }}>Minimum 21% elongation</span>
                </div>
                <div className="doc-field">
                  <span className="field-label">Chemical Composition (C, Mn, P, S)</span>
                  <span style={{ fontSize: '0.875rem', color: '#667085' }}>Within ASTM specification limits</span>
                </div>
              </div>
            </section>

            {/* Section 3: Heat Number Extraction */}
            <section className="article-section">
              <h2 className="article-heading">Heat Number Extraction & Traceability</h2>
              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#3c4257', marginBottom: '1.5rem' }}>
                Heat numbers (or lot numbers) are the most critical identifier on MTRs—they link physical goods to test results and are essential for recall traceability and quality audits. Automated systems isolate heat numbers from supplier formats, validate them against receiving logs, and immediately flag missing or mismatched lot identifiers for manual review.
              </p>

              <div className="steps-list">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0a101d', margin: '0 0 0.5rem 0' }}>Heat Number Localization</p>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: 0 }}>Computer vision identifies heat number fields by position and context clues (labels like "Heat #", "Lot", "Charge"). System handles varied placements: page 1 corner, table cells, or footer regions.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0a101d', margin: '0 0 0.5rem 0' }}>Supplier Format Normalization</p>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: 0 }}>Heat numbers follow supplier conventions: ArcelorMittal uses "A1-2026-08847", Nippon Steel uses "NS-Q3-8847", custom mill codes vary. System learns patterns and converts to standardized format for ERP ingestion.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0a101d', margin: '0 0 0.5rem 0' }}>Cross-Reference Validation</p>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: 0 }}>Extracted heat numbers are matched against outstanding purchase orders, ASN (Advanced Shipping Notices), and prior receipts. System flags discrepancies: heat not on PO, mismatched quantity, or duplicate lots in same shipment.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Validation */}
            <section className="article-section">
              <h2 className="article-heading">Custom Document Validation</h2>
              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#3c4257', marginBottom: '1.5rem' }}>
                Before ERP ingestion, extracted MTR data undergoes rule-based validation tailored to your quality and compliance standards. Organizations can define custom validation rules: required certifications (3.1/3.2 inspection), minimum test thresholds, chemical composition ranges, and supplier-specific requirements.
              </p>

              <div className="validation-preview">
                <div className="validation-row">
                  <div className="validation-check">✓</div>
                  <div className="validation-text">
                    <p style={{ fontSize: '0.9rem', color: '#3c4257', margin: 0 }}>Certifier validation: MTR signed by 3.1 or 3.2 authorized personnel</p>
                  </div>
                </div>
                <div className="validation-row">
                  <div className="validation-check">✓</div>
                  <div className="validation-text">
                    <p style={{ fontSize: '0.9rem', color: '#3c4257', margin: 0 }}>Test result compliance: Yield strength ≥ 50 ksi, tensile 58–80 ksi, elongation ≥ 21%</p>
                  </div>
                </div>
                <div className="validation-row">
                  <div className="validation-check">✓</div>
                  <div className="validation-text">
                    <p style={{ fontSize: '0.9rem', color: '#3c4257', margin: 0 }}>Document completeness: Certificate date ≤ 90 days old, all required fields present</p>
                  </div>
                </div>
                <div className="validation-row">
                  <div className="validation-check">✓</div>
                  <div className="validation-text">
                    <p style={{ fontSize: '0.9rem', color: '#3c4257', margin: 0 }}>Supplier registry: Material supplier is on approved vendor list</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Standards */}
            <section className="article-section">
              <h2 className="article-heading">Standards Validation & Compliance</h2>
              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#3c4257', marginBottom: '1rem' }}>
                Manufacturing operates under material standards—ASTM A36 for structural steel, ASTM A106 for pipe, ASME specifications for pressure vessels. Automated MTR systems reference a standards library and validate that test results comply with the applicable standard for the purchase order's material specification.
              </p>

              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#3c4257', marginBottom: '2rem' }}>
                When test data falls outside specification, the system flags the row for Quality Assurance—either the material doesn't meet standards (reject), or the MTR values need supervisor review (acceptance with deviation). For aerospace (AS9102) or automotive (PPAP) workflows, all materials trigger aerospace-grade validation and traceability confirmation.
              </p>

              <div className="article-highlight-block">
                <div className="highlight-icon">📋</div>
                <div className="highlight-content">
                  <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0055ff', margin: '0 0 0.5rem 0' }}>Industry Standards Supported</p>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: 0 }}>ASTM A36, A106, A307 · ASME Section VIII (pressure) · AWS D1.1 (weld) · EN 10025 (European) · JIS (Japanese Industrial) · Aerospace AS9102 · Automotive PPAP</p>
                </div>
              </div>
            </section>

            {/* Section 6: ERP Integration */}
            <section className="article-section">
              <h2 className="article-heading">ERP Integration & Real-Time Sync</h2>
              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#3c4257', marginBottom: '1rem' }}>
                Once validation passes, automated systems push material and test data directly into your ERP system—SAP, Oracle, NetSuite, Infor—in real time. This eliminates manual data entry and accelerates goods receipt.
              </p>

              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#3c4257', marginBottom: '1.5rem' }}>
                The system creates purchase order receipts, quality hold tags, and traceability records automatically. For materials that fail validation, a quarantine flag is set in the ERP to prevent accidental consumption. Finance teams can reconcile 3-way matches (PO, invoice, GRN) immediately once receiving is complete.
              </p>

              <div className="steps-list">
                <div className="step">
                  <div className="step-number">→</div>
                  <div className="step-content">
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: 0 }}><strong>Inbound Receipt (GRN):</strong> Heat number, quantity, test results, and certifier name flow into the receiving module automatically. ERP updates stock levels without manual entry.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">→</div>
                  <div className="step-content">
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: 0 }}><strong>Quality Hold:</strong> If validation fails or test results fall outside spec, QA hold is auto-applied. Material cannot be issued until approved by quality supervisor.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">→</div>
                  <div className="step-content">
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: 0 }}><strong>Traceability Linkage:</strong> Received materials are linked to supplier, heat number, test results, and MTR document ID. This chain persists through consumption and enables rapid recall response.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">→</div>
                  <div className="step-content">
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: 0 }}><strong>Financial Close:</strong> Once received and QA approved, the system flags the purchase order as complete. AP invoices can be matched and paid without manual intervention.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Conclusion Section */}
            <section className="article-section">
              <h2 className="article-heading">Key Takeaways</h2>
              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#3c4257', marginBottom: '1.5rem' }}>
                Automating MTR ingestion transforms receiving operations from a bottleneck into a competitive advantage. By combining AI-powered document extraction, custom validation rules, standards compliance checking, and real-time ERP integration, distributors cut days off goods receipt, reduce manual errors, and empower quality teams to focus on exception handling rather than data entry.
              </p>

              <div style={{ padding: '1.5rem', borderRadius: '8px', background: '#f0f4ff', border: '1px solid #e0e7ff', marginTop: '2rem' }}>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: 0 }}>
                  <strong>Ready to automate your MTR workflow?</strong> Talk to our engineering team about implementation, standards support, and ROI timelines for your supply chain.
                </p>
              </div>
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
