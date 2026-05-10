# Cumulonimbus Live HDR

Algorithmic prototype for a high-altitude cumulonimbus image that slowly grows, drifts, and recedes at the edge. The immediate target is a single portrait test segment; the longer target is a live HDR video source.

## Bootstrap Decisions

- Archetype: single-package web app with a local render script.
- Storage root: `Q:\Projects\cumulonimbus-live-hdr`.
- Runtime: TypeScript, Vite preview, Node.js render pipeline.
- Persistence: local files only for rendered frames and video outputs.
- Output target: browser preview first, FFmpeg HDR-tagged MP4 test segment second.

The reference clip is a 1920x3840, 30 fps, 5.03 second portrait MOV. This prototype keeps the same portrait rhythm, but starts at a smaller render size so iteration stays fast.

## Commands

```powershell
npm install
npm run dev
npm run render:quick
npm run render:test
```

`render:quick` writes `outputs/cumulonimbus-quick-hdr.mp4`.

`render:test` writes `outputs/cumulonimbus-test-hdr.mp4`.

Both render commands generate 16-bit PPM frames and encode them with FFmpeg as 10-bit HEVC with HDR10 metadata. This is a prototype HDR path, not final color mastering.

## Research

The first source-backed research pass is in [docs/research-notes.md](docs/research-notes.md). It covers atmospheric science, procedural volumetric cloud rendering, HDR standards, and science-art precedents.

## Next Steps

The current renderer uses a persistent `IterativeCloudField`, so the cloud edge now has memory: target density condenses into the field gradually, previous density is advected by slow wind shear, and evaporation trails behind the ideal mathematical shape.

1. Tune the growth and edge drift against the reference video.
2. Add WebGPU or shader rendering for realtime 4K portrait output.
3. Add a live output mode for OBS or a streaming pipeline.

