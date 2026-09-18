import baseNoiseSource from "./shaders/fragment/base-noise.glsl?raw";
import cellularSource from "./shaders/fragment/cellular.glsl?raw";
import fractalSource from "./shaders/fragment/fractal.glsl?raw";
import fragmentMainSource from "./shaders/fragment/main.glsl?raw";
import paletteSource from "./shaders/fragment/palette.glsl?raw";
import patternsSource from "./shaders/fragment/patterns.glsl?raw";
import preambleSource from "./shaders/fragment/preamble.glsl?raw";

export const vertexShaderSource = `#version 300 es
precision highp float;

out vec2 vUv;

const vec2 positions[3] = vec2[3](
  vec2(-1.0, -1.0),
  vec2(3.0, -1.0),
  vec2(-1.0, 3.0)
);

void main() {
  vec2 position = positions[gl_VertexID];
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const fragmentShaderSource = [
  preambleSource,
  baseNoiseSource,
  cellularSource,
  fractalSource,
  patternsSource,
  paletteSource,
  fragmentMainSource
].join("\n");
