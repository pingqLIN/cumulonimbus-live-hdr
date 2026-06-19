# Product

## Register

product

## Users

The primary users are visual-development operators, technical artists, and local
tooling agents working on cumulonimbus cloud look development. They use the
interface while comparing storm structure, HDR-oriented lighting, render
quality, and live framing for browser preview, OBS-style output, and repeatable
smoke captures.

Users are usually in an iteration loop: adjust a parameter, inspect the cloud
body, compare the result against reference intent, and preserve a reproducible
URL or capture. The interface should keep controls readable without pulling
attention away from the cloud itself.

## Product Purpose

Cumulonimbus Live HDR is an interactive standalone cloud observatory for
developing a visually consistent cumulonimbus approximation. The current source
of truth is `cumulonimbus-live-hdr-mainline.html`, a Three.js shader/raymarch
surface with controls for seed, time, quality, tropopause height, freezing
level, wind shear, light, camera mode, grid, HUD, and viewport aspect.

Success means a user can quickly understand the rendered storm, adjust the
scene, and produce a credible live preview or test capture without wondering
which control affects which visual property.

## Brand Personality

Clear, atmospheric, precise.

The product should feel like a clean sky-facing instrument rather than a dark
debug cockpit. It can be poetic in atmosphere, but operational in controls. The
cloud should remain the protagonist; the UI is a quiet observatory frame.

## Anti-references

- Generic dark glass dashboard aesthetics that make every control feel like a
  sci-fi panel.
- Purple startup gradients, heavy neon, and decorative glow used without
  operational meaning.
- Dense identical card grids that hide the hierarchy of preview, controls, and
  status.
- Scientific overclaiming. The interface must not imply validated atmospheric
  simulation when the renderer is a visual volumetric approximation.
- Decorative motion that competes with real-time cloud motion.

## Design Principles

1. Keep the cloud as the main event.
2. Make every control explain its effect through placement, label, and state.
3. Use atmospheric depth with restrained lines, soft gradients, and layered
   light rather than heavy decoration.
4. Preserve reproducibility: visible state, stable controls, and URL-driven
   parameters matter more than novelty.
5. Separate visual ambition from scientific claims.

## Accessibility & Inclusion

Target WCAG AA contrast for text and interactive controls. Support keyboard
focus states, reduced-motion preferences, and non-color-only state indicators.
Avoid motion sequences that delay access to controls. Keep technical labels
short but understandable for bilingual Traditional Chinese and English usage.
