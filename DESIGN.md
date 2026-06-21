# Design

## Overview

Cumulonimbus Live HDR uses a restrained product UI wrapped around an atmospheric
sky scene. The visual direction is clean, simple, and cloud-like: pale daylight
surfaces, fine horizon lines, softened blue gradients, and subtle depth that
supports the live render instead of competing with it.

The interface should feel like an observatory table under open sky: precise
enough for look development, quiet enough for long sessions, and spacious enough
to let the cloud read as the focal subject.

## Color Strategy

Use a restrained daylight palette in OKLCH where possible.

- `sky-50`: `oklch(98% 0.012 235)` for the main shell surface.
- `sky-100`: `oklch(95% 0.025 235)` for secondary panels.
- `sky-200`: `oklch(88% 0.045 232)` for fine borders and control tracks.
- `cloud-ink`: `oklch(24% 0.035 245)` for primary text.
- `cloud-muted`: `oklch(48% 0.035 245)` for secondary labels.
- `sunlit`: `oklch(78% 0.105 78)` for active or primary action states.
- `blue-signal`: `oklch(66% 0.12 232)` for selected states and live telemetry.
- `storm-violet`: `oklch(45% 0.06 282)` only for atmospheric shadow accents.

Avoid pure white and pure black. Neutrals should be lightly tinted toward the sky
hue. Accent color should describe interaction state, not decoration.

## Typography

Use a product-safe sans stack for controls and dense labels:

```css
font-family: "Segoe UI Variable", "Aptos", "Segoe UI", system-ui, sans-serif;
```

Use a tighter product scale:

- Page title: 1.75rem to 2rem, 700 weight.
- Section titles: 1rem to 1.125rem, 650 weight.
- Control labels: 0.75rem to 0.875rem, 600 weight.
- Body and helper copy: 0.875rem to 0.95rem, regular.
- Telemetry and numeric readouts: 0.8rem to 0.9rem, tabular numerals when
  available.

Do not use display fonts in buttons, sliders, or telemetry.

## Layout

The preview owns the composition. Controls should gather around it as an
instrument panel with a clear hierarchy:

1. Render viewport and HUD state.
2. View/aspect controls and live status.
3. Storm, atmosphere, time, render, and framing controls.
4. Advanced or historical prototype information below or collapsed.

Desktop layout can use a wide stage with a side or bottom control rail. Mobile
layout should prioritize the viewport first, then compact grouped controls. Do
not simply shrink a desktop dashboard.

## Components

### Stage

The stage should use a pale sky frame with subtle depth:

- Fine 1px border.
- Soft inner highlight.
- Low, cool shadow below the viewport.
- Optional horizon or contour-line background behind the render.

### Control Groups

Control groups are compact instrument clusters, not heavy cards.

- Use thin borders and soft tints.
- Group by task: display, storm, time, render, atmosphere, framing.
- Keep labels short.
- Use active states that are visible through fill, border, and text weight.

### Buttons

Buttons need default, hover, focus, active, disabled, and selected states.

- Default: tinted sky surface with subtle border.
- Hover: slightly brighter fill and clearer border.
- Focus: visible outline offset from the control.
- Active/selected: sunlit or blue-signal fill with stronger text.
- Disabled: reduced opacity plus cursor and text state.

### Sliders

Sliders should look like measuring instruments:

- Fine track.
- Clear thumb.
- Numeric readout close to the label.
- Use color sparingly for meaningful domains, such as render power or wind
  shear.

## Motion

Motion should express state and reduce abruptness.

- Use 150ms to 250ms transitions.
- Prefer transform and opacity.
- Do not animate layout properties.
- Respect `prefers-reduced-motion`.
- Avoid large page-load choreography. The product should open directly into the
  task.

GSAP may be used for framework-scoped UI polish only when the implementation has
a mounted lifecycle and cleanup path. Do not animate global selectors without a
component scope.

## Imagery

The README banner is a dramatic cloud-sky image. It should inform atmosphere but
not force the app UI into a fantasy-game aesthetic. The app surface remains a
clean cloud observatory; the banner can carry more spectacle than the controls.

## Accessibility

Maintain WCAG AA text contrast across light sky surfaces. Use focus-visible
states for all keyboard-interactive controls. Do not rely only on hue to show
active or disabled states. Preserve legibility over transparent or gradient
backgrounds.

## Implementation Notes

The current active surface is the Vite single-canvas app: `index.html` loads
`src/app/main.ts` and uses `src/styles/app.css` for the browser frame. When
redesigning, keep the active entrypoint, GitHub Pages build, and README claims
aligned.
