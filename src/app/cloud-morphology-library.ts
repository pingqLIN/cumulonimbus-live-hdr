import { CLOUD_MORPHOLOGY_STYLES, type CloudMorphologyStyle } from "./raymarch-cloud-renderer.js";

export type CloudMorphologyLibraryEntry = {
  readonly value: CloudMorphologyStyle;
  readonly label: string;
  readonly code: string;
  readonly intent: string;
  readonly traits: readonly string[];
};

export const CLOUD_MORPHOLOGY_LIBRARY = [
  {
    value: "seeded",
    label: "Seeded pool",
    code: "M00",
    intent: "Seed-driven blend of macro silhouette, surface breakup, and edge traits.",
    traits: ["seed blend", "organic edge", "variable"]
  },
  {
    value: "baseline",
    label: "Base sphere",
    code: "M01",
    intent: "Near-spherical control form with reduced surface and boundary aggression.",
    traits: ["control", "round body", "soft edge"]
  },
  {
    value: "macro-boundary",
    label: "Macro edge",
    code: "M02",
    intent:
      "Amplifies protrusions, compression, stretch, contour ridges, and hard silhouette changes.",
    traits: ["hard contour", "stretch", "notches"]
  },
  {
    value: "flatten",
    label: "Flattened",
    code: "M03",
    intent: "Compresses the vertical body into a wider, lower cloud mass.",
    traits: ["wide body", "compressed", "low crown"]
  },
  {
    value: "skew-twist",
    label: "Skew twist",
    code: "M04",
    intent: "Adds oblique lean, shear displacement, and visible twist to the cloud topology.",
    traits: ["lean", "twist", "shear"]
  },
  {
    value: "tear-silk",
    label: "Tear silk",
    code: "M05",
    intent: "Pushes fuzzy shells, wind-tear breakup, and silk-like edge dissipation.",
    traits: ["wispy", "torn edge", "dissipating"]
  },
  {
    value: "budding",
    label: "Budding",
    code: "M06",
    intent: "Smooth-union large body plus attached bud and neck for a paired cloud form.",
    traits: ["large-small", "neck", "attached bud"]
  },
  {
    value: "giant-cumulonimbus",
    label: "Giant Cb",
    code: "M07",
    intent: "Original cumulonimbus tower and anvil profile preserved as a named morphology member.",
    traits: ["tower", "anvil", "classic Cb"]
  }
] as const satisfies readonly CloudMorphologyLibraryEntry[];

const MORPHOLOGY_STYLE_VALUES = new Set<string>(CLOUD_MORPHOLOGY_STYLES);

export function getCloudMorphologyEntry(
  value: CloudMorphologyStyle | undefined
): CloudMorphologyLibraryEntry {
  return (
    CLOUD_MORPHOLOGY_LIBRARY.find((entry) => entry.value === value) ?? CLOUD_MORPHOLOGY_LIBRARY[0]!
  );
}

export function isCloudMorphologyStyle(value: string | undefined): value is CloudMorphologyStyle {
  return value !== undefined && MORPHOLOGY_STYLE_VALUES.has(value);
}

export function resolveCloudMorphologyStyleAlias(
  value: string | null | undefined
): CloudMorphologyStyle | undefined {
  switch (value?.toLowerCase()) {
    case "seeded":
    case "seed":
    case "random":
    case "pool":
    case "recipe":
      return "seeded";
    case "baseline":
    case "base":
    case "sphere":
    case "original-sphere":
      return "baseline";
    case "macro-boundary":
    case "macro":
    case "boundary":
    case "contrast":
    case "supercontrast":
      return "macro-boundary";
    case "flatten":
    case "flat":
    case "compressed":
    case "compression":
      return "flatten";
    case "skew-twist":
    case "skew":
    case "twist":
    case "oblique":
      return "skew-twist";
    case "tear-silk":
    case "tear":
    case "silk":
    case "wind":
    case "dissipating":
      return "tear-silk";
    case "budding":
    case "bud":
    case "yeast":
    case "large-small":
    case "binary":
      return "budding";
    case "giant-cumulonimbus":
    case "giant":
    case "cumulonimbus":
    case "cb":
    case "tower":
      return "giant-cumulonimbus";
    default:
      return undefined;
  }
}
