import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const gridX = readNumberArg("--gridX", 48);
const gridY = readNumberArg("--gridY", 36);
const gridZ = readNumberArg("--gridZ", 48);
const width = readNumberArg("--width", 128);
const height = readNumberArg("--height", 228);
const videoWidth = readNumberArg("--videoWidth", 720);
const videoHeight = readNumberArg("--videoHeight", 1280);
const fps = readNumberArg("--fps", 24);
const seconds = readNumberArg("--seconds", 3);
const frames = readNumberArg("--frames", Math.max(1, Math.round(fps * seconds)));
const simStepsPerFrame = readNumberArg("--simStepsPerFrame", 2);
const raySteps = readNumberArg("--raySteps", 32);
const seed = readNumberArg("--seed", 20260514);
const outputDir = readStringArg(
  "--outDir",
  join("outputs", "analysis", "cml-lite-density-grid")
);
const metricsPath = readStringArg("--metrics", join(outputDir, "metrics.json"));
const mp4Path = readStringArg("--mp4", join(outputDir, "preview.mp4"));
const noMp4 = hasFlag("--no-mp4");

mkdirSync(outputDir, { recursive: true });
mkdirSync(dirname(metricsPath), { recursive: true });
if (!noMp4) {
  mkdirSync(dirname(mp4Path), { recursive: true });
}

const startedAt = performance.now();
const state = createState();
const initialSummary = summarizeState(state);
const encoder = noMp4 ? null : startEncoder();
const keyframeIndexes = new Set([
  0,
  Math.max(0, Math.floor(frames * 0.33)),
  Math.max(0, Math.floor(frames * 0.66)),
  Math.max(0, frames - 1)
]);
const metrics = {
  ok: true,
  seed,
  grid: { x: gridX, y: gridY, z: gridZ },
  render: { width, height, videoWidth, videoHeight, fps, frames, raySteps },
  simStepsPerFrame,
  outputDir,
  mp4Path: noMp4 ? null : mp4Path,
  metricsPath,
  keyframes: [],
  initial: initialSummary,
  final: null,
  averageAlpha: 0,
  maxAlpha: 0,
  litRatio: 0,
  edgeDetailScore: 0,
  cloudTopHeight: 0,
  verticalGrowth: 0,
  averageSimulationMs: 0,
  averageRenderMs: 0,
  durationMs: 0
};
let firstCloudTopHeight = null;

for (let frameIndex = 0; frameIndex < frames; frameIndex += 1) {
  const simStartedAt = performance.now();
  for (let step = 0; step < simStepsPerFrame; step += 1) {
    stepSimulation(state, frameIndex * simStepsPerFrame + step);
  }
  metrics.averageSimulationMs += performance.now() - simStartedAt;

  const renderStartedAt = performance.now();
  const frame = renderFrame(state, frameIndex / Math.max(1, frames - 1));
  metrics.averageRenderMs += performance.now() - renderStartedAt;
  metrics.averageAlpha += frame.metrics.averageAlpha;
  metrics.maxAlpha = Math.max(metrics.maxAlpha, frame.metrics.maxAlpha);
  metrics.litRatio += frame.metrics.litRatio;
  metrics.edgeDetailScore += frame.metrics.edgeDetailScore;
  metrics.cloudTopHeight = Math.max(metrics.cloudTopHeight, frame.metrics.cloudTopHeight);
  firstCloudTopHeight ??= frame.metrics.cloudTopHeight;

  if (keyframeIndexes.has(frameIndex)) {
    const keyframePath = join(outputDir, `frame-${String(frameIndex).padStart(3, "0")}.ppm`);
    writePpm(keyframePath, width, height, frame.rgb);
    metrics.keyframes.push(keyframePath);
  }

  if (encoder) {
    encoder.stdin.write(frame.rgb);
  }
}

if (encoder) {
  await finishEncoder(encoder);
}

metrics.averageAlpha /= frames;
metrics.litRatio /= frames;
metrics.edgeDetailScore /= frames;
metrics.averageSimulationMs /= frames;
metrics.averageRenderMs /= frames;
metrics.final = summarizeState(state);
metrics.verticalGrowth = metrics.cloudTopHeight - (firstCloudTopHeight ?? 0);
metrics.durationMs = performance.now() - startedAt;
metrics.ok = validateMetrics(metrics);

