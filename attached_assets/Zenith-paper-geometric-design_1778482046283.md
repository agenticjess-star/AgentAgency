---
version: "alpha"
name: "Zenith - Unified Architecture"
description: "Zenith Unified Dashboard Section is designed for demonstrating application workflows and interface hierarchy. Key features include clear information density, modular panels, and interface rhythm. It is suitable for product showcases, admin panels, and analytics experiences."
colors:
  primary: "#EA580C"
  secondary: "#F97316"
  tertiary: "#F0FA06"
  neutral: "#000000"
  background: "#000000"
  surface: "#F0EFEB"
  text-primary: "#000000"
  text-secondary: "#737373"
  border: "#000000"
  accent: "#EA580C"
typography:
  display-lg:
    fontFamily: "System Font"
    fontSize: "104px"
    fontWeight: 400
    lineHeight: "104px"
    letterSpacing: "-0.05em"
  body-md:
    fontFamily: "System Font"
    fontSize: "16px"
    fontWeight: 300
    lineHeight: "24px"
  label-md:
    fontFamily: "System Font"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
rounded:
  md: "0px"
spacing:
  base: "4px"
  sm: "1px"
  md: "2px"
  lg: "4px"
  xl: "8px"
  gap: "6px"
  card-padding: "9px"
  section-padding: "24px"
components:
  button-primary:
    backgroundColor: "{colors.neutral}"
    textColor: "#FFFFFF"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "16px"
  button-link:
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "0px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "32px"
---

## Overview

- **Composition cues:**
  - Layout: Grid
  - Content Width: Full Bleed
  - Framing: Glassy
  - Grid: Strong

## Colors

The color system uses light mode with #EA580C as the main accent and #000000 as the neutral foundation.

