# Cloud Morphology Stabilization Handoff

Date: 2026-07-01

This local handoff captures the conversation phase that repaired the unstable new cloud morphology presentation. It is stored under `outputs/session-handoffs/`, which is ignored by Git in this repository and intended as local project evidence rather than publishable documentation.

## User Request

- Fix the unstable new cloud-body database presentation.
- Compared with the older cumulonimbus shape, 3D rotation felt less smooth.
- The cloud body occasionally flickered or changed into other forms.
- The morphology explanation and selection UI should not appear on the foreground panel.
- Hide the current morphology UI and replace the visible presentation with the previous version.
- Commit and push the completed fix.

## Result

- The foreground Morph selector, morphology database cards, and explanatory morphology UI were removed from the app shell.
- Runtime morphology is locked to the stable old `giant-cumulonimbus` presentation.
- URL parameters such as `morphology=macro-boundary` no longer override the visible cloud form.
- The UI smoke test now intentionally passes `morphology=macro-boundary` and verifies the app still reports `giant-cumulonimbus` with no morphology UI present.
- Commit `f778785 Stabilize cloud morphology presentation` was pushed to `origin/main`.

## Changed Source Files

- `src/app/runtime-options.ts`
- `src/ui/app-shell.ts`
- `src/ui/controls.ts`
- `scripts/capture-3d-still.mjs`
- `scripts/smoke-ui-capture.mjs`

## Verification Completed

- `npm run check`
- `npm run build`
- `npm run test:ui-capture`
- `npm run test:live-entry`
- `npm run test:smoke`
- In-app Browser QA against local Vite: loaded with `debug=1&morphology=macro-boundary`, verified `renderStatus: ready`, `morphology: giant-cumulonimbus`, no foreground morphology UI, no console warnings or errors, and drag rotation kept the renderer ready.

Note: An earlier parallel run of two build-producing smoke tests hit a Windows `dist/CNAME` file-lock race. The failed command was rerun serially and passed.

## Stored Evidence Files

- `cumulonimbus-stable-after.png` - in-app Browser QA screenshot after drag interaction.
- `cumulonimbus-ui-capture-smoke.png` - UI smoke capture after the morphology-lock regression check.
- `cumulonimbus-live-entry-smoke.png` - live-entry smoke capture.

## Current Repo State At Transfer

- Repository: `Q:\Projects\cumulonimbus-live-hdr`
- Branch: `main`
- Remote: `origin` at `https://github.com/pingqLIN/cumulonimbus-live-hdr.git`
- Pushed head: `f778785`
- Working tree before this handoff artifact: clean and synced with `origin/main`.
- These handoff files are local ignored artifacts under `outputs/` and are not committed.

## Next Useful Checks

- If the public site at `http://cloud.colorgeek.co/` still shows the old morphology UI, verify deployment or cache state after GitHub Pages/build propagation.
- If cloud flicker returns, inspect `document.documentElement.dataset.renderStatus`, console warnings, and `CONTEXT_LOST_WEBGL` events before changing shader logic.
