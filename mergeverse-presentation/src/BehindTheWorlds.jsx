import { useEffect, useRef, useState } from 'react';
import './BehindTheWorlds.css';

const CREATIVE_THEMES = [
  {
    roman: 'I',
    name: 'Agriculture',
    icon: '🌱',
    theme: 'Cultivation & Settlement',
    desc: 'Timber barns, grain silos, furrow irrigation, and cliffside freshwater waterfalls.',
  },
  {
    roman: 'II',
    name: 'Food & Culinary',
    icon: '👨‍🍳',
    theme: 'Nutrition & Gastronomy',
    desc: 'Cobblestone piazzas, clay bakehouses, flatbreads, sourdough loaves, and market stalls.',
  },
  {
    roman: 'III',
    name: 'Healthcare & Medicine',
    icon: '🩺',
    theme: 'Healing & Vitality',
    desc: 'Clinical pavilions, emergency bays, mountain bridges, and medicinal apothecary gardens.',
  },
  {
    roman: 'IV',
    name: 'Assistive Technology',
    icon: '♿',
    theme: 'Universal Design & Empowerment',
    desc: 'Inclined stone ramps, timber guildhalls, waterwheels, and adaptive engineering mechanisms.',
  },
];

const COLOR_PALETTE = [
  {
    name: 'Deep Forest Emerald',
    hex: '#091c14',
    token: 'var(--green-900)',
    border: 'rgba(233, 173, 72, 0.4)',
  },
  {
    name: 'Warm Parchment',
    hex: '#faf6ee',
    token: 'var(--cream-50)',
    border: 'rgba(233, 173, 72, 0.4)',
  },
  {
    name: 'Sunlit Gold',
    hex: '#e9ad48',
    token: 'var(--gold-500)',
    border: 'rgba(255, 244, 208, 0.6)',
  },
  {
    name: 'Living Alpine Teal',
    hex: '#4e9d86',
    token: 'var(--ocean-500)',
    border: 'rgba(233, 173, 72, 0.4)',
  },
];

const ATELIER_TIMELINE = [
  {
    phase: '01',
    stage: 'Concept & Lore',
    tool: 'ChatGPT / GPT',
    badge: 'Narrative Architecture',
    summary:
      'Conceived the civilizational merge premise, historical discovery lore, and prompt design for world themes.',
  },
  {
    phase: '02',
    stage: 'Visual Mood & UI',
    tool: 'Gemini & Stitch',
    badge: 'Art Direction',
    summary:
      'Gemini inspired alpine golden hour lighting sweeps; Stitch enabled rapid screen layouts and tactical tray prototyping.',
  },
  {
    phase: '03',
    stage: 'Interface Engine',
    tool: 'React.js',
    badge: 'Component Atelier',
    summary:
      'Structured modular components, reactive realm beacons, modal lightboxes, and smooth expedition telemetry states.',
  },
  {
    phase: '04',
    stage: 'Cascade Logic & Motion',
    tool: 'Claude',
    badge: 'Architecture Copilot',
    summary:
      'Architected 5×6 merge cascades, validated recipe progression tiers, and refined GSAP ScrollTrigger timeline coordinates.',
  },
  {
    phase: '05',
    stage: 'Agentic Engineering',
    tool: 'Google Antigravity & IDE',
    badge: 'Autonomous Workspace',
    summary:
      'Google Antigravity implemented components and layouts while Antigravity IDE provided editing, live Vite testing, and validation.',
  },
];

