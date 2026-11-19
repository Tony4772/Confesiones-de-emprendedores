---
name: Startup Confessions
colors:
  surface: '#10141a'
  surface-dim: '#10141a'
  surface-bright: '#353940'
  surface-container-lowest: '#0a0e14'
  surface-container-low: '#181c22'
  surface-container: '#1c2026'
  surface-container-high: '#262a31'
  surface-container-highest: '#31353c'
  on-surface: '#dfe2eb'
  on-surface-variant: '#e1bfb5'
  inverse-surface: '#dfe2eb'
  inverse-on-surface: '#2d3137'
  outline: '#a98a80'
  outline-variant: '#594139'
  surface-tint: '#ffb59d'
  primary: '#ffb59d'
  on-primary: '#5d1900'
  primary-container: '#ff6b35'
  on-primary-container: '#5f1900'
  inverse-primary: '#ab3500'
  secondary: '#ffb2ba'
  on-secondary: '#67001f'
  secondary-container: '#dd034e'
  on-secondary-container: '#fff1f1'
  tertiary: '#ffb86b'
  on-tertiary: '#492900'
  tertiary-container: '#db8500'
  on-tertiary-container: '#4a2a00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59d'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#832600'
  secondary-fixed: '#ffd9dc'
  secondary-fixed-dim: '#ffb2ba'
  on-secondary-fixed: '#400010'
  on-secondary-fixed-variant: '#910030'
  tertiary-fixed: '#ffdcbc'
  tertiary-fixed-dim: '#ffb86b'
  on-tertiary-fixed: '#2c1700'
  on-tertiary-fixed-variant: '#683d00'
  background: '#10141a'
  on-background: '#dfe2eb'
  surface-variant: '#31353c'
typography:
  display-hero:
    fontFamily: Syne
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Syne
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Syne
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Syne
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
  quote-editorial:
    fontFamily: Syne
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 2rem
  margin: 1.25rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system embodies a confidential, late-night forum aesthetic—a collision of sleek midnight editorial restraint and raw neo-brutalist energy. Tailored for startup founders, solo operators, and venture-backed executives seeking radical transparency, the visual environment channels catharsis, gritty humor, and raw vulnerability. 

The aesthetic leverages deep slate canvases, razor-sharp architectural borders, deliberate monospaced accents, and high-impact typographic scales. Punchy neon saturations cut through the darkness to highlight raw truth, high-stakes failures, and dark humor without descending into chaos. The atmosphere feels like an exclusive, encrypted terminal operating under candlelight: disciplined, witty, cinematic, and unapologetic.

## Colors

The palette operates on high-contrast drama set against deep, atmospheric slate backgrounds:

- **Background Canvas (`#0D1117`)**: Base viewport, giving a dark, noise-isolated midnight depth.
- **Surface Elevation (`#161B22`)**: Primary card and panel surface, providing subtle tonal differentiation.
- **Surface Elevated Overlay (`#21262D`)**: Interactive card hovers, modal overlays, and elevated secondary containers.
- **Primary Accent (`#FF6B35`)**: Electric Ember. Used for primary CTAs, active confession states, upvotes, and vital focal points.
- **Secondary Accent (`#FF2E63`)**: Hot Magenta / Crimson. Applied to danger badges, visceral confessions ('Quiebra Inminente', 'Humo Puro'), and spicy tag states.
- **Tertiary Accent (`#FF9F1C`)**: Radiant Amber. Used for warning metrics, flame counter highlights, and founders' awards.
- **Border Tone (`#30363D`)**: Crisp, structural 1px borders anchoring content with neo-brutalist precision.
- **Text & Foreground**: Base text utilizes `#F0F6FC` (high-clarity off-white) with muted metadata stepping down to `#8B949E` and `#484F58`.

## Typography

The type system blends the avant-garde, commanding geometry of **Syne** for headlines and editorial pull quotes with the pristine legibility of **Plus Jakarta Sans** for extended confessions and personal anecdotes. **JetBrains Mono** injects terminal precision into metadata, timestamps, anonymous founder IDs, category chips, and reaction counters.

- Keep confession titles bold and uninhibited using `headline-md` or `quote-editorial`.
- Metadata tags (such as MRR numbers, burn rates, and timestamps) must strictly render in `label-code` or uppercase `label-caps` to emphasize technical authenticity.

## Layout & Spacing

The layout is built upon a responsive 12-column dynamic masonry grid for desktop viewports, condensing to 6 columns on tablets and a focused single-column stream on mobile screens. 