writeFileSync(metricsPath, `${JSON.stringify(metrics, null, 2)}\n`);
console.log(JSON.stringify(metrics, null, 2));

function createState() {
  const size = gridX * gridY * gridZ;
  const created = {
    vapor: new Float32Array(size),
    droplets: new Float32Array(size),
    temperature: new Float32Array(size),
    velocityX: new Float32Array(size),
    velocityY: new Float32Array(size),
    velocityZ: new Float32Array(size),
    scratch: {
      vapor: new Float32Array(size),
      droplets: new Float32Array(size),
      temperature: new Float32Array(size),
      velocityX: new Float32Array(size),
      velocityY: new Float32Array(size),
      velocityZ: new Float32Array(size)
    }
  };

  for (let z = 0; z < gridZ; z += 1) {
    for (let y = 0; y < gridY; y += 1) {
      for (let x = 0; x < gridX; x += 1) {
        const yNorm = y / Math.max(1, gridY - 1);
        const index = gridIndex(x, y, z);
        created.temperature[index] = 0.62 - yNorm * 0.42;
        created.vapor[index] = Math.max(0, 0.08 - yNorm * 0.075);
      }
    }
  }

  return created;
}

function stepSimulation(simState, stepIndex) {
  addVaporSource(simState, stepIndex);
  diffuseInPlace(simState.vapor, simState.scratch.vapor, 0.055);
  diffuseInPlace(simState.droplets, simState.scratch.droplets, 0.035);
  diffuseInPlace(simState.temperature, simState.scratch.temperature, 0.045);
  diffuseInPlace(simState.velocityX, simState.scratch.velocityX, 0.08);
  diffuseInPlace(simState.velocityY, simState.scratch.velocityY, 0.08);
  diffuseInPlace(simState.velocityZ, simState.scratch.velocityZ, 0.08);
  applyBuoyancyAndShear(simState);
  advectInPlace(simState.vapor, simState.scratch.vapor, simState, 0.992);
  advectInPlace(simState.droplets, simState.scratch.droplets, simState, 0.996);
  advectInPlace(simState.temperature, simState.scratch.temperature, simState, 0.998);
  advectInPlace(simState.velocityX, simState.scratch.velocityX, simState, 0.986);
  advectInPlace(simState.velocityY, simState.scratch.velocityY, simState, 0.986);
  advectInPlace(simState.velocityZ, simState.scratch.velocityZ, simState, 0.986);
  condenseAndClamp(simState);
}

function addVaporSource(simState, stepIndex) {
  const time = stepIndex * 0.055;
  const wobbleX = Math.sin(time * 0.73 + seed * 0.0001) * 0.06;
  const wobbleZ = Math.cos(time * 0.61 + seed * 0.00013) * 0.05;
  const centerX = 0.48 + wobbleX;
  const centerZ = 0.52 + wobbleZ;
  const centerY = 0.08;

  for (let z = 0; z < gridZ; z += 1) {
    const zNorm = z / Math.max(1, gridZ - 1);
    for (let y = 0; y < Math.ceil(gridY * 0.28); y += 1) {
      const yNorm = y / Math.max(1, gridY - 1);
      for (let x = 0; x < gridX; x += 1) {
        const xNorm = x / Math.max(1, gridX - 1);
        const dx = (xNorm - centerX) / 0.18;
        const dz = (zNorm - centerZ) / 0.18;
        const dy = (yNorm - centerY) / 0.20;
        const radius = dx * dx + dz * dz + dy * dy;
        if (radius > 1.35) {
          continue;
        }
        const index = gridIndex(x, y, z);
        const turbulentPulse =
          0.72 + valueNoise(xNorm * 7.2 + time, yNorm * 4.0, zNorm * 7.2 - time) * 0.42;
        const source = (1 - smoothstep(0.1, 1.35, radius)) * turbulentPulse;
        simState.vapor[index] += source * 0.09;
        simState.temperature[index] += source * 0.035;
        simState.velocityY[index] += source * 0.18;
        simState.velocityX[index] += (xNorm - centerX) * source * 0.035;
        simState.velocityZ[index] += (zNorm - centerZ) * source * 0.035;
      }
    }
  }
}

