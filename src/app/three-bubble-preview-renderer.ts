import * as THREE from "three";
import { BubbleModel, type BubbleLayer, type BubbleNode } from "../core/bubble-model.js";
import { mapCloudParamsToBubbleParams } from "../core/bubble-params.js";
import type { CloudParams } from "../core/cloud-field.js";
import type { PreviewRenderer } from "./preview-renderer.js";
export {
  normalizeThreeBubbleLookPresetName,
  type ThreeBubbleLookPresetName
} from "./three-bubble-look.js";
import type { ThreeBubbleLookPresetName } from "./three-bubble-look.js";

const MAX_INSTANCES = 12000;
const MAX_PARTICLES = 16000;

type ThreeBubbleLookPreset = {
  name: ThreeBubbleLookPresetName;
  label: string;
  clearColor: number;
  backgroundTop: string;
  backgroundMid: string;
  backgroundBottom: string;
  fogColor: number;
  fogDensity: number;
  fov: number;
  cameraPosition: readonly [number, number, number];
  cameraLookAt: readonly [number, number, number];
  cloudPositionY: number;
  cloudScale: number;
  toneExposure: number;
  ambientColor: number;
  ambientIntensity: number;
  keyColor: number;
  keyIntensity: number;
  keyPosition: readonly [number, number, number];
  fillColor: number;
  fillIntensity: number;
  fillPosition: readonly [number, number, number];
  rimColor: number;
  rimIntensity: number;
  rimPosition: readonly [number, number, number];
  materialColor: number;
  materialEmissive: number;
  scatterColor: number;
  scatterIntensity: number;
  scatterPower: number;
  roughnessBase: number;
  roughnessRange: number;
  emissiveScale: number;
  surfaceReliefScale: number;
  yReliefScale: number;
  zReliefScale: number;
  particleColor: number;
  particleSize: number;
  particleOpacity: number;
  particleDensityScale: number;
  maxVisibleInstances: number;
  maxVisibleParticles: number;
  particleSpread: number;
  haloColor: number;
  haloOpacity: number;
  haloScale: readonly [number, number, number];
  haloPosition: readonly [number, number, number];
  rotationScale: number;
};

