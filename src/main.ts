import { atlasCells, describeCell } from "./noise/presets";
import { getNoiseDefinition } from "./noise/registry";
import type { AtlasCell, NoiseParameter } from "./noise/types";
import { WebGlNoiseRenderer } from "./renderer/webgl";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app root element.");
}

const root = app;
injectStyles();

let selectedIndex = 0;
let atlasRenderer: WebGlNoiseRenderer | null = null;
let previewRenderer: WebGlNoiseRenderer | null = null;
let renderFrame: number | null = null;

const maxPixelRatio = 2;

root.innerHTML = `
  <main class="app-shell">
    <aside class="panel left-panel" aria-label="Noise controls">
      <div class="control-group compact">
        <h2 data-noise-name></h2>
        <p data-noise-description></p>
      </div>
      <form class="parameter-form" aria-label="Noise parameters"></form>
    </aside>

    <section class="atlas-panel" aria-label="Atlas grid">
      <div class="atlas-toolbar">
        <div>
          <p class="eyebrow">Atlas Grid</p>
          <h2>Browse presets</h2>
        </div>
        <p class="hint">Arrow keys move selection.</p>
      </div>
      <div class="atlas-stage">
        <canvas class="atlas-canvas" aria-hidden="true"></canvas>
        <div class="atlas-grid"></div>
      </div>
    </section>

    <aside class="panel right-panel" aria-label="Selected preview">
      <div>
        <p class="eyebrow">Selected Preview</p>
        <h2 data-selected-name></h2>
      </div>
      <canvas class="preview-canvas" aria-label="Large selected noise preview"></canvas>
      <dl class="metadata"></dl>
    </aside>
  </main>
`;

const atlasCanvas = query<HTMLCanvasElement>(".atlas-canvas");
const atlasStage = query<HTMLDivElement>(".atlas-stage");
const previewCanvas = query<HTMLCanvasElement>(".preview-canvas");
const grid = query<HTMLDivElement>(".atlas-grid");
const selectedName = query<HTMLHeadingElement>("[data-selected-name]");
const metadata = query<HTMLDListElement>(".metadata");
const noiseName = query<HTMLHeadingElement>("[data-noise-name]");
const noiseDescription = query<HTMLParagraphElement>("[data-noise-description]");
const parameterForm = query<HTMLFormElement>(".parameter-form");

try {
  atlasRenderer = new WebGlNoiseRenderer(atlasCanvas);
  previewRenderer = new WebGlNoiseRenderer(previewCanvas);
  renderGridButtons();
  renderSelection();
  queueRender();

  const resizeObserver = new ResizeObserver(queueRender);
  resizeObserver.observe(atlasStage);
  resizeObserver.observe(previewCanvas);
} catch (error) {
  showFatalError(error);
}

window.addEventListener("resize", queueRender);
grid.addEventListener("keydown", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement) || !target.classList.contains("atlas-cell")) {
    return;
  }

  if (event.key === "ArrowRight") {
    moveSelection(1);
    event.preventDefault();
  } else if (event.key === "ArrowLeft") {
    moveSelection(-1);
    event.preventDefault();
  } else if (event.key === "ArrowDown") {
    moveSelection(getColumnCount());
    event.preventDefault();
  } else if (event.key === "ArrowUp") {
    moveSelection(-getColumnCount());
    event.preventDefault();
  }
});

function renderGridButtons(): void {
  grid.innerHTML = "";

  for (const [index, cell] of atlasCells.entries()) {
    const button = document.createElement("button");
    button.className = "atlas-cell";
    button.type = "button";
    button.dataset.cellId = cell.id;
    button.setAttribute("aria-label", `${cell.label}, ${describeCell(cell)}`);
    button.addEventListener("click", () => {
      selectedIndex = index;
      renderSelection();
      queueRender();
    });

    button.innerHTML = `
      <span class="cell-label">${cell.label}</span>
      <span class="cell-meta">${describeCell(cell)}</span>
    `;

    grid.append(button);
  }
}

function renderSelection(): void {
  const selected = getSelectedCell();
  const definition = getNoiseDefinition(selected.noiseId);
  noiseName.textContent = definition.name;
  noiseDescription.textContent = definition.description;
  selectedName.textContent = selected.label;
  renderSelectedMetadata(selected, definition.parameters);
  renderParameterControls(selected, definition.parameters);
  updateGridSelection();
}

