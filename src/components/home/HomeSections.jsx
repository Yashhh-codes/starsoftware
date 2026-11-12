// The homepage's sections, from the redesigned site's homepage
// (star-software-site.vercel.app), its compiled code turned back into JSX.
// The page (src/pages/Home.jsx) puts them between this site's navbar and
// footer; the styles are in src/pages/Home.css, scoped to the page. Two
// changes from the original: "Request a demo" opens this site's demo form
// (src/data/demo.js), and the sample form hands off to the visitor's email
// app instead of reporting a sample as sent when nothing was.
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DEMO_PATH } from '../../data/demo';

const SAMPLE_MAIL = 'info@starsoftware.co';

const sb = {
  arr: ["0 0 10 10", <path d="M3.5 2l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />],
  left: ["0 0 16 16", <path d="M13 8H3M7 4L3 8l4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />],
  right: ["0 0 16 16", <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />],
  expand: ["0 0 16 16", <path d="M9.5 3H13v3.5M13 3L9 7M6.5 13H3V9.5M3 13l4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />],
  plus: ["0 0 16 16", <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />],
  close: ["0 0 20 20", <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />],
  check: ["0 0 16 16", <path d="M3.5 8.4l2.9 2.9 6.1-6.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />],
  x: ["0 0 16 16", <path d="M4.5 4.5l7 7m0-7l-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />],
  alert: ["0 0 16 16", <path d="M8 4.2v4.6M8 11.3v.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />],
  play: ["0 0 16 16", <path d="M5 3.2v9.6L12.6 8z" fill="currentColor" />],
  doc: ["0 0 20 20", <path d="M5 2.5h7l3.5 3.5v11.5H5z M12 2.5V6h3.5 M7.5 10h5 M7.5 13h5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />],
  mail: ["0 0 20 20", <path d="M3 5h14v10.5H3z M3 5.5l7 5.5 7-5.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />],
  chat: ["0 0 20 20", <path d="M3.5 4h13v9h-7l-4 3.5V13h-2z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />],
  book: ["0 0 20 20", <path d="M3 4.5h5c1 0 2 .8 2 2V17c0-.8-.7-1.5-1.5-1.5H3z M17 4.5h-5c-1 0-2 .8-2 2V17c0-.8.7-1.5 1.5-1.5H17z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />],
  checkSquare: ["0 0 20 20", <><rect x="3" y="3" width="14" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M6.8 10.2l2.2 2.2 4.3-4.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>],
  layers: ["0 0 20 20", <path d="M10 3l7 3.6-7 3.6-7-3.6z M3 10.2l7 3.6 7-3.6 M3 13.6l7 3.6 7-3.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />],
  route: ["0 0 20 20", <><circle cx="5" cy="5" r="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="15" cy="15" r="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M7 5h4.5a3 3 0 010 6h-3a3 3 0 000 6H13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></>],
  shield: ["0 0 20 20", <path d="M10 2.5l6 2.5v4.5c0 3.8-2.5 6.7-6 8-3.5-1.3-6-4.2-6-8V5z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />],
  user: ["0 0 20 20", <><circle cx="10" cy="7" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M3.8 17c.8-3.2 3.3-5 6.2-5s5.4 1.8 6.2 5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></>],
  list: ["0 0 20 20", <path d="M7 5.5h10M7 10h10M7 14.5h10M3.5 5.5h.1M3.5 10h.1M3.5 14.5h.1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />],
  trace: ["0 0 20 20", <><circle cx="5" cy="5" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="15" cy="15" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M7 5h4a3 3 0 013 3v4.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2" /></>],
  clock: ["0 0 20 20", <><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M10 6v4.2l2.8 1.8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></>],
  pulse: ["0 0 20 20", <path d="M2 10.5h3.5l2-5 3.5 9 2-4.5H18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />],
  upload: ["0 0 20 20", <path d="M10 13V4M6 7.5l4-4 4 4M4 13.5v2.5h12v-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />]
};
function IconSprite() {
  return <svg width="0" height="0" style={{
    position: "absolute"
  }} aria-hidden="true">{Object.entries(sb).map(([i, [l, r]]) => <symbol key={i} id={`hp-i-${i}`} viewBox={l}>{r}</symbol>)}</svg>;
}
function Icon({
  name: i,
  className: l
}) {
  return <svg className={l} aria-hidden="true"><use href={`#hp-i-${i}`} /></svg>;
}
const jp = "(prefers-reduced-motion: reduce)";
function useReducedMotion() {
  const [i, l] = useState(() => window.matchMedia(jp).matches);
  return useEffect(() => {
    const r = window.matchMedia(jp),
      c = () => l(r.matches);
    return r.addEventListener("change", c), () => r.removeEventListener("change", c);
  }, []), i;
}
function useOnScreen(i, {
  threshold: l = 0.2,
  once: r = false
} = {}) {
  const [c, d] = useState(false);
  return useEffect(() => {
    const h = i.current;
    if (!h) return;
    if (!("IntersectionObserver" in window)) {
      d(true);
      return;
    }
    const m = new IntersectionObserver(([p]) => {
      p.isIntersecting ? (d(true), r && m.disconnect()) : r || d(false);
    }, {
      threshold: l
    });
    return m.observe(h), () => m.disconnect();
  }, [i, l, r]), c;
}
const ib = ["on", "out", "flag", "shake", "dim", "ok"];
function Cg(i, l, r, {
  fade: c = true
} = {}) {
  const d = useReducedMotion();
  useEffect(() => {
    const h = i.current;
    if (!h) return;
    const m = S => h.querySelector(`[data-k="${S}"]`),
      p = l(h);
    let f = [],
      g = false;
    const y = () => {
        f.forEach(clearTimeout), f = [];
      },
      b = () => ib.forEach(S => h.querySelectorAll(`.${S}`).forEach(C => C.classList.remove(S)));
    if (d) {
      h.classList.add("instant"), b(), p.forEach(([, S]) => S(m, true));
      return;
    }
    const w = () => {
        y(), h.classList.add("instant"), b(), h.offsetWidth, h.classList.remove("instant"), c && (h.style.opacity = 1), p.forEach(([S, C]) => f.push(setTimeout(() => C(m, false), S))), c && f.push(setTimeout(() => {
          h.style.opacity = 0;
        }, r - 450)), f.push(setTimeout(w, r)), g = true;
      },
      E = () => {
        y(), g = false, h.style.opacity = 1;
      };
    if (c && (h.style.transition = "opacity .45s ease"), !("IntersectionObserver" in window)) return w(), y;
    const M = new IntersectionObserver(([S]) => {
      S.isIntersecting && !g ? w() : !S.isIntersecting && g && E();
    }, {
      threshold: 0.15
    });
    return M.observe(h), () => {
      M.disconnect(), y();
    };
  }, [d]);
}
function Eg(i, l, r, c = 1) {
  useLayoutEffect(() => {
    const d = i.current;
    if (!d) return;
    const h = () => {
      const p = d.clientWidth;
      if (!p) return;
      const f = +(d.dataset.h || r),
        g = Math.min(c, p / l);
      d.style.height = `${f * g}px`, d.firstElementChild.style.transform = `scale(${g})`;
    };
    h(), d.refit = h;
    const m = "ResizeObserver" in window ? new ResizeObserver(h) : null;
    return m == null || m.observe(d), window.addEventListener("resize", h), () => {
      m == null || m.disconnect(), window.removeEventListener("resize", h);
    };
  }, [i, l, r, c]);
}
const au = [{
    src: "/home/img/color/nucor-skyline.png",
    alt: "Nucor Skyline",
    width: 112,
    height: 34
  }, {
    src: "/home/img/color/american-piping-products.png",
    alt: "American Piping Products",
    width: 115,
    height: 34
  }, {
    src: "/home/img/color/mitsubishi-electric.svg",
    alt: "Mitsubishi Electric",
    width: 95,
    height: 40
  }, {
    src: "/home/img/color/coilplus.png",
    alt: "Coilplus",
    width: 122,
    height: 30
  }, {
    src: "/home/img/color/invera.png",
    alt: "Invera",
    width: 124,
    height: 20
  }, {
    src: "/home/img/color/wilbanks.png",
    alt: "Wilbanks",
    width: 140,
    height: 28
  }],
  lb = "(max-width: 720px)",
  rb = 0.6;
function Hero() {
  const i = useRef(null),
    l = useRef(null),
    r = useRef(null),
    c = useRef(null),
    d = useReducedMotion(),
    h = useOnScreen(i, {
      threshold: 0
    }),
    [m] = useState(() => window.matchMedia(lb).matches ? "/home/media/hero-ribbon-sm.mp4" : "/home/media/hero-ribbon.mp4");
  useLayoutEffect(() => {
    var w;
    const f = i.current,
      g = r.current;
    if (!f || !g) return;
    const y = () => {
      const E = f.parentElement.getBoundingClientRect().top,
        M = Math.round(g.getBoundingClientRect().top - E);
      f.style.height = `${M}px`, f.style.setProperty("--rib-h", `${M}px`), f.style.setProperty("--rib-w", `${f.clientWidth}px`);
    };
    y(), window.addEventListener("resize", y), (w = document.fonts) == null || w.ready.then(y);
    const b = "ResizeObserver" in window ? new ResizeObserver(y) : null;
    return b == null || b.observe(l.current), () => {
      window.removeEventListener("resize", y), b == null || b.disconnect();
    };
  }, []), useEffect(() => {
    var g;
    const f = c.current;
    f && (f.playbackRate = rb, !d && h ? (g = f.play()) == null || g.catch(() => {}) : f.pause());
  }, [d, h]);
  const p = d ? [au] : [au, au];
  return <><div className="rib-clip" ref={i} aria-hidden="true"><video ref={c} className="hero-ribbon" src={m} poster="/home/media/hero-ribbon.jpg" muted={true} loop={true} playsInline={true} preload="auto" /></div><section className="hero" id="hero" ref={l}><div className="wrap hero-in"><p className="ticker">{"Documents processed with Star: "}<span>10M+</span></p><h1 className="hero-h1">{"Turn complex documents into "}<em>trusted, ERP-ready data.</em>{" "}<span>Our AI agents extract and validate MTRs, COAs, Invoices, and POs, flag discrepancies, and deliver verified data directly to your ERP.</span></h1><a className="btn btn-primary btn-lg" href={DEMO_PATH}>Request a demo<Icon name="arr" /></a></div><div className="logos" ref={r}><div className="wrap logos-in"><p className="logos-label">Trusted by teams processing critical business documents</p><div className="logos-mq"><ul className={`logos-list${d ? " is-still" : ""}`} aria-label="Customers">{p.map((f, g) => f.map(y => <li key={`${g}-${y.alt}`} aria-hidden={g > 0 || void 0}><img src={y.src} alt={g > 0 ? "" : y.alt} width={y.width} height={y.height} /></li>))}</ul></div></div></div></section></>;
}
const ob = 1040;
function CUb() {
  const i = useRef(null),
    l = useRef(null),
    r = useOnScreen(i, {
      threshold: 0
    });
  return useLayoutEffect(() => {
    const c = i.current,
      d = () => {
        l.current.style.transform = `scale(${c.clientWidth / ob})`;
      };
    d();
    const h = "ResizeObserver" in window ? new ResizeObserver(d) : null;
    return h == null || h.observe(c), () => h == null ? void 0 : h.disconnect();
  }, []), useEffect(() => {
    var c, d;
    (d = (c = l.current) == null ? void 0 : c.contentWindow) == null || d.postMessage(r ? "play" : "pause", "*");
  }, [r]), <div className="mc-panel mc-flow"><div className="mc-flowhead"><span className="mc-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /><path d="M9 14l2 2 4-4" /></svg></span><div><div className="mc-name">Mill test report</div><div className="mc-meta">Checked against ASTM / ASME, customer asked for anything missing</div></div><span className="mc-botchip"><i />STAR AI BOT</span></div><div className="mc-flowbox" ref={i}><iframe ref={l} src="/home/mtr-flow.html" title="STAR AI BOT checks an MTR against ASTM and ASME and emails the customer about a missing Charpy result" tabIndex={-1} loading="lazy" onLoad={() => {
        var c, d;
        return (d = (c = l.current) == null ? void 0 : c.contentWindow) == null ? void 0 : d.postMessage(r ? "play" : "pause", "*");
      }} /></div></div>;
}
const db = '<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><path d="M2.5 6.5l2.3 2.3L9.5 3.8"/></svg>',
  hb = '<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2.5v4.5M6 9.2v.3"/></svg>',
  mb = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg>',
  fb = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/></svg>',
  pb = '<svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 13a6 6 0 1 1 12 0"/><path d="M9 13l3-4"/></svg>',
  gb = '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></svg>',
  Di = {
    title: "Certificate of analysis",
    label: "COA check",
    items: [{
      chip: "Portal",
      from: "Halden Pharma Ingredients",
      item: "Paracetamol USP",
      id: "Lot PC-24-0917",
      rows: [["Assay", "99.8%, 98.0 to 101.0%", 1], ["Water (KF)", "0.2%, max 0.5%", 1], ["4-Aminophenol", "0.002%, max 0.005%", 1], ["Microbial count (TAMC)", "<10 cfu/g, max 1000", 1], ["Retest date", "12 Sep 2028", 1]],
      done: ["Released", "ok"]
    }, {
      search: "LT-2408-117",
      title: "Cert lookup",
      label: "Lookup",
      word: "found",
      chip: "Search",
      from: "Every cert, PO and order",
      rows: [["Certificate of analysis", "Arden Chemical, 2 pages", 2], ["PO-10510", "Ordered 26 Aug, 800 L", 2], ["Receipt IR-7812", "Received 03 Sep, 4 drums", 2], ["SO-22871", "Shipped to Keystone Fab.", 2]],
      done: ["4 records found", "ok"]
    }, {
      chip: "PDF",
      from: "Arden Chemical",
      item: "Rust preventive oil",
      id: "Lot LT-2408-121",
      rows: [["Viscosity", "31 cSt, 28 to 36", 1], ["Flash point", "176 \xB0C, min 150", 1], ["Expiry date", "Missing", 0], ["QC signature", "Present", 1]],
      done: ["Blocked, supplier asked", "hold"]
    }]
  },
  Ei = i => String(i).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function wp(i) {
  const l = `<div class="mc-head"><span class="mc-icon" aria-hidden="true">${i.search ? mb : fb}</span>
      <div class="mc-who"><div class="mc-name">${i.title || Di.title}</div>
        <div class="mc-meta"><span class="mc-chip">${i.chip}</span><span class="mc-from">${Ei(i.from)}</span></div></div>
      <span class="mc-status"><span class="mc-dots">Reading</span></span></div>`,
    r = i.search ? `<div class="mc-search">${gb}<span class="mc-q"></span><span class="mc-caret"></span></div>` : `<div class="mc-item">${Ei(i.item)}<span class="mc-mono">${Ei(i.id)}</span></div>`,
    c = i.rows.map(d => `<div class="mc-row ${d[2] === 2 ? "info" : d[2] ? "ok" : "fail"}"><span>${Ei(d[0])}</span><span class="v">${Ei(d[1])}</span><span class="mc-mark" aria-hidden="true">${d[2] ? db : hb}</span></div>`).join("");
  return `<div class="mc-body out">${l}${r}<div class="mc-rows">${c}</div>
    <div class="mc-meter-row"><span class="mc-meter-label">${pb}${i.label || Di.label}</span>
      <span class="mc-count"><span class="n">0</span> of ${i.rows.length} ${i.word || "passed"}</span></div>
    <div class="mc-meter"><div class="mc-fill"></div></div></div>`;
}
function CVb() {
  const i = useRef(null),
    l = useReducedMotion(),
    r = useOnScreen(i, {
      threshold: 0.2
    });
  return useEffect(() => {
    const c = i.current;
    if (!c) return;
    let d = 0,
      h = [];
    const m = (g, y) => h.push(setTimeout(g, y)),
      p = g => {
        const y = c.querySelector(".mc-status");
        y.className = `mc-status ${g.done[1]}`, y.textContent = g.done[0];
      },
      f = () => {
        const g = Di.items[d];
        c.innerHTML = wp(g);
        const y = c.querySelector(".mc-body"),
          b = [...y.querySelectorAll(".mc-row")],
          w = y.querySelector(".mc-fill"),
          E = y.querySelector(".n"),
          M = y.querySelector(".mc-q");
        if (l) {
          M && (M.textContent = g.search), y.classList.remove("out"), b.forEach(B => B.classList.add("in", "done"));
          const k = g.rows.filter(B => B[2]).length;
          E.textContent = k, w.style.width = `${k / g.rows.length * 100}%`, p(g);
          return;
        }
        let S = 0;
        const C = g.search ? g.search.length * 90 + 500 : 0;
        M && [...g.search].forEach((k, B) => m(() => {
          M.textContent += k;
        }, 450 + B * 90)), m(() => y.classList.remove("out"), 50);
        const O = g.search ? 380 : 600;
        b.forEach((k, B) => {
          const F = 700 + C + B * O;
          m(() => k.classList.add("in"), F), m(() => {
            k.classList.add("done"), g.rows[B][2] && (S += 1, E.textContent = S), w.style.width = `${(B + 1) / b.length * 100}%`;
          }, F + 380);
        });
        const P = 700 + C + b.length * O + 200;
        m(() => p(g), P), m(() => y.classList.add("out"), P + 2300), m(() => {
          d = (d + 1) % Di.items.length, f();
        }, P + 2700);
      };
    return l || r ? f() : c.innerHTML = wp(Di.items[0]).replace("mc-body out", "mc-body"), () => h.forEach(clearTimeout);
  }, [l, r]), <div className="mc-panel mc-coa" ref={i} aria-label="Certificate of analysis check, animated example" role="img" />;
}
const nu = ["Two-way matching", "Three-way matching", "GL coding", "Department cost splits", "Double-billing checks", "Price variance limits", "Credit note application"],
  yb = [1, 0.45, 0.22, 0],
  xb = 1800;
function CBb() {
  const i = useRef(null),
    l = useReducedMotion(),
    r = useOnScreen(i, {
      threshold: 0.3
    }),
    [c, d] = useState(3);
  useEffect(() => {
    if (!r) return;
    const m = setInterval(() => d(p => (p + 1) % nu.length), l ? 3500 : xb);
    return () => clearInterval(m);
  }, [r, l]);
  const h = nu.length;
  return <div className="aph-left" ref={i}><p className="aph-intro">Let your payables team stop spending hours on:</p><div className="aph-wheel"><ul aria-label="Accounts payable tasks handled automatically">{nu.map((m, p) => {
          const f = (p - c + h + 3) % h - 3;
          return <li key={m} className={`aph-w${f === 0 ? " on" : ""}${f === 3 ? " jump" : ""}`} style={{
            transform: `translateY(${f * 44}px)`,
            opacity: yb[Math.abs(f)]
          }}><span className="aph-dm" aria-hidden="true" /><span>{m}</span></li>;
        })}</ul></div></div>;
}
function CJb() {
  const i = useRef(null);
  return Eg(i, 480, 580), <div className="scene-wrap aph-scene" ref={i}><div className="stage aph-inv" role="img" aria-label="Invoice being processed: payment terms read, due date calculated, early-payment saving found"><div className="aph-sheet aph-s1" /><div className="aph-sheet aph-s2" /><div className="aph-paper"><div className="aph-top"><div className="aph-brand"><i /><b /></div><div className="aph-no">INV-58217</div></div><div className="aph-line" style={{
          width: 120,
          marginTop: 48
        }} /><div className="aph-line aph-light" style={{
          width: 90
        }} /><div className="aph-grid">{[0, 1, 2].map(l => <React.Fragment key={l}><div className="aph-line aph-light" /><div className="aph-rule" /></React.Fragment>)}</div><div className="aph-rule" style={{
          marginTop: 62
        }} />{[0, 1].map(l => <React.Fragment key={l}><div className="aph-cols"><div className="aph-line aph-light" /><div className="aph-line aph-light" /><div className="aph-line aph-light" /><div className="aph-line" /></div><div className="aph-rule" /></React.Fragment>)}</div><div className="aph-pill aph-working"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true" className="aph-spin"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></svg><span>Working out payment date</span></div><div className="aph-card" style={{
        right: -22,
        top: 196
      }}><span>Issued on</span><b>12 Mar 2026</b></div><div className="aph-card" style={{
        left: -22,
        top: 284
      }}><span>Payment terms</span><b>2% if paid in 10 days, net 45</b></div><div className="aph-card" style={{
        right: -22,
        top: 432
      }}><span>Invoice total</span><b className="aph-big">$18,400</b></div><div className="aph-pill aph-saving"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.6 2.5L16 9.5" /></svg><span>Early-pay saving found</span><em>$368</em></div></div></div>;
}
function CWb() {
  return <div className="aph"><CBb /><CJb /></div>;
}
const su = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>,
  Sb = ["Reads every drawing", "Builds the full BOM", "Prices with your rules"],
  Nb = ["No re-keying", "No missed parts", "No margin leaks"];
function Tg() {
  const i = useRef(null),
    l = useReducedMotion(),
    r = useOnScreen(i, {
      threshold: 0.35
    }),
    [c, d] = useState(l ? 9 : 0),
    [h, m] = useState(l ? 44 : 2);
  useEffect(() => {
    if (l || !r) return;
    d(0), m(2);
    const f = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(w => setTimeout(() => d(w), 300 + w * 420)),
      g = performance.now() + 1500;
    let y = 0;
    const b = w => {
      const E = Math.min(1, Math.max(0, (w - g) / 1600));
      m(Math.round(2 + 42 * E)), E < 1 && (y = requestAnimationFrame(b));
    };
    return y = requestAnimationFrame(b), () => {
      f.forEach(clearTimeout), cancelAnimationFrame(y);
    };
  }, [l, r]);
  const p = c >= 5;
  return <div className={`rfw${p ? " sent" : ""}`} ref={i}><p className="rfw-kicker">{"RFQ-to-quote automation "}<span>·</span>{" Star AI bots"}</p><h4 className="rfw-h">{"Never lose a job "}<span>to a faster quote again.</span></h4><p className="rfw-sub">While others are still re-keying drawings, your quote is priced and sent.</p><div className="rfw-flow"><div className={`rfw-card${c >= 1 ? " in" : ""}`}><div className="rfw-top"><span className="rfw-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M3 5h18v14H3z M3.5 5.5l8.5 6.5 8.5-6.5" /></svg></span><div><b>RFQ received</b><small>Drawings + datasheet</small></div></div><div className="rfw-foot"><span className="rfw-time">9:02 AM</span><em>Received</em></div></div><span className={`rfw-arrow${c >= 2 ? " in" : ""}`} aria-hidden="true" /><div className={`rfw-bot${c >= 2 ? " in" : ""}`}><p>Star AI bots<i aria-hidden="true" /></p><ul>{Sb.map((f, g) => <li key={f} className={c >= 2 + g ? "on" : void 0}><span>{su}</span>{f}</li>)}</ul></div><span className={`rfw-arrow${p ? " in" : ""}`} aria-hidden="true" /><div className={`rfw-card rfw-done${p ? " in" : ""}`}><div className="rfw-top"><span className="rfw-ico rfw-ok">{su}</span><div><b>Quote sent</b><small>$179,150 · 42 parts</small></div></div><div className="rfw-foot"><span className="rfw-time rfw-time-on">9:{String(h).padStart(2, "0")}{" AM"}</span><em className="rfw-first">First in</em></div></div></div><div className={`rfw-sum${c >= 6 ? " in" : ""}`}><div className="rfw-ttq"><small>Time to quote</small><p><s>3 days</s><span aria-hidden="true">→</span><b>42 min</b></p></div><ul className="rfw-wins">{Nb.map((f, g) => <li key={f} className={c >= 7 + g ? "on" : void 0}><span>{su}</span>{f}</li>)}</ul><p className="rfw-team">Same team.<b>More wins.</b></p></div></div>;
}
const Pe = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
function Ab() {
  const i = useRef(null),
    l = useReducedMotion(),
    r = useOnScreen(i, {
      threshold: 0.4
    }),
    [c, d] = useState(1);
  return useEffect(() => {
    if (l || !r) return;
    const h = setInterval(() => d(m => m % 3 + 1), 2600);
    return () => clearInterval(h);
  }, [l, r]), <div className="kca-head"><h2 className={`kca ${l ? "all" : `s${c}`}`} ref={i}><span className="k k1"><em>Know</em>{" what\u2019s right."}</span>{" "}<span className="k k2"><em>Catch</em>{" what\u2019s wrong."}</span>{" "}<span className="k k3"><em>Act</em>{" before it becomes a problem."}</span></h2><p className="kca-sub">AI agents verify documents, detect discrepancies and trigger the right action across your workflows and ERP.</p></div>;
}
function Sp({
  className: i,
  artClassName: l,
  icon: r,
  title: c,
  text: d,
  link: h,
  children: m
}) {
  return <article className={`tile ${i}`}><div className="tile-h"><h3 className="agent-h"><span className="agent-ic" aria-hidden="true"><svg viewBox="0 0 24 24">{r}</svg></span>{c}</h3>{d && <p className="tile-p">{d}</p>}{h && (h.href.startsWith("/") ? <Link className="link" to={h.href}>{h.label}<Icon name="arr" /></Link> : <a className="link" href={h.href}>{h.label}<Icon name="arr" /></a>)}</div><div className={`tile-art ${l}`}>{m}</div></article>;
}
function CSr({
  className: i = "",
  hue: l,
  icon: r,
  title: c,
  text: d,
  stat: h,
  link: m,
  children: p
}) {
  return <article className={`agent ${i}`} style={l}><div className="agent-copy"><h3 className="agent-h"><span className="agent-ic" aria-hidden="true"><svg viewBox="0 0 24 24">{r}</svg></span>{c}</h3><p>{d}</p>{h && <p className="agent-stat">{h}</p>}{m.href.startsWith("/") ? <Link className="link" to={m.href}>{m.label}<Icon name="arr" /></Link> : <a className="link" href={m.href}>{m.label}<Icon name="arr" /></a>}</div><div className="agent-ill">{p}</div></article>;
}
const Mb = [{
    top: 30,
    k: "d1",
    amount: "$48,200.00",
    from: "ACH, Halvorsen Marine"
  }, {
    top: 104,
    k: "d2",
    amount: "$12,940.50",
    from: "Check 4471, Ortiz Fabrication"
  }, {
    top: 178,
    k: "d3",
    amount: "$7,615.00",
    from: "Wire, Keel Bay Supply"
  }],
  Cb = [{
    top: 26,
    k: "i1",
    no: "INV-5512",
    amount: "$30,000.00"
  }, {
    top: 82,
    k: "i2",
    no: "INV-5519",
    amount: "$18,200.00"
  }, {
    top: 138,
    k: "i3",
    no: "INV-5530",
    amount: "$12,940.50"
  }, {
    top: 194,
    k: "i4",
    no: "INV-5534",
    amount: "$7,615.00"
  }];
function Eb() {
  const i = useRef(null),
    l = useRef(null);
  return Eg(i, 420, 300), Cg(l, () => {
    const r = (...c) => d => c.forEach(h => d(h).classList.add("on"));
    return [[300, r("d1")], [700, r("p1", "p2")], [1200, r("i1", "i2")], [1800, r("d2")], [2100, r("p3")], [2500, r("i3")], [3100, r("d3")], [3400, r("p4")], [3800, r("i4")], [4400, r("posted")]];
  }, 8500), <div className="scene-wrap" ref={i}><div className="stage cash-stage" ref={l} role="img" aria-label="Animation: three bank deposits are matched to four open invoices and posted."><span className="col-label" style={{
        left: 0
      }}>Bank deposits</span><span className="col-label" style={{
        left: 250
      }}>Open invoices</span>{Mb.map(r => <div key={r.k} className="dep" style={{
        top: r.top
      }} data-k={r.k}><b>{r.amount}</b><span>{r.from}</span></div>)}<svg className="links" viewBox="0 0 420 300" aria-hidden="true"><path pathLength="1" data-k="p1" d="M170 56 C 210 56, 210 46, 250 46" /><path pathLength="1" data-k="p2" d="M170 56 C 210 56, 210 102, 250 102" /><path pathLength="1" data-k="p3" d="M170 130 C 210 130, 210 158, 250 158" /><path pathLength="1" data-k="p4" d="M170 204 C 210 204, 210 214, 250 214" /></svg>{Cb.map(r => <div key={r.k} className="inv-row" style={{
        top: r.top
      }} data-k={r.k}><b>{r.no}</b><span>{r.amount}</span><em>Applied</em></div>)}<div className="posted" data-k="posted"><Icon name="check" />$68,755.50 posted to 4 invoices</div></div></div>;
}
const Np = [{
  doc: "W-9 tax form",
  note: "Tax ID matches the supplier record",
  pill: ["pass", "check", "Verified"]
}, {
  doc: "Bank letter",
  note: "Account holder matches legal name",
  pill: ["pass", "check", "Verified"]
}, {
  doc: "Insurance certificate",
  note: "Valid until 04 Feb 2027",
  pill: ["pass", "check", "Verified"]
}, {
  doc: "ISO 9001 certificate",
  note: "Expired 12 Aug 2026",
  pill: ["review", "mail", "Renewal requested"]
}];
function Tb() {
  const i = useRef(null);
  return Cg(i, l => {
    const r = l.querySelector("[data-count]"),
      c = [[0, () => {
        r.textContent = "0 of 4 checked";
      }]];
    return Np.forEach((d, h) => c.push([500 + h * 750, m => {
      m(`o${h + 1}`).classList.add("on"), r.textContent = `${h + 1} of 4 checked`;
    }])), c;
  }, 8e3), <div className="onb-card" ref={i} role="img" aria-label="Animation: a new supplier's tax form, bank letter and insurance certificate are verified, and a renewal is requested for an expired quality certificate."><div className="onb-head"><span className="onb-av">RS</span><div><b>Ridgeline Steel</b><span>New supplier</span></div><span className="onb-count" data-count={true}>0 of 4 checked</span></div>{Np.map((l, r) => <div key={l.doc} className="onb-row" data-k={`o${r + 1}`}><Icon name="doc" className="dico" /><div><b>{l.doc}</b><span>{l.note}</span></div><span className={`pill ${l.pill[0]}`}><Icon name={l.pill[1]} />{l.pill[2]}</span></div>)}</div>;
}
// "Star also reads": each document as a miniature of its own layout, in the
// page's slate with one accent for what Star picks out.
const DOC_INK = '#cdd3de';
const DOC_DARK = '#8a94a6';
const DOC_ACCENT = '#493ee5';
const Ln = ({ x, y, w, c = DOC_INK, h = 1.6 }) => <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={c} />;
// A sheet with a folded corner; `short` for the receipt's torn edge.
const Sheet = ({ children, torn }) => (
  <svg viewBox="0 0 30 38" aria-hidden="true">
    {torn ? (
      <path d="M6 1.5h18v32l-2.25 1.75L19.5 33.5l-2.25 1.75L15 33.5l-2.25 1.75L10.5 33.5l-2.25 1.75L6 33.5z" fill="#fff" stroke="#c3cad6" strokeLinejoin="round" />
    ) : (
      <>
        <path d="M3.5 1.5h16.5l6.5 6.5v28.5h-23z" fill="#fff" stroke="#c3cad6" strokeLinejoin="round" />
        <path d="M20 1.5V8h6.5" fill="#eef1f6" stroke="#c3cad6" strokeLinejoin="round" />
      </>
    )}
    {children}
  </svg>
);
const Ap = [
  ["Invoices", "Line items, tax and totals", <Sheet><Ln x={6.5} y={5} w={8} c={DOC_DARK} /><Ln x={6.5} y={8.5} w={5} /><rect x={6.5} y={13} width={17} height={2.4} rx={.6} fill="#eef1f6" /><Ln x={6.5} y={17.5} w={10} /><Ln x={19} y={17.5} w={4.5} /><Ln x={6.5} y={20.5} w={8} /><Ln x={19} y={20.5} w={4.5} /><Ln x={6.5} y={23.5} w={9} /><Ln x={19} y={23.5} w={4.5} /><rect x={14.5} y={28} width={9} height={4} rx={1} fill={DOC_ACCENT} opacity={.14} /><Ln x={16} y={29.2} w={6} c={DOC_ACCENT} /></Sheet>],
  ["Receipts", "Merchant, date and amount", <Sheet torn><Ln x={11} y={5} w={8} c={DOC_DARK} /><Ln x={12} y={8.5} w={6} /><Ln x={9} y={13} w={7} /><Ln x={18} y={13} w={3} /><Ln x={9} y={16} w={6} /><Ln x={18} y={16} w={3} /><Ln x={9} y={19} w={8} /><Ln x={18} y={19} w={3} /><path d="M9 22.5h12" stroke={DOC_INK} strokeDasharray="1.2 1.2" /><Ln x={9} y={26} w={5} c={DOC_DARK} /><Ln x={16.5} y={26} w={4.5} c={DOC_ACCENT} /></Sheet>],
  ["Remittances", "Payer and invoices paid", <Sheet><Ln x={6.5} y={5} w={9} c={DOC_DARK} /><Ln x={6.5} y={9} w={13} /><Ln x={6.5} y={12} w={11} /><Ln x={6.5} y={15} w={12} /><path d="M3.5 21h23" stroke="#c3cad6" strokeDasharray="1.4 1.2" /><Ln x={6.5} y={25} w={7} /><Ln x={6.5} y={28.5} w={5} /><rect x={15.5} y={24} width={8} height={6} rx={1} fill={DOC_ACCENT} opacity={.14} /><Ln x={17} y={26.2} w={5} c={DOC_ACCENT} /></Sheet>],
  ["Bank statements", "Transactions and balances", <Sheet><path d="M6.5 7.2l3-1.8 3 1.8z M7 7.8v2.4M9.5 7.8v2.4M12 7.8v2.4M6.5 10.6h6" stroke={DOC_DARK} strokeWidth={.9} fill="none" strokeLinejoin="round" /><Ln x={15} y={6.5} w={8} /><Ln x={6.5} y={15} w={9} /><Ln x={19.5} y={15} w={4} c={DOC_ACCENT} /><Ln x={6.5} y={18.5} w={7} /><Ln x={19.5} y={18.5} w={4} /><Ln x={6.5} y={22} w={10} /><Ln x={19.5} y={22} w={4} c={DOC_ACCENT} /><Ln x={6.5} y={25.5} w={8} /><Ln x={19.5} y={25.5} w={4} /><path d="M6.5 29.5h17" stroke={DOC_INK} strokeWidth={.8} /><Ln x={17} y={31.2} w={6.5} c={DOC_DARK} /></Sheet>],
  ["ACORD insurance forms", "Policy, insured and limits", <Sheet><Ln x={6.5} y={5} w={6} c={DOC_DARK} /><rect x={15} y={4} width={8.5} height={3.6} rx={.6} fill="none" stroke={DOC_INK} strokeWidth={.8} /><g fill="none" stroke={DOC_INK} strokeWidth={.8}><rect x={6.5} y={11} width={8} height={4.5} rx={.5} /><rect x={15.5} y={11} width={8} height={4.5} rx={.5} /><rect x={6.5} y={17} width={17} height={4.5} rx={.5} /><rect x={6.5} y={23} width={5.2} height={4.5} rx={.5} /><rect x={12.4} y={23} width={5.2} height={4.5} rx={.5} /></g><rect x={18.3} y={23} width={5.2} height={4.5} rx={.5} fill={DOC_ACCENT} opacity={.14} stroke={DOC_ACCENT} strokeWidth={.8} /><path d="M7.5 30.8l1 1 2-2.2" stroke={DOC_ACCENT} strokeWidth={1} fill="none" strokeLinecap="round" strokeLinejoin="round" /><Ln x={12} y={30.4} w={8} /></Sheet>],
  ["Bills of lading", "Shipper, consignee and cargo", <Sheet><Ln x={6.5} y={5} w={7} c={DOC_DARK} /><g fill="none" stroke={DOC_INK} strokeWidth={.8}><rect x={6.5} y={9.5} width={8} height={7} rx={.5} /><rect x={15.5} y={9.5} width={8} height={7} rx={.5} /><rect x={6.5} y={17.5} width={17} height={8} rx={.5} /></g><Ln x={7.8} y={11.3} w={4} /><Ln x={16.8} y={11.3} w={4} /><Ln x={7.8} y={19.5} w={9} /><Ln x={7.8} y={22.5} w={6} /><path d="M16.5 23.8h5.5l-1 1.7h-3.5z M18 23.8v-2.3h2.5v2.3" stroke={DOC_ACCENT} strokeWidth={.8} fill="none" strokeLinejoin="round" /><path d="M7 31.5c1.2-1.6 2.2-1.6 2.8 0s1.6 1.6 2.8-.4" stroke={DOC_DARK} strokeWidth={.8} fill="none" strokeLinecap="round" /><Ln x={16} y={31} w={7.5} /></Sheet>],
  ["Transcripts", "Courses, grades and credits", <Sheet><Ln x={6.5} y={5} w={9} c={DOC_DARK} /><Ln x={6.5} y={8.5} w={6} /><Ln x={6.5} y={13} w={10} /><Ln x={20} y={13} w={3.5} c={DOC_ACCENT} /><Ln x={6.5} y={16.5} w={8} /><Ln x={20} y={16.5} w={3.5} c={DOC_ACCENT} /><Ln x={6.5} y={20} w={11} /><Ln x={20} y={20} w={3.5} c={DOC_ACCENT} /><Ln x={6.5} y={23.5} w={7} /><Ln x={20} y={23.5} w={3.5} c={DOC_ACCENT} /><circle cx={9.5} cy={30} r={2.6} fill="none" stroke={DOC_DARK} strokeWidth={.8} /><circle cx={9.5} cy={30} r={1.3} fill="none" stroke={DOC_DARK} strokeWidth={.6} /><Ln x={15} y={30.2} w={8.5} /></Sheet>],
  ["Tax returns", "Income, deductions and IDs", <Sheet><rect x={6.5} y={4} width={5.5} height={4.5} rx={.6} fill={DOC_DARK} opacity={.85} /><Ln x={13.5} y={4.6} w={7} c={DOC_DARK} /><Ln x={13.5} y={7.2} w={5} /><g fill="none" stroke={DOC_INK} strokeWidth={.8}><rect x={6.5} y={12} width={11} height={3.6} rx={.4} /><rect x={6.5} y={17} width={11} height={3.6} rx={.4} /><rect x={6.5} y={22} width={11} height={3.6} rx={.4} /></g><rect x={18.5} y={12} width={5} height={3.6} rx={.4} fill="none" stroke={DOC_INK} strokeWidth={.8} /><rect x={18.5} y={17} width={5} height={3.6} rx={.4} fill="none" stroke={DOC_INK} strokeWidth={.8} /><rect x={18.5} y={22} width={5} height={3.6} rx={.4} fill={DOC_ACCENT} opacity={.14} stroke={DOC_ACCENT} strokeWidth={.8} /><Ln x={6.5} y={29.5} w={9} /><Ln x={6.5} y={32} w={6} /></Sheet>],
  ["Utility bills", "Account, usage and charges", <Sheet><Ln x={6.5} y={5} w={8} c={DOC_DARK} /><Ln x={6.5} y={8.5} w={11} /><path d="M6.5 22h17" stroke={DOC_INK} strokeWidth={.8} /><g fill={DOC_INK}><rect x={7.5} y={18} width={2} height={4} rx={.4} /><rect x={10.5} y={16} width={2} height={6} rx={.4} /><rect x={13.5} y={17} width={2} height={5} rx={.4} /><rect x={16.5} y={14.5} width={2} height={7.5} rx={.4} /></g><rect x={19.5} y={13} width={2} height={9} rx={.4} fill={DOC_ACCENT} /><Ln x={6.5} y={26.5} w={8} /><Ln x={6.5} y={29.5} w={6} /><Ln x={17} y={29.5} w={6.5} c={DOC_ACCENT} /></Sheet>],
  ["Balance sheets", "Assets, liabilities and equity", <Sheet><Ln x={10} y={5} w={10} c={DOC_DARK} /><Ln x={6.5} y={10.5} w={6} c={DOC_DARK} /><Ln x={15.5} y={10.5} w={6} c={DOC_DARK} /><Ln x={6.5} y={14} w={7} /><Ln x={15.5} y={14} w={7} /><Ln x={6.5} y={17} w={5.5} /><Ln x={15.5} y={17} w={6} /><Ln x={6.5} y={20} w={6.5} /><Ln x={15.5} y={20} w={5} /><path d="M6.5 24h7.5M15.5 24h8" stroke={DOC_INK} strokeWidth={.8} /><Ln x={9} y={26} w={5} c={DOC_ACCENT} /><Ln x={18.5} y={26} w={5} c={DOC_ACCENT} /><path d="M9 28.6h5M9 29.6h5M18.5 28.6h5M18.5 29.6h5" stroke={DOC_ACCENT} strokeWidth={.5} /></Sheet>]
];
function Solutions() {
  const i = useReducedMotion();
  return <section className="sec sec-soft" id="solutions"><div className="wrap"><Ab /><div className="bento"><Sp className="t-wide hue-tile hue-mtr" artClassName="art-mc" icon={<><path d="M6 3h8l4 4v14H6z M14 3v4h4" {...Pe} /><path d="M9 14l2 2 4-4" {...Pe} /></>} title="Mill test reports (MTR)" text="Chemistry, mechanical properties, heat numbers and grades verified against ASTM, ASME, API and EN, plus the requirements on your customer's PO." link={{
          href: "/mtr-automation",
          label: "Explore MTR verification"
        }}><CUb /></Sp><Sp className="t-narrow hue-tile hue-coa" artClassName="art-mc" icon={<><path d="M9 3h6M10 3v6l-5 9a2 2 0 001.8 3h10.4a2 2 0 001.8-3l-5-9V3" {...Pe} /><path d="M7.5 15h9" {...Pe} /></>} title="Certificates of analysis (COA)" text="A COA can say pass and still fail your requirements. Star checks every result against your specification, not just the supplier's." link={{
          href: "/coa-automation",
          label: "Explore COA verification"
        }}><CVb /></Sp><CSr className="agent-ap" icon={<path d="M6 3h12v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4z M9 8h6M9 11.5h6M9 15h3.5" {...Pe} />} title="Accounts payable" text="Invoices matched, coded and checked before anyone on your team opens them." link={{
          href: "https://starsoftware.co/ap-automation/",
          label: "Explore AP automation"
        }}><CWb /></CSr><CSr className="agent-cash" icon={<><rect x="2.5" y="6" width="19" height="12" rx="2.5" {...Pe} /><circle cx="12" cy="12" r="2.6" {...Pe} /><path d="M6 9.5v5M18 9.5v5" {...Pe} /></>} title="Cash application" text="Deposits and remittances matched to open invoices, so cash posts the day it lands." stat={<><b>Almost 90%</b>{" of receivables work automated"}</>} link={{
          href: "https://starsoftware.co/ar-automation/",
          label: "Explore cash application"
        }}><Eb /></CSr><CSr className="agent-onb" icon={<><circle cx="10" cy="8" r="3.4" {...Pe} /><path d="M3.5 19.5c.7-3.4 3.3-5.3 6.5-5.3 1.4 0 2.6.3 3.6.9M15.5 17.5l2 2 4-4.5" {...Pe} /></>} title="Supplier onboarding" text="Supplier documents collected, checked and filed, without the chase emails." stat={<><b>Over 50%</b>{" less time spent on manual review"}</>} link={{
          href: "https://starsoftware.co/kyc-verification-automation/",
          label: "Explore supplier onboarding"
        }}><Tb /></CSr><CSr className="agent-rfq agent-full" icon={<><path d="M4 20V8l4-4h12v16z M8 4v4H4 M8 12.5h8M8 16h5" {...Pe} /><path d="M16.5 15.5l1.6 1.6 2.9-3.2" {...Pe} /></>} title="RFQ to quote" text="Every drawing and datasheet in the RFQ read, the bill of materials built and priced with your rules, while competitors are still re-keying." stat={<><b>42 minutes</b>{" to quote, down from 3 days"}</>} link={{
          href: "/rfq-to-quote",
          label: "Explore RFQ to quote"
        }}><Tg /></CSr></div><div className={`doc-types${i ? " is-still" : ""}`}><div className="dt-copy"><p className="dt-k">Star also reads</p><p className="dt-h">Every other document your teams handle.</p></div><div className="dt-rows">{[Ap.slice(0, 5), Ap.slice(5)].map((l, r) => <div key={r} className={`dt-row${r ? " rev" : ""}`}><ul>{(i ? [l] : [l, l, l, l]).map((c, d) => c.map(([h, m, p]) => <li key={`${d}-${h}`} aria-hidden={d > 0 || void 0}><span className="dt-thumb">{p}</span><span className="dt-txt"><b>{h}</b><small>{m}</small></span></li>))}</ul></div>)}</div></div></div></section>;
}
function Rg({
  src: i,
  poster: l,
  label: r,
  preload: c = "metadata",
  className: d
}) {
  const h = useRef(null),
    m = useReducedMotion(),
    p = useOnScreen(h, {
      threshold: 0.25
    });
  return useEffect(() => {
    var g;
    const f = h.current;
    !f || m || (p ? (f.preload === "none" && (f.preload = "auto"), (g = f.play()) == null || g.catch(() => {})) : f.pause());
  }, [p, m]), <video ref={h} className={d} src={i} poster={l} muted={true} loop={true} playsInline={true} preload={c} controls={m} aria-label={r} />;
}
function OrderAutomation({
  onWatch: i
}) {
  const l = useRef(null),
    r = useReducedMotion(),
    c = useOnScreen(l, {
      threshold: 0.5,
      once: true
    });
  return <section className="sec" id="order-automation"><div className="wrap"><h2 className={`oa-h${c || r ? " in" : ""}`} ref={l}><span className="oa-k"><i aria-hidden="true" />AI Order Automation:</span>From{" "}<span className="oa-po"><Icon name="mail" />Customer PO</span><span className="oa-flow" aria-hidden="true"><i /></span><span className="oa-to">to</span>{" "}<span className="oa-so">Approved Sales Order<Icon name="check" className="oa-ok" /></span></h2><div className="oa-body"><p className="oa-p">When a customer's purchase order arrives by email, the AI agent reads both the email and the attached PO and pulls out the customer, part numbers, quantities, requested price, delivery date and any special instructions. It maps the customer's part numbers to your items, then checks the order against every source that matters: contract history, inventory and incoming supply, credit limits, sales rep emails, your order policy, the customer's onboarding documents and your discount rules. It reads the actual clauses in those documents, such as volume discounts, payment terms, free-freight thresholds, approval limits, tax-exemption expiry dates and certification requirements. It then works out the best price that policy allows, without stacking discounts that can't be combined. Finally, it recommends a clear action, such as “create the order with conditions,” and lists the findings, cites the source for each decision and sends exceptions like pricing or credit approvals to the right person. Your team only steps in where judgment is needed, and every decision is explained.</p><button className="btn btn-primary btn-lg" type="button" onClick={i}><Icon name="play" className="i-play" />Watch how it decides</button></div><div className="showcase"><div className="sc-frame"><div className="sc-bar"><i /><i /><i /><span>Order Automation – How the AI decides</span></div><Rg src="/home/media/order-automation.mp4" poster="/home/media/order-automation.jpg" preload="none" label="Video: a customer PO arrives by email, the AI agent gathers context from eight sources, reads the order policy and onboarding documents, works out pricing and discounts, then recommends a decision with every source cited." /><button className="sc-play" type="button" onClick={i} aria-label="Watch full screen"><Icon name="expand" /></button></div><div className="callout c1"><b>PO intake</b><span>Reads the email body and the attached PDF</span><code>PO 45821 · 316L tube · 5,020 ft · $14.82/ft</code></div><div className="callout c2"><b>Context</b><span>Eight sources checked in parallel</span><code>contract · inventory · credit · policy · onboarding</code></div><div className="callout c3"><b>Decision</b><span>A clear action, with every source cited</span><code>create order with conditions · Order_Policy §3.1</code></div></div><div className="feats"><div className="feat"><span className="ico"><Icon name="mail" /></span><p><b>Reads every PO.</b>{" Email body and attached PDF, with each field traced to where it came from."}</p></div><div className="feat"><span className="ico"><Icon name="layers" /></span><p><b>Applies your policy.</b>{" Contract pricing, volume discounts, freight rules and approval limits, with no stacked discounts."}</p></div><div className="feat"><span className="ico"><Icon name="route" /></span><p><b>Explains every decision.</b>{" Findings with cited sources, and exceptions routed to the right person."}</p></div></div></div></section>;
}
function WorkflowStudio() {
  return <section className="sec sec-soft" id="workflow-studio"><div className="wrap"><h2 className="wfs-h"><span className="oa-k"><i aria-hidden="true" />Workflow Studio</span>{"Don\u2019t build workflows. "}<span className="wfs-grad">Just tell AI what to do.</span></h2><div className="showcase wfs-showcase"><div className="sc-frame"><div className="sc-bar"><i /><i /><i /><span>Workflow studio</span></div><Rg className="wfs-video" src="/home/media/workflow-studio.mp4" poster="/home/media/workflow-studio-poster.jpg" preload="none" label="Workflow Studio: an MTR workflow is typed in plain words and Star builds the steps: classify, extract heat number and test results, check them, then route for approval." /></div></div></div></section>;
}
const Ti = [{
    id: "soc2",
    name: "SOC 2 Type II",
    color: "#2B6FD6",
    accent: "#BFD0FF",
    logo: "/home/img/compliance/soc2.webp",
    desc: "Independently audited security controls, reviewed every year.",
    lede: "Our controls are tested over a full observation period, not on a single day.",
    facts: [["Scope", "Security, availability and confidentiality"], ["Assessed by", "Independent CPA firm"], ["Observation", "12-month window"], ["Renewal", "Every year"]],
    cta: "Request the report",
    note: "Shared under NDA",
    ref: "STR-SOC2-2026"
  }, {
    id: "gdpr",
    name: "GDPR",
    color: "#003399",
    accent: "#F2C53D",
    logo: "/home/img/compliance/gdpr.webp",
    desc: "Personal data handled in line with EU data protection law.",
    lede: "Personal data in your documents is processed lawfully, minimally and only on your instruction.",
    facts: [["Covers", "Personal data in certificates, invoices and supplier records"], ["Data residency", "EU hosting available"], ["Your rights", "Access, export and deletion on request"], ["Agreement", "DPA with standard contractual clauses"]],
    cta: "Get the DPA",
    note: "Signed in minutes",
    ref: "STR-GDPR-2026"
  }, {
    id: "iso",
    name: "ISO 27001",
    color: "#1E5AA8",
    accent: "#C9D3E2",
    logo: "/home/img/compliance/iso27001.webp",
    desc: "An information security management system to the global standard.",
    lede: "Security is run as a managed system with owners, risk reviews and continual improvement.",
    facts: [["Scope", "Product, engineering and support"], ["Certified by", "Accredited certification body"], ["Certificate", "3-year cycle"], ["Surveillance", "Audited every year"]],
    cta: "Download the certificate",
    note: "Publicly verifiable",
    ref: "STR-ISO-27001"
  }, {
    id: "hipaa",
    name: "HIPAA",
    color: "#3B5BA5",
    accent: "#D6CCFF",
    logo: "/home/img/compliance/hipaa.webp",
    desc: "Safeguards for protected health information, with a BAA on request.",
    lede: "Administrative, physical and technical safeguards protect any health information you process.",
    facts: [["Safeguards", "Administrative, physical and technical"], ["Encryption", "In transit and at rest"], ["Access", "Logged and role-based"], ["Agreement", "BAA available on request"]],
    cta: "Request a BAA",
    note: "For healthcare customers",
    ref: "STR-HIPAA-2026"
  }],
  qb = "#contact",
  kg = 600,
  zb = 700,
  Db = Array.from({
    length: 34
  }, (i, l) => {
    let r = "";
    for (let c = 0; c <= kg; c += 4) {
      const d = 14 + l * 20 + 11 * Math.sin(c / 38 + l * 0.45) + 5 * Math.sin(c / 15 - l * 0.9);
      r += `${c ? "L" : "M"}${c},${d.toFixed(1)}`;
    }
    return r;
  }),
  Lb = Array.from({
    length: 6
  }, (i, l) => {
    let r = "";
    for (let c = 0; c <= 720; c++) {
      const d = c / 720 * Math.PI * 2,
        h = 97 + 7 * Math.sin(22 * d + l * (Math.PI / 6.5));
      r += `${c ? "L" : "M"}${(h * Math.cos(d)).toFixed(2)},${(h * Math.sin(d)).toFixed(2)}`;
    }
    return `${r}Z`;
  }),
  _b = 180;
function Compliance() {
  const i = useReducedMotion(),
    [l, r] = useState(0),
    [c, d] = useState(0),
    [h, m] = useState(false),
    [p, f] = useState(0),
    g = useRef(null),
    y = useRef(null);
  useEffect(() => () => clearTimeout(y.current), []);
  const b = (S, C) => {
      if (S !== l) {
        if (r(S), C && g.current.children[S].focus(), clearTimeout(y.current), i) {
          d(S);
          return;
        }
        m(true), y.current = setTimeout(() => {
          d(S), m(false), f(O => O + 1);
        }, _b);
      }
    },
    w = S => {
      const C = {
        ArrowDown: 1,
        ArrowRight: 1,
        ArrowUp: -1,
        ArrowLeft: -1
      }[S.key];
      let O = null;
      C && (O = (l + C + Ti.length) % Ti.length), S.key === "Home" && (O = 0), S.key === "End" && (O = Ti.length - 1), O !== null && (S.preventDefault(), b(O, true));
    },
    E = Ti[c],
    M = `INDEPENDENTLY VERIFIED \u2022 ${E.name.toUpperCase()} \u2022 `.repeat(2);
  return <section className="sec cp" id="compliance" aria-labelledby="cp-title"><div className="wrap cp-grid"><div><p className="cp-kicker"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l7 3v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>Enterprise security</p><h2 className="cp-h" id="cp-title">Compliance you can show your auditors.</h2><p className="cp-intro">Certificates, invoices and supplier records carry sensitive data. Star is built and audited to the standards your security and compliance teams expect.</p><div className="cp-tabs" role="tablist" aria-label="Compliance standards" aria-orientation="vertical" ref={g} onKeyDown={w}>{Ti.map((S, C) => <button key={S.id} type="button" role="tab" id={`cp-tab-${S.id}`} className="cp-std" aria-selected={C === l} aria-controls="cp-panel" tabIndex={C === l ? 0 : -1} style={{
            "--c": S.color
          }} onClick={() => b(C)}><span className="cp-dot" aria-hidden="true"><img src={S.logo} alt="" /></span><span><span className="cp-name">{S.name}</span><span className="cp-desc">{S.desc}</span></span><svg className="cp-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg></button>)}</div></div><article className="cp-cert" role="tabpanel" id="cp-panel" aria-labelledby={`cp-tab-${E.id}`} aria-live="polite" style={{
        "--seal": E.color,
        "--seal-accent": E.accent
      }}><svg className="cp-guil" viewBox={`0 0 ${kg} ${zb}`} preserveAspectRatio="none" aria-hidden="true">{Db.map(S => <path key={S} d={S} />)}</svg><div className={`cp-head cp-swap${h ? " is-out" : ""}`}><span><strong>Star Software</strong>{" \xB7 Compliance record"}</span><span className="cp-ref">{"Ref. "}{E.ref}</span></div><div className="cp-seal-wrap"><svg key={p} className={`cp-seal${p ? " is-stamp" : ""}`} viewBox="-110 -110 220 220" role="img" aria-label={`${E.name} seal`}><g className="cp-rosette">{Lb.map(S => <path key={S} d={S} />)}</g><defs><path id="cp-ringpath" d="M 0,0 m -79,0 a 79,79 0 1,1 158,0 a 79,79 0 1,1 -158,0" /></defs><circle className="cp-ring" r="86" /><circle className="cp-ring" r="70" /><text className="cp-ringtext"><textPath href="#cp-ringpath" startOffset="0">{M}</textPath></text><circle className="cp-core" r="64" /><image href={E.logo} x="-56" y="-56" width="112" height="112" preserveAspectRatio="xMidYMid meet" /></svg></div><div className={`cp-swap${h ? " is-out" : ""}`}><h3>{E.name}</h3><p className="cp-lede">{E.lede}</p><dl className="cp-facts">{E.facts.map(([S, C]) => <div key={S}><dt>{S}</dt><dd>{C}</dd></div>)}</dl><div className="cp-foot"><a className="cp-btn" href={qb}><span>{E.cta}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v12M6 10l6 6 6-6M5 20h14" /></svg></a><span className="cp-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg><span>{E.note}</span></span></div></div></article></div></section>;
}
const Mp = [{
    value: "10M+",
    label: "documents processed for customers"
  }, {
    value: "80%+",
    label: "of documents handled with minimal manual work"
  }, {
    value: "98%",
    label: "target field-extraction accuracy"
  }, {
    value: "~90%",
    label: "of receivables work automated"
  }],
  Ub = ["73,62,229", "99,91,255", "60,215,255"];
function Bb() {
  const i = useRef(null),
    l = useReducedMotion(),
    r = useOnScreen(i, {
      threshold: 0
    }),
    c = useRef({
      rays: [],
      width: 0,
      height: 0,
      dpr: 1
    }),
    d = h => {
      const m = i.current,
        {
          rays: p,
          width: f,
          height: g,
          dpr: y
        } = c.current,
        b = m.getContext("2d");
      b.setTransform(y, 0, 0, y, 0, 0), b.clearRect(0, 0, f, g);
      const w = f / 2,
        E = g + 6,
        M = b.createRadialGradient(w, E, 0, w, E, Math.min(f * 0.55, g * 1.7));
      M.addColorStop(0, "rgba(99,91,255,.34)"), M.addColorStop(0.55, "rgba(60,215,255,.08)"), M.addColorStop(1, "rgba(248,249,255,0)"), b.fillStyle = M, b.fillRect(0, 0, f, g), p.forEach(S => {
        const C = S.len * (0.92 + 0.08 * Math.sin(h * S.sp + S.ph)),
          O = w - Math.cos(S.a) * C,
          P = E - Math.sin(S.a) * C,
          k = b.createLinearGradient(w, E, O, P);
        k.addColorStop(0, `rgba(${S.colour},.9)`), k.addColorStop(1, `rgba(${S.colour},.15)`), b.strokeStyle = k, b.lineWidth = S.w, b.beginPath(), b.moveTo(w, E), b.lineTo(O, P), b.stroke(), S.dot && (b.fillStyle = `rgba(${S.colour},.85)`, b.beginPath(), b.arc(O, P, S.w > 1 ? 2.6 : 1.8, 0, Math.PI * 2), b.fill());
      });
    };
  return useEffect(() => {
    const h = i.current,
      m = () => {
        const p = Math.min(2, window.devicePixelRatio || 1),
          f = h.clientWidth,
          g = h.clientHeight;
        h.width = f * p, h.height = g * p;
        const y = f < 600 ? 120 : 230,
          b = Math.min(f * 0.48, g * 0.97),
          w = Array.from({
            length: y
          }, () => {
            const E = Math.random();
            return {
              a: Math.PI * (0.03 + 0.94 * Math.random()),
              len: b * (0.35 + 0.65 * Math.pow(Math.random(), 0.6)),
              w: Math.random() < 0.15 ? 1.4 : 0.7,
              dot: Math.random() < 0.55,
              ph: Math.random() * 6.28,
              sp: 0.4 + Math.random() * 0.8,
              colour: Ub[E < 0.6 ? 0 : E < 0.85 ? 1 : 2]
            };
          });
        c.current = {
          rays: w,
          width: f,
          height: g,
          dpr: p
        }, d(0);
      };
    return m(), window.addEventListener("resize", m), () => window.removeEventListener("resize", m);
  }, []), useEffect(() => {
    if (l || !r) return;
    let h = 0,
      m = null;
    const p = f => {
      m === null && (m = f), d((f - m) / 1e3), h = requestAnimationFrame(p);
    };
    return h = requestAnimationFrame(p), () => cancelAnimationFrame(h);
  }, [l, r]), <canvas className="burst" ref={i} aria-hidden="true" />;
}
function Scale() {
  const i = useRef(null),
    l = useReducedMotion(),
    r = useOnScreen(i, {
      threshold: 0.5
    }),
    [c, d] = useState(0),
    [h, m] = useState(false);
  return useEffect(() => {
    if (l || h || !r) return;
    const p = setInterval(() => d(f => (f + 1) % Mp.length), 2600);
    return () => clearInterval(p);
  }, [l, h, r]), <section className="sec sec-soft stats-sec" id="scale"><div className="wrap"><h2 className="stats-h">The engine behind<br />{" document-heavy operations"}</h2></div><div className="stats-band"><div className="wrap"><dl className="stats" ref={i}>{Mp.map((p, f) => <div key={p.value} className={f === c ? "is-on" : void 0} onMouseEnter={() => {
            m(true), d(f);
          }}><dt>{p.value}</dt><dd>{p.label}</dd></div>)}</dl><span className="stats-line" aria-hidden="true" style={{
          "--k": c
        }}><i /></span></div></div><Bb /></section>;
}
const Gb = [{
    mark: "N",
    color: "#1f6fb2",
    title: "Nucor Skyline cuts manual handling across financial operations with invoice automation.",
    body: "Invoice capture, matching and approval moved out of inboxes and spreadsheets into one automated flow.",
    href: "https://starsoftware.co/our-story/success-story-nucor-skyline-transforms-financial-operations-with-invoice-automation/"
  }, {
    mark: "F",
    color: "#493ee5",
    title: "Friedman Steel processes 3,000+ invoices a month, faster and more accurately.",
    body: "Payment automation that keeps up with monthly invoice volume without adding headcount.",
    href: "https://starsoftware.co/our-story/friedman-steel-streamlines-payments-with-automation-solution/"
  }, {
    mark: "A",
    color: "#00647a",
    title: "Apollo Scientific transforms high-volume accounts payable with AP automation.",
    body: "High-volume invoice processing in accounts payable, with matching and coding handled by Star.",
    href: "https://starsoftware.co/our-story/success-story-apollo-scientific-transforms-operations-with-ap-automation/"
  }],
  Ib = [{
    icon: "checkSquare",
    title: "Readiness assessment.",
    text: "A 5-minute, 12-question diagnostic that shows where your MTR and COA process stands today.",
    file: "/home/downloads/star-mtr-coa-readiness-assessment.pdf"
  }, {
    icon: "book",
    title: "MTR and COA buyer's guide.",
    text: "Standards complexity, validation, traceability and a 20-point vendor evaluation checklist.",
    file: "/home/downloads/star-mtr-coa-buyers-guide.pdf"
  }, {
    icon: "layers",
    title: "Enterprise guide to IDP.",
    text: "The six layers that turn documents into trusted, decision-ready data, from intake to ERP.",
    file: "/home/downloads/star-enterprise-guide-idp.pdf"
  }],
  Qb = [{
    name: "Steel and metals",
    text: "MTRs and COAs checked against ASTM and ASME, heat numbers traced to inventory.",
    img: "/home/img/photos/hero-coils.webp",
    href: "https://starsoftware.co/test-certificate-automation-for-steel-service-centers-a-complete-guide/"
  }, {
    name: "Pharma and chemicals",
    text: "Lab results checked against your specification, not just the supplier's limits.",
    img: "/home/img/photos/pharma-lab.webp",
    href: "https://starsoftware.co/coa-processing-pharma-chemical/"
  }, {
    name: "Manufacturing",
    text: "Certificates, drawings and supplier invoices flowing straight into quality and ERP.",
    img: "/home/img/photos/foundry.webp",
    href: "https://starsoftware.co/how-intelligent-document-processing-is-redefining-quality-assurance-in-manufacturing/"
  }, {
    name: "Construction",
    text: "Mill certificates and submittals verified before material reaches the site.",
    img: "/home/img/photos/qa-inspector.webp",
    href: "https://starsoftware.co/the-importance-of-mill-test-certificates-in-construction-steel/"
  }, {
    name: "Financial services",
    text: "Identity documents, statements and tax forms checked for audit-ready KYC.",
    img: "/home/img/photos/paper-stack.webp",
    href: "https://starsoftware.co/the-role-of-idp-in-audit-ready-kyc-processes/"
  }, {
    name: "Healthcare",
    text: "Invoices and insurance forms processed with the controls compliance expects.",
    img: "/home/img/photos/reviewing-forms.webp",
    href: "https://starsoftware.co/how-ap-automation-helps-healthcare-companies-ensure-regulatory-compliance/"
  }],
  an = [{
    id: "q1",
    photo: "/home/img/photos/steel-tubes.webp",
    quote: "In our business, the test certificate is the value of our product, so maintaining traceability is critical. The software Star developed to read the certificate and map that output to the Quality Data System in our ERP makes the data very accessible to all of our users.",
    name: "John Consolino",
    role: "Director of Purchasing, American Piping Products",
    logo: {
      src: "/home/img/color/american-piping-products.png",
      width: 115,
      height: 34
    }
  }, {
    id: "q2",
    photo: "/home/img/photos/coils-close.webp",
    quote: "Star Software was able to not only create our forms and tags, but their software allowed us to add additional fields not available out of the box. That proved to be the difference between a good implementation and a great one.",
    name: "David Kirkland",
    role: "General Manager of IT, Coilplus",
    logo: {
      src: "/home/img/color/coilplus.png",
      width: 122,
      height: 30
    }
  }, {
    id: "q3",
    photo: "/home/img/photos/reviewing-forms.webp",
    quote: "Star Automation is a game changer. Best in class invoice data extraction. High accuracy, easy to implement, excellent support team!",
    name: "Carly Malone",
    role: "Application Manager"
  }],
  Fb = 8e3;
function Vb() {
  const [i, l] = useState(-1);
  return <div className="acc">{Gb.map((r, c) => <div key={r.mark} className={`acc-i${i === c ? " open" : ""}`}><button type="button" aria-expanded={i === c} onClick={() => l(i === c ? -1 : c)}><span className="acc-mk" style={{
          "--c": r.color
        }}>{r.mark}</span><span className="acc-t">{r.title}</span><i><Icon name="plus" /></i></button><div className="acc-b"><div className="acc-b-in"><p>{r.body}</p><a className="link" href={r.href}>Read the story<Icon name="arr" /></a></div></div></div>)}</div>;
}
function Yb() {
  const i = useRef(null),
    l = useReducedMotion(),
    r = c => {
      const d = i.current,
        h = d.firstElementChild.getBoundingClientRect().width + 16;
      d.scrollBy({
        left: h * c,
        behavior: l ? "auto" : "smooth"
      });
    };
  return <><div className="car-nav"><button type="button" className="car-b" aria-label="Previous" onClick={() => r(-1)}><Icon name="left" /></button><button type="button" className="car-b" aria-label="Next" onClick={() => r(1)}><Icon name="right" /></button></div><div className="car" ref={i}>{Qb.map(c => <a key={c.name} className="car-i" href={c.href}><span className="car-img"><img src={c.img} alt="" width="1600" height="1067" loading="lazy" /><b>{c.name}</b></span><span className="car-t">{c.text}</span><span className="link">{"Explore "}{c.name.toLowerCase()}<Icon name="arr" /></span></a>)}</div></>;
}
function Pb() {
  const i = useRef(null),
    l = useRef(null),
    r = useRef(null),
    c = useReducedMotion(),
    d = useOnScreen(i, {
      threshold: 0.35
    }),
    [h, m] = useState(0),
    [p, f] = useState(false),
    g = !c && !p && d;
  useEffect(() => {
    if (!g) return;
    const M = setInterval(() => m(S => (S + 1) % an.length), Fb);
    return () => clearInterval(M);
  }, [g]);
  const y = (M, S) => {
      f(true), m(M), S && l.current.children[M].focus();
    },
    b = (M, S) => {
      const C = {
        ArrowRight: 1,
        ArrowDown: 1,
        ArrowLeft: -1,
        ArrowUp: -1
      }[M.key];
      C && (M.preventDefault(), y((S + C + an.length) % an.length, true));
    },
    w = M => {
      r.current = {
        x: M.touches[0].clientX,
        y: M.touches[0].clientY
      };
    },
    E = M => {
      if (!r.current) return;
      const S = M.changedTouches[0].clientX - r.current.x,
        C = M.changedTouches[0].clientY - r.current.y;
      r.current = null, !(Math.abs(S) < 40 || Math.abs(S) < Math.abs(C)) && y((h + (S < 0 ? 1 : an.length - 1)) % an.length);
    };
  return <div className={`voices${g ? " auto" : ""}`} ref={i}><div className="voice-media" aria-hidden="true">{an.map((M, S) => <img key={M.id} className={`vm${S === h ? " is-on" : ""}`} src={M.photo} alt="" width="1600" height="1067" loading="lazy" />)}</div><div className="voice-body"><div className="voice-stage" aria-live="polite" onTouchStart={w} onTouchEnd={E}>{an.map((M, S) => <figure key={M.id} className={`voice${S === h ? " is-active" : ""}`} id={`hp-${M.id}`} hidden={S !== h}><blockquote>“{M.quote}”</blockquote><figcaption>{M.logo && <img src={M.logo.src} alt="" width={M.logo.width} height={M.logo.height} />}<span><b>{M.name}</b>{M.role}</span></figcaption></figure>)}</div><div className="voice-pick" role="tablist" aria-label="Customer quotes" ref={l}>{an.map((M, S) => <button key={M.id} type="button" role="tab" aria-selected={S === h} aria-controls={`hp-${M.id}`} tabIndex={S === h ? 0 : -1} onClick={() => y(S)} onKeyDown={C => b(C, S)}><b>{M.name}</b><i key={S === h ? `on-${h}` : "off"} /></button>)}</div></div></div>;
}
function Company() {
  return <section className="sec" id="company"><div className="wrap"><h2 className="statement">Trusted where documents carry the risk.{" "}<span>Steel service centers, mills and finance teams run their paperwork on Star.</span></h2></div><div className="rule" /><div className="wrap"><div className="split"><div><h3 className="h-sm">Automate certificates across every mill and supplier</h3><Link className="btn btn-primary" to="/resources?stories=case-study#stories">See all case studies<Icon name="arr" /></Link></div><p className="split-p">From mill test certificates to supplier invoices, metals companies use Star to take manual keying out of receiving, quality and accounts payable.</p></div><div className="story"><div className="story-h"><span className="story-mk">F</span><p>Flack Global Metals boosts efficiency with automated MTC processing.</p><a className="btn btn-outline" href="https://starsoftware.co/our-story/flack-global-metals-boosts-efficiency-with-automated-mtc-processing/">Read the story<Icon name="arr" /></a></div><div className="story-img"><img src="/home/img/photos/coil-yard-floor.webp" alt="Steel coils in a service center yard" width="1344" height="705" loading="lazy" /></div><div className="story-meta"><span><b>MTC automation</b></span><span><b>ASME and ASTM</b>{" workflows"}</span><span><b>Used for</b>{" extraction, standards conversion and ERP sync"}</span></div><Vb /></div><h3 className="h-sm h-gap" id="guides">Free guides for teams automating certificates</h3><div className="cols3">{Ib.map(i => <a key={i.file} className="col" href={i.file} download={true}><span className="ico"><Icon name={i.icon} /></span><p><b>{i.title}</b>{" "}{i.text}</p><span className="link">Download PDF<Icon name="arr" /></span></a>)}</div></div><div className="rule" /><div className="wrap" id="industry-stories"><div className="split"><div><h3 className="h-sm">Built for every document-heavy industry</h3><a className="btn btn-primary" href="https://starsoftware.co/test-certificate-automation-for-steel-service-centers-a-complete-guide/">Steel and metals<Icon name="arr" /></a></div><p className="split-p">Every industry has its own documents and rules. The same agents read certificates in a steel yard, lab reports in pharma and transcripts at a university.</p></div><Yb /></div><div className="rule" /><div className="wrap"><Pb /></div></section>;
}
const Xb = "http://www.w3.org/2000/svg",
  Og = "/home/img/systems/",
  iu = 1136,
  ir = 460,
  Kb = ["MTR", "COA", "Invoice", "Insurance form", "Transcript"],
  Cp = [{
    t: "ERP",
    s: "Purchasing, inventory, finance",
    n: ["SAP", "Oracle", "NetSuite", "Dynamics 365", "Infor", "INVEX"]
  }, {
    t: "CRM",
    s: "Customers and accounts",
    n: ["Salesforce", "HubSpot", "Zoho"]
  }, {
    t: "Workflow",
    s: "Route, notify, automate",
    n: ["Workato", "MuleSoft", "Power Automate", "Zapier"]
  }, {
    t: "Quality and data",
    s: "Compliance and analytics",
    n: ["LIMS", "QMS", "MES", "MasterControl", "Snowflake"]
  }],
  Li = {
    SAP: ["sap.svg", 2.016, 21],
    Oracle: ["oracle.svg", 7.642, 12],
    NetSuite: ["netsuite.png", 2.737, 19],
    "Dynamics 365": ["dynamics365.svg", 2.865, 24],
    Infor: ["infor.png", 2.55, 18],
    INVEX: ["invex.png", 6.138, 10, "INVEX"],
    Salesforce: ["salesforce.svg", 1.422, 24],
    HubSpot: ["hubspot.svg", 3.436, 18],
    Zoho: ["zoho.svg", 2.327, 21],
    Workato: ["workato.png", 6.225, 14],
    MuleSoft: ["mulesoft.svg", 3.306, 19],
    "Power Automate": ["powerautomate.svg", 1, 19, "Power Automate"],
    Zapier: ["zapier.svg", 3.683, 16],
    Snowflake: ["snowflake.svg", 4.414, 17],
    MasterControl: ["mastercontrol.svg", 8.423, 14]
  },
  lu = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"',
  Zb = {
    LIMS: `<path d="M9 3h6M10 3v6l-5 9a2 2 0 001.8 3h10.4a2 2 0 001.8-3l-5-9V3" ${lu}/>`,
    QMS: `<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z M8.5 12l2.5 2.5 4.5-5" ${lu}/>`,
    MES: `<path d="M3 21V10l5 3V10l5 3V6h3l1 15z M3 21h18" ${lu}/>`
  },
  nn = 'stroke="#fff" stroke-width="1.8"',
  qg = {
    MTR: ["#635bff", "#493ee5", '<path d="M5 4h14v3.2h-5.2v9.6H19V20H5v-3.2h5.2V7.2H5z" fill="#fff"/>', "Mill test report"],
    COA: ["#0092b8", "#00647a", `<path d="M9.5 3h5M10.5 3v6l-5 8.6A2 2 0 007.2 21h9.6a2 2 0 001.7-3.4l-5-8.6V3" fill="none" ${nn} stroke-linejoin="round"/><path d="M7.6 15.5h8.8" ${nn}/>`, "Certificate of analysis"],
    Invoice: ["#F5A524", "#DD7A0E", `<path d="M6 3h12v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4z" fill="none" ${nn} stroke-linejoin="round"/><path d="M9 8h6M9 11.5h6M9 15h3.5" ${nn} stroke-linecap="round"/>`, "AP and AR documents"],
    "Insurance form": ["#8a7dff", "#5b4fe0", `<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" fill="none" ${nn} stroke-linejoin="round"/><path d="M8.8 12l2.3 2.3 4.2-4.6" fill="none" ${nn} stroke-linecap="round" stroke-linejoin="round"/>`, "ACORD and claims"],
    Transcript: ["#3B82F6", "#2160D9", `<path d="M2.5 9.5L12 5l9.5 4.5L12 14z" fill="none" ${nn} stroke-linejoin="round"/><path d="M6.5 11.5v4.2c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.2M21.5 9.5v5" fill="none" ${nn} stroke-linecap="round"/>`, "Academic records"]
  };
function Ep(i) {
  const l = qg[i];
  return `<span class="di" style="background:linear-gradient(145deg,${l[0]},${l[1]})"><svg viewBox="0 0 24 24" aria-hidden="true">${l[2]}</svg></span>`;
}
function zg(i) {
  const l = Li[i];
  if (l) {
    const r = l[2],
      c = Math.round(r * l[1]);
    return `<li class="lg"><img src="${Og}${l[0]}" alt="${i}" width="${c}" height="${r}" loading="lazy" decoding="async">${l[3] ? `<span>${l[3]}</span>` : ""}</li>`;
  }
  return `<li class="cat"><svg class="bl bc" viewBox="0 0 24 24" aria-hidden="true">${Zb[i] || ""}</svg><span>${i}</span></li>`;
}
const yu = i => Li[i] && (Li[i][3] || Li[i][1] >= 3.8) ? 1 : 0;
function Jb(i) {
  const l = Li[i];
  if (!l) return zg(i);
  const r = 16,
    c = Math.round(r * l[1]);
  return `<li class="lg${yu(i) ? " full" : ""}${l[3] ? " lbl" : ""}"><img src="${Og}${l[0]}" alt="${i}" width="${c}" height="${r}" decoding="async">${l[3] ? `<span>${l[3]}</span>` : ""}</li>`;
}
function Ca(i, l) {
  const r = document.createElementNS(Xb, i);
  return Object.entries(l).forEach(([c, d]) => r.setAttribute(c, d)), r;
}
function lr(i, l, r, c, d, h) {
  if (h) return;
  const m = Ca("circle", {
    r: 3.5,
    visibility: "hidden"
  });
  d && m.setAttribute("class", d), m.appendChild(Ca("animateMotion", {
    dur: `${r}s`,
    repeatCount: "indefinite",
    begin: `${c}s`,
    path: l
  })), m.appendChild(Ca("set", {
    attributeName: "visibility",
    to: "visible",
    begin: `${c}s`
  })), i.appendChild(m);
}
function Tp(i, l) {
  if (!("IntersectionObserver" in window)) return null;
  const r = new IntersectionObserver(([c]) => {
    l.pauseAnimations && (c.isIntersecting ? l.unpauseAnimations() : l.pauseAnimations());
  });
  return r.observe(i), r;
}
function Iu({
  docs: i = Kb
}) {
  const l = useRef(null),
    r = useRef(null),
    c = useRef(null),
    d = useReducedMotion();
  return useEffect(() => {
    const h = l.current,
      m = r.current,
      p = m.querySelector(".hub-lines"),
      f = m.querySelector(".hub-docs"),
      g = m.querySelector(".hub-groups"),
      y = m.querySelector(".hub-core");
    p.innerHTML = "", f.innerHTML = "", g.innerHTML = "";
    let b = ir;
    const w = () => {
        const D = h.clientWidth;
        if (!D) return;
        const V = Math.min(1, D / iu);
        h.style.height = `${b * V}px`, m.style.transform = `scale(${V})`;
      },
      E = Cp.map(D => {
        const V = document.createElement("div");
        return V.className = "hub-group", V.innerHTML = `<h4>${D.t} <small>${D.s}</small></h4><ul>${D.n.map(zg).join("")}</ul>`, g.appendChild(V), V;
      }),
      M = 10,
      S = E.reduce((D, V) => D + V.offsetHeight, 0) + M * (E.length - 1);
    b = Math.max(ir, Math.ceil(S) + 8);
    const C = (b - ir) / 2,
      O = 548,
      P = 230 + C;
    m.style.height = `${b}px`, p.style.height = `${b}px`, p.setAttribute("viewBox", `0 0 ${iu} ${b}`), y.style.top = `${130 + C}px`;
    const k = Math.max(0, (b - S) / 2),
      B = 12,
      F = (S - B * (i.length - 1)) / i.length,
      ae = 290;
    i.forEach((D, V) => {
      const J = k + V * (F + B),
        ee = Math.round(J + F / 2),
        A = document.createElement("div");
      A.className = "hub-doc", A.style.top = `${J}px`, A.style.height = `${F}px`, A.innerHTML = `${Ep(D)}<span class="dt"><b>${D}</b><small>${qg[D][3]}</small></span>`, f.appendChild(A);
      const H = `M${ae} ${ee} C 380 ${ee}, 390 ${P}, ${O - 78} ${P}`;
      p.appendChild(Ca("path", {
        d: H
      })), lr(p, H, 2.8, (V * 0.55).toFixed(2), null, d);
    });
    let K = k;
    E.forEach((D, V) => {
      D.style.top = `${K}px`;
      const J = Math.round(K + D.offsetHeight / 2);
      K += D.offsetHeight + M;
      const ee = D.offsetLeft,
        A = `M${O + 78} ${P} C ${ee - 54} ${P}, ${ee - 44} ${J}, ${ee} ${J}`;
      p.appendChild(Ca("path", {
        d: A
      })), lr(p, A, 2.8, (1.4 + V * 0.55).toFixed(2), "out", d);
    }), w();
    const se = "ResizeObserver" in window ? new ResizeObserver(w) : null;
    se == null || se.observe(h), window.addEventListener("resize", w);
    const ve = Tp(m, p),
      He = c.current;
    He.innerHTML = `<svg class="hub-lines hm-lines" aria-hidden="true"></svg><div class="hm-docs">${i.map(D => `<div class="hm-doc">${Ep(D)}<b>${D.split(" ")[0]}</b></div>`).join("")}</div><div class="hm-orb"><div class="core-rings"><i></i><i></i><i></i></div><div class="core-in"><img class="core-logo" src="/home/img/logo-star-white.png" alt="" width="132" height="100"><b>Star AI</b><span>Extract, understand, validate</span></div></div><div class="hm-outs">${Cp.map(D => `<div class="hm-group"><h4>${D.t} <small>${D.s}</small></h4><ul>${D.n.slice().sort((V, J) => yu(V) - yu(J)).map(Jb).join("")}</ul></div>`).join("")}</div>`;
    const de = He.querySelector(".hm-lines");
    let Re = 0,
      ke = 0;
    const We = () => {
      const D = He.getBoundingClientRect(),
        V = Math.round(D.width),
        J = Math.round(D.height);
      if (!V || V === Re && J === ke) return;
      Re = V, ke = J, de.innerHTML = "", de.setAttribute("viewBox", `0 0 ${V} ${J}`), de.style.width = `${V}px`, de.style.height = `${J}px`;
      const ee = re => {
          const oe = re.getBoundingClientRect();
          return {
            x: oe.left - D.left,
            y: oe.top - D.top,
            w: oe.width,
            h: oe.height
          };
        },
        A = ee(He.querySelector(".hm-orb .core-in")),
        H = Math.round(A.x + A.w / 2),
        Y = Math.round(A.y),
        X = Math.round(A.y + A.h);
      He.querySelectorAll(".hm-doc").forEach((re, oe) => {
        const Ne = ee(re),
          ye = Math.round(Ne.x + Ne.w / 2),
          Q = Math.round(Ne.y + Ne.h + 4),
          ue = (Y - Q) / 2,
          Fe = `M${ye} ${Q} C ${ye} ${Q + ue}, ${H} ${Y - ue}, ${H} ${Y}`;
        de.appendChild(Ca("path", {
          d: Fe
        })), lr(de, Fe, 2.2, (oe * 0.45).toFixed(2), null, d);
      });
      let ie = X;
      He.querySelectorAll(".hm-group").forEach((re, oe) => {
        const Ne = ee(re),
          ye = Math.round(Ne.y + Ne.h / 2),
          Q = Ne.x + Ne.w / 2 < H,
          ue = Math.round(Q ? Ne.x + Ne.w : Ne.x);
        ie = Math.max(ie, ye), de.appendChild(Ca("path", {
          d: `M${H} ${ye} L ${ue} ${ye}`
        })), Q && de.appendChild(Ca("circle", {
          cx: H,
          cy: ye,
          r: 3.5,
          class: "node"
        })), lr(de, `M${H} ${X} L ${H} ${ye} L ${ue} ${ye}`, (2 + Math.floor(oe / 2) * 0.6).toFixed(2), (1.2 + oe * 0.5).toFixed(2), "out", d);
      }), de.insertBefore(Ca("path", {
        d: `M${H} ${X} L ${H} ${ie}`
      }), de.firstChild);
    };
    We();
    const pe = "ResizeObserver" in window ? new ResizeObserver(We) : null;
    pe == null || pe.observe(He), He.querySelectorAll("img").forEach(D => {
      D.complete || D.addEventListener("load", We);
    });
    const U = Tp(He, de);
    return () => {
      se == null || se.disconnect(), pe == null || pe.disconnect(), ve == null || ve.disconnect(), U == null || U.disconnect(), window.removeEventListener("resize", w);
    };
  }, [d, i]), <div className="hub"><div className="scene-wrap hub-desktop" ref={l}><div className="stage hub-stage" ref={r} role="img" aria-label="Diagram: MTRs, COAs, invoices, insurance forms and transcripts flow into Star AI, which extracts, understands and validates them, then sends data to ERP, CRM, workflow and quality systems."><svg className="hub-lines" viewBox={`0 0 ${iu} ${ir}`} aria-hidden="true" /><div className="hub-docs" /><div className="hub-core"><div className="core-rings"><i /><i /><i /></div><div className="core-in"><img className="core-logo" src="/home/img/logo-star-white.png" alt="" width="132" height="100" /><b>Star AI</b><span>Extract, understand, validate</span></div></div><div className="hub-groups" /></div></div><div className="hub-mobile" ref={c} /></div>;
}
function Products() {
  return <section className="sec sec-dark" id="products"><div className="wrap"><h2 className="statement">Your systems don't need another database.{" "}<span>They need better data. Star turns documents into structured, validated records and sends them where the work happens.</span></h2><Iu /></div></section>;
}
const Rp = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true
  },
  tj = {
    access: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
    audit: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
    provenance: <><circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><path d="M9 6h4a4 4 0 0 1 4 4v5" /></>,
    review: <><path d="M12 3l7 3v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></>,
    retention: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    monitoring: <path d="M3 12h4l3-8 4 16 3-8h4" />
  },
  CGs = () => <span className="gv-yes" aria-label="Allowed"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg></span>,
  CVs = () => <span className="gv-no" aria-label="Not allowed"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 12h12" /></svg></span>;
function CKp({
  to: i,
  dec: l = 0,
  suffix: r = "",
  reduce: c
}) {
  const [d, h] = useState(c ? i : 0);
  return useEffect(() => {
    if (c) return;
    const m = performance.now();
    let p = 0;
    const f = g => {
      const y = Math.min(1, (g - m) / 900);
      h(i * (1 - (1 - y) ** 3)), y < 1 && (p = requestAnimationFrame(f));
    };
    return p = requestAnimationFrame(f), () => cancelAnimationFrame(p);
  }, [i, c]), <>{d.toLocaleString("en-US", {
      minimumFractionDigits: l,
      maximumFractionDigits: l
    })}{r}</>;
}
function CAj({
  onDone: i
}) {
  const [l, r] = useState(null),
    c = d => {
      r(d), i(d);
    };
  return <div className={`gv-review${l ? " is-ok" : ""}`}><strong>Line 2 price needs a second look</strong>Read as 1,240.00, but this supplier’s contract rate is 1,210.00. This invoice won’t post until it’s approved or corrected.<div className="gv-conf"><span /></div><div className="gv-conf-l"><span>Read confidence</span><span>62%</span></div><div className="gv-actions"><button type="button" className="gv-btn" onClick={() => c("approve")}>Approve 1,240.00</button><button type="button" className="gv-btn is-ghost" onClick={() => c("correct")}>Correct value</button></div><div className="gv-done">{l === "approve" ? "Approved by you. The invoice is released to post." : "Sent back for correction. The invoice stays on hold."}</div></div>;
}
const ys = [{
    id: "access",
    title: "Role-based access",
    desc: "Decide who can view, edit and approve each document type.",
    chip: "Visible to Accounts payable",
    chipColor: "#8B8FFF",
    rot: "visible only to the right roles",
    panel: () => <><p className="gv-p-label">Permissions for supplier invoices</p><p className="gv-p-title">Each role sees only what it needs</p><table className="gv-matrix"><thead><tr><th>Role</th><th>View</th><th>Edit</th><th>Approve</th></tr></thead><tbody><tr><td>AP clerk</td><td><CGs /></td><td><CGs /></td><td><CVs /></td></tr><tr><td>Controller</td><td><CGs /></td><td><CGs /></td><td><CGs /></td></tr><tr><td>Auditor</td><td><CGs /></td><td><CVs /></td><td><CVs /></td></tr><tr><td>Procurement</td><td><CVs /></td><td><CVs /></td><td><CVs /></td></tr></tbody></table></>
  }, {
    id: "audit",
    title: "Full audit trail",
    desc: "Every extraction, edit and approval is recorded with who made it and when.",
    chip: "5 events recorded",
    chipColor: "#3CCB8A",
    rot: "logged with who changed it and when",
    panel: () => <><p className="gv-p-label">History for INV-20481</p><p className="gv-p-title">Nothing changes without a record</p><ol className="gv-trail"><li><b>Received</b>{" from ap@northgate-steel.example"}<time>14 Oct, 09:02</time></li><li><b>Extracted</b>{" 14 fields by Star"}<time>14 Oct, 09:02</time></li><li className="is-hot"><b>Edited</b>{" line 2 price, 1,210.00 to 1,240.00 by Priya Nair"}<time>14 Oct, 10:47</time></li><li><b>Approved</b>{" by Daniel Okafor, Controller"}<time>14 Oct, 11:15</time></li><li><b>Posted</b>{" to ERP as AP-559203"}<time>14 Oct, 11:15</time></li></ol></>
  }, {
    id: "provenance",
    title: "Source provenance",
    desc: "Trace any value in your ERP back to the exact spot on the source document.",
    chip: "Linked to ERP record",
    chipColor: "#8B8FFF",
    rot: "traceable to the exact spot it came from",
    panel: () => <><p className="gv-p-label">ERP record AP-559203</p><p className="gv-p-title">Click a value, land on its source</p><div className="gv-erp"><div className="gv-erp-row"><span>Field</span><span>Value</span></div><div className="gv-erp-row"><span>Vendor</span><span>Northgate Steel Ltd</span></div><div className="gv-erp-row"><span>Invoice number</span><span>INV-20481</span></div><div className="gv-erp-row is-linked"><span>Gross amount</span><span>18,420.00</span></div></div><dl className="gv-src"><dt>Source</dt><dd>INV-20481.pdf, page 1</dd><dt>Location</dt><dd>Total due, bottom right</dd><dt>Read by</dt><dd>Star, 99% confidence</dd></dl></>
  }, {
    id: "review",
    title: "Human review gates",
    desc: "Low-confidence values and failed checks wait for a person before they post.",
    chip: "1 field waiting for review",
    chipColor: "#F5B53D",
    rot: "held for a person when confidence is low",
    panel: ({
      onReview: i
    }) => <><p className="gv-p-label">Review queue</p><p className="gv-p-title">Held until someone checks it</p><CAj onDone={i} /></>
  }, {
    id: "retention",
    title: "Retention policies",
    desc: "Keep or purge documents on the schedule your compliance team sets.",
    chip: "Policy: Supplier invoices",
    chipColor: "#8B8FFF",
    rot: "kept or purged on your schedule",
    panel: () => <><p className="gv-p-label">Retention policy</p><p className="gv-p-title">Kept for as long as the law requires</p><div className="gv-policy"><div className="gv-policy-name">Supplier invoices, 7 years from posting</div><div className="gv-bar"><div className="is-a">Active</div><div className="is-b">Archived, read-only</div><div className="is-c">Purged</div></div><div className="gv-ticks"><span>Oct 2026</span><span>Oct 2027</span><span>Oct 2033</span></div><p>Legal holds pause the clock. Every purge is logged, so you can show when and why a record was removed.</p></div></>
  }, {
    id: "monitoring",
    title: "Monitoring and reporting",
    desc: "See volumes, exception causes and processing times for every workflow.",
    chip: "1 of 1,284 this week",
    chipColor: "#8B8FFF",
    rot: "measured across every workflow",
    panel: ({
      reduce: i
    }) => <><p className="gv-p-label">Supplier invoices, last 8 weeks</p><p className="gv-p-title">How the workflow is running</p><div className="gv-stats"><div className="gv-stat"><b><CKp to={1284} reduce={i} /></b><span>This week</span></div><div className="gv-stat"><b><CKp to={3.1} dec={1} suffix="%" reduce={i} /></b><span>Exceptions</span></div><div className="gv-stat"><b>2m 40s</b><span>Median time</span></div></div><div className="gv-chart" aria-label="Weekly invoice volume with exceptions">{[62, 70, 66, 78, 74, 85, 90, 100].map((l, r) => <div key={r} style={{
          height: `${l}%`,
          animationDelay: `${r * 45}ms`
        }}><i style={{
            height: `${[6, 5, 7, 4, 5, 4, 3, 3][r]}%`
          }} /></div>)}</div><div className="gv-legend"><span>Processed</span><span>Exceptions</span></div></>
  }],
  Op = ["#3B3FD8", "#C02656", "#0E8A9E"],
  nj = 5800,
  sj = 160,
  ij = ".gv-p-label, .gv-p-title, .gv-matrix tr, .gv-trail li, .gv-erp-row, .gv-src dt, .gv-src dd, .gv-review, .gv-policy-name, .gv-bar, .gv-ticks, .gv-policy p, .gv-stat, .gv-legend";
function Security() {
  const i = useReducedMotion(),
    [l, r] = useState(0),
    [c, d] = useState(0),
    [h, m] = useState(false),
    [p, f] = useState(null),
    [g, y] = useState(false),
    [b, w] = useState(false),
    [E, M] = useState(false),
    [S, C] = useState(false),
    [O, P] = useState(document.hidden),
    k = useRef(null),
    B = useRef(null),
    F = useRef(null),
    ae = useRef(null),
    K = useRef(null),
    se = useRef(0),
    ve = useRef(null),
    He = g || b || E || !S || O,
    de = ys[c],
    Re = useCallback((D, V) => {
      if (D === se.current) return;
      se.current = D, r(D), V && B.current.querySelectorAll(".gv-ctl")[D].focus(), clearTimeout(ve.current);
      const J = () => {
        d(D), f(null), m(false);
        const ee = () => {
          const A = B.current,
            H = A == null ? void 0 : A.querySelectorAll(".gv-ctl")[D];
          H && A.scrollWidth > A.clientWidth && A.scrollTo({
            left: H.offsetLeft - (A.clientWidth - H.offsetWidth) / 2,
            behavior: i ? "auto" : "smooth"
          });
        };
        ee(), i || (ve.current = setTimeout(ee, 950));
      };
      i ? J() : (m(true), ve.current = setTimeout(J, sj));
    }, [i]);
  useEffect(() => () => clearTimeout(ve.current), []), useLayoutEffect(() => {
    var V;
    if (i) return;
    (V = ae.current) == null || V.querySelectorAll(ij).forEach((J, ee) => {
      J.style.animationDelay = `${ee * 55}ms`, J.classList.add("gv-st");
    });
    const D = K.current;
    D && (D.classList.remove("is-scanning"), D.offsetWidth, D.classList.add("is-scanning"));
  }, [c, i]), useEffect(() => {
    let D = 0,
      V = false,
      J = 0;
    const ee = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
      },
      A = H => {
        var ie;
        const Y = (ie = B.current) == null ? void 0 : ie.querySelectorAll(".gv-ctl")[se.current],
          X = F.current;
        if (Y && X) {
          const re = Y.offsetLeft,
            oe = Y.offsetTop,
            Ne = Y.offsetWidth,
            ye = Y.offsetHeight;
          if (!V || i) Object.assign(ee, {
            x: re,
            y: oe,
            w: Ne,
            h: ye
          }), V = true;else {
            const Q = 1 - Math.exp(-Math.min(64, H - (J || H)) / 140);
            ee.x += (re - ee.x) * Q, ee.y += (oe - ee.y) * Q, ee.w += (Ne - ee.w) * Q, ee.h += (ye - ee.h) * Q;
          }
          X.style.transform = `translate(${ee.x.toFixed(2)}px, ${ee.y.toFixed(2)}px)`, X.style.width = `${ee.w.toFixed(2)}px`, X.style.height = `${ee.h.toFixed(2)}px`;
        }
        J = H, D = requestAnimationFrame(A);
      };
    return D = requestAnimationFrame(A), () => cancelAnimationFrame(D);
  }, [i]), useEffect(() => {
    const D = () => P(document.hidden);
    if (document.addEventListener("visibilitychange", D), !("IntersectionObserver" in window)) return C(true), () => document.removeEventListener("visibilitychange", D);
    const V = new IntersectionObserver(([J]) => C(J.isIntersecting), {
      threshold: 0.3
    });
    return V.observe(k.current), () => {
      V.disconnect(), document.removeEventListener("visibilitychange", D);
    };
  }, []);
  const ke = D => {
      const V = {
        ArrowDown: 1,
        ArrowRight: 1,
        ArrowUp: -1,
        ArrowLeft: -1
      }[D.key];
      let J = null;
      V && (J = (se.current + V + ys.length) % ys.length), D.key === "Home" && (J = 0), D.key === "End" && (J = ys.length - 1), J !== null && (D.preventDefault(), Re(J, true));
    },
    We = D => f([D === "approve" ? "Review complete" : "Correction requested", "#3CCB8A"]),
    pe = p ? p[0] : de.chip,
    U = p ? p[1] : de.chipColor;
  return <section className={`sec gv${He ? " is-paused" : ""}`} id="security" aria-labelledby="gv-title" ref={k} style={{
    "--dur": `${nj}ms`
  }}><div className="wrap"><div className="gv-head"><div><p className="gv-kicker"><svg {...Rp}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>Governance</p><h2 className="gv-h" id="gv-title">Governed like any system that writes business records.</h2><p className="gv-lede">Certificates and invoices carry supplier, product and pricing data. In Star, every value is{" "}<span key={c} className={`gv-rot${i ? "" : " is-swap"}`} style={{
              "--kc": Op[c % Op.length]
            }}>{de.rot}</span>.</p></div>{!i && <button className="gv-toggle" type="button" aria-pressed={g} onClick={() => y(D => !D)}><span className="gv-toggle-ring" aria-hidden="true">{g ? <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5z" /></svg> : <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>}</span><span><span>{g ? "Play the walkthrough" : "Pause the walkthrough"}</span><span className="gv-toggle-sub">Six controls on one sample invoice</span></span></button>}</div><div className="gv-body" onMouseEnter={() => w(true)} onMouseLeave={() => w(false)} onFocus={() => M(true)} onBlur={D => {
        D.currentTarget.contains(D.relatedTarget) || M(false);
      }}><div className="gv-stage" id="gv-stage" role="tabpanel" aria-labelledby={`gv-tab-${de.id}`} aria-live="polite" data-view={de.id}><div className="gv-doc-wrap"><span className={`gv-chip${h ? " is-out" : ""}`} style={{
              "--chip": U
            }}><i />{pe}</span><div className="gv-doc" ref={K} aria-label="Sample supplier invoice"><div className="gv-scan" aria-hidden="true" /><div className="gv-doc-top"><div className="gv-doc-logo">Northgate Steel Ltd<small>Unit 4, Riverside Works</small></div><div className="gv-doc-kind">Invoice</div></div><dl className="gv-meta"><dt>Invoice no.</dt><dd>INV-20481</dd><dt>Date</dt><dd>14 Oct 2026</dd><dt>PO</dt><dd>PO-7731</dd></dl><table className="gv-lines"><thead><tr><th>Item</th><th className="r">Qty</th><th className="r">Price</th><th className="r">Amount</th></tr></thead><tbody><tr><td>Hot-rolled coil 2mm</td><td className="r">12 t</td><td className="r">1,050.00</td><td className="r">12,600.00</td></tr><tr><td>Cutting service</td><td className="r">1</td><td className="r"><span className="gv-f" data-f="price2">1,240.00</span></td><td className="r">1,240.00</td></tr><tr><td>Freight</td><td className="r">1</td><td className="r">1,510.00</td><td className="r">1,510.00</td></tr></tbody></table><div className="gv-sum"><div><span>Subtotal</span><span>15,350.00</span></div><div><span>VAT 20%</span><span>3,070.00</span></div><div className="gv-total"><span>Total due</span><span className="gv-f" data-f="total">18,420.00</span></div></div></div><div className="gv-stamp">Retain until<br />Oct 2033<small>then purge</small></div></div><div key={c} className={`gv-panel${h ? " is-out" : ""}`} ref={ae}>{de.panel({
              reduce: i,
              onReview: We
            })}</div></div><div className="gv-dock"><div className="gv-controls" role="tablist" aria-label="Governance controls" aria-orientation="horizontal" ref={B} onKeyDown={ke}>{ys.map((D, V) => <button key={D.id} type="button" role="tab" id={`gv-tab-${D.id}`} className="gv-ctl" aria-selected={V === l} aria-controls="gv-stage" aria-label={D.title} title={D.title} tabIndex={V === l ? 0 : -1} onClick={() => Re(V)}><span className="gv-ico"><svg {...Rp}>{tj[D.id]}</svg></span><span className="gv-tx"><span className="gv-tx-in"><span className="gv-t">{D.title}</span><span className="gv-d">{D.desc}</span></span></span><span className="gv-prog" aria-hidden="true">{V === l && <i onAnimationEnd={() => Re((se.current + 1) % ys.length)} />}</span></button>)}<span className="gv-glider" ref={F} aria-hidden="true" /></div></div></div></div></section>;
}
const rj = "https://starsoftware.co/",
  ca = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  },
  cj = [{
    name: "Steel and metals",
    photo: "/home/img/photos/hero-coils.webp",
    colour: "#8a85f5",
    icon: <><circle cx="12" cy="12" r="8.5" {...ca} /><circle cx="12" cy="12" r="5.2" {...ca} /><circle cx="12" cy="12" r="2" {...ca} /></>,
    text: "Mill certificates checked against ASTM and ASME, heat numbers traced to inventory, and metal invoices matched to purchase orders.",
    tags: ["MTRs and MTCs", "COAs", "Metal invoices", "Bills of lading", "Packing slips"],
    link: ["Test certificate automation for steel service centers", "test-certificate-automation-for-steel-service-centers-a-complete-guide/"]
  }, {
    name: "Pharma and chemicals",
    photo: "/home/img/photos/pharma-lab.webp",
    colour: "#2DD4BF",
    icon: <path d="M9.5 3h5M10.5 3v6l-5 8.6A2 2 0 007.2 21h9.6a2 2 0 001.7-3.4l-5-8.6V3M7.6 15h8.8" {...ca} />,
    text: "Certificates of analysis checked against your specification, the pharmacopeial grade and the latest specification revision before a batch is released.",
    tags: ["COAs", "Specifications", "Supplier qualification", "Batch records"],
    link: ["COA processing for pharma and chemicals", "coa-processing-pharma-chemical/"]
  }, {
    name: "Manufacturing",
    photo: "/home/img/photos/worker-tablet.webp",
    colour: "#F5A524",
    icon: <><circle cx="12" cy="12" r="3.2" {...ca} /><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M5.5 18.5l1.8-1.8M16.7 7.3l1.8-1.8" {...ca} /></>,
    text: "Engineering documents, invoices, quality records and supplier data read and validated before they reach your ERP or QMS.",
    tags: ["Quality records", "Supplier certificates", "Invoices", "Drawings and RFQs"],
    link: ["How IDP is redefining quality assurance in manufacturing", "how-intelligent-document-processing-is-redefining-quality-assurance-in-manufacturing/"]
  }, {
    name: "Construction",
    photo: "/home/img/photos/foundry.webp",
    colour: "#F97316",
    icon: <path d="M4 21V9l6-4v16M10 21h10V11l-5-3M4 21h17M14 13h2M14 16.5h2M6.5 12h1M6.5 15.5h1" {...ca} />,
    text: "Mill certificates for structural steel, procurement documents and project paperwork checked and filed against each job.",
    tags: ["Mill certificates", "Delivery tickets", "Invoices", "Submittals"],
    link: ["Why mill test certificates matter in construction steel", "the-importance-of-mill-test-certificates-in-construction-steel/"]
  }, {
    name: "Healthcare",
    photo: "/home/img/photos/qa-inspector.webp",
    colour: "#3cd7ff",
    icon: <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z M12 8.5v6M9 11.5h6" {...ca} />,
    text: "Supplier invoices and compliance records processed with the audit trail that regulated operations need.",
    tags: ["Invoices", "Supplier contracts", "Compliance records"],
    link: ["How AP automation helps healthcare companies stay compliant", "how-ap-automation-helps-healthcare-companies-ensure-regulatory-compliance/"]
  }, {
    name: "Financial services",
    photo: "/home/img/photos/reviewing-forms.webp",
    colour: "#60A5FA",
    icon: <path d="M3 9.5L12 4l9 5.5M5 10v8M9.7 10v8M14.3 10v8M19 10v8M3 20.5h18" {...ca} />,
    text: "KYC documents, bank statements and lending files extracted and verified for audit-ready onboarding.",
    tags: ["Bank statements", "Passports and IDs", "Tax returns", "Balance sheets"],
    link: ["The role of IDP in audit-ready KYC", "the-role-of-idp-in-audit-ready-kyc-processes/"]
  }, {
    name: "Education",
    photo: "/home/img/photos/paper-stack.webp",
    colour: "#a9a4ff",
    icon: <path d="M2.5 9.5L12 5l9.5 4.5L12 14zM6.5 11.5v4.2c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.2M21.5 9.5v5" {...ca} />,
    text: "Transcripts and student records read and entered automatically, so registrars can spend their time on students.",
    tags: ["Transcripts", "Applications", "Student records"],
    link: ["How automation frees registrars for high-value work", "how-intelligent-automation-frees-u-s-registrars-for-high-value-work/"]
  }],
  oj = {
    cert: ["#493ee5", "Certificate", <div className="mt mt-cert">{Array.from({
        length: 9
      }, (i, l) => <i key={l} />)}</div>],
    lab: ["#00647a", "Lab results", <div className="mt mt-lab"><span><i /><b>99.8%</b><u className="ok" /></span><span><i /><b>0.42%</b><u className="no" /></span><span><i /><b>{"<10"}</b><u className="ok" /></span></div>],
    invoice: ["#d97706", "Invoice", <div className="mt mt-inv"><span><i /><b /></span><span><i /><b /></span><span><i /><b /></span><strong>$18,400</strong></div>],
    ship: ["#0092b8", "Shipping", <div className="mt mt-ship"><i /><s /><i /><s /><i /></div>],
    id: ["#635bff", "Identity", <div className="mt mt-id"><u /><span><i /><i /><i /></span></div>],
    bank: ["#0e7a55", "Statement", <div className="mt mt-bank">{[40, 70, 52, 88, 64].map(i => <i key={i} style={{
        height: `${i}%`
      }} />)}</div>],
    draw: ["#2160D9", "Drawing", <div className="mt mt-draw"><svg viewBox="0 0 100 40"><rect x="8" y="8" width="54" height="24" rx="2" /><circle cx="22" cy="20" r="5" /><circle cx="48" cy="20" r="5" /><path d="M62 14h18v12H62M8 4h54M8 2v4M62 2v4" /></svg></div>],
    spec: ["#5b4fe0", "Specification", <div className="mt mt-spec"><span><i style={{
          left: "20%",
          width: "50%"
        }} /></span><span><i style={{
          left: "10%",
          width: "40%"
        }} /></span><span><i style={{
          left: "35%",
          width: "45%"
        }} /></span></div>],
    edu: ["#493ee5", "Record", <div className="mt mt-edu"><span><i /><b>A</b></span><span><i /><b>A-</b></span><span><i /><b>B+</b></span></div>],
    rec: ["#00647a", "Record", <div className="mt mt-rec"><span><u /><i /></span><span><u /><i /></span><span><u /><i /></span></div>]
  },
  uj = ["#0092b8", "#d97706", "#635bff", "#0e7a55", "#2160D9", "#c0264a", "#00647a"];
function dj(i) {
  const l = i.toLowerCase();
  return /coa/.test(l) ? "lab" : /mtr|mtc|mill cert|certificate/.test(l) ? "cert" : /invoice/.test(l) ? "invoice" : /lading|packing|delivery/.test(l) ? "ship" : /passport|\bid|student/.test(l) ? "id" : /application/.test(l) ? "rec" : /bank|balance|tax/.test(l) ? "bank" : /drawing|rfq|submittal/.test(l) ? "draw" : /spec|qualification|contract/.test(l) ? "spec" : /transcript/.test(l) ? "edu" : "rec";
}
function CHj({
  tags: i
}) {
  const l = [];
  return i.slice(0, 3).map(r => {
    const [c, d, h] = oj[dj(r)],
      m = l.includes(c) ? uj.find(f => !l.includes(f)) : c;
    l.push(m);
    const p = /student/i.test(r) ? "Profile" : /application/i.test(r) ? "Form" : d;
    return <div key={r} className="ind-doc" style={{
      "--dc": m
    }}><div className="ind-doc-h"><span className="ind-doc-k">{p}</span><b>{r}</b><em><Icon name="check" /></em></div>{h}</div>;
  });
}
function Industries({
  items: i = cj,
  heading: l,
  id: r = "industries"
}) {
  const c = useRef(null),
    d = useReducedMotion(),
    [h, m] = useState(0),
    [p, f] = useState(0),
    [g, y] = useState(false),
    b = useRef(null),
    w = (S, C) => {
      if (m(S), C && c.current.children[S].focus(), clearTimeout(b.current), d) {
        f(S);
        return;
      }
      y(true), b.current = setTimeout(() => {
        f(S), y(false);
      }, 220);
    },
    E = (S, C) => {
      const O = {
        ArrowRight: 1,
        ArrowDown: 1,
        ArrowLeft: -1,
        ArrowUp: -1
      }[S.key];
      O && (S.preventDefault(), w((C + O + i.length) % i.length, true));
    },
    M = i[p];
  return <section className="sec ind-sec" id={r}><div className="ind-bg" aria-hidden="true">{i.map((S, C) => <img key={S.name} className={C === h ? "is-on" : void 0} src={S.photo} alt="" loading="lazy" />)}</div><div className="wrap"><h2 className="statement">{l ? l[0] : "One automation engine."}{" "}<span>{l ? l[1] : "Many industries, each with its own documents and rules."}</span></h2><div className="ind"><div className="ind-list" role="tablist" aria-label="Industries" aria-orientation="vertical" ref={c}>{i.map((S, C) => <button key={S.name} type="button" role="tab" id={`hp-ind-tab-${C}`} aria-selected={C === h} aria-controls="hp-ind-panel" tabIndex={C === h ? 0 : -1} onClick={() => w(C)} onKeyDown={O => E(O, C)}><span className="ind-ic" style={{
              "--c": S.colour
            }}><svg viewBox="0 0 24 24" aria-hidden="true">{S.icon}</svg></span><span>{S.name}</span></button>)}</div><div className={`ind-panel${g ? " swap" : ""}`} id="hp-ind-panel" role="tabpanel" aria-labelledby={`hp-ind-tab-${p}`}><div className="ind-docs" aria-hidden="true"><CHj tags={M.tags} /></div><div className="ind-text"><h3 className="ind-title">{M.name}</h3><p className="ind-desc">{M.text}</p><ul className="ind-tags">{M.tags.map(S => <li key={S}>{S}</li>)}</ul><a className="link ind-link" href={rj + M.link[1]}>{M.link[0]}<Icon name="arr" /></a></div></div></div></div></section>;
}
const mj = 10 * 1024 * 1024,
  fj = /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
  qp = [{
    name: "name",
    label: "Full name",
    autoComplete: "name"
  }, {
    name: "email",
    label: "Work email",
    autoComplete: "email",
    type: "email"
  }],
  pj = ["Mill test report (MTR)", "Certificate of analysis (COA)", "Invoice", "RFQ or drawing", "Other"];
function CGj({
  doctype: i = ""
}) {
  const [l, r] = useState({
      name: "",
      email: "",
      remarks: "",
      doctype: i
    }),
    [c, d] = useState(null),
    [h, m] = useState({}),
    [p, f] = useState(""),
    [g, y] = useState(false),
    [b, w] = useState(false),
    E = S => r(C => ({
      ...C,
      [S.target.name]: S.target.value
    })),
    M = S => {
      S.preventDefault();
      const C = {},
        O = [];
      if (qp.forEach(P => {
        const k = l[P.name].trim();
        (!k || P.type === "email" && !fj.test(k)) && (C[P.name] = true, O.push(P.label.toLowerCase()));
      }), l.doctype || (C.doctype = true, O.push("automation type")), m(C), !c) O.push("a document");else if (c.size > mj) {
        f("That file is larger than 10 MB. Send a smaller file or a single page.");
        return;
      }
      if (O.length) {
        f(`Add ${O.join(", ")} to send your sample.`);
        return;
      }
      f("");
      // Open the visitor's email app addressed to the team, with the
      // details filled in; the file is attached there.
      const subject = `Sample for a walkthrough: ${l.doctype}`,
        lines = [`Name: ${l.name.trim()}`, `Work email: ${l.email.trim()}`, `Automation type: ${l.doctype}`];
      l.remarks.trim() && lines.push(`Remarks: ${l.remarks.trim()}`);
      lines.push("", `Attached: ${c.name}`);
      window.location.href = `mailto:${SAMPLE_MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
      w(true);
    };
  return b ? <div className="sample-form"><div className="form-done" role="status"><span className="done-ico"><Icon name="mail" /></span><h3>Attach your file and send</h3><p>{"Your email app has opened with your details, addressed to "}<b>{SAMPLE_MAIL}</b>{". Attach "}<b>{c.name}</b>{" and send it, and we\u2019ll email "}<b>{l.email}</b>{" to set up your walkthrough."}</p></div></div> : <form className="sample-form" onSubmit={M} noValidate={true}><div className="f-row">{qp.map(S => <label key={S.name} className="f"><span>{S.label}</span><input name={S.name} type={S.type || "text"} autoComplete={S.autoComplete} value={l[S.name]} onChange={E} aria-invalid={h[S.name] || void 0} required={true} /></label>)}</div><div className="f-row"><label className="f"><span>{"Remarks "}<small>(optional)</small></span><input name="remarks" value={l.remarks} onChange={E} /></label><label className="f"><span>Automation type</span><select name="doctype" value={l.doctype} onChange={E} aria-invalid={h.doctype || void 0} required={true}><option value="">Choose one</option>{pj.map(S => <option key={S}>{S}</option>)}</select></label></div><label className={`sf-drop${g ? " drag" : ""}${c ? " has-file" : ""}`} onDragEnter={() => y(true)} onDragOver={() => y(true)} onDragLeave={() => y(false)} onDrop={() => y(false)}><input type="file" name="file" accept=".pdf,.png,.jpg,.jpeg,.tif,.tiff" onChange={S => d(S.target.files[0] || null)} required={true} /><Icon name="upload" /><span className="drop-t">{c ? c.name : <>{"Drop your document here or "}<u>choose a file</u></>}</span><span className="drop-s">PDF, PNG, JPG or TIFF, up to 10 MB</span></label><p className="f-error" role="alert">{p}</p><button className="btn btn-primary btn-block" type="submit">Send sample</button><p className="f-note">Your file is used only to prepare your walkthrough.</p></form>;
}
function ContactCta({
  heading: i = "See what Star catches on your own documents.",
  text: l = "Send one MTR, COA or invoice. We\u2019ll walk you through the extracted data, the checks the agent ran and the action it would take.",
  doctype: r
}) {
  return <section className="sec sec-dark cta" id="contact"><span id="demo" className="anchor" aria-hidden="true" /><div className="wrap cta-grid"><div className="cta-copy"><h2>{i}</h2><p>{l}</p><p className="cta-alt">{"Prefer a live walkthrough? "}<a href={DEMO_PATH}>Request a demo</a></p></div><CGj doctype={r} /></div></section>;
}
function VideoModal({
  open: i,
  onClose: l,
  src: r
}) {
  const c = useRef(null),
    d = useRef(null);
  return useEffect(() => {
    var g, y;
    if (!i) return;
    const h = document.activeElement,
      m = document.documentElement;
    m.style.overflow = "hidden", (g = c.current) == null || g.focus();
    const p = d.current;
    p && (p.currentTime = 0, (y = p.play()) == null || y.catch(() => {}));
    const f = b => {
      b.key === "Escape" && l();
    };
    return document.addEventListener("keydown", f), () => {
      var b;
      m.style.overflow = "", document.removeEventListener("keydown", f), (b = h == null ? void 0 : h.focus) == null || b.call(h);
    };
  }, [i, l]), i ? <div className="lightbox" role="dialog" aria-modal="true" aria-label="Order automation video" onClick={h => h.target === h.currentTarget && l()}><button className="lb-x" type="button" aria-label="Close" ref={c} onClick={l}><Icon name="close" /></button><video ref={d} src={r} controls={true} playsInline={true} /></div> : null;
}
function useHashScroll() {
  const {
    hash: i
  } = useLocation();
  useEffect(() => {
    if (!i) return;
    const l = requestAnimationFrame(() => {
      var r;
      (r = document.getElementById(decodeURIComponent(i.slice(1)))) == null || r.scrollIntoView();
    });
    return () => cancelAnimationFrame(l);
  }, [i]);
}

export { IconSprite, Hero, Solutions, OrderAutomation, WorkflowStudio, Industries, Scale, Company, Products, Security, Compliance, ContactCta, VideoModal, useHashScroll };
