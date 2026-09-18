#version 300 es
precision highp float;

uniform int uNoiseKind;
uniform float uScale;
uniform float uSeed;
uniform int uOctaves;
uniform float uGain;
uniform float uLacunarity;
uniform float uJitter;
uniform float uWarpStrength;
uniform float uAngle;
uniform float uFrequency;
uniform float uBandwidth;
uniform float uRingFrequency;
uniform float uDistortion;

in vec2 vUv;
out vec4 outColor;
