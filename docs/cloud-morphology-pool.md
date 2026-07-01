# Cloud Morphology Pool

## Purpose

The morphology pool makes cloud-body variation explicit and repeatable. A seed can still drive organic randomness, but the renderer now also exposes named morphology styles for QA, visual direction, and screenshot capture.

## Styles

| Value                | Style       | Intent                                                                                    |
| -------------------- | ----------- | ----------------------------------------------------------------------------------------- |
| `seeded`             | Seeded pool | Seed-driven blend of macro and edge traits.                                               |
| `baseline`           | Base sphere | Near-spherical form with reduced surface and boundary traits.                             |
| `macro-boundary`     | Macro edge  | Strong silhouette variation from protrusion, stretching, compression, and contour ridges. |
| `flatten`            | Flattened   | Compressed cloud body with wider horizontal profile.                                      |
| `skew-twist`         | Skew twist  | Oblique leaning, shear, and twist applied to the spherical topology.                      |
| `tear-silk`          | Tear silk   | Fuzzy shell, wind tear, and silk-like edge dissipation.                                   |
| `budding`            | Budding     | One large cloud body with a smaller attached bud, similar to yeast budding.               |
| `giant-cumulonimbus` | Giant Cb    | Original giant cumulonimbus tower/anvil profile added as a pool member.                   |

## Traceable Formula

The pool is implemented as a small style index plus seeded traits:

- `src/app/raymarch-cloud-renderer.ts` defines `CLOUD_MORPHOLOGY_STYLES`, maps styles to numeric values, and sends both `uMorphologyStyle` and `CUMULONIMBUS_MORPHOLOGY_STYLE` to the shader.
- `src/app/cloud-morphology-library.ts` is the UI-facing style database with labels, codes, intent text, and trait tags.
- `src/app/runtime-options.ts` reads `morphologyStyle`, `morphology`, `shapeStyle`, or `shape` from the URL.
- `src/app/raymarch-cloud-shader.ts` uses `sphericalRecipe(slot) = hash(uSeed * 0.0137 + slot * 17.371)` to keep each trait reproducible.
- `sphericalTrait(slot, onset, full)` gates each factor with `smoothstep`.
- `morphologyMask(style)` and `morphologyForcedTrait(...)` let a named pool style force a trait while preserving seeded variation in `seeded`.

Special macro branches:

- `mapBuddingCloudMacro(...)` merges a main spherical body, a smaller bud, and a neck using smooth union.
- `mapOriginalGiantCumulonimbusMacro(...)` reuses the original tower/anvil cell logic for a single explicit giant Cb style.

## Runtime And URL Usage

The web control surface keeps morphology selection hidden by default. On page open,
`src/app/runtime-options.ts` chooses a style from the morphology pool using a private
growth rule that combines runtime entropy, time phase, and device profile. The chosen
style is written to `document.documentElement.dataset.morphology` for diagnostics and
sent to the renderer as `morphologyStyle`.

URL parameters still override the hidden rule for QA, screenshot capture, and directed
look development. Supported keys are `morphologyStyle`, `morphology`, `shapeStyle`, and
`shape`.

URL examples:

```text
/?morphology=seeded
/?morphology=budding
/?morphology=giant-cumulonimbus
/?shape=tear-silk
```

Capture scripts forward the same query keys through `scripts/lib/preview-url.mjs`.

## Saved Review Outputs

The latest local style-check outputs are saved here:

```text
outputs/analysis/morphology-pool-samples-20260628/
```

Important files:

- `contact-sheet.png` - visual comparison of all eight pool styles.
- `manifest.json` - PNG analysis metrics for each style.
- `ui-morphology-landscape.png` - older rendered UI check from the visible selector prototype.

Note: `outputs/*` is ignored by Git, so these files are saved locally but are not versioned unless copied to a tracked path.

## Verification Notes

Checks run during this pass:

- `npm run check`
- live-entry smoke capture
- individual style captures for all eight morphology styles
- UI landscape capture with `morphology=macro-boundary` URL override
- `git diff --check` showed only existing CRLF normalization warnings
