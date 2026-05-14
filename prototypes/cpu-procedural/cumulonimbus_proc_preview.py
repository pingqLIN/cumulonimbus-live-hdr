import math
import os
import random
import subprocess
import sys

try:
    import numpy as np
except Exception as exc:
    raise SystemExit(f"This preview generator requires numpy: {exc}")

WIDTH = 360
HEIGHT = 640
OUT_WIDTH = 720
OUT_HEIGHT = 1280
FPS = 24
SECONDS = 6
FRAMES = FPS * SECONDS
SEED = 4179
OUT_PATH = r"C:\Users\miles\Downloads\cumulonimbus_proc_preview.mp4"

random.seed(SEED)
np.random.seed(SEED)

ys = np.linspace(0.0, 1.0, HEIGHT, dtype=np.float32)[:, None]
xs = np.linspace(0.0, 1.0, WIDTH, dtype=np.float32)[None, :]

lobes = []

def add_lobe(cx, cy, r, amp, phase=None, drift=1.0, kind=0):
    lobes.append({
        "cx": float(cx),
        "cy": float(cy),
        "r": float(r),
        "amp": float(amp),
        "phase": float(random.random() * math.tau if phase is None else phase),
        "drift": float(drift),
        "kind": kind,
    })

# Large mass: towering cumulonimbus body.
for _ in range(55):
    y = random.uniform(0.30, 0.92)
    center = 0.42 + 0.08 * math.sin(8.0 * y)
    spread = 0.34 * (1.0 - abs(y - 0.58)) + 0.08
    x = random.gauss(center, spread * 0.34)
    r = random.uniform(0.060, 0.135) * (1.15 - 0.35 * y)
    add_lobe(x, y, r, random.uniform(0.70, 1.15), drift=random.uniform(0.5, 1.2), kind=0)

# Lower rolling shelf clouds.
for _ in range(60):
    y = random.uniform(0.62, 1.03)
    x = random.uniform(-0.05, 1.12)
    r = random.uniform(0.045, 0.115)
    add_lobe(x, y, r, random.uniform(0.55, 1.0), drift=random.uniform(0.3, 0.9), kind=1)

# Cauliflower rim detail, concentrated on top/right tower edges.
for _ in range(130):
    y = random.uniform(0.22, 0.78)
    tower_width = 0.22 + 0.35 * (y - 0.22)
    tower_width = max(0.18, min(0.46, tower_width))
    side = -1 if random.random() < 0.46 else 1
    x = 0.47 + side * random.uniform(0.10, tower_width) + random.gauss(0, 0.035)
    r = random.uniform(0.018, 0.052)
    add_lobe(x, y, r, random.uniform(0.45, 0.95), drift=random.uniform(0.7, 1.8), kind=2)

# Front small bubble clusters.
for _ in range(80):
    y = random.uniform(0.52, 0.95)
    x = random.uniform(0.06, 0.95)
    r = random.uniform(0.018, 0.060)
    add_lobe(x, y, r, random.uniform(0.35, 0.85), drift=random.uniform(0.5, 1.5), kind=3)