function diffuseInPlace(field, scratch, coefficient) {
  for (let z = 0; z < gridZ; z += 1) {
    for (let y = 0; y < gridY; y += 1) {
      for (let x = 0; x < gridX; x += 1) {
        const index = gridIndex(x, y, z);
        const average =
          field[gridIndex(Math.max(0, x - 1), y, z)] +
          field[gridIndex(Math.min(gridX - 1, x + 1), y, z)] +
          field[gridIndex(x, Math.max(0, y - 1), z)] +
          field[gridIndex(x, Math.min(gridY - 1, y + 1), z)] +
          field[gridIndex(x, y, Math.max(0, z - 1))] +
          field[gridIndex(x, y, Math.min(gridZ - 1, z + 1))];
        scratch[index] = field[index] + (average / 6 - field[index]) * coefficient;
      }
    }
  }
  field.set(scratch);
}

function applyBuoyancyAndShear(simState) {
  for (let z = 0; z < gridZ; z += 1) {
    const zNorm = z / Math.max(1, gridZ - 1);
    for (let y = 0; y < gridY; y += 1) {
      const yNorm = y / Math.max(1, gridY - 1);
      const ambient = 0.62 - yNorm * 0.44;
      const anvil = smoothstep(0.60, 0.88, yNorm);
      for (let x = 0; x < gridX; x += 1) {
        const xNorm = x / Math.max(1, gridX - 1);
        const index = gridIndex(x, y, z);
        const buoyancy =
          (simState.temperature[index] - ambient) * 0.05 +
          simState.vapor[index] * 0.014 +
          simState.droplets[index] * 0.009;
        const density = simState.vapor[index] + simState.droplets[index];
        const outflow = anvil * density * 0.035;
        simState.velocityY[index] = clamp(simState.velocityY[index] + buoyancy - anvil * 0.035, -0.25, 0.72);
        simState.velocityX[index] = clamp(
          simState.velocityX[index] + outflow * (0.85 + (xNorm - 0.5) * 1.2),
          -0.48,
          0.72
        );
        simState.velocityZ[index] = clamp(
          simState.velocityZ[index] + outflow * (zNorm - 0.5) * 0.9,
          -0.42,
          0.42
        );
      }
    }
  }
}

function advectInPlace(field, scratch, simState, dissipation) {
  for (let z = 0; z < gridZ; z += 1) {
    for (let y = 0; y < gridY; y += 1) {
      for (let x = 0; x < gridX; x += 1) {
        const index = gridIndex(x, y, z);
        const backX = x - simState.velocityX[index];
        const backY = y - simState.velocityY[index];
        const backZ = z - simState.velocityZ[index];
        scratch[index] = sampleField(field, backX, backY, backZ) * dissipation;
      }
    }
  }
  field.set(scratch);
}

function condenseAndClamp(simState) {
  for (let z = 0; z < gridZ; z += 1) {
    for (let y = 0; y < gridY; y += 1) {
      const yNorm = y / Math.max(1, gridY - 1);
      for (let x = 0; x < gridX; x += 1) {
        const index = gridIndex(x, y, z);
        const saturation = clamp(0.52 - yNorm * 0.36 + simState.temperature[index] * 0.22, 0.08, 0.7);
        const excessVapor = Math.max(0, simState.vapor[index] - saturation);
        const conversion = excessVapor * 0.32;
        simState.vapor[index] -= conversion;
        simState.droplets[index] += conversion * 1.18;
        simState.temperature[index] += conversion * 0.025;

        const dryEdge = Math.max(
          Math.abs(x / Math.max(1, gridX - 1) - 0.5),
          Math.abs(z / Math.max(1, gridZ - 1) - 0.5)
        );
        const entrainment = smoothstep(0.34, 0.54, dryEdge) * 0.006;
        simState.droplets[index] *= 0.996 - entrainment;
        simState.vapor[index] *= 0.999;
        simState.temperature[index] += (0.62 - yNorm * 0.44 - simState.temperature[index]) * 0.003;

        simState.vapor[index] = finiteClamp(simState.vapor[index], 0, 3);
        simState.droplets[index] = finiteClamp(simState.droplets[index], 0, 3);
        simState.temperature[index] = finiteClamp(simState.temperature[index], 0, 1.4);
        simState.velocityX[index] = finiteClamp(simState.velocityX[index], -0.6, 0.8);
        simState.velocityY[index] = finiteClamp(simState.velocityY[index], -0.3, 0.8);
        simState.velocityZ[index] = finiteClamp(simState.velocityZ[index], -0.5, 0.5);
      }
    }
  }
}