const LOOK_PRESETS: Record<ThreeBubbleLookPresetName, ThreeBubbleLookPreset> = {
  structural: {
    name: "structural",
    label: "structural",
    clearColor: 0x080d12,
    backgroundTop: "#020306",
    backgroundMid: "#081018",
    backgroundBottom: "#19232c",
    fogColor: 0x081018,
    fogDensity: 0.014,
    fov: 42,
    cameraPosition: [0, 12, 54],
    cameraLookAt: [0, 8, 0],
    cloudPositionY: -2.25,
    cloudScale: 0.68,
    toneExposure: 1.68,
    ambientColor: 0x718091,
    ambientIntensity: 1.56,
    keyColor: 0xfff2df,
    keyIntensity: 4.45,
    keyPosition: [12, 18, -10],
    fillColor: 0x93b4d4,
    fillIntensity: 1.28,
    fillPosition: [-12, 4, 16],
    rimColor: 0xdceeff,
    rimIntensity: 0.82,
    rimPosition: [-18, 14, -22],
    materialColor: 0xf5f2e8,
    materialEmissive: 0x8ba3bd,
    scatterColor: 0xd8ecff,
    scatterIntensity: 0.32,
    scatterPower: 2.1,
    roughnessBase: 0.86,
    roughnessRange: 0.28,
    emissiveScale: 0.22,
    surfaceReliefScale: 0.24,
    yReliefScale: 0.16,
    zReliefScale: 1,
    particleColor: 0xf7fbff,
    particleSize: 0.42,
    particleOpacity: 0.16,
    particleDensityScale: 1,
    maxVisibleInstances: 10000,
    maxVisibleParticles: 9000,
    particleSpread: 1,
    haloColor: 0xb8d4e8,
    haloOpacity: 0.08,
    haloScale: [28, 22, 1],
    haloPosition: [-5, 13, -20],
    rotationScale: 1
  },
  "demo-like": {
    name: "demo-like",
    label: "demo-like",
    clearColor: 0x050708,
    backgroundTop: "#020304",
    backgroundMid: "#071011",
    backgroundBottom: "#415057",
    fogColor: 0x314042,
    fogDensity: 0.012,
    fov: 35,
    cameraPosition: [-2.5, 13.5, 56],
    cameraLookAt: [-2, 10, 0],
    cloudPositionY: -6.7,
    cloudScale: 0.94,
    toneExposure: 1.7,
    ambientColor: 0xa7aa9b,
    ambientIntensity: 0.78,
    keyColor: 0xfff1d4,
    keyIntensity: 5.2,
    keyPosition: [-18, 24, -18],
    fillColor: 0x789198,
    fillIntensity: 0.68,
    fillPosition: [18, 7, 22],
    rimColor: 0xf7fbff,
    rimIntensity: 2.1,
    rimPosition: [-24, 20, -28],
    materialColor: 0xe7e2d3,
    materialEmissive: 0x8f8b7a,
    scatterColor: 0xfff2d8,
    scatterIntensity: 0.34,
    scatterPower: 1.7,
    roughnessBase: 0.98,
    roughnessRange: 0.18,
    emissiveScale: 0.3,
    surfaceReliefScale: 0.16,
    yReliefScale: 0.1,
    zReliefScale: 0.72,
    particleColor: 0xfff7e8,
    particleSize: 0.74,
    particleOpacity: 0.24,
    particleDensityScale: 1.85,
    maxVisibleInstances: 9000,
    maxVisibleParticles: 11000,
    particleSpread: 1.18,
    haloColor: 0xe9eadf,
    haloOpacity: 0.26,
    haloScale: [42, 34, 1],
    haloPosition: [-11, 11, -24],
    rotationScale: 0.45
  },
  "soft-volumetric-ish": {
    name: "soft-volumetric-ish",
    label: "soft-volumetric-ish",
    clearColor: 0x07090a,
    backgroundTop: "#020203",
    backgroundMid: "#0b1112",
    backgroundBottom: "#546061",
    fogColor: 0x435050,
    fogDensity: 0.022,
    fov: 34,
    cameraPosition: [-3, 12.8, 57],
    cameraLookAt: [-2.5, 9.2, 0],
    cloudPositionY: -7.8,
    cloudScale: 1.02,
    toneExposure: 2.18,
    ambientColor: 0xc2c1b0,
    ambientIntensity: 1.48,
    keyColor: 0xffefd1,
    keyIntensity: 4.25,
    keyPosition: [-20, 23, -20],
    fillColor: 0x81979a,
    fillIntensity: 1.08,
    fillPosition: [20, 5, 26],
    rimColor: 0xf8ffff,
    rimIntensity: 1.15,
    rimPosition: [-24, 16, -30],
    materialColor: 0xe8e4d4,
    materialEmissive: 0xd4ccb1,
    scatterColor: 0xf4fff8,
    scatterIntensity: 0.52,
    scatterPower: 1.35,
    roughnessBase: 1,
    roughnessRange: 0.1,
    emissiveScale: 0.84,
    surfaceReliefScale: 0.1,
    yReliefScale: 0.06,
    zReliefScale: 0.56,
    particleColor: 0xfffaed,
    particleSize: 1.15,
    particleOpacity: 0.34,
    particleDensityScale: 2.75,
    maxVisibleInstances: 7600,
    maxVisibleParticles: 14000,
    particleSpread: 1.4,
    haloColor: 0xf2eee0,
    haloOpacity: 0.34,
    haloScale: [52, 42, 1],
    haloPosition: [-14, 9, -26],
    rotationScale: 0.22
  }
};

