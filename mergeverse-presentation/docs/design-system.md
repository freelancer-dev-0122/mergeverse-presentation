# MERGEVERSE Design System Reference (Step 3)

A single source of truth for design tokens and reusable utility classes across the MERGEVERSE presentation site. Built strictly from authentic values extracted from the existing compositions.

---

## 1. Design Tokens (`src/styles/tokens.css`)

### Color Tokens

| Token | Value | When to Use It |
| :--- | :--- | :--- |
| `--green-950` | `#07150e` | Deepest atmospheric green background; use for site footer and deepest dark foundations. |
| `--green-900` | `#091c14` | Core page background (`--emerald-deep`); use for dark section canvases and hero vignette base. |
| `--green-800` | `#0d281a` | Rich forest green; use for forest outro backdrop, container backgrounds, and dark card fills. |
| `--gold-500` | `#e9ad48` | Primary sunlit gold; use for brand crests, stars, primary CTA buttons, and active borders/highlights. |
| `--gold-300` | `#fff4d0` | Light gold highlight; use for floating ambient motes, badge text, and warm light glints. |
| `--cream-50` | `#faf6ee` | Pure light cream; use for notebook ruled paper, inner card surfaces, and light text on dark backgrounds. |
| `--cream-100` | `#f5efe2` | Signature warm cream; use for the primary surface background of all cream outer cards and light sections. |
| `--ink-900` | `#123d2b` | Deep dark-green headline ink; use for primary titles and heavy text placed on cream backgrounds. |
| `--ink-600` | `#2c4b3b` | Muted dark-green editorial ink; use for lead paragraphs, narrative descriptions, and list items on cream. |
| `--ocean-500` | `#4e9d86` | Living teal accent; use for animated ocean wave bands, realm glows, and map lighting effects. |
| `--success` | `#4ade80` | Vibrant milestone green; use for active level indicators, active realm status pills, and telemetry dots. |
| `--muted` | `#a3b5aa` | Secondary muted typography; use for secondary metadata, subtext, and subtle borders on dark surfaces. |

### Typography Tokens

| Token | Value | When to Use It |
| :--- | :--- | :--- |
| `--font-display` | `'Cinzel', Georgia, serif` | Classical serif display face; use for all main section titles, wordmarks, and hero headings. |
| `--font-serif` | `'Cormorant Garamond', Georgia, serif` | Refined editorial serif; use for slide titles, pullquotes, and narrative leads. |
| `--font-body` | `'Plus Jakarta Sans', sans-serif` | Clean geometric sans-serif; use for all UI controls, body prose, lists, badges, and navigation links. |
| `--font-hand` | `'Caveat', cursive, sans-serif` | Organic handwriting face; use ONLY in the creator story notebook checklist and sticky note doodle. |

### Fluid Type Scale Tokens

| Token | Value | When to Use It |
| :--- | :--- | :--- |
| `--text-hero` | `clamp(3.2rem, 7.8vw, 6.2rem)` | Monumental title display; use for the top hero wordmark and forest outro finale headline. |
| `--text-h1` | `clamp(1.8rem, 3.4vw, 3.1rem)` | Major section headlines; use for Ocean Archipelago, Notebook Story, and primary section titles. |
| `--text-h2` | `clamp(1.4rem, 2.2vw, 2.25rem)` | Secondary section headlines; use for Gameplay Progression, cream slider quote headings, and sub-features. |
| `--text-h3` | `clamp(1.15rem, 1.6vw, 1.45rem)` | Subsection headers; use for card titles, monitor displays, and column headings. |
| `--text-body` | `clamp(0.95rem, 1.15vw, 1.05rem)` | Standard readable text; use for narrative leads, paragraphs, and long-form storytelling. |
| `--text-small` | `clamp(0.8rem, 0.9vw, 0.88rem)` | Compact UI text; use for button labels, nav links, status tags, and footer copyright copy. |
| `--text-eyebrow` | `clamp(0.72rem, 0.85vw, 0.8rem)` | All-caps metadata label; use for chapter pills, section category tags, and feature markers. |

### Spacing & Layout Tokens

| Token | Value | When to Use It |
| :--- | :--- | :--- |
| `--space-1` | `4px` | Micro spacing; use for tight icon gaps and compact badge padding. |
| `--space-2` | `8px` | Small spacing; use for button icon-to-text gaps and item margins. |
| `--space-3` | `12px` | Moderate spacing; use for heading-to-eyebrow margins and list item gaps. |
| `--space-4` | `16px` | Standard spacing; use for card padding on mobile and layout gutters. |
| `--space-5` | `24px` | Content spacing; use for container horizontal padding and standard card interiors. |
| `--space-6` | `32px` | Large spacing; use for separation between lead prose and feature grids. |
| `--space-7` | `48px` | Section component gap; use for split column spacing and grid gutters on desktop. |
| `--space-8` | `64px` | Broad spacing; use for major block margins and outer card vertical spacing. |
| `--section-pad` | `clamp(64px, 8vw, 120px)` | Responsive vertical section breathing room; use for standard section padding top and bottom. |
| `--container` | `1320px` | Maximum content width constraint; use for centering page shells, outer cards, and floating navbar. |

