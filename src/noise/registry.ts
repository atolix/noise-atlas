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
    parameters: [
      ...commonParameters,
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
