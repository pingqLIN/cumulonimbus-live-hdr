export type ThreeBubbleLookPresetName = "structural" | "demo-like" | "soft-volumetric-ish";

export function normalizeThreeBubbleLookPresetName(raw: string | null): ThreeBubbleLookPresetName {
  const value = raw?.toLowerCase().trim();
  if (value === "demo" || value === "demo-like" || value === "reference") {
    return "demo-like";
  }
  if (value === "soft" || value === "volumetric" || value === "soft-volumetric-ish") {
    return "soft-volumetric-ish";
  }
  return "structural";
}
