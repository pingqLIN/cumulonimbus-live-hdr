export function bindStageEdgeFill(renderContainer: HTMLElement): () => void {
  const update = () => {
    const rect = renderContainer.getBoundingClientRect();
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty("--stage-render-top", `${Math.max(0, rect.top)}px`);
    rootStyle.setProperty("--stage-render-right", `${Math.max(0, rect.right)}px`);
    rootStyle.setProperty("--stage-render-bottom", `${Math.max(0, rect.bottom)}px`);
    rootStyle.setProperty("--stage-render-left", `${Math.max(0, rect.left)}px`);
  };
  const observer = new ResizeObserver(update);
  observer.observe(renderContainer);
  window.addEventListener("resize", update);
  requestAnimationFrame(update);

  return () => {
    observer.disconnect();
    window.removeEventListener("resize", update);
  };
}
