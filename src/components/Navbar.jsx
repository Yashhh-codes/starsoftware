import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import starSoftwareLogo from '../assets/star-software-logo.png';
import { RESOURCE_LINKS } from '../data/resourceNav';
import { CONTACT_URL, DEMO_PATH } from '../data/demo';
import { INDUSTRY_PAGES, PRODUCT_PAGES } from '../data/landingPages';

// Lets the pointer cross the gap between trigger and panel without closing it.
const HOVER_CLOSE_DELAY_MS = 140;
// Gap between the main panel and a sub-panel; mirrors the CSS 0.5rem.
const SUBMENU_GAP_PX = 8;


// The product pages, under "Solutions".
const SOLUTION_LINKS = [
  { label: 'MTR Automation', to: '/mtr-automation', text: 'Read and check mill test reports' },
  { label: 'COA Automation', to: '/coa-automation', text: 'Verify certificates of analysis' },
  { label: 'RFQ to Quote', to: '/rfq-to-quote', text: 'Turn RFQs and drawings into quotes' },
  ...PRODUCT_PAGES.map((page) => ({ label: page.label, to: page.path, text: page.text })),
];
const INDUSTRY_LINKS = INDUSTRY_PAGES.map((page) => ({ label: page.label, to: page.path }));

// A resource link: the router for pages in this site, a plain link for full
// URLs (case studies and success stories on starsoftware.co).
function ResourceLink({ to, children, ...props }) {
  if (/^https?:\/\//.test(to)) {
    return (
      <a href={to} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  );
}

function Chevron() {
  return (
    <svg className="nav-dropdown-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// A top-level item with a panel: hovering opens it, as does Arrow Down from
// the keyboard (moving focus into it); Escape, a click elsewhere or focus
// leaving closes it. With `to` the trigger is a link to that page; without,
// a button that opens the panel.
function NavMenu({ id, label, to, active, children }) {
  const [open, setOpen] = useState(false);
  const [flip, setFlip] = useState(false);
  const itemRef = useRef(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const location = useLocation();

  const cancelClose = () => clearTimeout(closeTimerRef.current);
  const openNow = () => {
    cancelClose();
    setOpen(true);
  };
  const closeSoon = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY_MS);
  };

  useEffect(() => {
    setOpen(false);
  }, [location.key]);

  useEffect(() => () => clearTimeout(closeTimerRef.current), []);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!itemRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // Sub-panels open to the right, but where the trigger sits shifts with the
  // viewport, so on narrower desktops there isn't room. Measure on open and on
  // resize, and open them to the left instead. Hidden sub-panels use
  // visibility rather than display, so their widths are measurable.
  useLayoutEffect(() => {
    if (!open) return undefined;
    const measure = () => {
      const panel = panelRef.current;
      const list = panel?.querySelector('.nav-dropdown-list');
      if (!list) return;
      const widest = Math.max(0, ...[...panel.querySelectorAll('.nav-submenu-list')].map((sub) => sub.offsetWidth));
      setFlip(widest > 0 && window.innerWidth - list.getBoundingClientRect().right < widest + SUBMENU_GAP_PX);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [open]);

  const onTriggerKeyDown = (event) => {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    openNow();
    requestAnimationFrame(() => panelRef.current?.querySelector('a')?.focus());
  };

  const onBlur = (event) => {
    if (!itemRef.current?.contains(event.relatedTarget)) setOpen(false);
  };

  const triggerProps = {
    ref: triggerRef,
    className: `nav-link nav-dropdown-trigger${active ? ' nav-link--active' : ''}`,
    'aria-expanded': open,
    'aria-controls': id,
    onKeyDown: onTriggerKeyDown,
  };

  return (
    <li ref={itemRef} className="nav-item nav-item--dropdown" onMouseEnter={openNow} onMouseLeave={closeSoon} onBlur={onBlur}>
      {to ? (
        <Link to={to} {...triggerProps}>
          {label}
          <Chevron />
        </Link>
      ) : (
        <button type="button" {...triggerProps} onClick={openNow}>
          {label}
          <Chevron />
        </button>
      )}
      <div
        ref={panelRef}
        id={id}
        className={`nav-dropdown${open ? ' nav-dropdown--open' : ''}${flip ? ' nav-dropdown--flip' : ''}`}
        hidden={!open}
      >
        {children}
      </div>
    </li>
  );
}

export default function Navbar({ variant = 'transparent' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // While the mobile menu is open the page behind it stays put (the menu
  // scrolls on its own), and Escape closes it.
  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const root = document.documentElement;
    root.classList.add('nav-menu-open');
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      root.classList.remove('nav-menu-open');
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  // Any navigation (including #section links on the same page) closes it.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.key]);

  const closeMenu = () => setMobileMenuOpen(false);
  const solutionsActive = SOLUTION_LINKS.some((item) => item.to === location.pathname);
  const industriesActive = location.pathname.startsWith('/industries/');
  const resourcesActive = location.pathname.startsWith('/resources');
  const companyActive = location.pathname === '/about-us';
  const rootClassName = `navbar-root${variant === 'solid' ? ' navbar-root--solid' : ''}`;

  return (
    <header className={rootClassName}>
      <div className="navbar-container">
        {/* Left: Star Software Logo */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link" aria-label="Star Software Home">
            <img src={starSoftwareLogo} alt="Star Software" className="brand-logo-img" />
          </Link>
        </div>

        {/* Center: Solutions, Industries, Resources and Company */}
        <nav className="navbar-nav" aria-label="Primary Navigation">
          <ul className="nav-list">
            <NavMenu id="nav-solutions-panel" label="Solutions" active={solutionsActive}>
              <ul className="nav-dropdown-list nav-dropdown-list--rich nav-dropdown-list--cols">
                {SOLUTION_LINKS.map((item) => (
                  <li key={item.to} className="nav-dropdown-item">
                    <Link
                      to={item.to}
                      className="nav-dropdown-link nav-rich-link"
                      aria-current={location.pathname === item.to ? 'page' : undefined}
                    >
                      <span className="nav-rich-title">{item.label}</span>
                      <span className="nav-rich-text">{item.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </NavMenu>

            <NavMenu id="nav-industries-panel" label="Industries" active={industriesActive}>
              <ul className="nav-dropdown-list">
                {INDUSTRY_LINKS.map((item) => (
                  <li key={item.to} className="nav-dropdown-item">
                    <Link
                      to={item.to}
                      className="nav-dropdown-link"
                      aria-current={location.pathname === item.to ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </NavMenu>

            {/* Clicking goes to the resources landing page; hovering (or
                Arrow Down from the keyboard) opens the menu. */}
            <NavMenu id="nav-resources-panel" label="Resources" to="/resources" active={resourcesActive}>
              <ul className="nav-dropdown-list">
                {RESOURCE_LINKS.map((item) => (
                  <li
                    key={item.label}
                    className={`nav-dropdown-item${item.children ? ' nav-dropdown-item--has-children' : ''}`}
                  >
                    <ResourceLink to={item.to} className="nav-dropdown-link">
                      {item.label}
                      {item.children && (
                        <svg className="nav-dropdown-caret" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </ResourceLink>
                    {item.children && (
                      <div className="nav-submenu">
                        <ul className="nav-submenu-list" aria-label={item.label}>
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <ResourceLink to={child.to} className="nav-dropdown-link">
                                {child.label}
                              </ResourceLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </NavMenu>

            <li className="nav-item">
              <Link
                to="/about-us"
                className={`nav-link${companyActive ? ' nav-link--active' : ''}`}
                aria-current={companyActive ? 'page' : undefined}
              >
                Company
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right: Actions */}
        <div className="navbar-actions">
          <a href={CONTACT_URL} className="action-talk">
            Talk to us
          </a>
          <a href={DEMO_PATH} className="action-cta-demo">
            Book a demo
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
            <li className="mobile-nav-group">
              <span className="mobile-nav-group-label">Solutions</span>
              <ul className="mobile-nav-sublist">
                {SOLUTION_LINKS.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="mobile-nav-sublink"
                      aria-current={location.pathname === item.to ? 'page' : undefined}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="mobile-nav-group">
              <span className="mobile-nav-group-label">Industries</span>
              <ul className="mobile-nav-sublist">
                {INDUSTRY_LINKS.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="mobile-nav-sublink"
                      aria-current={location.pathname === item.to ? 'page' : undefined}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="mobile-nav-group">
              <Link to="/resources" className="mobile-nav-group-label" onClick={closeMenu}>
                Resources
              </Link>
              <ul className="mobile-nav-sublist">
                {RESOURCE_LINKS.map((item) => (
                  <li key={item.label}>
                    <ResourceLink to={item.to} className="mobile-nav-sublink" onClick={closeMenu}>
                      {item.label}
                    </ResourceLink>
                    {item.children && (
                      <ul className="mobile-nav-sublist mobile-nav-sublist--nested">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <ResourceLink
                              to={child.to}
                              className="mobile-nav-sublink mobile-nav-sublink--nested"
                              onClick={closeMenu}
                            >
                              {child.label}
                            </ResourceLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link
                to="/about-us"
                className="mobile-nav-link"
                aria-current={companyActive ? 'page' : undefined}
                onClick={closeMenu}
              >
                Company
              </Link>
            </li>
            <li className="mobile-nav-divider" />
            <li>
              <a href={CONTACT_URL} className="mobile-nav-link" onClick={closeMenu}>
                Talk to us
              </a>
            </li>
            <li>
              <a href={DEMO_PATH} className="mobile-nav-cta" onClick={closeMenu}>
                Book a demo
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