function updateGridSelection(): void {
  for (const [index, button] of getCellButtons().entries()) {
    const isSelected = index === selectedIndex;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
    button.tabIndex = isSelected ? 0 : -1;
    const cell = atlasCells[index];
    button.setAttribute("aria-label", `${cell.label}, ${describeCell(cell)}`);
    button.querySelector(".cell-meta")?.replaceChildren(document.createTextNode(describeCell(cell)));
  }
}

function renderSelectedMetadata(cell: AtlasCell, parameters: NoiseParameter[]): void {
  metadata.innerHTML = renderMetadata(cell, parameters);
}

function renderParameterControls(cell: AtlasCell, parameters: NoiseParameter[]): void {
  parameterForm.innerHTML = "";

  for (const parameter of parameters) {
    const value = cell.params[parameter.name] ?? parameter.defaultValue;
    const group = document.createElement("label");
    group.className = "parameter-control";
    group.innerHTML = `
      <span>
        <span class="field-label">${parameter.label}</span>
        <span class="parameter-value">${formatParameterValue(value, parameter)}</span>
      </span>
      <input
        type="range"
        name="${parameter.name}"
        min="${parameter.min}"
        max="${parameter.max}"
        step="${parameter.step}"
        value="${value}"
      />
    `;

    const input = group.querySelector<HTMLInputElement>("input");
    const output = group.querySelector<HTMLSpanElement>(".parameter-value");

    if (!input || !output) {
      throw new Error(`Unable to render parameter control: ${parameter.name}`);
    }

    input.addEventListener("input", () => {
      const nextValue = parameter.type === "int" ? Math.round(input.valueAsNumber) : input.valueAsNumber;
      cell.params[parameter.name] = nextValue;
      input.value = String(nextValue);
      output.textContent = formatParameterValue(nextValue, parameter);
      renderSelectedMetadata(cell, parameters);
      updateGridSelection();
      queueRender();
    });

    parameterForm.append(group);
  }
}

function renderMetadata(cell: AtlasCell, parameters: NoiseParameter[]): string {
  const source = getNoiseDefinition(cell.noiseId);
  const rows = [
    `<div><dt>Source</dt><dd>${escapeHtml(source.name)}</dd></div>`,
    ...parameters.map((parameter) => {
      const value = cell.params[parameter.name] ?? parameter.defaultValue;
      return `<div><dt>${escapeHtml(parameter.label)}</dt><dd>${formatParameterValue(value, parameter)}</dd></div>`;
    })
  ];

  return rows.join("");
}

function queueRender(): void {
  if (renderFrame !== null) {
    return;
  }

  renderFrame = requestAnimationFrame(() => {
    renderFrame = null;
    renderCanvases();
  });
}

function renderCanvases(): void {
  if (!atlasRenderer || !previewRenderer) {
    return;
  }

  const pixelRatio = Math.min(window.devicePixelRatio, maxPixelRatio);
  const stageRect = atlasStage.getBoundingClientRect();

  atlasRenderer.resize(stageRect.width, stageRect.height, pixelRatio);

  const drawItems = getCellButtons().map((button, index) => {
    const rect = button.getBoundingClientRect();
    return {
      cell: atlasCells[index],
      rect: new DOMRect(rect.left - stageRect.left, rect.top - stageRect.top, rect.width, rect.height)
    };
  });

  atlasRenderer.render(drawItems, pixelRatio);

  const previewRect = previewCanvas.getBoundingClientRect();
  previewRenderer.resize(previewRect.width, previewRect.height, pixelRatio);
  previewRenderer.renderSingle(getSelectedCell(), pixelRatio);
}

function moveSelection(delta: number): void {
  selectedIndex = Math.min(atlasCells.length - 1, Math.max(0, selectedIndex + delta));
  renderSelection();
  queueRender();
  getCellButtons()[selectedIndex]?.focus();
}

function getSelectedCell(): AtlasCell {
  return atlasCells[selectedIndex];
}

function getCellButtons(): HTMLButtonElement[] {
  return Array.from(grid.querySelectorAll<HTMLButtonElement>(".atlas-cell"));
}

function getColumnCount(): number {
  const first = getCellButtons()[0];

  if (!first) {
    return 1;
  }

  const firstTop = first.offsetTop;
  return getCellButtons().filter((button) => button.offsetTop === firstTop).length || 1;
}

function showFatalError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  root.innerHTML = `
    <main class="fatal-error">
      <h1>Unable to start Noise Atlas</h1>
      <pre>${escapeHtml(message)}</pre>
    </main>
  `;
}

function query<T extends Element>(selector: string): T {
  const element = root.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }

  return element;
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function formatParameterValue(value: number, parameter: NoiseParameter): string {
  return parameter.type === "int" ? String(Math.round(value)) : value.toFixed(2).replace(/\.?0+$/, "");
}

