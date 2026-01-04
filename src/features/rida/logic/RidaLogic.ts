// src/features/rida/logic/RidaLogic.ts
import { Measurement, DraftData } from '../../../common/types';

export interface RidaDraft extends DraftData {
  rida: {
    chest: number;
    waist: number;
    fullFrontLength: number;
    fullBackLength: number;
    shoulder: number;
    sleeveLength: number;
    neckRound: number;
    armholeDepth: number;
    frontYokeDepth: number;
  };
}

export const calculateRidaDraft = (measurements: Measurement & { fullFrontLength?: number; fullBackLength?: number }): RidaDraft => {
  const chest = Number(measurements.chest) || 38;
  const waist = Number(measurements.waist) || chest * 0.9;
  const fullFrontLength = Number(measurements.fullFrontLength) || 27;
  const fullBackLength = Number(measurements.fullBackLength) || 30;
  const shoulder = Number(measurements.shoulder) || chest * 0.22;
  const sleeveLength = Number(measurements.sleeveLength) || 18;
  const neckRound = Number(measurements.neckRound) || chest * 0.35;

  return {
    key: `Rida_${Date.now()}`,
    input: measurements,
    calculated: {
      chest, waist, fullFrontLength, fullBackLength, shoulder, sleeveLength, neckRound,
      armholeDepth: +(chest / 5).toFixed(2),
      frontYokeDepth: +(fullFrontLength / 10).toFixed(2)
    },
    timestamp: Date.now(),
    garment: 'rida',
    rida: {
      chest, waist, fullFrontLength, fullBackLength, shoulder, sleeveLength, neckRound,
      armholeDepth: +(chest / 5).toFixed(2),
      frontYokeDepth: +(fullFrontLength / 10).toFixed(2),
    },
  };
};