function renderFrame(simState, progress) {
  const renderDensity = buildRenderDensity(simState);
  const rgb = Buffer.alloc(width * height * 3);
  const alpha = new Float32Array(width * height);
  const camera = { x: gridX * 0.48, y: gridY * 0.46, z: gridZ * 1.9 };
  const target = { x: gridX * (0.48 + progress * 0.04), y: gridY * 0.58, z: gridZ * 0.45 };
  const basis = makeCameraBasis(camera, target);
  const light = normalize({ x: -0.55, y: 0.42, z: 0.72 });
  let offset = 0;
  let alphaTotal = 0;
  let maxAlpha = 0;
  let litPixels = 0;

  for (let py = 0; py < height; py += 1) {
    for (let px = 0; px < width; px += 1) {
      const ray = makeCameraRay(px, py, width, height, basis);
      const pixel = traceDensity(renderDensity, camera, ray, light);
      const pixelIndex = py * width + px;
      alpha[pixelIndex] = pixel.alpha;
      alphaTotal += pixel.alpha;
      maxAlpha = Math.max(maxAlpha, pixel.alpha);
      if (pixel.r > 0.62 || pixel.g > 0.62 || pixel.b > 0.62) {
        litPixels += 1;
      }
      rgb[offset] = toByte(pixel.r);
      rgb[offset + 1] = toByte(pixel.g);
      rgb[offset + 2] = toByte(pixel.b);
      offset += 3;
    }
  }

  return {
    rgb,
    metrics: {
      averageAlpha: alphaTotal / (width * height),
      maxAlpha,
      litRatio: litPixels / (width * height),
      edgeDetailScore: measureEdgeDetail(alpha),
      cloudTopHeight: measureCloudTopHeight(simState)
    }
  };
}

function buildRenderDensity(simState) {
  const renderDensity = new Float32Array(gridX * gridY * gridZ);
  for (let z = 0; z < gridZ; z += 1) {
    const zNorm = z / Math.max(1, gridZ - 1);
    for (let y = 0; y < gridY; y += 1) {
      const yNorm = y / Math.max(1, gridY - 1);
      const altitudeFade = smoothstep(0.02, 0.15, yNorm) * (1 - smoothstep(0.96, 1.04, yNorm));
      for (let x = 0; x < gridX; x += 1) {
        const xNorm = x / Math.max(1, gridX - 1);
        const index = gridIndex(x, y, z);
        const droplets = simState.droplets[index];
        const base = normalizedEllipsoid(xNorm, yNorm, zNorm, 0.48, 0.15, 0.52, 0.38, 0.18, 0.32) * 0.68;
        const tower = normalizedEllipsoid(xNorm, yNorm, zNorm, 0.47, 0.39, 0.52, 0.21, 0.38, 0.18);
        const crown = normalizedEllipsoid(xNorm, yNorm, zNorm, 0.45, 0.64, 0.52, 0.31, 0.18, 0.25) * 0.94;
        const anvil = normalizedEllipsoid(xNorm, yNorm, zNorm, 0.62, 0.69, 0.52, 0.50, 0.08, 0.28) * 0.7;
        const macroShape = Math.max(base, tower, crown, anvil);
        const coarse = valueNoise(xNorm * 6.4 + yNorm * 1.7, yNorm * 5.6, zNorm * 6.4 - yNorm);
        const meso = valueNoise(xNorm * 13.2 + coarse * 1.4, yNorm * 10.4, zNorm * 13.2 - coarse);
        const micro = valueNoise(xNorm * 25.0, yNorm * 17.0, zNorm * 25.0);
        const edgeErosion =
          (0.08 + coarse * 0.11 + meso * 0.09 + micro * 0.035) *
          smoothstep(0.12, 0.86, 1 - macroShape);
        const cauliflower = 0.72 + smoothstep(0.28, 0.86, meso * 0.7 + micro * 0.3) * 0.46;
        renderDensity[index] = Math.max(0, droplets * macroShape * cauliflower - edgeErosion) * 1.88 * altitudeFade;
      }
    }
  }
  return renderDensity;
}

