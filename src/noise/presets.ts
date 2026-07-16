export type NoiseKind = "value" | "fbm";

export type AtlasCell = {
  id: string;
  kind: NoiseKind;
  name: string;
  scale: number;
  seed: number;
  octaves: number;
  gain: number;
  lacunarity: number;
};

export const atlasCells: AtlasCell[] = [
  {
    id: "value-low",
    kind: "value",
    name: "Value / broad",
    scale: 3,
    seed: 4,
    octaves: 1,
    gain: 0.5,
    lacunarity: 2
  },
  {
    id: "value-mid",
    kind: "value",
    name: "Value / medium",
    scale: 7,
    seed: 18,
    octaves: 1,
    gain: 0.5,
    lacunarity: 2
  },
  {
    id: "value-high",
    kind: "value",
    name: "Value / fine",
    scale: 14,
    seed: 31,
    octaves: 1,
    gain: 0.5,
    lacunarity: 2
  },
  {
    id: "fbm-soft",
    kind: "fbm",
    name: "FBM / soft",
    scale: 4,
    seed: 12,
    octaves: 4,
    gain: 0.52,
    lacunarity: 2
  },
  {
    id: "fbm-clouds",
    kind: "fbm",
    name: "FBM / clouds",
    scale: 6,
    seed: 27,
    octaves: 5,
    gain: 0.48,
    lacunarity: 2.15
  },
  {
    id: "fbm-grain",
    kind: "fbm",
    name: "FBM / grain",
    scale: 10,
    seed: 39,
    octaves: 6,
    gain: 0.42,
    lacunarity: 2.35
  }
];

export function describeCell(cell: AtlasCell): string {
  const base = `scale ${cell.scale} · seed ${cell.seed}`;
  return cell.kind === "fbm"
    ? `${base} · ${cell.octaves} octaves`
    : base;
}

