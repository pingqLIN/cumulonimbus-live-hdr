export function configureCompactControlSurface(root: ParentNode): void {
  const shell = root.querySelector<HTMLElement>("#cumulonimbus-app");
  const timePanel = root.querySelector<HTMLElement>("#panel-time");
  const timeTitle = timePanel?.querySelector<HTMLElement>(".control-panel__title");
  const timeBody = timePanel?.querySelector<HTMLElement>(".control-panel__body");
  const timeGroup = timePanel?.querySelector<HTMLElement>(".control-group--time");
  if (!shell || !timePanel || !timeBody || !timeGroup) {
    return;
  }

  shell.classList.add("cloud-app-shell--compact");
  timePanel.hidden = false;
  timePanel.classList.add("control-panel--mobile-time");
  if (timeTitle) {
    timeTitle.textContent = "OBSERVATORY";
  }
  root.querySelector<HTMLElement>("#btn-time-reset")?.remove();
  timeGroup.classList.add("control-group--mobile-time");
  timeGroup.querySelector<HTMLElement>(".control-group__label")?.remove();
  const speedLabel = timeGroup.querySelector<HTMLLabelElement>('label[for="slider-time"]');
  if (speedLabel) {
    speedLabel.textContent = "SPEED";
  }
  const timeToggleButton = root.querySelector<HTMLButtonElement>("#btn-time-toggle");
  if (timeToggleButton) {
    const transportAction = document.createElement("div");
    transportAction.className = "compact-transport-action";
    timeToggleButton.classList.add("compact-play-toggle");
    timeToggleButton.dataset.playbackLabel = "play";
    transportAction.append(timeToggleButton);
    timeGroup.insertBefore(transportAction, timeGroup.firstElementChild);
  }
  const syncSystemButton = root.querySelector<HTMLButtonElement>("#btn-sync-system-time");
  const syncLocationButton = root.querySelector<HTMLButtonElement>("#btn-sync-location");
  const syncToggle = document.createElement("label");
  syncToggle.className = "compact-sync-toggle";
  syncToggle.innerHTML = `
    <input id="checkbox-sync-time" type="checkbox">
    <span>SYNC</span>
  `;
  syncSystemButton?.replaceWith(syncToggle);
  syncLocationButton?.remove();

  const gridButton = root.querySelector<HTMLButtonElement>("#btn-grid");
  const seedRow = root
    .querySelector<HTMLInputElement>("#input-seed")
    ?.closest<HTMLElement>(".slider-group");
  let seedToolsGroup: HTMLElement | null = null;
  if (seedRow) {
    seedToolsGroup = document.createElement("div");
    seedToolsGroup.className = "control-group control-group--compact-seed-tools";
    seedToolsGroup.innerHTML = '<span class="control-group__label">Seed</span>';
    seedRow.querySelector<HTMLButtonElement>("#btn-random-seed")?.replaceChildren();
    const randomSeedButton = seedRow.querySelector<HTMLButtonElement>("#btn-random-seed");
    if (randomSeedButton) {
      randomSeedButton.setAttribute("aria-label", "Randomize seed");
      randomSeedButton.title = "Randomize seed";
    }
    seedToolsGroup.append(seedRow);
  }

  const atmosphereGroup = root.querySelector<HTMLElement>(".control-group--atmosphere");
  if (atmosphereGroup) {
    atmosphereGroup.classList.add("control-group--compact-atmosphere");
    const atmosphereLabel = atmosphereGroup.querySelector<HTMLElement>(".control-group__label");
    if (atmosphereLabel) {
      atmosphereLabel.textContent = "TIME";
    }
    const atmosphereTimeRow = document.createElement("div");
    atmosphereTimeRow.className = "digital-group digital-group--atmosphere-time";
    atmosphereTimeRow.innerHTML = `
      <input id="input-atmosphere-time" class="time-input" type="time" step="60" value="09:00" aria-label="Atmosphere time">
    `;
    atmosphereTimeRow.append(syncToggle);
    atmosphereLabel?.after(atmosphereTimeRow);
    if (gridButton) {
      atmosphereGroup.append(gridButton);
    }
    for (const selector of [
      ".slider-group--sun",
      ".slider-group--elevation",
      ".slider-group--ambient",
      ".slider-group--angle"
    ]) {
      atmosphereGroup.querySelector<HTMLElement>(selector)?.remove();
    }
  }

  for (const group of [timeGroup, atmosphereGroup, seedToolsGroup]) {
    if (group) {
      timeBody.append(group);
    }
  }

  for (const key of ["mainPanel", "cloudPanel", "atmospherePanel"]) {
    root.querySelector<HTMLElement>(`[data-panel-key="${key}"]`)?.remove();
    root.querySelector<HTMLButtonElement>(`[data-panel-restore="${key}"]`)?.remove();
  }
}
