import { enableRestoreDock, updateRestoreDock } from "./controls.js";

const PANEL_DRAG_START_THRESHOLD_PX = 4;

export function bindPanels(root: ParentNode): void {
  const panels = [...root.querySelectorAll<HTMLElement>(".control-panel[data-panel-key]")];
  for (const panel of panels) {
    const panelKey = panel.dataset.panelKey;
    if (!panelKey) {
      continue;
    }
    bindPanelDrag(panel);
  }

  for (const button of root.querySelectorAll<HTMLButtonElement>("[data-panel-close]")) {
    button.addEventListener("click", () => {
      const panel = root.querySelector<HTMLElement>(`[data-panel-key="${button.dataset.panelClose}"]`);
      if (panel) {
        panel.hidden = true;
        enableRestoreDock(root);
        updateRestoreDock(root);
      }
    });
  }

  for (const button of root.querySelectorAll<HTMLButtonElement>("[data-panel-restore]")) {
    button.addEventListener("click", () => {
      const panel = root.querySelector<HTMLElement>(`[data-panel-key="${button.dataset.panelRestore}"]`);
      if (panel) {
        panel.hidden = false;
        updateRestoreDock(root);
      }
    });
  }

  for (const button of root.querySelectorAll<HTMLButtonElement>("[data-panel-minimize]")) {
    button.addEventListener("click", () => {
      const panel = root.querySelector<HTMLElement>(`[data-panel-key="${button.dataset.panelMinimize}"]`);
      if (!panel) {
        return;
      }
      const collapsed = panel.dataset.panelCollapsed !== "true";
      panel.dataset.panelCollapsed = collapsed ? "true" : "false";
      button.textContent = collapsed ? "+" : "-";
      button.setAttribute("aria-expanded", collapsed ? "false" : "true");
    });
  }

  root.querySelector<HTMLButtonElement>("#btn-hud-close")?.addEventListener("click", () => {
    const hud = root.querySelector<HTMLElement>("#cloud-hud");
    if (hud) {
      hud.hidden = true;
      enableRestoreDock(root);
      updateRestoreDock(root);
    }
  });
  root.querySelector<HTMLButtonElement>("[data-hud-restore]")?.addEventListener("click", () => {
    const hud = root.querySelector<HTMLElement>("#cloud-hud");
    if (hud) {
      hud.hidden = false;
      updateRestoreDock(root);
    }
  });

  updateRestoreDock(root);
}

function bindPanelDrag(panel: HTMLElement): void {
  if (panel.classList.contains("control-panel--mobile-time")) {
    return;
  }

  const handle = panel.querySelector<HTMLElement>(".control-panel__chrome");
  if (!handle) {
    return;
  }

  let pointerArmed = false;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;
  let activePointerId: number | undefined;
  let pendingLeft = 0;
  let pendingTop = 0;
  let hasPendingPosition = false;
  let animationFrame: number | undefined;

  const applyPendingPosition = (): void => {
    animationFrame = undefined;
    if (!hasPendingPosition) {
      return;
    }
    panel.style.left = `${pendingLeft}px`;
    panel.style.top = `${pendingTop}px`;
    panel.style.right = "auto";
    panel.style.bottom = "auto";
    panel.style.transform = "none";
    panel.dataset.floatingCustomized = "true";
    hasPendingPosition = false;
  };

  const schedulePositionUpdate = (): void => {
    if (animationFrame !== undefined) {
      return;
    }
    animationFrame = requestAnimationFrame(applyPendingPosition);
  };

  const endDrag = (event?: PointerEvent): void => {
    if ((!pointerArmed && !dragging) || (event && event.pointerId !== activePointerId)) {
      return;
    }
    const wasDragging = dragging;
    pointerArmed = false;
    dragging = false;
    if (wasDragging && animationFrame !== undefined) {
      cancelAnimationFrame(animationFrame);
      applyPendingPosition();
    } else if (animationFrame !== undefined) {
      cancelAnimationFrame(animationFrame);
      animationFrame = undefined;
    }
    hasPendingPosition = false;
    panel.classList.remove("floating-panel--dragging");
    if (activePointerId !== undefined && handle.hasPointerCapture(activePointerId)) {
      try {
        handle.releasePointerCapture(activePointerId);
      } catch {
        // Ignore release races after the browser has already cancelled capture.
      }
    }
    activePointerId = undefined;
  };

  handle.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || panel.hidden) {
      return;
    }
    const target = event.target as HTMLElement | null;
    if (target?.closest("button, input, select, textarea, a")) {
      return;
    }
    const rect = panel.getBoundingClientRect();
    pointerArmed = true;
    dragging = false;
    startX = event.clientX;
    startY = event.clientY;
    startLeft = rect.left;
    startTop = rect.top;
    activePointerId = event.pointerId;
    handle.setPointerCapture(event.pointerId);
  });

  handle.addEventListener("pointermove", (event) => {
    if (!pointerArmed || event.pointerId !== activePointerId) {
      return;
    }
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (!dragging) {
      const dragDistance = Math.hypot(deltaX, deltaY);
      if (dragDistance < PANEL_DRAG_START_THRESHOLD_PX) {
        return;
      }
      dragging = true;
      panel.classList.add("floating-panel--dragging");
    }
    pendingLeft = clamp(startLeft + deltaX, 8, window.innerWidth - 80);
    pendingTop = clamp(startTop + deltaY, 8, window.innerHeight - 42);
    hasPendingPosition = true;
    schedulePositionUpdate();
    event.preventDefault();
  });

  handle.addEventListener("pointerup", endDrag);
  handle.addEventListener("pointercancel", endDrag);
  handle.addEventListener("lostpointercapture", () => endDrag());
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}