def smoothstep(edge0, edge1, value):
    t = np.clip((value - edge0) / (edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def add_blob(density, shade_seed, cx, cy, r, amp, squash=1.0):
    rx = r * (0.95 + 0.35 * squash)
    ry = r * (1.12 - 0.20 * squash)
    x0 = max(0, int((cx - 3.2 * rx) * WIDTH))
    x1 = min(WIDTH, int((cx + 3.2 * rx) * WIDTH) + 1)
    y0 = max(0, int((cy - 3.2 * ry) * HEIGHT))
    y1 = min(HEIGHT, int((cy + 3.2 * ry) * HEIGHT) + 1)
    if x0 >= x1 or y0 >= y1:
        return
    sx = xs[0, x0:x1][None, :]
    sy = ys[y0:y1, 0][:, None]
    dx = (sx - cx) / rx
    dy = (sy - cy) / ry
    d2 = dx * dx + dy * dy
    core = np.exp(-1.65 * d2).astype(np.float32)
    rim = np.exp(-5.8 * np.abs(d2 - 0.78)).astype(np.float32)
    field = amp * (0.92 * core + 0.18 * rim)
    density[y0:y1, x0:x1] += field
    shade_seed[y0:y1, x0:x1] += rim * amp


def make_frame(frame_index):
    t = frame_index / FPS
    p = frame_index / max(1, FRAMES - 1)
    density = np.zeros((HEIGHT, WIDTH), dtype=np.float32)
    shade_seed = np.zeros((HEIGHT, WIDTH), dtype=np.float32)

    # Slow push-in camera like the reference sample.
    zoom = 1.0 + 0.105 * p
    cx0 = 0.47
    cy0 = 0.57

    for lobe in lobes:
        phase = lobe["phase"]
        base_y = lobe["cy"]
        rise = (0.012 + 0.020 * (1.0 - base_y)) * t * lobe["drift"]
        billow = 0.014 * math.sin(phase + t * (0.65 + 0.25 * lobe["drift"]))
        curl = 0.020 * math.sin(phase * 0.7 + t * 0.45 + base_y * 9.0)
        cx = lobe["cx"] + curl + 0.010 * math.sin(t * 0.23 + base_y * 15.0)
        cy = base_y - rise + billow
        r = lobe["r"] * (1.0 + 0.080 * math.sin(phase + t * 0.85) + 0.030 * p)
        amp = lobe["amp"] * (1.0 + 0.10 * p)

        # Apply camera zoom in normalized space.
        cx = cx0 + (cx - cx0) * zoom
        cy = cy0 + (cy - cy0) * zoom
        r *= zoom
        add_blob(density, shade_seed, cx, cy, r, amp, squash=math.sin(phase) * 0.5 + 0.5)

    # Multi-scale atmospheric texture; cheap analytic noise, not image assets.
    flow_x = xs + 0.018 * np.sin(ys * 16.0 + t * 0.75)
    flow_y = ys - t * 0.018 + 0.014 * np.sin(xs * 12.0 - t * 0.55)
    n1 = np.sin((flow_x * 31.0 + flow_y * 15.0 + t * 0.70) * math.tau)
    n2 = np.sin((flow_x * 73.0 - flow_y * 37.0 - t * 0.35) * math.tau)
    n3 = np.sin((flow_x * 127.0 + flow_y * 81.0 + t * 0.20) * math.tau)
    texture = (0.58 + 0.24 * n1 + 0.12 * n2 + 0.055 * n3).astype(np.float32)
    texture = np.clip(texture, 0.22, 1.12)
    density *= texture

    alpha = smoothstep(0.36, 1.75, density)
    alpha = np.clip(alpha, 0.0, 1.0)

    # Soft internal thickness and shadowing. Light comes from upper left.
    left_thickness = np.cumsum(alpha[:, ::-1], axis=1)[:, ::-1] / WIDTH
    top_thickness = np.cumsum(alpha, axis=0) / HEIGHT
    left_light = np.clip(1.10 - xs * 1.15 + (1.0 - ys) * 0.22, 0.0, 1.0)
    top_light = np.clip(1.0 - ys * 0.72, 0.0, 1.0)
    self_shadow = np.exp(-2.7 * left_thickness - 1.9 * top_thickness).astype(np.float32)

    gy, gx = np.gradient(alpha)
    normal_light = np.clip((-gx * 8.5 - gy * 5.0) + 0.48, 0.0, 1.0)
    rim_light = np.clip(shade_seed * 0.65, 0.0, 1.0) * np.clip(1.12 - xs * 1.05, 0.0, 1.0)

    illum = 0.24 + 0.82 * left_light * self_shadow + 0.38 * top_light * normal_light + 0.27 * rim_light
    illum = np.clip(illum, 0.0, 1.35)

    cloud_base = np.array([0.82, 0.84, 0.78], dtype=np.float32)
    cloud_hot = np.array([1.00, 0.99, 0.91], dtype=np.float32)
    cloud_shadow = np.array([0.10, 0.17, 0.18], dtype=np.float32)
    cloud_mix = np.clip(illum[..., None], 0.0, 1.0)
    cloud = cloud_shadow * (1.0 - cloud_mix) + cloud_base * cloud_mix
    hot = np.clip((illum - 0.72) / 0.58, 0.0, 1.0)[..., None]
    cloud = cloud * (1.0 - hot) + cloud_hot * hot

    # Dark cinematic sky with a wide left bloom.
    glow = np.exp(-((xs + 0.06) ** 2 / 0.075 + (ys - 0.42) ** 2 / 0.42)).astype(np.float32)
    sky = np.zeros((HEIGHT, WIDTH, 3), dtype=np.float32)
    sky[..., 0] = 0.010 + 0.18 * glow
    sky[..., 1] = 0.014 + 0.23 * glow
    sky[..., 2] = 0.016 + 0.24 * glow
    vignette = np.clip(1.0 - 0.75 * ((xs - 0.60) ** 2 + (ys - 0.50) ** 2), 0.0, 1.0)
    sky *= vignette[..., None]

    mist = smoothstep(0.20, 1.10, density) * (0.22 + 0.28 * glow)
    mist_color = np.array([0.70, 0.74, 0.68], dtype=np.float32)
    cloud = cloud * (1.0 - mist[..., None] * 0.20) + mist_color * (mist[..., None] * 0.20)

    rgb = sky * (1.0 - alpha[..., None]) + cloud * alpha[..., None]

    # Cinematic contrast and subtle grain.
    rgb = np.clip(rgb, 0.0, 1.0)
    rgb = np.clip((rgb - 0.025) * 1.10, 0.0, 1.0)
    grain = (np.random.default_rng(SEED + frame_index).normal(0.0, 0.006, rgb.shape)).astype(np.float32)
    rgb = np.clip(rgb + grain, 0.0, 1.0)
    return (rgb * 255.0 + 0.5).astype(np.uint8)


def main():
    cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-pix_fmt", "rgb24",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-r", str(FPS),
        "-i", "-",
        "-vf", f"scale={OUT_WIDTH}:{OUT_HEIGHT}:flags=lanczos",
        "-an",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        OUT_PATH,
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    try:
        for i in range(FRAMES):
            frame = make_frame(i)
            proc.stdin.write(frame.tobytes())
            if i % 24 == 0:
                print(f"frame {i}/{FRAMES}", file=sys.stderr)
    finally:
        if proc.stdin:
            proc.stdin.close()
    code = proc.wait()
    if code != 0:
        raise SystemExit(code)
    print(OUT_PATH)

if __name__ == "__main__":
    main()
