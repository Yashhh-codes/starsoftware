import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ExternalLink, FlaskConical, Scale, Sparkles } from 'lucide-react';
import { useInView, usePrefersReducedMotion } from '../../hooks/useMotion';
import SecHead from '../mtrx/SecHead';
import { C_REGS } from '../../data/coaX';

const ADVANCE_MS = 6500;

// The part every code shares ("21 CFR ", "ISO 9001 · "), cut at a word
// boundary, so the index can name it once and list what differs.
function sharedPrefix(codes) {
  if (codes.length < 2) return '';
  let p = codes[0];
  codes.forEach((c) => {
    while (!c.startsWith(p)) p = p.slice(0, -1);
  });
  p = p.slice(0, p.lastIndexOf(' ') + 1);
  return p.length >= 4 && codes.every((c) => c.length > p.length) ? p : '';
}

// Pick an industry: its photo, a sample COA with the regulations pinned to
// the parts they are about, and the open regulation in detail. The
// regulations, then the industries, advance on their own while on screen.
export default function Regulations() {
  const [ind, setInd] = useState(0);
  const [reg, setReg] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.3 });
  const reduced = usePrefersReducedMotion();
  const running = inView && !paused && !reduced;
  const I = C_REGS.industries[ind];
  const R = I.regs[reg];
  const prefix = sharedPrefix(I.regs.map((r) => r.code));

  useEffect(() => {
    if (!running) return undefined;
    const t = window.setTimeout(() => {
      if (reg + 1 < I.regs.length) setReg(reg + 1);
      else {
        setReg(0);
        setInd((ind + 1) % C_REGS.industries.length);
      }
    }, ADVANCE_MS);
    return () => window.clearTimeout(t);
  }, [running, reg, ind, I]);

  const pickInd = (i) => {
    setInd(i);
    setReg(0);
  };
  const pinsFor = (zone) =>
    I.regs.map((r, k) => [r, k]).filter(([r]) => r.zone === zone).map(([r, k]) => (
      <button key={r.code} type="button" className={`cxr-pin${k === reg ? ' is-on' : ''}`} onClick={() => setReg(k)}>
        <Scale size={11} aria-hidden="true" />
        {r.code}
      </button>
    ));

  return (
    <section id="regulations" className="mx-sec cxr" aria-labelledby="cxr-title">
      <div className="mt-wrap">
        <SecHead id="cxr-title" label={C_REGS.kicker} title={C_REGS.title} accent={C_REGS.titleEnd} lead={C_REGS.lead} />

        <div className="cxr-tabs" role="tablist" aria-label="Industry" data-reveal>
          {C_REGS.industries.map((x, i) => (
            <button key={x.name} type="button" role="tab" aria-selected={i === ind} className={i === ind ? 'is-on' : ''} onClick={() => pickInd(i)}>
              <img src={x.img} alt="" loading="lazy" />
              <span>{x.name}</span>
            </button>
          ))}
        </div>

        <div ref={ref} className="cxr-board" data-reveal="scale" style={{ '--rv-delay': '100ms' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="cxr-photo" key={`p${ind}`}>
            <img src={I.img} alt="" loading="lazy" />
            <div className="cxr-photo-t">
              <small>{I.name}</small>
              <p>{I.line}</p>
            </div>
          </div>

          <div className="cxr-coa" key={`c${ind}`}>
            <div className="cxr-coa-top">
              <span aria-hidden="true">
                <FlaskConical size={15} />
              </span>
              <div>
                <b>Certificate of analysis</b>
                <small>Supplier quality release</small>
              </div>
            </div>
            <div className={`cxr-z${R.zone === 'supplier' ? ' is-on' : ''}`}>
              <small>Supplier</small>
              <b>{I.supplier}</b>
              <div className="cxr-pins">{pinsFor('supplier')}</div>
            </div>
            <div className={`cxr-z${R.zone === 'product' ? ' is-on' : ''}`}>
              <small>Product and batch</small>
              <b>{I.product}</b>
              <div className="cxr-pins">{pinsFor('product')}</div>
            </div>
            <div className={`cxr-z cxr-z--tests${R.zone === 'tests' ? ' is-on' : ''}`}>
              <small>Test results</small>
              <div className="cxr-tt">
                {I.tests.map(([t, spec, res]) => (
                  <p key={t}>
                    <span>{t}</span>
                    <span>{spec}</span>
                    <b>{res}</b>
                  </p>
                ))}
              </div>
              <div className="cxr-pins">{pinsFor('tests')}</div>
            </div>
          </div>

          <div className="cxr-detail" key={`d${ind}-${reg}`}>
            {I.regs.length > 1 && new Set(I.regs.map((r) => r.code)).size === I.regs.length && (
              <div className="cxr-index">
                <p>
                  Applicable regulations{prefix && <b>{prefix.replace(/[\s·]+$/, '')}</b>}
                  <span>
                    {reg + 1} / {I.regs.length}
                  </span>
                </p>
                <div className="cxr-seg" role="tablist" aria-label={`Regulations for ${I.name.toLowerCase()}`}>
                  {I.regs.map((r, k) => (
                    <button key={r.code} type="button" role="tab" aria-selected={k === reg} className={k === reg ? 'is-on' : ''} onClick={() => setReg(k)} title={r.title}>
                      {r.code
                        .slice(prefix.length)
                        .replace(/^[\s·]+/, '')
                        .split(' · ')
                        .map((part) => (
                          <span key={part}>{part}</span>
                        ))}
                      {k === reg && <u key={`${ind}-${reg}-${running}`} className={running ? 'is-run' : ''} style={{ animationDuration: `${ADVANCE_MS}ms` }} aria-hidden="true" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="cxr-d-top">
              <span className="cxr-d-ic" aria-hidden="true">
                <Scale size={17} />
              </span>
              <div>
                <small>Regulation</small>
                <b>{R.code}</b>
                <p>{R.title}</p>
              </div>
            </div>
            <div className="cxr-d-row">
              <small>What is required</small>
              <p>{R.req}</p>
            </div>
            <div className="cxr-d-row cxr-d-row--star">
              <small>
                <Sparkles size={12} aria-hidden="true" />
                How Star helps
              </small>
              <p>{R.how}</p>
            </div>
            {R.note && <p className="cxr-note">{R.note}</p>}
            <div className="cxr-links">
              {R.link && (
                <a href={R.link[1]} target="_blank" rel="noopener noreferrer">
                  {R.link[0]}
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              )}
              {I.href && (
                <a href={I.href} className="cxr-link-ind">
                  Explore {I.name.toLowerCase()}
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              )}
            </div>
            <i className="cxr-prog" aria-hidden="true">
              <u key={`${ind}-${reg}-${running}`} className={running ? 'is-run' : ''} style={{ animationDuration: `${ADVANCE_MS}ms` }} />
            </i>
          </div>
        </div>
      </div>
    </section>
  );
}
