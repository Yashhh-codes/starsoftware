import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LEAD_STORAGE_KEY, THANK_YOU_PATH } from '../data/demo';
import { submitDemoRequest } from '../utils/hubspot';

// The product and industry pages from the redesigned site
// (star-software-site.vercel.app): each one's markup, page scripts and
// styles are in ./lp/<slug>.*, the styles scoped to .lp-<slug> (the AP
// page's to .ap-page). This page puts the markup between the site's navbar
// and footer, runs its scripts against it alone, and sends its demo form
// through the site's demo flow (HubSpot, then the thank-you page).
const MARKUP = import.meta.glob('./lp/*.html', { query: '?raw', import: 'default' });
const SCRIPTS = import.meta.glob('./lp/*.scripts.json', { import: 'default' });
const STYLES = import.meta.glob('./lp/*.css');

// Pages that use fonts beyond the site's own.
const FONTS = {
  'ap-automation': 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap',
};

// Runs a page's scripts with `document` looking only inside the page, and
// returns a cleanup that stops their timers, observers and listeners.
function runScripts(scripts, root) {
  const timeouts = new Set();
  const intervals = new Set();
  const frames = new Set();
  const observers = [];
  const listeners = [];
  const globals = new Set();
  const listen = (target) => (type, fn, options) => {
    target.addEventListener(type, fn, options);
    listeners.push([target, type, fn, options]);
  };
  const tracked = (Base) =>
    Base &&
    class extends Base {
      constructor(...args) {
        super(...args);
        observers.push(this);
      }
    };
  const shims = {
    setTimeout: (fn, ms, ...a) => {
      const id = window.setTimeout(fn, ms, ...a);
      timeouts.add(id);
      return id;
    },
    clearTimeout: (id) => {
      timeouts.delete(id);
      window.clearTimeout(id);
    },
    setInterval: (fn, ms, ...a) => {
      const id = window.setInterval(fn, ms, ...a);
      intervals.add(id);
      return id;
    },
    clearInterval: (id) => {
      intervals.delete(id);
      window.clearInterval(id);
    },
    requestAnimationFrame: (fn) => {
      const id = window.requestAnimationFrame(fn);
      frames.add(id);
      return id;
    },
    cancelAnimationFrame: (id) => {
      frames.delete(id);
      window.cancelAnimationFrame(id);
    },
    IntersectionObserver: tracked(window.IntersectionObserver),
    ResizeObserver: tracked(window.ResizeObserver),
    MutationObserver: tracked(window.MutationObserver),
    getComputedStyle: (el, pseudo) => window.getComputedStyle(el === document.documentElement ? root : el, pseudo),
  };
  const wrap = (target, overrides, onSet) =>
    new Proxy(target, {
      get(obj, key) {
        if (key in overrides) return overrides[key];
        const value = Reflect.get(obj, key, obj);
        return typeof value === 'function' && !/^[A-Z]/.test(String(key)) ? value.bind(obj) : value;
      },
      set(obj, key, value) {
        if (onSet && !(key in obj)) onSet(key);
        obj[key] = value;
        return true;
      },
    });
  const doc = wrap(document, {
    addEventListener: listen(document),
    querySelector: (s) => root.querySelector(s),
    querySelectorAll: (s) => root.querySelectorAll(s),
    getElementById: (id) => root.querySelector(`#${CSS.escape(id)}`),
    getElementsByClassName: (c) => root.getElementsByClassName(c),
    getElementsByTagName: (t) => root.getElementsByTagName(t),
  });
  const win = wrap(window, { ...shims, document: doc, addEventListener: listen(window) }, (key) => globals.add(key));
  const names = ['window', 'self', 'document', ...Object.keys(shims)];
  const values = [win, win, doc, ...Object.values(shims)];
  scripts.forEach((code) => {
    try {
      // The pages' own scripts, shipped with the site (./lp), not user input.
      // eslint-disable-next-line no-new-func
      new Function(...names, code)(...values);
    } catch (error) {
      console.error('Page script failed:', error);
    }
  });
  return () => {
    timeouts.forEach((id) => window.clearTimeout(id));
    intervals.forEach((id) => window.clearInterval(id));
    frames.forEach((id) => window.cancelAnimationFrame(id));
    observers.forEach((o) => o.disconnect());
    listeners.forEach(([t, type, fn, o]) => t.removeEventListener(type, fn, o));
    globals.forEach((key) => {
      delete window[key];
    });
  };
}

// The name and email from a page's demo form, whichever ids it uses.
function readLead(form) {
  const value = (selector) => form.querySelector(selector)?.value.trim() || '';
  return {
    name: value('#fn, #f-name, #s-name, [autocomplete="name"]'),
    email: value('#em, #f-email, #s-email, input[type="email"]'),
  };
}

export default function LandingPage({ slug, title, rootClass = `lp-page lp-${slug}` }) {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { hash } = useLocation();
  const [page, setPage] = useState(null);

  useEffect(() => {
    let live = true;
    setPage(null);
    Promise.all([
      MARKUP[`./lp/${slug}.html`](),
      SCRIPTS[`./lp/${slug}.scripts.json`](),
      STYLES[`./lp/${slug}.css`](),
    ]).then(([markup, scripts]) => {
      if (live) setPage({ slug, markup, scripts });
    });
    return () => {
      live = false;
    };
  }, [slug]);

  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);

  useEffect(() => {
    const href = FONTS[slug];
    if (!href || document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }, [slug]);

  useEffect(() => {
    if (!page || page.slug !== slug) return undefined;
    const root = ref.current;
    const stop = runScripts(page.scripts, root);
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();

    // The demo form: checked as the page would, then the site's flow. Caught
    // before the page's own script, which only showed a message.
    const onSubmit = async (event) => {
      const form = event.target.closest('form');
      if (!form) return;
      event.preventDefault();
      event.stopPropagation();
      const lead = readLead(form);
      if (!form.checkValidity() || !lead.name || !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(lead.email)) {
        form.reportValidity();
        return;
      }
      const button = form.querySelector('[type="submit"]');
      if (button) button.disabled = true;
      let sent = false;
      try {
        sent = (await submitDemoRequest(lead)).sent;
      } catch (error) {
        console.warn('The demo request could not be sent to HubSpot.', error);
      }
      const record = { ...lead, sent };
      try {
        sessionStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(record));
      } catch {
        // Storage blocked: the thank-you page still has it from the state.
      }
      navigate(THANK_YOU_PATH, { state: { lead: record } });
    };
    root.addEventListener('submit', onSubmit, true);
    return () => {
      stop();
      root.removeEventListener('submit', onSubmit, true);
    };
  }, [page, slug, hash, navigate]);

  // Links to this site's pages go through the router.
  const onClick = (event) => {
    const link = event.target.closest('a[href^="/"]');
    if (!link || link.target || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    const href = link.getAttribute('href');
    if (href.startsWith('//')) return;
    event.preventDefault();
    navigate(href);
  };

  return (
    <>
      <Navbar variant="solid" />
      {page && page.slug === slug && (
        // The page's markup, shipped with the site (./lp).
        <div className={rootClass} ref={ref} onClick={onClick} dangerouslySetInnerHTML={{ __html: page.markup }} />
      )}
      <Footer />
    </>
  );
}
