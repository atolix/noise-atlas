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

float cellularId(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  float minDistance = 2.0;
  float id = 0.0;

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

      if (distanceToPoint < minDistance) {
        minDistance = distanceToPoint;
        id = hash(neighborCell + vec2(101.7, 37.3));
      }
    }
  }

  return id;
}
