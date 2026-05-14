# Cumulonimbus simulation research notes

Date: 2026-05-13
Scope: visual simulation only. YouTube live / RTMPS / broadcast pipeline is intentionally out of scope for this batch.

## Current target

Build a lightweight cloud simulation preview focused on cumulonimbus HDR-style visuals:

- Dark cinematic sky.
- Strong upper-left or left-side illumination.
- Tall cumulonimbus tower silhouette.
- Dense cauliflower billow detail on cloud edges.
- Slow push-in / upward growth motion similar to the reference clip.

## Reference assets copied into this project

- [A_Method_for_Modeling_Clouds_Based_on_Atmospheric_.pdf](../references/papers/A_Method_for_Modeling_Clouds_Based_on_Atmospheric_.pdf)
- [reference_portrait_cumulonimbus.png](../references/images/reference_portrait_cumulonimbus.png)
- [reference_landscape_cumulonimbus.png](../references/images/reference_landscape_cumulonimbus.png)
- [reference_cumulonimbus_cloud_simulationmp.mp4](../references/videos/reference_cumulonimbus_cloud_simulationmp.mp4)
- [cumulonimbus_cloud_simulationmp_frames](../references/videos/cumulonimbus_cloud_simulationmp_frames/)

## Prototype copied into this project

- [cumulonimbus_proc_preview.py](../prototypes/cpu-procedural/cumulonimbus_proc_preview.py)
- [cumulonimbus_proc_preview.mp4](../prototypes/cpu-procedural/cumulonimbus_proc_preview.mp4)

Prototype output from the first successful full run:

- Output: 720x1280 MP4
- FPS: 24
- Frames: 144
- Duration: about 5.91 seconds
- Render time observed locally: about 55 seconds
- Visual verdict: broad silhouette is close, but detail quality is still far from the references.

## Visual gap after first prototype

The silhouette and lighting direction are roughly aligned, but details differ substantially:

- Reference has finer nested cauliflower lobes with crisp-but-soft volumetric edges.
- Prototype uses 2D Gaussian billows, so internal cloud detail feels flatter and less physically layered.
- Reference has believable self-shadowing, deep occlusion pockets, and local highlight rolloff.
- Prototype needs stronger multi-scale density structure, local cavities, rim breakup, and better light transport approximation.
- Reference motion appears like slow volumetric swelling and camera push-in; prototype motion is more particle-like.

## Next research direction

Recommended next iteration before touching livestream work:

1. Replace pure 2D blob accumulation with a 2.5D density stack or low-resolution 3D lattice projected to camera.
2. Add multi-scale Worley/fBm domain-warped density to produce nested cauliflower detail.
3. Add cheap directional transmittance / shadow map from the light side.
4. Separate macro silhouette, meso billows, and micro surface breakup into different layers.
5. Add temporal advection field so detail rolls and inflates instead of only drifting upward.
6. Keep CPU/cloud-server compatibility as a constraint unless explicitly changed.
