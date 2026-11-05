import { useEffect, useRef } from 'react';
import { useReducedMotion } from './hooks';

// Documents flow into Star AI and out to the systems a business runs: drawn
// once on a fixed 1136-wide stage that scales to fit (desktop), and as a
// stacked version measured from its own layout (mobile). The lines are SVG
// paths between the boxes, with dots running along them; both pause while
// off screen, and the dots are left out with reduced motion.

const SVG_NS = 'http://www.w3.org/2000/svg';
// Under the site's base: / in the app, the page's own folder when it's
// built on its own (vite.campaign.config.js).
const LOGO_DIR = `${import.meta.env.BASE_URL}mtr-campaign/systems/`;
const STAR_LOGO = `${import.meta.env.BASE_URL}mtr-campaign/logo-star-white.png`;
const STAGE_WIDTH = 1136;
const STAGE_MIN_HEIGHT = 460;

const DEFAULT_DOCS = ['MTR', 'COA', 'Invoice', 'Insurance form', 'Transcript'];

const GROUPS = [
  { title: 'ERP', sub: 'Purchasing, inventory, finance', items: ['SAP', 'Oracle', 'NetSuite', 'Dynamics 365', 'Infor', 'INVEX'] },
  { title: 'CRM', sub: 'Customers and accounts', items: ['Salesforce', 'HubSpot', 'Zoho'] },
  { title: 'Workflow', sub: 'Route, notify, automate', items: ['Workato', 'MuleSoft', 'Power Automate', 'Zapier'] },
  { title: 'Quality and data', sub: 'Compliance and analytics', items: ['LIMS', 'QMS', 'MES', 'MasterControl', 'Snowflake'] },
];

// Logo file, width-to-height ratio, height on the desktop stage, and a
// label for the marks that don't spell the name.
const LOGOS = {
  SAP: ['sap.svg', 2.016, 21],
  Oracle: ['oracle.svg', 7.642, 12],
  NetSuite: ['netsuite.png', 2.737, 19],
  'Dynamics 365': ['dynamics365.svg', 2.865, 24],
  Infor: ['infor.png', 2.55, 18],
  INVEX: ['invex.png', 6.138, 10, 'INVEX'],
  Salesforce: ['salesforce.svg', 1.422, 24],
  HubSpot: ['hubspot.svg', 3.436, 18],
  Zoho: ['zoho.svg', 2.327, 21],
  Workato: ['workato.png', 6.225, 14],
  MuleSoft: ['mulesoft.svg', 3.306, 19],
  'Power Automate': ['powerautomate.svg', 1, 19, 'Power Automate'],
  Zapier: ['zapier.svg', 3.683, 16],
  Snowflake: ['snowflake.svg', 4.414, 17],
  MasterControl: ['mastercontrol.svg', 8.423, 14],
};

// Kinds of system without one vendor get a line icon instead of a logo.
const LINE = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"';
const CATEGORY_ICONS = {
  LIMS: `<path d="M9 3h6M10 3v6l-5 9a2 2 0 001.8 3h10.4a2 2 0 001.8-3l-5-9V3" ${LINE}/>`,
  QMS: `<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z M8.5 12l2.5 2.5 4.5-5" ${LINE}/>`,
  MES: `<path d="M3 21V10l5 3V10l5 3V6h3l1 15z M3 21h18" ${LINE}/>`,
};

