import React from 'react';

const FOOTER_COLUMNS = [
  {
    heading: 'Solutions',
    links: [
      { label: 'Document AI', href: '/#solutions' },
      { label: 'Extraction Flow', href: '/#solutions' },
      { label: 'Financial Auditing', href: '/#solutions' },
      { label: 'Workflow Orchestration', href: '/#solutions' },
    ],
  },
  {
    heading: 'Products',
    links: [
      { label: 'Star Core API', href: '/#products' },
      { label: 'Intelligent Parser', href: '/#products' },
      { label: 'Compliance Ledger', href: '/#products' },
      { label: 'Model Fine-Tuner', href: '/#products' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Resource Hub', href: '/resources' },
      { label: 'Documentation', href: '/#resources' },
      { label: 'API Reference', href: '/#resources' },
      { label: 'Release Notes', href: '/#resources' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '/#company' },
      { label: 'Careers', href: '/#company' },
      { label: 'Security & Trust', href: '/#company' },
      { label: 'Contact Sales', href: '/#contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/#privacy-policy' },
      { label: 'Terms of Service', href: '/#terms-of-service' },
      { label: 'DPA', href: '/#dpa' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          {FOOTER_COLUMNS.map((column) => (
            <div className="site-footer-column" key={column.heading}>
              <span className="site-footer-heading">{column.heading}</span>
              {column.links.map((link) => (
                <a className="site-footer-link" href={link.href} key={link.label}>
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="site-footer-bottom">
          <p className="site-footer-copyright">
            © {new Date().getFullYear()} Star Software Technologies, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
