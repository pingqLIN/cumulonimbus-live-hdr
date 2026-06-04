# Research Notes: Cumulonimbus Live HDR

Status: first research pass, source-backed but not yet a scientific simulation.
Date: 2026-05-10

## Bottom Line

This project should be described as a procedural atmospheric artwork informed by meteorology and volumetric rendering research. It is not yet a numerical weather model, CFD solver, or physically validated cloud microphysics simulation.

The strongest direction is to model a cumulonimbus as a layered density field with three coupled behaviors:

1. Strong vertical growth from warm moist updrafts.
2. Flattened upper anvil caused by the tropopause redirecting vertical motion horizontally.
3. Slow edge evolution through condensation, evaporation, entrainment, wind shear, and ice-crystal spreading.

The current `IterativeCloudField` already has a useful foundation: persistent density, advection, condensation, evaporation, edge metrics, and HDR output. The next step is to rename and tune those controls against meteorological concepts rather than purely aesthetic labels.

## 1. Atmospheric Science Findings

### Cumulonimbus lifecycle

NOAA/NWS describes thunderstorm cells as having developing, mature, and dissipating stages. In the developing stage, a cumulus cloud is pushed upward by an updraft. In the mature stage, updraft and downdraft coexist; storm depth often reaches roughly 40,000 to 60,000 feet, or about 12 to 18 km. In the dissipating stage, downdraft cuts off the warm moist inflow and a remnant anvil can remain.

Renderer implication:

- Add a lifecycle phase parameter: `developing`, `mature`, `dissipating`, or continuous `stormAge`.
- `growth` should increase during developing and early mature phases.
- `evaporationRate` should increase in dissipating phase.
- Anvil persistence should outlast the tower body.

Source: NOAA/NWS Spotter Guide, Thunderstorm Life Cycle  
https://www.weather.gov/spotterguide/life

### Anvil formation and tropopause flattening

NASA Earth Observatory explains that the flat anvil marks the tropopause boundary. The tropopause acts like a wall: rising air is deflected horizontally, shaping the upper cloud into an anvil. Strong convection can briefly push protrusions above the anvil as overshooting tops.

Renderer implication:

- Represent a vertical-to-horizontal flow transition near the upper third of the frame.
- Add `tropopauseHeight` and `anvilOutflow` parameters.
- Upper cloud motion should drift laterally more than vertically.
- Overshooting tops should be sparse, short-lived, and wispy, not always present.

Sources:  
NASA Earth Observatory, The Anatomy of a Thunderstorm  
https://science.nasa.gov/earth/earth-observatory/the-anatomy-of-a-thunderstorm-78101/  
NASA Earth Observatory, Cumulonimbus Cloud over Africa  
https://science.nasa.gov/earth/earth-observatory/cumulonimbus-cloud-over-africa-8542

### Vertical extent and wind-flattened tops

UCAR states that cumulonimbus clouds grow vertically and can reach about 10 km high, where high winds flatten the top into an anvil shape. NASA examples note severe storm anvils exceeding 60,000 feet in some cases.

Renderer implication:

- Treat height as a perceptual scale, not a fixed real-world number in the 2D prototype.
- The top should be broader and smoother than the turbulent tower body.
- A high-altitude look benefits from a narrow tower stem plus broad horizontal anvil.

Sources:  
UCAR Center for Science Education, Cumulonimbus Clouds  
https://scied.ucar.edu/image/cumulonimbus-clouds  
NASA Earth Observatory, Anvil Tops of Thunderstorms  
https://science.nasa.gov/earth/earth-observatory/anvil-tops-of-thunderstorms-2726

### Convection, condensation, and adiabatic cooling

NASA describes cumulonimbus formation as vigorous convection of warm, moist, unstable air. Rising air expands and cools as pressure decreases, and droplets condense when sufficient moisture exists. UCAR similarly explains that warm moist updrafts feed cloud growth as water vapor condenses into droplets.

Renderer implication:

- `condensationRate` should be coupled to vertical lift, humidity proxy, and local target density.
- The lower and central tower should have stronger upward accumulation.
- The renderer should distinguish source mass generation from edge erosion.