function injectStyles(): void {
  const style = document.createElement("style");
  style.textContent = `
:root {
  color: #e9edf0;
  background: #13151a;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
}

body {
  min-width: 320px;
  margin: 0;
}

button,
input {
  font: inherit;
}

.app-shell {
  display: grid;
  grid-template-columns: minmax(220px, 270px) minmax(340px, 1fr) minmax(260px, 340px);
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0)),
    #13151a;
}

.panel,
.atlas-panel {
  min-width: 0;
  padding: 24px;
}

.left-panel {
  border-right: 1px solid rgba(255, 255, 255, 0.09);
  background: #171a20;
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
  border-left: 1px solid rgba(255, 255, 255, 0.09);
  background: #191b20;
}

.atlas-panel {
  display: flex;
  min-height: 0;
  flex-direction: column;
  gap: 18px;
}

.atlas-toolbar {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #8fb9c9;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  max-width: 11ch;
  margin-bottom: 0;
  font-size: 2rem;
  line-height: 1.05;
}

h2 {
  margin-bottom: 0;
  font-size: 1rem;
  line-height: 1.25;
}

p,
li,
dd {
  color: #b4bdc4;
}

.control-group {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.09);
}

.left-panel > .control-group:first-child {
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
}

.control-group p,
.hint {
  margin-bottom: 0;
  font-size: 0.9rem;
  line-height: 1.55;
}

.field-label {
  display: block;
  color: #8fb9c9;
  font-size: 0.72rem;
  font-weight: 800;
  line-height: 1.25;
  text-transform: uppercase;
}

.parameter-control input:focus-visible {
  outline: 3px solid #e8c96d;
  outline-offset: 3px;
}

.parameter-form {
  display: grid;
  gap: 18px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.09);
}

.parameter-control {
  display: grid;
  gap: 10px;
}

.parameter-control > span {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.parameter-value {
  color: #e9edf0;
  font-variant-numeric: tabular-nums;
  font-weight: 800;
}

.parameter-control input {
  width: 100%;
  accent-color: #e8c96d;
}

.compact ul {
  margin: 12px 0 0;
  padding-left: 18px;
}

.atlas-stage {
  position: relative;
  flex: 1 0 auto;
}

.atlas-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.atlas-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  grid-auto-rows: 160px;
  gap: 14px;
  padding: 14px;
}

.atlas-cell {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: end;
  gap: 4px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  background: linear-gradient(180deg, transparent 45%, rgba(0, 0, 0, 0.64));
  color: #f7faf9;
  cursor: pointer;
  padding: 14px;
  text-align: left;
}

.atlas-cell:hover {
  border-color: rgba(233, 237, 240, 0.62);
}

.atlas-cell:focus-visible {
  outline: 3px solid #e8c96d;
  outline-offset: 3px;
}

.atlas-cell.is-selected {
  border-color: #e8c96d;
  box-shadow: inset 0 0 0 2px rgba(232, 201, 109, 0.7);
}

.cell-label {
  overflow-wrap: anywhere;
  font-weight: 800;
  line-height: 1.2;
}

.cell-meta {
  color: rgba(247, 250, 249, 0.76);
  font-size: 0.78rem;
  line-height: 1.35;
}

.preview-canvas {
  width: 100%;
  aspect-ratio: 1;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  background: #11151a;
}

.metadata {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 0;
}

.metadata div {
  min-width: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.09);
  padding-top: 12px;
}

dt {
  color: #8fb9c9;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}

dd {
  margin: 4px 0 0;
  overflow-wrap: anywhere;
  font-size: 0.95rem;
}

.fatal-error {
  min-height: 100vh;
  padding: 32px;
  background: #13151a;
}

.fatal-error pre {
  overflow: auto;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  padding: 16px;
  color: #ffd0d0;
}

@media (max-width: 1040px) {
  .app-shell {
    grid-template-columns: 220px minmax(320px, 1fr);
  }

  .right-panel {
    grid-column: 1 / -1;
    border-top: 1px solid rgba(255, 255, 255, 0.09);
    border-left: 0;
  }

  .preview-canvas {
    max-width: 360px;
  }
}

@media (max-width: 720px) {
  .app-shell {
    display: block;
  }

  .left-panel,
  .right-panel {
    border: 0;
  }

  .atlas-toolbar {
    align-items: start;
    flex-direction: column;
  }

  .atlas-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: 150px;
  }
}
`;
  document.head.append(style);
}
