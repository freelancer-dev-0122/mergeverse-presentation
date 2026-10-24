import { useCallback, useEffect, useRef, useState } from 'react';
import './CinematicOpening.css';

/**
 * CinematicOpening Component (STEP 8)
 * 4.5-second cinematic prelude before the hero:
 * - Phase 0 (0-0.6s): Deep darkened landscape, vignette, slow golden canvas fireflies.
 * - Phase 1 (0.6-1.8s): Chrome-and-gold MERGEVERSE wordmark fades in with sweeping light streak,
 *   followed by staggered tagline: "EXPLORE. SOLVE. DISCOVER."
 * - Phase 2 (1.8-3.4s): Background un-darkens (brightness 1, blur 0, scale 1), soft diagonal light rays, falling leaves.
 * - Phase 3 (3.4-4.5s): Circular curtain reveal unveils the live hero; triggers html.intro-done.
 *
 * Failsafe: Hard 7-second auto-dismissal timeout.
 * Session: sessionStorage ensures it plays once per session, bypassable with ?intro=1.
 */
export default function CinematicOpening({ onComplete }) {
  const [phase, setPhase] = useState('loading'); // 'loading' | 'phase0' | 'phase1' | 'phase2' | 'phase3'
  const [showSkip, setShowSkip] = useState(false);
  const [taglineWords, setTaglineWords] = useState({ explore: false, solve: false, discover: false });
  const [isCurtainRevealing, setIsCurtainRevealing] = useState(false);

  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const isCompletedRef = useRef(false);
  const firefliesRef = useRef([]);
  const timersRef = useRef([]);

  // Complete and remove intro safely
  const finishSequence = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;

    // Clear all pending timers immediately
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    // Cancel canvas animation immediately
    if (animFrameIdRef.current) {
      window.cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }

    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem('mv_intro_played', 'true');
      }
    } catch {
      // Ignore sessionStorage exceptions in strict/incognito modes
    }

    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  // Skip handler (fast forward with short curtain exit)
  const handleSkip = useCallback(() => {
    if (isCompletedRef.current) return;
    setIsCurtainRevealing(true);
    setTimeout(() => {
      finishSequence();
    }, 350);
  }, [finishSequence]);

  // Esc key listener for keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  // Failsafe: Maximum 7-second timeout guarantees the site is NEVER blocked
  useEffect(() => {
    const failsafeTimer = setTimeout(() => {
      finishSequence();
    }, 7000);
    return () => clearTimeout(failsafeTimer);
  }, [finishSequence]);

  // Sequence Timeline Choreography
  const startTimeline = useCallback(() => {
    // 0.6s: Skip button appears, transition to Phase 1 (Wordmark + Sweep Streak)
    timersRef.current.push(
      setTimeout(() => {
        setShowSkip(true);
        setPhase('phase1');
      }, 600)
    );

    // 1.3s: Tagline word "EXPLORE."
    timersRef.current.push(
      setTimeout(() => {
        setTaglineWords((prev) => ({ ...prev, explore: true }));
      }, 1300)
    );

    // 1.55s: Tagline word "SOLVE." (+250ms)
    timersRef.current.push(
      setTimeout(() => {
        setTaglineWords((prev) => ({ ...prev, solve: true }));
      }, 1550)
    );

    // 1.8s: Tagline word "DISCOVER." (+250ms) & Phase 2 Begins (Un-darken, rays, leaves)
    timersRef.current.push(
      setTimeout(() => {
        setTaglineWords((prev) => ({ ...prev, discover: true }));
        setPhase('phase2');
      }, 1800)
    );

    // 3.4s: Phase 3 Begins (Curtain reveal)
    timersRef.current.push(
      setTimeout(() => {
        setPhase('phase3');
        setIsCurtainRevealing(true);
      }, 3400)
    );

    // 4.5s: Complete sequence & unmount
    timersRef.current.push(
      setTimeout(() => {
        finishSequence();
      }, 4500)
    );
  }, [finishSequence]);

  // Preload hero background image with max 2.5s wait
  useEffect(() => {
    let isCancelled = false;
    let resolved = false;

    const startSequence = () => {
      if (isCancelled || isCompletedRef.current || resolved) return;
      resolved = true;
      setPhase('phase0');
      startTimeline();
    };

    const maxTimer = setTimeout(startSequence, 2500);

    try {
      const img = new Image();
      const onLoaded = () => {
        if (img.decode) {
          img.decode().then(startSequence).catch(startSequence);
        } else {
          startSequence();
        }
      };
      img.onload = onLoaded;
      img.onerror = startSequence;
      img.src = '/images/mergeverse-title.jpg';

      if (img.complete) {
        onLoaded();
      }
    } catch {
      startSequence();
    }

    return () => {
      isCancelled = true;
      clearTimeout(maxTimer);
    };
  }, [startTimeline]);

  // Golden Fireflies Canvas (50 desktop, 25 mobile, DPR capped at 2)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const isMobile = width <= 768;
    const count = isMobile ? 25 : 50;

    firefliesRef.current = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: -0.2 - Math.random() * 0.4, // Gentle upward drift
      radius: 1.2 + Math.random() * 2.2,
      baseAlpha: 0.35 + Math.random() * 0.5,
      pulseSpeed: 0.015 + Math.random() * 0.03,
      phaseOffset: Math.random() * Math.PI * 2,
    }));

    let frameCount = 0;
    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      const fireflies = firefliesRef.current;
      for (let i = 0; i < fireflies.length; i++) {
        const f = fireflies[i];
        f.x += f.vx + Math.sin(frameCount * 0.02 + f.phaseOffset) * 0.25;
        f.y += f.vy;

        // Wrap around boundaries smoothly
        if (f.x < -10) f.x = width + 10;
        if (f.x > width + 10) f.x = -10;
        if (f.y < -10) f.y = height + 10;
        if (f.y > height + 10) f.y = -10;

        const currentAlpha = f.baseAlpha + Math.sin(frameCount * f.pulseSpeed + f.phaseOffset) * 0.3;
        const alpha = Math.max(0.1, Math.min(0.95, currentAlpha));

        // Soft golden glow circle
        const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius * 3.8);
        glow.addColorStop(0, `rgba(255, 244, 208, ${alpha})`);
        glow.addColorStop(0.35, `rgba(233, 173, 72, ${alpha * 0.8})`);
        glow.addColorStop(1, 'rgba(233, 173, 72, 0)');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius * 3.8, 0, Math.PI * 2);
        ctx.fill();

        // Core bright center
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius * 0.65, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!isCompletedRef.current) {
        animFrameIdRef.current = window.requestAnimationFrame(render);
      }
    };

    animFrameIdRef.current = window.requestAnimationFrame(render);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        window.cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`cinematic-intro-overlay phase-${phase} ${isCurtainRevealing ? 'is-curtain-revealing' : ''}`}
      aria-hidden="true"
    >
      {/* Background painted alpine landscape with dynamic CSS filters */}
      <div className="intro-backdrop-layer">
        <img
          src="/images/mergeverse-title.jpg"
          alt=""
          className="intro-backdrop-image"
          loading="eager"
          decoding="sync"
        />
        {/* Dark teal-green vignette scrim */}
        <div className="intro-vignette-scrim" />

        {/* Soft diagonal sunbeam light rays (fades in during Phase 2) */}
        <div className="intro-sunbeams-layer" />

        {/* Floating gentle amber leaf shapes (active in Phase 2) */}
        <div className="intro-leaves-layer">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="intro-leaf"
              style={{
                '--leaf-x': `${12 + i * 16}%`,
                '--leaf-delay': `${i * 0.35}s`,
                '--leaf-duration': `${4.5 + (i % 3) * 1.2}s`,
                '--leaf-scale': `${0.75 + (i % 3) * 0.25}`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Canvas for golden fireflies */}
      <canvas ref={canvasRef} className="intro-fireflies-canvas" />

      {/* Center Cinematic Wordmark & Tagline Lockup */}
      <div className="intro-content-center">
        {/* Decorative Gold Flourish Line */}
        <div className="intro-crest-lockup">
          <span className="intro-flourish left" />
          <span className="intro-star">✦</span>
          <span className="intro-flourish right" />
        </div>

        {/* MERGEVERSE Monumental Title with Chrome-and-Gold Gradient */}
        <div className="intro-title-wrapper">
          <h2 className="intro-wordmark-title">MERGEVERSE</h2>

          {/* Golden light streak with sparkling glint that sweeps across */}
          <div className="intro-light-streak-track">
            <div className="intro-light-streak-beam" />
            <div className="intro-light-sparkle-glint" />
          </div>
        </div>

        {/* Staggered Tagline: EXPLORE. SOLVE. DISCOVER. (250ms apart) */}
        <div className="intro-tagline-trio">
          <span className={`tagline-word ${taglineWords.explore ? 'is-revealed' : ''}`}>
            EXPLORE.
          </span>
          <span className="tagline-dot" aria-hidden="true">·</span>
          <span className={`tagline-word ${taglineWords.solve ? 'is-revealed' : ''}`}>
            SOLVE.
          </span>
          <span className="tagline-dot" aria-hidden="true">·</span>
          <span className={`tagline-word ${taglineWords.discover ? 'is-revealed' : ''}`}>
            DISCOVER.
          </span>
        </div>
      </div>

      {/* Accessible Skip Button (bottom-right, visible after 0.6s) */}
      <button
        type="button"
        className={`intro-skip-button ${showSkip ? 'is-visible' : ''}`}
        onClick={handleSkip}
        aria-label="Skip cinematic opening sequence"
      >
        <span>Skip</span>
        <span className="skip-arrow" aria-hidden="true">→</span>
      </button>
    </div>
  );
}
