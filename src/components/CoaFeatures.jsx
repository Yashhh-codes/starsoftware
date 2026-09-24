import React, { useEffect, useRef } from 'react';

function FeatureVideo({ src, label, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const vid = ref.current;
    if (!vid) return;

    // React sets the muted *property* but never renders the attribute, and
    // autoplay policy can read an attribute-less element as unmuted.
    vid.muted = true;
    vid.defaultMuted = true;
    vid.setAttribute('muted', '');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      vid.pause();
      return;
    }

    const resumeOnGesture = () => {
      const retry = () => vid.play().catch(() => {});
      window.addEventListener('pointerdown', retry, { once: true });
      window.addEventListener('keydown', retry, { once: true });
    };

    // Play only while the video is on screen AND its tab is visible. Browsers
    // suspend muted video in hidden tabs, and the observer never re-fires on
    // return because scroll position hasn't changed, so tab visibility has to
    // be tracked separately or the card would stay frozen.
    let onScreen = false;
    const sync = () => {
      if (onScreen && !document.hidden) {
        vid.play().catch(resumeOnGesture);
      } else {
        vid.pause();
      }
    };

    // The section starts below the fold, where browsers defer muted autoplay,
    // so drive playback from visibility. This also stops offscreen decoding.
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.15 }
    );
    observer.observe(vid);
    document.addEventListener('visibilitychange', sync);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      disablePictureInPicture
      disableRemotePlayback
      aria-label={label}
    />
  );
}

export default function CoaFeatures() {
  return (
    <section className="coa-features" aria-labelledby="coa-features-title">
      <div className="section-grid-lines" aria-hidden="true" />

      <div className="coa-features-container">
        <h2 id="coa-features-title" className="coa-features-title">
          Built for Certificate of Analysis workflows
        </h2>

        <div className="coa-features-grid">
          <article className="coa-card coa-card--primary">
            <header className="coa-card-head">
              <p className="coa-card-eyebrow">COA automation</p>
              <h3 className="coa-card-title">Validate every COA automatically</h3>
            </header>
            <div className="coa-card-media coa-card-media--processing">
              <FeatureVideo
                className="coa-video coa-video--processing"
                src="/feature-videos/coa-processing.mp4"
                label="A certificate of analysis captured on a phone and processed in the Star Software dashboard through to QA approval"
              />
            </div>
          </article>

          <article className="coa-card coa-card--secondary">
            <header className="coa-card-head">
              <h3 className="coa-card-title">Process COAs from intake to approval</h3>
            </header>
            <div className="coa-card-media coa-card-media--validation">
              <FeatureVideo
                className="coa-video coa-video--validation"
                src="/feature-videos/coa-validation.mp4"
                label="Star Software validating chemical composition, material grade, heat number, specification and mechanical properties on a COA"
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
