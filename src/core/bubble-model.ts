import { defaultBubbleModelParams, type BubbleModelParams } from "./bubble-params.js";

export interface BubbleNode {
  id: number;
  parentId: number | null;
  generation: number;
  layer: BubbleLayer;
  x: number;
  y: number;
  z: number;
  radius: number;
  maxRadius: number;
  active: boolean;
  spawned: boolean;
  surfacePhase: number;
  edgeParticleWeight: number;
}

export type BubbleLayer = "base" | "tower" | "anvil" | "veil";

export interface BubbleModelMetrics {
  totalNodes: number;
  activeNodes: number;
  maxGeneration: number;
  matureRatio: number;
  averageRadius: number;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
  };
}

export class BubbleModel {
  private params: BubbleModelParams = { ...defaultBubbleModelParams };
  private nodes: BubbleNode[] = [];
  private rng = createSeededRandom(defaultBubbleModelParams.seed);
  private nextId = 0;

  constructor(params: BubbleModelParams = defaultBubbleModelParams) {
    this.reset(params);
  }

  reset(params: BubbleModelParams = this.params): void {
    this.params = normalizeBubbleParams(params);
    this.rng = createSeededRandom(this.params.seed);
    this.nodes = [];
    this.nextId = 0;
    this.seedInitialStructure();
  }

  step(deltaSeconds: number): BubbleModelMetrics {
    const dt = Math.min(0.12, Math.max(0, deltaSeconds));
    const initialLength = this.nodes.length;

    for (let index = 0; index < initialLength; index += 1) {
      const node = this.nodes[index];
      if (!node || !node.active) {
        continue;
      }
      this.updateNode(node, dt);
    }

    return this.getMetrics();
  }

  getNodes(): readonly BubbleNode[] {
    return this.nodes;
  }

  getMetrics(): BubbleModelMetrics {
    let activeNodes = 0;
    let maxGeneration = 0;
    let radiusTotal = 0;
    const bounds = {
      minX: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
      minZ: Number.POSITIVE_INFINITY,
      maxZ: Number.NEGATIVE_INFINITY
    };

    for (const node of this.nodes) {
      if (node.active) {
        activeNodes += 1;
      }
      maxGeneration = Math.max(maxGeneration, node.generation);
      radiusTotal += node.radius;
      bounds.minX = Math.min(bounds.minX, node.x - node.radius);
      bounds.maxX = Math.max(bounds.maxX, node.x + node.radius);
      bounds.minY = Math.min(bounds.minY, node.y - node.radius);
      bounds.maxY = Math.max(bounds.maxY, node.y + node.radius);
      bounds.minZ = Math.min(bounds.minZ, node.z - node.radius);
      bounds.maxZ = Math.max(bounds.maxZ, node.z + node.radius);
    }

    if (this.nodes.length === 0) {
      bounds.minX = 0;
      bounds.maxX = 0;
      bounds.minY = 0;
      bounds.maxY = 0;
      bounds.minZ = 0;
      bounds.maxZ = 0;
    }

    return {
      totalNodes: this.nodes.length,
      activeNodes,
      maxGeneration,
      matureRatio:
        this.nodes.length === 0 ? 0 : (this.nodes.length - activeNodes) / this.nodes.length,
      averageRadius: this.nodes.length === 0 ? 0 : radiusTotal / this.nodes.length,
      bounds
    };
  }

  private updateNode(node: BubbleNode, deltaSeconds: number): void {
    if (node.radius < node.maxRadius) {
      const growthRate =
        this.params.upliftSpeed / (node.generation * this.params.generationDamping + 1);
      node.radius = Math.min(node.maxRadius, node.radius + growthRate * deltaSeconds);
      node.y += (this.params.upliftSpeed / (node.generation + 1)) * deltaSeconds;
      node.x +=
        Math.sin(node.surfacePhase + node.y * 0.17) * this.params.rotationDrift * deltaSeconds;
      node.z +=
        Math.cos(node.surfacePhase + node.y * 0.13) * this.params.rotationDrift * deltaSeconds;
    }

    if (node.radius >= node.maxRadius * this.params.spawnThreshold && !node.spawned) {
      node.spawned = true;
      if (this.hasInstanceCapacity()) {
        this.spawnChildren(node);
      }
    }

    if (node.radius >= node.maxRadius && node.spawned) {
      node.active = false;
    }
  }

