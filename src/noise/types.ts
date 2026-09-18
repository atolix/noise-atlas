export type NoiseParameter =
  | {
      type: "float";
      name: string;
      shaderUniform: string;
      uniformType: "float" | "int";
      label: string;
      min: number;
      max: number;
      step: number;
      defaultValue: number;
    }
  | {
      type: "int";
      name: string;
      shaderUniform: string;
      uniformType: "float" | "int";
      label: string;
      min: number;
      max: number;
      step: number;
      defaultValue: number;
    };

export type NoiseParameterValues = Record<string, number>;

export type NoiseDefinition = {
  id: string;
  name: string;
  description: string;
  shaderKind: number;
  parameters: NoiseParameter[];
};

export type AtlasCell = {
  id: string;
  noiseId: string;
  label: string;
  params: NoiseParameterValues;
};
