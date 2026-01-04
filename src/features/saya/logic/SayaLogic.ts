// src/features/saya/logic/SayaLogic.ts
import { Measurement, DraftData } from '../../../common/types';

export interface SayaDraft extends DraftData {
  saya: {
    chest: number;
    waist: number;
    fullLength: number;
    sleeveLength: number;
    neckRound: number;
    shoulder: number;
    quarterChest: number;
    armholeDepth: number;
    collarDepth: number;
  };
}

export const calculateSayaDraft = (measurements: Measurement): SayaDraft => {
  const chest = Number(measurements.chest) || 38;
  const waist = Number(measurements.waist) || chest * 0.9;
  const fullLength = Number(measurements.fullLength) || 40;
  const sleeveLength = Number(measurements.sleeveLength) || 23;
  const neckRound = Number(measurements.neckRound) || chest * 0.32;
  const shoulder = Number(measurements.shoulder) || chest * 0.23;

  return {
    key: `Saya_${Date.now()}`,
    input: measurements,
    calculated: {
      chest,
      waist,
      fullLength,
      sleeveLength,
      neckRound,
      shoulder,
      quarterChest: +(chest / 4 + 1).toFixed(2),
      armholeDepth: +(chest / 5 + 1.25).toFixed(2),
      collarDepth: +(neckRound / 8).toFixed(2),
    },
    timestamp: Date.now(),
    garment: 'saya',
    saya: {
      chest,
      waist,
      fullLength,
      sleeveLength,
      neckRound,
      shoulder,
      quarterChest: +(chest / 4 + 1).toFixed(2),
      armholeDepth: +(chest / 5 + 1.25).toFixed(2),
      collarDepth: +(neckRound / 8).toFixed(2),
    },
  };
};
