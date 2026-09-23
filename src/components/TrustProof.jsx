import React from 'react';
import { TrendingUp, CheckCircle2, Zap } from 'lucide-react';

const ClientLogos = () => {
  return (
    <div className="trust-logos-section">
      <div className="trust-logos-header">
        <p className="trust-logos-label">TRUSTED BY ENTERPRISE TEAMS</p>
        <p className="trust-logos-subtext">Verified partners processing mission-critical documents</p>
      </div>
      <div className="trust-logos-placeholder">
        <div className="trust-logos-placeholder-content">
          <svg className="trust-logos-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26H22L17.46 12.36L19.54 18.63L12 14.53L4.46 18.63L6.54 12.36L2 8.26H8.91L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
          <p className="trust-logos-note">
            Client logos coming soon
          </p>
          <p className="trust-logos-subtext-small">
            Reserved for verified Star Software partners
          </p>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon: Icon, number, label, note }) => {
  return (
    <div className="trust-metric-card">
      <div className="trust-metric-icon">
        <Icon size={20} />
      </div>
      <div className="trust-metric-number">{number}</div>
      <div className="trust-metric-label">{label}</div>
      {note && <div className="trust-metric-note">{note}</div>}
    </div>
  );
};

export default function TrustProof() {
  const metrics = [
    { icon: TrendingUp, number: '10M+', label: 'Documents processed', note: 'verified' },
    { icon: Zap, number: 'X+', label: 'Workflows automated', note: 'pending verification' },
    { icon: CheckCircle2, number: 'X+', label: 'Industries supported', note: 'pending verification' },
    { icon: TrendingUp, number: 'X+', label: 'Years of expertise', note: 'pending verification' },
  ];

  return (
    <section className="trust-proof-section" aria-label="Trust and Social Proof">
      {/* Decorative gradient background */}
      <div className="trust-proof-gradient"></div>

      <div className="section-grid-lines" aria-hidden="true" />

      <div className="trust-proof-container">
        {/* Premium Introduction */}
        <div className="trust-intro">
          <div className="trust-badge">
            <span className="trust-badge-icon">✓</span>
            <span>Enterprise trusted</span>
          </div>
          <h2 className="trust-headline">
            Where documents become <span className="trust-headline-accent">business decisions.</span>
          </h2>
          <p className="trust-description">
            Star Software automates the extraction, validation and processing of information mission-critical to enterprises worldwide.
          </p>
        </div>

        {/* Premium Metrics Grid */}
        <div className="trust-metrics-wrapper">
          <div className="trust-metrics">
            {metrics.map((metric, idx) => (
              <MetricCard key={idx} {...metric} />
            ))}
          </div>
        </div>

        {/* Premium Client Logos Section */}
        <ClientLogos />
      </div>
    </section>
  );
}