- **Grid Alignment**: Confession cards conform strictly to columnar widths with standard `gutter-desktop` (32px) and `margin-desktop` (48px) boundaries to retain breathing room.
- **Rhythm**: Vertical stacking adheres to a multiple of 4px. Card interiors rely on `space-lg` (24px) for balanced perimeter padding and `space-md` (16px) for item gaps between text, chips, and interactive reaction bars.
- **Masonry Layout**: Staggered card lengths accommodate brief one-liners alongside extensive post-mortems seamlessly without awkward white gaps.

## Elevation & Depth

Visual hierarchy prioritizes tactile neo-brutalist containment over diffuse drop shadows. Depth is achieved through high-contrast borders and sharp tonal transitions:

- **Base Level (Canvas)**: Background tone `#0D1117` holds a faint 4% noise overlay or subtle sub-pixel grid lines to evoke screen texture.
- **Level 1 (Card/Containers)**: Background `#161B22` bounded by an unapologetic 1px solid border (`#30363D`).
- **Level 2 (Hover & Focus States)**: Surface transitions to `#21262D` accented by a solid, non-diffuse 2px offset edge shadow: `box-shadow: 4px 4px 0px #FF6B35` or `#FF2E63`.
- **Level 3 (Modals & Sticky Drawers)**: Heavy backdrop blur (`backdrop-filter: blur(16px)`) with 75% dark tint overlay and a solid 1px border (`#484F58`) containing the modal window.

## Shapes

The design uses a **Soft (1)** shape language. This delivers the crispness of brutalist structures while softening extreme edges just enough to feel high-end and modern:

- Buttons, tags, and inputs carry a precise `0.25rem` (4px) corner radius.
- Cards, feed containers, and dialog modals utilize `rounded-lg` at `0.5rem` (8px).
- Pill shapes are reserved exclusively for emoji reaction counters and anonymous badge markers to create deliberate, organic contrast against the angular architecture.

## Components

### Confession Cards
The fundamental unit of the system.
- Background: `#161B22` with a 1px border in `#30363D`.
- Header: Displays anonymous tag (e.g., `FOUNDER_#9402`), tenure or MRR indicator in `JetBrains Mono` (`label-caps`), and category pill.
- Body: Confession narrative rendered in `body-md` or `quote-editorial` for shorter, spicy quotes.
- Action Bar: Reaction cluster pinned to the bottom left, confession timestamp and share action pinned right.

### Reaction Badges (🔥, 💀, 🤡, 💸, 🫂)
- Styled as interactive pill components (`height: 32px`, `padding: 0 10px`).
- Background: `#21262D` with subtle border `#30363D`.
- Hover/Active State: Glows with matching accent (e.g., Orange `#FF6B35` for 🔥, Crimson `#FF2E63` for 💀) accompanied by count increment animation and a bold 1px accent outline.

### Category Chips & Spicy Tags
- 'Quiebra Inminente' & 'Humo Puro': Border `#FF2E63`, background `rgba(255, 46, 99, 0.1)`, text `#FF2E63`.
- 'Síndrome del Impostor' & 'Cliente Tóxico': Border `#FF9F1C`, background `rgba(255, 159, 28, 0.1)`, text `#FF9F1C`.
- 'Casi Millonario': Border `#FF6B35`, background `rgba(255, 107, 53, 0.1)`, text `#FF6B35`.
- All chips styled with `label-caps` in uppercase, with a 4px corner radius.

### Buttons
- **Primary Button**: Solid Electric Ember `#FF6B35` with pitch black text (`#0D1117`), bold weight, zero blur, with a 2px offset brutalist shadow (`2px 2px 0px #FFFFFF`) on hover.
- **Secondary Button**: Transparent base with a 1px `#30363D` border, off-white text, transitioning to `#21262D` background on hover.
- **Ghost/Icon Button**: Transparent, color `#8B949E`, transitioning to `#F0F6FC` on hover.

### Inputs & Text Areas
- Background `#0D1117` with 1px border `#30363D`.
- Text is `Plus Jakarta Sans` 15px.
- Focus state switches border to `#FF6B35` with a sharp box outline: `outline: 1px solid #FF6B35`.

### Anonymous Confession Modal
- Center-locked dialog with a dark frosted backdrop.
- Prominent category picker bar at the top, a generous text area with character counter (`JetBrains Mono`), founder status selector (e.g., "Bootstrapped", "Series A", "Pre-revenue"), and a high-impact submit CTA labeled "Soltar Confesión".