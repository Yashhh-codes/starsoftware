import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ARTICLES, formatResourceDate } from '../data/resourcesData';
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
    <div className="resource-hub-page">
      <Navbar variant="solid" />

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

              <div style={{ padding: '2rem', borderRadius: '12px', background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 100%)', border: '2px solid #d0deff', marginTop: '2rem', marginBottom: '4rem' }}>
                <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#0a101d', margin: 0 }}>
                  <strong style={{ fontSize: '1.1rem' }}>Ready to automate your {article.categoryLabel.toLowerCase()}?</strong>
                  <br />
                  <span style={{ color: '#3c4257' }}>Talk to our engineering team about implementation, standards support, and ROI timelines for your supply chain.</span>
                </p>
              </div>

              {related.length > 0 && (
                <div style={{ marginTop: '3rem' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0a101d', marginBottom: '2rem' }}>Related Resources</h2>
                  <div className="rh-related-grid">
                    {related.map((item) => (
                      <Link className="rh-related-card" to={`/resources/${item.slug}`} key={item.slug}>
                        <span className="rh-related-card-category">{item.categoryLabel}</span>
                        <p className="rh-related-card-title">{item.title}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="rh-article-note">
                This guide is being expanded with the full write-up. In the meantime, reach out via{' '}
                <a href="/#contact">Talk to us</a> if you'd like to discuss {article.categoryLabel.toLowerCase()}{' '}
                for your team.
              </p>

              {related.length > 0 && (
                <div style={{ marginTop: '3rem' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0a101d', marginBottom: '2rem' }}>Related Resources</h2>
                  <div className="rh-related-grid">
                    {related.map((item) => (
                      <Link className="rh-related-card" to={`/resources/${item.slug}`} key={item.slug}>
                        <span className="rh-related-card-category">{item.categoryLabel}</span>
                        <p className="rh-related-card-title">{item.title}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
}
