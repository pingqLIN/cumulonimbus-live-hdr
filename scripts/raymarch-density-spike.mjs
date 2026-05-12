import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const width = readNumberArg("--width", 180);
const height = readNumberArg("--height", 320);
const steps = readNumberArg("--steps", 56);
const outputPath = readStringArg(
  "--out",
  join("outputs", "analysis", "raymarch-density-spike.ppm")
);
const metricsPath = readStringArg(
  "--metrics",
  join("outputs", "analysis", "raymarch-density-spike.json")
);

mkdirSync(dirname(outputPath), { recursive: true });
mkdirSync(dirname(metricsPath), { recursive: true });

const startedAt = performance.now();
const header = Buffer.from(`P6\n${width} ${height}\n255\n`, "ascii");
const body = Buffer.alloc(width * height * 3);
const camera = { x: 0, y: 5.4, z: 23 };
const target = { x: -0.8, y: 7.6, z: 0 };
const basis = makeCameraBasis(camera, target);
const sunDir = normalize({ x: -0.58, y: 0.54, z: -0.61 });
let offset = 0;
let alphaTotal = 0;
let maxAlpha = 0;
let litPixels = 0;

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const ray = makeCameraRay(x, y, width, height, basis);
    const pixel = traceCloud(camera, ray, sunDir, steps);
    const alpha = pixel.alpha;
    alphaTotal += alpha;
    maxAlpha = Math.max(maxAlpha, alpha);
    if (pixel.r > 0.62 || pixel.g > 0.62 || pixel.b > 0.62) {
      litPixels += 1;
    }
    body[offset] = toByte(pixel.r);
    body[offset + 1] = toByte(pixel.g);
    body[offset + 2] = toByte(pixel.b);
    offset += 3;
  }
}

writeFileSync(outputPath, Buffer.concat([header, body]));
const metrics = {
  ok: true,
  outputPath,
  width,
  height,
  steps,
  averageAlpha: alphaTotal / (width * height),
  maxAlpha,
  litRatio: litPixels / (width * height),
  renderDurationMs: performance.now() - startedAt
};
writeFileSync(metricsPath, `${JSON.stringify(metrics, null, 2)}\n`);

if (metrics.averageAlpha < 0.02 || metrics.maxAlpha < 0.2 || metrics.litRatio < 0.005) {
  throw new Error(`Raymarch spike did not produce a usable cloud: ${JSON.stringify(metrics)}`);
}

console.log(JSON.stringify(metrics, null, 2));

function traceCloud(origin, ray, light, sampleSteps) {
  const sky = skyColor(ray);
  let transmittance = 1;
  let r = sky.r;
  let g = sky.g;
  let b = sky.b;
  let alpha = 0;
  const near = 8;
  const far = 36;
  const stepLength = (far - near) / sampleSteps;

  for (let index = 0; index < sampleSteps; index += 1) {
    const t = near + (index + 0.5) * stepLength;
    const p = {
      x: origin.x + ray.x * t,
      y: origin.y + ray.y * t,
      z: origin.z + ray.z * t
    };
    const density = sampleDensity(p);
    if (density <= 0.001) {
      continue;
    }

    const normal = estimateNormal(p);
    const diffuse = Math.max(0, dot(normal, light));
    const rim = Math.pow(Math.max(0, dot(normal, scale(ray, -1))), 2.8);
    const shadow = 0.36 + diffuse * 0.64;
    const sampleAlpha = 1 - Math.exp(-density * stepLength * 0.68);
    const scatter = {
      r: 0.42 + shadow * 0.48 + rim * 0.42,
      g: 0.44 + shadow * 0.44 + rim * 0.34,
      b: 0.45 + shadow * 0.38 + rim * 0.24
    };

    r = r * (1 - sampleAlpha * transmittance) + scatter.r * sampleAlpha * transmittance;
    g = g * (1 - sampleAlpha * transmittance) + scatter.g * sampleAlpha * transmittance;
    b = b * (1 - sampleAlpha * transmittance) + scatter.b * sampleAlpha * transmittance;
    alpha += sampleAlpha * transmittance;
    transmittance *= 1 - sampleAlpha;
    if (transmittance < 0.04) {
      break;
    }
  }

  return { r: tonemap(r), g: tonemap(g), b: tonemap(b), alpha };
}

function sampleDensity(p) {
  const base = ellipsoid(p, { x: -1.6, y: 1.6, z: 0 }, { x: 7.2, y: 2.1, z: 5.6 });
  const tower = ellipsoid(p, { x: -0.4, y: 6.4, z: 0.2 }, { x: 3.4, y: 7.8, z: 3.2 });
  const crown = ellipsoid(p, { x: -0.8, y: 12.4, z: -0.1 }, { x: 5.4, y: 3.6, z: 4.2 });
  const anvil = ellipsoid(p, { x: 1.6, y: 14.2, z: -0.2 }, { x: 10.8, y: 1.8, z: 5.4 });
  const shape = Math.max(base * 0.72, tower, crown * 0.92, anvil * 0.7);
  if (shape <= 0) {
    return 0;
  }

  const large = fbm(p.x * 0.23, p.y * 0.2, p.z * 0.23, 4);
  const billow = fbm(p.x * 0.68 + large, p.y * 0.58, p.z * 0.68 - large, 5);
  const scallop = fbm(p.x * 1.42, p.y * 1.1, p.z * 1.42, 3);
  const detail = smoothstep(0.28, 0.86, billow * 0.72 + scallop * 0.32);
  const verticalFade = smoothstep(-1.2, 1.8, p.y) * (1 - smoothstep(18.0, 22.0, p.y));
  return clamp(shape * detail * verticalFade * 1.35);
}

function ellipsoid(p, center, radius) {
  const dx = (p.x - center.x) / radius.x;
  const dy = (p.y - center.y) / radius.y;
  const dz = (p.z - center.z) / radius.z;
  const q = Math.hypot(dx, dy, dz);
  return smoothstep(1.05, 0.28, q);
}

function estimateNormal(p) {
  return normalize({
    x: -p.x * 0.08 + (fbm(p.x * 0.42, p.y * 0.34, p.z * 0.42, 3) - 0.5) * 0.18,
    y: 0.62 + (fbm(p.x * 0.3 + 7, p.y * 0.24, p.z * 0.3, 2) - 0.5) * 0.12,
    z: -p.z * 0.08 + (fbm(p.x * 0.38, p.y * 0.28, p.z * 0.38 + 11, 3) - 0.5) * 0.18
  });
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

function skyColor(ray) {
  const altitude = clamp(ray.y * 0.75 + 0.38);
  return {
    r: mix(0.16, 0.015, altitude),
    g: mix(0.22, 0.03, altitude),
    b: mix(0.24, 0.055, altitude)
  };
}

function fbm(x, y, z, octaves) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let index = 0; index < octaves; index += 1) {
    sum += valueNoise(x * freq, y * freq, z * freq) * amp;
    amp *= 0.52;
    freq *= 2.03;
  }
  return sum;
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
  const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + 20260512.13) * 43758.5453;
  return h - Math.floor(h);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function tonemap(value) {
  return Math.pow(clamp(1 - Math.exp(-Math.max(0, value) * 1.12)), 1 / 2.2);
}

function toByte(value) {
  return Math.round(clamp(value) * 255);
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
  return Number.isFinite(value) && value > 0 ? Math.round(value) : fallback;
}

function readStringArg(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index < 0) {
    return fallback;
  }
  return process.argv[index + 1] ?? fallback;
}
