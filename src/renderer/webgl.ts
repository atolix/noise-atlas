import { getNoiseDefinition, noiseDefinitions } from "../noise/registry";
import type { AtlasCell } from "../noise/types";
import { fragmentShaderSource, vertexShaderSource } from "./shaders";

type UniformLocations = {
  noiseKind: WebGLUniformLocation;
  parameters: Map<string, WebGLUniformLocation>;
};

export class WebGlNoiseRenderer {
  private readonly gl: WebGL2RenderingContext;
  private readonly program: WebGLProgram;
  private readonly uniforms: UniformLocations;
  private readonly vao: WebGLVertexArrayObject;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false
    });

    if (!gl) {
      throw new Error("WebGL2 is not supported by this browser.");
    }

    this.gl = gl;
    this.program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    this.uniforms = {
      noiseKind: getUniform(gl, this.program, "uNoiseKind"),
      parameters: getParameterUniforms(gl, this.program)
    };

    const vao = gl.createVertexArray();
    if (!vao) {
      throw new Error("Unable to create a WebGL vertex array.");
    }
    this.vao = vao;
  }

  resize(width: number, height: number, pixelRatio = window.devicePixelRatio): void {
    const nextWidth = Math.max(1, Math.floor(width * pixelRatio));
    const nextHeight = Math.max(1, Math.floor(height * pixelRatio));

    if (this.canvas.width !== nextWidth || this.canvas.height !== nextHeight) {
      this.canvas.width = nextWidth;
      this.canvas.height = nextHeight;
    }
  }

  render(cells: Array<{ cell: AtlasCell; rect: DOMRect }>, pixelRatio = window.devicePixelRatio): void {
    const gl = this.gl;
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.clearColor(0.075, 0.083, 0.098, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);

    for (const item of cells) {
      const x = Math.floor(item.rect.x * pixelRatio);
      const y = Math.floor((this.canvas.clientHeight - item.rect.y - item.rect.height) * pixelRatio);
      const width = Math.max(1, Math.floor(item.rect.width * pixelRatio));
      const height = Math.max(1, Math.floor(item.rect.height * pixelRatio));

      gl.viewport(x, y, width, height);
      this.setCellUniforms(item.cell);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }

  renderSingle(cell: AtlasCell, pixelRatio = window.devicePixelRatio): void {
    this.render([{ cell, rect: new DOMRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight) }], pixelRatio);
  }

  dispose(): void {
    this.gl.deleteVertexArray(this.vao);
    this.gl.deleteProgram(this.program);
  }

  private setCellUniforms(cell: AtlasCell): void {
    const gl = this.gl;
    const definition = getNoiseDefinition(cell.noiseId);
    gl.uniform1i(this.uniforms.noiseKind, definition.shaderKind);

    for (const parameter of definition.parameters) {
      const location = this.uniforms.parameters.get(parameter.shaderUniform);

      if (!location) {
        throw new Error(`Missing cached WebGL uniform: ${parameter.shaderUniform}`);
      }

      const value = cell.params[parameter.name] ?? parameter.defaultValue;

      if (parameter.type === "int") {
        gl.uniform1i(location, Math.round(value));
      } else {
        gl.uniform1f(location, value);
      }
    }
  }
}

function getParameterUniforms(
  gl: WebGL2RenderingContext,
  program: WebGLProgram
): Map<string, WebGLUniformLocation> {
  const uniforms = new Map<string, WebGLUniformLocation>();

  for (const definition of noiseDefinitions) {
    for (const parameter of definition.parameters) {
      if (!uniforms.has(parameter.shaderUniform)) {
        uniforms.set(parameter.shaderUniform, getUniform(gl, program, parameter.shaderUniform));
      }
    }
  }

  return uniforms;
}

function createProgram(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string): WebGLProgram {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  if (!program) {
    throw new Error("Unable to create a WebGL shader program.");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) ?? "Unknown program link error.";
    gl.deleteProgram(program);
    throw new Error(log);
  }

  return program;
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error("Unable to create a WebGL shader.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "Unknown shader compile error.";
    gl.deleteShader(shader);
    throw new Error(log);
  }

  return shader;
}

function getUniform(gl: WebGL2RenderingContext, program: WebGLProgram, name: string): WebGLUniformLocation {
  const location = gl.getUniformLocation(program, name);

  if (!location) {
    throw new Error(`Missing WebGL uniform: ${name}`);
  }

  return location;
}
