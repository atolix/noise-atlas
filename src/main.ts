import { atlasCells, describeCell } from "./noise/presets";
import { getDefaultParameterValues, getNoiseDefinition, noiseDefinitions } from "./noise/registry";
import type { AtlasCell, NoiseParameter } from "./noise/types";
import { WebGlNoiseRenderer } from "./renderer/webgl";
import "./styles.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app root element.");
}

const root = app;
let selectedIndex = 0;
let activeNoiseId = atlasCells[0]?.noiseId ?? noiseDefinitions[0]?.id ?? "value";
let atlasRenderer: WebGlNoiseRenderer | null = null;
let previewRenderer: WebGlNoiseRenderer | null = null;

root.innerHTML = `
  <main class="app-shell">
    <aside class="panel left-panel" aria-label="Noise controls">
      <div>
        <p class="eyebrow">Noise Atlas</p>
        <h1>Procedural previews</h1>
      </div>
      <div class="control-group">
        <label class="field-label" for="noise-source">Noise source</label>
        <select id="noise-source" class="select-control"></select>
      </div>
      <div class="control-group compact">
        <h2 data-noise-name></h2>
        <p data-noise-description></p>
      </div>
      <form class="parameter-form" aria-label="Noise parameters"></form>
      <div class="control-group compact">
        <h2>Milestone 2</h2>
        <p>Registry-backed controls update the selected preview immediately.</p>
      </div>
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
const previewCanvas = query<HTMLCanvasElement>(".preview-canvas");
const grid = query<HTMLDivElement>(".atlas-grid");
const selectedName = query<HTMLHeadingElement>("[data-selected-name]");
const metadata = query<HTMLDListElement>(".metadata");
const noiseSelect = query<HTMLSelectElement>("#noise-source");
const noiseName = query<HTMLHeadingElement>("[data-noise-name]");
const noiseDescription = query<HTMLParagraphElement>("[data-noise-description]");
const parameterForm = query<HTMLFormElement>(".parameter-form");

try {
  atlasRenderer = new WebGlNoiseRenderer(atlasCanvas);
  previewRenderer = new WebGlNoiseRenderer(previewCanvas);
  renderNoiseSelect();
  renderGridButtons();
  renderSelection();
  queueRender();
} catch (error) {
  showFatalError(error);
}

window.addEventListener("resize", queueRender);
window.addEventListener("keydown", (event) => {
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

noiseSelect.addEventListener("change", () => {
  activeNoiseId = noiseSelect.value;
  const existingIndex = atlasCells.findIndex((cell) => cell.noiseId === activeNoiseId);
  selectedIndex = existingIndex === -1 ? createCellFromActiveNoise() : existingIndex;
  renderSelection();
  queueRender();
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

function renderNoiseSelect(): void {
  noiseSelect.innerHTML = "";

  for (const definition of noiseDefinitions) {
    const option = document.createElement("option");
    option.value = definition.id;
    option.textContent = definition.name;
    noiseSelect.append(option);
  }
}

function renderSelection(): void {
  const selected = getSelectedCell();
  const definition = getNoiseDefinition(selected.noiseId);
  activeNoiseId = selected.noiseId;
  noiseSelect.value = activeNoiseId;
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
  requestAnimationFrame(renderCanvases);
}

function renderCanvases(): void {
  if (!atlasRenderer || !previewRenderer) {
    return;
  }

  const pixelRatio = window.devicePixelRatio;
  const stageRect = atlasCanvas.parentElement?.getBoundingClientRect();

  if (!stageRect) {
    return;
  }

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

function createCellFromActiveNoise(): number {
  const definition = getNoiseDefinition(activeNoiseId);
  const nextIndex = atlasCells.length + 1;
  atlasCells.push({
    id: `${definition.id}-custom-${nextIndex}`,
    noiseId: definition.id,
    label: `${definition.name} / custom`,
    params: getDefaultParameterValues(definition)
  });
  renderGridButtons();
  return atlasCells.length - 1;
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
