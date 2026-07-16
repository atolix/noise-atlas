#version 300 es
precision highp float;

uniform int uNoiseKind;
uniform float uScale;
uniform float uSeed;
uniform int uOctaves;
uniform float uGain;
uniform float uLacunarity;

in vec2 vUv;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32 + uSeed);
  return fract(p.x * p.y);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amplitude = 0.5;
  float normalization = 0.0;

  for (int i = 0; i < 8; i++) {
    if (i >= uOctaves) {
      break;
    }

    sum += amplitude * valueNoise(p);
    normalization += amplitude;
    p *= uLacunarity;
    amplitude *= uGain;
  }

  return sum / max(normalization, 0.0001);
}

vec3 ramp(float n) {
  vec3 ink = vec3(0.055, 0.071, 0.102);
  vec3 blue = vec3(0.129, 0.353, 0.490);
  vec3 moss = vec3(0.404, 0.522, 0.314);
  vec3 sand = vec3(0.847, 0.729, 0.502);
  vec3 white = vec3(0.950, 0.960, 0.932);

  vec3 low = mix(ink, blue, smoothstep(0.05, 0.35, n));
  vec3 mid = mix(low, moss, smoothstep(0.30, 0.62, n));
  vec3 high = mix(mid, sand, smoothstep(0.55, 0.82, n));
  return mix(high, white, smoothstep(0.78, 1.0, n));
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv * uScale;

  float n = uNoiseKind == 1 ? fbm(p) : valueNoise(p);
  n = smoothstep(0.05, 0.95, n);

  vec3 color = ramp(n);
  outColor = vec4(color, 1.0);
}

