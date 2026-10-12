import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import starSoftwareLogo from '../assets/star-software-logo.png';
import { RESOURCE_LINKS } from '../data/resourceNav';

// Lets the pointer cross the gap between trigger and panel without closing it.
const HOVER_CLOSE_DELAY_MS = 140;
// Gap between the main panel and a sub-panel; mirrors the CSS 0.5rem.
const SUBMENU_GAP_PX = 8;

export default function Navbar({ variant = 'transparent' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [flipSubmenus, setFlipSubmenus] = useState(false);
  const resourcesRef = useRef(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const location = useLocation();

  const cancelClose = () => clearTimeout(closeTimerRef.current);
  const openResources = () => {
    cancelClose();
    setResourcesOpen(true);
  };
  const closeResourcesSoon = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => setResourcesOpen(false), HOVER_CLOSE_DELAY_MS);
  };

  useEffect(() => {
    setResourcesOpen(false);
    setMobileMenuOpen(false);
  }, [location.key]);

  useEffect(() => {
    if (!resourcesOpen) return undefined;
    const onPointerDown = (event) => {
      if (!resourcesRef.current?.contains(event.target)) setResourcesOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setResourcesOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [resourcesOpen]);

  useEffect(() => () => clearTimeout(closeTimerRef.current), []);

  // Sub-panels open to the right, but where the trigger sits shifts with the
  // viewport, so on narrower desktops there isn't room. Measure on open and on
  // resize, and open them to the left instead. Hidden sub-panels use
  // visibility rather than display, so their widths are measurable.
  useLayoutEffect(() => {
    if (!resourcesOpen) return undefined;
    const measure = () => {
      const panel = panelRef.current;
      const list = panel?.querySelector('.nav-dropdown-list');
      if (!list) return;
      const widest = Math.max(
        0,
        ...[...panel.querySelectorAll('.nav-submenu-list')].map((sub) => sub.offsetWidth)
      );
      const roomOnRight = window.innerWidth - list.getBoundingClientRect().right;
      setFlipSubmenus(roomOnRight < widest + SUBMENU_GAP_PX);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [resourcesOpen]);

  // Close when keyboard focus leaves the trigger-and-panel group entirely.
  const handleResourcesBlur = (event) => {
    if (!resourcesRef.current?.contains(event.relatedTarget)) setResourcesOpen(false);
  };

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
            <li
              ref={resourcesRef}
              className="nav-item nav-item--dropdown"
              onMouseEnter={openResources}
              onMouseLeave={closeResourcesSoon}
              onBlur={handleResourcesBlur}
            >
              <button
                ref={triggerRef}
                type="button"
                className={`nav-link nav-dropdown-trigger${resourcesActive ? ' nav-link--active' : ''}`}
                aria-expanded={resourcesOpen}
                aria-controls="nav-resources-panel"
                onClick={() => setResourcesOpen((open) => !open)}
              >
                Resources
                <svg
                  className="nav-dropdown-chevron"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                ref={panelRef}
                id="nav-resources-panel"
                className={`nav-dropdown${resourcesOpen ? ' nav-dropdown--open' : ''}${flipSubmenus ? ' nav-dropdown--flip' : ''}`}
                hidden={!resourcesOpen}
              >
                <ul className="nav-dropdown-list">
                  {RESOURCE_LINKS.map((item) => (
                    <li
                      key={item.label}
                      className={`nav-dropdown-item${item.children ? ' nav-dropdown-item--has-children' : ''}`}
                    >
                      <Link to={item.to} className="nav-dropdown-link">
                        {item.label}
                        {item.children && (
                          <svg
                            className="nav-dropdown-caret"
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M4.5 3L7.5 6L4.5 9"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </Link>
                      {item.children && (
                        <div className="nav-submenu">
                          <ul className="nav-submenu-list" aria-label={item.label}>
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <Link to={child.to} className="nav-dropdown-link">
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
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
            <li className="mobile-nav-group">
              <span className="mobile-nav-group-label">Resources</span>
              <ul className="mobile-nav-sublist">
                {RESOURCE_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="mobile-nav-sublink"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <ul className="mobile-nav-sublist mobile-nav-sublist--nested">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              to={child.to}
                              className="mobile-nav-sublink mobile-nav-sublink--nested"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
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
