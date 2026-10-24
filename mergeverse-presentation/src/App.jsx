import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';
import './styles/scrollScene.css';
import BehindTheWorlds from './BehindTheWorlds.jsx';
import CinematicOpening from './CinematicOpening.jsx';
import { initScrollReveal } from './utils/reveal.js';
import { useScrollScene } from './utils/scrollScene.js';

gsap.registerPlugin(ScrollTrigger);

// Note: Original static REALMS constant from Section 3 has been archived in
// docs/removed-sections-backup.md for future reference. Active realms are defined in OCEAN_REALMS_DATA.

const CREAM_LAPTOP_SLIDES = [
  {
    id: 'world-map',
    image: '/images/world-map.jpg',
    alt: 'Mergeverse World Map Realm Discovery',
    heading: 'Match. Merge. Discover.',
    description: 'Combine objects to evolve inventions, and watch the world grow with every merge.',
  },
  {
    id: 'harvest-board',
    image: '/images/gameplay.jpg',
    alt: 'Level 19 Harvest Board Gameplay',
    heading: 'Solve. Every level a puzzle.',
    description: 'Every level is built from real harvest, kitchen, clinic and assistive-tech ideas.',
  },
  {
    id: 'knowledge-challenge',
    image: '/images/knowledge-challenge.png',
    alt: 'Knowledge Challenge Learning Milestone',
    heading: 'Learn. Every win teaches.',
    description: 'After each level, a quick question turns play into a real historical fact.',
  },
];

const OCEAN_REALMS_DATA = [
  {
    id: 'agriculture',
    name: 'Agriculture',
    icon: '🌱',
    hotspot: { x: '27%', y: '24%' },
    status: 'Active',
    tooltipStatus: 'Active - 20 levels',
    isGoldStatus: true,
    description: 'Terraced farms, windmills and the first harvests of civilization.',
  },
  {
    id: 'food-culinary',
    name: 'Food & Culinary',
    icon: '👨‍🍳',
    hotspot: { x: '71%', y: '24%' },
    status: 'Coming soon',
    tooltipStatus: 'Coming soon',
    isGoldStatus: false,
    description: 'Bazaars, kitchens and the craft of feeding a city.',
  },
  {
    id: 'healthcare-medicine',
    name: 'Healthcare & Medicine',
    icon: '⚕️',
    hotspot: { x: '26%', y: '68%' },
    status: 'Coming soon',
    tooltipStatus: 'Coming soon',
    isGoldStatus: false,
    description: 'Clinics and discoveries that learned to heal.',
  },
  {
    id: 'assistive-technology',
    name: 'Assistive Technology',
    icon: '⚙️',
    hotspot: { x: '69%', y: '68%' },
    status: 'Coming soon',
    tooltipStatus: 'Coming soon',
    isGoldStatus: false,
    description: 'Tools built so everyone can take part.',
  },
];

const GAMEPLAY_OVERLAPPING_CARDS = [
  {
    id: 'world-map',
    title: 'World Map Archipelago',
    caption: 'World Map Archipelago',
    image: '/images/world-map.jpg',
    alt: 'Mergeverse World Map Archipelago in-game screenshot',
    rotation: -4,
    shiftX: 8,
    shiftY: 10,
    isFront: false,
  },
  {
    id: 'harvest-board',
    title: 'Level 19 Harvest Board',
    caption: 'Level 19 Harvest Board',
    image: '/images/gameplay.jpg',
    alt: 'Level 19 Harvest Board in-game gameplay puzzle screenshot',
    rotation: 3,
    shiftX: -10,
    shiftY: 12,
    isFront: false,
  },
  {
    id: 'knowledge-challenge',
    title: 'In-Game Knowledge Challenge',
    caption: 'In-Game Knowledge Challenge',
    image: '/images/knowledge-challenge.png',
    alt: 'In-Game Knowledge Challenge quiz milestone screenshot',
    rotation: -2,
    shiftX: 12,
    shiftY: -8,
    isFront: false,
  },
  {
    id: 'profile',
    title: 'Alpine Sanctuary Profile',
    caption: 'Alpine Sanctuary Profile',
    image: '/images/home-dashboard.jpg',
    alt: 'Alpine Sanctuary Basecamp Profile in-game screenshot',
    rotation: 5,
    shiftX: -14,
    shiftY: -10,
    isFront: true,
  },
];

const NOTEBOOK_CHECKLIST_ITEMS = [
  { id: 1, text: 'Idea: merge puzzle + real inventions' },
  { id: 2, text: 'Plan & logic: ChatGPT' },
  { id: 3, text: 'Art direction: Gemini & Stitch' },
  { id: 4, text: 'Built with: Antigravity' },
  { id: 5, text: '4 realms. Agriculture: 20 levels' },
  { id: 6, text: 'Play. Fix. Repeat.', hasDoodle: true },
];

