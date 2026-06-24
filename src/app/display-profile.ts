export type BrowserDisplayProfile = {
  readonly narrowViewport: boolean;
  readonly coarsePointer: boolean;
  readonly mobileWideView: boolean;
  readonly iosChrome: boolean;
};

export function detectBrowserDisplayProfile(): BrowserDisplayProfile {
  const narrowViewport = window.matchMedia("(max-width: 760px)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  return {
    narrowViewport,
    coarsePointer,
    mobileWideView: narrowViewport || coarsePointer,
    iosChrome: /\bCriOS\//i.test(navigator.userAgent) && /iP(?:hone|ad|od)/i.test(navigator.userAgent)
  };
}