Sources:  
NASA Earth Observatory, Cumulonimbus Cloud over Africa  
https://science.nasa.gov/earth/earth-observatory/cumulonimbus-cloud-over-africa-8542  
UCAR, How Thunderstorms Form  
https://scied.ucar.edu/learning-zone/storms/how-thunderstorms-form

### Entrainment, dissipation, and anvil cirrus

A UCAR/NCAR-linked CRYSTAL-FACE study of a Florida anvil observed a cloud evolving over about 3 hours from attached anvil shield to thinning, dissipating cirrus. The abstract notes that downwind anvil structure included layers, and that anvil cirrus dissipated largely from ice crystal aggregation and subsequent precipitation.

Renderer implication:

- Anvil should thin downwind rather than vanish uniformly.
- Add a low-frequency horizontal falloff/noise field for anvil thinning.
- Evaporation should be slower in cold upper regions, but thinning should continue through precipitation/settling proxy.
- A live loop can use a long anvil memory buffer while the tower refreshes faster.

Source: Garrett et al., Thunderstorm anvils: A close look at their evolution, CRYSTAL-FACE / UCAR record  
https://impacts.ucar.edu/en/publications/thunderstorm-anvils-a-close-look-at-their-evolution-2/

### Severe-storm features: overshooting tops and above-anvil cirrus plumes

NASA notes that overshooting tops and above-anvil cirrus plumes indicate especially strong storms. These features are subtle in satellite imagery and linked to intense updrafts and gravity waves.

Renderer implication:

- Optional `severity` control can introduce overshooting domes and plume-like wisps.
- For the requested calm, high-altitude image, keep these subtle and slow.
- Do not overuse severe-weather cues unless the target mood asks for menace.

Source: NASA Earth Observatory, Spotting Severe Storms with Satellites  
https://science.nasa.gov/earth/earth-observatory/spotting-severe-storms-with-satellites-149846/

## 2. Procedural Graphics Findings

### Volumetric clouds are usually density fields plus lighting

GPU Gems describes clouds, fog, smoke, fluids, and dust as volumetric phenomena because they are difficult to model as geometry. The core assumption is that light is emitted, absorbed, and scattered by many particles in a volume.

Renderer implication:

- Move toward a volume-like mental model even while the prototype is 2D.
- Keep density separate from shading.
- Current mainline: `cumulonimbus-live-hdr-mainline.html` uses a single shader/raymarch scene as the observable volumetric approximation, so camera changes should observe the same cloud structure rather than replace the model.
- 中文定位：目前主線是 `cumulonimbus-live-hdr-mainline.html` 的單一 shader/raymarch 雲體場景；多角度觀察應看見同一個雲體結構，而不是每個角度重生一張雲圖。
- Future WebGPU version should ray-march through a 3D density field.

Source: NVIDIA GPU Gems, Chapter 39: Volume Rendering Techniques  
https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-39-volume-rendering-techniques

### Production real-time clouds use layered noise and authored weather fields

Guerrilla Games' Nubis work for Horizon Zero Dawn is a major precedent. The 2015 system targeted evolving cloudscapes, lighting, animation, and high performance. The 2017 Nubis talk discusses production challenges including regional authoring, animation/transitions, atmospheric integration, Perlin-Worley noise generation, and weather simulation.

Renderer implication:

- Use a `weatherMap` concept: coverage, cloud type, precipitation/erosion, wind.
- Replace one global `growth` slider with structured fields: `coverage`, `humidity`, `uplift`, `shear`, `erosion`.
- Keep the current 2D procedural field as the preview-level equivalent of a weather map.
- Later WebGPU work should implement 3D Perlin-Worley density, ray marching, and temporal reprojection.

Sources:  
Guerrilla Games, The Real-Time Volumetric Cloudscapes of Horizon Zero Dawn  
https://www.guerrilla-games.com/read/the-real-time-volumetric-cloudscapes-of-horizon-zero-dawn  
Guerrilla Games, Nubis: Authoring Real-Time Volumetric Cloudscapes with the Decima Engine  
https://www.guerrilla-games.com/read/nubis-authoring-real-time-volumetric-cloudscapes-with-the-decima-engine  
Advances in Real-Time Rendering 2017 course page  
https://advances.realtimerendering.com/s2017/index.html

