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
