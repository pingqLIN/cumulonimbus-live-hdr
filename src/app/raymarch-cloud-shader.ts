// Extracted from Q:/Projects/cumulonimbus-live-hdr-site-mobile-gemini/06.html.
// This module intentionally contains only the cloud shader source.
export const raymarchCloudFragmentShader = String.raw`
            uniform float uTime;
            uniform vec2 uResolution;
            uniform vec3 uCameraPos;
            uniform vec3 uCameraTarget;
            uniform float uAspect;
            uniform float uTropopause;
            uniform float uShowGrid;
            uniform float uSurfaceVisible;
            uniform float uSurfaceMode;
            uniform float uSeed;
            uniform float uSystemCount;
            uniform float uIsOrtho;
            uniform float uOrthoSize;
            uniform float uOrthoVerticalScale;
            uniform float uStepSize;
            uniform float uMaxSteps;
            uniform float uSunIntensity;
            uniform float uAmbientIntensity;
            uniform float uSunElevation;
            uniform float uSunViewerAngle;
            uniform float uFreezingLevel;
            uniform float uWindShear;
            uniform float uFbmOctaves;
            uniform float uCloudCurl;
            uniform float uMorphologyStyle;
            uniform float uPhotographicStyle;
            uniform float uLightPreset;
            uniform float uSkyMode;
            uniform float uTransparentBackground;
            uniform float uHdr10Mode;
            uniform float uDitherEnabled;
            uniform float uHdrReferencePeakNits;
            uniform float uMobileCumulusMode;

#ifndef CUMULONIMBUS_MORPHOLOGY_STYLE
#define CUMULONIMBUS_MORPHOLOGY_STYLE 0
#endif

            float hash(float n) { return fract(sin(n) * 43758.5453123); }

            float noise(vec3 x) {
                vec3 p = floor(x);
                vec3 f = fract(x);
                f = f * f * (3.0 - 2.0 * f);
                float n = p.x + p.y * 57.0 + 113.0 * p.z + uSeed * 17.0;
                return mix(
                    mix(mix(hash(n + 0.0), hash(n + 1.0), f.x), mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
                    mix(mix(hash(n + 113.0), hash(n + 114.0), f.x), mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y),
                    f.z
                );
            }

            float fbm(vec3 p) {
                float f = 0.0;
                float weight = 0.5;
                for (int i = 0; i < 4; i++) {
                    f += weight * (1.0 - abs(noise(p * 2.0 - 1.0)));
                    p = vec3(
                        p.x * 1.74 + p.z * 0.31,
                        p.y * 1.91 + p.x * 0.17,
                        p.z * 1.63 - p.y * 0.23
                    );
                    weight *= 0.5;
                }
                return f;
            }

            float fbmAdaptive(vec3 p) {
                float f = 0.0;
                float weight = 0.5;
                for (int i = 0; i < 6; i++) {
                    float octaveGate = 1.0 - step(uFbmOctaves, float(i));
                    f += octaveGate * weight * (1.0 - abs(noise(p * 2.0 - 1.0)));
                    p = vec3(
                        p.x * 1.74 + p.z * 0.31,
                        p.y * 1.91 + p.x * 0.17,
                        p.z * 1.63 - p.y * 0.23
                    );
                    weight *= 0.5;
                }
                return f;
            }

            vec3 detailDomain(vec3 p) {
                return vec3(
                    p.x * 0.82 + p.z * 0.57,
                    p.y * 1.05 + p.x * 0.13 - p.z * 0.08,
                    p.z * 0.76 - p.x * 0.42 + p.y * 0.11
                );
            }

            float domainWarp(vec3 p, float phase) {
                vec3 a = detailDomain(p * 0.18 + vec3(phase, 3.1, 7.7));
                vec3 b = detailDomain(p * 0.31 + vec3(9.4, phase * 0.7, 1.8));
                return (fbm(a) - 0.5) * 0.9 + (noise(b) - 0.5) * 0.55;
            }

            float smin(float a, float b, float k) {
                float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
                return mix(b, a, h) - k * h * (1.0 - h);
            }

            float smax(float a, float b, float k) {
                float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
                return mix(a, b, h) + k * h * (1.0 - h);
            }

            vec2 intersectAABB(vec3 ro, vec3 rd, vec3 boxMin, vec3 boxMax) {
                vec3 safeRd = rd;
                safeRd.x = abs(safeRd.x) < 0.0001 ? 0.0001 : safeRd.x;
                safeRd.y = abs(safeRd.y) < 0.0001 ? 0.0001 : safeRd.y;
                safeRd.z = abs(safeRd.z) < 0.0001 ? 0.0001 : safeRd.z;
                vec3 tMin = (boxMin - ro) / safeRd;
                vec3 tMax = (boxMax - ro) / safeRd;
                vec3 t1 = min(tMin, tMax);
                vec3 t2 = max(tMin, tMax);
                float tNear = max(max(t1.x, t1.y), t1.z);
                float tFar = min(min(t2.x, t2.y), t2.z);
                return vec2(tNear, tFar);
            }

            const float MODEL_BASE_KM = 0.5;
            const float MODEL_LOCAL_BASE = -2.5;
            const float MODEL_LOCAL_TROPO = 4.5;
            const float MODEL_LOCAL_HEIGHT = MODEL_LOCAL_TROPO - MODEL_LOCAL_BASE;
            float modelKmScale() {
                return max(0.7, (uTropopause - MODEL_BASE_KM) / MODEL_LOCAL_HEIGHT);
            }

            vec3 worldToModelSpace(vec3 p) {
                float kmScale = modelKmScale();
                return vec3(p.x / kmScale, (p.y - MODEL_BASE_KM) / kmScale + MODEL_LOCAL_BASE, p.z / kmScale);
            }

            float cellCycleAngle(float phase, float speedScale, float ageOffset) {
                return uTime * 0.113 * speedScale + phase * 0.53 + ageOffset + uSeed * 0.00082;
            }

            vec2 windShearAxis(float phase) {
                float angle = phase * 0.17 + uSeed * 0.00021;
                vec2 axis = normalize(vec2(1.0, 0.28));
                mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
                return normalize(rot * axis);
            }

            float iceFactorAtHeight(float heightKm) {
                return smoothstep(uFreezingLevel, uTropopause, heightKm);
            }

            float getCell01(
                vec3 p,
                vec2 offset,
                float maxR,
                float phase,
                float maxH,
                float speedScale,
                float ageOffset,
                float earlyDecay,
                float anvilScale
            ) {
                float cycleAngle = cellCycleAngle(phase, speedScale, ageOffset);
                float cycle = sin(cycleAngle) * 0.5 + 0.5;
                float falling = smoothstep(0.44, 0.9, -cos(cycleAngle) * 0.5 + 0.5);
                float growth = smoothstep(0.08, 0.86, cycle);
                float mature = smoothstep(0.58, 0.92, cycle) * (1.0 - falling * 0.32);
                float decayStart = clamp(0.46 - earlyDecay, 0.18, 0.72);
                float decayEnd = clamp(0.92 - earlyDecay * 0.48, decayStart + 0.18, 0.98);
                float dissipating = falling * smoothstep(decayStart, decayEnd, cycle);

                vec2 baseLocal = p.xz - offset;
                float r = length(baseLocal);
                float currentR = maxR * (0.58 + 0.42 * growth) * (1.0 - dissipating * mix(0.08, 0.24, earlyDecay));
                float naturalTop = mix(MODEL_LOCAL_BASE + 1.05, maxH, growth);
                float actualTop = min(naturalTop, MODEL_LOCAL_TROPO);
                float height = max(0.5, actualTop - MODEL_LOCAL_BASE);
                float h = clamp((p.y - MODEL_LOCAL_BASE) / height, 0.0, 1.0);
                float lowerShelf = smoothstep(0.02, 0.18, h) * (1.0 - smoothstep(0.3, 0.52, h));
                float towerColumn = smoothstep(0.16, 0.42, h) * (1.0 - smoothstep(0.66, 0.88, h));
                float crownSpread = smoothstep(0.6, 0.94, h);
                float photo = uPhotographicStyle;
                float verticalProfile = mix(
                    0.56 + lowerShelf * 0.34 + towerColumn * 0.08 + crownSpread * 0.34,
                    0.48 + lowerShelf * 0.22 + towerColumn * 0.2 + crownSpread * 0.3,
                    photo
                );
                verticalProfile *= mix(1.0, 0.82, dissipating * smoothstep(0.12, 0.62, h));
                float hitLid = smoothstep(MODEL_LOCAL_TROPO - 1.5, MODEL_LOCAL_TROPO, naturalTop);
                float anvilMask = mix(
                    smoothstep(actualTop - 2.0, actualTop + 0.5, p.y),
                    smoothstep(actualTop - 1.05, actualTop + 0.35, p.y),
                    uPhotographicStyle
                );
                float anvilLife = hitLid * smoothstep(0.34, 0.82, cycle) * (1.0 - dissipating * 0.18);
                vec2 windAxis = windShearAxis(phase);
                float downwind = dot(baseLocal, windAxis);
                float crosswind = length(baseLocal - windAxis * downwind);
                float downwind01 = smoothstep(-maxR * 0.65, maxR * 2.6, downwind);
                float anvilLength = maxR * mix(1.0, mix(0.72, 2.45 + photo * 0.7, downwind01), uWindShear);
                float anvilWidth = maxR * mix(0.92, mix(0.74, 1.26 + photo * 0.36, downwind01), uWindShear);
                float anvilPlume = exp(-crosswind * crosswind / max(0.01, anvilWidth * anvilWidth))
                    * smoothstep(-maxR * 0.95, maxR * 3.25, downwind)
                    * (1.0 - smoothstep(anvilLength * 0.78, anvilLength * 1.18, downwind));
                float anvil = anvilLife * anvilMask * maxR * mix(1.48, 1.56, photo) * anvilScale * anvilPlume;
                float anvilSlab = max(abs(crosswind) - anvilWidth, max(-downwind - maxR * 0.95, downwind - anvilLength));
                float anvilThickness = mix(0.12, mix(0.68, 0.42, photo), anvilMask) * (0.4 + anvilLife * 0.6);
                float anvilVertical = abs(p.y - actualTop) - anvilThickness;
                float anvilShape = smax(anvilSlab - anvil * mix(0.36, 0.3, photo), anvilVertical, mix(0.52, 0.36, photo)) + (1.0 - anvilLife) * 4.0;
                float bodyTaper = mix(1.0, 0.58 + lowerShelf * 0.2 + towerColumn * 0.22 + crownSpread * 0.1, photo);
                float shape = smin(r - currentR * verticalProfile * bodyTaper, anvilShape, mix(0.92, 0.62, photo));
                float topDist = p.y - actualTop;

                float baseWave =
                    (noise(vec3(baseLocal * 0.26 + phase, uSeed * 0.17)) - 0.5) * 0.46 +
                    sin(baseLocal.x * 0.82 + phase * 1.7) * 0.12 +
                    cos(baseLocal.y * 0.7 - phase * 1.2) * 0.1;
                float undersideNoise = noise(vec3(baseLocal * 0.52 + phase * 0.7, uSeed * 0.31));
                float lowerPouch = smoothstep(maxR * 1.05, maxR * 0.18, r)
                    * max(0.0, undersideNoise - 0.28) * 0.48;
                float localBase = MODEL_LOCAL_BASE + baseWave - lowerPouch;
                float bottomDist = localBase - p.y;
                float verticalDist = smax(topDist, bottomDist, 0.72);

                float lowerDowndraft = smoothstep(0.04, 0.2, h) * (1.0 - smoothstep(0.58, 0.8, h));
                float coreVoid = (1.0 - smoothstep(maxR * 0.12, maxR * 0.72, r));
                float dryPocket = smoothstep(
                    0.36,
                    0.86,
                    noise(vec3(baseLocal * 0.34 + vec2(2.7, 8.4), phase + uTime * 0.035))
                );
                shape += dissipating * lowerDowndraft * coreVoid * dryPocket * maxR * 0.62;
                shape += dissipating * lowerDowndraft * (1.0 - mature * 0.35) * 0.18;
                return smax(shape, verticalDist, mix(1.2, 0.86, photo));
            }

            float getCell00(vec3 p, vec2 offset, float maxR, float phase, float maxH) {
                float r = length(p.xz - offset);
                float cycle = sin(uTime * 0.2 + phase) * 0.5 + 0.5;
                float currentR = maxR * (0.7 + 0.3 * cycle);
                float currentTop = mix(0.5, maxH, cycle);
                float anvil = smoothstep(currentTop - 1.5, currentTop + 0.5, p.y) * cycle * maxR * 1.5;
                float shape = r - currentR - anvil;
                float topDist = p.y - currentTop;
                vec2 baseLocal = p.xz - offset;
                float baseWave =
                    (noise(vec3(baseLocal * 0.24 + phase, uSeed * 0.17)) - 0.5) * 0.86 +
                    sin(baseLocal.x * 1.08 + phase * 1.7) * 0.18 +
                    cos(baseLocal.y * 0.82 - phase * 1.2) * 0.13;
                float undersideNoise = noise(vec3(baseLocal * 0.46 + phase * 0.7, uSeed * 0.31));
                float lowerPouch = smoothstep(maxR * 0.92, maxR * 0.12, r)
                    * max(0.0, undersideNoise - 0.28) * 0.72;
                float localBase = -1.5 + baseWave - max(0.0, lowerPouch);
                float bottomDist = localBase - p.y;
                float verticalDist = smax(topDist, bottomDist, 0.62);
                return smax(shape, verticalDist, 1.0);
            }

            float getCbCellKm(
                vec3 p,
                vec2 offset,
                float baseH,
                float topPotential,
                float baseR,
                float towerR,
                float anvilR,
                float phase,
                float maturity
            ) {
                float pulse = sin(uTime * 0.055 + phase) * 0.5 + 0.5;
                float topH = min(uTropopause, mix(baseH + 2.4, topPotential, maturity) + (pulse - 0.5) * 0.42);
                float height = max(1.0, topH - baseH);
                float h = clamp((p.y - baseH) / height, 0.0, 1.0);
                vec2 lean = vec2(sin(phase * 1.73), cos(phase * 1.17)) * mix(0.15, 0.82, h);
                vec2 local = p.xz - offset - lean;
                float twist = sin(p.y * 0.28 + phase) * 0.2;
                mat2 rot = mat2(cos(twist), -sin(twist), sin(twist), cos(twist));
                local = rot * local;

                float lower = smoothstep(0.0, 0.2, h) * (1.0 - smoothstep(0.46, 0.76, h));
                float tower = smoothstep(0.12, 0.42, h) * (1.0 - smoothstep(0.78, 0.98, h));
                float crown = smoothstep(0.68, 0.98, h);
                float cap = smoothstep(0.84, 1.0, h);
                float anvilSkew = mix(1.0, 0.68, cap);
                float towerDepthSkew = mix(0.96, 0.72, tower);
                float crownDepthSkew = mix(towerDepthSkew, 0.6, cap);
                vec2 shapedLocal = vec2(local.x * anvilSkew, local.y * crownDepthSkew);
                float r = length(shapedLocal);

                float radius = mix(baseR, towerR, smoothstep(0.06, 0.42, h));
                radius += lower * baseR * 0.18;
                radius += crown * anvilR * mix(0.32, 1.0, cap);
                radius += domainWarp(vec3(local.x * 0.32, p.y * 0.24, local.y * 0.32), phase) * mix(0.34, 1.08, tower + crown);
                radius *= 0.96 + pulse * 0.08;

                float baseWave =
                    (noise(vec3(local * 0.18 + phase, uSeed * 0.11)) - 0.5) * 0.72 +
                    sin(local.x * 0.42 + phase) * 0.18 +
                    cos(local.y * 0.36 - phase * 0.7) * 0.16;
                float basePouch = lower * max(0.0, noise(vec3(local * 0.38, phase + uSeed * 0.07)) - 0.3) * 0.72;
                float localBase = baseH + baseWave - basePouch;
                float coreDistance = length(local);
                float coreTopLift = (1.0 - smoothstep(towerR * 0.65, towerR * 2.25, coreDistance)) * 0.95 * maturity;
                float outerAnvilDrop = smoothstep(towerR * 1.25, towerR + anvilR + baseR * 0.72, coreDistance) * cap * 0.96;
                float topWave = (noise(vec3(local * 0.18 + phase * 0.4, uSeed * 0.19)) - 0.5) * mix(0.28, 0.96, crown);
                float localTop = min(uTropopause + 0.55, topH + topWave + coreTopLift - outerAnvilDrop);

                float shape = r - radius;
                float bottomDist = localBase - p.y;
                float topDist = p.y - localTop;
                float verticalDist = smax(topDist, bottomDist, 0.72);
                return smax(shape, verticalDist, 1.16);
            }

            float ellipsoidSdf(vec3 p, vec3 center, vec3 radius) {
                vec3 q = (p - center) / radius;
                return (length(q) - 1.0) * min(radius.x, min(radius.y, radius.z));
            }

            float cbLobe(vec3 p, vec3 center, vec3 radius, float phase, float roughness) {
                vec3 local = p - center;
                float d = ellipsoidSdf(p, center, radius);
                float broad = noise(vec3(local.x * 0.22 + phase, local.y * 0.28, local.z * 0.22 - phase));
                float scallop =
                    sin(local.x * 0.72 + phase) *
                    cos(local.y * 0.54 - phase * 0.6) *
                    sin(local.z * 0.62 + phase * 0.3);
                return d - (broad - 0.48) * roughness * 0.72 - scallop * roughness * 0.16;
            }

            float addLobe(float field, vec3 p, vec3 center, vec3 radius, float phase, float roughness, float blend) {
                return smin(field, cbLobe(p, center, radius, phase, roughness), blend);
            }

            float sphericalRecipe(float slot) {
                return hash(uSeed * 0.0137 + slot * 17.371);
            }

            float sphericalTrait(float slot, float onset, float full) {
                return smoothstep(onset, full, sphericalRecipe(slot));
            }

            float morphologyMask(float style) {
                return 1.0 - step(0.5, abs(float(CUMULONIMBUS_MORPHOLOGY_STYLE) - style));
            }

            float morphologyForcedTrait(float seeded, float style, float strength) {
                return clamp(max(seeded, morphologyMask(style) * strength), 0.0, 1.0);
            }

            vec3 sphericalRecipeAxis(float slot) {
                float angle = sphericalRecipe(slot) * 6.28318;
                float z = mix(-0.72, 0.72, sphericalRecipe(slot + 0.37));
                float xy = sqrt(max(0.001, 1.0 - z * z));
                return normalize(vec3(cos(angle) * xy, z, sin(angle) * xy));
            }

            vec3 sphericalCloudCenter() {
                return vec3(
                    (hash(uSeed * 0.017 + 11.7) - 0.5) * 0.44,
                    mix(0.24, 0.82, hash(uSeed * 0.019 + 23.1)),
                    (hash(uSeed * 0.013 + 31.4) - 0.5) * 0.36
                );
            }

            float sphericalCloudRadius() {
                return mix(2.38, 2.92, hash(uSeed * 0.021 + 41.6));
            }

            float sphericalHeightCoverage(vec3 modelP) {
                vec3 center = sphericalCloudCenter();
                float radius = sphericalCloudRadius();
                float h = clamp((modelP.y - (center.y - radius)) / max(0.001, radius * 2.0), 0.0, 1.0);
                float buoyantCore = mix(0.42, 0.58, hash(uSeed * 0.027 + 53.2));
                float falloff = mix(1.34, 1.72, hash(uSeed * 0.031 + 61.8));
                float coverage = 1.0 - pow(abs(h - buoyantCore) * falloff, 2.0);
                return clamp(coverage, 0.22, 1.0);
            }

            vec3 sphericalMorphLocal(vec3 local, float phase) {
                float radius = sphericalCloudRadius();
                float curl01 = clamp(uCloudCurl / 1.2, 0.0, 1.0);
                float flattenTrait = sphericalTrait(62.0, 0.58, 0.92);
                float skewTrait = sphericalTrait(63.0, 0.52, 0.9);
                float twistTrait = sphericalTrait(64.0, 0.62, 0.94);
                float baselineStyle = morphologyMask(1.0);
                float skewTwistStyle = morphologyMask(4.0);
                flattenTrait = morphologyForcedTrait(flattenTrait, 3.0, 1.0) * (1.0 - baselineStyle);
                skewTrait = morphologyForcedTrait(skewTrait, 4.0, 1.0) * (1.0 - baselineStyle);
                twistTrait = morphologyForcedTrait(twistTrait, 4.0, 1.0) * (1.0 - baselineStyle);
                float h = clamp(local.y / max(0.001, radius * 2.0) + 0.5, 0.0, 1.0);
                vec2 windAxis = windShearAxis(uSeed * 0.006 + 9.0);
                vec2 crossAxis = vec2(-windAxis.y, windAxis.x);

                float verticalScale = mix(1.52, mix(0.46, 0.74, sphericalRecipe(65.0)), flattenTrait);
                verticalScale *= mix(1.0, 1.16, skewTwistStyle);
                local.y /= max(0.32, verticalScale);
                float flatWideScale = mix(1.0, mix(1.28, 1.82, sphericalRecipe(66.0)), flattenTrait);
                float flatNarrowScale = mix(1.0, mix(1.12, 1.54, sphericalRecipe(68.0)), flattenTrait);
                flatWideScale *= mix(1.0, 1.56, skewTwistStyle);
                flatNarrowScale *= mix(1.0, 1.28, skewTwistStyle);
                float alongWind = dot(local.xz, windAxis);
                float crossWind = dot(local.xz, crossAxis);
                local.xz = windAxis * (alongWind / flatWideScale) + crossAxis * (crossWind * flatNarrowScale);

                float skewProfile = mix(-0.54, 0.68, sphericalRecipe(67.0));
                float skewDirection = mix(-1.0, 1.0, step(0.5, sphericalRecipe(67.0)));
                skewProfile = mix(skewProfile, skewDirection * mix(0.74, 1.04, sphericalRecipe(72.0)), skewTwistStyle);
                float skew = (h - 0.5) * radius * skewProfile
                    * max(uWindShear, mix(0.0, 0.74, skewTwistStyle))
                    * mix(1.0, 2.45, skewTwistStyle)
                    * skewTrait;
                local.xz -= windAxis * skew;

                float twistAmount = mix(-1.55, 1.55, sphericalRecipe(70.0)) * curl01 * mix(0.22, 1.0, twistTrait) * mix(1.0, 1.64, skewTwistStyle);
                float turbulentTwist = (noise(local * 0.21 + vec3(phase, uSeed * 0.005, -phase)) - 0.5) * 0.28 * curl01 * twistTrait * mix(1.0, 1.9, skewTwistStyle);
                float twist = (h - 0.5) * twistAmount + turbulentTwist;
                mat2 twistMatrix = mat2(cos(twist), -sin(twist), sin(twist), cos(twist));
                local.xz = twistMatrix * local.xz;

                float lean = (h - 0.5) * radius * mix(-0.14, 0.22, sphericalRecipe(71.0))
                    * max(uWindShear, mix(0.0, 0.68, skewTwistStyle))
                    * mix(0.35, 1.0, skewTrait)
                    * mix(1.0, 2.4, skewTwistStyle);
                local.xz -= windAxis * lean;
                return local;
            }

            float sphericalSupercontrastBoundary(vec3 local, float phase, float coverage) {
                float r = max(0.001, length(local));
                vec3 normal = local / r;
                float curl01 = clamp(uCloudCurl / 1.2, 0.0, 1.0);
                float macroTrait = sphericalTrait(60.0, 0.62, 0.95);
                float macroPulse = sphericalTrait(61.0, 0.78, 0.97);
                float baselineStyle = morphologyMask(1.0);
                macroTrait = morphologyForcedTrait(macroTrait, 2.0, 1.0);
                macroPulse = morphologyForcedTrait(macroPulse, 2.0, 0.82);
                float macroStrength = clamp(macroTrait * 1.38 + macroPulse * 0.62, 0.0, 1.75);
                macroStrength *= 1.0 - baselineStyle;
                vec3 stretchAxis = sphericalRecipeAxis(80.0);
                vec3 protrudeAxis = sphericalRecipeAxis(90.0);
                vec3 compressAxis = sphericalRecipeAxis(100.0);

                float stretchGate = sphericalTrait(83.0, 0.46, 0.86);
                float protrudeGate = sphericalTrait(93.0, 0.48, 0.88);
                float compressGate = sphericalTrait(103.0, 0.52, 0.9);
                stretchGate = morphologyForcedTrait(stretchGate, 2.0, 1.0) * (1.0 - baselineStyle);
                protrudeGate = morphologyForcedTrait(protrudeGate, 2.0, 1.0) * (1.0 - baselineStyle);
                compressGate = morphologyForcedTrait(compressGate, 2.0, 0.68) * (1.0 - baselineStyle);
                float stretchPower = mix(1.25, 3.4, sphericalRecipe(81.0));
                float stretch = pow(abs(dot(normal, stretchAxis)), stretchPower)
                    * mix(0.10, 0.74, sphericalRecipe(82.0)) * stretchGate;
                float protrude = pow(max(0.0, dot(normal, protrudeAxis)), mix(1.65, 5.8, sphericalRecipe(91.0)))
                    * mix(0.12, 0.86, sphericalRecipe(92.0)) * protrudeGate;
                float compress = pow(max(0.0, dot(normal, compressAxis)), mix(1.4, 4.8, sphericalRecipe(101.0)))
                    * mix(0.10, 0.68, sphericalRecipe(102.0)) * compressGate;

                float contour = fbmAdaptive(normal * mix(4.8, 8.8, sphericalRecipe(110.0)) + vec3(phase * 0.12, uSeed * 0.004, -phase * 0.07));
                float hardRidge = smoothstep(0.54, 0.60, contour) * (1.0 - smoothstep(0.76, 0.86, contour));
                float hardNotch = smoothstep(0.20, 0.30, contour) * (1.0 - smoothstep(0.42, 0.50, contour));
                float contourGate = sphericalTrait(112.0, 0.62, 0.94) * smoothstep(0.08, 0.42, macroStrength);
                contourGate = max(contourGate, morphologyMask(2.0) * smoothstep(0.08, 0.42, macroStrength) * 0.85);
                float profile = stretch + protrude - compress + (hardRidge - hardNotch * 0.72) * mix(0.04, 0.32, sphericalRecipe(111.0)) * contourGate;
                return profile * macroStrength * mix(0.58, 1.18, curl01) * mix(0.72, 1.14, coverage);
            }

            float sphericalRadialVariation(vec3 local, float phase) {
                float r = max(0.001, length(local));
                vec3 normal = local / r;
                float curl = clamp(uCloudCurl, 0.0, 1.2);
                float drift = uTime * mix(0.018, 0.046, curl / 1.2);
                vec3 broadDomain = normal * mix(1.52, 2.48, hash(uSeed * 0.033 + 73.0))
                    + vec3(phase * 0.13 + drift, uSeed * 0.003, -phase * 0.09);
                vec3 cellularDomain = normal * mix(3.1, 5.2, hash(uSeed * 0.039 + 83.4))
                    + vec3(-phase * 0.11, phase * 0.07 + drift, uSeed * 0.005);
                float broad = fbmAdaptive(broadDomain);
                float cellular = fbmAdaptive(cellularDomain + broad * 0.8);
                float scallop =
                    sin(normal.x * mix(8.0, 14.0, hash(uSeed * 0.043 + 97.0)) + phase) *
                    cos(normal.y * mix(7.0, 11.0, hash(uSeed * 0.047 + 103.0)) - phase * 0.6) *
                    sin(normal.z * mix(8.0, 13.0, hash(uSeed * 0.051 + 109.0)) + phase * 0.3);
                float baselineStyle = morphologyMask(1.0);
                return ((broad - 0.5) * 0.52 + (cellular - 0.47) * 0.36 + scallop * 0.075)
                    * mix(0.48, 0.92, curl / 1.2)
                    * mix(1.0, 0.32, baselineStyle);
            }

            float mapSphericalCloudMacro(vec3 p) {
                vec3 modelP = worldToModelSpace(p);
                vec3 center = sphericalCloudCenter();
                float radius = sphericalCloudRadius();
                float phase = uSeed * 0.017 + uTime * 0.018;
                vec3 local = sphericalMorphLocal(modelP - center, phase);
                float coverage = sphericalHeightCoverage(modelP);
                float radialVariation = sphericalRadialVariation(local, phase);
                float boundaryProfile = sphericalSupercontrastBoundary(local, phase, coverage);
                float buoyancyInflation = (coverage - 0.56) * mix(0.18, 0.34, clamp(uCloudCurl, 0.0, 1.2) / 1.2);
                return length(local) - (radius + radialVariation + boundaryProfile + buoyancyInflation);
            }

            float mapBuddingCloudMacro(vec3 p) {
                vec3 modelP = worldToModelSpace(p);
                vec3 center = sphericalCloudCenter();
                float radius = sphericalCloudRadius();
                float phase = uSeed * 0.017 + uTime * 0.018;
                vec2 windAxis2 = windShearAxis(uSeed * 0.006 + 9.0);
                vec3 budDir = normalize(vec3(
                    mix(0.82, 1.0, abs(windAxis2.x)) * sign(windAxis2.x + 0.001),
                    mix(0.1, 0.28, sphericalRecipe(150.0)),
                    windAxis2.y * 0.18
                ));

                vec3 mainLocal = sphericalMorphLocal(modelP - center, phase);
                float mainCoverage = sphericalHeightCoverage(modelP);
                float mainProfile = sphericalRadialVariation(mainLocal, phase) * 0.68
                    + sphericalSupercontrastBoundary(mainLocal, phase, mainCoverage) * 0.32;
                float main = length(mainLocal) - radius * 0.96 - mainProfile;

                vec3 budCenter = center + budDir * radius * mix(0.72, 0.86, sphericalRecipe(151.0));
                budCenter.y += radius * mix(-0.02, 0.16, sphericalRecipe(152.0));
                float budRadius = radius * mix(0.42, 0.58, sphericalRecipe(153.0));
                vec3 budLocal = sphericalMorphLocal(modelP - budCenter, phase + 1.7);
                float budProfile = sphericalRadialVariation(budLocal * 1.18, phase + 1.7) * 0.38
                    + sphericalSupercontrastBoundary(budLocal, phase + 1.7, 0.74) * 0.18;
                float bud = length(budLocal) - budRadius - budProfile;

                vec3 neckCenter = center + budDir * radius * 0.66;
                neckCenter.y += radius * 0.04;
                float neck = length(modelP - neckCenter) - radius * mix(0.34, 0.48, sphericalRecipe(154.0));
                return smin(smin(main, bud, radius * 0.34), neck, radius * 0.24);
            }

            float mapOriginalGiantCumulonimbusMacro(vec3 p) {
                float widthStretch = mix(1.0, 1.12, smoothstep(0.5, 2.0, uAspect));
                vec3 layoutP = p;
                layoutP.x /= widthStretch;
                vec3 modelP = worldToModelSpace(layoutP);
                float photo = uPhotographicStyle;
                float seedPhase = uSeed * 0.0027;

                float tower = getCell01(
                    modelP,
                    vec2(0.0, 0.0),
                    mix(3.55, 2.28, photo),
                    seedPhase,
                    5.35,
                    0.64,
                    1.54,
                    0.0,
                    mix(1.26, 0.94, photo)
                );
                float feederLeft = getCell01(
                    modelP,
                    vec2(-2.04, -0.64),
                    mix(2.72, 1.82, photo),
                    seedPhase + 2.1,
                    mix(4.25, 3.58, photo),
                    0.78,
                    1.16,
                    0.16,
                    mix(0.88, 0.56, photo)
                );
                float feederRight = getCell01(
                    modelP,
                    vec2(1.82, 0.56),
                    mix(2.48, 1.68, photo),
                    seedPhase + 4.2,
                    mix(4.7, 3.82, photo),
                    0.84,
                    1.92,
                    0.12,
                    mix(1.08, 0.7, photo)
                );

                float macro = smin(tower, feederLeft, mix(1.38, 0.96, photo));
                macro = smin(macro, feederRight, mix(1.24, 0.88, photo));
                float capLimiter = modelP.y - (MODEL_LOCAL_TROPO + 0.32 + (noise(vec3(modelP.xz * 0.18, uSeed * 0.23)) - 0.5) * 0.18);
                float groundLimiter = (MODEL_LOCAL_BASE - 0.42) - modelP.y;
                return smax(smax(macro, capLimiter, 0.2), groundLimiter, 0.26);
            }

            float mapMobileCumulusMacro(vec3 p) {
                float widthStretch = mix(1.0, 1.08, smoothstep(0.5, 2.0, uAspect));
                vec3 layoutP = p;
                layoutP.x /= widthStretch;
                vec3 modelP = worldToModelSpace(layoutP);
                vec3 cloudP = modelP;
                cloudP.x *= 0.82;
                cloudP.z *= 0.90;
                cloudP.y = (modelP.y + 0.62) * 0.88 - 0.62;
                float phase = uSeed * 0.017 + uTime * 0.018;

                float macro = ellipsoidSdf(cloudP, vec3(0.0, -1.34, 0.0), vec3(2.7, 0.68, 1.36));
                macro = addLobe(macro, cloudP, vec3(-1.52, -1.03, 0.08), vec3(1.0, 0.74, 0.86), phase + 0.4, 0.28, 0.46);
                macro = addLobe(macro, cloudP, vec3(-0.56, -0.58, -0.06), vec3(1.0, 0.92, 0.88), phase + 1.7, 0.26, 0.44);
                macro = addLobe(macro, cloudP, vec3(0.42, -0.46, 0.02), vec3(1.14, 0.98, 0.94), phase + 2.9, 0.26, 0.46);
                macro = addLobe(macro, cloudP, vec3(1.42, -1.0, -0.08), vec3(0.92, 0.72, 0.78), phase + 4.2, 0.28, 0.42);
                macro = addLobe(macro, cloudP, vec3(-0.18, 0.22, 0.02), vec3(0.9, 0.72, 0.76), phase + 5.4, 0.22, 0.38);
                macro = addLobe(macro, cloudP, vec3(0.74, 0.02, -0.04), vec3(0.82, 0.62, 0.7), phase + 6.2, 0.2, 0.34);

                if (uSystemCount > 1.5) {
                    vec3 secondP = cloudP - vec3(3.25, 0.08, -0.34);
                    float second = ellipsoidSdf(secondP, vec3(0.0, -1.22, 0.0), vec3(1.78, 0.58, 1.02));
                    second = addLobe(second, secondP, vec3(-0.72, -0.86, 0.02), vec3(0.72, 0.58, 0.66), phase + 7.1, 0.26, 0.34);
                    second = addLobe(second, secondP, vec3(0.34, -0.42, -0.02), vec3(0.82, 0.72, 0.70), phase + 8.3, 0.24, 0.36);
                    second = addLobe(second, secondP, vec3(0.06, 0.08, 0.04), vec3(0.66, 0.54, 0.58), phase + 9.2, 0.2, 0.30);
                    macro = smin(macro, second, 0.72);
                }

                float baseWave =
                    (noise(vec3(cloudP.xz * 0.42 + phase, uSeed * 0.17)) - 0.5) * 0.36 +
                    sin(cloudP.x * 0.78 + phase) * 0.08;
                float bottomLimiter = (MODEL_LOCAL_BASE + 0.64 + baseWave) - cloudP.y;
                float topLimiter = cloudP.y - (MODEL_LOCAL_BASE + 3.92 + baseWave * 0.08);
                float sideLimiter = length(cloudP.xz * vec2(0.52, 0.86)) - 2.72;
                return smax(smax(smax(macro, bottomLimiter, 0.44), topLimiter, 0.34), sideLimiter, 0.54);
            }

            float mapCloudMacro(vec3 p) {
                float macro = 0.0;
                if (uMobileCumulusMode > 0.5) {
                    macro = mapMobileCumulusMacro(p);
                } else {
#if CUMULONIMBUS_SINGLE_CLOUD
#if CUMULONIMBUS_MORPHOLOGY_STYLE == 7
                    macro = mapOriginalGiantCumulonimbusMacro(p);
#elif CUMULONIMBUS_MORPHOLOGY_STYLE == 6
                    macro = mapBuddingCloudMacro(p);
#else
                    macro = mapSphericalCloudMacro(p);
#endif
#else

                    float widthStretch = mix(1.0, 1.2, smoothstep(0.5, 2.0, uAspect));
                    vec3 layoutP = p;
                    layoutP.x /= widthStretch;

                    vec3 modelP = worldToModelSpace(layoutP);
                    float photo = uPhotographicStyle;
                    float layoutMode = mod(floor(abs(uSeed)), 3.0);
                    float triangleLayout = step(0.5, layoutMode) * (1.0 - step(1.5, layoutMode));
                    float clusterLayout = step(1.5, layoutMode);
                    vec2 c2Offset = mix(vec2(3.75, -1.35), vec2(-2.45, -1.28), triangleLayout);
                    c2Offset = mix(c2Offset, vec2(1.1, -0.58), clusterLayout);
                    vec2 c3Offset = mix(vec2(-3.2, 1.55), vec2(2.5, -1.12), triangleLayout);
                    c3Offset = mix(c3Offset, vec2(-0.86, 0.78), clusterLayout);
                    float c2Blend = mix(mix(1.35, 0.92, photo), mix(1.58, 1.06, photo), triangleLayout);
                    c2Blend = mix(c2Blend, mix(1.8, 1.18, photo), clusterLayout);
                    float c3Blend = mix(mix(1.45, 0.96, photo), mix(1.58, 1.06, photo), triangleLayout);
                    c3Blend = mix(c3Blend, mix(1.82, 1.2, photo), clusterLayout);

                    float c1 = getCell01(modelP, vec2(0.0, 0.0), mix(3.2, 1.95, photo), 0.0, 5.0, 1.0, 0.0, 0.02, 1.0);
                    macro = c1;
                    if (uSystemCount >= 1.5) {
                        float c2 = getCell01(modelP, c2Offset, mix(2.8, 1.65, photo), 2.0, mix(3.75, 3.35, photo), 0.82, 1.12, 0.28, mix(0.8, 0.48, photo));
                        macro = smin(macro, c2, c2Blend);
                    }
                    if (uSystemCount >= 2.5) {
                        float c3 = getCell01(modelP, c3Offset, mix(2.65, 1.75, photo), 4.0, 4.55, 1.26, 4.85, 0.1, mix(1.14, 0.74, photo));
                        macro = smin(macro, c3, c3Blend);
                    }
                    for (int i = 3; i < 10; i++) {
                        float fi = float(i);
                        if (uSystemCount < fi + 0.5) {
                            continue;
                        }
                        float phase = fi * 1.73 + 0.9;
                        float angle = fi * 2.399963 + uSeed * 0.00037;
                        float ring = mix(4.2, 8.6, hash(fi * 17.13 + uSeed * 0.004));
                        vec2 jitter = vec2(
                            hash(fi * 29.7 + uSeed * 0.011) - 0.5,
                            hash(fi * 41.1 + uSeed * 0.013) - 0.5
                        ) * 1.65;
                        vec2 offset = vec2(cos(angle), sin(angle)) * ring + jitter;
                        float maxR = mix(1.55, 2.65, hash(fi * 53.9 + uSeed * 0.007));
                        float maxH = mix(3.15, 5.0, hash(fi * 67.1 + uSeed * 0.009));
                        float speedScale = mix(0.72, 1.32, hash(fi * 71.3 + uSeed * 0.003));
                        float ageOffset = hash(fi * 83.5 + uSeed * 0.005) * 6.28318;
                        float earlyDecay = hash(fi * 97.7 + uSeed * 0.006) * 0.34;
                        float anvilScale = mix(0.58, 1.12, hash(fi * 101.9 + uSeed * 0.008));
                        float cell = getCell01(modelP, offset, maxR, phase, maxH, speedScale, ageOffset, earlyDecay, anvilScale);
                        macro = smin(macro, cell, mix(1.08, 0.82, photo));
                    }
                    float capLimiter = modelP.y - (MODEL_LOCAL_TROPO + 0.2 + (noise(vec3(modelP.xz * 0.18, uSeed * 0.23)) - 0.5) * 0.14);
                    float groundLimiter = (MODEL_LOCAL_BASE - 0.35) - modelP.y;
                    macro = smax(smax(macro, capLimiter, 0.18), groundLimiter, 0.22);
#endif
                }
                return macro;
            }

            float mapCloudFromMacro(vec3 p, float macro) {
                if (macro >= 1.0) {
                    return 0.0;
                }

                vec3 q = worldToModelSpace(p);
                if (uMobileCumulusMode > 0.5) {
                    q.x *= 0.82;
                    q.z *= 0.90;
                    q.y = (q.y + 0.62) * 0.88 - 0.62;
                }

                vec3 baseQ = q;
                q.y -= uTime * 0.25;
                q.x += uTime * 0.05;
                float heightRange = max(0.1, uTropopause - MODEL_BASE_KM);
                float height01 = clamp((p.y - MODEL_BASE_KM) / heightRange, 0.0, 1.0);

                float d = -macro;
                if (d > -1.0) {
                    float stormAngle = uTime * 0.075 + uSeed * 0.00107;
                    float stormCycle = sin(stormAngle) * 0.5 + 0.5;
                    float stormFalling = smoothstep(0.44, 0.9, -cos(stormAngle) * 0.5 + 0.5);
                    float dissipating = stormFalling * smoothstep(0.46, 0.92, stormCycle);
                    float anvilBand = smoothstep(0.72, 0.94, height01);
                    float freezing01 = clamp((uFreezingLevel - MODEL_BASE_KM) / heightRange, 0.0, 1.0);
                    float mixedPhaseBand = smoothstep(freezing01 - 0.08, freezing01 + 0.16, height01)
                        * (1.0 - smoothstep(0.72, 0.9, height01));
                    float iceFactor = iceFactorAtHeight(p.y);
                    float towerErosionBand = smoothstep(0.08, 0.24, height01) * (1.0 - smoothstep(0.58, 0.82, height01));
                    if (uMobileCumulusMode > 0.5) {
                        dissipating = 0.0;
                        anvilBand = 0.0;
                        mixedPhaseBand *= 0.35;
                        iceFactor = 0.0;
                        towerErosionBand *= 0.28;
                    }
                    float downdraftColumn = smoothstep(
                        0.38,
                        0.88,
                        noise(vec3(q.xz * 0.28 + vec2(uTime * 0.018, -uTime * 0.01), q.y * 0.22 + uSeed * 0.09))
                    );
                    float settlingAnvil = smoothstep(
                        0.44,
                        0.9,
                        noise(vec3(q.x * 0.18 - uTime * 0.015, q.z * 0.22 + uSeed * 0.05, q.y * 0.11))
                    );
                    float photo = uPhotographicStyle;
                    float mobileFullness = step(0.5, uMobileCumulusMode);
                    float carving = noise(q * 0.4 + uTime * 0.1) * mix(1.5, 1.28, photo) * mix(1.0, 0.72, mobileFullness);
                    float details = fbmAdaptive(q * 1.2) * 1.0;
                    float microBillow = fbmAdaptive(vec3(q.x * 1.9, q.y * 2.05, q.z * 1.9) + vec3(uSeed * 0.017, 1.9, uTime * 0.04));
                    float broadBillow = fbmAdaptive(vec3(q.x * 0.92, q.y * 1.24, q.z * 0.92) + vec3(uSeed * 0.023, 6.1, -uTime * 0.02));
#if CUMULONIMBUS_SINGLE_CLOUD
#if CUMULONIMBUS_MORPHOLOGY_STYLE == 7
                    float sphereCoverage = 0.74;
                    float coverageErosion = broadBillow;
                    float surfaceTrait = 0.0;
                    float silkTrait = 0.0;
                    float tearTrait = 0.0;
                    float windTear = 0.0;
                    float fuzzyShell = smoothstep(-0.36, 0.82, macro) * (1.0 - smoothstep(0.84, 1.0, macro));
                    float silkEdge = 0.0;
                    float leeEdge = 0.0;
                    float tearNoise = 0.0;
                    carving *= 0.78;
                    details *= 0.95;
#else
                    float sphereCoverage = sphericalHeightCoverage(baseQ);
                    float baselineStyle = morphologyMask(1.0);
                    float tearSilkStyle = morphologyMask(5.0);
                    float coverageErosion = fbmAdaptive(vec3(
                        baseQ.x * 0.42 + uTime * 0.036,
                        baseQ.y * 0.34 + uSeed * 0.011,
                        baseQ.z * 0.42 - uTime * 0.018
                    ));
                    float spherePhase = uSeed * 0.017 + uTime * 0.018;
                    vec3 sphereLocal = sphericalMorphLocal(baseQ - sphericalCloudCenter(), spherePhase);
                    float sphereRadius = sphericalCloudRadius();
                    vec2 sphereWindAxis = windShearAxis(uSeed * 0.006 + 9.0);
                    vec2 sphereCrossAxis = vec2(-sphereWindAxis.y, sphereWindAxis.x);
                    float sphereDownwind = dot(sphereLocal.xz, sphereWindAxis) / max(0.001, sphereRadius);
                    float sphereCrosswind = dot(sphereLocal.xz, sphereCrossAxis) / max(0.001, sphereRadius);
                    float fuzzyShell = smoothstep(-0.36, 0.82, macro) * (1.0 - smoothstep(0.84, 1.0, macro));
                    float leeEdge = smoothstep(0.04, 0.96, sphereDownwind) * fuzzyShell;
                    float fiberNoise = noise(vec3(
                        sphereDownwind * mix(3.4, 5.8, sphericalRecipe(120.0)) + uTime * 0.055,
                        sphereCrosswind * mix(7.0, 13.0, sphericalRecipe(121.0)),
                        baseQ.y * mix(1.2, 2.4, sphericalRecipe(122.0)) + uSeed * 0.018
                    ));
                    float silkEdge = smoothstep(mix(0.50, 0.62, sphericalRecipe(123.0)), 0.88, fiberNoise) * fuzzyShell;
                    float tearNoise = fbmAdaptive(vec3(
                        sphereDownwind * 2.8 + uTime * 0.04,
                        sphereCrosswind * 3.7 + uSeed * 0.009,
                        baseQ.y * 1.1 - uTime * 0.026
                    ));
                    float surfaceTrait = sphericalTrait(128.0, 0.68, 0.96);
                    float silkTrait = sphericalTrait(129.0, 0.84, 0.99);
                    float tearTrait = sphericalTrait(130.0, 0.84, 0.99);
                    surfaceTrait = morphologyForcedTrait(surfaceTrait, 5.0, 0.92) * (1.0 - baselineStyle);
                    silkTrait = morphologyForcedTrait(silkTrait, 5.0, 1.0) * (1.0 - baselineStyle);
                    tearTrait = morphologyForcedTrait(tearTrait, 5.0, 1.0) * (1.0 - baselineStyle);
                    float windTear = leeEdge * smoothstep(mix(0.40, 0.60, sphericalRecipe(124.0)), 0.86, tearNoise)
                        * mix(0.45, 1.28, uWindShear) * mix(1.0, 1.34, tearSilkStyle) * tearTrait;
                    details *= mix(0.95, 1.08 + clamp(uCloudCurl, 0.0, 1.2) * 0.1, surfaceTrait);
#endif
#endif
                    vec2 iceAxis = windShearAxis(uSeed * 0.003 + 4.0);
                    float iceFiber = noise(vec3(
                        dot(q.xz, iceAxis) * 0.18 + uTime * 0.026,
                        q.y * 1.75,
                        dot(q.xz, vec2(-iceAxis.y, iceAxis.x)) * 0.56 + uSeed * 0.011
                    ));
                    float towerBand = smoothstep(0.12, 0.58, height01) * (1.0 - smoothstep(0.78, 1.02, height01));
                    float surfaceShell = smoothstep(-0.7, 0.16, macro) * (1.0 - smoothstep(0.18, 0.82, macro));
                    d += details - carving * 0.8;
#if CUMULONIMBUS_SINGLE_CLOUD
                    float coreFullness = 1.0 - smoothstep(-0.48, 0.22, macro);
                    d += coreFullness * mix(0.18, 0.08, surfaceTrait);
                    d *= mix(0.88, 1.12, sphereCoverage);
                    d += (sphereCoverage - 0.5) * 0.14;
                    d += surfaceShell * (coverageErosion - 0.5) * mix(0.04, 0.34, surfaceTrait) * mix(0.74, 1.2, clamp(uCloudCurl, 0.0, 1.2) / 1.2);
                    d -= surfaceShell * smoothstep(0.70, 0.94, coverageErosion) * mix(0.02, 0.12, surfaceTrait);
                    d -= surfaceShell * windTear * mix(0.24, 0.64, sphericalRecipe(125.0));
                    d += fuzzyShell * silkEdge * silkTrait * mix(0.08, 0.26, sphericalRecipe(126.0)) * (1.0 - windTear * 0.5);
                    d += leeEdge * tearTrait * (1.0 - smoothstep(0.52, 0.92, tearNoise)) * mix(0.03, 0.14, sphericalRecipe(127.0));
#endif
                    d += mobileFullness * smoothstep(-0.62, 0.12, macro) * (1.0 - smoothstep(0.20, 0.74, macro)) * 0.18;
                    d += surfaceShell * towerBand * (microBillow - 0.46) * mix(0.42, 0.74, photo);
                    d += surfaceShell * (1.0 - anvilBand) * (broadBillow - 0.44) * mix(0.0, 0.42, photo);
                    d -= surfaceShell * towerBand * smoothstep(0.58, 0.94, broadBillow) * mix(0.0, 0.18, photo);
                    d += mixedPhaseBand * surfaceShell * 0.14;
                    d += anvilBand * iceFactor * (iceFiber - 0.42) * 0.38;
                    d -= anvilBand * iceFactor * smoothstep(0.72, 0.98, iceFiber) * 0.12;
                    float edgeBand = smoothstep(-0.72, 0.34, macro);
                    float edgeCuts = noise(vec3(q.x * 0.82 + uSeed * 0.019, q.y * 0.92, q.z * 0.82 - uTime * 0.03));
                    d -= edgeBand * smoothstep(0.5, 0.86, edgeCuts) * mix(0.24, 0.38, photo) * mix(1.0, 0.42, mobileFullness);
                    float raggedFloor =
                        MODEL_LOCAL_BASE +
                        (noise(vec3(baseQ.xz * 0.58 + uSeed * 0.13, uSeed * 0.29)) - 0.5) * 0.68 +
                        sin(baseQ.x * 0.72 + uSeed * 0.04) * 0.12;
                    float undersideBand = 1.0 - smoothstep(raggedFloor - 0.12, raggedFloor + 0.52, baseQ.y);
                    float undersidePocket = smoothstep(
                        0.32,
                        0.88,
                        noise(vec3(baseQ.xz * 1.18 + vec2(3.4, 7.1), uSeed * 0.41))
                    );
                    d -= undersideBand * undersidePocket * mix(0.42, 0.18, mobileFullness);
                    d -= dissipating * towerErosionBand * downdraftColumn * 0.72;
                    d -= dissipating * undersideBand * 0.22;
                    d += dissipating * anvilBand * (1.0 - settlingAnvil * 0.68) * 0.12;
                    d -= dissipating * anvilBand * settlingAnvil * 0.16;
                }
                return clamp(d, 0.0, 1.0);
            }

            float mapCloud(vec3 p) {
                return mapCloudFromMacro(p, mapCloudMacro(p));
            }

            float phaseHG(float cosTheta, float g) {
                float g2 = g * g;
                return (1.0 - g2) / (4.0 * 3.14159 * pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5));
            }

            vec3 ACESFilm(vec3 x) {
                float a = 2.51; float b = 0.03; float c = 2.43; float d = 0.59; float e = 0.14;
                return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
            }

            vec3 nitsToPq(vec3 nits) {
                const float m1 = 2610.0 / 16384.0;
                const float m2 = 2523.0 / 32.0;
                const float c1 = 3424.0 / 4096.0;
                const float c2 = 2413.0 / 128.0;
                const float c3 = 2392.0 / 128.0;
                vec3 normalized = clamp(nits / 10000.0, 0.0, 1.0);
                vec3 powered = pow(normalized, vec3(m1));
                return clamp(pow((c1 + c2 * powered) / (1.0 + c3 * powered), vec3(m2)), 0.0, 1.0);
            }

            float sceneLinearToDisplayNits(float value, float highlightPeakNits) {
                const float diffuseWhiteNits = 203.0;
                float linear = max(0.0, value);
                if (linear <= 1.0) {
                    return linear * diffuseWhiteNits;
                }
                float highlight = 1.0 - exp(-(linear - 1.0) * 1.15);
                return diffuseWhiteNits + highlight * (max(diffuseWhiteNits, highlightPeakNits) - diffuseWhiteNits);
            }

            vec3 hdr10ReferencePreview(vec3 sceneLinear, float densityAcc, float sunHeight01, float sunForward) {
                const float clearSkyLowNits = 1000.0;
                const float clearSkyHighNits = 20000.0;
                const float sunlitCloudNits = 12000.0;
                float naturalSkyNits = mix(clearSkyLowNits, clearSkyHighNits, sunHeight01);
                float cloudForwardScatter = smoothstep(0.12, 0.92, sunForward);
                float naturalCloudNits = mix(650.0, sunlitCloudNits, sunHeight01) * mix(0.76, 1.22, cloudForwardScatter);
                float naturalSceneNits = mix(naturalSkyNits, naturalCloudNits, densityAcc);
                float highlightPeakNits = 203.0 + (uHdrReferencePeakNits - 203.0) * (1.0 - exp(-naturalSceneNits / 7200.0));
                vec3 mappedNits = vec3(
                    sceneLinearToDisplayNits(sceneLinear.r, highlightPeakNits),
                    sceneLinearToDisplayNits(sceneLinear.g, highlightPeakNits),
                    sceneLinearToDisplayNits(sceneLinear.b, highlightPeakNits)
                );
                vec3 pqCode = nitsToPq(mappedNits);
                vec3 daylightBalance = mix(vec3(0.92, 0.96, 1.04), vec3(1.06, 1.02, 0.94), sunHeight01 * (0.35 + cloudForwardScatter * 0.45));
                return clamp(pow(pqCode, vec3(1.0 / 1.18)) * daylightBalance, 0.0, 1.0);
            }

            float interleavedGradientNoise(vec2 pixel) {
                return fract(52.9829189 * fract(0.06711056 * pixel.x + 0.00583715 * pixel.y));
            }

            vec3 applyDisplayDither(vec3 displayColor) {
                if (uDitherEnabled < 0.5) {
                    return displayColor;
                }
                float dither = interleavedGradientNoise(gl_FragCoord.xy) - 0.5;
                return clamp(displayColor + vec3(dither / 255.0), 0.0, 1.0);
            }

            vec3 gridOverlay(vec3 col, vec3 ro, vec3 rd) {
                if (uShowGrid < 0.5) return col;

                if (abs(rd.y) > 0.001) {
                    float tG = (0.0 - ro.y) / rd.y;
                    if (tG > 0.0 && tG < 160.0) {
                        vec3 pG = ro + rd * tG;
                        if (length(pG.xz) <= 15.0) {
                            float radius = length(pG.xz);
                            vec2 oneKmCell = abs(fract(pG.xz + 0.5) - 0.5);
                            vec2 fiveKmCell = abs(fract(pG.xz / 5.0 + 0.5) - 0.5) * 5.0;
                            float oneKmDist = min(oneKmCell.x, oneKmCell.y);
                            float fiveKmDist = min(fiveKmCell.x, fiveKmCell.y);
                            float oneKmAa = max(fwidth(oneKmDist), 0.002);
                            float fiveKmAa = max(fwidth(fiveKmDist), 0.002);
                            float ringDist = abs(fract(radius / 5.0 + 0.5) - 0.5) * 5.0;
                            float ringAa = max(fwidth(ringDist), 0.002);
                            float minor = 1.0 - smoothstep(0.035, 0.035 + oneKmAa, oneKmDist);
                            float major = 1.0 - smoothstep(0.065, 0.065 + fiveKmAa, fiveKmDist);
                            float ring = (1.0 - smoothstep(0.07, 0.07 + ringAa, ringDist)) * smoothstep(0.8, 1.4, radius);
                            float axis = max(
                                1.0 - smoothstep(0.09, 0.09 + max(fwidth(pG.x), 0.002), abs(pG.x)),
                                1.0 - smoothstep(0.09, 0.09 + max(fwidth(pG.z), 0.002), abs(pG.z))
                            );
                            float line = max(minor * 0.38, max(major * 0.72, max(ring * 0.62, axis)));
                            vec3 gridCol = mix(vec3(0.03, 0.22, 0.46), vec3(0.08, 0.48, 0.92), max(major, axis));
                            col = mix(col, gridCol, line * exp(-tG * 0.012));
                        }
                    }
                }

                float aCyl = dot(rd.xz, rd.xz);
                float bCyl = 2.0 * dot(ro.xz, rd.xz);
                float cCyl = dot(ro.xz, ro.xz) - 0.018;
                float disc = bCyl * bCyl - 4.0 * aCyl * cCyl;
                if (disc > 0.0 && aCyl > 0.0001) {
                    float tR = (-bCyl - sqrt(disc)) / (2.0 * aCyl);
                    if (tR > 0.0 && tR < 160.0) {
                        vec3 pR = ro + rd * tR;
                        if (pR.y >= 0.0 && pR.y <= uTropopause + 1.0) {
                            float band = mod(floor(pR.y), 2.0);
                            vec3 rCol = (band < 0.5) ? vec3(0.86, 0.08, 0.08) : vec3(0.92, 0.92, 0.88);
                            float rim = smoothstep(0.2, 0.0, length(pR.xz));
                            col = mix(col, rCol * (0.35 + 0.65 * rim), 0.95);
                        }
                    }
                }
                return col;
            }

            vec3 surfaceOverlay(vec3 col, vec3 ro, vec3 rd, vec3 lightDir, vec3 ambientColor) {
                if (uSurfaceVisible < 0.5 || abs(rd.y) <= 0.001) return col;
                float tS = (0.0 - ro.y) / rd.y;
                if (tS <= 0.0 || tS > 220.0) return col;

                vec3 pS = ro + rd * tS;
                float rangeFade = 1.0 - smoothstep(28.0, 92.0, length(pS.xz));
                if (rangeFade <= 0.0) return col;

                float terrainNoise = fbm(vec3(pS.xz * 0.075, uSeed * 0.03));
                float ridge = smoothstep(0.42, 0.84, terrainNoise);
                vec3 normal = normalize(vec3(
                    noise(vec3(pS.xz * 0.12 + vec2(1.7, 0.0), uSeed * 0.04)) - 0.5,
                    1.45,
                    noise(vec3(pS.xz * 0.12 + vec2(0.0, 3.1), uSeed * 0.04)) - 0.5
                ));
                float diffuse = clamp(dot(normal, lightDir) * 0.5 + 0.5, 0.0, 1.0);
                float horizonFade = smoothstep(0.0, 0.12, -rd.y);

                vec3 oceanBase = mix(vec3(0.012, 0.11, 0.19), vec3(0.08, 0.34, 0.48), ridge);
                float wave = sin(pS.x * 0.38 + uTime * 0.35) * sin(pS.z * 0.31 - uTime * 0.22);
                float glint = pow(max(0.0, dot(reflect(rd, vec3(0.0, 1.0, 0.0)), lightDir)), 52.0);
                float horizonLine = 1.0 - smoothstep(0.006, 0.05, abs(pS.y));
                vec3 ocean = oceanBase
                    + vec3(0.05, 0.1, 0.12) * wave * 0.12
                    + vec3(0.9, 0.82, 0.55) * glint * 0.42
                    + vec3(0.12, 0.28, 0.34) * horizonLine;

                vec3 hillLow = vec3(0.12, 0.16, 0.09);
                vec3 hillHigh = vec3(0.34, 0.30, 0.18);
                vec3 hills = mix(hillLow, hillHigh, ridge) * (0.45 + diffuse * 0.62) + ambientColor * 0.24;
                vec3 surfaceColor = mix(ocean, hills, step(0.5, uSurfaceMode));
                float surfaceAlpha = rangeFade * horizonFade * mix(0.72, 0.98, smoothstep(-0.18, -0.02, rd.y));
                return mix(col, surfaceColor, surfaceAlpha);
            }

            void main() {
                vec2 res = max(uResolution, vec2(1.0));
                vec2 uv = (gl_FragCoord.xy - 0.5 * res.xy) / res.y;
                vec3 ro = uCameraPos;
                vec3 target = uCameraTarget;
                vec3 forward = normalize(target - ro);
                vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
                vec3 up = cross(right, forward);
                vec3 rd;

                if (uIsOrtho > 0.5) {
                    ro = ro + right * uv.x * uOrthoSize + up * uv.y * uOrthoSize * uOrthoVerticalScale;
                    rd = forward;
                } else {
                    float fovScale = mix(1.0, 1.2, smoothstep(0.5, 2.0, uAspect));
                    rd = normalize(forward * fovScale + uv.x * right + uv.y * up);
                }

                float sunElevationRad = radians(uSunElevation);
                float sunViewerAngleRad = radians(uSunViewerAngle);
                vec3 viewerForwardFlat = vec3(forward.x, 0.0, forward.z);
                vec3 viewerForwardXZ = dot(viewerForwardFlat, viewerForwardFlat) < 0.0001
                    ? vec3(0.0, 0.0, -1.0)
                    : normalize(viewerForwardFlat);
                vec3 viewerRightFlat = vec3(right.x, 0.0, right.z);
                vec3 viewerRightXZ = dot(viewerRightFlat, viewerRightFlat) < 0.0001
                    ? vec3(1.0, 0.0, 0.0)
                    : normalize(viewerRightFlat);
                vec3 sunAzimuthDir = normalize(viewerForwardXZ * cos(sunViewerAngleRad) + viewerRightXZ * sin(sunViewerAngleRad));
                vec3 daylightDir = normalize(sunAzimuthDir * cos(sunElevationRad) + vec3(0.0, sin(sunElevationRad), 0.0));
                vec3 goldenDir = normalize(vec3(-0.92, 0.34, 0.2));
                vec3 backlitDir = normalize(vec3(0.18, 0.52, 0.86));
                vec3 lightDir = normalize(mix(daylightDir, goldenDir, step(0.5, uLightPreset) * (1.0 - step(1.5, uLightPreset))));
                lightDir = normalize(mix(lightDir, backlitDir, step(1.5, uLightPreset)));
                float sunSin = sin(sunElevationRad);
                float forcedMoonNight = step(2.5, uSkyMode) * (1.0 - step(3.5, uSkyMode));
                float sunHeight01 = smoothstep(-0.08, 0.70, sunSin);
                float night01 = max(1.0 - smoothstep(-0.26, -0.02, sunSin), forcedMoonNight);
                vec3 lowSunLight = mix(vec3(1.0, 0.16, 0.055), vec3(1.0, 0.54, 0.24), smoothstep(-0.08, 0.14, sunSin));
                vec3 highSunLight = vec3(1.0, 0.93, 0.82);
                vec3 solarLightColor = mix(lowSunLight, highSunLight, sunHeight01);
                solarLightColor = mix(solarLightColor, vec3(1.0, 0.78, 0.52), step(0.5, uLightPreset) * (1.0 - step(1.5, uLightPreset)));
                solarLightColor = mix(solarLightColor, vec3(0.95, 0.9, 1.0), step(1.5, uLightPreset));
                vec3 moonDir = normalize(vec3(-0.34, 0.55, 0.76));
                lightDir = normalize(mix(lightDir, moonDir, night01 * 0.86));
                vec3 moonLightColor = vec3(0.038, 0.056, 0.13) * night01 * mix(0.50, 0.64, uPhotographicStyle);
                vec3 lightColor = solarLightColor * uSunIntensity * (1.0 - night01 * 0.92) + moonLightColor;
                vec3 dayAmbient = mix(vec3(0.065, 0.085, 0.16), vec3(0.18, 0.24, 0.34), max(uPhotographicStyle, sunHeight01 * 0.55)) * uAmbientIntensity;
                vec3 nightAmbient = vec3(0.005, 0.008, 0.026) * mix(0.62, 0.82, uPhotographicStyle);
                vec3 ambientColor = mix(dayAmbient, nightAmbient, night01);
                float skyT = smoothstep(0.0, 1.0, clamp(uv.y + 0.5, 0.0, 1.0));
                float screenY = clamp(gl_FragCoord.y / res.y, 0.0, 1.0);
                vec3 localhostBottomSky = vec3(0.055, 0.078, 0.145);
                vec3 localhostTopSky = vec3(0.044, 0.064, 0.125);
                vec3 workbenchSky = mix(localhostBottomSky, localhostTopSky, screenY) * uAmbientIntensity;
                vec3 clearSky = workbenchSky;
                vec3 sunsetSky = mix(vec3(0.86, 0.42, 0.22), vec3(0.08, 0.12, 0.34), skyT) * uAmbientIntensity;
                vec3 moonSky = mix(vec3(0.012, 0.020, 0.052), vec3(0.0015, 0.004, 0.018), skyT) * max(0.72, uAmbientIntensity);
                vec2 starUv = vec2(atan(rd.x, rd.z) * 0.15915494 + 0.5, asin(clamp(rd.y, -1.0, 1.0)) * 0.31830988 + 0.5);
                vec2 starCell = floor(starUv * vec2(150.0, 92.0));
                vec2 starLocal = fract(starUv * vec2(150.0, 92.0)) - 0.5;
                float starHash = hash(starCell.x + starCell.y * 193.13 + uSeed * 0.071);
                float starVisibility = smoothstep(0.02, 0.42, rd.y) * (1.0 - smoothstep(0.88, 1.0, rd.y));
                float starPoint = 1.0 - smoothstep(0.026, 0.034, length(starLocal));
                float starTwinkle = 0.68 + 0.32 * sin(uTime * 4.2 + starHash * 81.0);
                moonSky += vec3(step(0.991, starHash) * starPoint * starVisibility * starTwinkle * 0.18);
                float viewSkyT = smoothstep(mix(-0.36, -0.22, sunHeight01), mix(0.34, 0.84, sunHeight01), rd.y);
                vec3 nightHorizonSky = vec3(0.010, 0.012, 0.028);
                vec3 nightZenithSky = vec3(0.002, 0.004, 0.015);
                vec3 emberHorizonSky = vec3(0.56, 0.075, 0.032);
                vec3 emberZenithSky = vec3(0.030, 0.026, 0.064);
                vec3 duskHorizonSky = vec3(0.42, 0.19, 0.075);
                vec3 duskZenithSky = vec3(0.026, 0.045, 0.105);
                vec3 dayHorizonSky = vec3(0.070, 0.105, 0.190);
                vec3 dayZenithSky = vec3(0.018, 0.080, 0.220);
                float toEmber = smoothstep(-0.34, -0.10, sunSin);
                float toDusk = smoothstep(-0.05, 0.15, sunSin);
                float toDay = smoothstep(0.18, 0.44, sunSin);
                vec3 domeHorizonSky = mix(nightHorizonSky, emberHorizonSky, toEmber);
                domeHorizonSky = mix(domeHorizonSky, duskHorizonSky, toDusk);
                domeHorizonSky = mix(domeHorizonSky, dayHorizonSky, toDay);
                vec3 domeZenithSky = mix(nightZenithSky, emberZenithSky, toEmber);
                domeZenithSky = mix(domeZenithSky, duskZenithSky, toDusk);
                domeZenithSky = mix(domeZenithSky, dayZenithSky, toDay);
                float glowGate = smoothstep(-0.32, -0.04, sunSin) * (1.0 - smoothstep(0.20, 0.55, sunSin));
                float sunGlow = pow(max(0.0, dot(rd, daylightDir)), mix(18.0, 32.0, sunHeight01)) * mix(0.58, 0.14, sunHeight01) * glowGate;
                vec3 atmosphereSky = mix(domeHorizonSky, domeZenithSky, viewSkyT) * uAmbientIntensity;
                atmosphereSky *= mix(0.72, 1.0, sunHeight01);
                atmosphereSky += mix(vec3(1.0, 0.12, 0.04), vec3(1.0, 0.56, 0.20), toDusk) * sunGlow * uSunIntensity * 0.10;
                atmosphereSky += vec3(0.012, 0.018, 0.038) * night01;
                float clearMask = step(0.5, uSkyMode) * (1.0 - step(1.5, uSkyMode));
                float sunsetMask = step(1.5, uSkyMode) * (1.0 - step(2.5, uSkyMode));
                float moonMask = step(2.5, uSkyMode) * (1.0 - step(3.5, uSkyMode));
                float atmosphereMask = step(3.5, uSkyMode);
                vec3 col = mix(workbenchSky, clearSky, clearMask);
                col = mix(col, sunsetSky, sunsetMask);
                col = mix(col, moonSky, moonMask);
                col = mix(col, atmosphereSky, atmosphereMask);
                if (uTransparentBackground < 0.5) {
                    col = surfaceOverlay(col, ro, rd, lightDir, ambientColor);
                    col = gridOverlay(col, ro, rd);
                }

                vec3 boxMin = vec3(-18.0, 0.0, -18.0);
                vec3 boxMax = vec3(18.0, uTropopause + 1.5, 18.0);
                vec2 aabb = intersectAABB(ro, rd, boxMin, boxMax);
                float densityAcc = 0.0;
                vec3 cloudCol = vec3(0.0);

                if (aabb.x < aabb.y && aabb.y > 0.0) {
                    float stepSize = uStepSize;
                    float t = max(0.0, aabb.x);
                    float maxT = aabb.y;
                    t += stepSize * hash(uv.x * 31.0 + uv.y * 113.0);
                    float cosTheta = dot(rd, lightDir);
                    float heightRange = max(0.1, uTropopause - MODEL_BASE_KM);

                    for(int i = 0; i < 168; i++) {
                        if (float(i) > uMaxSteps || t > maxT || densityAcc > 0.955) break;
                        vec3 p = ro + rd * t;
                        if (p.y < 0.0 || p.y > uTropopause + 1.2) {
                            t += stepSize * 3.0;
                            continue;
                        }
                        float macro = mapCloudMacro(p);
                        if (macro > 2.8) {
                            t += stepSize * min(8.0, 3.4 + macro * 1.45);
                            continue;
                        }
                        if (macro > 1.15) {
                            t += stepSize * 4.5;
                            continue;
                        }
                        float density = mapCloudFromMacro(p, macro);
                        if (density > 0.012) {
                            float height01 = clamp((p.y - MODEL_BASE_KM) / heightRange, 0.0, 1.0);
                            float iceFactor = iceFactorAtHeight(p.y);
                            float phaseG = mix(0.62, 0.82, iceFactor);
                            float phase = clamp(phaseHG(cosTheta, phaseG) * mix(0.7, 0.9, iceFactor) + phaseHG(cosTheta, -0.18) * 0.28, 0.0, 1.65);
                            float shadow = 0.0;
                            vec3 lPos = p;
                            float lStep = 0.34;
                            for(int j = 0; j < 3; j++) {
                                float jitter = float(j) * 1.37 + hash(dot(p.xz, vec2(17.0, 31.0)));
                                vec3 shadowDir = normalize(lightDir + vec3(
                                    sin(jitter) * 0.16,
                                    cos(jitter * 1.7) * 0.08,
                                    cos(jitter) * 0.16
                                ));
                                lPos += shadowDir * lStep;
                                float shadowMacro = mapCloudMacro(lPos);
                                if (shadowMacro < 2.4) {
                                    shadow += mapCloudFromMacro(lPos, shadowMacro);
                                }
                            }
                            float mixedPhaseShadow = 1.0 + smoothstep(0.36, 0.7, height01) * (1.0 - smoothstep(0.78, 0.94, height01)) * mix(0.38, 0.64, uPhotographicStyle);
                            float transmittance = exp(-shadow * mix(0.86, 0.58, iceFactor) * mixedPhaseShadow);
                            float surfaceRelief = smoothstep(-0.72, 0.18, macro) * (1.0 - smoothstep(0.2, 0.92, macro));
                            float relief = fbm(vec3(p.x * 0.42, p.y * 0.58, p.z * 0.42) + uSeed * 0.021);
                            float fineRelief = 0.5;
                            if (surfaceRelief > 0.025) {
                                fineRelief = fbm(vec3(p.x * 0.9, p.y * 1.05, p.z * 0.9) + vec3(uSeed * 0.013, 4.1, uTime * 0.03));
                            }
                            float reliefLight = mix(mix(0.66, 0.52, uPhotographicStyle), mix(1.34, 1.58, uPhotographicStyle), smoothstep(0.26, 0.84, relief));
                            reliefLight *= mix(1.0, mix(0.72, 1.42, smoothstep(0.3, 0.82, fineRelief)), surfaceRelief);
                            vec3 phaseTint = mix(vec3(1.0, 0.95, 0.88), vec3(0.78, 0.9, 1.08), iceFactor);
                            phaseTint = mix(phaseTint, mix(vec3(1.16, 1.1, 1.02), vec3(0.9, 0.98, 1.1), iceFactor), uPhotographicStyle);
                            vec3 lowerWaterDarkening = mix(vec3(0.9, 0.92, 0.96), vec3(1.0), smoothstep(0.16, 0.46, height01));
                            lowerWaterDarkening = mix(lowerWaterDarkening, vec3(0.86, 0.88, 0.94), uPhotographicStyle * (1.0 - smoothstep(0.2, 0.62, height01)));
                            float upperCloudLift = smoothstep(0.22, 0.94, height01);
                            vec3 upperCloudBrightening = mix(vec3(0.78, 0.82, 0.9), vec3(1.34, 1.42, 1.62), upperCloudLift);
                            upperCloudBrightening = mix(upperCloudBrightening, vec3(1.12, 1.22, 1.48), iceFactor * upperCloudLift * uPhotographicStyle);
                            float directHeightLift = mix(0.72, 2.08, upperCloudLift) * mix(1.0, 1.16, uPhotographicStyle * upperCloudLift);
                            vec3 ambientTerm = ambientColor * lowerWaterDarkening * upperCloudBrightening;
                            vec3 directTerm = lightColor * phaseTint * transmittance * phase * reliefLight * directHeightLift;
                            vec3 lighting = ambientTerm + directTerm;
                            float cloudOpacity = mix(1.0, 0.46, uShowGrid);
                            float alpha = (1.0 - exp(-density * stepSize * 12.8)) * cloudOpacity;
                            cloudCol += (1.0 - densityAcc) * lighting * alpha;
                            densityAcc += (1.0 - densityAcc) * alpha;
                        } else if (macro > 0.35) {
                            t += stepSize * 1.55;
                        }
                        t += stepSize;
                    }
                }

                vec3 alphaCompositedCloud = col * (1.0 - densityAcc) + cloudCol;
                float lowSunEdgeBlend = 1.0 - smoothstep(0.35, 1.65, uSunIntensity);
                col = mix(mix(col, cloudCol, densityAcc), alphaCompositedCloud, lowSunEdgeBlend);
                col = mix(col, cloudCol, uTransparentBackground);
                float sunForward = dot(rd, daylightDir);
                vec3 sdrColor = pow(ACESFilm(col), vec3(1.0 / 2.2));
                vec3 hdr10Color = hdr10ReferencePreview(col, densityAcc, sunHeight01, sunForward);
                col = mix(sdrColor, hdr10Color, uHdr10Mode);
                col = applyDisplayDither(col);
                float finalAlpha = mix(1.0, densityAcc, uTransparentBackground);
                gl_FragColor = vec4(col, finalAlpha);
            }
        `;

export const raymarchCloudVertexShader = String.raw`void main() { gl_Position = vec4(position, 1.0); }`;