// Each document's badge: gradient from, to, white glyph, and subtitle.
const WHITE = 'stroke="#fff" stroke-width="1.8"';
const DOC_BADGES = {
  MTR: ['#635bff', '#493ee5', '<path d="M5 4h14v3.2h-5.2v9.6H19V20H5v-3.2h5.2V7.2H5z" fill="#fff"/>', 'Mill test report'],
  COA: [
    '#0092b8',
    '#00647a',
    `<path d="M9.5 3h5M10.5 3v6l-5 8.6A2 2 0 007.2 21h9.6a2 2 0 001.7-3.4l-5-8.6V3" fill="none" ${WHITE} stroke-linejoin="round"/><path d="M7.6 15.5h8.8" ${WHITE}/>`,
    'Certificate of analysis',
  ],
  Invoice: [
    '#F5A524',
    '#DD7A0E',
    `<path d="M6 3h12v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4z" fill="none" ${WHITE} stroke-linejoin="round"/><path d="M9 8h6M9 11.5h6M9 15h3.5" ${WHITE} stroke-linecap="round"/>`,
    'AP and AR documents',
  ],
  'Insurance form': [
    '#8a7dff',
    '#5b4fe0',
    `<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" fill="none" ${WHITE} stroke-linejoin="round"/><path d="M8.8 12l2.3 2.3 4.2-4.6" fill="none" ${WHITE} stroke-linecap="round" stroke-linejoin="round"/>`,
    'ACORD and claims',
  ],
  Transcript: [
    '#3B82F6',
    '#2160D9',
    `<path d="M2.5 9.5L12 5l9.5 4.5L12 14z" fill="none" ${WHITE} stroke-linejoin="round"/><path d="M6.5 11.5v4.2c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.2M21.5 9.5v5" fill="none" ${WHITE} stroke-linecap="round"/>`,
    'Academic records',
  ],
};

function docBadge(name) {
  const [from, to, glyph] = DOC_BADGES[name];
  return `<span class="di" style="background:linear-gradient(145deg,${from},${to})"><svg viewBox="0 0 24 24" aria-hidden="true">${glyph}</svg></span>`;
}

// A system in a desktop group: its logo, or its kind with a line icon.
function systemItem(name) {
  const logo = LOGOS[name];
  if (logo) {
    const height = logo[2];
    const width = Math.round(height * logo[1]);
    return `<li class="lg"><img src="${LOGO_DIR}${logo[0]}" alt="${name}" width="${width}" height="${height}" loading="lazy" decoding="async">${logo[3] ? `<span>${logo[3]}</span>` : ''}</li>`;
  }
  return `<li class="cat"><svg class="bl bc" viewBox="0 0 24 24" aria-hidden="true">${CATEGORY_ICONS[name] || ''}</svg><span>${name}</span></li>`;
}

// On mobile, wide and labelled logos take a whole row and go last.
const takesRow = (name) => (LOGOS[name] && (LOGOS[name][3] || LOGOS[name][1] >= 3.8) ? 1 : 0);

function mobileSystemItem(name) {
  const logo = LOGOS[name];
  if (!logo) return systemItem(name);
  const height = 16;
  const width = Math.round(height * logo[1]);
  return `<li class="lg${takesRow(name) ? ' full' : ''}${logo[3] ? ' lbl' : ''}"><img src="${LOGO_DIR}${logo[0]}" alt="${name}" width="${width}" height="${height}" decoding="async">${logo[3] ? `<span>${logo[3]}</span>` : ''}</li>`;
}

