import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './BehindTheWorlds.css';

gsap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Documentary Masthead
      gsap.from('.btw-masthead', {
        y: 25,
        duration: 0.85,
        ease: 'power2.out',
      });

      // Chapter 1 visual narrative split
      gsap.from('.manifesto-narrative-col', {
        x: -20,
        duration: 0.85,
        ease: 'power2.out',
      });

      gsap.from('.manifesto-themes-col', {
        x: 20,
        duration: 0.85,
        ease: 'power2.out',
      });

      // Visual vision banner
      gsap.from('.btw-vision-editorial', {
        y: 25,
        duration: 0.85,
        ease: 'power2.out',
      });

      // Timeline nodes
      gsap.from('.timeline-step-node', {
        y: 20,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="behind-the-worlds"
      className="behind-the-worlds-container"
      ref={containerRef}
      aria-label="Behind the Worlds — The Making of MERGEVERSE"
    >
      {/* =====================================================================
          CHAPTER 01: THE CREATOR MANIFESTO (WARM PARCHMENT EDITORIAL)
          Asymmetric documentary spread: personal philosophy + themes index
          ===================================================================== */}
      <div className="btw-chapter-section section-parchment">
        <div className="editorial-container">
          <header className="btw-masthead">
            <div className="editorial-pill parchment-pill">
              <span className="pill-star">✦</span>
              <span>BEHIND THE WORLDS · THE CREATOR STORY</span>
              <span className="pill-star">✦</span>
            </div>
            <h2 className="btw-lead-title">Every World Starts with an Idea</h2>
            <p className="btw-lead-sub">
              Discover the creative direction, authentic tools, and human vision behind the making of MERGEVERSE.
            </p>
          </header>

          <div className="btw-manifesto-split">
            {/* Left: The Creator Narrative */}
            <div className="manifesto-narrative-col">
              <div className="manifesto-chapter-tag">
                <span className="chapter-tag-num">01</span>
                <span className="chapter-tag-sep">/</span>
                <span className="chapter-tag-title">THE GENESIS</span>
              </div>

              <h3 className="manifesto-headline">
                Rethinking the Merge Genre as Human Heritage
              </h3>

              <p className="manifesto-prose">
                Traditional puzzle-merge games rely on match-3 tropes: abstract candies, glittering diamonds, or fantasy critters.
                With <strong className="ink-bold">MERGEVERSE</strong>, creator and director <strong>Vikas</strong> committed to a fundamentally
                different artistic ethos: transforming the historical milestones of human civilization into a tactile, thoughtful puzzle adventure.
              </p>

              <p className="manifesto-prose">
                Guided by the studio tagline <em className="ink-italic">“EXPLORE. SOLVE. DISCOVER.”</em>, players progress through the tangible
                evolution of human ingenuity. Combining wild grasses and hearthstone ovens yields harvest nutrition; synthesizing apothecary
                herbs advances clinical medicine; crafting timber wheels establishes universal accessibility.
              </p>

              <blockquote className="creator-manifesto-quote">
                <span className="quote-mark">“</span>
                <p className="quote-body">
                  I wanted every merge to feel like an authentic breakthrough of human resilience—connecting ancient soil to universal adaptive design.
                </p>
                <cite className="quote-signature">— Vikas, Creator & Director</cite>
              </blockquote>

              <div className="creator-signature-row">
                <span className="sig-badge">💡 Planning & Lore: GPT / ChatGPT</span>
                <span className="sig-badge">🎨 Art Direction: Gemini & Stitch</span>
              </div>
            </div>

            {/* Right: The Four Civilizational Pillars (Asymmetrical Matrix) */}
            <div className="manifesto-themes-col">
              <div className="themes-box-header">
                <span className="box-title">FOUR PILLARS OF HUMAN ADVANCE</span>
                <span className="box-note">Curated Historical Themes</span>
              </div>

              <div className="themes-cards-stack">
                {CREATIVE_THEMES.map((theme) => (
                  <div key={theme.roman} className="theme-manifesto-card">
                    <div className="theme-card-left">
                      <span className="theme-roman">REALM {theme.roman}</span>
                      <span className="theme-icon">{theme.icon}</span>
                    </div>
                    <div className="theme-card-right">
                      <h4 className="theme-name">{theme.name}</h4>
                      <span className="theme-sub">{theme.theme}</span>
                      <p className="theme-desc">{theme.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          CHAPTER 02: THE VISUAL VISION (RICH FOREST EMERALD)
          Panoramic visual feature: Gemini atmospheric inspiration & Stitch layouts
          ===================================================================== */}
      <div className="btw-chapter-section btw-vision-section">
        <div className="editorial-container">
          <div className="btw-vision-editorial">
            <div className="vision-text-side">
              <div className="editorial-pill">
                <span className="pill-star">✦</span>
                <span>CHAPTER 02 · VISUAL DIRECTION</span>
                <span className="pill-star">✦</span>
              </div>

              <h3 className="vision-headline">Alpine Horizons & Cinematic Lighting</h3>

              <p className="vision-prose">
                The visual identity of MERGEVERSE was inspired by cinematic concepts explored through <strong>Gemini</strong>.
                Rather than flat, hyper-saturated mobile graphics, Vikas established an atmospheric palette of{' '}
                <strong className="text-emerald-light">deep forest emerald</strong>,{' '}
                <strong className="text-parchment-light">warm parchment</strong>,{' '}
                <strong className="text-gold-light">sunlit gold</strong>, and{' '}
                <strong className="text-teal-light">living alpine teal</strong>.
              </p>

              <p className="vision-prose">
                Screen wireframes and tactical puzzle trays were iteratively tested in <strong>Stitch</strong> to ensure
                spatial balance, legibility, and satisfying tactile proportions before engineering frontend components.
              </p>

              <div className="vision-tool-chips">
                <div className="vision-tool-chip">
                  <span className="tool-chip-icon">🌌</span>
                  <div className="tool-chip-body">
                    <span className="tool-chip-name">Gemini</span>
                    <span className="tool-chip-desc">Cinematic Lighting & World References</span>
                  </div>
                </div>

                <div className="vision-tool-chip">
                  <span className="tool-chip-icon">📐</span>
                  <div className="tool-chip-body">
                    <span className="tool-chip-name">Stitch</span>
                    <span className="tool-chip-desc">UI Screen Hierarchy & Tactical Trays</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="vision-image-side">
              <div className="vision-still-frame">
                <img
                  src="/images/mergeverse-title.jpg"
                  alt="MERGEVERSE Alpine landscape showing golden hour light across peaks and meadows"
                  className="vision-still-img"
                  loading="lazy"
                  decoding="async"
                />
                <div className="vision-still-overlay">
                  <span className="still-tag">Approved Director's Mood Reference</span>
                  <p className="still-caption">
                    Golden hour backlighting, alpine conifer slopes, and pastoral valley meadows establishing the environmental tone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          CHAPTER 03: THE ATELIER TIMELINE (WARM CREAM PARCHMENT)
          Restrained chronological narrative timeline (NOT generic software cards)
          ===================================================================== */}
      <div className="btw-chapter-section section-parchment">
        <div className="editorial-container">
          <header className="btw-timeline-header">
            <div className="editorial-pill parchment-pill">
              <span className="pill-star">✦</span>
              <span>CHAPTER 03 · THE DEVELOPMENT ATELIER</span>
              <span className="pill-star">✦</span>
            </div>
            <h3 className="timeline-section-title doc-parchment-title">
              From Thought to Playable Reality
            </h3>
            <p className="timeline-section-sub doc-parchment-lead">
              A disciplined, transparent chronicle of how AI reasoning copilots and human creative vision converged.
            </p>
          </header>

          {/* Stepped Horizontal/Continuous Narrative Timeline */}
          <div className="atelier-stepped-timeline" aria-label="Development Timeline">
            <div className="timeline-track-line" aria-hidden="true" />

            <div className="timeline-steps-grid">
              {ATELIER_TIMELINE.map((step) => (
                <div key={step.phase} className="timeline-step-node">
                  <div className="step-node-marker">
                    <span className="step-node-number">{step.phase}</span>
                    <span className="step-node-halo" />
                  </div>

                  <div className="step-node-card">
                    <div className="step-card-meta">
                      <span className="step-badge">{step.badge}</span>
                    </div>
                    <h4 className="step-tool-name">{step.tool}</h4>
                    <span className="step-stage-title">{step.stage}</span>
                    <p className="step-summary-text">{step.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transparent AI-Assisted Workflow Manifesto */}
          <div className="atelier-manifesto-banner">
            <div className="manifesto-emblem">✦</div>
            <div className="manifesto-content">
              <h4 className="manifesto-heading">Transparent AI-Assisted Direction</h4>
              <p className="manifesto-text">
                MERGEVERSE was directed by Vikas through an open, transparent workflow. Rather than manually writing boilerplate code in isolation,
                Vikas orchestrated AI reasoning copilots, creative prompt architectures, and UI prototypes to build a high-production indie-game experience.
                Every decision, mechanic, and line of code was reviewed, refined, and validated against the authentic vision.
              </p>
            </div>
          </div>

          {/* Action Navigation Strip */}
          <div className="btw-action-strip">
            <a href="#hero" className="btw-nav-btn primary">
              <span>↑ RETURN TO OPENING</span>
            </a>
            <a href="#four-realms-ocean" className="btw-nav-btn secondary">
              <span>✦ EXPLORE THE FOUR REALMS</span>
            </a>
            <a href="#gameplay-progression-showcase" className="btw-nav-btn secondary">
              <span>✦ INSPECT GAMEPLAY MECHANICS</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
