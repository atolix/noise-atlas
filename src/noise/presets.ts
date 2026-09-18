import type { AtlasCell } from "./types";

export const atlasCells: AtlasCell[] = [
  {
    id: "value-low",
    noiseId: "value",
    label: "Value / broad",
    params: {
      scale: 3,
      seed: 4
    }
  },
  {
    id: "value-mid",
    noiseId: "value",
    label: "Value / medium",
    params: {
      scale: 7,
      seed: 18
    }
  },
  {
    id: "value-high",
    noiseId: "value",
    label: "Value / fine",
    params: {
      scale: 14,
      seed: 31
    }
  },
  {
    id: "fbm-soft",
    noiseId: "fbm",
    label: "FBM / soft",
    params: {
      scale: 4,
      seed: 12,
      octaves: 4,
      gain: 0.52,
      lacunarity: 2
    }
  },
  {
    id: "fbm-clouds",
    noiseId: "fbm",
    label: "FBM / clouds",
    params: {
      scale: 6,
      seed: 27,
      octaves: 5,
      gain: 0.48,
      lacunarity: 2.15
    }
  },
  {
    id: "fbm-grain",
    noiseId: "fbm",
    label: "FBM / grain",
    params: {
      scale: 10,
      seed: 39,
      octaves: 6,
      gain: 0.42,
      lacunarity: 2.35
    }
  },
  {
    id: "gradient-broad",
    noiseId: "gradient",
    label: "Gradient / broad",
    params: {
      scale: 3,
      seed: 8
    }
  },
  {
    id: "gradient-flow",
    noiseId: "gradient",
    label: "Gradient / flow",
    params: {
      scale: 7,
      seed: 24
    }
  },
  {
    id: "gradient-fine",
    noiseId: "gradient",
    label: "Gradient / fine",
    params: {
      scale: 14,
      seed: 47
    }
  },
  {
    id: "worley-ordered",
    noiseId: "worley",
    label: "Worley / ordered",
    params: {
      scale: 5,
      seed: 6,
      jitter: 0.2
    }
  },
  {
    id: "worley-cells",
    noiseId: "worley",
    label: "Worley / cells",
    params: {
      scale: 8,
      seed: 21,
      jitter: 0.72
    }
  },
  {
    id: "worley-cracks",
    noiseId: "worley",
    label: "Worley / cracks",
    params: {
      scale: 13,
      seed: 44,
      jitter: 1
    }
  },
  {
    id: "ridged-peaks",
    noiseId: "ridged",
    label: "Ridged / peaks",
    params: {
      scale: 3,
      seed: 10,
      octaves: 4,
      gain: 0.5,
      lacunarity: 2
    }
  },
  {
    id: "ridged-ranges",
    noiseId: "ridged",
    label: "Ridged / ranges",
    params: {
      scale: 5,
      seed: 29,
      octaves: 6,
      gain: 0.52,
      lacunarity: 2.1
    }
  },
  {
    id: "ridged-veins",
    noiseId: "ridged",
    label: "Ridged / veins",
    params: {
      scale: 9,
      seed: 53,
      octaves: 7,
      gain: 0.44,
      lacunarity: 2.3
    }
  },
  {
    id: "warp-drift",
    noiseId: "domain-warp",
    label: "Warp / drift",
    params: {
      scale: 3,
      seed: 15,
      octaves: 4,
      gain: 0.48,
      lacunarity: 2,
      warpStrength: 1.2
    }
  },
  {
    id: "warp-marble",
    noiseId: "domain-warp",
    label: "Warp / marble",
    params: {
      scale: 4.5,
      seed: 32,
      octaves: 5,
      gain: 0.5,
      lacunarity: 2.1,
      warpStrength: 3
    }
  },
  {
    id: "warp-turbulence",
    noiseId: "domain-warp",
    label: "Warp / turbulence",
    params: {
      scale: 6,
      seed: 61,
      octaves: 6,
      gain: 0.46,
      lacunarity: 2.2,
      warpStrength: 5.2
    }
  },
  {
    id: "voronoi-tiles",
    noiseId: "voronoi-edges",
    label: "Voronoi / tiles",
    params: {
      scale: 5,
      seed: 7,
      jitter: 0.25
    }
  },
  {
    id: "voronoi-cells",
    noiseId: "voronoi-edges",
    label: "Voronoi / cells",
    params: {
      scale: 8,
      seed: 26,
      jitter: 0.7
    }
  },
  {
    id: "voronoi-shards",
    noiseId: "voronoi-edges",
    label: "Voronoi / shards",
    params: {
      scale: 13,
      seed: 58,
      jitter: 1
    }
  },
  {
    id: "simplex-broad",
    noiseId: "simplex",
    label: "Simplex / broad",
    params: {
      scale: 3,
      seed: 11
    }
  },
  {
    id: "simplex-natural",
    noiseId: "simplex",
    label: "Simplex / natural",
    params: {
      scale: 7,
      seed: 35
    }
  },
  {
    id: "simplex-fine",
    noiseId: "simplex",
    label: "Simplex / fine",
    params: {
      scale: 14,
      seed: 67
    }
  },
  {
    id: "billow-soft",
    noiseId: "billow",
    label: "Billow / soft",
    params: {
      scale: 3,
      seed: 13,
      octaves: 4,
      gain: 0.46,
      lacunarity: 2
    }
  },
  {
    id: "billow-clouds",
    noiseId: "billow",
    label: "Billow / clouds",
    params: {
      scale: 5,
      seed: 38,
      octaves: 6,
      gain: 0.5,
      lacunarity: 2.1
    }
  },
  {
    id: "billow-dense",
    noiseId: "billow",
    label: "Billow / dense",
    params: {
      scale: 9,
      seed: 72,
      octaves: 7,
      gain: 0.55,
      lacunarity: 2.25
    }
  },
  {
    id: "turbulence-flame",
    noiseId: "turbulence",
    label: "Turbulence / flame",
    params: {
      scale: 3,
      seed: 17,
      octaves: 4,
      gain: 0.52,
      lacunarity: 2
    }
  },
  {
    id: "turbulence-marble",
    noiseId: "turbulence",
    label: "Turbulence / marble",
    params: {
      scale: 6,
      seed: 41,
      octaves: 6,
      gain: 0.5,
      lacunarity: 2.15
    }
  },
  {
    id: "turbulence-storm",
    noiseId: "turbulence",
    label: "Turbulence / storm",
    params: {
      scale: 10,
      seed: 79,
      octaves: 7,
      gain: 0.56,
      lacunarity: 2.3
    }
  },
  {
    id: "gabor-fibers",
    noiseId: "gabor",
    label: "Gabor / fibers",
    params: {
      scale: 6,
      seed: 19,
      angle: 18,
      frequency: 1.4,
      bandwidth: 2.5
    }
  },
  {
    id: "gabor-grain",
    noiseId: "gabor",
    label: "Gabor / grain",
    params: {
      scale: 9,
      seed: 46,
      angle: 52,
      frequency: 2.2,
      bandwidth: 4
    }
  },
  {
    id: "gabor-ripples",
    noiseId: "gabor",
    label: "Gabor / ripples",
    params: {
      scale: 12,
      seed: 83,
      angle: 118,
      frequency: 3.2,
      bandwidth: 6
    }
  },
  {
    id: "cellular-blocks",
    noiseId: "cellular-id",
    label: "Cellular / blocks",
    params: {
      scale: 5,
      seed: 22,
      jitter: 0.15
    }
  },
  {
    id: "cellular-mosaic",
    noiseId: "cellular-id",
    label: "Cellular / mosaic",
    params: {
      scale: 8,
      seed: 49,
      jitter: 0.65
    }
  },
  {
    id: "cellular-fragments",
    noiseId: "cellular-id",
    label: "Cellular / fragments",
    params: {
      scale: 13,
      seed: 87,
      jitter: 1
    }
  },
  {
    id: "hybrid-massif",
    noiseId: "hybrid-multifractal",
    label: "Hybrid / massif",
    params: {
      scale: 2.5,
      seed: 23,
      octaves: 5,
      gain: 0.48,
      lacunarity: 2
    }
  },
  {
    id: "hybrid-highlands",
    noiseId: "hybrid-multifractal",
    label: "Hybrid / highlands",
    params: {
      scale: 5,
      seed: 51,
      octaves: 6,
      gain: 0.54,
      lacunarity: 2.15
    }
  },
  {
    id: "hybrid-rugged",
    noiseId: "hybrid-multifractal",
    label: "Hybrid / rugged",
    params: {
      scale: 8,
      seed: 91,
      octaves: 8,
      gain: 0.58,
      lacunarity: 2.3
    }
  },
  {
    id: "wood-wide",
    noiseId: "wood-rings",
    label: "Wood / wide rings",
    params: {
      scale: 6,
      seed: 20,
      ringFrequency: 1,
      distortion: 0.55
    }
  },
  {
    id: "wood-grain",
    noiseId: "wood-rings",
    label: "Wood / grain",
    params: {
      scale: 8,
      seed: 55,
      ringFrequency: 2,
      distortion: 1.2
    }
  },
  {
    id: "wood-knots",
    noiseId: "wood-rings",
    label: "Wood / knots",
    params: {
      scale: 10,
      seed: 94,
      ringFrequency: 3.1,
      distortion: 2
    }
  }
];

export function describeCell(cell: AtlasCell): string {
  const base = `scale ${formatValue(cell.params.scale)} · seed ${formatValue(cell.params.seed)}`;
  return cell.params.octaves !== undefined
    ? `${base} · ${formatValue(cell.params.octaves)} octaves`
    : base;
}

function formatValue(value: number | undefined): string {
  return value === undefined ? "n/a" : String(value);
}
