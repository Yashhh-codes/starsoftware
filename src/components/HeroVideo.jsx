import React, { useEffect, useRef, useState } from 'react';

// Preserved for rollback if needed:
// const OLD_VIDEO_1_SRC = '/videos/upscaled-video1.mp4';
// const OLD_VIDEO_2_SRC = '/videos/upscaled-video 2.mp4';
// const VID2_VIDEO_SRC = '/vid2/upscaled-video.mp4';

const VIDEO_1_SRC = '/vid3/upscaled-video (2).mp4';
const VIDEO_2_SRC = '/vid3/upscaled-video (2).mp4';

const IS_SINGLE_VIDEO = VIDEO_1_SRC === VIDEO_2_SRC;

export default function HeroVideo() {
  const containerRef = useRef(null);

  // Single video player ref (used when VIDEO_1_SRC === VIDEO_2_SRC for zero-overhead native hardware loop)
  const singleVideoRef = useRef(null);

  // Dual video player refs (used if VIDEO_1_SRC !== VIDEO_2_SRC)
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  // activeVideo: 1 or 2
  const [activeVideo, setActiveVideo] = useState(1);
  const activeVideoRef = useRef(1);
  activeVideoRef.current = activeVideo;

  const isSwitchingRef = useRef(false);
  const rVfcHandleRef = useRef(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (IS_SINGLE_VIDEO) {
      const vid = singleVideoRef.current;
      if (!vid) return;

      if (prefersReducedMotion) {
        vid.pause();
        return;
      }

      const startPlay = async () => {
        try {
          await vid.play();
        } catch (err) {
          const onFirstInteraction = () => {
            vid.play().catch(() => {});
            window.removeEventListener('click', onFirstInteraction);
            window.removeEventListener('touchstart', onFirstInteraction);
            window.removeEventListener('keydown', onFirstInteraction);
          };
          window.addEventListener('click', onFirstInteraction, { once: true });
          window.addEventListener('touchstart', onFirstInteraction, { once: true });
          window.addEventListener('keydown', onFirstInteraction, { once: true });
        }
      };

      startPlay();

      // Visibility change handling (pause when tab hidden, resume when visible)
      const handleVisibilityChange = () => {
        if (document.hidden) {
          vid.pause();
        } else {
          vid.play().catch(() => {});
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // IntersectionObserver: Pause when hero is scrolled out of view to conserve GPU decoding resources
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              vid.pause();
            } else {
              vid.play().catch(() => {});
            }
          });
        },
        { threshold: 0.1 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        observer.disconnect();
      };
    }

    // Dual video handoff logic (if two different video files are provided)
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    if (prefersReducedMotion) {
      v1.pause();
      v2.pause();
      return;
    }

    // Attempt autoplay for video 1
    const startInitialPlayback = async () => {
      try {
        v1.currentTime = 0;
        await v1.play();
        v2.currentTime = 0;
        v2.pause();
      } catch (err) {
        const onFirstInteraction = () => {
          if (activeVideoRef.current === 1) {
            v1.play();
          } else {
            v2.play();
          }
          window.removeEventListener('click', onFirstInteraction);
          window.removeEventListener('touchstart', onFirstInteraction);
          window.removeEventListener('keydown', onFirstInteraction);
        };
        window.addEventListener('click', onFirstInteraction, { once: true });
        window.addEventListener('touchstart', onFirstInteraction, { once: true });
        window.addEventListener('keydown', onFirstInteraction, { once: true });
      }
    };

    startInitialPlayback();

    // Core seamless transition function
    const switchTo = (target) => {
      if (isSwitchingRef.current) return;
      isSwitchingRef.current = true;

      const currentVid = target === 2 ? v1 : v2;
      const nextVid = target === 2 ? v2 : v1;

      // Start next video immediately
      const playPromise = nextVid.play();

      // Switch active layer
      setActiveVideo(target);
      activeVideoRef.current = target;

      // Once next video is actively playing, safely pause & rewind previous video
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            currentVid.pause();
            currentVid.currentTime = 0;
            isSwitchingRef.current = false;
            // Begin monitoring next video frames
            monitorActiveVideo(nextVid, target === 2 ? 1 : 2);
          })
          .catch((err) => {
            console.error('Error starting video', target, err);
            isSwitchingRef.current = false;
          });
      } else {
        currentVid.pause();
        currentVid.currentTime = 0;
        isSwitchingRef.current = false;
        monitorActiveVideo(nextVid, target === 2 ? 1 : 2);
      }
    };

    // Frame-accurate monitor using requestVideoFrameCallback
    const monitorActiveVideo = (videoElem, nextTarget) => {
      if (!('requestVideoFrameCallback' in HTMLVideoElement.prototype)) {
        return; // Fallback to 'ended' event listener
      }

      const onFrame = (now, metadata) => {
        const expectedCurrent = nextTarget === 2 ? 1 : 2;
        if (activeVideoRef.current !== expectedCurrent) return;

        const duration = videoElem.duration;
        if (duration && metadata.mediaTime >= duration - 0.045) {
          switchTo(nextTarget);
          return;
        }

        rVfcHandleRef.current = videoElem.requestVideoFrameCallback(onFrame);
      };

      rVfcHandleRef.current = videoElem.requestVideoFrameCallback(onFrame);
    };

    monitorActiveVideo(v1, 2);

    // Fallback on standard 'ended' event
    const handleV1Ended = () => {
      if (activeVideoRef.current === 1) {
        switchTo(2);
      }
    };

    const handleV2Ended = () => {
      if (activeVideoRef.current === 2) {
        switchTo(1);
      }
    };

    v1.addEventListener('ended', handleV1Ended);
    v2.addEventListener('ended', handleV2Ended);

    // Visibility change handling
    const handleVisibilityChange = () => {
      if (document.hidden) {
        v1.pause();
        v2.pause();
      } else {
        if (activeVideoRef.current === 1) {
          v1.play().catch(() => {});
          monitorActiveVideo(v1, 2);
        } else {
          v2.play().catch(() => {});
          monitorActiveVideo(v2, 1);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // IntersectionObserver: Pause when hero is scrolled out of view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            v1.pause();
            v2.pause();
          } else {
            if (activeVideoRef.current === 1) {
              v1.play().catch(() => {});
              monitorActiveVideo(v1, 2);
            } else {
              v2.play().catch(() => {});
              monitorActiveVideo(v2, 1);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      v1.removeEventListener('ended', handleV1Ended);
      v2.removeEventListener('ended', handleV2Ended);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="hero-video-wrapper" ref={containerRef}>
      <div className="hero-video-aspect-container">
        {IS_SINGLE_VIDEO ? (
          /* High-performance single-video loop for unified video source */
          <video
            ref={singleVideoRef}
            className="hero-video-element is-active"
            src={VIDEO_1_SRC}
            muted
            playsInline
            autoPlay
            loop
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            aria-label="Star Software Document Automation Visual"
          />
        ) : (
          /* Dual-video handoff logic for two separate segment videos */
          <>
            <video
              ref={video1Ref}
              className={`hero-video-element ${activeVideo === 1 ? 'is-active' : 'is-standby'}`}
              src={VIDEO_1_SRC}
              muted
              playsInline
              autoPlay
              preload="auto"
              aria-label="Star Software Document Automation Visual - Part 1"
            />
            <video
              ref={video2Ref}
              className={`hero-video-element ${activeVideo === 2 ? 'is-active' : 'is-standby'}`}
              src={VIDEO_2_SRC}
              muted
              playsInline
              preload="auto"
              aria-label="Star Software Document Automation Visual - Part 2"
            />
          </>
        )}
      </div>
    </div>
  );
}
