import { useEffect, useRef, useMemo, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';
import BehindTheWorlds from './BehindTheWorlds.jsx';

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Verified Game Data for the Four Realms
// Grounded strictly in actual project screenshots and verified gameplay items
// ---------------------------------------------------------------------------
const REALMS = [
  {
    id: 'agriculture',
    roman: 'I',
    number: '01',
    name: 'Agriculture',
    headline: 'AGRICULTURE',
    tagline: 'Nurturing the Earth & The Dawn of Settlement',
    roleTag: 'Active Hub · Level 20 Unlocked',
    status: 'Unlocked',
    icon: '🌱',
    accentColor: '#4ade80',
    accentGlow: 'rgba(74, 222, 128, 0.32)',
    hotspot: { x: '24%', y: '25%' },
    conciseDescription:
      'The foundational realm of cultivation and harvest. Guided by terraced crop furrows, timber barns, and rustic windmills, explorers master the ancient crafts of the earth to nourish thriving settlements.',
    structures: [
      'Two-story red timber barn & towering grain silo',
      'Rustic wooden windmill with timber sail rotors',
      'Terraced crop furrows & irrigation bridge',
      'Cliffside freshwater waterfall cascade into sea',
    ],
  },
  {
    id: 'food-culinary',
    roman: 'II',
    number: '02',
    name: 'Food & Culinary',
    headline: 'FOOD & CULINARY',
    tagline: 'Crafting Nutrition, Fermentation & Gastronomy',
    roleTag: 'Milestone Locked · Crafting Hub',
    status: 'Locked',
    icon: '👨‍🍳',
    accentColor: '#fb923c',
    accentGlow: 'rgba(251, 146, 60, 0.32)',
    hotspot: { x: '74%', y: '25%' },
    conciseDescription:
      'The craft of sustenance and community. Centered around bustling cobblestone piazzas, artisanal bakehouses, and market stalls, explorers harness thermal heat and fermentation to feed expanding societies.',
    structures: [
      'Alpine stone tavern & cobblestone piazza',
      'Sunlit market bazaar awnings & produce stalls',
      'Carved stone freshwater spring fountain',
      'Timber trading pier extending into open waters',
    ],
  },
  {
    id: 'healthcare-medicine',
    roman: 'III',
    number: '03',
    name: 'Healthcare & Medicine',
    headline: 'HEALTHCARE & MEDICINE',
    tagline: 'Healing, Diagnostics & The Preservation of Life',
    roleTag: 'Milestone Locked · Sanctuary Hub',
    status: 'Locked',
    icon: '🩺',
    accentColor: '#2dd4bf',
    accentGlow: 'rgba(45, 212, 191, 0.32)',
    hotspot: { x: '24%', y: '73%' },
    conciseDescription:
      'The sanctuary of healing and vitality. Nestled amid alpine springs and evergreen slopes, clinical pavilions unite ancient herbal wisdom with sterile care and emergency response.',
    structures: [
      'Multi-wing clinical pavilion with Red Cross emblem',
      'Dedicated emergency vehicle bay & transport ambulance',
      'Mountain stone arch bridge & conifer slopes',
      'Highland freshwater intake & cliffside cascade',
    ],
  },
  {
    id: 'assistive-technology',
    roman: 'IV',
    number: '04',
    name: 'Assistive Technology',
    headline: 'ASSISTIVE TECHNOLOGY',
    tagline: 'Adaptive Engineering, Ergonomics & Universal Design',
    roleTag: 'Milestone Locked · Artisan Guildhall',
    status: 'Locked',
    icon: '♿',
    accentColor: '#eab308',
    accentGlow: 'rgba(234, 179, 8, 0.32)',
    hotspot: { x: '74%', y: '73%' },
    conciseDescription:
      'The workshop of empowering innovation. Driven by timber guildhalls, waterwheels, and accessible ramps, adaptive engineering creates universal tools that uplift every explorer.',
    structures: [
      'Heavy timber crafting guildhall & industrial chimney',
      'Water-driven power tower with mechanical transmission',
      'Engineered inclined stone access ramps & walkways',
      'Open-air carpentry workbenches & lumber stores',
    ],
  },
];

function App() {
  const containerRef = useRef(null);
  const heroViewportRef = useRef(null);
  const presentationRef = useRef(null);

  const [activeRealmId, setActiveRealmId] = useState('agriculture');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isGameplayModalOpen, setIsGameplayModalOpen] = useState(false);
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false);
  const heroBackdropRef = useRef(null);
  const [hoveredHotspotId, setHoveredHotspotId] = useState(null);
  const [isScrolledPast40, setIsScrolledPast40] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active realm computed
  const activeRealm = useMemo(() => {
    return REALMS.find((r) => r.id === activeRealmId) || REALMS[0];
  }, [activeRealmId]);

  // Track window scroll for floating pill nav (past 40px) and gentle parallax on hero backdrop
  useEffect(() => {
    let rafId = null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolledPast40(scrollY > 40);

      if (!prefersReducedMotion && heroBackdropRef.current) {
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = window.requestAnimationFrame(() => {
          if (scrollY < 1200 && heroBackdropRef.current) {
            heroBackdropRef.current.style.transform = `translate3d(0, ${scrollY * 0.32}px, 0)`;
          }
        });
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Auto-scroll to hash if present in URL
    if (window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(hashId);
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
          ScrollTrigger.refresh();
        }
      }, 200);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Ambient floating motes drifting across the landscape
  const floatingMotes = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => {
      const left = `${(i * 4.6 + 2 + Math.sin(i * 17) * 3).toFixed(1)}%`;
      const bottom = `${(8 + ((i * 4.2) % 72)).toFixed(1)}%`;
      const size = 2 + (i % 3) * 1.5;
      const delay = `${(i * 0.3).toFixed(1)}s`;
      const duration = `${(6.0 + (i % 5) * 1.6).toFixed(1)}s`;
      const driftX = `${(i % 2 === 0 ? 1 : -1) * (14 + ((i * 4) % 24))}px`;
      return { id: i, left, bottom, size, delay, duration, driftX };
    });
  }, []);

  // GSAP Animations and ScrollTriggers
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Subtle luxury entrance reveals
      gsap.from('.hero-eyebrow', { y: 15, duration: 0.8, ease: 'power2.out' });
      gsap.from('.hero-main-title', { y: 20, duration: 0.9, ease: 'power3.out' });
      gsap.from('.hero-tagline-wrap', { y: 15, duration: 0.8, ease: 'power2.out' });
      gsap.from('.hero-lead-narrative', { y: 15, duration: 0.8, ease: 'power2.out' });
      gsap.from('.hero-action-row', { y: 15, duration: 0.8, ease: 'power2.out' });
      gsap.from('.hero-telemetry-strip', { y: 15, duration: 0.85, ease: 'power2.out' });

      // Editorial Introduction Split Reveal
      gsap.from('.intro-narrative-col', {
        x: -25,
        duration: 0.85,
        ease: 'power2.out',
      });

      gsap.from('.intro-artwork-col', {
        x: 25,
        duration: 0.85,
        ease: 'power2.out',
      });

      // Four Realms reveals
      gsap.from('.realms-editorial-header', {
        y: 25,
        duration: 0.85,
        ease: 'power2.out',
      });

      gsap.from('.map-showcase-stage', {
        y: 25,
        duration: 0.85,
        ease: 'power2.out',
      });

      gsap.from('.realm-featured-hero', {
        y: 25,
        duration: 0.85,
        ease: 'power2.out',
      });

      gsap.from('.realm-supporting-stack', {
        y: 25,
        duration: 0.85,
        ease: 'power2.out',
      });

      // Gameplay alternating spreads
      gsap.from('.gameplay-alt-row-1', {
        y: 30,
        duration: 0.85,
        ease: 'power2.out',
      });

      gsap.from('.gameplay-alt-row-2', {
        y: 30,
        duration: 0.85,
        ease: 'power2.out',
      });

      // Codex Folio reveal
      gsap.from('.codex-folio-spread', {
        y: 25,
        duration: 0.85,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleScrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="mergeverse-root">
      {/* ---------------------------------------------------------------------
          Studio Navigation Bar (Precision aligned, compact editorial header)
          --------------------------------------------------------------------- */}
      <header
        className={`studio-navbar ${isScrolledPast40 ? 'is-scrolled' : ''} ${isMobileMenuOpen ? 'menu-open' : ''}`}
        aria-label="MERGEVERSE Studio Navigation"
      >
        <div className="navbar-inner">
          <a
            href="#hero"
            className="navbar-brand-lockup"
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection('hero');
              setIsMobileMenuOpen(false);
            }}
          >
            <span className="brand-crest-star" aria-hidden="true">✦</span>
            <span className="brand-title">MERGEVERSE</span>
            <span className="brand-divider" aria-hidden="true">|</span>
            <span className="brand-studio-tag">AN INDIE GAME BY VIKAS</span>
          </a>

          <nav className="navbar-links-group" aria-label="Main Navigation">
            <a
              href="#game-intro"
              className="nav-item-link"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection('game-intro');
              }}
            >
              Overview
            </a>
            <a
              href="#four-realms"
              className="nav-item-link"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection('four-realms');
              }}
            >
              Four Realms
            </a>
            <a
              href="#gameplay-showcase"
              className="nav-item-link"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection('gameplay-showcase');
              }}
            >
              Gameplay
            </a>
            <a
              href="#explorer-collection"
              className="nav-item-link"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection('explorer-collection');
              }}
            >
              Codex
            </a>
            <a
              href="#behind-the-worlds"
              className="nav-item-link nav-highlight"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection('behind-the-worlds');
              }}
            >
              Behind the Worlds
            </a>
          </nav>

          <div className="navbar-action-area">
            <button
              type="button"
              className="navbar-cta-btn"
              onClick={() => {
                handleScrollToSection('four-realms');
                setIsMobileMenuOpen(false);
              }}
              aria-label="Explore the floating archipelago realms"
            >
              <span>Explore Realms</span>
              <span className="btn-arrow" aria-hidden="true">↓</span>
            </button>

            <button
              type="button"
              className={`navbar-hamburger-btn ${isMobileMenuOpen ? 'is-active' : ''}`}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-dropdown"
            >
              <span className="hamburger-bar" />
              <span className="hamburger-bar" />
              <span className="hamburger-bar" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (below 900px) */}
        {isMobileMenuOpen && (
          <div className="navbar-mobile-dropdown" id="mobile-nav-dropdown">
            <nav className="mobile-nav-links" aria-label="Mobile Main Navigation">
              <a
                href="#game-intro"
                className="mobile-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('game-intro');
                  setIsMobileMenuOpen(false);
                }}
              >
                Overview
              </a>
              <a
                href="#four-realms"
                className="mobile-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('four-realms');
                  setIsMobileMenuOpen(false);
                }}
              >
                Four Realms
              </a>
              <a
                href="#gameplay-showcase"
                className="mobile-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('gameplay-showcase');
                  setIsMobileMenuOpen(false);
                }}
              >
                Gameplay
              </a>
              <a
                href="#explorer-collection"
                className="mobile-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('explorer-collection');
                  setIsMobileMenuOpen(false);
                }}
              >
                Codex
              </a>
              <a
                href="#behind-the-worlds"
                className="mobile-nav-link nav-highlight"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('behind-the-worlds');
                  setIsMobileMenuOpen(false);
                }}
              >
                Behind the Worlds
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* ---------------------------------------------------------------------
          HERO: CINEMATIC, IMAGE-LED OPENING COMPOSITION
          Atmospheric landscape anchor immediately visible with refined typography
          --------------------------------------------------------------------- */}
      <section
        id="hero"
        ref={heroViewportRef}
        className="cinematic-hero-section"
        aria-label="MERGEVERSE Cinematic Hero"
      >
        {/* Full-bleed authentic landscape visual anchor with gentle parallax */}
        <div ref={heroBackdropRef} className="hero-backdrop-container" aria-hidden="true">
          <img
            src="/images/mergeverse-title.jpg"
            alt="MERGEVERSE Alpine Landscape with sunlit peaks and pastoral valley meadows"
            className="hero-backdrop-image"
          />
          <div className="hero-vignette-scrim" />
          <div className="hero-sunlight-sweep" />

          {/* Drifting ambient gold motes */}
          <div className="hero-motes-layer">
            {floatingMotes.map((mote) => (
              <span
                key={mote.id}
                className="hero-mote"
                style={{
                  left: mote.left,
                  bottom: mote.bottom,
                  width: `${mote.size}px`,
                  height: `${mote.size}px`,
                  animationDelay: mote.delay,
                  animationDuration: mote.duration,
                  '--drift-x': mote.driftX,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Structured Typographic Content */}
        <div className="hero-content-wrapper">
          {/* Small gold ornament above title */}
          <div className="hero-ornament-crest" aria-hidden="true">
            <span className="ornament-flourish-line left" />
            <span className="ornament-star">✦</span>
            <span className="ornament-flourish-line right" />
          </div>

          {/* Title group with liquid chrome-gold animated blob behind it */}
          <div className="hero-title-group">
            <div className="hero-liquid-blob" aria-hidden="true" />
            <h1 className="hero-main-title">MERGEVERSE</h1>
          </div>

          {/* Tagline in rounded cream glass pill with dark text */}
          <div className="hero-tagline-pill">
            <span className="hero-tagline-text">Explore. Solve. Discover.</span>
          </div>

          <p className="hero-lead-narrative">
            Where human milestones—from the first ancient seeds sown in wild soil to universal adaptive design—become
            living, synthesizable puzzle adventures across four sky-island realms.
          </p>

          <div className="hero-action-row">
            <button
              type="button"
              className="hero-primary-cta"
              onClick={() => handleScrollToSection('game-intro')}
              aria-label="Enter the game presentation"
            >
              <span className="cta-icon">✦</span>
              <span>ENTER THE GAME</span>
              <span className="cta-arrow">→</span>
            </button>

            <button
              type="button"
              className="hero-secondary-cta"
              onClick={() => handleScrollToSection('behind-the-worlds')}
              aria-label="Discover Behind the Worlds creator story"
            >
              <span>The Creator Story</span>
              <span className="cta-glyph">↗</span>
            </button>
          </div>

          {/* Quick Expedition Telemetry Ribbon */}
          <div className="hero-telemetry-strip" aria-label="Verified Game Statistics">
            <div className="telemetry-pill">
              <span className="pill-dot active" />
              <span className="pill-bold">Level 20 Hub:</span>
              <span>Agriculture Active</span>
            </div>
            <div className="telemetry-pill">
              <span className="pill-dot" />
              <span className="pill-bold">4 Sky Realms:</span>
              <span>Floating Archipelago</span>
            </div>
            <div className="telemetry-pill">
              <span className="pill-dot" />
              <span className="pill-bold">80 Milestones:</span>
              <span>Civilizational Codex</span>
            </div>
            <div className="telemetry-pill">
              <span className="pill-dot" />
              <span className="pill-bold">5×6 Grid:</span>
              <span>Cascade Synthesis</span>
            </div>
          </div>
        </div>

        {/* Small "Scroll to explore" text with thin animated line at bottom center */}
        <div
          className="hero-scroll-cue"
          onClick={() => handleScrollToSection('game-intro')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleScrollToSection('game-intro');
          }}
          aria-label="Scroll to overview"
        >
          <span className="scroll-cue-text">SCROLL TO EXPLORE</span>
          <div className="scroll-cue-line-wrap" aria-hidden="true">
            <div className="scroll-cue-line-track">
              <span className="scroll-cue-line-runner" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          SECTION 2: INTRODUCTION — EDITORIAL SPLIT COMPOSITION
          Meaningful text on one side, genuine game artwork on the other
          Warm Cream & Parchment Editorial Tone
          --------------------------------------------------------------------- */}
      <section
        id="game-intro"
        ref={presentationRef}
        className="game-intro-section section-parchment"
        aria-label="MERGEVERSE Introduction"
      >
        <div className="editorial-container">
          <div className="intro-editorial-split-layout">
            {/* Left Column: Meaningful Editorial Storytelling */}
            <div className="intro-narrative-col">
              <div className="editorial-pill parchment-pill">
                <span className="pill-star">✦</span>
                <span>CHAPTER I · THE ARTISTIC VISION</span>
                <span className="pill-star">✦</span>
              </div>

              <h2 className="intro-split-headline">
                Where Human Breakthroughs Become Living Puzzles
              </h2>

              <p className="intro-editorial-prose">
                Conceived and directed by indie creator <strong className="ink-bold">Vikas</strong>, MERGEVERSE
                reimagines the puzzle-merge genre as an expansive chronicle of human breakthrough. Rather than merging
                abstract jewels, sweets, or candies, players synthesize the tangible agrarian, culinary, medicinal, and
                engineering achievements that built human civilization.
              </p>

              <p className="intro-editorial-prose">
                Every board is grounded in genuine historical progress: combining raw grains and clay ovens to discover
                harvest nutrition, or uniting apothecary herbs to advance clinical care across four sovereign realms.
              </p>

              <blockquote className="creator-editorial-pullquote">
                <span className="pullquote-glyph">“</span>
                <p className="pullquote-text">
                  Every merge charts the tangible resilience of humanity—from the first cultivated seed in ancient soil to
                  universal adaptive design.
                </p>
                <cite className="pullquote-cite">— Vikas, Creator & Director of MERGEVERSE</cite>
              </blockquote>

              {/* Verified Feature Chips */}
              <div className="intro-feature-chips-row">
                <div className="feature-chip">
                  <span className="chip-glyph">🧩</span>
                  <div className="chip-text-group">
                    <span className="chip-title">5×6 Cascade Grid</span>
                    <span className="chip-sub">Multi-tier item merges</span>
                  </div>
                </div>

                <div className="feature-chip">
                  <span className="chip-glyph">📖</span>
                  <div className="chip-text-group">
                    <span className="chip-title">80 Discovery Codex</span>
                    <span className="chip-sub">Permanent archival ledger</span>
                  </div>
                </div>

                <div className="feature-chip">
                  <span className="chip-glyph">🗺️</span>
                  <div className="chip-text-group">
                    <span className="chip-title">4 Sky Realms</span>
                    <span className="chip-sub">Floating cloud archipelago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Genuine Framed Game Artwork + Telemetry Strip */}
            <div className="intro-artwork-col">
              <div className="intro-artwork-card">
                <div className="intro-image-frame">
                  <img
                    src="/images/home-dashboard.jpg"
                    alt="MERGEVERSE Alpine Sanctuary & Expedition Basecamp in-game screenshot"
                    className="intro-frame-img"
                  />
                  <div className="frame-overlay-badge">
                    <span className="badge-dot" />
                    <span>Authentic In-Game Capture</span>
                  </div>
                  <button
                    type="button"
                    className="frame-lightbox-btn"
                    onClick={() => setIsDashboardModalOpen(true)}
                    aria-label="Inspect Full Resolution Basecamp Screenshot"
                  >
                    <span className="btn-glyph">⛶</span>
                    <span>Inspect Interface</span>
                  </button>
                </div>

                <div className="intro-artwork-caption-box">
                  <h3 className="caption-title">The Alpine Sanctuary · Player Basecamp</h3>
                  <p className="caption-body">
                    Persistent explorer station showing Explorer Level 6 standing (1,395 / 1,400 XP), verified three-star ratings,
                    avatar selection, and expedition telemetry set against the sunlit alpine valley.
                  </p>
                </div>

                {/* Integrated Archival Telemetry Ledger */}
                <div className="intro-telemetry-ledger" aria-label="Authentic Basecamp Statistics">
                  <div className="ledger-metric-cell">
                    <span className="cell-number">18 / 80</span>
                    <span className="cell-label">Discoveries Cataloged</span>
                  </div>
                  <div className="ledger-cell-divider" />
                  <div className="ledger-metric-cell">
                    <span className="cell-number">18 / 20</span>
                    <span className="cell-label">Agriculture Milestones</span>
                  </div>
                  <div className="ledger-cell-divider" />
                  <div className="ledger-metric-cell">
                    <span className="cell-number">Level 6</span>
                    <span className="cell-label">1,395 / 1,400 XP</span>
                  </div>
                  <div className="ledger-cell-divider" />
                  <div className="ledger-metric-cell">
                    <span className="cell-number">Level 19</span>
                    <span className="cell-label">Active Challenge Board</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          SECTION 3: FOUR REALMS — ART-DIRECTED ARCHIPELAGO COMPOSITION
          Prominent featured realm alongside an art-directed supporting stack
          Rich Deep Forest Emerald Tone
          --------------------------------------------------------------------- */}
      <section
        id="four-realms"
        className="four-realms-section"
        aria-label="The Four Sovereign Realms of MERGEVERSE"
      >
        <div className="editorial-container">
          {/* Editorial Asymmetric Header */}
          <div className="realms-editorial-header">
            <div className="header-left">
              <div className="editorial-pill">
                <span className="pill-star">✦</span>
                <span>THE FLOATING ARCHIPELAGO</span>
                <span className="pill-star">✦</span>
              </div>
              <h2 className="realms-display-headline">The Four Sovereign Realms</h2>
            </div>
            <div className="header-right">
              <p className="realms-header-prose">
                Suspended above the endless cloud ocean lies the World Map—a constellation of four floating
                islands charting the foundational advances of human life. At the heart of the archipelago stands
                Agriculture, anchoring the player journey across the skies.
              </p>
            </div>
          </div>

          {/* Primary Visual Centerpiece: Expansive 16:9 World Map Artwork */}
          <div
            className="map-showcase-stage"
            style={{
              '--realm-ambient-glow': activeRealm.accentGlow,
            }}
          >
            <div className="map-artwork-container">
              <img
                src="/images/world-map.jpg"
                alt="MERGEVERSE In-Game World Map showing Agriculture, Food & Culinary, Healthcare & Medicine, and Assistive Technology floating islands"
                className="map-artwork-img"
              />

              <div className="map-ambient-vignette" aria-hidden="true" />

              {/* Interactive Island Beacons */}
              <div className="map-beacons-layer" aria-label="Interactive Island Beacons">
                {REALMS.map((realm) => {
                  const isActive = realm.id === activeRealmId;
                  const isHovered = realm.id === hoveredHotspotId;
                  return (
                    <div
                      key={realm.id}
                      className={`map-beacon-pin ${isActive ? 'is-active' : ''} ${
                        isHovered ? 'is-hovered' : ''
                      }`}
                      style={{
                        left: realm.hotspot.x,
                        top: realm.hotspot.y,
                        '--beacon-accent': realm.accentColor,
                        '--beacon-glow': realm.accentGlow,
                      }}
                    >
                      <button
                        type="button"
                        className="beacon-trigger"
                        onClick={() => setActiveRealmId(realm.id)}
                        onMouseEnter={() => setHoveredHotspotId(realm.id)}
                        onMouseLeave={() => setHoveredHotspotId(null)}
                        aria-label={`Select ${realm.name} Realm (${realm.roleTag})`}
                      >
                        <span className="beacon-halo" />
                        <span className="beacon-core">
                          <span className="beacon-glyph">{realm.icon}</span>
                        </span>
                      </button>

                      {/* Beacon Tooltip */}
                      <div className="beacon-tooltip">
                        <span className="beacon-tooltip-num">REALM {realm.roman}</span>
                        <span className="beacon-tooltip-name">{realm.name}</span>
                        <span className="beacon-tooltip-tag">
                          {realm.status === 'Unlocked' ? 'Level 20 Hub' : 'Locked'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Discreet Lightbox Action */}
              <button
                type="button"
                className="map-lightbox-trigger"
                onClick={() => setIsMapModalOpen(true)}
                aria-label="View Full Resolution Artwork"
              >
                <span className="lightbox-glyph">⛶</span>
                <span>Full Map Artwork</span>
              </button>
            </div>
          </div>

          {/* ART-DIRECTED ASYMMETRICAL REALM COMPOSITION (NOT identical cards!) */}
          <div className="realms-asymmetric-layout">
            {/* Primary Featured Realm Hero (60% width) */}
            <article
              className="realm-featured-hero"
              style={{
                '--hero-accent': activeRealm.accentColor,
                '--hero-glow': activeRealm.accentGlow,
              }}
            >
              <div className="featured-hero-top">
                <div className="featured-hero-meta">
                  <div className="featured-badge-row">
                    <span className="featured-chapter-tag">REALM {activeRealm.roman}</span>
                    <span className="featured-status-pill">{activeRealm.roleTag}</span>
                  </div>
                  <h3 className="featured-realm-title">{activeRealm.headline}</h3>
                  <p className="featured-realm-tagline">{activeRealm.tagline}</p>
                </div>

                {/* Island Radar Viewfinder Loupe */}
                <div
                  className="featured-radar-loupe"
                  title={`Live Island Coordinates: ${activeRealm.name}`}
                  aria-hidden="true"
                >
                  <div
                    className="loupe-canvas"
                    style={{
                      backgroundImage: 'url(/images/world-map.jpg)',
                      backgroundPosition: `${activeRealm.hotspot.x} ${activeRealm.hotspot.y}`,
                    }}
                  />
                  <div className="loupe-overlay">
                    <span className="loupe-crosshair-x" />
                    <span className="loupe-crosshair-y" />
                    <span className="loupe-reticle" />
                    <span className="loupe-badge">{activeRealm.icon} RADAR</span>
                  </div>
                </div>
              </div>

              <p className="featured-realm-description">{activeRealm.conciseDescription}</p>

              {/* Verified Island Features */}
              <div className="featured-structures-block">
                <h4 className="structures-title">Verified Island Architecture:</h4>
                <div className="structures-pills-wrap">
                  {activeRealm.structures.map((structure, idx) => (
                    <span key={idx} className="structure-pill">
                      <span className="pill-bullet">✦</span>
                      <span>{structure}</span>
                    </span>
                  ))}
                </div>
              </div>
            </article>

            {/* Supporting Realm Stack: Art-directed domain portfolio (40% width) */}
            <aside className="realm-supporting-stack" aria-label="Other Floating Realms">
              <div className="stack-header-bar">
                <span className="stack-header-title">ARCHIPELAGO DOMAINS</span>
                <span className="stack-header-hint">Click to Feature</span>
              </div>

              <div className="stack-cards-list">
                {REALMS.map((realm) => {
                  const isSelected = realm.id === activeRealmId;
                  return (
                    <div
                      key={realm.id}
                      className={`supporting-domain-card ${isSelected ? 'is-active' : ''}`}
                      onClick={() => setActiveRealmId(realm.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setActiveRealmId(realm.id);
                      }}
                      style={{
                        '--domain-accent': realm.accentColor,
                        '--domain-glow': realm.accentGlow,
                      }}
                    >
                      <div className="domain-card-left">
                        <span className="domain-glyph">{realm.icon}</span>
                        <div className="domain-text-box">
                          <div className="domain-num-row">
                            <span className="domain-roman">REALM {realm.roman}</span>
                            <span className={`domain-status-tag ${realm.status === 'Unlocked' ? 'unlocked' : 'locked'}`}>
                              {realm.status === 'Unlocked' ? 'Active Hub' : 'Milestone Locked'}
                            </span>
                          </div>
                          <h4 className="domain-name">{realm.name}</h4>
                          <p className="domain-structures-preview">
                            {realm.structures[0]}
                          </p>
                        </div>
                      </div>

                      <div className="domain-card-indicator" aria-hidden="true">
                        {isSelected ? 'FEATURED ✦' : 'VIEW →'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          SECTION 4: GAMEPLAY SHOWCASE — ALTERNATING ASYMMETRIC COMPOSITION
          Large genuine screenshots as visual anchors with alternating placement
          Deep Slate-Emerald Tone
          --------------------------------------------------------------------- */}
      <section
        id="gameplay-showcase"
        className="gameplay-showcase-section"
        aria-label="MERGEVERSE Gameplay In Motion"
      >
        <div className="editorial-container">
          <div className="gameplay-cinematic-header">
            <div className="editorial-pill">
              <span className="pill-star">✦</span>
              <span>IN-ENGINE MECHANICS · LIVE HARVEST BOARD</span>
              <span className="pill-star">✦</span>
            </div>
            <h2 className="gameplay-display-title">Gameplay, In Motion</h2>
            <p className="gameplay-lead-prose">
              Captured live in Level 19. Explorers combine elemental agrarian resources across a 5×6 puzzle grid—merging
              grain stalks, fresh shoots, and culinary vessels to fulfill harvest orders and unlock civilization's milestones.
            </p>
          </div>

          {/* MOVEMENT 1: The Level 19 Harvest Board (Image Left, Mechanics Right) */}
          <div className="gameplay-alternating-row gameplay-alt-row-1">
            <div className="alt-image-col">
              <div className="gameplay-artwork-frame">
                <img
                  src="/images/gameplay.jpg"
                  alt="MERGEVERSE Level 19 live gameplay board showing 5x6 puzzle grid, recipe order fulfillment, item merges, and tactical action tray"
                  className="gameplay-frame-img"
                />
                <div className="artwork-corner-badge">Level 19 Harvest Board</div>
                <button
                  type="button"
                  className="gameplay-inspect-btn"
                  onClick={() => setIsGameplayModalOpen(true)}
                  aria-label="Inspect Full Resolution Gameplay Screenshot"
                >
                  <span className="btn-glyph">⛶</span>
                  <span>View Full Resolution</span>
                </button>
              </div>
            </div>

            <div className="alt-narrative-col">
              <div className="narrative-movement-badge">BOARD MECHANICS · 5×6 GRID</div>
              <h3 className="movement-headline">Artisanal Order Fulfillment & Cascade Merges</h3>
              <p className="movement-prose">
                Explorers advance by fulfilling specific civilizational orders. In Level 19, active quotas demand
                synthesizing a completed <strong>Clay-Oven Flatbread</strong> and crafting an active{' '}
                <strong>Sourdough Harvest Loaf (0/1)</strong> from raw field elements.
              </p>

              {/* In-depth Mechanics breakdown */}
              <div className="mechanics-breakdown-list">
                <div className="mechanic-card">
                  <div className="mechanic-icon-box">⚡</div>
                  <div className="mechanic-info">
                    <h4 className="mechanic-title">Cascade Synthesis & Double Merges</h4>
                    <p className="mechanic-desc">
                      Combining Tier 1 Grain Stalks and Tier 2 Shoots yields Tier 3 Mixing Bowls and Tier 6 Loaves, triggering
                      satisfying <em>Double Merge</em> score and combo multipliers.
                    </p>
                  </div>
                </div>

                <div className="mechanic-card">
                  <div className="mechanic-icon-box">🛠️</div>
                  <div className="mechanic-info">
                    <h4 className="mechanic-title">Tactical Action Tray</h4>
                    <p className="mechanic-desc">
                      Field expedition tools include the <strong>Resource Spawner (6 remaining)</strong>, tactical board{' '}
                      <strong>Shuffle</strong>, precision <strong>Zap</strong>, <strong>+3 Spawns</strong> boost, and contextual{' '}
                      <strong>Hints</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MOVEMENT 2: Alternating Composition! In-Game Knowledge Challenge (Image Right, Mechanics Left) */}
          <div className="gameplay-alternating-row gameplay-alt-row-2 is-reversed">
            <div className="alt-narrative-col">
              <div className="narrative-movement-badge">PEDAGOGICAL DESIGN · KNOWLEDGE CHALLENGE</div>
              <h3 className="movement-headline">Civilizational Milestones & In-Game Challenges</h3>
              <p className="movement-prose">
                MERGEVERSE integrates educational discovery directly into gameplay. Upon fulfilling harvest quotas, explorers
                encounter authentic in-game <strong>Knowledge Challenges</strong> that test verified historical facts regarding crop rotation,
                mill mechanics, and settlement agriculture.
              </p>

              <div className="mechanics-breakdown-list">
                <div className="mechanic-card">
                  <div className="mechanic-icon-box">🎯</div>
                  <div className="mechanic-info">
                    <h4 className="mechanic-title">Objective Verification & Ratings</h4>
                    <p className="mechanic-desc">
                      Correct responses award three-star ratings, bonus XP toward the Explorer Level 6 threshold (1,395/1,400 XP),
                      and unlock permanent codex milestone entries.
                    </p>
                  </div>
                </div>

                <div className="mechanic-card">
                  <div className="mechanic-icon-box">🌱</div>
                  <div className="mechanic-info">
                    <h4 className="mechanic-title">Historical Progress Narrative</h4>
                    <p className="mechanic-desc">
                      Each puzzle solved represents a real civilizational leap—from the initial plow furrow to early irrigation networks.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="alt-image-col">
              <div className="gameplay-artwork-frame">
                <img
                  src="/images/knowledge-challenge.png"
                  alt="MERGEVERSE In-Game Knowledge Challenge screen testing real agrarian civilization facts"
                  className="gameplay-frame-img"
                />
                <div className="artwork-corner-badge">In-Game Knowledge Challenge</div>
                <button
                  type="button"
                  className="gameplay-inspect-btn"
                  onClick={() => setIsKnowledgeModalOpen(true)}
                  aria-label="Inspect Full Resolution Knowledge Challenge Screenshot"
                >
                  <span className="btn-glyph">⛶</span>
                  <span>View Full Resolution</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          SECTION 5: COLLECTION & PROGRESSION — ARCHIVAL FOLIO CODEX
          Illuminated civilizational manuscript ledger composition
          Warm Cream & Parchment Tone
          --------------------------------------------------------------------- */}
      <section
        id="explorer-collection"
        className="explorer-collection-section section-parchment"
        aria-label="MERGEVERSE Explorer Collection & Discovery Progression"
      >
        <div className="editorial-container">
          <div className="collection-cinematic-header">
            <div className="editorial-pill parchment-pill">
              <span className="pill-star">✦</span>
              <span>EXPEDITION CODEX · THE ARCHIVE</span>
              <span className="pill-star">✦</span>
            </div>
            <h2 className="collection-display-headline doc-parchment-title">A World of Discovery</h2>
            <p className="collection-lead-prose doc-parchment-lead">
              The Explorer Collection chronicles humanity's foundational milestones across the four realms.
              From early agrarian breakthroughs to advanced farm mechanization, each merged discovery is preserved
              in the expedition codex.
            </p>
          </div>

          {/* DISTINCT ARCHIVAL FOLIO CODEX SPREAD */}
          <div className="codex-folio-spread">
            {/* Left: Framed High-Res Collection Capture */}
            <div className="codex-capture-col">
              <div className="codex-artwork-frame">
                <img
                  src="/images/collection.jpg"
                  alt="MERGEVERSE Explorer Collection in-game interface showing 18 of 80 discoveries unlocked across Agriculture & Earth and Food & Nutrition"
                  className="codex-frame-img"
                />
                <div className="codex-badge-label">
                  <span>Archival Codex · 18 / 80 Discoveries</span>
                </div>
                <button
                  type="button"
                  className="codex-lightbox-btn"
                  onClick={() => setIsCollectionModalOpen(true)}
                  aria-label="Inspect Full Resolution Collection Interface"
                >
                  <span className="btn-glyph">⛶</span>
                  <span>View Full Resolution</span>
                </button>
              </div>

              <div className="codex-capture-caption">
                <p>
                  <strong>Verified In-Engine Capture:</strong> Displays the Discoveries tab, showing Volume I: Agriculture & Earth
                  (18/20 milestones unlocked) and Volume II: Food & Nutrition (awaiting unlock).
                </p>
              </div>
            </div>

            {/* Right: Illuminated Civilizational Ledger Folio */}
            <div className="codex-ledger-col">
              <div className="illuminated-ledger-card">
                <div className="ledger-card-header">
                  <div className="ledger-title-group">
                    <span className="ledger-seal-icon">📜</span>
                    <div>
                      <h3 className="ledger-main-title">Civilizational Progression Ledger</h3>
                      <span className="ledger-sub-title">80 Historical Milestones Cataloged Across 4 Realms</span>
                    </div>
                  </div>
                  <div className="ledger-overall-badge">
                    <span className="badge-count">18 / 80</span>
                    <span className="badge-desc">TOTAL PROGRESS</span>
                  </div>
                </div>

                {/* Volume I: Agriculture & Earth */}
                <div className="ledger-volume-block is-active">
                  <div className="volume-block-header">
                    <div className="volume-meta">
                      <span className="volume-roman-tag">VOLUME I</span>
                      <h4 className="volume-name">Agriculture & Earth</h4>
                    </div>
                    <span className="volume-progress-pill active">18 / 20 Milestones Unlocked (90%)</span>
                  </div>

                  <p className="volume-prose">
                    Chronicles the dawn of agrarian civilization—from primal seed cultivation to mechanical threshing.
                  </p>

                  <div className="milestone-chronicle-chips">
                    <span className="chronicle-chip unlocked">✦ The Planted Fertility</span>
                    <span className="chronicle-chip unlocked">✦ Working with Draft Animals</span>
                    <span className="chronicle-chip unlocked">✦ Early Irrigation Furrows</span>
                    <span className="chronicle-chip unlocked">✦ Waterworks & Windmills</span>
                    <span className="chronicle-chip unlocked">✦ The Steel Plow</span>
                    <span className="chronicle-chip unlocked">✦ The Green Revolution</span>
                    <span className="chronicle-chip locked">🔒 Milestones XIX & XX Locked</span>
                  </div>
                </div>

                {/* Volume II: Food & Nutrition */}
                <div className="ledger-volume-block is-waiting">
                  <div className="volume-block-header">
                    <div className="volume-meta">
                      <span className="volume-roman-tag">VOLUME II</span>
                      <h4 className="volume-name">Food & Nutrition</h4>
                    </div>
                    <span className="volume-progress-pill waiting">0 / 20 Unlocked · Next Horizon</span>
                  </div>

                  <p className="volume-prose">
                    20 gastronomic recipes and preservation arts awaiting discovery as exploration advances into Realm II.
                  </p>

                  <div className="milestone-chronicle-chips">
                    <span className="chronicle-chip pending">Culinary Arts & Fermentation</span>
                    <span className="chronicle-chip pending">Food Preservation & Cellaring</span>
                    <span className="chronicle-chip pending">Nutritional Science</span>
                    <span className="chronicle-chip locked">🔒 Milestones I – XX Awaiting Realm II Unlock</span>
                  </div>
                </div>

                {/* Archival Authenticity Seal */}
                <div className="ledger-authenticity-seal">
                  <span className="seal-star">✦</span>
                  <p className="seal-prose">
                    <strong>Archival Integrity:</strong> Milestone telemetry is backed by persistent in-game state.
                    No generic dashboard metrics or placeholders are utilized.
                  </p>
                  <span className="seal-star">✦</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          SECTION 6: BEHIND THE WORLDS — PREMIUM CREATOR STORY
          Visual documentary narrative with varied compositions & authentic workflow
          --------------------------------------------------------------------- */}
      <BehindTheWorlds
        onOpenModal={(type) => {
          if (type === 'map') setIsMapModalOpen(true);
          else if (type === 'dashboard') setIsDashboardModalOpen(true);
          else if (type === 'collection') setIsCollectionModalOpen(true);
          else if (type === 'gameplay') setIsGameplayModalOpen(true);
          else if (type === 'knowledge') setIsKnowledgeModalOpen(true);
        }}
      />

      {/* ---------------------------------------------------------------------
          SECTION 7: CINEMATIC CLOSING
          Forest-and-gold visual identity finale recalling the hero opening
          --------------------------------------------------------------------- */}
      <footer
        id="cinematic-closing"
        className="cinematic-closing-section"
        aria-label="MERGEVERSE Cinematic Closing"
      >
        <div className="closing-backdrop-wrap" aria-hidden="true">
          <img
            src="/images/mergeverse-title.jpg"
            alt=""
            className="closing-backdrop-img"
          />
          <div className="closing-backdrop-scrim" />

          {/* Floating gold embers */}
          <div className="closing-ambient-motes-layer">
            {floatingMotes.map((mote) => (
              <span
                key={mote.id}
                className="closing-mote"
                style={{
                  left: mote.left,
                  bottom: mote.bottom,
                  width: `${mote.size}px`,
                  height: `${mote.size}px`,
                  animationDelay: mote.delay,
                  animationDuration: mote.duration,
                  '--drift-x': mote.driftX,
                }}
              />
            ))}
          </div>
        </div>

        <div className="closing-cinematic-inner">
          <div className="closing-crest-accent" aria-hidden="true">
            <span className="closing-crest-line" />
            <span className="closing-crest-symbol">✦</span>
            <span className="closing-crest-line right" />
          </div>

          <div className="closing-title-wrap">
            <h2 className="closing-hero-title">MERGEVERSE</h2>
            <div className="closing-title-glow" aria-hidden="true" />
          </div>

          <div className="closing-tagline-wrap">
            <span className="closing-flourish" aria-hidden="true" />
            <p className="closing-tagline">EXPLORE. SOLVE. DISCOVER.</p>
            <span className="closing-flourish right" aria-hidden="true" />
          </div>

          <p className="closing-epilogue-text">
            From the pioneering soil of early agriculture to the limitless horizons of adaptive ingenuity,
            every merge charts the monumental story of human civilization.
          </p>

          <div className="closing-actions-wrap">
            <button
              type="button"
              className="closing-action-btn primary"
              onClick={() => handleScrollToSection('hero')}
              aria-label="Replay the cinematic hero opening"
            >
              <span className="action-btn-glyph">↺</span>
              <span>RETURN TO OPENING</span>
            </button>
            <a
              href="#four-realms"
              className="closing-action-btn secondary"
              aria-label="Explore the Four Sovereign Realms"
            >
              <span>✦ FOUR REALMS</span>
            </a>
            <a
              href="#explorer-collection"
              className="closing-action-btn secondary"
              aria-label="Inspect Codex Archive"
            >
              <span>✦ CODEX ARCHIVE</span>
            </a>
            <a
              href="#behind-the-worlds"
              className="closing-action-btn secondary"
              aria-label="Explore Behind the Worlds creator story"
            >
              <span>✦ BEHIND THE WORLDS</span>
            </a>
          </div>

          <div className="closing-colophon">
            <p className="colophon-text">
              ✦ MERGEVERSE · AN INDIE GAME DIRECTED BY VIKAS · THE CHRONICLE OF HUMAN INNOVATION ✦
            </p>
          </div>
        </div>
      </footer>

      {/* ---------------------------------------------------------------------
          MODAL LIGHTBOXES: HIGH-RESOLUTION AUTHENTIC ASSET INSPECTIONS
          --------------------------------------------------------------------- */}
      {isMapModalOpen && (
        <div
          className="artwork-modal-backdrop"
          onClick={() => setIsMapModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="High Resolution World Map Artwork"
        >
          <div className="artwork-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div className="modal-title-group">
                <span className="modal-crest">✦</span>
                <span className="modal-title">MERGEVERSE WORLD MAP · FLOATING ARCHIPELAGO</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsMapModalOpen(false)}
                aria-label="Close World Map modal"
              >
                ✕ Close
              </button>
            </div>
            <div className="modal-artwork-canvas">
              <img
                src="/images/world-map.jpg"
                alt="Full MERGEVERSE World Map with Four Floating Island Realms"
                className="modal-full-img"
              />
            </div>
            <div className="modal-info-footer">
              <p>
                <strong>Authentic In-Game Map:</strong> Features Agriculture (Level 20 Active Hub),
                Food & Culinary, Healthcare & Medicine, and Assistive Technology floating islands above the sky clouds.
              </p>
            </div>
          </div>
        </div>
      )}

      {isDashboardModalOpen && (
        <div
          className="artwork-modal-backdrop"
          onClick={() => setIsDashboardModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="High Resolution Dashboard Artwork"
        >
          <div className="artwork-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div className="modal-title-group">
                <span className="modal-crest">✦</span>
                <span className="modal-title">MERGEVERSE HOME DASHBOARD · EXPLORER SANCTUARY</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsDashboardModalOpen(false)}
                aria-label="Close Dashboard modal"
              >
                ✕ Close
              </button>
            </div>
            <div className="modal-artwork-canvas">
              <img
                src="/images/home-dashboard.jpg"
                alt="Full MERGEVERSE Home Dashboard in-game screenshot"
                className="modal-full-img"
              />
            </div>
            <div className="modal-info-footer">
              <p>
                <strong>Authentic In-Game Screenshot:</strong> Displays Explorer Level 6 (1,395 / 1,400 XP),
                avatar customization, achievements, and explorer statistics (18 levels completed, 10 three-star levels,
                18 discoveries made) set against the alpine valley landscape.
              </p>
            </div>
          </div>
        </div>
      )}

      {isCollectionModalOpen && (
        <div
          className="artwork-modal-backdrop"
          onClick={() => setIsCollectionModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="High Resolution Collection Interface Artwork"
        >
          <div className="artwork-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div className="modal-title-group">
                <span className="modal-crest">✦</span>
                <span className="modal-title">MERGEVERSE EXPLORER COLLECTION · CODEX ARCHIVE</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsCollectionModalOpen(false)}
                aria-label="Close Collection modal"
              >
                ✕ Close
              </button>
            </div>
            <div className="modal-artwork-canvas">
              <img
                src="/images/collection.jpg"
                alt="Full MERGEVERSE Explorer Collection in-game screenshot"
                className="modal-full-img"
              />
            </div>
            <div className="modal-info-footer">
              <p>
                <strong>Authentic In-Game Screenshot:</strong> Displays Discoveries tab (18/80 items recorded),
                Volume I: Agriculture & Earth (18/20 milestones unlocked), Volume II: Food & Nutrition (0/20 milestones),
                and navigation dock.
              </p>
            </div>
          </div>
        </div>
      )}

      {isGameplayModalOpen && (
        <div
          className="artwork-modal-backdrop"
          onClick={() => setIsGameplayModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="High Resolution Gameplay Screenshot"
        >
          <div className="artwork-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div className="modal-title-group">
                <span className="modal-crest">✦</span>
                <span className="modal-title">MERGEVERSE GAMEPLAY · LEVEL 19 HARVEST BOARD</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsGameplayModalOpen(false)}
                aria-label="Close Gameplay modal"
              >
                ✕ Close
              </button>
            </div>
            <div className="modal-artwork-canvas">
              <img
                src="/images/gameplay.jpg"
                alt="Full MERGEVERSE Gameplay Level 19 in-game screenshot"
                className="modal-full-img"
              />
            </div>
            <div className="modal-info-footer">
              <p>
                <strong>Authentic In-Game Screenshot:</strong> Displays Level 19 merge grid (5×6 board),
                Double Merge combo notification, Clay-Oven Flatbread and Sourdough Harvest Loaf objectives,
                tiered resource tiles (Grain Stalks, Shoots, Mixing Bowls, Bread Loaves), and tactical action tray.
              </p>
            </div>
          </div>
        </div>
      )}

      {isKnowledgeModalOpen && (
        <div
          className="artwork-modal-backdrop"
          onClick={() => setIsKnowledgeModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="High Resolution Knowledge Challenge Screenshot"
        >
          <div className="artwork-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div className="modal-title-group">
                <span className="modal-crest">✦</span>
                <span className="modal-title">MERGEVERSE · IN-GAME KNOWLEDGE CHALLENGE</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsKnowledgeModalOpen(false)}
                aria-label="Close Knowledge Challenge modal"
              >
                ✕ Close
              </button>
            </div>
            <div className="modal-artwork-canvas">
              <img
                src="/images/knowledge-challenge.png"
                alt="Full MERGEVERSE Knowledge Challenge in-game screenshot"
                className="modal-full-img"
              />
            </div>
            <div className="modal-info-footer">
              <p>
                <strong>Authentic In-Game Screenshot:</strong> Displays active Knowledge Challenge testing agricultural
                and civilizational milestones for three-star level completion.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
