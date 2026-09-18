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