function normalizedEllipsoid(x, y, z, cx, cy, cz, rx, ry, rz) {
  const distance = Math.hypot((x - cx) / rx, (y - cy) / ry, (z - cz) / rz);
  return smoothstep(1.08, 0.28, distance);
}

function traceDensity(renderDensity, origin, ray, light) {
  const bounds = intersectBox(origin, ray);
  const sky = skyColor(ray);
  if (!bounds) {
    return { ...sky, alpha: 0 };
  }

  const stepLength = (bounds.far - bounds.near) / raySteps;
  let transmittance = 1;
  let r = sky.r;
  let g = sky.g;
  let b = sky.b;
  let alpha = 0;

  for (let step = 0; step < raySteps; step += 1) {
    const travel = bounds.near + (step + 0.5) * stepLength;
    const p = {
      x: origin.x + ray.x * travel,
      y: origin.y + ray.y * travel,
      z: origin.z + ray.z * travel
    };
    const density = sampleDensity(renderDensity, p.x, p.y, p.z);
    if (density <= 0.002) {
      continue;
    }
    const normal = estimateNormal(renderDensity, p);
    const diffuse = Math.max(0, dot(normal, light));
    const viewRim = Math.pow(Math.max(0, dot(normal, scale(ray, -1))), 2.6);
    const lightTransmittance = sampleLightTransmittance(renderDensity, p, light);
    const sampleAlpha = 1 - Math.exp(-density * stepLength * 0.82);
    const shade = 0.15 + diffuse * 0.72 * lightTransmittance + viewRim * 0.32;
    const warm = Math.max(0, dot(ray, scale(light, -1))) ** 6;
    const scatter = {
      r: 0.12 + shade * 0.84 + warm * 0.18,
      g: 0.14 + shade * 0.80 + warm * 0.15,
      b: 0.15 + shade * 0.72 + warm * 0.1
    };

    r = r * (1 - sampleAlpha * transmittance) + scatter.r * sampleAlpha * transmittance;
    g = g * (1 - sampleAlpha * transmittance) + scatter.g * sampleAlpha * transmittance;
    b = b * (1 - sampleAlpha * transmittance) + scatter.b * sampleAlpha * transmittance;
    alpha += sampleAlpha * transmittance;
    transmittance *= 1 - sampleAlpha;
    if (transmittance < 0.025) {
      break;
    }
  }

  return { r: tonemap(r), g: tonemap(g), b: tonemap(b), alpha };
}

function sampleDensity(simState, x, y, z) {
  return sampleField(simState, x, y, z);
}

function sampleLightTransmittance(renderDensity, point, light) {
  let opticalDepth = 0;
  for (let step = 1; step <= 5; step += 1) {
    opticalDepth +=
      sampleDensity(
        renderDensity,
        point.x + light.x * step * 1.35,
        point.y + light.y * step * 1.35,
        point.z + light.z * step * 1.35
      ) * 0.62;
  }
  return Math.exp(-opticalDepth);
}

function estimateNormal(renderDensity, point) {
  const dx = sampleDensity(renderDensity, point.x + 1, point.y, point.z) - sampleDensity(renderDensity, point.x - 1, point.y, point.z);
  const dy = sampleDensity(renderDensity, point.x, point.y + 1, point.z) - sampleDensity(renderDensity, point.x, point.y - 1, point.z);
  const dz = sampleDensity(renderDensity, point.x, point.y, point.z + 1) - sampleDensity(renderDensity, point.x, point.y, point.z - 1);
  return normalize({ x: -dx, y: -dy + 0.08, z: -dz });
}