export class ThreeBubblePreviewRenderer implements PreviewRenderer {
  readonly mode = "three-bubble";
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(42, 9 / 16, 0.1, 1200);
  private readonly cloudGroup = new THREE.Group();
  private readonly dummy = new THREE.Object3D();
  private readonly instanceColor = new THREE.Color();
  private readonly layerTintColors: Record<BubbleLayer, THREE.Color> = {
    base: new THREE.Color(0x66717a),
    tower: new THREE.Color(0xfff2d5),
    anvil: new THREE.Color(0xf8fbff),
    veil: new THREE.Color(0xc7d6d9)
  };
  private readonly keyLight = new THREE.DirectionalLight();
  private readonly fillLight = new THREE.DirectionalLight();
  private readonly rimLight = new THREE.DirectionalLight();
  private readonly ambientLight = new THREE.AmbientLight();
  private readonly model: BubbleModel;
  private readonly material: THREE.MeshStandardMaterial;
  private readonly instancedMesh: THREE.InstancedMesh;
  private readonly particleGeometry = new THREE.BufferGeometry();
  private readonly particlePositions = new Float32Array(MAX_PARTICLES * 3);
  private readonly particleMaterial: THREE.PointsMaterial;
  private readonly particleCloud: THREE.Points;
  private readonly glowSprite: THREE.Sprite;
  private cloudShaderUniforms: CloudShaderUniforms | null = null;
  private lastModelSignature = "";
  private lastWidth = 0;
  private lastHeight = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly lookPreset: ThreeBubbleLookPresetName = "structural"
  ) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false
    });
    this.renderer.setPixelRatio(1);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    const look = this.resolveLookPreset();
    this.applySceneLook(look);

    this.scene.add(this.cloudGroup);
    this.scene.add(this.ambientLight);

    this.scene.add(this.keyLight);
    this.scene.add(this.fillLight);
    this.scene.add(this.rimLight);

    const geometry = createDisplacedSphereGeometry(1, 40, 28);
    this.material = new THREE.MeshStandardMaterial({
      color: look.materialColor,
      emissive: look.materialEmissive,
      emissiveIntensity: 0.12,
      roughness: look.roughnessBase,
      metalness: 0,
      vertexColors: true
    });
    this.installCloudMaterialShader(look);
    this.instancedMesh = new THREE.InstancedMesh(geometry, this.material, MAX_INSTANCES);
    this.instancedMesh.count = 0;
    this.cloudGroup.add(this.instancedMesh);

    this.particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.particlePositions, 3)
    );
    this.particleGeometry.setDrawRange(0, 0);
    this.particleMaterial = new THREE.PointsMaterial({
      color: look.particleColor,
      map: createSoftParticleTexture(),
      size: look.particleSize,
      transparent: true,
      opacity: look.particleOpacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    this.particleCloud = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.cloudGroup.add(this.particleCloud);

    this.glowSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        color: look.haloColor,
        map: createSoftGlowTexture(),
        transparent: true,
        opacity: look.haloOpacity,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending
      })
    );
    this.glowSprite.renderOrder = -1;
    this.cloudGroup.add(this.glowSprite);

    this.model = new BubbleModel(mapCloudParamsToBubbleParams({ ...defaultCloudParamsShim }));
  }

  reset(): void {
    this.lastModelSignature = "";
  }

  resize(width: number, height: number): void {
    if (this.lastWidth === width && this.lastHeight === height) {
      return;
    }
    this.lastWidth = width;
    this.lastHeight = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  render(time: number, deltaSeconds: number, params: CloudParams): void {
    const look = this.resolveLookPreset();
    const bubbleParams = mapCloudParamsToBubbleParams(params);
    const modelSignature = getBubbleModelSignature(bubbleParams);
    if (this.lastModelSignature !== modelSignature) {
      this.model.reset(bubbleParams);
      this.lastModelSignature = modelSignature;
    }

    this.model.step(deltaSeconds);
    this.updateCloudMaterialShader(look, bubbleParams.lightWrap);
    this.material.emissiveIntensity = bubbleParams.lightWrap * look.emissiveScale;
    this.material.roughness = Math.min(
      1,
      look.roughnessBase + bubbleParams.surfaceDisplacement * look.roughnessRange
    );
    this.cloudGroup.rotation.y = time * bubbleParams.rotationDrift * look.rotationScale;
    this.glowSprite.material.opacity = look.haloOpacity + params.lightingHdr.haze * 0.08;

    this.updateInstances(bubbleParams.surfaceDisplacement, look);
    this.updateParticles(bubbleParams.edgeParticleDensity, look);
    this.renderer.render(this.scene, this.camera);
  }

  private resolveLookPreset(): ThreeBubbleLookPreset {
    return LOOK_PRESETS[this.lookPreset];
  }

  private applySceneLook(look: ThreeBubbleLookPreset): void {
    this.renderer.setClearColor(look.clearColor, 1);
    this.renderer.toneMappingExposure = look.toneExposure;
    this.scene.background = createSkyGradientTexture(look);
    this.scene.fog = new THREE.FogExp2(look.fogColor, look.fogDensity);
    this.camera.fov = look.fov;
    this.camera.position.set(...look.cameraPosition);
    this.camera.lookAt(...look.cameraLookAt);
    this.camera.updateProjectionMatrix();
    this.cloudGroup.position.y = look.cloudPositionY;
    this.cloudGroup.scale.setScalar(look.cloudScale);
    this.ambientLight.color.setHex(look.ambientColor);
    this.ambientLight.intensity = look.ambientIntensity;
    this.keyLight.color.setHex(look.keyColor);
    this.keyLight.intensity = look.keyIntensity;
    this.keyLight.position.set(...look.keyPosition);
    this.fillLight.color.setHex(look.fillColor);
    this.fillLight.intensity = look.fillIntensity;
    this.fillLight.position.set(...look.fillPosition);
    this.rimLight.color.setHex(look.rimColor);
    this.rimLight.intensity = look.rimIntensity;
    this.rimLight.position.set(...look.rimPosition);
  }

  private updateInstances(surfaceDisplacement: number, look: ThreeBubbleLookPreset): void {
    const nodes = this.model.getNodes();
    this.instancedMesh.count = Math.min(nodes.length, look.maxVisibleInstances, MAX_INSTANCES);
    for (let index = 0; index < this.instancedMesh.count; index += 1) {
      const node = nodes[index];
      if (!node) {
        continue;
      }
      const layerScale = getLayerScale(node.layer);
      const relief =
        1 +
        Math.sin(node.surfacePhase + node.generation * 1.7) *
          surfaceDisplacement *
          look.surfaceReliefScale;
      this.dummy.position.set(node.x, node.y, node.z);
      this.dummy.scale.set(
        node.radius * relief * layerScale.x,
        node.radius * (1 + surfaceDisplacement * look.yReliefScale) * layerScale.y,
        node.radius * (1 + (1 - relief) * look.zReliefScale) * layerScale.z
      );
      this.dummy.updateMatrix();
      this.instancedMesh.setMatrixAt(index, this.dummy.matrix);
      this.instancedMesh.setColorAt(index, this.getNodeColor(node, look));
    }
    this.instancedMesh.instanceMatrix.needsUpdate = true;
    if (this.instancedMesh.instanceColor) {
      this.instancedMesh.instanceColor.needsUpdate = true;
    }
  }

  private updateParticles(edgeParticleDensity: number, look: ThreeBubbleLookPreset): void {
    const nodes = this.model.getNodes();
    if (nodes.length === 0) {
      this.particleGeometry.setDrawRange(0, 0);
      return;
    }

    const density = look.particleDensityScale * (0.5 + edgeParticleDensity);
    const particleCount = Math.min(
      Math.ceil(nodes.length * density),
      look.maxVisibleParticles,
      MAX_PARTICLES
    );
    for (let index = 0; index < particleCount; index += 1) {
      const node = nodes[index % nodes.length];
      if (!node) {
        continue;
      }
      const ordinal = Math.floor(index / nodes.length);
      const layerWeight = getLayerParticleWeight(node.layer);
      const offset =
        node.radius *
        (1.08 + node.edgeParticleWeight * 0.28 + edgeParticleDensity * 0.18 + layerWeight * 0.18) *
        look.particleSpread;
      const angle = node.surfacePhase + node.generation + ordinal * 2.399963;
      this.particlePositions[index * 3] = node.x + Math.cos(angle) * offset;
      this.particlePositions[index * 3 + 1] =
        node.y + Math.sin(angle * 0.7) * offset * (0.42 + layerWeight * 0.2) + ordinal * 0.06;
      this.particlePositions[index * 3 + 2] = node.z + Math.sin(angle) * offset;
    }
    this.particleGeometry.setDrawRange(0, particleCount);
    const attribute = this.particleGeometry.getAttribute("position");
    if (attribute) {
      attribute.needsUpdate = true;
    }
    this.particleMaterial.size = look.particleSize;
    this.particleMaterial.opacity = look.particleOpacity;
    this.glowSprite.position.set(...look.haloPosition);
    this.glowSprite.scale.set(...look.haloScale);
  }

  private installCloudMaterialShader(look: ThreeBubbleLookPreset): void {
    this.material.onBeforeCompile = (shader) => {
      const scatterColor = { value: new THREE.Color(look.scatterColor) };
      const scatterIntensity = { value: look.scatterIntensity };
      const scatterPower = { value: look.scatterPower };
      shader.uniforms.uCloudScatterColor = scatterColor;
      shader.uniforms.uCloudScatterIntensity = scatterIntensity;
      shader.uniforms.uCloudScatterPower = scatterPower;
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
uniform vec3 uCloudScatterColor;
uniform float uCloudScatterIntensity;
uniform float uCloudScatterPower;`
        )
        .replace(
          "#include <dithering_fragment>",
          `float cloudFresnel = pow(clamp(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0), uCloudScatterPower);
gl_FragColor.rgb += uCloudScatterColor * cloudFresnel * uCloudScatterIntensity;
#include <dithering_fragment>`
        );
      this.cloudShaderUniforms = {
        scatterColor,
        scatterIntensity,
        scatterPower
      };
    };
    this.material.needsUpdate = true;
  }

  private updateCloudMaterialShader(look: ThreeBubbleLookPreset, lightWrap: number): void {
    if (!this.cloudShaderUniforms) {
      return;
    }
    this.cloudShaderUniforms.scatterColor.value.setHex(look.scatterColor);
    this.cloudShaderUniforms.scatterIntensity.value = look.scatterIntensity * (0.65 + lightWrap);
    this.cloudShaderUniforms.scatterPower.value = look.scatterPower;
  }

  private getNodeColor(node: BubbleNode, look: ThreeBubbleLookPreset): THREE.Color {
    const color = this.instanceColor.setHex(look.materialColor);
    const generationShade = Math.min(0.18, node.generation * 0.018);
    switch (node.layer) {
      case "base":
        return color
          .multiplyScalar(0.72 - generationShade * 0.4)
          .lerp(this.layerTintColors.base, 0.22);
      case "tower":
        return color.multiplyScalar(0.92 - generationShade).lerp(this.layerTintColors.tower, 0.18);
      case "anvil":
        return color
          .multiplyScalar(1.04 - generationShade * 0.5)
          .lerp(this.layerTintColors.anvil, 0.28);
      case "veil":
        return color.multiplyScalar(0.82).lerp(this.layerTintColors.veil, 0.38);
    }
  }
}

