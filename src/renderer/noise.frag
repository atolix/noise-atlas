#version 300 es
precision highp float;

uniform int uNoiseKind;
uniform float uScale;
uniform float uSeed;
uniform int uOctaves;
uniform float uGain;
uniform float uLacunarity;
uniform float uJitter;
uniform float uWarpStrength;

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

vec2 randomGradient(vec2 p) {
  float angle = hash(p) * 6.28318530718;
  return vec2(cos(angle), sin(angle));
}

float gradientNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

  float a = dot(randomGradient(i), f);
  float b = dot(randomGradient(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(randomGradient(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(randomGradient(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  float value = mix(mix(a, b, u.x), mix(c, d, u.x), u.y);

  return clamp(0.5 + value * 0.70710678, 0.0, 1.0);
}

float simplexNoise(vec2 p) {
  const float skew = 0.36602540378;
  const float unskew = 0.21132486541;
  vec2 cell = floor(p + (p.x + p.y) * skew);
  vec2 local0 = p - cell + (cell.x + cell.y) * unskew;
  vec2 corner = local0.x > local0.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec2 local1 = local0 - corner + unskew;
  vec2 local2 = local0 - 1.0 + 2.0 * unskew;

  vec3 weights = max(
    0.5 - vec3(dot(local0, local0), dot(local1, local1), dot(local2, local2)),
    0.0
  );
  weights *= weights;
  weights *= weights;

  vec3 contributions = vec3(
    dot(randomGradient(cell), local0),
    dot(randomGradient(cell + corner), local1),
    dot(randomGradient(cell + 1.0), local2)
  );
  float value = 70.0 * dot(weights, contributions);

  return clamp(value * 0.5 + 0.5, 0.0, 1.0);
}

vec2 worleyDistances(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  vec2 distances = vec2(2.0);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 neighborCell = cell + neighbor;
      vec2 randomPoint = vec2(
        hash(neighborCell),
        hash(neighborCell + vec2(19.19, 73.73))
      );
      vec2 featurePoint = mix(vec2(0.5), randomPoint, uJitter);
      float distanceToPoint = length(neighbor + featurePoint - local);

      if (distanceToPoint < distances.x) {
        distances.y = distances.x;
        distances.x = distanceToPoint;
      } else if (distanceToPoint < distances.y) {
        distances.y = distanceToPoint;
      }
    }
  }

  return distances;
}

float worleyNoise(vec2 p) {
  return clamp(worleyDistances(p).x * 1.41421356, 0.0, 1.0);
}

float voronoiEdges(vec2 p) {
  vec2 distances = worleyDistances(p);
  return 1.0 - smoothstep(0.02, 0.16, distances.y - distances.x);
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

float ridgedFbm(vec2 p) {
  float sum = 0.0;
  float amplitude = 0.5;
  float normalization = 0.0;

  for (int i = 0; i < 8; i++) {
    if (i >= uOctaves) {
      break;
    }

    float ridge = 1.0 - abs(valueNoise(p) * 2.0 - 1.0);
    sum += amplitude * ridge * ridge;
    normalization += amplitude;
    p *= uLacunarity;
    amplitude *= uGain;
  }

  return sum / max(normalization, 0.0001);
}

float billowFbm(vec2 p) {
  float sum = 0.0;
  float amplitude = 0.5;
  float normalization = 0.0;

  for (int i = 0; i < 8; i++) {
    if (i >= uOctaves) {
      break;
    }

    float billow = abs(valueNoise(p) * 2.0 - 1.0);
    sum += amplitude * billow;
    normalization += amplitude;
    p *= uLacunarity;
    amplitude *= uGain;
  }

  return sum / max(normalization, 0.0001);
}

float domainWarp(vec2 p) {
  vec2 offset = vec2(
    fbm(p + vec2(0.0, 0.0)),
    fbm(p + vec2(5.2, 1.3))
  ) - 0.5;

  return fbm(p + offset * uWarpStrength);
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

  float n;

  if (uNoiseKind == 1) {
    n = fbm(p);
  } else if (uNoiseKind == 2) {
    n = gradientNoise(p);
  } else if (uNoiseKind == 3) {
    n = worleyNoise(p);
  } else if (uNoiseKind == 4) {
    n = ridgedFbm(p);
  } else if (uNoiseKind == 5) {
    n = domainWarp(p);
  } else if (uNoiseKind == 6) {
    n = voronoiEdges(p);
  } else if (uNoiseKind == 7) {
    n = simplexNoise(p);
  } else if (uNoiseKind == 8) {
    n = billowFbm(p);
  } else {
    n = valueNoise(p);
  }
  n = smoothstep(0.05, 0.95, n);

  vec3 color = ramp(n);
  outColor = vec4(color, 1.0);
}
