export const raymarchCloudLiteFragmentShader = String.raw`
            uniform float uTime;
            uniform vec2 uResolution;
            uniform float uSeed;
            uniform float uSunIntensity;
            uniform float uAmbientIntensity;
            uniform float uSunElevation;
            uniform float uTransparentBackground;

            float hash(float n) {
                return fract(sin(n) * 43758.5453123);
            }

            float softNoise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                float seed = uSeed * 0.17;
                float a = hash(i.x + i.y * 57.0 + seed);
                float b = hash(i.x + 1.0 + i.y * 57.0 + seed);
                float c = hash(i.x + (i.y + 1.0) * 57.0 + seed);
                float d = hash(i.x + 1.0 + (i.y + 1.0) * 57.0 + seed);
                return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
            }

            vec3 skyColor(vec2 uv) {
                float horizon = clamp(0.5 + uv.y * 0.62, 0.0, 1.0);
                return mix(vec3(0.18, 0.3, 0.49), vec3(0.44, 0.64, 0.82), horizon);
            }

            void main() {
                vec2 safeResolution = max(uResolution, vec2(1.0));
                vec2 uv =
                    (gl_FragCoord.xy - 0.5 * safeResolution) /
                    min(safeResolution.x, safeResolution.y);
                uv.y += 0.02;

                float angle = atan(uv.y, uv.x);
                float time = uTime * 0.5;
                float radialTexture =
                    softNoise(vec2(cos(angle), sin(angle)) * 3.2 + time * 0.08) - 0.5;
                float radius =
                    0.275 +
                    sin(angle * 9.0 + uSeed * 0.013 + time * 0.35) * 0.004 +
                    sin(angle * 15.0 - uSeed * 0.007 - time * 0.22) * 0.003 +
                    radialTexture * 0.006;
                float distanceFromCenter = length(uv);
                float edgeAlpha = smoothstep(radius + 0.052, radius - 0.018, distanceFromCenter);
                float innerGlow = smoothstep(radius * 0.96, radius * 0.18, distanceFromCenter);
                float feather = edgeAlpha * smoothstep(radius + 0.09, radius - 0.055, distanceFromCenter);

                float texture =
                    softNoise(uv * 7.0 + vec2(time * 0.04, -time * 0.03)) * 0.68 +
                    softNoise(uv * 13.0 + vec2(-time * 0.06, time * 0.05)) * 0.32;
                vec2 sphereUv = uv / max(radius, 0.001);
                float z = sqrt(max(0.0, 1.0 - dot(sphereUv, sphereUv)));
                vec3 normal = normalize(vec3(sphereUv, z));
                float sunRadians = radians(clamp(uSunElevation, -10.0, 80.0));
                vec3 lightDir = normalize(vec3(-0.42, sin(sunRadians), 0.78));
                float diffuse = clamp(dot(normal, lightDir), 0.0, 1.0);
                float rim = pow(clamp(1.0 - z, 0.0, 1.0), 2.0);
                float shade = 0.62 + diffuse * 0.32 + rim * 0.18 + (texture - 0.5) * 0.12;

                vec3 sky = skyColor(uv);
                vec3 cloud =
                    vec3(0.88, 0.92, 0.96) *
                    shade *
                    (0.72 + uAmbientIntensity * 0.18 + uSunIntensity * 0.025);
                cloud = mix(cloud, vec3(1.0), innerGlow * 0.18);

                float alpha = clamp(feather, 0.0, 1.0);
                if (uTransparentBackground > 0.5) {
                    gl_FragColor = vec4(cloud, alpha);
                    return;
                }
                gl_FragColor = vec4(mix(sky, cloud, alpha), 1.0);
            }
        `;
