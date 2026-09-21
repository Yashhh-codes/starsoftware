import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ARTICLES, formatResourceDate } from '../data/resourcesData';
import starLogo from '../assets/star-software-logo.png';
import './ResourceHub.css';

const ARTICLE_CONTENT = {
  'mtr-automation-steel-service-centers': {
    sections: [
      {
        id: 1,
        title: 'Overview',
        content: (
          <>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#3c4257', marginBottom: '1.75rem' }}>
              Material Test Reports (MTRs) are critical compliance documents in manufacturing supply chains, particularly in steel and aerospace industries. These reports contain certified test data—tensile strength, yield points, chemical composition, and heat traceability—that purchasing departments must validate before goods can be received into inventory.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#3c4257', marginBottom: '2rem' }}>
              Manual MTR review creates significant bottlenecks. Distributors typically spend 15–45 minutes per document cross-referencing supplier data against purchase orders, performing ASTM standard lookups, and creating ERP-ready records. This manual work introduces transcription errors, delays goods receipt, and ties up valuable compliance staff during peak inbound periods.
            </p>
            <div style={{ padding: '2rem', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(0, 85, 255, 0.05) 100%)', border: '2px solid #e0d9ff', marginBottom: '2rem' }}>
              <p style={{ fontSize: '1rem', fontWeight: '700', color: '#0055ff', margin: '0 0 0.75rem 0' }}>⚡ Key Insight</p>
              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#3c4257', margin: 0 }}>Organizations automating MTR ingestion report 6–8 hour daily time savings and 99.7% accuracy, reducing goods receipt cycle time from 2–3 days to 2–4 hours.</p>
            </div>
          </>
        ),
      },
      {
        id: 2,
        title: 'MTR Data Extraction',
        content: (
          <>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#3c4257', marginBottom: '1.75rem' }}>
              The first automation layer extracts test data directly from MTR documents using computer vision and AI-powered field recognition. Modern systems identify common MTR layouts (supplier-specific formats, standard ASTM formats, and custom test result tables) with 99%+ accuracy, even across inconsistent document quality, scanned PDFs, and handwritten notations.
            </p>
            <div style={{ padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#f9fafb', marginBottom: '2rem', fontFamily: "'Monaco', 'Courier New', monospace", fontSize: '0.875rem' }}>
              <div style={{ fontWeight: 700, color: '#0a101d', marginBottom: '1rem', fontSize: '0.9375rem', fontFamily: 'inherit' }}>Material Test Report Sample Fields</div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, color: '#3c4257', fontSize: '0.875rem', marginBottom: '0.5rem', fontFamily: 'inherit' }}>Heat/Lot Number</div>
                <span style={{ fontSize: '0.875rem', color: '#667085' }}>Example: H2026-8847-Q3</span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, color: '#3c4257', fontSize: '0.875rem', marginBottom: '0.5rem', fontFamily: 'inherit' }}>Yield Strength (YS) – ksi</div>
                <span style={{ fontSize: '0.875rem', color: '#667085' }}>Minimum 50 ksi per ASTM A36</span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, color: '#3c4257', fontSize: '0.875rem', marginBottom: '0.5rem', fontFamily: 'inherit' }}>Tensile Strength – ksi</div>
                <span style={{ fontSize: '0.875rem', color: '#667085' }}>58–80 ksi per ASTM A36</span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, color: '#3c4257', fontSize: '0.875rem', marginBottom: '0.5rem', fontFamily: 'inherit' }}>Elongation %</div>
                <span style={{ fontSize: '0.875rem', color: '#667085' }}>Minimum 21% elongation</span>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#3c4257', fontSize: '0.875rem', marginBottom: '0.5rem', fontFamily: 'inherit' }}>Chemical Composition (C, Mn, P, S)</div>
                <span style={{ fontSize: '0.875rem', color: '#667085' }}>Within ASTM specification limits</span>
              </div>
            </div>
          </>
        ),
      },
      {
        id: 3,
        title: 'Heat Number Extraction & Traceability',
        content: (
          <>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#3c4257', marginBottom: '1.75rem' }}>
              Heat numbers (or lot numbers) are the most critical identifier on MTRs—they link physical goods to test results and are essential for recall traceability and quality audits. Automated systems isolate heat numbers from supplier formats, validate them against receiving logs, and immediately flag missing or mismatched lot identifiers for manual review.
            </p>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ flexShrink: 0, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(0, 85, 255, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', color: '#0055ff' }}>1</div>
                <div>
                  <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0a101d', margin: '0 0 0.5rem 0' }}>Heat Number Localization</p>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: 0 }}>Computer vision identifies heat number fields by position and context clues (labels like "Heat #", "Lot", "Charge"). System handles varied placements: page 1 corner, table cells, or footer regions.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ flexShrink: 0, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(0, 85, 255, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', color: '#0055ff' }}>2</div>
                <div>
                  <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0a101d', margin: '0 0 0.5rem 0' }}>Supplier Format Normalization</p>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: 0 }}>Heat numbers follow supplier conventions: ArcelorMittal uses "A1-2026-08847", Nippon Steel uses "NS-Q3-8847", custom mill codes vary. System learns patterns and converts to standardized format for ERP ingestion.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ flexShrink: 0, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(0, 85, 255, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', color: '#0055ff' }}>3</div>
                <div>
                  <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0a101d', margin: '0 0 0.5rem 0' }}>Cross-Reference Validation</p>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: 0 }}>Extracted heat numbers are matched against outstanding purchase orders, ASN (Advanced Shipping Notices), and prior receipts. System flags discrepancies: heat not on PO, mismatched quantity, or duplicate lots in same shipment.</p>
                </div>
              </div>
            </div>
          </>
        ),
      },
      {
        id: 4,
        title: 'Custom Document Validation',
        content: (
          <>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#3c4257', marginBottom: '1.75rem' }}>
              Before ERP ingestion, extracted MTR data undergoes rule-based validation tailored to your quality and compliance standards. Organizations can define custom validation rules: required certifications (3.1/3.2 inspection), minimum test thresholds, chemical composition ranges, and supplier-specific requirements.
            </p>
            <div style={{ padding: '1.5rem', borderRadius: '8px', background: '#f9fafb', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, color: '#22c55e', fontWeight: 700, fontSize: '1.125rem' }}>✓</div>
                <p style={{ fontSize: '0.9rem', color: '#3c4257', margin: 0 }}>Certifier validation: MTR signed by 3.1 or 3.2 authorized personnel</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, color: '#22c55e', fontWeight: 700, fontSize: '1.125rem' }}>✓</div>
                <p style={{ fontSize: '0.9rem', color: '#3c4257', margin: 0 }}>Test result compliance: Yield strength ≥ 50 ksi, tensile 58–80 ksi, elongation ≥ 21%</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, color: '#22c55e', fontWeight: 700, fontSize: '1.125rem' }}>✓</div>
                <p style={{ fontSize: '0.9rem', color: '#3c4257', margin: 0 }}>Document completeness: Certificate date ≤ 90 days old, all required fields present</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, color: '#22c55e', fontWeight: 700, fontSize: '1.125rem' }}>✓</div>
                <p style={{ fontSize: '0.9rem', color: '#3c4257', margin: 0 }}>Supplier registry: Material supplier is on approved vendor list</p>
              </div>
            </div>
          </>
        ),
      },
      {
        id: 5,
        title: 'Standards Validation & Compliance',
        content: (
          <>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#3c4257', marginBottom: '1.25rem' }}>
              Manufacturing operates under material standards—ASTM A36 for structural steel, ASTM A106 for pipe, ASME specifications for pressure vessels. Automated MTR systems reference a standards library and validate that test results comply with the applicable standard for the purchase order's material specification.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#3c4257', marginBottom: '2rem' }}>
              When test data falls outside specification, the system flags the row for Quality Assurance—either the material doesn't meet standards (reject), or the MTR values need supervisor review (acceptance with deviation). For aerospace (AS9102) or automotive (PPAP) workflows, all materials trigger aerospace-grade validation and traceability confirmation.
            </p>
            <div style={{ padding: '1.75rem', borderRadius: '8px', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.04) 0%, rgba(0, 85, 255, 0.03) 100%)', border: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0055ff', margin: '0 0 0.5rem 0' }}>📋 Industry Standards Supported</p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: 0 }}>ASTM A36, A106, A307 · ASME Section VIII (pressure) · AWS D1.1 (weld) · EN 10025 (European) · JIS (Japanese Industrial) · Aerospace AS9102 · Automotive PPAP</p>
            </div>
          </>
        ),
      },
      {
        id: 6,
        title: 'ERP Integration & Real-Time Sync',
        content: (
          <>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#3c4257', marginBottom: '1.25rem' }}>
              Once validation passes, automated systems push material and test data directly into your ERP system—SAP, Oracle, NetSuite, Infor—in real time. This eliminates manual data entry and accelerates goods receipt.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#3c4257', marginBottom: '1.75rem' }}>
              The system creates purchase order receipts, quality hold tags, and traceability records automatically. For materials that fail validation, a quarantine flag is set in the ERP to prevent accidental consumption. Finance teams can reconcile 3-way matches (PO, invoice, GRN) immediately once receiving is complete.
            </p>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ flexShrink: 0, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(0, 85, 255, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', color: '#0055ff' }}>→</div>
                <div>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: 0 }}><strong>Inbound Receipt (GRN):</strong> Heat number, quantity, test results, and certifier name flow into the receiving module automatically. ERP updates stock levels without manual entry.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ flexShrink: 0, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(0, 85, 255, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', color: '#0055ff' }}>→</div>
                <div>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: 0 }}><strong>Quality Hold:</strong> If validation fails or test results fall outside spec, QA hold is auto-applied. Material cannot be issued until approved by quality supervisor.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ flexShrink: 0, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(0, 85, 255, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', color: '#0055ff' }}>→</div>
                <div>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: 0 }}><strong>Traceability Linkage:</strong> Received materials are linked to supplier, heat number, test results, and MTR document ID. This chain persists through consumption and enables rapid recall response.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ flexShrink: 0, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(0, 85, 255, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', color: '#0055ff' }}>→</div>
                <div>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: 0 }}><strong>Financial Close:</strong> Once received and QA approved, the system flags the purchase order as complete. AP invoices can be matched and paid without manual intervention.</p>
                </div>
              </div>
            </div>
          </>
        ),
      },
    ],
  },
};

