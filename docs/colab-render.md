# Colab Render Port

This document describes how to run the `cumulonimbus-live-hdr` offline render pipeline in Google Colab. Colab is useful for batch rendering and research experiments. It is not a production backend for live per-visitor rendering.

## Scope

Use Colab for:

- quick, test, and demo loop rendering;
- files under `outputs/`, including videos, frame sequences, and metrics;
- repeatable non-interactive runs by an agent or a human operator.

Do not use Colab for:

- per-frame rendering for public website visitors;
- long-lived API, WebSocket, or WebRTC services;
- workflows that require a fixed GPU model or permanent local files.

## Notebook Flow

1. Open `notebooks/cumulonimbus_colab_render.ipynb`.
2. Select a GPU runtime when a GPU experiment is needed.
3. Configure the repository URL. Private repositories require a GitHub token in Colab or a zip uploaded to Drive.
4. Run the setup cell.
5. Run the render cell.
6. Retrieve artifacts from `outputs/` or Google Drive.

## Agent-Friendly Entrypoint

The notebook is a thin wrapper. The repeatable entrypoint is `scripts/colab-runner.mjs`:

```bash
npm run colab:render -- --mode quick --install --check -- --width 360 --height 640 --seconds 1
```

Common modes:

```bash
npm run colab:render -- --mode quick --install --check
npm run colab:render -- --mode test --install --check -- --width 540 --height 960 --seconds 5
npm run colab:render -- --mode demo --install --check -- --seconds 120 --width 720 --height 1280 --drift-cycle 90 --drift-amount 0.35
```

Arguments before `--` belong to the Colab runner. Arguments after `--` are passed to the existing render script.

The runner writes:

- `outputs/colab/job-manifest.json`;
- the MP4, frame, and metrics artifacts produced by the selected render script.

## Minimum Verification

Use this first in Colab or a local worktree:

```bash
npm run check
npm run colab:render -- --mode quick --skip-render --check
```

`npm run test:browser` starts the full browser-backed smoke suite. It can take several minutes locally and may require extra browser packages in Colab, so it is not the first Colab smoke gate.

## Relationship to the Public Site

The public site remains an interactive client-side WebGL page. Colab artifacts should be treated as:

- showcase videos;
- high-quality loops;
- release artifacts;
- research data for future server-assisted caches.

Do not treat a Colab runtime as the production backend.
