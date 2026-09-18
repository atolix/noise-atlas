import type { NoiseDefinition, NoiseParameterValues } from "./types";

const commonParameters = [
  {
    type: "float",
    name: "scale",
    shaderUniform: "uScale",
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
    label: "Lacunarity",
    min: 1.2,
    max: 3.5,
    step: 0.05,
    defaultValue: 2
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
    parameters: [
      ...commonParameters,
      {
        type: "float",
        name: "jitter",
        shaderUniform: "uJitter",
        label: "Jitter",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 1
      }
    ]
  },
  {
    id: "ridged",
    name: "Ridged fBm",
    description: "Inverted fractal noise that emphasizes mountain ridges and sharp veins.",
    shaderKind: 4,
    parameters: [...commonParameters, ...fractalParameters]
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
