export const raymarchCloudLiteFragmentShader = String.raw`
            uniform float uTime;
            uniform vec2 uResolution;
            uniform vec3 uCameraPos;
            uniform vec3 uCameraTarget;
            uniform float uAspect;
            uniform float uTropopause;
            uniform float uShowGrid;
            uniform float uSeed;
            uniform float uSystemCount;
            uniform float uIsOrtho;
            uniform float uOrthoSize;
            uniform float uOrthoVerticalScale;
            uniform float uStepSize;
            uniform float uMaxSteps;
            uniform float uEarlyExitAlpha;
            uniform float uShadowSamples;
            uniform float uShadowStep;
            uniform float uShadowOcclusion;
            uniform float uDensityMultiplier;
            uniform float uSunIntensity;
            uniform float uAmbientIntensity;
            uniform float uSunElevation;
            uniform float uFreezingLevel;
            uniform float uWindShear;
            uniform float uFbmOctaves;
            uniform float uCloudCurl;
            uniform float uHorizonStrength;
            uniform float uTransparentBackground;

#ifndef CUMULONIMBUS_MAX_RAY_STEPS
#define CUMULONIMBUS_MAX_RAY_STEPS 48
#endif

            const float MODEL_BASE_KM = 0.5;

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

            float fbmLite(vec3 p) {
                float f = 0.0;
                float weight = 0.5;
                for (int i = 0; i < 4; i++) {
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

            float ellipsoidSdf(vec3 p, vec3 center, vec3 radius) {
                vec3 q = (p - center) / radius;
                return (length(q) - 1.0) * min(radius.x, min(radius.y, radius.z));
            }

            float cellShape(vec3 p, vec2 offset, float radius, float phase) {
                float top = uTropopause;
                float height = max(2.0, top - MODEL_BASE_KM);
                float pulse = sin(uTime * 0.07 + phase + uSeed * 0.001) * 0.5 + 0.5;
                vec3 local = p - vec3(offset.x, MODEL_BASE_KM + height * 0.42, offset.y);
                local.xz -= vec2(uWindShear * local.y * 0.12, -uWindShear * local.y * 0.05);
                float tower = ellipsoidSdf(
                    local,
                    vec3(0.0, 0.0, 0.0),
                    vec3(radius * 0.82, height * 0.46, radius * 0.78)
                );
                float crownY = MODEL_BASE_KM + height * (0.78 + pulse * 0.04);
                vec3 crownLocal = p - vec3(offset.x + uWindShear * radius * 0.72, crownY, offset.y);
                float crown = ellipsoidSdf(
                    crownLocal,
                    vec3(0.0, 0.0, 0.0),
                    vec3(radius * 1.34, height * 0.18, radius * 0.82)
                );
                float baseWave = (noise(vec3(p.xz * 0.22 + offset, uSeed * 0.2)) - 0.5) * 0.9;
                float bottom = MODEL_BASE_KM + baseWave - p.y;
                float topCap = p.y - (top + 0.4);
                return smax(smin(tower, crown, 0.84), max(bottom, topCap), 0.4);
            }

            float mapCloudMacro(vec3 p) {
                float macro = cellShape(p, vec2(0.0, 0.0), 3.7, 0.0);
                if (uSystemCount >= 1.5) {
                    macro = smin(macro, cellShape(p, vec2(4.1, -0.9), 2.9, 2.0), 1.25);
                }
                if (uSystemCount >= 2.5) {
                    macro = smin(macro, cellShape(p, vec2(-3.2, 1.4), 2.8, 4.0), 1.25);
                }
                return macro;
            }

            float mapCloudFromMacro(vec3 p, float macro) {
                if (macro >= 1.0) {
                    return 0.0;
                }
                float heightRange = max(0.1, uTropopause - MODEL_BASE_KM);
                float height01 = clamp((p.y - MODEL_BASE_KM) / heightRange, 0.0, 1.0);
                vec3 q = vec3(p.x * 0.36, p.y * 0.42 - uTime * 0.08, p.z * 0.36);
                float curl = (noise(q + vec3(5.0, 2.0, uSeed * 0.02)) - 0.5) * uCloudCurl;
                float detail = fbmLite(q + curl);
                float edge = smoothstep(0.96, -0.55, macro);
                float towerBand = smoothstep(0.08, 0.28, height01) * (1.0 - smoothstep(0.86, 1.02, height01));
                float density = edge * towerBand * (detail * 1.45 - macro * 0.42);
                return clamp(density, 0.0, 1.0);
            }

            float phaseHG(float cosTheta, float g) {
                float g2 = g * g;
                return (1.0 - g2) / (4.0 * 3.14159 * pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5));
            }

            vec3 ACESFilm(vec3 x) {
                float a = 2.51; float b = 0.03; float c = 2.43; float d = 0.59; float e = 0.14;
                return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
            }

            vec3 gridOverlay(vec3 col, vec3 ro, vec3 rd) {
                if (uShowGrid < 0.5 || abs(rd.y) < 0.001) return col;
                float tG = (0.0 - ro.y) / rd.y;
                if (tG <= 0.0 || tG > 160.0) return col;
                vec3 pG = ro + rd * tG;
                if (length(pG.xz) > 15.0) return col;
                vec2 cell = abs(fract(pG.xz + 0.5) - 0.5);
                float line = 1.0 - smoothstep(0.035, 0.08, min(cell.x, cell.y));
                return mix(col, vec3(0.08, 0.42, 0.82), line * exp(-tG * 0.012) * 0.55);
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

                float sunRad = radians(uSunElevation);
                vec3 lightDir = normalize(vec3(-0.75, max(0.2, sin(sunRad)), 0.42));
                vec3 lightColor = vec3(1.0, 0.9, 0.82) * uSunIntensity;
                vec3 ambientColor = vec3(0.09, 0.13, 0.23) * uAmbientIntensity;
                vec3 bgDark = vec3(0.018, 0.028, 0.072) * max(0.45, uAmbientIntensity);
                vec3 bgLight = vec3(0.16, 0.29, 0.55) * max(0.35, uAmbientIntensity) * uHorizonStrength;
                vec3 col = mix(bgDark, bgLight, clamp(uv.y + 0.58, 0.0, 1.0));
                if (uTransparentBackground < 0.5) {
                    col = gridOverlay(col, ro, rd);
                }

                vec3 boxMin = vec3(-18.0, 0.0, -18.0);
                vec3 boxMax = vec3(18.0, uTropopause + 1.5, 18.0);
                vec2 aabb = intersectAABB(ro, rd, boxMin, boxMax);
                float densityAcc = 0.0;
                vec3 cloudCol = vec3(0.0);

                if (aabb.x < aabb.y && aabb.y > 0.0) {
                    float stepSize = uStepSize;
                    float t = max(0.0, aabb.x) + stepSize * hash(uv.x * 31.0 + uv.y * 113.0);
                    float maxT = aabb.y;
                    float cosTheta = dot(rd, lightDir);
                    float phase = clamp(phaseHG(cosTheta, 0.62) * 0.72 + phaseHG(cosTheta, -0.18) * 0.28, 0.0, 1.5);

                    for(int i = 0; i < CUMULONIMBUS_MAX_RAY_STEPS; i++) {
                        if (float(i) >= uMaxSteps || t > maxT || densityAcc > uEarlyExitAlpha) break;
                        vec3 p = ro + rd * t;
                        if (p.y < 0.0 || p.y > uTropopause + 1.2) {
                            t += stepSize * 3.0;
                            continue;
                        }
                        float macro = mapCloudMacro(p);
                        if (macro > 2.5) {
                            t += stepSize * min(8.0, 3.0 + macro * 1.25);
                            continue;
                        }
                        if (macro > 1.1) {
                            t += stepSize * 3.5;
                            continue;
                        }
                        float density = mapCloudFromMacro(p, macro);
                        if (density > 0.012) {
                            float shadow = 0.0;
                            vec3 lPos = p;
                            for(int j = 0; j < 3; j++) {
                                if (float(j) >= uShadowSamples) {
                                    continue;
                                }
                                float jitter = float(j) * 1.37 + hash(dot(p.xz, vec2(17.0, 31.0)));
                                vec3 shadowDir = normalize(lightDir + vec3(
                                    sin(jitter) * 0.12,
                                    cos(jitter * 1.7) * 0.06,
                                    cos(jitter) * 0.12
                                ));
                                lPos += shadowDir * uShadowStep;
                                float shadowMacro = mapCloudMacro(lPos);
                                if (shadowMacro < 2.2) {
                                    shadow += mapCloudFromMacro(lPos, shadowMacro);
                                }
                            }
                            float height01 = clamp((p.y - MODEL_BASE_KM) / max(0.1, uTropopause - MODEL_BASE_KM), 0.0, 1.0);
                            float ice = smoothstep(uFreezingLevel, uTropopause, p.y);
                            float transmittance = exp(-shadow * uShadowOcclusion * 0.82);
                            vec3 phaseTint = mix(vec3(1.0, 0.95, 0.88), vec3(0.78, 0.9, 1.08), ice);
                            vec3 lighting = ambientColor * mix(0.8, 1.36, height01) + lightColor * phaseTint * transmittance * phase;
                            float alpha = (1.0 - exp(-density * stepSize * uDensityMultiplier)) * mix(1.0, 0.46, uShowGrid);
                            cloudCol += (1.0 - densityAcc) * lighting * alpha;
                            densityAcc += (1.0 - densityAcc) * alpha;
                        } else if (macro > 0.35) {
                            t += stepSize * 1.45;
                        }
                        t += stepSize;
                    }
                }

                col = mix(col, cloudCol, densityAcc);
                col = pow(ACESFilm(col), vec3(1.0 / 2.2));
                float finalAlpha = mix(1.0, densityAcc, uTransparentBackground);
                gl_FragColor = vec4(col, finalAlpha);
            }
        `;
