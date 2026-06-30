# Cloud Morphology Pool

## Purpose

The morphology pool makes cloud-body variation explicit and repeatable. A seed can still drive organic randomness, but the renderer now also exposes named morphology styles for QA, visual direction, and screenshot capture.

## Styles

| Value | Style | Intent |
| --- | --- | --- |
| `seeded` | Seeded pool | Seed-driven blend of macro and edge traits. |
| `baseline` | Base sphere | Near-spherical form with reduced surface and boundary traits. |
| `macro-boundary` | Macro edge | Strong silhouette variation from protrusion, stretching, compression, and contour ridges. |
| `flatten` | Flattened | Compressed cloud body with wider horizontal profile. |
| `skew-twist` | Skew twist | Oblique leaning, shear, and twist applied to the spherical topology. |
| `tear-silk` | Tear silk | Fuzzy shell, wind tear, and silk-like edge dissipation. |
| `budding` | Budding | One large cloud body with a smaller attached bud, similar to yeast budding. |
| `giant-cumulonimbus` | Giant Cb | Original giant cumulonimbus tower/anvil profile added as a pool member. |

## Traceable Formula

The pool is implemented as a small style index plus seeded traits:

- `src/app/raymarch-cloud-renderer.ts` defines `CLOUD_MORPHOLOGY_STYLES`, maps styles to numeric values, and sends both `uMorphologyStyle` and `CUMULONIMBUS_MORPHOLOGY_STYLE` to the shader.
- `src/app/runtime-options.ts` reads `morphologyStyle`, `morphology`, `shapeStyle`, or `shape` from the URL.
- `src/app/raymarch-cloud-shader.ts` uses `sphericalRecipe(slot) = hash(uSeed * 0.0137 + slot * 17.371)` to keep each trait reproducible.
- `sphericalTrait(slot, onset, full)` gates each factor with `smoothstep`.
- `morphologyMask(style)` and `morphologyForcedTrait(...)` let a named pool style force a trait while preserving seeded variation in `seeded`.

Special macro branches:

- `mapBuddingCloudMacro(...)` merges a main spherical body, a smaller bud, and a neck using smooth union.
- `mapOriginalGiantCumulonimbusMacro(...)` reuses the original tower/anvil cell logic for a single explicit giant Cb style.

## UI And URL Usage

The UI selector lives in the Cloud Body panel:

- Element: `#select-morphology`
- Label: `Morph`
- Control wiring: `src/ui/app-shell.ts` and `src/ui/controls.ts`

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
- `ui-morphology-landscape.png` - rendered UI style check with the Morph selector set to `budding`.

Note: `outputs/*` is ignored by Git, so these files are saved locally but are not versioned unless copied to a tracked path.

## Verification Notes

Checks run during this pass:

- `npm run check`
- live-entry smoke capture
- individual style captures for all eight morphology styles
- UI landscape capture with `#select-morphology` interaction
- `git diff --check` showed only existing CRLF normalization warnings