### Voxel and fluid-simulation modeling are later-stage directions

Later Nubis work moved toward voxel-based clouds and fluid simulation-based modeling, with acceleration structures and special lighting approximations such as dark edges and inner glow.

Renderer implication:

- Do not jump straight to full CFD; use cheap advection and persistent fields first.
- Add edge lighting and inner glow intentionally, not as accidental bloom.
- Future mode: precompute or stream a low-resolution 3D density volume, then upsample/render it.

Sources:  
Guerrilla Games, Nubis Evolved  
https://www.guerrilla-games.com/read/nubis-evolved  
Guerrilla Games, Nubis Cubed  
https://www.guerrilla-games.com/read/nubis-cubed

### Temporal coherence matters more than per-frame novelty

For live clouds, noisy per-frame random changes look synthetic. The project should favor persistent density buffers, slow advection, temporal reprojection, and low-frequency weather changes.

Renderer implication:

- Keep `IterativeCloudField` and expand it.
- Add a second buffer for moisture or temperature proxy.
- Use stable seeded noise in space and slow changes in time.
- Avoid high-frequency flicker at the cloud boundary.

Relevant source family: Nubis talks and real-time volume-rendering literature above.

## 3. HDR / Color Findings

### BT.2100 is the relevant HDR television standard

ITU-R BT.2100 specifies image parameters for HDR television production and programme exchange. The 2025 BT.2100-3 version remains in force and includes PQ and HLG methods.

Renderer implication:

- The current FFmpeg tags use the right family: BT.2020 primaries, PQ transfer, BT.2020 non-constant luminance matrix.
- The current luminance mapping is only a prototype. It is not yet a calibrated nit pipeline.
- Add a real luminance model: scene-linear value -> target nits -> inverse PQ encode.

Source: ITU-R BT.2100  
https://www.itu.int/rec/r-rec-bt.2100

### PQ is absolute luminance, not ordinary gamma

SMPTE and color-science references describe ST 2084 / PQ as an absolute transfer function designed around human contrast sensitivity, commonly spanning up to 10,000 cd/m2.

Renderer implication:

- Do not call the current `encodeHdr(value / 4)` scientifically correct.
- Add explicit controls such as `diffuseWhiteNits`, `sunEdgePeakNits`, `maxCll`, and `masterDisplayPeakNits`.
- SDR preview should be a tone-mapped view, not the same transform as HDR export.

Sources:  
SMPTE Motion Imaging Journal, 2021 HDR Progress Report  
https://journal.smpte.org/periodicals/SMPTE%20Motion%20Imaging%20Journal/130/8/32/  
Colour Science documentation, ST 2084 EOTF / inverse EOTF  
https://colour.readthedocs.io/en/latest/generated/colour.models.eotf_inverse_ST2084.html

## 4. Science-Art / Media-Art Precedents

### Fujiko Nakaya: fog as collaboration with atmosphere

Fujiko Nakaya is a key precedent for atmospheric art. Guggenheim Bilbao describes her fog sculptures as collaboration with water, atmosphere, air currents, and time. Haus der Kunst notes that Nakaya researches site meteorology, including humidity, wind direction/speed, and temperature.

Lesson for this project:

- Treat the cloud as a process reacting to conditions, not a fixed object.
- Add visible sensitivity to wind, humidity, and temperature-like parameters.
- Preserve slowness and ephemerality.
- Research should inform conditions, but the artwork can remain poetic.

Sources:  
Guggenheim Bilbao, Fog Sculpture #08025 (F.O.G.)  
https://www.guggenheim-bilbao.eus/en/the-collection/works/fog-sculpture-08025-f-o-g  
Haus der Kunst, Fujiko Nakaya: Art and Nature  
https://nakaya.hausderkunst.de/art-and-nature  
Experiments in Art and Technology, Fog Sculpture: Fujiko Nakaya  
https://www.experimentsinartandtechnology.org/fog

