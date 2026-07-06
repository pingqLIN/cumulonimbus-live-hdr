export function renderRestoreDock(compactControls: boolean): string {
  const restoreSuppressed = compactControls ? ' data-restore-suppressed="true"' : "";

  return `
      <div id="panel-restore-dock" class="panel-restore-dock" hidden${restoreSuppressed} aria-label="Closed panels">
        <button type="button" data-hud-restore hidden>HUD</button>
        <button type="button" data-panel-restore="mainPanel" hidden>Main</button>
        <button type="button" data-panel-restore="timePanel" hidden>Time</button>
        <button id="dock-time-toggle" class="dock-time-toggle" type="button" hidden>PAUSE</button>
        <button type="button" data-panel-restore="cloudPanel" hidden>Cloud</button>
        <button type="button" data-panel-restore="atmospherePanel" hidden>Atmosphere</button>
        <button type="button" data-panel-restore="advancedPanel" hidden>Advanced</button>
      </div>`;
}
