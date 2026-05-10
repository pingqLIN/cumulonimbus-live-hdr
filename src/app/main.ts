import "../styles/app.css";
import { defaultCloudParams, tonemapSdr, type CloudParams } from "../core/cloud-field.js";
import { IterativeCloudField } from "../core/iterative-cloud-field.js";

const canvasElement = document.querySelector<HTMLCanvasElement>("#cloud-canvas");
if (!canvasElement) {
  throw new Error("Missing cloud canvas");
}
const canvas: HTMLCanvasElement = canvasElement;

const contextCandidate = canvas.getContext("2d", { alpha: false });
if (!contextCandidate) {
  throw new Error("Canvas 2D context is unavailable");
}
const context: CanvasRenderingContext2D = contextCandidate;

const params: CloudParams = { ...defaultCloudParams };
let paused = false;
let start = performance.now();
let lastFrameTime = start;
let animationFrame = 0;
let field = new IterativeCloudField(360, 640);

function bindNumber(id: keyof CloudParams): void {
  const input = document.querySelector<HTMLInputElement>(`#${id}`);
  if (!input) {
    return;
  }
  input.addEventListener("input", () => {
    params[id] = Number(input.value);
  });
}

function setupControls(): void {
  bindNumber("seed");
  bindNumber("growth");
  bindNumber("edgeDrift");
  bindNumber("towerHeight");
  bindNumber("anvilSpread");
  bindNumber("silverLining");
  bindNumber("haze");

  document.querySelector<HTMLButtonElement>("#pause")?.addEventListener("click", (event) => {
    paused = !paused;
    const button = event.currentTarget as HTMLButtonElement;
    button.textContent = paused ? "Resume" : "Pause";
    if (!paused) {
      lastFrameTime = performance.now();
      animationFrame = requestAnimationFrame(draw);
    }
  });

  document.querySelector<HTMLButtonElement>("#reset")?.addEventListener("click", () => {
    Object.assign(params, defaultCloudParams);
    for (const [key, value] of Object.entries(defaultCloudParams)) {
      const input = document.querySelector<HTMLInputElement>(`#${key}`);
      if (input) {
        input.value = String(value);
      }
    }
    start = performance.now();
    lastFrameTime = start;
    field.reset();
  });
}

function resizeCanvas(): void {
  const width = 360;
  const height = 640;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    field = new IterativeCloudField(width, height);
    field.reset();
    lastFrameTime = performance.now();
  }
}

function draw(now: number): void {
  resizeCanvas();
  const time = (now - start) / 1000;
  const deltaSeconds = Math.min(0.08, Math.max(1 / 120, (now - lastFrameTime) / 1000));
  lastFrameTime = now;
  field.step(time, deltaSeconds, params);

  const image = context.createImageData(canvas.width, canvas.height);
  const data = image.data;

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const pixel = field.samplePixel(x, y, params);
      const index = (y * canvas.width + x) * 4;
      data[index] = Math.round(tonemapSdr(pixel.r) * 255);
      data[index + 1] = Math.round(tonemapSdr(pixel.g) * 255);
      data[index + 2] = Math.round(tonemapSdr(pixel.b) * 255);
      data[index + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);
  if (!paused) {
    animationFrame = requestAnimationFrame(draw);
  }
}

setupControls();
animationFrame = requestAnimationFrame(draw);

window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(animationFrame);
});
