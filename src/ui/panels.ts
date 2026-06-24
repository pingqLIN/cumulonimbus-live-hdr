import { enableRestoreDock, updateRestoreDock } from "./controls.js";

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
  const handle = panel.querySelector<HTMLElement>(".control-panel__chrome");
  if (!handle) {
    return;
  }

  let dragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  handle.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || panel.hidden) {
      return;
    }
    const target = event.target as HTMLElement | null;
    if (target?.closest("button, input, select, textarea, a")) {
      return;
    }
    const rect = panel.getBoundingClientRect();
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    startLeft = rect.left;
    startTop = rect.top;
    panel.classList.add("floating-panel--dragging");
    panel.setPointerCapture(event.pointerId);
  });

  handle.addEventListener("pointermove", (event) => {
    if (!dragging) {
      return;
    }
    const nextLeft = clamp(startLeft + event.clientX - startX, 8, window.innerWidth - 80);
    const nextTop = clamp(startTop + event.clientY - startY, 8, window.innerHeight - 42);
    panel.style.left = `${nextLeft}px`;
    panel.style.top = `${nextTop}px`;
    panel.style.right = "auto";
    panel.style.bottom = "auto";
    panel.style.transform = "none";
    panel.dataset.floatingCustomized = "true";
  });

  handle.addEventListener("pointerup", (event) => {
    if (!dragging) {
      return;
    }
    dragging = false;
    panel.classList.remove("floating-panel--dragging");
    panel.releasePointerCapture(event.pointerId);
  });
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}
