import type { NoiseDefinition, NoiseParameterValues } from "./types";

const commonParameters = [
  {
    type: "float",
    name: "scale",
    shaderUniform: "uScale",
    uniformType: "float",
    label: "Scale",
    min: 1,
    max: 24,
    step: 0.5,
    defaultValue: 6
  },
  {
    type: "int",
    name: "seed",
    shaderUniform: "uSeed",
    uniformType: "float",
    label: "Seed",
    min: 0,
    max: 99,
    step: 1,
    defaultValue: 12
  }
] as const;

const fractalParameters = [
  {
    type: "int",
    name: "octaves",
    shaderUniform: "uOctaves",
    uniformType: "int",
    label: "Octaves",
    min: 1,
    max: 8,
    step: 1,
    defaultValue: 5
  },
  {
    type: "float",
    name: "gain",
    shaderUniform: "uGain",
    uniformType: "float",
    label: "Gain",
    min: 0.1,
    max: 0.9,
    step: 0.01,
    defaultValue: 0.5
  },
  {
    type: "float",
    name: "lacunarity",
    shaderUniform: "uLacunarity",
    uniformType: "float",
    label: "Lacunarity",
    min: 1.2,
    max: 3.5,
    step: 0.05,
    defaultValue: 2
  }
] as const;

const cellularParameters = [
  {
    type: "float",
    name: "jitter",
    shaderUniform: "uJitter",
    uniformType: "float",
    label: "Jitter",
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: 1
  }
] as const;

export const noiseDefinitions: NoiseDefinition[] = [
  {
    id: "value",
    name: "Value noise",
    description: "Interpolated grid noise for broad procedural texture structure.",
    shaderKind: 0,
    parameters: [...commonParameters]
  },
  {
    id: "fbm",
    name: "Fractal Brownian motion",
    description: "Layered value noise with octave, gain, and lacunarity controls.",
    shaderKind: 1,
    parameters: [...commonParameters, ...fractalParameters]
  },
  {
    id: "gradient",
    name: "Gradient noise",
    description: "Smooth gradient noise for natural-looking terrain and flowing textures.",
    shaderKind: 2,
    parameters: [...commonParameters]
  },
  {
    id: "worley",
    name: "Worley noise",
    description: "Cellular distance noise for stone, scales, and cracked surface patterns.",
    shaderKind: 3,
    parameters: [...commonParameters, ...cellularParameters]
  },
  {
    id: "ridged",
    name: "Ridged fBm",
    description: "Inverted fractal noise that emphasizes mountain ridges and sharp veins.",
    shaderKind: 4,
    parameters: [...commonParameters, ...fractalParameters]
  },
  {
    id: "domain-warp",
    name: "Domain warp",
    description: "Fractal noise sampled through a distorted domain for fluid and marbled forms.",
    shaderKind: 5,
    parameters: [
      ...commonParameters,
      ...fractalParameters,
      {
        type: "float",
        name: "warpStrength",
        shaderUniform: "uWarpStrength",
        uniformType: "float",
        label: "Warp strength",
        min: 0,
        max: 6,
        step: 0.05,
        defaultValue: 2.5
      }
    ]
  },
  {
    id: "voronoi-edges",
    name: "Voronoi edges",
    description: "Cell boundaries derived from the two nearest Worley feature points.",
    shaderKind: 6,
    parameters: [...commonParameters, ...cellularParameters]
  },
  {
    id: "simplex",
    name: "Simplex noise",
    description: "Smooth triangular-grid noise with low directional bias.",
    shaderKind: 7,
    parameters: [...commonParameters]
  },
  {
    id: "billow",
    name: "Billow noise",
    description: "Folded fractal noise for rounded clouds and rolling formations.",
    shaderKind: 8,
    parameters: [...commonParameters, ...fractalParameters]
  },
  {
    id: "turbulence",
    name: "Turbulence noise",
    description: "Folded gradient octaves for flames, marble, and energetic flow.",
    shaderKind: 9,
    parameters: [...commonParameters, ...fractalParameters]
  },
  {
    id: "gabor",
    name: "Gabor noise",
    description: "Directional band-limited noise for fibers, grain, and wind-shaped surfaces.",
    shaderKind: 10,
    parameters: [
      ...commonParameters,
      {
        type: "float",
        name: "angle",
        shaderUniform: "uAngle",
        uniformType: "float",
        label: "Angle",
        min: 0,
        max: 180,
        step: 1,
        defaultValue: 30
      },
      {
        type: "float",
        name: "frequency",
        shaderUniform: "uFrequency",
        uniformType: "float",
        label: "Frequency",
        min: 0.5,
        max: 4,
        step: 0.05,
        defaultValue: 1.5
      },
      {
        type: "float",
        name: "bandwidth",
        shaderUniform: "uBandwidth",
        uniformType: "float",
        label: "Bandwidth",
        min: 1,
        max: 8,
        step: 0.1,
        defaultValue: 3
      }
    ]
  },
  {
    id: "cellular-id",
    name: "Cellular ID",
    description: "A stable random value for each nearest Voronoi region.",
    shaderKind: 11,
    parameters: [...commonParameters, ...cellularParameters]
  },
  {
    id: "hybrid-multifractal",
    name: "Hybrid multifractal",
    description: "Fractal detail weighted by larger forms for terrain-like massifs.",
    shaderKind: 12,
    parameters: [...commonParameters, ...fractalParameters]
  },
  {
    id: "wood-rings",
    name: "Wood rings",
    description: "Concentric bands distorted by noise for wood grain and layered strata.",
    shaderKind: 13,
    parameters: [
      ...commonParameters,
      {
        type: "float",
        name: "ringFrequency",
        shaderUniform: "uRingFrequency",
        uniformType: "float",
        label: "Ring frequency",
        min: 0.5,
        max: 4,
        step: 0.05,
        defaultValue: 1.5
      },
      {
        type: "float",
        name: "distortion",
        shaderUniform: "uDistortion",
        uniformType: "float",
        label: "Distortion",
        min: 0,
        max: 2.5,
        step: 0.05,
        defaultValue: 1
      }
    ]
  }
];

export function getNoiseDefinition(noiseId: string): NoiseDefinition {
  const definition = noiseDefinitions.find((noise) => noise.id === noiseId);

  if (!definition) {
    throw new Error(`Unknown noise definition: ${noiseId}`);
  }

  return definition;
}

export function getDefaultParameterValues(definition: NoiseDefinition): NoiseParameterValues {
  return Object.fromEntries(
    definition.parameters.map((parameter) => [parameter.name, parameter.defaultValue])
  );
}
