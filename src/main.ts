import { atlasCells, describeCell, type AtlasCell } from "./noise/presets";
import { WebGlNoiseRenderer } from "./renderer/webgl";
import "./styles.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app root element.");
}

const root = app;
let selectedIndex = 0;
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
        <h2>Milestone 1</h2>
        <p>Static WebGL2 atlas with hardcoded value noise and FBM presets.</p>
      </div>
      <div class="control-group compact">
        <h2>Available sources</h2>
        <ul>
          <li>Value noise</li>
          <li>Fractal Brownian motion</li>
        </ul>
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

try {
  atlasRenderer = new WebGlNoiseRenderer(atlasCanvas);
  previewRenderer = new WebGlNoiseRenderer(previewCanvas);
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

function renderGridButtons(): void {
  grid.innerHTML = "";

  for (const [index, cell] of atlasCells.entries()) {
    const button = document.createElement("button");
    button.className = "atlas-cell";
    button.type = "button";
    button.dataset.cellId = cell.id;
    button.setAttribute("aria-label", `${cell.name}, ${describeCell(cell)}`);
    button.addEventListener("click", () => {
      selectedIndex = index;
      renderSelection();
      queueRender();
    });

    button.innerHTML = `
      <span class="cell-label">${cell.name}</span>
      <span class="cell-meta">${describeCell(cell)}</span>
    `;

    grid.append(button);
  }
}

function renderSelection(): void {
  const selected = getSelectedCell();
  selectedName.textContent = selected.name;
  metadata.innerHTML = `
    <div><dt>Source</dt><dd>${selected.kind === "fbm" ? "FBM" : "Value noise"}</dd></div>
    <div><dt>Scale</dt><dd>${selected.scale}</dd></div>
    <div><dt>Seed</dt><dd>${selected.seed}</dd></div>
    <div><dt>Octaves</dt><dd>${selected.octaves}</dd></div>
  `;

  for (const [index, button] of getCellButtons().entries()) {
    const isSelected = index === selectedIndex;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
    button.tabIndex = isSelected ? 0 : -1;
  }
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
