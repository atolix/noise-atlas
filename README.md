# Noise Atlas

An interactive WebGL2 atlas for comparing procedural noise presets and tuning their parameters.

## Requirements

- Node.js 20.19.x, or Node.js 22.12 or newer
- A browser with WebGL2 support

## Getting started

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite and click an atlas cell to choose a preset. When an atlas cell has keyboard focus, the arrow keys move the selection. The sliders update the selected preset immediately.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Vite development server |
| `npm run lint` | Run Oxlint over the source tree |
| `npm run build` | Type-check and create a production build |
| `npm run check` | Run lint and the production build |
| `npm run preview` | Preview the production build locally |

## Project structure

- `src/noise/registry.ts` defines noise sources and their editable shader parameters.
- `src/noise/presets.ts` contains the cells displayed in the atlas.
- `src/renderer/shaders/fragment/` contains the composable fragment shader sections.
- `src/renderer/shaders.ts` assembles the shader sections in dependency order.
- `src/renderer/webgl.ts` manages WebGL2 resources and renders atlas cells.
- `src/main.ts` builds the interface and coordinates selection and rendering.

## Adding a noise source

1. Add the GLSL implementation to the appropriate fragment shader section and select it through `uNoiseKind` in `main.glsl`.
2. Add its definition and parameter-to-uniform mappings in `registry.ts`.
3. Add one or more representative cells in `presets.ts`.

The renderer discovers parameter uniforms from the registry, so it does not need a separate hard-coded uniform list.
