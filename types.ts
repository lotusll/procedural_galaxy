
// Fix: Import THREE to resolve namespace errors
import * as THREE from 'three';

export interface PlanetStats {
  name: string;
  description: string;
  age: string;
  mass: string;
  temperature: string;
  atmosphere: string[];
}

export interface CosmicPromptResponse {
  stats: PlanetStats;
  message: string;
}

export interface ShaderUniforms {
  uTime: { value: number };
  uColor: { value: THREE.Color };
  uSecondaryColor: { value: THREE.Color };
  uResolution: { value: THREE.Vector2 };
}