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
  }
];

export function describeCell(cell: AtlasCell): string {
  const base = `scale ${formatValue(cell.params.scale)} · seed ${formatValue(cell.params.seed)}`;
  return cell.noiseId === "fbm"
    ? `${base} · ${formatValue(cell.params.octaves)} octaves`
    : base;
}

function formatValue(value: number | undefined): string {
  return value === undefined ? "n/a" : String(value);
}