export default function BehindTheWorlds({ onOpenModal: _onOpenModal = () => {} } = {}) {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const [visibleMarkers, setVisibleMarkers] = useState({ 1: false, 2: false, 3: false });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (timelineRef.current) {
        timelineRef.current.style.setProperty('--timeline-progress', '100%');
      }
      setVisibleMarkers({ 1: true, 2: true, 3: true });
      if (containerRef.current) {
        containerRef.current.querySelectorAll('.reveal').forEach((el) => {
          el.classList.add('is-visible');
        });
      }
      return;
    }

    let ticking = false;
    const handleScroll = () => {
      if (!timelineRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!timelineRef.current) return;
          const rect = timelineRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const totalHeight = rect.height;

          // Compute timeline line progress and update directly on style property
          const currentPos = windowHeight * 0.6 - rect.top;
          const progress = Math.min(Math.max((currentPos / totalHeight) * 100, 0), 100);
          timelineRef.current.style.setProperty('--timeline-progress', `${progress}%`);

          // Check chapter node activations (once active, remain active)
          const isNodeInView = (id) => {
            const el = document.getElementById(id);
            if (!el) return false;
            const r = el.getBoundingClientRect();
            return r.top < windowHeight * 0.82;
          };

          setVisibleMarkers((prev) => ({
            1: prev[1] || isNodeInView('chapter-node-1'),
            2: prev[2] || isNodeInView('chapter-node-2'),
            3: prev[3] || isNodeInView('chapter-node-3'),
          }));

          // Reveal any .reveal elements within view
          if (containerRef.current) {
            containerRef.current.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
              const r = el.getBoundingClientRect();
              if (r.top < windowHeight * 0.9) {
                el.classList.add('is-visible');
              }
            });
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Safety net fallback: ensure all chapters and headers become visible even if scroll is missed
    const safetyTimer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.querySelectorAll('.reveal').forEach((el) => {
          el.classList.add('is-visible');
        });
      }
      setVisibleMarkers((prev) => ({
        1: prev[1] || true,
        2: prev[2] || true,
        3: prev[3] || true,
      }));
    }, 450);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <section
      id="behind-the-worlds"
      className="section section--dark"
      ref={containerRef}
      aria-label="Behind the Worlds — The Making of MERGEVERSE"
    >
      <div className="section-container">
        {/* 1. OVERARCHING SECTION HEADER */}
        <div className="reveal is-visible" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div className="eyebrow">
            <span className="eyebrow-star">✦</span>
            <span>BEHIND THE WORLDS · THE CREATOR STORY</span>
            <span className="eyebrow-star">✦</span>
          </div>
          <h2 className="section-title">Every World Starts with an Idea</h2>
          <p className="section-lead">
            Discover the creative direction, authentic tools, and human vision behind the making of MERGEVERSE.
          </p>
        </div>

        {/* 2. STORY TIMELINE */}
        <div
          ref={timelineRef}
          className="story-timeline"
          style={{ '--timeline-progress': '0%' }}
        >
          {/* Scroll-driven gold timeline track */}
          <div className="story-timeline__track" aria-hidden="true">
            <div className="story-timeline__progress" />
          </div>

          {/* -----------------------------------------------------------------
              CHAPTER I: THE VISION
              2-Column: Text Left, Four Pillars Matrix Right
              ----------------------------------------------------------------- */}
          <article
            id="chapter-node-1"
            className={`story-chapter reveal ${visibleMarkers[1] ? 'is-visible is-active' : ''}`}
            aria-label="Chapter I: The Vision"
          >
            <div className="story-chapter__marker" aria-hidden="true">
              <span>I</span>
            </div>

            <div className="story-chapter__grid">
              {/* Text Column */}
              <div className="story-chapter__content">
                <div className="eyebrow" style={{ marginBottom: 'var(--space-2)' }}>
                  CHAPTER I · THE GENESIS & ARTISTIC VISION
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 700, lineHeight: 1.25, color: 'var(--cream-50)', margin: '0 0 var(--space-3)' }}>
                  Rethinking the Merge Genre as Human Heritage
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 var(--space-3)' }}>
                  Traditional puzzle-merge games rely on match-3 tropes: abstract candies, glittering diamonds, or fantasy critters. With <strong style={{ color: 'var(--cream-50)' }}>MERGEVERSE</strong>, creator and director <strong style={{ color: 'var(--cream-50)' }}>Vikas</strong> committed to a fundamentally different artistic ethos: transforming the historical milestones of human civilization into a tactile, thoughtful puzzle adventure.
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 var(--space-4)' }}>
                  Guided by the studio tagline <em style={{ fontStyle: 'italic', color: 'var(--gold-300)' }}>“EXPLORE. SOLVE. DISCOVER.”</em>, players progress through the tangible evolution of human ingenuity. Combining wild grasses and hearthstone ovens yields harvest nutrition; synthesizing apothecary herbs advances clinical medicine; crafting timber wheels establishes universal accessibility.
                </p>

                <blockquote className="creator-manifesto-quote">
                  <span className="quote-mark">“</span>
                  <p className="quote-body">
                    I wanted every merge to feel like an authentic breakthrough of human resilience—connecting ancient soil to universal adaptive design.
                  </p>
                  <cite className="quote-signature">— Vikas, Creator & Director</cite>
                </blockquote>

                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
                  <span className="badge badge--muted">💡 Planning & Lore: GPT / ChatGPT</span>
                  <span className="badge badge--muted">🎨 Art Direction: Gemini & Stitch</span>
                </div>
              </div>

              {/* Visual Anchor: Four Pillars of Human Advance */}
              <div className="story-chapter__visuals">
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--gold-500)', textTransform: 'uppercase' }}>
                    FOUR PILLARS OF HUMAN ADVANCE
                  </span>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--muted)', margin: '2px 0 0' }}>
                    Curated Historical Themes
                  </p>
                </div>

                <div className="pillars-grid">
                  {CREATIVE_THEMES.map((theme) => (
                    <div key={theme.roman} className="card--glass pillar-card">
                      <div className="pillar-card__header">
                        <span className="pillar-card__roman">REALM {theme.roman}</span>
                        <span className="pillar-card__icon" aria-hidden="true">{theme.icon}</span>
                      </div>
                      <h4 className="pillar-card__title">{theme.name}</h4>
                      <span className="pillar-card__sub">{theme.theme}</span>
                      <p className="pillar-card__desc">{theme.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* -----------------------------------------------------------------
              CHAPTER II: THE VISUAL DIRECTION
              2-Column: Image Left, Text & Palette Right (Reversed on desktop)
              ----------------------------------------------------------------- */}
          <article
            id="chapter-node-2"
            className={`story-chapter story-chapter--reverse reveal ${visibleMarkers[2] ? 'is-visible is-active' : ''}`}
            aria-label="Chapter II: The Visual Direction"
          >
            <div className="story-chapter__marker" aria-hidden="true">
              <span>II</span>
            </div>

            <div className="story-chapter__grid">
              {/* Image Side (Left on Desktop, Top on Mobile) */}
              <div className="story-chapter__visuals">
                <div className="media-frame" style={{ aspectRatio: '16 / 10' }}>
                  <img
                    src="/images/mergeverse-title.jpg"
                    alt="MERGEVERSE Alpine landscape showing golden hour light across peaks and meadows"
                    className="media-frame__img"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="media-frame__badge badge badge--gold" style={{ background: 'rgba(9, 28, 20, 0.88)' }}>
                    Approved Director's Mood Reference
                  </div>
                </div>
                <div style={{ padding: 'var(--space-3) var(--space-2) 0' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', lineHeight: 1.55, color: 'var(--muted)', margin: 0 }}>
                    Golden hour backlighting, alpine conifer slopes, and pastoral valley meadows establishing the environmental tone.
                  </p>
                </div>
              </div>

              {/* Text Side (Right on Desktop, Bottom on Mobile) */}
              <div className="story-chapter__content">
                <div className="eyebrow" style={{ marginBottom: 'var(--space-2)' }}>
                  CHAPTER II · VISUAL DIRECTION
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 700, lineHeight: 1.25, color: 'var(--cream-50)', margin: '0 0 var(--space-3)' }}>
                  Alpine Horizons & Cinematic Lighting
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 var(--space-3)' }}>
                  The visual identity of MERGEVERSE was inspired by cinematic concepts explored through <strong style={{ color: 'var(--cream-50)' }}>Gemini</strong>. Rather than flat, hyper-saturated mobile graphics, Vikas established an atmospheric palette of deep forest emerald, warm parchment, sunlit gold, and living alpine teal.
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 var(--space-4)' }}>
                  Screen wireframes and tactical puzzle trays were iteratively tested in <strong style={{ color: 'var(--cream-50)' }}>Stitch</strong> to ensure spatial balance, legibility, and satisfying tactile proportions before engineering frontend components.
                </p>

                {/* 4 Circular Palette Swatches */}
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--gold-500)', textTransform: 'uppercase' }}>
                    CURATED COLOR SYSTEM
                  </span>
                  <div className="palette-swatches-grid">
                    {COLOR_PALETTE.map((swatch) => (
                      <div key={swatch.name} className="palette-swatch-item">
                        <div
                          className="palette-swatch-item__circle"
                          style={{ backgroundColor: swatch.token, borderColor: swatch.border }}
                          title={swatch.name}
                        />
                        <span className="palette-swatch-item__name">{swatch.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Small Glass Tool Chips */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="card--glass" style={{ padding: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.4rem' }}>🌌</span>
                    <div>
                      <strong style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 'var(--text-small)', color: 'var(--cream-50)' }}>Gemini</strong>
                      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)' }}>Cinematic Lighting & World References</span>
                    </div>
                  </div>
                  <div className="card--glass" style={{ padding: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.4rem' }}>📐</span>
                    <div>
                      <strong style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 'var(--text-small)', color: 'var(--cream-50)' }}>Stitch</strong>
                      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)' }}>UI Screen Hierarchy & Tactical Trays</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* -----------------------------------------------------------------
              CHAPTER III: FROM THOUGHT TO PLAYABLE
              2-Column: Development Steps Left, AI Direction Manifesto Right
              ----------------------------------------------------------------- */}
          <article
            id="chapter-node-3"
            className={`story-chapter reveal ${visibleMarkers[3] ? 'is-visible is-active' : ''}`}
            aria-label="Chapter III: From Thought to Playable"
          >
            <div className="story-chapter__marker" aria-hidden="true">
              <span>III</span>
            </div>

            <div className="story-chapter__grid">
              {/* Development Steps Side */}
              <div className="story-chapter__content">
                <div className="eyebrow" style={{ marginBottom: 'var(--space-2)' }}>
                  CHAPTER III · THE DEVELOPMENT ATELIER
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 700, lineHeight: 1.25, color: 'var(--cream-50)', margin: '0 0 var(--space-3)' }}>
                  From Thought to Playable Reality
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 var(--space-4)' }}>
                  A disciplined, transparent chronicle of how AI reasoning copilots and human creative vision converged.
                </p>

                <div className="atelier-steps-stack">
                  {ATELIER_TIMELINE.map((step) => (
                    <div key={step.phase} className="card--glass atelier-step-card">
                      <div className="atelier-step-card__top">
                        <span className="badge badge--gold" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                          Phase {step.phase}
                        </span>
                        <span className="atelier-step-card__stage">{step.stage}</span>
                        <span className="badge badge--muted" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                          {step.badge}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                        <span className="atelier-step-card__tool">{step.tool}:</span>
                        <p className="atelier-step-card__desc">{step.summary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manifesto & Architecture Side */}
              <div className="story-chapter__visuals">
                <div className="card--glass" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-card)', border: '1.5px solid rgba(233, 173, 72, 0.45)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                    <span style={{ color: 'var(--gold-500)', fontSize: '1.4rem' }}>✦</span>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--cream-50)', margin: 0 }}>
                      Transparent AI-Assisted Direction
                    </h4>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', lineHeight: 1.65, color: 'var(--muted)', margin: '0 0 var(--space-4)' }}>
                    MERGEVERSE was directed by Vikas through an open, transparent workflow. Rather than manually writing boilerplate code in isolation, Vikas orchestrated AI reasoning copilots, creative prompt architectures, and UI prototypes to build a high-production indie-game experience. Every decision, mechanic, and line of code was reviewed, refined, and validated against the authentic vision.
                  </p>

                  <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid rgba(233, 173, 72, 0.2)' }}>
                    <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--gold-500)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
                      Production Architecture Stack
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      <span className="badge badge--gold">React 18</span>
                      <span className="badge badge--gold">Vite 8</span>
                      <span className="badge badge--muted">GSAP Motion</span>
                      <span className="badge badge--muted">Vanilla CSS Tokens</span>
                      <span className="badge badge--gold">Google Antigravity</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* 3. CLOSING ACTION NAVIGATION STRIP */}
        <div className="btw-action-strip reveal is-visible">
          <a href="#hero" className="btn btn--gold">
            <span>↑ RETURN TO OPENING</span>
          </a>
          <a href="#four-realms-ocean" className="btn btn--ghost">
            <span>✦ EXPLORE THE FOUR REALMS</span>
          </a>
          <a href="#gameplay-progression-showcase" className="btn btn--ghost">
            <span>✦ INSPECT GAMEPLAY MECHANICS</span>
          </a>
        </div>
      </div>
    </section>
  );
}