function svgEl(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

// A dot that runs along a path forever, appearing when its turn begins.
function addPulse(svg, path, seconds, begin, className, reduced) {
  if (reduced) return;
  const dot = svgEl('circle', { r: 3.5, visibility: 'hidden' });
  if (className) dot.setAttribute('class', className);
  dot.appendChild(svgEl('animateMotion', { dur: `${seconds}s`, repeatCount: 'indefinite', begin: `${begin}s`, path }));
  dot.appendChild(svgEl('set', { attributeName: 'visibility', to: 'visible', begin: `${begin}s` }));
  svg.appendChild(dot);
}

// Pauses the SVG's animations while the element is off screen.
function pauseOffscreen(el, svg) {
  if (!('IntersectionObserver' in window)) return null;
  const observer = new IntersectionObserver(([entry]) => {
    if (!svg.pauseAnimations) return;
    if (entry.isIntersecting) svg.unpauseAnimations();
    else svg.pauseAnimations();
  });
  observer.observe(el);
  return observer;
}

export default function SystemsHub({ docs = DEFAULT_DOCS }) {
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const mobileRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const lines = stage.querySelector('.hub-lines');
    const docsEl = stage.querySelector('.hub-docs');
    const groupsEl = stage.querySelector('.hub-groups');
    const core = stage.querySelector('.hub-core');
    lines.innerHTML = '';
    docsEl.innerHTML = '';
    groupsEl.innerHTML = '';

    // Desktop: the stage is laid out at full size, then scaled to the wrap.
    let stageHeight = STAGE_MIN_HEIGHT;
    const fit = () => {
      const width = wrap.clientWidth;
      if (!width) return;
      const scale = Math.min(1, width / STAGE_WIDTH);
      wrap.style.height = `${stageHeight * scale}px`;
      stage.style.transform = `scale(${scale})`;
    };

    const groupEls = GROUPS.map((group) => {
      const el = document.createElement('div');
      el.className = 'hub-group';
      el.innerHTML = `<h4>${group.title} <small>${group.sub}</small></h4><ul>${group.items.map(systemItem).join('')}</ul>`;
      groupsEl.appendChild(el);
      return el;
    });
    const groupGap = 10;
    const groupsHeight = groupEls.reduce((sum, el) => sum + el.offsetHeight, 0) + groupGap * (groupEls.length - 1);
    stageHeight = Math.max(STAGE_MIN_HEIGHT, Math.ceil(groupsHeight) + 8);
    const extra = (stageHeight - STAGE_MIN_HEIGHT) / 2;
    const coreX = 548;
    const coreY = 230 + extra;
    stage.style.height = `${stageHeight}px`;
    lines.style.height = `${stageHeight}px`;
    lines.setAttribute('viewBox', `0 0 ${STAGE_WIDTH} ${stageHeight}`);
    core.style.top = `${130 + extra}px`;

    // The documents share the groups' height on the left, each with a
    // curve into the core.
    const top = Math.max(0, (stageHeight - groupsHeight) / 2);
    const docGap = 12;
    const docHeight = (groupsHeight - docGap * (docs.length - 1)) / docs.length;
    const docRight = 290;
    docs.forEach((name, i) => {
      const y = top + i * (docHeight + docGap);
      const mid = Math.round(y + docHeight / 2);
      const el = document.createElement('div');
      el.className = 'hub-doc';
      el.style.top = `${y}px`;
      el.style.height = `${docHeight}px`;
      el.innerHTML = `${docBadge(name)}<span class="dt"><b>${name}</b><small>${DOC_BADGES[name][3]}</small></span>`;
      docsEl.appendChild(el);
      const d = `M${docRight} ${mid} C 380 ${mid}, 390 ${coreY}, ${coreX - 78} ${coreY}`;
      lines.appendChild(svgEl('path', { d }));
      addPulse(lines, d, 2.8, (i * 0.55).toFixed(2), null, reduced);
    });

    // The groups stack on the right, each with a curve out of the core.
    let groupTop = top;
    groupEls.forEach((el, i) => {
      el.style.top = `${groupTop}px`;
      const mid = Math.round(groupTop + el.offsetHeight / 2);
      groupTop += el.offsetHeight + groupGap;
      const left = el.offsetLeft;
      const d = `M${coreX + 78} ${coreY} C ${left - 54} ${coreY}, ${left - 44} ${mid}, ${left} ${mid}`;
      lines.appendChild(svgEl('path', { d }));
      addPulse(lines, d, 2.8, (1.4 + i * 0.55).toFixed(2), 'out', reduced);
    });
    fit();

    const stageObserver = 'ResizeObserver' in window ? new ResizeObserver(fit) : null;
    stageObserver?.observe(wrap);
    window.addEventListener('resize', fit);
    const stagePause = pauseOffscreen(stage, lines);

    // Mobile: documents in a row above the core, groups below it, joined
    // by a spine. Measured from the real layout, and redrawn when it moves.
    const mobile = mobileRef.current;
    mobile.innerHTML = `<svg class="hub-lines hm-lines" aria-hidden="true"></svg><div class="hm-docs">${docs
      .map((name) => `<div class="hm-doc">${docBadge(name)}<b>${name.split(' ')[0]}</b></div>`)
      .join('')}</div><div class="hm-orb"><div class="core-rings"><i></i><i></i><i></i></div><div class="core-in"><img class="core-logo" src="${STAR_LOGO}" alt="" width="132" height="100"><b>Star AI</b><span>Extract, understand, validate</span></div></div><div class="hm-outs">${GROUPS.map(
      (group) =>
        `<div class="hm-group"><h4>${group.title} <small>${group.sub}</small></h4><ul>${group.items
          .slice()
          .sort((a, b) => takesRow(a) - takesRow(b))
          .map(mobileSystemItem)
          .join('')}</ul></div>`
    ).join('')}</div>`;
    const mobileLines = mobile.querySelector('.hm-lines');
    let drawnWidth = 0;
    let drawnHeight = 0;
    const drawMobile = () => {
      const box = mobile.getBoundingClientRect();
      const width = Math.round(box.width);
      const height = Math.round(box.height);
      if (!width || (width === drawnWidth && height === drawnHeight)) return;
      drawnWidth = width;
      drawnHeight = height;
      mobileLines.innerHTML = '';
      mobileLines.setAttribute('viewBox', `0 0 ${width} ${height}`);
      mobileLines.style.width = `${width}px`;
      mobileLines.style.height = `${height}px`;
      const rel = (el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height };
      };
      const orb = rel(mobile.querySelector('.hm-orb .core-in'));
      const spineX = Math.round(orb.x + orb.w / 2);
      const orbTop = Math.round(orb.y);
      const orbBottom = Math.round(orb.y + orb.h);
      mobile.querySelectorAll('.hm-doc').forEach((el, i) => {
        const doc = rel(el);
        const x = Math.round(doc.x + doc.w / 2);
        const y = Math.round(doc.y + doc.h + 4);
        const bend = (orbTop - y) / 2;
        const d = `M${x} ${y} C ${x} ${y + bend}, ${spineX} ${orbTop - bend}, ${spineX} ${orbTop}`;
        mobileLines.appendChild(svgEl('path', { d }));
        addPulse(mobileLines, d, 2.2, (i * 0.45).toFixed(2), null, reduced);
      });
      let spineEnd = orbBottom;
      mobile.querySelectorAll('.hm-group').forEach((el, i) => {
        const group = rel(el);
        const y = Math.round(group.y + group.h / 2);
        const onLeft = group.x + group.w / 2 < spineX;
        const x = Math.round(onLeft ? group.x + group.w : group.x);
        spineEnd = Math.max(spineEnd, y);
        mobileLines.appendChild(svgEl('path', { d: `M${spineX} ${y} L ${x} ${y}` }));
        if (onLeft) mobileLines.appendChild(svgEl('circle', { cx: spineX, cy: y, r: 3.5, class: 'node' }));
        addPulse(
          mobileLines,
          `M${spineX} ${orbBottom} L ${spineX} ${y} L ${x} ${y}`,
          (2 + Math.floor(i / 2) * 0.6).toFixed(2),
          (1.2 + i * 0.5).toFixed(2),
          'out',
          reduced
        );
      });
      mobileLines.insertBefore(svgEl('path', { d: `M${spineX} ${orbBottom} L ${spineX} ${spineEnd}` }), mobileLines.firstChild);
    };
    drawMobile();
    const mobileObserver = 'ResizeObserver' in window ? new ResizeObserver(drawMobile) : null;
    mobileObserver?.observe(mobile);
    mobile.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', drawMobile);
    });
    const mobilePause = pauseOffscreen(mobile, mobileLines);

    return () => {
      stageObserver?.disconnect();
      mobileObserver?.disconnect();
      stagePause?.disconnect();
      mobilePause?.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [reduced, docs]);

  return (
    <div className="hub">
      <div className="scene-wrap hub-desktop" ref={wrapRef}>
        <div
          className="stage hub-stage"
          ref={stageRef}
          role="img"
          aria-label="Diagram: MTRs, COAs, invoices, insurance forms and transcripts flow into Star AI, which extracts, understands and validates them, then sends data to ERP, CRM, workflow and quality systems."
        >
          <svg className="hub-lines" viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_MIN_HEIGHT}`} aria-hidden="true" />
          <div className="hub-docs" />
          <div className="hub-core">
            <div className="core-rings">
              <i />
              <i />
              <i />
            </div>
            <div className="core-in">
              <img className="core-logo" src={STAR_LOGO} alt="" width="132" height="100" />
              <b>Star AI</b>
              <span>Extract, understand, validate</span>
            </div>
          </div>
          <div className="hub-groups" />
        </div>
      </div>
      <div className="hub-mobile" ref={mobileRef} />
    </div>
  );
}