  private spawnChildren(parent: BubbleNode): void {
    const childCount = this.randomInteger(this.params.childCountMin, this.params.childCountMax);

    for (let index = 0; index < childCount; index += 1) {
      if (!this.hasInstanceCapacity()) {
        return;
      }

      const childMaxRadius =
        parent.maxRadius * this.randomRange(this.params.childRadiusMin, this.params.childRadiusMax);
      if (childMaxRadius < this.params.minRadius) {
        continue;
      }

      const angle = this.rng() * Math.PI * 2;
      const elevation = this.rng() * (Math.PI / 2);
      this.nodes.push(
        this.createNode({
          parent,
          direction: { angle, elevation },
          maxRadius: childMaxRadius,
          generation: parent.generation + 1,
          layer: this.resolveChildLayer(parent, elevation)
        })
      );
    }
  }

  private seedInitialStructure(): void {
    const baseCount = Math.max(5, Math.min(10, Math.round(5 + this.params.lateralSpread * 4)));
    const towerCount = Math.max(3, Math.min(6, Math.round(3 + this.params.upwardBias * 3)));
    const anvilCount = Math.max(4, Math.min(9, Math.round(4 + this.params.anvilSpread * 4)));
    const baseSpan = this.params.rootRadius * (1.6 + this.params.lateralSpread * 0.8);
    const anvilSpan = this.params.rootRadius * (1.8 + this.params.anvilSpread * 1.6);

    for (let index = 0; index < baseCount; index += 1) {
      if (!this.hasInstanceCapacity()) {
        return;
      }

      const t = baseCount === 1 ? 0.5 : index / (baseCount - 1);
      const jitter = (this.rng() - 0.5) * this.params.rootRadius * 0.8;
      this.nodes.push(
        this.createNode({
          parent: null,
          direction: null,
          maxRadius: this.params.rootRadius * this.randomRange(0.48, 0.82),
          generation: 0,
          layer: "base",
          rootX: (t - 0.5) * baseSpan + jitter,
          rootY: this.randomRange(-0.35, 0.95),
          rootZ: (this.rng() - 0.5) * this.params.rootRadius * 0.9,
          initialRadiusRatio: this.randomRange(0.62, 0.94)
        })
      );
    }

    for (let index = 0; index < towerCount; index += 1) {
      if (!this.hasInstanceCapacity()) {
        return;
      }

      const lift = index / Math.max(1, towerCount - 1);
      this.nodes.push(
        this.createNode({
          parent: null,
          direction: null,
          maxRadius: this.params.rootRadius * this.randomRange(0.58, 1.04) * (1 - lift * 0.18),
          generation: index,
          layer: "tower",
          rootX: (this.rng() - 0.5) * this.params.rootRadius * 0.74,
          rootY:
            lift * this.params.rootRadius * (1.85 + this.params.upwardBias) +
            this.randomRange(1.1, 2.4),
          rootZ: (this.rng() - 0.5) * this.params.rootRadius * 0.64,
          initialRadiusRatio: this.randomRange(0.48, 0.82)
        })
      );
    }

    for (let index = 0; index < anvilCount; index += 1) {
      if (!this.hasInstanceCapacity()) {
        return;
      }

      const t = anvilCount === 1 ? 0.5 : index / (anvilCount - 1);
      const sideBias = t - 0.5;
      this.nodes.push(
        this.createNode({
          parent: null,
          direction: null,
          maxRadius: this.params.rootRadius * this.randomRange(0.38, 0.68),
          generation: towerCount + index,
          layer: index % 3 === 0 ? "veil" : "anvil",
          rootX: sideBias * anvilSpan + (this.rng() - 0.5) * this.params.rootRadius * 0.9,
          rootY:
            this.params.rootRadius * (2.0 + this.params.upwardBias * 1.25) +
            this.randomRange(-0.55, 1.1),
          rootZ: (this.rng() - 0.5) * this.params.rootRadius * (1.0 + this.params.anvilSpread),
          initialRadiusRatio: this.randomRange(0.42, 0.76)
        })
      );
    }
  }