function intersectBox(origin, ray) {
  const min = { x: 0, y: 0, z: 0 };
  const max = { x: gridX - 1, y: gridY - 1, z: gridZ - 1 };
  let near = -Infinity;
  let far = Infinity;
  for (const axis of ["x", "y", "z"]) {
    if (Math.abs(ray[axis]) < 0.000001) {
      if (origin[axis] < min[axis] || origin[axis] > max[axis]) {
        return null;
      }
      continue;
    }
    const t0 = (min[axis] - origin[axis]) / ray[axis];
    const t1 = (max[axis] - origin[axis]) / ray[axis];
    near = Math.max(near, Math.min(t0, t1));
    far = Math.min(far, Math.max(t0, t1));
  }
  if (far <= Math.max(0, near)) {
    return null;
  }
  return { near: Math.max(0, near), far };
}

function summarizeState(simState) {
  let vaporMass = 0;
  let dropletMass = 0;
  let activeCells = 0;
  let nonFiniteCells = 0;
  let cloudTopHeight = 0;
  for (let z = 0; z < gridZ; z += 1) {
    for (let y = 0; y < gridY; y += 1) {
      for (let x = 0; x < gridX; x += 1) {
        const index = gridIndex(x, y, z);
        const vapor = simState.vapor[index];
        const droplets = simState.droplets[index];
        if (!Number.isFinite(vapor) || !Number.isFinite(droplets)) {
          nonFiniteCells += 1;
          continue;
        }
        vaporMass += vapor;
        dropletMass += droplets;
        if (droplets > 0.015) {
          activeCells += 1;
          cloudTopHeight = Math.max(cloudTopHeight, y / Math.max(1, gridY - 1));
        }
      }
    }
  }
  return {
    vaporMass,
    dropletMass,
    activeCellRatio: activeCells / (gridX * gridY * gridZ),
    nonFiniteCells,
    cloudTopHeight
  };
}

function validateMetrics(result) {
  const failures = [];
  if (result.final.nonFiniteCells > 0) {
    failures.push(`non-finite state cells: ${result.final.nonFiniteCells}`);
  }
  if (!(result.final.dropletMass > result.initial.dropletMass + 1)) {
    failures.push("droplet mass did not increase");
  }
  if (result.final.activeCellRatio < 0.006) {
    failures.push(`active cell ratio too low: ${result.final.activeCellRatio}`);
  }
  if (result.maxAlpha < 0.18) {
    failures.push(`max alpha too low: ${result.maxAlpha}`);
  }
  if (result.edgeDetailScore < 0.002) {
    failures.push(`edge detail score too low: ${result.edgeDetailScore}`);
  }
  if (result.verticalGrowth < 0.04) {
    failures.push(`vertical growth too low: ${result.verticalGrowth}`);
  }
  if (failures.length > 0) {
    throw new Error(`CML-lite spike failed acceptance: ${failures.join("; ")}`);
  }
  return true;
}

function measureCloudTopHeight(simState) {
  return summarizeState(simState).cloudTopHeight;
}

function measureEdgeDetail(alpha) {
  let total = 0;
  let count = 0;
  for (let y = 1; y < height; y += 1) {
    for (let x = 1; x < width; x += 1) {
      const index = y * width + x;
      total += Math.abs(alpha[index] - alpha[index - 1]);
      total += Math.abs(alpha[index] - alpha[index - width]);
      count += 2;
    }
  }
  return total / Math.max(1, count);
}

function sampleField(field, x, y, z) {
  const clampedX = clamp(x, 0, gridX - 1);
  const clampedY = clamp(y, 0, gridY - 1);
  const clampedZ = clamp(z, 0, gridZ - 1);
  const x0 = Math.floor(clampedX);
  const y0 = Math.floor(clampedY);
  const z0 = Math.floor(clampedZ);
  const x1 = Math.min(gridX - 1, x0 + 1);
  const y1 = Math.min(gridY - 1, y0 + 1);
  const z1 = Math.min(gridZ - 1, z0 + 1);
  const tx = clampedX - x0;
  const ty = clampedY - y0;
  const tz = clampedZ - z0;
  const c000 = field[gridIndex(x0, y0, z0)];
  const c100 = field[gridIndex(x1, y0, z0)];
  const c010 = field[gridIndex(x0, y1, z0)];
  const c110 = field[gridIndex(x1, y1, z0)];
  const c001 = field[gridIndex(x0, y0, z1)];
  const c101 = field[gridIndex(x1, y0, z1)];
  const c011 = field[gridIndex(x0, y1, z1)];
  const c111 = field[gridIndex(x1, y1, z1)];
  const c00 = mix(c000, c100, tx);
  const c10 = mix(c010, c110, tx);
  const c01 = mix(c001, c101, tx);
  const c11 = mix(c011, c111, tx);
  return mix(mix(c00, c10, ty), mix(c01, c11, ty), tz);
}