- **Primary (#EA580C):** Main accent and emphasis color.
- **Secondary (#F97316):** Supporting accent for secondary emphasis.
- **Tertiary (#F0FA06):** Reserved accent for supporting contrast moments.
- **Neutral (#000000):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #000000; Surface: #F0EFEB; Text Primary: #000000; Text Secondary: #737373; Border: #000000; Accent: #EA580C

- **Gradients:** bg-gradient-to-br from-black/15 to-black/5 via-black/0, bg-gradient-to-t from-[#E8E7E2]/50 to-transparent

## Typography

Typography relies on System Font across display, body, and utility text.

- **Display (`display-lg`):** System Font, 104px, weight 400, line-height 104px, letter-spacing -0.05em.
- **Body (`body-md`):** System Font, 16px, weight 300, line-height 24px.
- **Labels (`label-md`):** System Font, 16px, weight 400, line-height 24px.

## Layout

Layout follows a grid composition with reusable spacing tokens. Preserve the grid, full bleed structural frame before changing ornament or component styling. Use 4px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a grid / full bleed composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Grid
- **Content width:** Full Bleed
- **Base unit:** 4px
- **Scale:** 1px, 2px, 4px, 8px, 16px, 20px, 24px, 32px
- **Section padding:** 24px, 32px, 40px, 80px
- **Card padding:** 9px, 32px, 40px
- **Gaps:** 6px, 8px, 12px, 16px
## Buttons

**Primary:**
- **Variants:**
  - **Item 1:**
    - **Label Sample:** INITIALIZE STATE
    - **Font Family:** System Font
    - **Font Size:** 16px
    - **Font Weight:** 400
    - **Line Height:** 24px
    - **Letter Spacing:** normal
    - **Text Transform:** none
    - **Border Radius:** 0px
    - **Padding X:** 32px
    - **Padding Y:** 16px
    - **Background:** #000000
    - **Text Color:** #FFFFFF
    - **Border:** 0px solid rgb(229, 231, 235)
    - **Border Width:** 0px
    - **Border Style:** solid
    - **Border Color:** #E5E7EB
    - **Border Top:** 0px solid #E5E7EB
    - **Border Right:** 0px solid #E5E7EB
    - **Border Bottom:** 0px solid #E5E7EB
    - **Border Left:** 0px solid #E5E7EB
    - **Border Top Width:** 0px
    - **Border Right Width:** 0px
    - **Border Bottom Width:** 0px
    - **Border Left Width:** 0px
    - **Border Top Style:** solid
    - **Border Right Style:** solid
    - **Border Bottom Style:** solid
    - **Border Left Style:** solid
    - **Border Top Color:** #E5E7EB
    - **Border Right Color:** #E5E7EB
    - **Border Bottom Color:** #E5E7EB
    - **Border Left Color:** #E5E7EB
    - **Shadow:** none
    - **Preview Width:** 239
    - **Preview Height:** 48
    - **Count:** 1
  - **Item 2:**
    - **Label Sample:** BEGIN DEPLOYMENT
    - **Font Family:** System Font
    - **Font Size:** 16px
    - **Font Weight:** 400
    - **Line Height:** 24px
    - **Letter Spacing:** normal
    - **Text Transform:** none
    - **Border Radius:** 0px
    - **Padding X:** 40px
    - **Padding Y:** 20px
    - **Background:** #000000
    - **Text Color:** #FFFFFF
    - **Border:** 0px solid rgb(229, 231, 235)
    - **Border Width:** 0px
    - **Border Style:** solid
    - **Border Color:** #E5E7EB
    - **Border Top:** 0px solid #E5E7EB
    - **Border Right:** 0px solid #E5E7EB
    - **Border Bottom:** 0px solid #E5E7EB
    - **Border Left:** 0px solid #E5E7EB
    - **Border Top Width:** 0px
    - **Border Right Width:** 0px
    - **Border Bottom Width:** 0px
    - **Border Left Width:** 0px
    - **Border Top Style:** solid
    - **Border Right Style:** solid
    - **Border Bottom Style:** solid
    - **Border Left Style:** solid
    - **Border Top Color:** #E5E7EB
    - **Border Right Color:** #E5E7EB
    - **Border Bottom Color:** #E5E7EB
    - **Border Left Color:** #E5E7EB
    - **Shadow:** none
    - **Preview Width:** 247
    - **Preview Height:** 56
    - **Count:** 1

**Links:**
- **Variants:**
  - **Item 1:**
    - **Label Sample:** DOCUMENTATION
    - **Font Family:** SFMono-Regular
    - **Font Size:** 12px
    - **Font Weight:** 400
    - **Line Height:** 16px
    - **Letter Spacing:** 1.2px
    - **Text Transform:** uppercase
    - **Border Radius:** 0px
    - **Padding X:** 0px
    - **Padding Y:** 0px
    - **Text Color:** #737373
    - **Border:** 0px solid rgb(229, 231, 235)
    - **Border Width:** 0px
    - **Border Style:** solid
    - **Border Color:** #E5E7EB
    - **Border Top:** 0px solid #E5E7EB
    - **Border Right:** 0px solid #E5E7EB
    - **Border Bottom:** 0px solid #E5E7EB
    - **Border Left:** 0px solid #E5E7EB
    - **Border Top Width:** 0px
    - **Border Right Width:** 0px
    - **Border Bottom Width:** 0px
    - **Border Left Width:** 0px
    - **Border Top Style:** solid
    - **Border Right Style:** solid
    - **Border Bottom Style:** solid
    - **Border Left Style:** solid
    - **Border Top Color:** #E5E7EB
    - **Border Right Color:** #E5E7EB
    - **Border Bottom Color:** #E5E7EB
    - **Border Left Color:** #E5E7EB
    - **Shadow:** none
    - **Preview Width:** 110
    - **Preview Height:** 16
    - **Count:** 17
  - **Item 2:**
    - **Label Sample:** PRIVACY
    - **Font Family:** SFMono-Regular
    - **Font Size:** 12px
    - **Font Weight:** 400
    - **Line Height:** 16px
    - **Letter Spacing:** 1.2px
    - **Text Transform:** uppercase
    - **Border Radius:** 0px
    - **Padding X:** 0px
    - **Padding Y:** 0px
    - **Text Color:** #A3A3A3
    - **Border:** 0px solid rgb(229, 231, 235)
    - **Border Width:** 0px
    - **Border Style:** solid
    - **Border Color:** #E5E7EB
    - **Border Top:** 0px solid #E5E7EB
    - **Border Right:** 0px solid #E5E7EB
    - **Border Bottom:** 0px solid #E5E7EB
    - **Border Left:** 0px solid #E5E7EB
    - **Border Top Width:** 0px
    - **Border Right Width:** 0px
    - **Border Bottom Width:** 0px
    - **Border Left Width:** 0px
    - **Border Top Style:** solid
    - **Border Right Style:** solid
    - **Border Bottom Style:** solid
    - **Border Left Style:** solid
    - **Border Top Color:** #E5E7EB
    - **Border Right Color:** #E5E7EB
    - **Border Bottom Color:** #E5E7EB
    - **Border Left Color:** #E5E7EB
    - **Shadow:** none
    - **Preview Width:** 59
    - **Preview Height:** 16
    - **Count:** 3
  - **Item 3:**
    - **Label Sample:** ZENITH
    - **Font Family:** System Font
    - **Font Size:** 16px
    - **Font Weight:** 400
    - **Line Height:** 24px
    - **Letter Spacing:** normal
    - **Text Transform:** none
    - **Border Radius:** 0px
    - **Padding X:** 0px
    - **Padding Y:** 0px
    - **Text Color:** #171717
    - **Border:** 0px solid rgb(229, 231, 235)
    - **Border Width:** 0px
    - **Border Style:** solid
    - **Border Color:** #E5E7EB
    - **Border Top:** 0px solid #E5E7EB
    - **Border Right:** 0px solid #E5E7EB
    - **Border Bottom:** 0px solid #E5E7EB
    - **Border Left:** 0px solid #E5E7EB
    - **Border Top Width:** 0px
    - **Border Right Width:** 0px
    - **Border Bottom Width:** 0px
    - **Border Left Width:** 0px
    - **Border Top Style:** solid
    - **Border Right Style:** solid
    - **Border Bottom Style:** solid
    - **Border Left Style:** solid
    - **Border Top Color:** #E5E7EB
    - **Border Right Color:** #E5E7EB
    - **Border Bottom Color:** #E5E7EB
    - **Border Left Color:** #E5E7EB
    - **Shadow:** none
    - **Preview Width:** 61
    - **Preview Height:** 16
    - **Count:** 2
  - **Item 4:**
    - **Label Sample:** ARCHITECTURE
    - **Font Family:** SFMono-Regular
    - **Font Size:** 12px
    - **Font Weight:** 400
    - **Line Height:** 16px
    - **Letter Spacing:** 1.2px
    - **Text Transform:** uppercase
    - **Border Radius:** 0px
    - **Padding X:** 0px
    - **Padding Y:** 0px
    - **Text Color:** #737373
    - **Border:** 0px solid rgb(229, 231, 235)
    - **Border Width:** 0px
    - **Border Style:** solid
    - **Border Color:** #E5E7EB
    - **Border Top:** 0px solid #E5E7EB
    - **Border Right:** 0px solid #E5E7EB
    - **Border Bottom:** 0px solid #E5E7EB
    - **Border Left:** 0px solid #E5E7EB
    - **Border Top Width:** 0px
    - **Border Right Width:** 0px
    - **Border Bottom Width:** 0px
    - **Border Left Width:** 0px
    - **Border Top Style:** solid
    - **Border Right Style:** solid
    - **Border Bottom Style:** solid
    - **Border Left Style:** solid
    - **Border Top Color:** #E5E7EB
    - **Border Right Color:** #E5E7EB
    - **Border Bottom Color:** #E5E7EB
    - **Border Left Color:** #E5E7EB
    - **Shadow:** none
    - **Preview Width:** 119
    - **Preview Height:** 16
    - **Count:** 2
  - **Item 5:**
    - **Label Sample:** DEPLOY
    - **Font Family:** SFMono-Regular
    - **Font Size:** 12px
    - **Font Weight:** 400
    - **Line Height:** 16px
    - **Letter Spacing:** 1.2px
    - **Text Transform:** uppercase
    - **Border Radius:** 0px
    - **Padding X:** 0px
    - **Padding Y:** 0px
    - **Text Color:** #737373
    - **Border:** 0px solid rgb(229, 231, 235)
    - **Border Width:** 0px
    - **Border Style:** solid
    - **Border Color:** #E5E7EB
    - **Border Top:** 0px solid #E5E7EB
    - **Border Right:** 0px solid #E5E7EB
    - **Border Bottom:** 0px solid #E5E7EB
    - **Border Left:** 0px solid #E5E7EB
    - **Border Top Width:** 0px
    - **Border Right Width:** 0px
    - **Border Bottom Width:** 0px
    - **Border Left Width:** 0px
    - **Border Top Style:** solid
    - **Border Right Style:** solid
    - **Border Bottom Style:** solid
    - **Border Left Style:** solid
    - **Border Top Color:** #E5E7EB
    - **Border Right Color:** #E5E7EB
    - **Border Bottom Color:** #E5E7EB
    - **Border Left Color:** #E5E7EB
    - **Shadow:** none
    - **Preview Width:** 60
    - **Preview Height:** 16
    - **Count:** 1
  - **Item 6:**
    - **Label Sample:** READ FULL DOCS
    - **Font Family:** SFMono-Regular
    - **Font Size:** 12px
    - **Font Weight:** 400
    - **Line Height:** 16px
    - **Letter Spacing:** 1.2px
    - **Text Transform:** uppercase
    - **Border Radius:** 0px
    - **Padding X:** 0px
    - **Padding Y:** 0px
    - **Text Color:** #000000
    - **Border:** 0px solid rgb(229, 231, 235)
    - **Border Width:** 0px
    - **Border Style:** solid
    - **Border Color:** #E5E7EB
    - **Border Top:** 0px solid #E5E7EB
    - **Border Right:** 0px solid #E5E7EB
    - **Border Bottom:** 0px solid #E5E7EB
    - **Border Left:** 0px solid #E5E7EB
    - **Border Top Width:** 0px
    - **Border Right Width:** 0px
    - **Border Bottom Width:** 0px
    - **Border Left Width:** 0px
    - **Border Top Style:** solid
    - **Border Right Style:** solid
    - **Border Bottom Style:** solid
    - **Border Left Style:** solid
    - **Border Top Color:** #E5E7EB
    - **Border Right Color:** #E5E7EB
    - **Border Bottom Color:** #E5E7EB
    - **Border Left Color:** #E5E7EB
    - **Shadow:** none
    - **Preview Width:** 306
    - **Preview Height:** 16
    - **Count:** 1

**Previews:**
- **links:**
  - **Label Sample:** DOCUMENTATION
  - **Width:** 110
  - **Height:** 16
  - **Count:** 17
- **links:**
  - **Label Sample:** PRIVACY
  - **Width:** 59
  - **Height:** 16
  - **Count:** 3
- **links:**
  - **Label Sample:** ZENITH
  - **Width:** 61
  - **Height:** 16
  - **Count:** 2
- **links:**
  - **Label Sample:** ARCHITECTURE
  - **Width:** 119
  - **Height:** 16
  - **Count:** 2
- **primary:**
  - **Label Sample:** INITIALIZE STATE
  - **Width:** 239
  - **Height:** 48
  - **Count:** 1
- **primary:**
  - **Label Sample:** BEGIN DEPLOYMENT
  - **Width:** 247
  - **Height:** 56
  - **Count:** 1
## Layout

**Base Unit:** 4px

**Scale:** 1px, 2px, 4px, 8px, 16px, 20px, 24px, 32px

**Section Padding:** 24px, 128px, 40px, 32px, 80px, 96px

**Card Padding:** 32px, 40px, 9px

**Gaps:** 16px, 8px, 24px, 40px, 12px, 6px
## Elevation & Depth

Depth is communicated through glass, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as glass first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Glass
- **Borders:** 1px #000000; 1px #FFFFFF
- **Shadows:** rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 2px 4px 0px inset
- **Blur:** 12px, 4px

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 1px padding and a 0px radius. Drive the shell with linear-gradient(to right bottom, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.05)) so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 9999px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles. Reuse the existing card surface recipe for content blocks.

### Buttons
- **Primary:** background #000000, text #FFFFFF, radius 0px, padding 16px, border 0px solid rgb(229, 231, 235).
- **Links:** text #737373, radius 0px, padding 0px, border 0px solid rgb(229, 231, 235).

### Cards and Surfaces
- **Card surface:** background #F0EFEB, border 0px solid rgb(229, 231, 235), radius 0px, padding 32px, shadow none.
- **Card surface:** radius 0px, padding 40px, shadow none.

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 4px rhythm.
- Do reuse the Glass surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected expressive motion intensity without a deliberate reason.

## Motion

Motion feels expressive but remains focused on interface, text, and layout transitions. Timing clusters around 150ms and 300ms. Easing favors ease and cubic-bezier(0.4. Hover behavior focuses on text and color changes. Scroll choreography uses GSAP ScrollTrigger for section reveals and pacing.

**Motion Level:** expressive

**Durations:** 150ms, 300ms, 500ms, 700ms, 2000ms

**Easings:** ease, cubic-bezier(0.4, 0, 1), 0.2, 0.6

**Hover Patterns:** text, color

**Scroll Patterns:** gsap-scrolltrigger