  private hasInstanceCapacity(): boolean {
    return this.nodes.length < this.params.maxInstances;
  }

  private resolveChildLayer(parent: BubbleNode, elevation: number): BubbleLayer {
    if (parent.layer === "base" && elevation < 0.38) {
      return "base";
    }
    if (parent.layer === "anvil" || parent.layer === "veil") {
      return this.rng() > 0.32 ? "veil" : "anvil";
    }
    const highAltitude = parent.y > this.params.rootRadius * (1.9 + this.params.upwardBias);
    if (highAltitude || parent.generation > 3) {
      return this.rng() > 0.22 ? "anvil" : "veil";
    }
    return "tower";
  }

  private createNode(options: {
    parent: BubbleNode | null;
    direction: { angle: number; elevation: number } | null;
    maxRadius: number;
    generation: number;
    layer: BubbleLayer;
    rootX?: number;
    rootY?: number;
    rootZ?: number;
    initialRadiusRatio?: number;
  }): BubbleNode {
    const { parent, direction, maxRadius, generation, layer } = options;
    let x = options.rootX ?? 0;
    let y = options.rootY ?? 0;
    let z = options.rootZ ?? 0;

    if (parent && direction) {
      const horizontal = Math.cos(direction.elevation);
      const anvilLift = Math.max(0, parent.generation - 1) * this.params.anvilSpread * 0.08;
      const offsetScale = parent.maxRadius * (0.72 + this.params.lateralSpread * 0.26);
      x = parent.x + Math.cos(direction.angle) * horizontal * offsetScale * (1 + anvilLift);
      y = parent.y + (Math.sin(direction.elevation) + this.params.upwardBias) * offsetScale * 0.62;
      z = parent.z + Math.sin(direction.angle) * horizontal * offsetScale * (1 + anvilLift);
    }

    return {
      id: this.nextId++,
      parentId: parent?.id ?? null,
      generation,
      layer,
      x,
      y,
      z,
      radius: Math.max(0.01, maxRadius * (options.initialRadiusRatio ?? 0.01)),
      maxRadius,
      active: true,
      spawned: false,
      surfacePhase: this.rng() * Math.PI * 2,
      edgeParticleWeight: this.rng() * this.params.edgeParticleDensity
    };
  }

  private randomRange(minimum: number, maximum: number): number {
    return minimum + (maximum - minimum) * this.rng();
  }

  private randomInteger(minimum: number, maximum: number): number {
    return Math.floor(this.randomRange(minimum, maximum + 1));
  }
}

export function normalizeBubbleParams(params: BubbleModelParams): BubbleModelParams {
  const childCountMin = Math.max(0, Math.floor(params.childCountMin));
  const childRadiusMin = Math.max(0.01, params.childRadiusMin);

  return {
    ...params,
    maxInstances: Math.max(1, Math.floor(params.maxInstances)),
    minRadius: Math.max(0.01, params.minRadius),
    rootRadius: Math.max(0.01, params.rootRadius),
    childCountMin,
    childCountMax: Math.max(childCountMin, Math.floor(params.childCountMax)),
    childRadiusMin,
    childRadiusMax: Math.max(childRadiusMin, params.childRadiusMax),
    spawnThreshold: Math.min(0.98, Math.max(0.1, params.spawnThreshold))
  };
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  if (state === 0) {
    state = 0x9e3779b9;
  }
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}