### Berndnaut Smilde: ephemeral indoor clouds

Berndnaut Smilde's Nimbus works create temporary indoor clouds using moisture, smoke, light, and controlled air conditions. National Geographic and Cornell describe the works as extremely brief, often lasting only seconds.

Lesson for this project:

- Edge disappearance is as important as cloud formation.
- The image should feel captured from a fleeting condition, not generated from a static asset.
- Avoid copying the indoor-cloud image language; use the precedent for ephemerality and condition-driven staging.

Sources:  
National Geographic, artist makes clouds appear in unexpected places  
https://www.nationalgeographic.com/magazine/article/dutch-artist-berndnaut-smilde-creates-clouds-photographs-them  
Cornell Chronicle, Cloud artist leaves lasting impression of fleeting work  
https://news.cornell.edu/stories/2014/04/cloud-artist-leaves-lasting-impression-fleeting-work  
MCAAD, Berndnaut Smilde  
https://www.mcaad.org/exhibition/artists/smilde

### Data-driven nature media art

Refik Anadol is a broad precedent for nature/data-driven media art, though not a direct cloud-rendering model. Recent descriptions of his Large Nature Model emphasize ethically sourced datasets and institutional data partnerships.

Lesson for this project:

- If the project later uses real atmospheric datasets, document provenance.
- Do not imply scientific authority without data lineage.
- Data aesthetics should remain distinguishable from weather prediction.

Source: TIME, Refik Anadol and TIME100 AI cover process  
https://time.com/7312089/time100-ai-behind-the-cover-refik-anadol/

## 5. Implementation Map

### Rename or add parameters

Current parameter -> research-informed direction:

- `growth` -> split into `humidity`, `upliftStrength`, `condensationRate`.
- `edgeDrift` -> split into `windShear`, `anvilOutflow`, `turbulentEntrainment`.
- `towerHeight` -> pair with `tropopauseHeight` and `updraftStrength`.
- `anvilSpread` -> pair with `upperWindSpeed` and `anvilPersistence`.
- `silverLining` -> pair with `sunAngle`, `phaseHighlight`, `edgeOpticalDepth`.
- `haze` -> pair with `airMassHaze`, `altitudeFade`, `distanceScattering`.

### Add model state

Recommended next data fields:

- `density`: existing.
- `moisture`: source field for condensation potential.
- `temperatureBuoyancy`: proxy for uplift strength.
- `iceAnvil`: upper-layer longer-memory field.
- `precipitationSink`: removes density in mature/dissipating phases.
- `wind`: 2D vector field, later 3D.

### Add lifecycle presets

Initial presets:

- `Towering cumulus`: high uplift, low anvil, strong vertical growth.
- `Mature cumulonimbus`: high tower, broad anvil, strong edge lighting.
- `Dissipating anvil`: weak tower, persistent upper anvil, thinning/wispy edges.
- `Severe overshooting top`: optional, sparse top protrusions and above-anvil plume.

### Dissipation behavior pass, 2026-05-26

Implementation note for `cumulonimbus-live-hdr-mainline.html`: avoid making the mature cloud body disappear as a simple horizontal top-down crop. Public NOAA/NWS guidance describes the dissipating stage as downdrafts and outflow cutting off the warm moist inflow, often leaving a remnant anvil. NCAR/UCAR anvil observations also support a separate upper-anvil memory: attached anvil can evolve into thinning dissipating cirrus over hours while lower convective structure has already weakened.

Renderer implication:

- Keep the upper anvil persistent and allow it to thin/settle unevenly.
- Erode the lower and middle tower first with downdraft/dry-pocket masks.
- Slow the lifecycle clock so dissipation reads as weather-scale drift rather than a UI animation.
- Treat the result as research-informed art direction, not validated cloud microphysics.

Sources:

- NOAA/NWS Spotter Guide, Thunderstorm Life Cycle  
  https://www.weather.gov/spotterguide/life
- Garrett et al., Thunderstorm anvils: A close look at their evolution, NCAR/UCAR record  
  https://impacts.ucar.edu/en/publications/thunderstorm-anvils-a-close-look-at-their-evolution-2/

