import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import starSoftwareLogo from '../assets/star-software-logo.png';

export default function Navbar({ variant = 'transparent' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Solutions', href: '/#solutions' },
    { label: 'Products', href: '/#products' },
    { label: 'Industries', href: '/#industries' },
    { label: 'Company', href: '/#company' },
  ];

  const resourcesActive = location.pathname.startsWith('/resources');
  const rootClassName = `navbar-root${variant === 'solid' ? ' navbar-root--solid' : ''}`;

  return (
    <header className={rootClassName}>
      <div className="navbar-container">
        {/* Left: Star Software Logo */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link" aria-label="Star Software Home">
            <img
              src={starSoftwareLogo}
              alt="Star Software"
              className="brand-logo-img"
            />
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="navbar-nav" aria-label="Primary Navigation">
          <ul className="nav-list">
            {navLinks.map((item) => (
              <li key={item.label} className="nav-item">
                <a href={item.href} className="nav-link">
                  {item.label}
                </a>
              </li>
            ))}
            <li className="nav-item">
              <Link
                to="/resources"
                className={`nav-link${resourcesActive ? ' nav-link--active' : ''}`}
                aria-current={resourcesActive ? 'page' : undefined}
              >
                Resources
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right: Actions */}
        <div className="navbar-actions">
          <a href="/#contact" className="action-talk">
            Talk to us
          </a>
          <a href="/#demo" className="action-cta-demo">
            Get a Demo
          </a>

          {/* Mobile hamburger toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`} />
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`} />
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-menu">
          <ul className="mobile-nav-list">
            {navLinks.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/resources"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Resources
              </Link>
            </li>
            <li className="mobile-nav-divider" />
            <li>
              <a
                href="/#contact"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Talk to us
              </a>
            </li>
            <li>
              <a
                href="/#demo"
                className="mobile-nav-cta"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get a Demo
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
