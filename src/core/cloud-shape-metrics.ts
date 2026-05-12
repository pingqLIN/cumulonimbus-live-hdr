import type { IterativeCloudField } from "./iterative-cloud-field.js";

export interface CloudShapeMetrics {
  densityThreshold: number;
  coverage: number;
  verticalExtent: number;
  centroidX: number;
  centroidY: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
  upperAnvilWidth: number;
  lowerTowerWidth: number;
  anvilToTowerWidthRatio: number;
  upperCoverage: number;
  lowerCoverage: number;
  bandCoverage: readonly number[];
}

export function sampleCloudShapeMetrics(
  field: IterativeCloudField,
  densityThreshold = 0.08,
  bandCount = 8
): CloudShapeMetrics {
  const width = field.width;
  const height = field.height;
  const bands = new Array(Math.max(1, Math.floor(bandCount))).fill(0);
  let cloudPixels = 0;
  let xTotal = 0;
  let yTotal = 0;
  let minX = width;
  let maxX = -1;
  let minY = height;
  let maxY = -1;
  let upperMinX = width;
  let upperMaxX = -1;
  let upperPixels = 0;
  let upperArea = 0;
  let lowerMinX = width;
  let lowerMaxX = -1;
  let lowerPixels = 0;
  let lowerArea = 0;

  for (let y = 0; y < height; y += 1) {
    const normalizedY = height <= 1 ? 0 : y / (height - 1);
    const bandIndex = Math.min(bands.length - 1, Math.floor(normalizedY * bands.length));
    const inUpperAnvilBand = normalizedY >= 0.02 && normalizedY <= 0.3;
    const inLowerTowerBand = normalizedY >= 0.52 && normalizedY <= 0.86;

    for (let x = 0; x < width; x += 1) {
      if (inUpperAnvilBand) {
        upperArea += 1;
      }
      if (inLowerTowerBand) {
        lowerArea += 1;
      }

      if (field.sampleDensityAt(x, y) <= densityThreshold) {
        continue;
      }

      cloudPixels += 1;
      xTotal += x;
      yTotal += y;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      bands[bandIndex] = (bands[bandIndex] ?? 0) + 1;

      if (inUpperAnvilBand) {
        upperPixels += 1;
        upperMinX = Math.min(upperMinX, x);
        upperMaxX = Math.max(upperMaxX, x);
      }
      if (inLowerTowerBand) {
        lowerPixels += 1;
        lowerMinX = Math.min(lowerMinX, x);
        lowerMaxX = Math.max(lowerMaxX, x);
      }
    }
  }

  const totalPixels = width * height;
  const normalizedBandCoverage = bands.map((pixels) => pixels / Math.max(1, width * Math.ceil(height / bands.length)));
  const upperAnvilWidth = normalizedWidth(upperMinX, upperMaxX, width);
  const lowerTowerWidth = normalizedWidth(lowerMinX, lowerMaxX, width);
  return {
    densityThreshold,
    coverage: cloudPixels / Math.max(1, totalPixels),
    verticalExtent: cloudPixels === 0 ? 0 : (maxY - minY + 1) / height,
    centroidX: cloudPixels === 0 || width <= 1 ? 0 : xTotal / cloudPixels / (width - 1),
    centroidY: cloudPixels === 0 || height <= 1 ? 0 : yTotal / cloudPixels / (height - 1),
    top: cloudPixels === 0 || height <= 1 ? 0 : minY / (height - 1),
    bottom: cloudPixels === 0 || height <= 1 ? 0 : maxY / (height - 1),
    left: cloudPixels === 0 || width <= 1 ? 0 : minX / (width - 1),
    right: cloudPixels === 0 || width <= 1 ? 0 : maxX / (width - 1),
    upperAnvilWidth,
    lowerTowerWidth,
    anvilToTowerWidthRatio:
      lowerTowerWidth <= 0 ? (upperAnvilWidth > 0 ? Number.POSITIVE_INFINITY : 0) : upperAnvilWidth / lowerTowerWidth,
    upperCoverage: upperPixels / Math.max(1, upperArea),
    lowerCoverage: lowerPixels / Math.max(1, lowerArea),
    bandCoverage: normalizedBandCoverage
  };
}

function normalizedWidth(minX: number, maxX: number, width: number): number {
  if (maxX < minX || width <= 0) {
    return 0;
  }
  return (maxX - minX + 1) / width;
}
