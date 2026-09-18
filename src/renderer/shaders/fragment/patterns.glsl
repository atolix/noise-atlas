float gaborNoise(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  float angle = radians(uAngle);
  vec2 direction = vec2(cos(angle), sin(angle));
  float sum = 0.0;
  float normalization = 0.0;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 neighborCell = cell + neighbor;
      vec2 impulse = vec2(
        hash(neighborCell),
        hash(neighborCell + vec2(31.7, 17.3))
      );
      vec2 delta = neighbor + impulse - local;
      float envelope = exp(-uBandwidth * dot(delta, delta));
      float phase = hash(neighborCell + vec2(67.1, 11.9)) * 6.28318530718;
      float wave = cos(6.28318530718 * uFrequency * dot(delta, direction) + phase);
      sum += envelope * wave;
      normalization += envelope;
    }
  }

  float value = sum / max(normalization, 0.35);
  return clamp(value * 0.5 + 0.5, 0.0, 1.0);
}

float woodRings(vec2 p) {
  vec2 center = vec2(uScale * 0.5);
  float grain = valueNoise(p * 0.75);
  float radius = length(p - center) + (grain - 0.5) * uDistortion;
  return cos(radius * uRingFrequency * 6.28318530718) * 0.5 + 0.5;
}

float domainWarp(vec2 p) {
  vec2 offset = vec2(
    fbm(p + vec2(0.0, 0.0)),
    fbm(p + vec2(5.2, 1.3))
  ) - 0.5;

  return fbm(p + offset * uWarpStrength);
}