export function getThreeBubbleLookPresetLabel(name: ThreeBubbleLookPresetName): string {
  return LOOK_PRESETS[name].label;
}

type CloudShaderUniforms = {
  scatterColor: { value: THREE.Color };
  scatterIntensity: { value: number };
  scatterPower: { value: number };
};

function createDisplacedSphereGeometry(
  radius: number,
  widthSegments: number,
  heightSegments: number
): THREE.SphereGeometry {
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const position = geometry.getAttribute("position");
  const normal = new THREE.Vector3();
  const vertex = new THREE.Vector3();
  for (let index = 0; index < position.count; index += 1) {
    vertex.fromBufferAttribute(position, index);
    normal.copy(vertex).normalize();
    const lumpy =
      1 +
      Math.sin(normal.x * 7.1 + normal.y * 4.3) * 0.045 +
      Math.cos(normal.z * 8.2 - normal.y * 3.4) * 0.035;
    vertex.copy(normal).multiplyScalar(radius * lumpy);
    position.setXYZ(index, vertex.x, vertex.y, vertex.z);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function getLayerScale(layer: BubbleLayer): { x: number; y: number; z: number } {
  switch (layer) {
    case "base":
      return { x: 1.12, y: 0.78, z: 0.9 };
    case "tower":
      return { x: 0.94, y: 1.08, z: 0.96 };
    case "anvil":
      return { x: 1.28, y: 0.68, z: 0.98 };
    case "veil":
      return { x: 1.42, y: 0.52, z: 1.06 };
  }
}

function getLayerParticleWeight(layer: BubbleLayer): number {
  switch (layer) {
    case "base":
      return 0.18;
    case "tower":
      return 0.54;
    case "anvil":
      return 0.82;
    case "veil":
      return 1;
  }
}

function createSoftParticleTexture(): THREE.CanvasTexture {
  const size = 64;
  const spriteCanvas = document.createElement("canvas");
  spriteCanvas.width = size;
  spriteCanvas.height = size;
  const context = spriteCanvas.getContext("2d");
  if (!context) {
    return new THREE.CanvasTexture(spriteCanvas);
  }

  const gradient = context.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, "rgba(255,255,255,0.72)");
  gradient.addColorStop(0.45, "rgba(255,255,255,0.18)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(spriteCanvas);
  texture.needsUpdate = true;
  return texture;
}

function createSoftGlowTexture(): THREE.CanvasTexture {
  const size = 256;
  const spriteCanvas = document.createElement("canvas");
  spriteCanvas.width = size;
  spriteCanvas.height = size;
  const context = spriteCanvas.getContext("2d");
  if (!context) {
    return new THREE.CanvasTexture(spriteCanvas);
  }

  const gradient = context.createRadialGradient(
    size * 0.38,
    size * 0.55,
    0,
    size * 0.42,
    size * 0.55,
    size * 0.62
  );
  gradient.addColorStop(0, "rgba(255,255,246,0.55)");
  gradient.addColorStop(0.4, "rgba(218,226,214,0.22)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(spriteCanvas);
  texture.needsUpdate = true;
  return texture;
}

function createSkyGradientTexture(look: ThreeBubbleLookPreset): THREE.CanvasTexture {
  const width = 32;
  const height = 256;
  const skyCanvas = document.createElement("canvas");
  skyCanvas.width = width;
  skyCanvas.height = height;
  const context = skyCanvas.getContext("2d");
  if (!context) {
    return new THREE.CanvasTexture(skyCanvas);
  }

  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, look.backgroundTop);
  gradient.addColorStop(0.52, look.backgroundMid);
  gradient.addColorStop(1, look.backgroundBottom);
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  const texture = new THREE.CanvasTexture(skyCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function getBubbleModelSignature(params: ReturnType<typeof mapCloudParamsToBubbleParams>): string {
  return [
    params.seed,
    params.maxInstances,
    params.minRadius,
    params.rootRadius,
    params.childCountMin,
    params.childCountMax,
    params.childRadiusMin,
    params.childRadiusMax,
    params.upwardBias,
    params.upliftSpeed,
    params.generationDamping,
    params.rotationDrift,
    params.lateralSpread,
    params.anvilSpread,
    params.spawnThreshold,
    params.edgeParticleDensity
  ]
    .map((value) => Number(value).toFixed(6))
    .join(":");
}

const defaultCloudParamsShim: CloudParams = {
  seed: 20260510,
  stormLifecycle: { stormAge: 0.48, phase: "mature" },
  humidityUplift: {
    humidity: 0.66,
    upliftStrength: 0.72,
    condensationRate: 0.28,
    evaporationRate: 0.065
  },
  anvilWind: {
    windShear: 0.18,
    anvilOutflow: 0.64,
    anvilPersistence: 0.68,
    turbulentEntrainment: 0.42,
    tropopauseHeight: 0.72
  },
  lightingHdr: {
    diffuseWhiteNits: 203,
    sunEdgePeakNits: 1000,
    masterDisplayPeakNits: 1000,
    maxCll: 1000,
    silverLining: 0.77,
    haze: 0.42
  },
  billowMorphology: {
    lobeScale: 0.6,
    lobeSharpness: 0.8,
    microBillowScale: 0.72,
    edgeScallop: 0.46,
    shadowDepth: 0.72,
    baseDeckHeight: 0.54,
    towerCrownHeight: 0.48,
    skyDarkness: 0.58,
    starterBlend: 0.86
  }
};
