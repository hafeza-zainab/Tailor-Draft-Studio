// src/features/kurta/logic/KurtaLogic.ts
import { Measurement, DraftData } from '../../../common/types';

export interface KurtaDraft extends DraftData {
  kurta: {
    chest: number;
    waist: number;
    hip: number;
    fullLength: number;
    sleeveLength: number;
    neckRound: number;
    shoulder: number;
    quarterChest: number;
    quarterWaist: number;
    quarterHip: number;
    armholeDepth: number;
    frontNeckDepth: number;
    backNeckDepth: number;
  };
  saya: {
    chest: number;
    fullLength: number;
    armholeDepth: number;
  };
}

export const calculateKurtaDraft = (measurements: Measurement): KurtaDraft => {
  const chest = Number(measurements.chest) || 36;
  const waist = Number(measurements.waist) || chest * 0.9;
  const hip = Number(measurements.hip) || chest * 0.95;
  const fullLength = Number(measurements.fullLength) || 28;
  const sleeveLength = Number(measurements.sleeveLength) || fullLength * 0.6;
  const neckRound = Number(measurements.neckRound) || chest * 0.35;
  const shoulder = Number(measurements.shoulder) || chest * 0.22;

  const kurta = {
    chest,
    waist,
    hip,
    fullLength,
    sleeveLength,
    neckRound,
    shoulder,
    quarterChest: +(chest / 4).toFixed(2) as any,
    quarterWaist: +(waist / 4).toFixed(2) as any,
    quarterHip: +(hip / 4).toFixed(2) as any,
    armholeDepth: +(chest / 4 - 0.75).toFixed(2) as any,
    frontNeckDepth: +(neckRound / 12).toFixed(2) as any,
    backNeckDepth: 1.25,
  };

  const saya = {
    chest: chest + 2.5,
    fullLength: fullLength + 1.25,
    armholeDepth: +(((chest + 2.5) / 4) - 0.75).toFixed(2) as any,
  };

  return {
    key: `Kurta_${Date.now()}`,
    input: measurements,
    calculated: { ...kurta, ...saya },
    timestamp: Date.now(),
    garment: 'kurta',
    kurta,
    saya,
  };
};
