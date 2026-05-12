export interface ThreeBubbleTuning {
  cameraYawDegrees: number;
  cameraPitchDegrees: number;
  cameraDistanceScale: number;
  cameraTargetOffsetX: number;
  cameraTargetOffsetY: number;
  cameraTargetOffsetZ: number;
  sunAzimuthDegrees: number;
  sunElevationDegrees: number;
  sunIntensityScale: number;
  lightContrast: number;
  exposureScale: number;
}

export const DEFAULT_THREE_BUBBLE_TUNING: ThreeBubbleTuning = {
  cameraYawDegrees: 0,
  cameraPitchDegrees: 0,
  cameraDistanceScale: 1,
  cameraTargetOffsetX: 0,
  cameraTargetOffsetY: 0,
  cameraTargetOffsetZ: 0,
  sunAzimuthDegrees: 0,
  sunElevationDegrees: 0,
  sunIntensityScale: 1,
  lightContrast: 0.58,
  exposureScale: 1
};

export function normalizeThreeBubbleTuning(
  tuning: Partial<ThreeBubbleTuning> = {}
): ThreeBubbleTuning {
  return {
    cameraYawDegrees: clampFinite(
      tuning.cameraYawDegrees,
      DEFAULT_THREE_BUBBLE_TUNING.cameraYawDegrees,
      -45,
      45
    ),
    cameraPitchDegrees: clampFinite(
      tuning.cameraPitchDegrees,
      DEFAULT_THREE_BUBBLE_TUNING.cameraPitchDegrees,
      -24,
      24
    ),
    cameraDistanceScale: clampFinite(
      tuning.cameraDistanceScale,
      DEFAULT_THREE_BUBBLE_TUNING.cameraDistanceScale,
      0.62,
      1.5
    ),
    cameraTargetOffsetX: clampFinite(
      tuning.cameraTargetOffsetX,
      DEFAULT_THREE_BUBBLE_TUNING.cameraTargetOffsetX,
      -40,
      40
    ),
    cameraTargetOffsetY: clampFinite(
      tuning.cameraTargetOffsetY,
      DEFAULT_THREE_BUBBLE_TUNING.cameraTargetOffsetY,
      -40,
      40
    ),
    cameraTargetOffsetZ: clampFinite(
      tuning.cameraTargetOffsetZ,
      DEFAULT_THREE_BUBBLE_TUNING.cameraTargetOffsetZ,
      -40,
      40
    ),
    sunAzimuthDegrees: clampFinite(
      tuning.sunAzimuthDegrees,
      DEFAULT_THREE_BUBBLE_TUNING.sunAzimuthDegrees,
      -90,
      90
    ),
    sunElevationDegrees: clampFinite(
      tuning.sunElevationDegrees,
      DEFAULT_THREE_BUBBLE_TUNING.sunElevationDegrees,
      -45,
      45
    ),
    sunIntensityScale: clampFinite(
      tuning.sunIntensityScale,
      DEFAULT_THREE_BUBBLE_TUNING.sunIntensityScale,
      0.25,
      2.25
    ),
    lightContrast: clampFinite(
      tuning.lightContrast,
      DEFAULT_THREE_BUBBLE_TUNING.lightContrast,
      0,
      1
    ),
    exposureScale: clampFinite(
      tuning.exposureScale,
      DEFAULT_THREE_BUBBLE_TUNING.exposureScale,
      0.45,
      1.8
    )
  };
}

function clampFinite(
  value: number | undefined,
  fallback: number,
  min: number,
  max: number
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, value));
}
