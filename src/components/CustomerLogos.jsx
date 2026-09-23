import React from 'react';

/* Rendered twice inside the marquee track. The track scrolls exactly one
   sequence width, so the second copy is what makes the loop seamless. */
function LogoSequence() {
  return (
    <>
      {/* NVIDIA */}
      <div className="logo-item" title="NVIDIA">
        <svg height="22" viewBox="0 0 110 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="19" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="21" letterSpacing="0.05em" fill="#111827">NVIDIA</text>
        </svg>
      </div>

      {/* Ford */}
      <div className="logo-item" title="Ford">
        <svg height="26" viewBox="0 0 70 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="35" cy="14" rx="34" ry="13" stroke="#002C6C" strokeWidth="2" fill="none" />
          <text x="35" y="19" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="bold" fontSize="17" fill="#002C6C">Ford</text>
        </svg>
      </div>

      {/* Coinbase */}
      <div className="logo-item" title="Coinbase">
        <svg height="22" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="18" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="20" letterSpacing="-0.03em" fill="#0052FF">coinbase</text>
        </svg>
      </div>

      {/* Google */}
      <div className="logo-item" title="Google">
        <svg height="24" viewBox="0 0 80 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="20" fontFamily="'Product Sans', -apple-system, sans-serif" fontWeight="500" fontSize="22" letterSpacing="-0.02em">
            <tspan fill="#4285F4">G</tspan>
            <tspan fill="#EA4335">o</tspan>
            <tspan fill="#FBBC05">o</tspan>
            <tspan fill="#4285F4">g</tspan>
            <tspan fill="#34A853">l</tspan>
            <tspan fill="#EA4335">e</tspan>
          </text>
        </svg>
      </div>

      {/* Shopify */}
      <div className="logo-item" title="Shopify">
        <svg height="24" viewBox="0 0 100 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3L3 8L4 21L12 24L20 21L21 8L12 3Z" fill="#95BF47" />
          <path d="M12 7C10.5 7 9.5 8 9.5 9.5C9.5 11 11 11.5 12 12C13 12.5 14.5 13 14.5 14.5C14.5 16 13 17 11.5 17C10 17 9 16 9 16" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          <text x="26" y="19" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="19" letterSpacing="-0.02em" fill="#212326">shopify</text>
        </svg>
      </div>

      {/* Mindbody */}
      <div className="logo-item" title="Mindbody">
        <svg height="20" viewBox="0 0 95 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="18" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fontSize="18" letterSpacing="-0.01em" fill="#1F2937">mindbody</text>
        </svg>
      </div>

      {/* MetLife */}
      <div className="logo-item" title="MetLife">
        <svg height="22" viewBox="0 0 95 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="5" width="6" height="14" fill="#007ABC" rx="1" />
          <rect x="8" y="5" width="6" height="14" fill="#A4CE4E" rx="1" />
          <text x="18" y="18" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="18" letterSpacing="-0.02em" fill="#111827">MetLife</text>
        </svg>
      </div>

      {/* Ramp */}
      <div className="logo-item" title="Ramp">
        <svg height="22" viewBox="0 0 75 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="18" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="19" letterSpacing="-0.02em" fill="#111827">ramp</text>
          <path d="M52 18L64 8M64 8H57M64 8V15" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </>
  );
}

export default function CustomerLogos() {
  return (
    <section className="customer-logos-section" aria-label="Trusted Companies">
      <div className="section-grid-lines" aria-hidden="true" />

      <div className="customer-logos-container">
        <p className="customer-logos-label">
          Trusted by teams processing critical business documents
        </p>

        <div className="customer-logos-marquee">
          <div className="customer-logos-track">
            <div className="customer-logos-group">
              <LogoSequence />
            </div>
            <div className="customer-logos-group" aria-hidden="true">
              <LogoSequence />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
