import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import starSoftwareLogo from '../../assets/star-software-logo.png';
import { RESOURCE_LINKS } from '../../data/resourceNav';

// The navbar of the redesigned site, where the solution pages sit under one
// Solutions menu. Only the campaign page uses it; the site's own Navbar is
// unchanged. Its styles come with the page (MtrCampaign.css).

// Lets the pointer cross the gap between trigger and panel without closing it.
const HOVER_CLOSE_DELAY_MS = 140;
// Gap between the main panel and a sub-panel; mirrors the CSS 0.5rem.
const SUBMENU_GAP_PX = 8;

// The solution pages this site has.
const SOLUTION_LINKS = [
  { label: 'MTR Automation', to: '/mtr-automation' },
  { label: 'COA Automation', to: '/coa-automation' },
];

const PAGE_LINKS = [
  { label: 'Products', href: '/#products' },
  { label: 'Industries', href: '/#industries' },
  { label: 'Company', href: '/#company' },
];

// The router for pages in this site, a plain link for full URLs.
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

function Chevron({ className, d = 'M3 4.5L6 7.5L9 4.5' }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Solutions: opens on hover or focus, and from the keyboard with ArrowDown.
function SolutionsMenu({ pathname }) {
  const [open, setOpen] = useState(false);
  const itemRef = useRef(null);
  const closeTimerRef = useRef(null);
  const show = () => {
    clearTimeout(closeTimerRef.current);
    setOpen(true);
  };
  const hideSoon = () => {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOpen(false), 120);
  };
  useEffect(() => () => clearTimeout(closeTimerRef.current), []);
  useEffect(() => setOpen(false), [pathname]);
  // The campaign page is an MTR page too, so Solutions shows as current.
  const onSolutionPage = pathname === '/mtr-campaign' || SOLUTION_LINKS.some((link) => link.to === pathname);

  return (
    <li
      ref={itemRef}
      className="nav-item nav-item--dropdown"
      onMouseEnter={show}
      onMouseLeave={hideSoon}
      onBlur={(event) => {
        if (!itemRef.current?.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <a
        href="/#solutions"
        className={`nav-link nav-dropdown-trigger${onSolutionPage ? ' nav-link--active' : ''}`}
        aria-expanded={open}
        aria-controls="nav-solutions-panel"
        onFocus={show}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            show();
            requestAnimationFrame(() => itemRef.current?.querySelector('.nav-dropdown-link')?.focus());
          }
          if (event.key === 'Escape') setOpen(false);
        }}
      >
        Solutions
        <Chevron className="nav-dropdown-chevron" />
      </a>
      <div id="nav-solutions-panel" className={`nav-dropdown${open ? ' nav-dropdown--open' : ''}`} hidden={!open}>
        <ul className="nav-dropdown-list">
          {SOLUTION_LINKS.map((link) => (
            <li key={link.to} className="nav-dropdown-item">
              <Link to={link.to} className="nav-dropdown-link" aria-current={pathname === link.to ? 'page' : undefined}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default function CampaignNavbar({ variant = 'transparent' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [flipSubmenus, setFlipSubmenus] = useState(false);
  const resourcesRef = useRef(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const closeTimerRef = useRef(null);
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

  // Any navigation (including #section links on the same page) closes both.
  useEffect(() => {
    setResourcesOpen(false);
    setMobileMenuOpen(false);
  }, [location.key]);

  const cancelClose = () => clearTimeout(closeTimerRef.current);
  const openResources = () => {
    cancelClose();
    setResourcesOpen(true);
  };
  const closeResourcesSoon = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => setResourcesOpen(false), HOVER_CLOSE_DELAY_MS);
  };

  // A click outside or Escape closes Resources; Escape hands focus back.
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

  // Sub-panels open to the right unless that would run off the screen.
  useLayoutEffect(() => {
    if (!resourcesOpen) return undefined;
    const measure = () => {
      const panel = panelRef.current;
      const list = panel?.querySelector('.nav-dropdown-list');
      if (!list) return;
      const widest = Math.max(0, ...[...panel.querySelectorAll('.nav-submenu-list')].map((el) => el.offsetWidth));
      const room = window.innerWidth - list.getBoundingClientRect().right;
      setFlipSubmenus(room < widest + SUBMENU_GAP_PX);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [resourcesOpen]);

  const onTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openResources();
      requestAnimationFrame(() => panelRef.current?.querySelector('.nav-dropdown-link')?.focus());
    }
  };
  const onResourcesBlur = (event) => {
    if (!resourcesRef.current?.contains(event.relatedTarget)) setResourcesOpen(false);
  };

  const onResourcesPage = location.pathname.startsWith('/resources');
  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className={`navbar-root${variant === 'solid' ? ' navbar-root--solid' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link" aria-label="Star Software Home">
            <img src={starSoftwareLogo} alt="Star Software" className="brand-logo-img" />
          </Link>
        </div>

        <nav className="navbar-nav" aria-label="Primary Navigation">
          <ul className="nav-list">
            <SolutionsMenu pathname={location.pathname} />
            {PAGE_LINKS.map((link) => (
              <li key={link.label} className="nav-item">
                <a href={link.href} className="nav-link">
                  {link.label}
                </a>
              </li>
            ))}
            <li
              ref={resourcesRef}
              className="nav-item nav-item--dropdown"
              onMouseEnter={openResources}
              onMouseLeave={closeResourcesSoon}
              onBlur={onResourcesBlur}
            >
              <Link
                ref={triggerRef}
                to="/resources"
                className={`nav-link nav-dropdown-trigger${onResourcesPage ? ' nav-link--active' : ''}`}
                aria-expanded={resourcesOpen}
                aria-controls="nav-resources-panel"
                onKeyDown={onTriggerKeyDown}
              >
                Resources
                <Chevron className="nav-dropdown-chevron" />
              </Link>
              <div
                ref={panelRef}
                id="nav-resources-panel"
                className={`nav-dropdown${resourcesOpen ? ' nav-dropdown--open' : ''}${flipSubmenus ? ' nav-dropdown--flip' : ''}`}
                hidden={!resourcesOpen}
              >
                <ul className="nav-dropdown-list">
                  {RESOURCE_LINKS.map((item) => (
                    <li key={item.label} className={`nav-dropdown-item${item.children ? ' nav-dropdown-item--has-children' : ''}`}>
                      <ResourceLink to={item.to} className="nav-dropdown-link">
                        {item.label}
                        {item.children && <Chevron className="nav-dropdown-caret" d="M4.5 3L7.5 6L4.5 9" />}
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
              </div>
            </li>
          </ul>
        </nav>

        <div className="navbar-actions">
          <a href="/#contact" className="action-talk">
            Talk to us
          </a>
          <a href="/#demo" className="action-cta-demo">
            Get a Demo
          </a>
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

      {mobileMenuOpen && (
        <div className="mobile-nav-menu">
          <ul className="mobile-nav-list">
            <li className="mobile-nav-group">
              <a href="/#solutions" className="mobile-nav-group-label" onClick={closeMobile}>
                Solutions
              </a>
              <ul className="mobile-nav-sublist">
                {SOLUTION_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="mobile-nav-sublink" onClick={closeMobile}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {PAGE_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="mobile-nav-link" onClick={closeMobile}>
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mobile-nav-group">
              <Link to="/resources" className="mobile-nav-group-label" onClick={closeMobile}>
                Resources
              </Link>
              <ul className="mobile-nav-sublist">
                {RESOURCE_LINKS.map((item) => (
                  <li key={item.label}>
                    <ResourceLink to={item.to} className="mobile-nav-sublink" onClick={closeMobile}>
                      {item.label}
                    </ResourceLink>
                    {item.children && (
                      <ul className="mobile-nav-sublist mobile-nav-sublist--nested">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <ResourceLink to={child.to} className="mobile-nav-sublink mobile-nav-sublink--nested" onClick={closeMobile}>
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
            <li className="mobile-nav-divider" />
            <li>
              <a href="/#contact" className="mobile-nav-link" onClick={closeMobile}>
                Talk to us
              </a>
            </li>
            <li>
              <a href="/#demo" className="mobile-nav-cta" onClick={closeMobile}>
                Get a Demo
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
