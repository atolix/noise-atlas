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

float turbulence(vec2 p) {
  float sum = 0.0;
  float amplitude = 0.5;
  float normalization = 0.0;

  for (int i = 0; i < 8; i++) {
    if (i >= uOctaves) {
      break;
    }

    float flow = abs(gradientNoise(p) * 2.0 - 1.0);
    sum += amplitude * flow;
    normalization += amplitude;
    p *= uLacunarity;
    amplitude *= uGain;
  }

  return clamp(sum / max(normalization, 0.0001) * 1.8, 0.0, 1.0);
}

float hybridMultifractal(vec2 p) {
  float result = valueNoise(p);
  float weight = result;
  float amplitude = uGain;
  float normalization = 1.0;

  for (int i = 1; i < 8; i++) {
    if (i >= uOctaves) {
      break;
    }

    p *= uLacunarity;
    float signal = valueNoise(p);
    result += amplitude * signal * clamp(weight, 0.0, 1.0);
    normalization += amplitude;
    weight *= signal * 1.8;
    amplitude *= uGain;
  }

  return clamp(result / max(normalization * 0.75, 0.0001), 0.0, 1.0);
}