function App() {
  const containerRef = useRef(null);
  const heroViewportRef = useRef(null);
  const presentationRef = useRef(null);

  // Cinematic Opening Sequence State (STEP 8)
  const [isIntroActive, setIsIntroActive] = useState(() => {
    try {
      if (typeof window === 'undefined') return false;
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        return false;
      }
      const params = new URLSearchParams(window.location.search);
      if (params.get('intro') === '1') {
        return true;
      }
      const hasPlayed = window.sessionStorage?.getItem('mv_intro_played');
      if (hasPlayed) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  });

  // Manage html class and body scroll locking during intro
  useEffect(() => {
    if (isIntroActive) {
      document.documentElement.classList.add('intro-active');
      document.documentElement.classList.remove('intro-done');
      document.documentElement.classList.remove('intro-active-exited');
      document.documentElement.style.overflow = 'hidden';
    } else {
      const wasActive = document.documentElement.classList.contains('intro-active');
      document.documentElement.classList.remove('intro-active');
      document.documentElement.classList.add('intro-done');
      if (wasActive) {
        document.documentElement.classList.add('intro-active-exited');
      }
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [isIntroActive]);

  // Initialize shared scroll reveal observer
  useEffect(() => {
    const observer = initScrollReveal();
    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  // Story Notebook & Desk Section State & Handlers
  const [isNotebookInView, setIsNotebookInView] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const [isMonitorHovered, setIsMonitorHovered] = useState(false);
  const [isMonitorToggled, setIsMonitorToggled] = useState(false);
  const notebookSectionRef = useRef(null);

  const isWorldMapShowing = isMonitorHovered || isMonitorToggled;

  const toggleMonitorScreen = () => {
    setIsMonitorToggled((prev) => !prev);
  };

  // Single-run IntersectionObserver for the notebook checklist line-by-line reveal
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNotebookInView(true);
          if (notebookSectionRef.current) {
            observer.unobserve(notebookSectionRef.current);
          }
        }
      },
      { threshold: 0.2 }
    );

    const el = notebookSectionRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  // Scroll-spy active section tracking
  const [activeNavSection, setActiveNavSection] = useState('hero');
  const scrollProgressRef = useRef(null);
  const oceanSectionRef = useRef(null);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [isOceanInView, setIsOceanInView] = useState(false);

  // Performance: Intersection observers to pause heavy off-screen animations
  useEffect(() => {
    const heroObserver = new IntersectionObserver(([entry]) => {
      setIsHeroInView(entry.isIntersecting);
    }, { threshold: 0 });
    if (heroViewportRef.current) heroObserver.observe(heroViewportRef.current);

    const oceanObserver = new IntersectionObserver(([entry]) => {
      setIsOceanInView(entry.isIntersecting);
    }, { threshold: 0 });
    if (oceanSectionRef.current) oceanObserver.observe(oceanSectionRef.current);

    return () => {
      heroObserver.disconnect();
      oceanObserver.disconnect();
    };
  }, []);

  // Forest Outro Reveal State & IntersectionObserver
  const [isOutroInView, setIsOutroInView] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const [isOutroIntersecting, setIsOutroIntersecting] = useState(false);
  const forestOutroRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setIsOutroInView(true);
      setIsOutroIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOutroIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsOutroInView(true);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    const el = forestOutroRef.current;
    if (el) observer.observe(el);

    // Fallback safety net to guarantee visibility
    const safetyTimer = setTimeout(() => {
      setIsOutroInView(true);
    }, 500);

    return () => {
      if (el) observer.unobserve(el);
      clearTimeout(safetyTimer);
    };
  }, []);

  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isGameplayModalOpen, setIsGameplayModalOpen] = useState(false);
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false);
  const heroBackdropRef = useRef(null);
  const [isScrolledPast40, setIsScrolledPast40] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cream Laptop Slider Section State & Refs
  const [creamSlideIndex, setCreamSlideIndex] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const [isSliderInView, setIsSliderInView] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const creamSliderRef = useRef(null);
  const touchStartXRef = useRef(null);
  const gameplaySectionRef = useRef(null);

  // Scroll-Pinned Scenes (STEP 9)
  const laptopScene = useScrollScene(creamSliderRef, { stages: 3 });
  const oceanScene = useScrollScene(oceanSectionRef, { stages: 4 });
  const gameplayScene = useScrollScene(gameplaySectionRef, { stages: 4 });

  // Synchronize Cream Laptop Slide with active scene stage
  useEffect(() => {
    if (laptopScene.isSceneActive) {
      setCreamSlideIndex(laptopScene.stage);
    }
  }, [laptopScene.isSceneActive, laptopScene.stage]);

  // Ocean Four Realms Section State & Handlers
  const [highlightedOceanCardId, setHighlightedOceanCardId] = useState(null);
  const [isOceanCardsInView, setIsOceanCardsInView] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const oceanCardsRef = useRef(null);

  // Gameplay Overlapping Cards State & Handlers
  const [activeGameplayLightbox, setActiveGameplayLightbox] = useState(null);
  const [isGameplayCardsInView, setIsGameplayCardsInView] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const gameplayStackContainerRef = useRef(null);
  const lastActiveCardBtnRef = useRef(null);
  const lightboxCloseBtnRef = useRef(null);

  const openGameplayLightbox = (card, btnElement) => {
    lastActiveCardBtnRef.current = btnElement;
    setActiveGameplayLightbox(card);
  };

  const closeGameplayLightbox = () => {
    setActiveGameplayLightbox(null);
    setTimeout(() => {
      lastActiveCardBtnRef.current?.focus();
    }, 50);
  };

  // Parallax on mouse move over cards stack (desktop only)
  const handleStackMouseMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = gameplayStackContainerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    el.style.setProperty('--norm-x', normX.toFixed(3));
    el.style.setProperty('--norm-y', normY.toFixed(3));
  };

  const handleStackMouseLeave = () => {
    const el = gameplayStackContainerRef.current;
    if (!el) return;
    el.style.setProperty('--norm-x', '0');
    el.style.setProperty('--norm-y', '0');
  };

  // Lightbox keyboard listener (Escape to close, focus trap)
  useEffect(() => {
    if (!activeGameplayLightbox) return;

    lightboxCloseBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeGameplayLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGameplayLightbox]);

  // Section scroll-into-view observer
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsGameplayCardsInView(true);
        }
      },
      { threshold: 0.15 }
    );

    const el = gameplaySectionRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const handleOceanHotspotClick = (realmId) => {
    const cardEl = document.getElementById(`ocean-card-${realmId}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    setHighlightedOceanCardId(realmId);
    setTimeout(() => {
      setHighlightedOceanCardId(null);
    }, 1000);
  };

  // Staggered reveal for Ocean cards via IntersectionObserver; respect prefers-reduced-motion
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsOceanCardsInView(true);
        }
      },
      { threshold: 0.15 }
    );

    const el = oceanCardsRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const nextCreamSlide = () => {
    if (laptopScene.isSceneActive) {
      const nextIdx = (laptopScene.stage + 1) % CREAM_LAPTOP_SLIDES.length;
      laptopScene.scrollToStage(nextIdx);
    } else {
      setCreamSlideIndex((prev) => (prev + 1) % CREAM_LAPTOP_SLIDES.length);
    }
  };

  const prevCreamSlide = () => {
    if (laptopScene.isSceneActive) {
      const prevIdx = (laptopScene.stage - 1 + CREAM_LAPTOP_SLIDES.length) % CREAM_LAPTOP_SLIDES.length;
      laptopScene.scrollToStage(prevIdx);
    } else {
      setCreamSlideIndex((prev) => (prev - 1 + CREAM_LAPTOP_SLIDES.length) % CREAM_LAPTOP_SLIDES.length);
    }
  };

  const handleDotClick = (idx) => {
    if (laptopScene.isSceneActive) {
      laptopScene.scrollToStage(idx);
    } else {
      setCreamSlideIndex(idx);
    }
  };

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextCreamSlide();
      } else {
        prevCreamSlide();
      }
    }
    touchStartXRef.current = null;
  };

  // Autoplay slider every 5 seconds; pause on hover; pause when scene is active; respect prefers-reduced-motion
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isSliderHovered || laptopScene.isSceneActive) return;

    const timer = setInterval(() => {
      setCreamSlideIndex((prev) => (prev + 1) % CREAM_LAPTOP_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isSliderHovered, laptopScene.isSceneActive]);

  // Respond to keyboard arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevCreamSlide();
      } else if (e.key === 'ArrowRight') {
        nextCreamSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fade section in when scrolled into view (IntersectionObserver); respect prefers-reduced-motion
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSliderInView(true);
        }
      },
      { threshold: 0.15 }
    );

    const el = creamSliderRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  // Track window scroll for:
  // 1. Thin gold scroll-progress bar (requestAnimationFrame)
  // 2. Floating pill nav shrunk state (past 40px)
  // 3. Accurate nav link scroll-spy highlight across all sections
  // 4. Gentle parallax on hero backdrop (reduced-motion safe)
  useEffect(() => {
    let rafId = null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const sectionsForSpy = [
      { id: 'hero', navKey: 'hero' },
      { id: 'cream-laptop-slider', navKey: 'hero' },
      { id: 'four-realms-ocean', navKey: 'four-realms-ocean' },
      { id: 'gameplay-progression-showcase', navKey: 'gameplay-progression-showcase' },
      { id: 'notebook-build-story', navKey: 'gameplay-progression-showcase' },
      { id: 'game-intro', navKey: 'game-intro' },
      { id: 'gameplay-showcase', navKey: 'gameplay-progression-showcase' },
      { id: 'explorer-collection', navKey: 'explorer-collection' },
      { id: 'behind-the-worlds', navKey: 'behind-the-worlds' },
      { id: 'forest-outro', navKey: 'behind-the-worlds' },
    ];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolledPast40(scrollY > 40);

      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        // 1. Update gold scroll-progress bar
        const docEl = document.documentElement;
        const maxScroll = docEl.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.min(Math.max((scrollY / maxScroll) * 100, 0), 100) : 0;
        if (scrollProgressRef.current) {
          scrollProgressRef.current.style.width = `${progress}%`;
        }

        // 2. Gentle hero parallax (if motion enabled)
        if (!prefersReducedMotion && heroBackdropRef.current && scrollY < 1200) {
          heroBackdropRef.current.style.transform = `translate3d(0, ${scrollY * 0.32}px, 0)`;
        }

        // 3. Accurate scroll-spy
        if (window.innerHeight + scrollY >= docEl.scrollHeight - 60) {
          setActiveNavSection('behind-the-worlds');
          return;
        }

        const triggerY = scrollY + window.innerHeight * 0.35;
        let currentNav = 'hero';
        for (let i = 0; i < sectionsForSpy.length; i++) {
          const sectionEl = document.getElementById(sectionsForSpy[i].id);
          if (sectionEl && sectionEl.offsetTop <= triggerY) {
            currentNav = sectionsForSpy[i].navKey;
          }
        }
        setActiveNavSection(currentNav);
      });
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

  // GSAP Animations and ScrollTriggers (fires when intro is done)
  useEffect(() => {
    if (isIntroActive) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Subtle luxury entrance reveals on Hero elements
      const heroSelectors = [
        '.hero-ornament-crest',
        '.hero-main-title',
        '.hero-tagline-pill',
        '.hero-lead-narrative',
        '.hero-action-row',
        '.hero-telemetry-strip',
      ];
      heroSelectors.forEach((selector) => {
        if (document.querySelector(selector)) {
          gsap.from(selector, { y: 16, duration: 0.85, ease: 'power2.out' });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isIntroActive]);

  const handleScrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="mergeverse-root">
      {/* Cinematic Opening Sequence Overlay (STEP 8) */}
      {isIntroActive && (
        <CinematicOpening
          onComplete={() => {
            setIsIntroActive(false);
          }}
        />
      )}

      {/* Thin Gold Scroll-Progress Bar (requestAnimationFrame driven) */}
      <div ref={scrollProgressRef} className="global-scroll-progress-bar" aria-hidden="true" />

      {/* Accessible Skip to Content Link */}
      <a href="#main-content" className="skip-to-content-link">
        Skip to main content
      </a>

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
              className={`nav-item-link ${activeNavSection === 'game-intro' ? 'is-active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection('game-intro');
              }}
            >
              Overview
            </a>
            <a
              href="#four-realms-ocean"
              className={`nav-item-link ${activeNavSection === 'four-realms-ocean' ? 'is-active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection('four-realms-ocean');
              }}
            >
              Four Realms
            </a>
            <a
              href="#gameplay-progression-showcase"
              className={`nav-item-link ${activeNavSection === 'gameplay-progression-showcase' ? 'is-active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection('gameplay-progression-showcase');
              }}
            >
              Gameplay
            </a>
            <a
              href="#explorer-collection"
              className={`nav-item-link ${activeNavSection === 'explorer-collection' ? 'is-active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection('explorer-collection');
              }}
            >
              Codex
            </a>
            <a
              href="#behind-the-worlds"
              className={`nav-item-link nav-highlight ${activeNavSection === 'behind-the-worlds' ? 'is-active' : ''}`}
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
                handleScrollToSection('four-realms-ocean');
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
                className={`mobile-nav-link ${activeNavSection === 'game-intro' ? 'is-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('game-intro');
                  setIsMobileMenuOpen(false);
                }}
              >
                Overview
              </a>
              <a
                href="#four-realms-ocean"
                className={`mobile-nav-link ${activeNavSection === 'four-realms-ocean' ? 'is-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('four-realms-ocean');
                  setIsMobileMenuOpen(false);
                }}
              >
                Four Realms
              </a>
              <a
                href="#gameplay-progression-showcase"
                className={`mobile-nav-link ${activeNavSection === 'gameplay-progression-showcase' ? 'is-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('gameplay-progression-showcase');
                  setIsMobileMenuOpen(false);
                }}
              >
                Gameplay
              </a>
              <a
                href="#explorer-collection"
                className={`mobile-nav-link ${activeNavSection === 'explorer-collection' ? 'is-active' : ''}`}
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
                className={`mobile-nav-link nav-highlight ${activeNavSection === 'behind-the-worlds' ? 'is-active' : ''}`}
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

      <main id="main-content">

      {/* ---------------------------------------------------------------------
          HERO: CINEMATIC, IMAGE-LED OPENING COMPOSITION
          Atmospheric landscape anchor immediately visible with refined typography
          --------------------------------------------------------------------- */}
      <section
        id="hero"
        ref={heroViewportRef}
        className={`cinematic-hero-section ${isHeroInView ? 'is-in-view' : ''}`}
        aria-label="MERGEVERSE Cinematic Hero"
      >
        {/* Full-bleed authentic landscape visual anchor with gentle parallax */}
        <div ref={heroBackdropRef} className="hero-backdrop-container" aria-hidden="true">
          <img
            src="/images/mergeverse-title.jpg"
            alt="MERGEVERSE Alpine Landscape with sunlit peaks and pastoral valley meadows"
            className="hero-backdrop-image"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
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
          SECTION 1.5: CREAM LAPTOP SLIDER SECTION (SCENE 1: 3 STAGES)
          A World Built One Merge At A Time — Interactive Device Showcase
          --------------------------------------------------------------------- */}
      <section
        id="cream-laptop-slider"
        ref={creamSliderRef}
        className={`cream-scene-wrapper ${laptopScene.isSceneActive ? 'is-scene' : ''} cream-laptop-slider-section ${isSliderInView ? 'is-in-view' : ''}`}
        aria-label="A World Built One Merge At A Time Showcase"
      >
        <div className="scene-sticky-inner cream-scene-sticky-inner">
          <div
            className="cream-slider-outer-card scene-fit-content"
            onMouseEnter={() => setIsSliderHovered(true)}
            onMouseLeave={() => setIsSliderHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Round cream arrow buttons on left and right edges */}
            <button
              type="button"
              className="slider-nav-arrow slider-nav-prev"
              onClick={prevCreamSlide}
              aria-label="Previous slide"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              type="button"
              className="slider-nav-arrow slider-nav-next"
              onClick={nextCreamSlide}
              aria-label="Next slide"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* 3-Column Layout Grid */}
            <div className="cream-slider-inner-grid">
              {/* LEFT COLUMN: Large gold quote mark and 4-line serif headline */}
              <div className="cream-slider-left-col">
                <span className="cream-slider-quote-mark" aria-hidden="true">“</span>
                <h2 className="cream-slider-quote-headline">
                  <span>A WORLD</span>
                  <span>BUILT ONE</span>
                  <span>MERGE AT</span>
                  <span>A TIME.</span>
                </h2>
              </div>

              {/* CENTER COLUMN: CSS-only Laptop & Dots */}
              <div className="cream-slider-center-col">
                <div className="laptop-mockup-wrapper">
                  {/* Dark rounded bezel screen lid */}
                  <div className="laptop-screen-lid">
                    {/* Camera notch at top center */}
                    <div className="laptop-camera-notch" aria-hidden="true">
                      <span className="laptop-camera-lens" />
                    </div>

                    {/* 16:10 Screen Display Area */}
                    <div className="laptop-screen-display">
                      {CREAM_LAPTOP_SLIDES.map((slide, idx) => (
                        <div
                          key={slide.id}
                          data-scene-stage={idx}
                          className={`laptop-slide ${idx === creamSlideIndex ? 'is-active' : ''}`}
                          aria-hidden={idx !== creamSlideIndex}
                        >
                          <img
                            src={slide.image}
                            alt={slide.alt}
                            className="laptop-slide-image"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Silver base below screen with center notch */}
                  <div className="laptop-base-chassis" aria-hidden="true">
                    <div className="laptop-notch-indent" />
                  </div>

                  {/* Soft shadow underneath */}
                  <div className="laptop-bottom-shadow" aria-hidden="true" />
                </div>

                {/* 3 Small Dots below the laptop */}
                <div className="laptop-dots-nav" role="tablist" aria-label="Slide dots">
                  {CREAM_LAPTOP_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      role="tab"
                      aria-selected={idx === creamSlideIndex}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`laptop-dot-btn ${idx === creamSlideIndex ? 'is-active' : ''}`}
                      onClick={() => handleDotClick(idx)}
                      data-scene-stage={idx}
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: Badge, Heading, Paragraph, Gold Read More Button */}
              <div className="cream-slider-right-col">
                <div className="cream-slider-badge-pill">
                  <span className="badge-sparkle" aria-hidden="true">✦</span>
                  <span>Mergeverse Resources</span>
                </div>

                {/* Synchronized slide text with smooth fade/slide transition */}
                <div className="cream-slider-text-stack">
                  {CREAM_LAPTOP_SLIDES.map((slide, idx) => (
                    <div
                      key={slide.id}
                      data-scene-stage={idx}
                      className={`cream-slide-text-item ${idx === creamSlideIndex ? 'is-active' : ''}`}
                      aria-hidden={idx !== creamSlideIndex}
                    >
                      <h3 className="cream-slide-heading">{slide.heading}</h3>
                      <p className="cream-slide-description">{slide.description}</p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="cream-slider-read-more-btn"
                  onClick={() => handleScrollToSection('game-intro')}
                  aria-label="Read more about Mergeverse chapters"
                >
                  <span>Read more</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Edge Stage Indicator (aria-hidden, decorative) */}
          <div className="scene-stage-indicator" aria-hidden="true">
            {CREAM_LAPTOP_SLIDES.map((_, i) => (
              <span key={i} className={`scene-stage-dot ${i === creamSlideIndex ? 'is-active' : ''}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          SECTION 1.8: OCEAN ARCHIPELAGO — THE FOUR REALMS (SCENE 2: 4 STAGES)
          Full-width section with CSS-only animated ocean, floating map & interactive hotspots
          --------------------------------------------------------------------- */}
      <section
        id="four-realms-ocean"
        ref={oceanSectionRef}
        className={`ocean-scene-wrapper ${oceanScene.isSceneActive ? 'is-scene' : ''} ocean-realms-section ${isOceanInView ? 'is-in-view' : ''}`}
        aria-label="The Four Realms Archipelago"
      >
        <div className="scene-sticky-inner ocean-scene-sticky-inner">
          {/* Animated Ocean Background: Teal/Deep Blue Gradients, Drift Waves, Clouds & Sparkles */}
          <div className="ocean-bg-canvas" aria-hidden="true">
            <div className="ocean-gradient-layer" />
            <div className="ocean-wave-band ocean-wave-1" />
            <div className="ocean-wave-band ocean-wave-2" />
            <div className="ocean-wave-band ocean-wave-3" />
            <div className="ocean-cloud ocean-cloud-1" />
            <div className="ocean-cloud ocean-cloud-2" />
            <div className="ocean-cloud ocean-cloud-3" />
            <div className="ocean-sparkles-field">
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className="ocean-sparkle-dot"
                  style={{
                    top: `${(i * 17 + 9) % 94}%`,
                    left: `${(i * 23 + 4) % 96}%`,
                    animationDelay: `${(i * 0.35).toFixed(1)}s`,
                    animationDuration: `${2.4 + (i % 4) * 0.7}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="ocean-content-wrapper scene-fit-content">
            {/* Top of Section: Gold badge, serif headline & centered short line */}
            <div className="ocean-section-header">
              <div className="ocean-eyebrow-badge">
                <span className="ocean-eyebrow-star" aria-hidden="true">✦</span>
                <span>ARCHIPELAGO</span>
                <span className="ocean-eyebrow-star" aria-hidden="true">✦</span>
              </div>
              <h2 className="ocean-section-headline">FOUR REALMS. ONE LIVING WORLD.</h2>
              <p className="ocean-section-subhead">
                Explore the four sovereign lands of human discovery, united across a boundless living ocean.
              </p>
            </div>

            {/* Center: World Map Image with Floating Animation & Interactive Hotspots */}
            <div className="ocean-map-floating-wrap">
              <div className="ocean-map-img-frame">
                <img
                  src="/images/world-map.jpg"
                  alt="Mergeverse World Map Archipelago"
                  className="ocean-map-image"
                  loading="lazy"
                  decoding="async"
                />

                {/* 4 Interactive Hotspot Buttons */}
                {OCEAN_REALMS_DATA.map((realm, idx) => (
                  <button
                    key={realm.id}
                    type="button"
                    className={`ocean-hotspot-btn hotspot-${realm.id}`}
                    style={{ left: realm.hotspot.x, top: realm.hotspot.y }}
                    onClick={() => handleOceanHotspotClick(realm.id)}
                    data-scene-stage={idx}
                    aria-label={`${realm.name} realm — ${realm.tooltipStatus}. Click to highlight realm card.`}
                  >
                    <span className="hotspot-pulse-ring" aria-hidden="true" />
                    <span className="hotspot-core-dot" aria-hidden="true" />

                    {/* Tooltip Card on Hover / Focus */}
                    <span className="hotspot-tooltip-card" role="tooltip">
                      <span className="tooltip-name">{realm.name}</span>
                      <span
                        className={`tooltip-status ${realm.isGoldStatus ? 'status-active' : 'status-soon'}`}
                      >
                        {realm.tooltipStatus}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Row of 4 Glass Cards (Staggered Animation via IntersectionObserver) */}
            <div
              ref={oceanCardsRef}
              className={`ocean-cards-grid ${isOceanCardsInView ? 'is-in-view' : ''}`}
            >
              {OCEAN_REALMS_DATA.map((realm, idx) => (
                <div
                  key={realm.id}
                  id={`ocean-card-${realm.id}`}
                  data-scene-stage={idx}
                  tabIndex={0}
                  className={`ocean-realm-card ${highlightedOceanCardId === realm.id ? 'is-highlighted-card' : ''}`}
                  style={{
                    transitionDelay: `${idx * 80}ms`,
                  }}
                >
                  <div className="ocean-card-header">
                    <span className="ocean-card-icon" aria-hidden="true">
                      {realm.icon}
                    </span>
                    <span
                      className={`ocean-status-pill ${realm.isGoldStatus ? 'status-active' : 'status-soon'}`}
                    >
                      {realm.status}
                    </span>
                  </div>
                  <h3 className="ocean-card-title">{realm.name}</h3>
                  <p className="ocean-card-desc">{realm.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Edge Stage Indicator (aria-hidden, decorative) */}
          <div className="scene-stage-indicator" aria-hidden="true">
            {OCEAN_REALMS_DATA.map((_, i) => (
              <span key={i} className={`scene-stage-dot ${i === oceanScene.stage ? 'is-active' : ''}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          SECTION 1.9: AUTHENTIC GAMEPLAY & PROGRESSION — OVERLAPPING CARDS (SCENE 3: 4 STAGES)
          Cream Rounded Card with Interactive Staggered Floating Cards & Lightbox
          --------------------------------------------------------------------- */}
      <section
        id="gameplay-progression-showcase"
        ref={gameplaySectionRef}
        className={`gameplay-scene-wrapper ${gameplayScene.isSceneActive ? 'is-scene' : ''} gameplay-cards-section ${isGameplayCardsInView ? 'is-in-view' : ''}`}
        aria-label="Authentic Gameplay & Progression Showcase"
      >
        <div className="scene-sticky-inner gameplay-scene-sticky-inner">
          <div className="gameplay-cards-outer-card scene-fit-content">
            <div className="gameplay-cards-inner-grid">
              {/* LEFT COLUMN: Badge, Heading, Narrative, Checkmarks & Gold CTA */}
              <div className="gameplay-text-col">
                <div className="gameplay-badge-pill">
                  <span className="badge-star" aria-hidden="true">✦</span>
                  <span>GAMEPLAY</span>
                  <span className="badge-star" aria-hidden="true">✦</span>
                </div>

                <h2 className="gameplay-section-title">
                  AUTHENTIC GAMEPLAY &amp; PROGRESSION
                </h2>

                <p className="gameplay-section-lead">
                  Merge, solve and learn. Every level is a new puzzle, and every win unlocks a real piece of history.
                </p>

                {/* Three short gold-checkmark lines */}
                <ul className="gameplay-checkmarks-list" aria-label="Key Gameplay Features">
                  <li
                    className={`gameplay-check-item ${!gameplayScene.isSceneActive || gameplayScene.stage >= 0 ? 'is-checked' : ''}`}
                    data-scene-stage={0}
                  >
                    <span className="check-icon-circle" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span>Merge boards with varied level variants</span>
                  </li>
                  <li
                    className={`gameplay-check-item ${!gameplayScene.isSceneActive || gameplayScene.stage >= 1 ? 'is-checked' : ''}`}
                    data-scene-stage={1}
                  >
                    <span className="check-icon-circle" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span>Knowledge question after every win</span>
                  </li>
                  <li
                    className={`gameplay-check-item ${!gameplayScene.isSceneActive || gameplayScene.stage >= 2 ? 'is-checked' : ''}`}
                    data-scene-stage={2}
                  >
                    <span className="check-icon-circle" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span>XP, stars and collection to track progress</span>
                  </li>
                </ul>

                <button
                  type="button"
                  className="gameplay-explore-btn"
                  onClick={() => handleScrollToSection('gameplay-progression-showcase')}
                  aria-label="Scroll to Gameplay Progression Showcase"
                >
                  <span>Explore Gameplay Mechanics</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>

              {/* RIGHT COLUMN: Stack of 4 Screenshot Cards with Absolute Rotations & Parallax */}
              <div className="gameplay-stack-col">
                <div
                  ref={gameplayStackContainerRef}
                  className="gameplay-cards-stack-container"
                  onMouseMove={handleStackMouseMove}
                  onMouseLeave={handleStackMouseLeave}
                >
                  {GAMEPLAY_OVERLAPPING_CARDS.map((card, idx) => (
                    <button
                      key={card.id}
                      type="button"
                      data-scene-stage={idx}
                      className={`gameplay-stack-card card-${card.id} ${card.isFront ? 'front-card' : ''}`}
                      style={{
                        '--card-rot': `${card.rotation}deg`,
                        '--shift-x': `${card.shiftX}px`,
                        '--shift-y': `${card.shiftY}px`,
                        '--fly-delay': `${idx * 100}ms`,
                      }}
                      onClick={(e) => openGameplayLightbox(card, e.currentTarget)}
                      aria-label={`Inspect full resolution ${card.title} screenshot`}
                    >
                      <div className="card-image-wrap">
                        <img
                          src={card.image}
                          alt={card.alt}
                          className="card-screenshot-img"
                          loading="lazy"
                          decoding="async"
                        />
                        {/* Caption Chip appearing on hover/focus */}
                        <span className="card-caption-chip">
                          {card.caption}
                        </span>
                      </div>

                      {/* CSS-Only Page Curl folded corner on top-right of front card */}
                      {card.isFront && (
                        <span className="card-page-curl-corner" aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Edge Stage Indicator (aria-hidden, decorative) */}
          <div className="scene-stage-indicator" aria-hidden="true">
            {GAMEPLAY_OVERLAPPING_CARDS.map((_, i) => (
              <span key={i} className={`scene-stage-dot ${i === gameplayScene.stage ? 'is-active' : ''}`} />
            ))}
          </div>
        </div>

        {/* LIGHTBOX MODAL */}
        {activeGameplayLightbox && (
          <div
            className="gameplay-lightbox-overlay"
            onClick={closeGameplayLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeGameplayLightbox.title} Lightbox Preview`}
          >
            <div
              className="gameplay-lightbox-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={lightboxCloseBtnRef}
                type="button"
                className="gameplay-lightbox-close-btn"
                onClick={closeGameplayLightbox}
                aria-label="Close image lightbox"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className="gameplay-lightbox-image-wrap">
                <img
                  src={activeGameplayLightbox.image}
                  alt={activeGameplayLightbox.alt}
                  className="gameplay-lightbox-full-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="gameplay-lightbox-footer-caption">
                <span className="lightbox-caption-tag">✦ IN-GAME CAPTURE</span>
                <span className="lightbox-caption-title">{activeGameplayLightbox.title}</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ---------------------------------------------------------------------
          SECTION 1.95: NOTEBOOK BUILD STORY & DESK SHOWCASE
          Full-width wooden desk with CSS spiral notebook & interactive playtest monitor
          --------------------------------------------------------------------- */}
      <section
        id="notebook-build-story"
        ref={notebookSectionRef}
        className="desk-build-story-section"
        aria-label="Built Step by Step. Tested Merge by Merge"
      >
        {/* Decorative Desk Props: Faint Coffee-Ring Stain & Pencil (Non-clickable, behind content) */}
        <div className="desk-coffee-stain" aria-hidden="true" />
        <div className="desk-pencil" aria-hidden="true" />

        <div className="desk-content-container">
          {/* Section Header */}
          <div className="desk-header-lockup">
            <h2 className="desk-main-heading">
              BUILT STEP BY STEP. TESTED MERGE BY MERGE.
            </h2>
            <p className="desk-subheading">
              Every level was planned, built and played by one creator, then improved after each test.
            </p>

            {/* Three small round tool chips: Glass style, thin gold border */}
            <div className="desk-tools-chips-row">
              <div className="desk-tool-chip">
                <span className="chip-sparkle" aria-hidden="true">✦</span>
                <span>Planning — ChatGPT</span>
              </div>
              <div className="desk-tool-chip">
                <span className="chip-sparkle" aria-hidden="true">✦</span>
                <span>Art — Gemini</span>
              </div>
              <div className="desk-tool-chip">
                <span className="chip-sparkle" aria-hidden="true">✦</span>
                <span>Build — Antigravity</span>
              </div>
            </div>
          </div>

          {/* Desk Composition: Notebook on Left, Monitor on Right */}
          <div className="desk-composition-layout">
            {/* LEFT: THE NOTEBOOK (CSS only) */}
            <div className="notebook-assembly-col">
              <div className="notebook-page-card">
                {/* Translucent tape at top */}
                <div className="notebook-top-tape" aria-hidden="true" />

                {/* Left spiral rings */}
                <div className="notebook-spiral-binder" aria-hidden="true">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="spiral-ring-unit">
                      <span className="ring-hole" />
                      <span className="ring-loop" />
                    </div>
                  ))}
                </div>

                {/* Notebook Page Content */}
                <div className="notebook-inner-ruled-content">
                  <div className="notebook-header-stamp" aria-hidden="true">
                    <span>DEV LOG · EXPEDITION 01</span>
                  </div>

                  <ul className="notebook-checklist">
                    {NOTEBOOK_CHECKLIST_ITEMS.map((item, idx) => (
                      <li
                        key={item.id}
                        className={`notebook-check-row ${isNotebookInView ? 'is-animated' : ''}`}
                        style={{
                          '--item-delay': `${idx * 250}ms`,
                        }}
                      >
                        {/* Hand-drawn style checkmark */}
                        <span className="notebook-check-glyph" aria-hidden="true">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 12.5l5.5 5.5L20 6" />
                          </svg>
                        </span>

                        {/* Hand-written text with clip-path writing reveal */}
                        <span className="notebook-line-text">
                          {item.text}
                        </span>

                        {/* Hand-drawn loop doodle next to "Play. Fix. Repeat." */}
                        {item.hasDoodle && (
                          <span className="notebook-hand-doodle" aria-hidden="true">
                            <svg width="54" height="30" viewBox="0 0 64 36" fill="none" stroke="#d97706" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 22 C 16 6, 42 6, 52 18 C 57 25, 46 32, 36 26 C 28 20, 36 8, 48 12" />
                              <polyline points="50 7 49 13 43 12" />
                            </svg>
                            <span className="doodle-note-text">Cycle</span>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* RIGHT: THE MONITOR (CSS only) */}
            <div className="monitor-assembly-col">
              <div className="monitor-rig-wrapper">
                <button
                  type="button"
                  className="monitor-display-frame"
                  onMouseEnter={() => setIsMonitorHovered(true)}
                  onMouseLeave={() => setIsMonitorHovered(false)}
                  onClick={toggleMonitorScreen}
                  aria-label="Playtest desktop monitor. Shows Level 19 Harvest Board screenshot; hover or tap to swap to the World Map"
                >
                  <div className="monitor-bezel-rim">
                    {/* 16:10 Screen Viewport */}
                    <div className="monitor-screen-viewport">
                      {/* Screenshot 1: Level 19 Harvest Board */}
                      <img
                        src="/images/gameplay.jpg"
                        alt="Level 19 Harvest Board in-game gameplay screenshot"
                        className={`monitor-screen-img ${isWorldMapShowing ? 'img-hidden' : 'img-active'}`}
                        loading="lazy"
                        decoding="async"
                      />

                      {/* Screenshot 2: World Map (Swapped on hover/tap) */}
                      <img
                        src="/images/world-map.jpg"
                        alt="World Map Archipelago in-game screenshot"
                        className={`monitor-screen-img ${isWorldMapShowing ? 'img-active' : 'img-hidden'}`}
                        loading="lazy"
                        decoding="async"
                      />

                      {/* Screen reflection/glare */}
                      <div className="monitor-screen-glare" aria-hidden="true" />

                      {/* Screen HUD badge indicating active view */}
                      <div className="monitor-hud-badge" aria-hidden="true">
                        <span className="hud-rec-dot" />
                        <span>{isWorldMapShowing ? 'ARCHIPELAGO MAP' : 'LEVEL 19 · HARVEST'}</span>
                      </div>
                    </div>

                    {/* Monitor Bottom Chin with Power Light */}
                    <div className="monitor-bottom-chin" aria-hidden="true">
                      <span className="monitor-brand-mark">MERGEVERSE ENGINE</span>
                      <span className="monitor-status-light" />
                    </div>
                  </div>
                </button>

                {/* Silver Stand and Base */}
                <div className="monitor-stand-chassis" aria-hidden="true">
                  <div className="stand-neck-pillar" />
                  <div className="stand-pedestal-base" />
                </div>

                {/* Sticky Note under the monitor */}
                <div className="monitor-sticky-note" aria-hidden="true">
                  <span className="sticky-tape-strip" />
                  <span className="sticky-note-handwriting">
                    {isWorldMapShowing ? 'World Map — verified!' : 'Level 19 — playtested!'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Soft Seam Divider: Wood Atelier Desk to Warm Cream Parchment */}
      <div className="section-seam section-seam--wood-to-cream" aria-hidden="true">
        <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
          <path d="M0,0 C480,36 960,36 1440,0 L1440,48 L0,48 Z" fill="var(--cream-100)" />
        </svg>
      </div>

      {/* ---------------------------------------------------------------------
          SECTION 2: INTRODUCTION — EDITORIAL SPLIT COMPOSITION
          Meaningful text on one side, genuine game artwork on the other
          Warm Cream & Parchment Editorial Tone
          --------------------------------------------------------------------- */}
      <section
        id="game-intro"
        ref={presentationRef}
        className="section section--cream"
        aria-label="MERGEVERSE Introduction"
      >
        <div className="section-container">
          {/* Section Header */}
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <div className="eyebrow">
              <span className="eyebrow-star">✦</span>
              <span>OVERVIEW · THE ARTISTIC VISION</span>
              <span className="eyebrow-star">✦</span>
            </div>
            <h2 className="section-title">Where Human Breakthroughs Become Living Puzzles</h2>
            <p className="section-lead">
              Conceived and directed by indie creator <strong style={{ color: 'var(--ink-900)' }}>Vikas</strong>, MERGEVERSE
              reimagines the puzzle-merge genre as an expansive chronicle of human breakthrough.
            </p>
          </div>

          {/* 4 Key Stats Bar */}
          <div className="stats-grid reveal" aria-label="Authentic Basecamp Statistics">
            <div className="stat-card">
              <span className="stat-card__number">18 / 80</span>
              <span className="stat-card__label">Discoveries Cataloged</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__number">18 / 20</span>
              <span className="stat-card__label">Agriculture Milestones</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__number">Level 6</span>
              <span className="stat-card__label">1,395 / 1,400 XP</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__number">Level 19</span>
              <span className="stat-card__label">Active Challenge Board</span>
            </div>
          </div>

          {/* Editorial Split Composition */}
          <div className="split-grid">
            {/* Left Column: Meaningful Editorial Storytelling */}
            <div className="reveal">
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--ink-600)', marginBottom: 'var(--space-4)' }}>
                Rather than merging abstract jewels, sweets, or candies, players synthesize the tangible agrarian, culinary, medicinal, and engineering achievements that built human civilization.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--ink-600)', marginBottom: 'var(--space-4)' }}>
                Every board is grounded in genuine historical progress: combining raw grains and clay ovens to discover harvest nutrition, or uniting apothecary herbs to advance clinical care across four sovereign realms.
              </p>

              <blockquote className="pullquote-editorial">
                <span className="pullquote-editorial__glyph">“</span>
                <p className="pullquote-editorial__text">
                  Every merge charts the tangible resilience of humanity—from the first cultivated seed in ancient soil to universal adaptive design.
                </p>
                <cite className="pullquote-editorial__cite">— Vikas, Creator & Director of MERGEVERSE</cite>
              </blockquote>

              {/* Verified Feature Chips */}
              <div className="chips-grid">
                <div className="chip-card">
                  <span className="chip-card__glyph">🧩</span>
                  <div>
                    <span className="chip-card__title">5×6 Cascade Grid</span>
                    <span className="chip-card__sub">Multi-tier item merges</span>
                  </div>
                </div>

                <div className="chip-card">
                  <span className="chip-card__glyph">📖</span>
                  <div>
                    <span className="chip-card__title">80 Discovery Codex</span>
                    <span className="chip-card__sub">Permanent archival ledger</span>
                  </div>
                </div>

                <div className="chip-card">
                  <span className="chip-card__glyph">🗺️</span>
                  <div>
                    <span className="chip-card__title">4 Sky Realms</span>
                    <span className="chip-card__sub">Floating cloud archipelago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Genuine Framed Game Artwork */}
            <div className="reveal">
              <div className="card--cream" style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-card)' }}>
                <div className="media-frame">
                  <img
                    src="/images/home-dashboard.jpg"
                    alt="MERGEVERSE Alpine Sanctuary & Expedition Basecamp in-game screenshot"
                    className="media-frame__img"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="media-frame__badge badge badge--gold" style={{ background: 'rgba(9, 28, 20, 0.88)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 6px var(--success)' }} />
                    <span>Authentic In-Game Capture</span>
                  </div>
                  <button
                    type="button"
                    className="media-frame__btn btn btn--ghost"
                    onClick={() => setIsDashboardModalOpen(true)}
                    aria-label="Inspect Full Resolution Basecamp Screenshot"
                  >
                    <span>⛶</span>
                    <span>Inspect Interface</span>
                  </button>
                </div>

                <div style={{ padding: 'var(--space-4) var(--space-2) var(--space-1)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--ink-900)', margin: '0 0 var(--space-2)' }}>
                    The Alpine Sanctuary · Player Basecamp
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', lineHeight: 1.6, color: 'var(--ink-600)', margin: 0 }}>
                    Persistent explorer station showing Explorer Level 6 standing (1,395 / 1,400 XP), verified three-star ratings, avatar selection, and expedition telemetry set against the sunlit alpine valley.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Soft Seam Divider: Warm Cream Parchment to Deep Forest Emerald */}
      <div className="section-seam section-seam--cream-to-dark" aria-hidden="true">
        <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
          <path d="M0,0 C480,36 960,36 1440,0 L1440,48 L0,48 Z" fill="var(--green-900)" />
        </svg>
      </div>

      {/* ---------------------------------------------------------------------
          SECTION 4: GAMEPLAY SHOWCASE — ALTERNATING ASYMMETRIC COMPOSITION
          Large genuine screenshots as visual anchors with alternating placement
          Deep Slate-Emerald Tone
          --------------------------------------------------------------------- */}
      <section
        id="gameplay-showcase"
        className="section section--dark"
        aria-label="MERGEVERSE Gameplay In Motion"
      >
        <div className="section-container">
          {/* Section Header */}
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-7)' }}>
            <div className="eyebrow">
              <span className="eyebrow-star">✦</span>
              <span>IN-ENGINE MECHANICS · LIVE HARVEST BOARD</span>
              <span className="eyebrow-star">✦</span>
            </div>
            <h2 className="section-title">Gameplay, In Motion</h2>
            <p className="section-lead">
              Captured live in Level 19. Explorers combine elemental agrarian resources across a 5×6 puzzle grid—merging grain stalks, fresh shoots, and culinary vessels to fulfill harvest orders and unlock civilization's milestones.
            </p>
          </div>

          {/* MOVEMENT 1: Level 19 Harvest Board (Image Left, Mechanics Right) */}
          <div className="showcase-row reveal">
            <div className="showcase-row__media">
              <div className="media-frame">
                <img
                  src="/images/gameplay.jpg"
                  alt="MERGEVERSE Level 19 live gameplay board showing 5x6 puzzle grid, recipe order fulfillment, item merges, and tactical action tray"
                  className="media-frame__img"
                  loading="lazy"
                  decoding="async"
                />
                <div className="media-frame__badge badge badge--gold" style={{ background: 'rgba(9, 28, 20, 0.88)' }}>
                  Level 19 Harvest Board
                </div>
                <button
                  type="button"
                  className="media-frame__btn btn btn--ghost"
                  onClick={() => setIsGameplayModalOpen(true)}
                  aria-label="Inspect Full Resolution Gameplay Screenshot"
                >
                  <span>⛶</span>
                  <span>View Full Resolution</span>
                </button>
              </div>
            </div>

            <div className="showcase-row__content">
              <div className="eyebrow" style={{ marginBottom: 'var(--space-2)' }}>
                BOARD MECHANICS · 5×6 GRID
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 700, lineHeight: 1.25, color: 'var(--cream-50)', margin: '0 0 var(--space-3)' }}>
                Artisanal Order Fulfillment & Cascade Merges
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 var(--space-4)' }}>
                Explorers advance by fulfilling specific civilizational orders. In Level 19, active quotas demand synthesizing a completed <strong style={{ color: 'var(--cream-50)' }}>Clay-Oven Flatbread</strong> and crafting an active{' '}
                <strong style={{ color: 'var(--cream-50)' }}>Sourdough Harvest Loaf (0/1)</strong> from raw field elements.
              </p>

              {/* Mechanics breakdown with gold check lines */}
              <div className="checkmarks-list">
                <div className="checkmark-item checkmark-item--glass">
                  <div className="checkmark-item__icon">⚡</div>
                  <div>
                    <h4 className="checkmark-item__title">Cascade Synthesis & Double Merges</h4>
                    <p className="checkmark-item__desc">
                      Combining Tier 1 Grain Stalks and Tier 2 Shoots yields Tier 3 Mixing Bowls and Tier 6 Loaves, triggering satisfying <em>Double Merge</em> score and combo multipliers.
                    </p>
                  </div>
                </div>

                <div className="checkmark-item checkmark-item--glass">
                  <div className="checkmark-item__icon">🛠️</div>
                  <div>
                    <h4 className="checkmark-item__title">Tactical Action Tray</h4>
                    <p className="checkmark-item__desc">
                      Field expedition tools include the <strong style={{ color: 'var(--cream-50)' }}>Resource Spawner (6 remaining)</strong>, tactical board{' '}
                      <strong style={{ color: 'var(--cream-50)' }}>Shuffle</strong>, precision <strong style={{ color: 'var(--cream-50)' }}>Zap</strong>, <strong style={{ color: 'var(--cream-50)' }}>+3 Spawns</strong> boost, and contextual{' '}
                      <strong style={{ color: 'var(--cream-50)' }}>Hints</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MOVEMENT 2: Alternating Composition (Text Left, Image Right) */}
          <div className="showcase-row showcase-row--reverse reveal">
            <div className="showcase-row__content">
              <div className="eyebrow" style={{ marginBottom: 'var(--space-2)' }}>
                PEDAGOGICAL DESIGN · KNOWLEDGE CHALLENGE
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 700, lineHeight: 1.25, color: 'var(--cream-50)', margin: '0 0 var(--space-3)' }}>
                Civilizational Milestones & In-Game Challenges
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 var(--space-4)' }}>
                MERGEVERSE integrates educational discovery directly into gameplay. Upon fulfilling harvest quotas, explorers encounter authentic in-game <strong style={{ color: 'var(--cream-50)' }}>Knowledge Challenges</strong> that test verified historical facts regarding crop rotation, mill mechanics, and settlement agriculture.
              </p>

              <div className="checkmarks-list">
                <div className="checkmark-item checkmark-item--glass">
                  <div className="checkmark-item__icon">🎯</div>
                  <div>
                    <h4 className="checkmark-item__title">Objective Verification & Ratings</h4>
                    <p className="checkmark-item__desc">
                      Correct responses award three-star ratings, bonus XP toward the Explorer Level 6 threshold (1,395/1,400 XP), and unlock permanent codex milestone entries.
                    </p>
                  </div>
                </div>

                <div className="checkmark-item checkmark-item--glass">
                  <div className="checkmark-item__icon">🌱</div>
                  <div>
                    <h4 className="checkmark-item__title">Historical Progress Narrative</h4>
                    <p className="checkmark-item__desc">
                      Each puzzle solved represents a real civilizational leap—from the initial plow furrow to early irrigation networks.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="showcase-row__media">
              <div className="media-frame">
                <img
                  src="/images/knowledge-challenge.png"
                  alt="MERGEVERSE In-Game Knowledge Challenge screen testing real agrarian civilization facts"
                  className="media-frame__img"
                  loading="lazy"
                  decoding="async"
                />
                <div className="media-frame__badge badge badge--gold" style={{ background: 'rgba(9, 28, 20, 0.88)' }}>
                  In-Game Knowledge Challenge
                </div>
                <button
                  type="button"
                  className="media-frame__btn btn btn--ghost"
                  onClick={() => setIsKnowledgeModalOpen(true)}
                  aria-label="Inspect Full Resolution Knowledge Challenge Screenshot"
                >
                  <span>⛶</span>
                  <span>View Full Resolution</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Soft Seam Divider: Deep Forest Emerald to Warm Cream Archival Codex */}
      <div className="section-seam section-seam--dark-to-cream" aria-hidden="true">
        <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
          <path d="M0,0 C480,36 960,36 1440,0 L1440,48 L0,48 Z" fill="var(--cream-100)" />
        </svg>
      </div>

      {/* ---------------------------------------------------------------------
          SECTION 5: COLLECTION & PROGRESSION — ARCHIVAL FOLIO CODEX
          Illuminated civilizational manuscript ledger composition
          Warm Cream & Parchment Tone
          --------------------------------------------------------------------- */}
      <section
        id="explorer-collection"
        className="section section--cream"
        aria-label="MERGEVERSE Explorer Collection & Discovery Progression"
      >
        <div className="section-container">
          {/* Section Header */}
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <div className="eyebrow">
              <span className="eyebrow-star">✦</span>
              <span>EXPEDITION CODEX · THE ARCHIVE</span>
              <span className="eyebrow-star">✦</span>
            </div>
            <h2 className="section-title">A World of Discovery</h2>
            <p className="section-lead">
              The Explorer Collection chronicles humanity's foundational milestones across the four realms. From early agrarian breakthroughs to advanced farm mechanization, each merged discovery is preserved in the expedition codex.
            </p>
          </div>

          {/* Archival Folio Wrapper */}
          <div className="folio-card reveal">
            {/* Folio Header & Progress Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid rgba(233, 173, 72, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>📜</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--ink-900)', margin: '0 0 var(--space-1)' }}>
                    Civilizational Progression Ledger
                  </h3>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 600, color: 'var(--ink-600)' }}>
                    80 Historical Milestones Cataloged Across 4 Realms
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--ink-900)' }}>
                  18 / 80
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--gold-500)' }}>
                  TOTAL PROGRESS
                </div>
              </div>

              {/* Gold Progress Bar */}
              <div className="progress-bar" style={{ width: '100%', marginTop: 'var(--space-2)' }}>
                <div className="progress-bar__fill" style={{ width: '22.5%' }} />
              </div>
            </div>

            {/* Split Spread: Left Screenshot / Right Volumes */}
            <div className="split-grid" style={{ alignItems: 'start' }}>
              {/* Left Column: Framed High-Res Collection Capture */}
              <div>
                <div className="media-frame media-frame--folio">
                  <img
                    src="/images/collection.jpg"
                    alt="MERGEVERSE Explorer Collection in-game interface showing 18 of 80 discoveries unlocked across Agriculture & Earth and Food & Nutrition"
                    className="media-frame__img"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="media-frame__badge badge badge--gold" style={{ background: 'rgba(9, 28, 20, 0.88)' }}>
                    Archival Codex · 18 / 80 Discoveries
                  </div>
                  <button
                    type="button"
                    className="media-frame__btn btn btn--ghost"
                    onClick={() => setIsCollectionModalOpen(true)}
                    aria-label="Inspect Full Resolution Collection Interface"
                  >
                    <span>⛶</span>
                    <span>View Full Resolution</span>
                  </button>
                </div>

                <div style={{ padding: 'var(--space-3) var(--space-1) 0' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', lineHeight: 1.55, color: 'var(--ink-600)', margin: 0 }}>
                    <strong style={{ color: 'var(--ink-900)' }}>Verified In-Engine Capture:</strong> Displays the Discoveries tab, showing Volume I: Agriculture & Earth (18/20 milestones unlocked) and Volume II: Food & Nutrition (awaiting unlock).
                  </p>
                </div>
              </div>

              {/* Right Column: Volume Entries & Milestone Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {/* Volume I: Agriculture & Earth */}
                <div style={{ background: 'var(--cream-50)', border: '1.5px solid rgba(74, 222, 128, 0.5)', borderRadius: 'var(--radius-card)', padding: 'var(--space-4)', boxShadow: '0 4px 16px rgba(74, 222, 128, 0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--gold-500)', letterSpacing: '0.08em' }}>VOLUME I</span>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink-900)', margin: 0 }}>Agriculture & Earth</h4>
                    </div>
                    <span className="badge badge--gold" style={{ fontSize: '0.7rem' }}>
                      18 / 20 Milestones Unlocked (90%)
                    </span>
                  </div>

                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', lineHeight: 1.5, color: 'var(--ink-600)', margin: '0 0 var(--space-3)' }}>
                    Chronicles the dawn of agrarian civilization—from primal seed cultivation to mechanical threshing.
                  </p>

                  <div className="codex-entries-grid">
                    <span className="badge badge--gold" style={{ justifyContent: 'center' }}>✦ The Planted Fertility</span>
                    <span className="badge badge--gold" style={{ justifyContent: 'center' }}>✦ Working with Draft Animals</span>
                    <span className="badge badge--gold" style={{ justifyContent: 'center' }}>✦ Early Irrigation Furrows</span>
                    <span className="badge badge--gold" style={{ justifyContent: 'center' }}>✦ Waterworks & Windmills</span>
                    <span className="badge badge--gold" style={{ justifyContent: 'center' }}>✦ The Steel Plow</span>
                    <span className="badge badge--gold" style={{ justifyContent: 'center' }}>✦ The Green Revolution</span>
                    <span className="badge badge--muted" style={{ justifyContent: 'center', gridColumn: '1 / -1' }}>🔒 Milestones XIX & XX Locked</span>
                  </div>
                </div>

                {/* Volume II: Food & Nutrition */}
                <div style={{ background: 'var(--cream-50)', border: '1px dashed rgba(233, 173, 72, 0.4)', borderRadius: 'var(--radius-card)', padding: 'var(--space-4)', opacity: 0.9 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink-600)', letterSpacing: '0.08em' }}>VOLUME II</span>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink-900)', margin: 0 }}>Food & Nutrition</h4>
                    </div>
                    <span className="badge badge--muted" style={{ fontSize: '0.7rem' }}>
                      0 / 20 Unlocked · Next Horizon
                    </span>
                  </div>

                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', lineHeight: 1.5, color: 'var(--ink-600)', margin: '0 0 var(--space-3)' }}>
                    20 gastronomic recipes and preservation arts awaiting discovery as exploration advances into Realm II.
                  </p>

                  <div className="codex-entries-grid">
                    <span className="badge badge--muted" style={{ justifyContent: 'center' }}>Culinary Arts & Fermentation</span>
                    <span className="badge badge--muted" style={{ justifyContent: 'center' }}>Food Preservation & Cellaring</span>
                    <span className="badge badge--muted" style={{ justifyContent: 'center' }}>Nutritional Science</span>
                    <span className="badge badge--muted" style={{ justifyContent: 'center', gridColumn: '1 / -1' }}>🔒 Milestones I – XX Awaiting Realm II Unlock</span>
                  </div>
                </div>

                {/* Archival Authenticity Seal */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', background: 'var(--cream-50)', borderRadius: '12px', border: '1px solid rgba(233, 173, 72, 0.3)' }}>
                  <span style={{ color: 'var(--gold-500)', fontSize: '0.9rem' }}>✦</span>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', lineHeight: 1.45, color: 'var(--ink-600)', margin: 0 }}>
                    <strong style={{ color: 'var(--ink-900)' }}>Archival Integrity:</strong> Milestone telemetry is backed by persistent in-game state. No generic dashboard metrics or placeholders are utilized.
                  </p>
                  <span style={{ color: 'var(--gold-500)', fontSize: '0.9rem' }}>✦</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Soft Seam Divider: Warm Cream Archival Codex to Deep Forest Emerald */}
      <div className="section-seam section-seam--cream-to-dark" aria-hidden="true">
        <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
          <path d="M0,0 C480,36 960,36 1440,0 L1440,48 L0,48 Z" fill="var(--green-900)" />
        </svg>
      </div>

      {/* ---------------------------------------------------------------------
          SECTION 6: BEHIND THE WORLDS — PREMIUM CREATOR STORY
          Visual documentary narrative with varied compositions & authentic workflow
          --------------------------------------------------------------------- */}
      <BehindTheWorlds
        onOpenModal={(type) => {
          if (type === 'dashboard') setIsDashboardModalOpen(true);
          else if (type === 'collection') setIsCollectionModalOpen(true);
          else if (type === 'gameplay') setIsGameplayModalOpen(true);
          else if (type === 'knowledge') setIsKnowledgeModalOpen(true);
        }}
      />

      {/* Soft Seam Divider: Deep Forest Emerald to Atmospheric Mist Outro */}
      <div className="section-seam section-seam--dark-to-mist" aria-hidden="true">
        <div className="seam-mist-glow" />
      </div>

      {/* ---------------------------------------------------------------------
          SECTION 7: FOREST OUTRO SECTION (STEP 6)
          Full-width section, min-height about 90vh, generous padding.
          Backdrop with slow zoom on painted mountain/farm image, mist scrim,
          soft vignette, drifting mist bands, and falling leaf shapes.
          Chrome-and-gold MERGEVERSE wordmark, letter-spaced tagline,
          poignant lead line, and two buttons (.btn--gold, .btn--ghost).
          --------------------------------------------------------------------- */}
      <section
        id="forest-outro"
        ref={forestOutroRef}
        className={`section section--dark outro-section ${isOutroIntersecting ? 'is-intersecting' : ''}`}
        aria-label="MERGEVERSE Finale"
      >
        <div className="outro-backdrop-wrap" aria-hidden="true">
          <img
            src="/images/mergeverse-title.jpg"
            alt="MERGEVERSE painted mountain and farm landscape with mist"
            className="outro-backdrop-img"
            loading="lazy"
            decoding="async"
          />
          {/* Cream-to-transparent misty gradient overlay & soft vignette */}
          <div className="outro-mist-scrim" />
          <div className="outro-vignette-scrim" />

          {/* Drifting Mist Layers (2 blurred mist bands drifting sideways) */}
          <div className="outro-mist-band band-primary" />
          <div className="outro-mist-band band-secondary" />

          {/* Falling Leaf Shapes (8 low-opacity CSS leaf elements) */}
          <div className="outro-falling-leaves-layer">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="outro-falling-leaf"
                style={{
                  '--leaf-left': `${6 + i * 12}%`,
                  '--leaf-delay': `${i * 1.6}s`,
                  '--leaf-duration': `${11 + (i % 4) * 2.5}s`,
                  '--leaf-scale': `${0.75 + (i % 3) * 0.2}`,
                  '--leaf-sway': `${18 + (i % 3) * 12}px`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Center Content: Fades up with .reveal */}
        <div className="section-container outro-container">
          <div className={`outro-content-lockup reveal ${isOutroInView ? 'is-visible' : ''}`}>
            {/* Small gold ornament */}
            <div className="outro-gold-ornament" aria-hidden="true">
              <span className="ornament-line" />
              <span className="ornament-star">✦</span>
              <span className="ornament-line right" />
            </div>

            {/* MERGEVERSE wordmark in chrome-and-gold gradient */}
            <h2 className="outro-wordmark-title">MERGEVERSE</h2>

            {/* Tagline in letter-spaced caps */}
            <div className="outro-tagline-wrap">
              <p className="outro-tagline-text">EXPLORE. SOLVE. DISCOVER.</p>
            </div>

            {/* One line "Merge. Solve. Discover." as a lead */}
            <p className="section-lead outro-prose-lead">
              Merge. Solve. Discover.
            </p>

            {/* Two buttons */}
            <div className="outro-action-buttons-row">
              <button
                type="button"
                className="btn btn--gold"
                onClick={() => handleScrollToSection('game-intro')}
                aria-label="Enter the Game: Return to Overview"
              >
                <span>Enter the Game</span>
                <span className="btn-arrow" aria-hidden="true">↓</span>
              </button>
              <button
                type="button"
                className="btn btn--ghost outro-btn-ghost"
                onClick={() => handleScrollToSection('behind-the-worlds')}
                aria-label="The Creator Story: Jump to Behind the Worlds"
              >
                <span>The Creator Story</span>
                <span className="btn-arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* ---------------------------------------------------------------------
          PART B: FOOTER (STEP 6)
          Dark green footer with thin gold top border, 3 columns on desktop,
          1 column on mobile, visible focus styles, and smooth back-to-top
          --------------------------------------------------------------------- */}
      <footer className="site-footer" id="site-footer" role="contentinfo" aria-label="MERGEVERSE Footer">
        <div className="section-container footer-container">
          <div className="footer-cols-grid">
            {/* COLUMN 1 (LEFT): Brand */}
            <div className="footer-col footer-col--brand">
              <a
                href="#hero"
                className="footer-brand-lockup"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('hero');
                }}
                aria-label="MERGEVERSE — Back to top of page"
              >
                <span className="brand-crest-star" aria-hidden="true">✦</span>
                <span className="brand-title">MERGEVERSE</span>
              </a>
              <p className="footer-creator-line">An indie game by Vikas</p>
              <p className="footer-motto-line">Merge. Solve. Discover.</p>
              <p className="footer-descriptor-text">
                Chronicles of human breakthrough reimagined through tactile puzzle synthesis and authentic historical milestones.
              </p>
            </div>

            {/* COLUMN 2 (MIDDLE): Explore links to existing page sections */}
            <div className="footer-col footer-col--links">
              <h3 className="footer-column-heading">EXPLORE</h3>
              <ul className="footer-links-list">
                <li>
                  <a
                    href="#game-intro"
                    className="footer-nav-anchor"
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollToSection('game-intro');
                    }}
                  >
                    Overview
                  </a>
                </li>
                <li>
                  <a
                    href="#four-realms-ocean"
                    className="footer-nav-anchor"
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollToSection('four-realms-ocean');
                    }}
                  >
                    Four Realms
                  </a>
                </li>
                <li>
                  <a
                    href="#gameplay-progression-showcase"
                    className="footer-nav-anchor"
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollToSection('gameplay-progression-showcase');
                    }}
                  >
                    Gameplay
                  </a>
                </li>
                <li>
                  <a
                    href="#explorer-collection"
                    className="footer-nav-anchor"
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollToSection('explorer-collection');
                    }}
                  >
                    Codex
                  </a>
                </li>
                <li>
                  <a
                    href="#behind-the-worlds"
                    className="footer-nav-anchor"
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollToSection('behind-the-worlds');
                    }}
                  >
                    Behind the Worlds
                  </a>
                </li>
              </ul>
            </div>

            {/* COLUMN 3 (RIGHT): The Realms list with active / coming soon badges */}
            <div className="footer-col footer-col--realms">
              <h3 className="footer-column-heading">THE REALMS</h3>
              <ul className="footer-realms-list">
                <li className="footer-realm-row">
                  <span className="realm-title">Agriculture</span>
                  <span className="badge badge--gold">Active</span>
                </li>
                <li className="footer-realm-row">
                  <span className="realm-title">Food &amp; Culinary</span>
                  <span className="badge badge--muted">Coming soon</span>
                </li>
                <li className="footer-realm-row">
                  <span className="realm-title">Healthcare &amp; Medicine</span>
                  <span className="badge badge--muted">Coming soon</span>
                </li>
                <li className="footer-realm-row">
                  <span className="realm-title">Assistive Technology</span>
                  <span className="badge badge--muted">Coming soon</span>
                </li>
              </ul>
            </div>
          </div>

          {/* BOTTOM ROW: Copyright & Smooth Back to Top Button */}
          <div className="footer-bottom-bar">
            <div className="footer-bottom-meta">
              <p className="footer-copyright-text">
                © 2026 Mergeverse. All rights reserved.
              </p>
              <span className="footer-meta-sep" aria-hidden="true">•</span>
              <p className="footer-builder-text">
                Designed and built by Vikas
              </p>
            </div>
            <button
              type="button"
              className="btn btn--ghost footer-back-to-top-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll smoothly back to top"
            >
              <span>Back to top</span>
              <span className="top-arrow-icon" aria-hidden="true">↑</span>
            </button>
          </div>
        </div>
      </footer>

      {/* ---------------------------------------------------------------------
          MODAL LIGHTBOXES: HIGH-RESOLUTION AUTHENTIC ASSET INSPECTIONS
          --------------------------------------------------------------------- */}


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
                loading="lazy"
                decoding="async"
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
                loading="lazy"
                decoding="async"
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
                loading="lazy"
                decoding="async"
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
                loading="lazy"
                decoding="async"
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