function startEncoder() {
  const args = [
    "-y",
    "-f",
    "rawvideo",
    "-pix_fmt",
    "rgb24",
    "-s",
    `${width}x${height}`,
    "-r",
    String(fps),
    "-i",
    "-",
    "-vf",
    `scale=${videoWidth}:${videoHeight}:flags=lanczos`,
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "18",
    "-pix_fmt",
    "yuv420p",
    mp4Path
  ];
  return spawn("ffmpeg", args, { stdio: ["pipe", "inherit", "inherit"] });
}

function finishEncoder(encoderProcess) {
  return new Promise((resolve, reject) => {
    encoderProcess.stdin.end();
    encoderProcess.once("error", reject);
    encoderProcess.once("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

function writePpm(path, frameWidth, frameHeight, rgb) {
  writeFileSync(path, Buffer.concat([Buffer.from(`P6\n${frameWidth} ${frameHeight}\n255\n`, "ascii"), rgb]));
}

function gridIndex(x, y, z) {
  return (z * gridY + y) * gridX + x;
}

function valueNoise(x, y, z) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const uz = fz * fz * (3 - 2 * fz);
  let value = 0;
  for (let dz = 0; dz <= 1; dz += 1) {
    for (let dy = 0; dy <= 1; dy += 1) {
      for (let dx = 0; dx <= 1; dx += 1) {
        const weight = (dx ? ux : 1 - ux) * (dy ? uy : 1 - uy) * (dz ? uz : 1 - uz);
        value += hash(ix + dx, iy + dy, iz + dz) * weight;
      }
    }
  }
  return value;
}

function hash(x, y, z) {
  const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + seed * 0.013) * 43758.5453;
  return h - Math.floor(h);
}

function skyColor(ray) {
  const altitude = clamp(ray.y * 0.7 + 0.45);
  return {
    r: mix(0.13, 0.01, altitude),
    g: mix(0.18, 0.018, altitude),
    b: mix(0.19, 0.032, altitude),
    alpha: 0
  };
}

function makeCameraBasis(origin, lookAt) {
  const forward = normalize(subtract(lookAt, origin));
  const right = normalize(cross(forward, { x: 0, y: 1, z: 0 }));
  const up = normalize(cross(right, forward));
  return { forward, right, up };
}

function makeCameraRay(x, y, frameWidth, frameHeight, basis) {
  const aspect = frameWidth / frameHeight;
  const fovScale = Math.tan((38 * Math.PI) / 360);
  const px = ((x + 0.5) / frameWidth - 0.5) * 2 * aspect * fovScale;
  const py = (0.5 - (y + 0.5) / frameHeight) * 2 * fovScale;
  return normalize(add(add(basis.forward, scale(basis.right, px)), scale(basis.up, py)));
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function tonemap(value) {
  return Math.pow(clamp(1 - Math.exp(-Math.max(0, value) * 1.08)), 1 / 2.2);
}

function toByte(value) {
  return Math.round(clamp(value) * 255);
}

function finiteClamp(value, minimum, maximum) {
  return Number.isFinite(value) ? clamp(value, minimum, maximum) : minimum;
}

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function add(a, b) {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function subtract(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function scale(v, scalar) {
  return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function cross(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

function normalize(v) {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / length, y: v.y / length, z: v.z / length };
}

function readNumberArg(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index < 0) {
    return fallback;
  }
  const value = Number(process.argv[index + 1]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function readStringArg(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index < 0) {
    return fallback;
  }
  return process.argv[index + 1] ?? fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}