### Rendering pipeline upgrades

Short term:

- Keep 2D buffer, add moisture and wind fields.
- Add research-backed parameter names and UI labels.
- Add calibrated HDR mapping functions using inverse ST 2084.
- Add 5-second test render with metrics logged to JSON.

Medium term:

- Move density sampling to WebGL/WebGPU shader.
- Add 3D procedural density volume with ray marching.
- Add light transmittance and phase-like forward scattering.
- Add temporal reprojection / accumulation to reduce noise.

Long term:

- Optional real weather data ingestion: ERA5, satellite imagery, or radiosonde-derived profiles.
- OBS/NDI/spout/live texture output.
- HDR mastering workflow with measured nit targets.

## 6. Caveats

- The current code is not a validated meteorological model.
- Noise fields are artistic approximations, not Navier-Stokes or cloud microphysics.
- The current `cumulonimbus-live-hdr-mainline.html` model is a visual approximation for multi-angle observable consistency, not a measured or unitful atmospheric volume.
- 中文注意事項：`cumulonimbus-live-hdr-mainline.html` 是視覺一致性模型，不是具單位、可驗證的真實大氣體積資料。
- `condensation` and `evaporation` are currently visual rates, not physically unitful rates.
- HDR metadata does not guarantee perceptually correct HDR. The pixel values need proper scene-linear and PQ mapping.
- Science-art precedents should guide process and philosophy, not be visually copied.
- Any future claim of scientific accuracy requires data provenance, units, validation images, and ideally expert review.

## 7. Follow-Up Source Additions

A later science-art research pass added several sources that should inform the next implementation pass:

- WMO International Cloud Atlas: use official cloud morphology language for cumulonimbus, including accessory and supplementary features.  
  https://cloudatlas.wmo.int/en/clouds-genera-cumulonimbus.html
- Met Office cumulonimbus overview: practical public-facing summary of low-level cloud classification, storm association, and anvil form.  
  https://weather.metoffice.gov.uk/learn-about/weather/types-of-weather/clouds/low-level-clouds/cumulonimbus
- NOAA PSL convection education: use as a simple explanatory source for convection and thunderstorm updraft logic.  
  https://psl.noaa.gov/outreach/education/science/convection/Thunder.html
- NOAA/NSSL Thunderstorm Basics: source for storm structure and severe storm concepts before adding optional severity presets.  
  https://www.nssl.noaa.gov/education/svrwx101/thunderstorms/
- NOAA repository papers on entrainment and dilution: use cautiously for edge erosion and dilution logic, without claiming physical validation.  
  https://repository.library.noaa.gov/view/noaa/48352  
  https://repository.library.noaa.gov/view/noaa/49846
- Frostbite physically based sky, atmosphere, and cloud rendering: useful bridge between game production and atmosphere-integrated rendering.  
  https://www.ea.com/frostbite/news/physically-based-sky-atmosphere-and-cloud-rendering
- GPU Gems 2 improved Perlin noise: relevant for later replacing basic value noise with better gradient noise.  
  https://developer.nvidia.com/gpugems/gpugems2/part-iii-high-quality-rendering/chapter-26-implementing-improved-perlin-noise
- Cloud rendering survey: useful broad map of cloud modeling/rendering approaches before WebGPU architecture work.  
  https://link.springer.com/article/10.1007/s00371-020-01953-y
- Cloud Music / Smithsonian: important precedent for using clouds as live signals rather than static imagery.  
  https://americanart.si.edu/blog/eye-level/2013/11/602/cloudsourcing
- Inigo Manglano-Ovalle, Random Sky: weather-data-driven generative precedent.  
  https://www.hydeparkart.org/exhibition-archive/random-sky/
- Ned Kahn, Cloud Arbor: public-art precedent for clouds as condition-triggered atmospheric events.  
  https://www.instituteforpublicart.org/case-studies/cloud-arbor/

Implementation consequence: the next development pass should split the research into three shorter engineering documents: `science-notes`, `rendering-notes`, and `art-direction-notes`, then convert them into a parameter schema and renderer backlog.
