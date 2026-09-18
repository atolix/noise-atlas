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