function useDocumentMeta(title, description) {
  useEffect(() => {
    if (!title) return undefined;
    const previousTitle = document.title;
    document.title = title;

    let metaDescription = document.querySelector('meta[name="description"]');
    let createdMeta = false;
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
      createdMeta = true;
    }
    const previousDescription = metaDescription.getAttribute('content');
    if (description) metaDescription.setAttribute('content', description);

    return () => {
      document.title = previousTitle;
      if (createdMeta) {
        metaDescription.remove();
      } else if (previousDescription !== null) {
        metaDescription.setAttribute('content', previousDescription);
      }
    };
  }, [title, description]);
}

function ArticleSharing({ articleTitle, articleUrl }) {
  const [copied, setCopied] = useState(false);
  const [helpful, setHelpful] = useState(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnLinkedIn = () => {
    const text = `${articleTitle} - Star Software Resource Hub`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
      '_blank'
    );
  };

  const shareOnX = () => {
    const text = `Check out "${articleTitle}" from Star Software - ${articleUrl}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  const shareViaEmail = () => {
    const subject = `Check out: ${articleTitle}`;
    const body = `I thought you'd find this article interesting: ${articleTitle}\n\n${articleUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div>
      {/* Sharing buttons */}
      <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #f0f0f0' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0a101d', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          Share this article
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={shareOnLinkedIn}
            title="Share on LinkedIn"
            aria-label="Share on LinkedIn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              color: '#0055ff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: 0,
              fontSize: '0.75rem',
              fontWeight: 700,
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 85, 255, 0.08)';
              e.currentTarget.style.borderColor = '#d0deff';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.2)';
              e.currentTarget.style.borderColor = '#0055ff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            in
          </button>

          <button
            onClick={shareOnX}
            title="Share on X"
            aria-label="Share on X"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              color: '#0055ff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: 0,
              fontSize: '0.9rem',
              fontWeight: 700,
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 85, 255, 0.08)';
              e.currentTarget.style.borderColor = '#d0deff';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.2)';
              e.currentTarget.style.borderColor = '#0055ff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            𝕏
          </button>

          <button
            onClick={handleCopyLink}
            title={copied ? 'Link copied!' : 'Copy link'}
            aria-label="Copy link"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: copied ? 'rgba(34, 197, 94, 0.1)' : '#ffffff',
              color: copied ? '#22c55e' : '#0055ff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: 0,
              fontSize: '0.75rem',
              fontWeight: 700,
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (!copied) {
                e.currentTarget.style.background = 'rgba(0, 85, 255, 0.08)';
                e.currentTarget.style.borderColor = '#d0deff';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = copied ? '0 0 0 3px rgba(34, 197, 94, 0.2)' : '0 0 0 3px rgba(0, 85, 255, 0.2)';
              e.currentTarget.style.borderColor = copied ? '#22c55e' : '#0055ff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <Copy size={16} style={{ marginRight: '2px' }} /> {copied ? '✓' : ''}
          </button>

          <button
            onClick={shareViaEmail}
            title="Share via email"
            aria-label="Share via email"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              color: '#0055ff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: 0,
              fontSize: '0.75rem',
              fontWeight: 700,
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 85, 255, 0.08)';
              e.currentTarget.style.borderColor = '#d0deff';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.2)';
              e.currentTarget.style.borderColor = '#0055ff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <Mail size={16} />
          </button>
        </div>
      </div>

      {/* Was this helpful */}
      <div style={{ paddingTop: '1.5rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#667085', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          Was this article helpful?
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setHelpful(true)}
            aria-pressed={helpful === true}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              background: helpful === true ? 'rgba(0, 85, 255, 0.1)' : '#ffffff',
              color: helpful === true ? '#0055ff' : '#667085',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (helpful !== true) {
                e.currentTarget.style.borderColor = '#d0deff';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 85, 255, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (helpful !== true) {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 85, 255, 0.2)';
              e.currentTarget.style.borderColor = '#0055ff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            Yes
          </button>
          <button
            onClick={() => setHelpful(false)}
            aria-pressed={helpful === false}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              background: helpful === false ? 'rgba(220, 38, 38, 0.1)' : '#ffffff',
              color: helpful === false ? '#dc2626' : '#667085',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (helpful !== false) {
                e.currentTarget.style.borderColor = '#fecaca';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(220, 38, 38, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (helpful !== false) {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(220, 38, 38, 0.15)';
              e.currentTarget.style.borderColor = '#dc2626';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

function RelatedArticleCard({ article }) {
  return (
    <Link
      to={`/resources/${article.slug}`}
      style={{
        display: 'block',
        padding: '1.75rem',
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
        background: '#ffffff',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#d0deff';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 85, 255, 0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', color: '#0055ff', margin: '0 0 0.5rem 0' }}>
        {article.categoryLabel}
      </p>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0a101d', margin: '0 0 0.75rem 0', lineHeight: 1.4 }}>
        {article.title}
      </h3>
      <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#3c4257', margin: '0 0 1.25rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {article.description}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #f0f0f0', fontSize: '0.8rem', color: '#667085' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span>{article.readMinutes} min read</span>
          <span>{formatResourceDate(article.date)}</span>
        </div>
        <span style={{ color: '#0055ff', fontWeight: 700, transition: 'transform 0.2s ease' }}>→</span>
      </div>
    </Link>
  );
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const article = useMemo(() => ARTICLES.find((item) => item.slug === slug), [slug]);

  useDocumentMeta(
    article ? `${article.title} | Star Software Resources` : 'Resource not found | Star Software',
    article ? article.description : undefined
  );

  const related = useMemo(() => {
    if (!article) return [];
    return ARTICLES.filter(
      (item) => item.slug !== article.slug && item.category === article.category
    ).slice(0, 4);
  }, [article]);

  if (!article) {
    return (
      <div className="resource-hub-page">
        <Navbar variant="solid" />
        <div className="rh-not-found">
          <h1 className="rh-h1" style={{ fontSize: 28 }}>
            Resource not found
          </h1>
          <p className="rh-hero-copy">This guide may have moved or been retired.</p>
          <Link to="/resources" className="rh-featured-link" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
            <ArrowLeft size={18} />
            <span>Back to Resource Hub</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const articleContent = ARTICLE_CONTENT[slug];

  return (
    <div className="resource-hub-page" style={{ position: 'relative' }}>
      {/* Watermarks */}
      <div className="watermark-left" style={{
        position: 'fixed',
        left: '40px',
        top: '50%',
        transform: 'translateY(-50%) rotate(-28deg)',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.08,
      }}>
        <img
          src={starLogo}
          alt=""
          style={{
            width: '160px',
            height: 'auto',
            userSelect: 'none',
            WebkitUserDrag: 'none',
            display: 'block',
          }}
        />
      </div>

      <div className="watermark-right" style={{
        position: 'fixed',
        right: '40px',
        top: '50%',
        transform: 'translateY(-50%) rotate(28deg)',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.08,
      }}>
        <img
          src={starLogo}
          alt=""
          style={{
            width: '160px',
            height: 'auto',
            userSelect: 'none',
            WebkitUserDrag: 'none',
            display: 'block',
          }}
        />
      </div>

      <Navbar variant="solid" />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <article>
        <header className="rh-article-header">
          <Link to="/resources" className="rh-article-back">
            <ArrowLeft size={16} />
            Back to Resource Hub
          </Link>
          <span className="rh-article-category">{article.categoryLabel}</span>
          <h1 className="rh-article-h1">{article.title}</h1>
          <div className="rh-article-meta">
            <span>{article.author}</span>
            <span>&middot;</span>
            <span>{formatResourceDate(article.date)}</span>
            <span>&middot;</span>
            <span>{article.readMinutes} min read</span>
          </div>
        </header>

        <div className="rh-article-body">
          <p className="rh-article-lede">{article.description}</p>

          {articleContent ? (
            <>
              {articleContent.sections.map((section) => (
                <section key={section.id} style={{ marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0a101d', lineHeight: 1.3, marginBottom: '1.75rem', letterSpacing: '-0.01em' }}>
                    {section.title}
                  </h2>
                  <div style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#3c4257' }}>
                    {section.content}
                  </div>
                </section>
              ))}

              {/* ARTICLE SHARING & FEEDBACK SECTION */}
              <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
                <ArticleSharing articleTitle={article.title} articleUrl={window.location.href} />
              </div>

              {/* RELATED ARTICLES SECTION */}
              {related.length > 0 && (
                <div style={{ marginTop: '5rem' }}>
                  <div style={{ marginBottom: '2.5rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', color: '#0055ff', marginBottom: '0.75rem' }}>
                      Continue exploring
                    </p>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0a101d', margin: 0 }}>Related Articles</h2>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    {related.slice(0, 3).map((item) => (
                      <RelatedArticleCard key={item.slug} article={item} />
                    ))}
                  </div>
                </div>
              )}

              {/* EXPLORE MORE RESOURCES CTA */}
              <div style={{ marginTop: '5rem', padding: '2.5rem', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(0, 85, 255, 0.03) 0%, rgba(124, 58, 237, 0.02) 100%)', border: '1px solid #e0d9ff', textAlign: 'center' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0a101d', marginBottom: '0.75rem' }}>Explore more resources</p>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#3c4257', marginBottom: '1.5rem' }}>Explore practical guides, engineering insights and automation resources from Star Software.</p>
                <Link to="/resources" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '9999px', background: '#0055ff', color: 'white', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.2s ease', outline: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0047cc'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 85, 255, 0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0055ff'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }} onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.2)'; }} onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>
                  Explore Resources
                  <span>→</span>
                </Link>
              </div>

              {/* DEMO REQUEST CTA */}
              <div style={{ marginTop: '5rem', position: 'relative', padding: '2rem', borderRadius: '12px', background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 100%)', border: '1px solid #d0deff', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #0055ff 0%, #7c3aed 100%)', opacity: 0.6 }}></div>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#0a101d', fontWeight: 700, margin: '0 0 0.75rem 0' }}>
                  Ready to automate your document workflows?
                </p>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#3c4257', margin: '0 0 1.5rem 0' }}>
                  Talk to the Star Software team about document extraction, validation and workflow automation.
                </p>
                <a href="/#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '9999px', background: '#0055ff', color: 'white', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.2s ease', outline: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0047cc'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 85, 255, 0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0055ff'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }} onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.2)'; }} onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>
                  Get a Demo
                  <span>→</span>
                </a>
              </div>

              {/* ARTICLE FOOTER METADATA */}
              <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: '#667085', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: '#0a101d' }}>Star Software</span>
                  <span>&middot;</span>
                  <span>{article.categoryLabel}</span>
                  <span>&middot;</span>
                  <span>Updated {formatResourceDate(article.date)}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="rh-article-note">
                This guide is being expanded with the full write-up. In the meantime, reach out via{' '}
                <a href="/#contact">Talk to us</a> if you'd like to discuss {article.categoryLabel.toLowerCase()}{' '}
                for your team.
              </p>

              {/* ARTICLE SHARING & FEEDBACK SECTION */}
              <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
                <ArticleSharing articleTitle={article.title} articleUrl={window.location.href} />
              </div>

              {/* RELATED ARTICLES SECTION */}
              {related.length > 0 && (
                <div style={{ marginTop: '5rem' }}>
                  <div style={{ marginBottom: '2.5rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', color: '#0055ff', marginBottom: '0.75rem' }}>
                      Continue exploring
                    </p>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0a101d', margin: 0 }}>Related Articles</h2>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    {related.slice(0, 3).map((item) => (
                      <RelatedArticleCard key={item.slug} article={item} />
                    ))}
                  </div>
                </div>
              )}

              {/* EXPLORE MORE RESOURCES CTA */}
              <div style={{ marginTop: '5rem', padding: '2.5rem', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(0, 85, 255, 0.03) 0%, rgba(124, 58, 237, 0.02) 100%)', border: '1px solid #e0d9ff', textAlign: 'center' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0a101d', marginBottom: '0.75rem' }}>Explore more resources</p>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#3c4257', marginBottom: '1.5rem' }}>Explore practical guides, engineering insights and automation resources from Star Software.</p>
                <Link to="/resources" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '9999px', background: '#0055ff', color: 'white', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.2s ease', outline: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0047cc'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 85, 255, 0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0055ff'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }} onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.2)'; }} onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>
                  Explore Resources
                  <span>→</span>
                </Link>
              </div>

              {/* DEMO REQUEST CTA */}
              <div style={{ marginTop: '5rem', position: 'relative', padding: '2rem', borderRadius: '12px', background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 100%)', border: '1px solid #d0deff', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #0055ff 0%, #7c3aed 100%)', opacity: 0.6 }}></div>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#0a101d', fontWeight: 700, margin: '0 0 0.75rem 0' }}>
                  Ready to automate your document workflows?
                </p>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#3c4257', margin: '0 0 1.5rem 0' }}>
                  Talk to the Star Software team about document extraction, validation and workflow automation.
                </p>
                <a href="/#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '9999px', background: '#0055ff', color: 'white', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.2s ease', outline: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0047cc'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 85, 255, 0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0055ff'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }} onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 85, 255, 0.2)'; }} onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>
                  Get a Demo
                  <span>→</span>
                </a>
              </div>

              {/* ARTICLE FOOTER METADATA */}
              <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: '#667085', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: '#0a101d' }}>Star Software</span>
                  <span>&middot;</span>
                  <span>{article.categoryLabel}</span>
                  <span>&middot;</span>
                  <span>Updated {formatResourceDate(article.date)}</span>
                </div>
              </div>
            </>
          )}
        </div>
        </article>

        <Footer />
      </div>
    </div>
  );
}