### Radii Tokens

| Token | Value | When to Use It |
| :--- | :--- | :--- |
| `--radius-card` | `24px` | Medium curvature; use for glass realm cards, screenshot artwork frames, and interactive cards. |
| `--radius-lg` | `36px` | Large curvature; use for major cream outer showcase cards (Laptop Slider, Gameplay Showcase). |
| `--radius-pill` | `999px` | Fully rounded capsule; use for all buttons, badges, nav pills, and tag elements. |

### Shadows & Elevation Tokens

| Token | Value | When to Use It |
| :--- | :--- | :--- |
| `--shadow-soft` | `0 6px 20px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)` | Subtle clean lift; use for arrow buttons, small hoverable chips, and soft elevations. |
| `--shadow-card` | `0 20px 50px rgba(0, 0, 0, 0.4)` | Deep ambient depth; use for floating outer cream cards and dark glass cards. |
| `--shadow-glow-gold` | `0 0 24px rgba(233, 173, 72, 0.35)` | Atmospheric radiant glow; use for hover states on gold buttons, active pills, and highlighted cards. |

### Motion Tokens

| Token | Value | When to Use It |
| :--- | :--- | :--- |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Signature smooth deceleration curve; use for all hover lifts, reveals, and card transitions. |
| `--dur-fast` | `200ms` | Swift reaction; use for button hover lifts, color shifts, and active tab highlights. |
| `--dur-med` | `400ms` | Measured transition; use for card expands, drawer slides, and checklist reveals. |
| `--dur-slow` | `700ms` | Cinematic choreography; use for viewport scroll reveals, backdrop crossfades, and page entries. |

---

## 2. Shared Reusable Classes (`src/styles/shared.css`)

| Class | Purpose / Description | When to Use It |
| :--- | :--- | :--- |
| `.section` | Applies fluid vertical padding (`--section-pad`) and offset `scroll-margin-top: 100px` for navbar navigation. | Use on the outer `<section>` element of any top-level page section. |
| `.section-container` | Centers inner section content at `--container` (1320px) with responsive horizontal padding. | Use inside any `.section` to keep text, cards, and media aligned to the site grid. |
| `.section--dark` | Sets dark green background (`--green-900`) and cream text (`--cream-50`). | Use for dark atmospheric sections (Hero, Ocean Realms, Forest Outro). |
| `.section--cream` | Sets warm cream background (`--cream-100`) and dark ink text (`--ink-900`). | Use for editorial parchment sections (Laptop Slider, Gameplay Cards, Codex). |
| `.eyebrow` | Small uppercase letter-spaced gold label with optional decorative stars (`.eyebrow-star`). | Use above section titles as chapter markers or category badges. |
| `.section-title` | Bold serif display heading (`--font-display`), centered by default. | Use for the primary `<h2>` title of every section. |
| `.section-lead` | Clean muted paragraph (`--text-body`) below the title, constrained to 660px, centered by default. | Use for the explanatory introductory narrative directly below a `.section-title`. |
| `.is-left` | Modifier for `.section-title` and `.section-lead` to align text left with zero margins. | Use when titles/leads sit inside two-column split layouts beside artwork. |
| `.btn` | Base interactive pill button with uniform height (48px), radius (`--radius-pill`), and smooth hover lift. | Use as base class for all standalone call-to-action buttons. |
| `.btn--gold` | Filled sunlit gold gradient button with white top glint and glowing hover shadow. | Use for the primary call-to-action in a section (e.g. "Enter the Game", "Explore Realms"). |
| `.btn--ghost` | Translucent dark green glass button with gold outline and subtle backdrop blur. | Use for secondary action buttons alongside a gold button (e.g. "The Creator Story"). |
| `.card--glass` | Dark green translucent card with thin gold border, 14px blur, and hover glow. | Use for dark surface interactive items (Ocean Realm cards, tool chips). |
| `.card--cream` | Warm cream raised card with soft shadow and large rounded corners (`--radius-lg`). | Use for light editorial feature showcases and device presentation boxes. |
| `.badge` | Compact rounded indicator pill with uppercase label. | Use for item statuses, category chips, and feature tags. |
| `.badge--gold` | Gold tinted badge with gold border and text. | Use for "Active" realm/feature badges and active level milestones. |
| `.badge--muted` | Translucent subtle badge with muted light border and gray-green text. | Use for "Coming soon" realm/feature badges. |
| `.reveal` | Initial hidden state (`opacity: 0; transform: translateY(28px)`). | Use on any element or section container that should smoothly fade and slide up when scrolled into view. |
| `.reveal.is-visible` | Animated visible state (`opacity: 1; transform: translateY(0)`). | Applied automatically by `initScrollReveal()` IntersectionObserver once the element enters the viewport. |

---

## 3. Global Accessibility Utilities

- **`:focus-visible`**: Uniform accessible outline in `--gold-500` with 3px offset across all links, buttons, and inputs.
- **`@media (prefers-reduced-motion: reduce)`**: Instantly forces animation and transition durations to `0.01ms` and sets all `.reveal` elements to fully visible with no transform.
