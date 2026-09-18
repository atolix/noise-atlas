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
  } else if (uNoiseKind == 9) {
    n = turbulence(p);
  } else if (uNoiseKind == 10) {
    n = gaborNoise(p);
  } else if (uNoiseKind == 11) {
    n = cellularId(p);
  } else if (uNoiseKind == 12) {
    n = hybridMultifractal(p);
  } else if (uNoiseKind == 13) {
    n = woodRings(p);
  } else {
    n = valueNoise(p);
  }
  n = smoothstep(0.05, 0.95, n);

  vec3 color = ramp(n);
  outColor = vec4(color, 1.0);
}
