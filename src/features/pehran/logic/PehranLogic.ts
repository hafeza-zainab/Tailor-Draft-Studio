// src/features/pehran/logic/PehranLogic.ts
import { Measurement, DraftData } from '../../../common/types';

export interface PehranDraft extends DraftData {
  pehran: {
    chest: number;
    waist: number;
    fullLength: number;
    sleeveLength: number;
    neckRound: number;
    shoulder: number;
    quarterChest: number;
    armholeDepth: number;
    frontNeckDepth: number;
  };
}

export const calculatePehranDraft = (measurements: Measurement): PehranDraft => {
  const chest = Number(measurements.chest) || 40;
  const waist = Number(measurements.waist) || chest * 0.92;
  const fullLength = Number(measurements.fullLength) || 42;
  const sleeveLength = Number(measurements.sleeveLength) || fullLength * 0.45;
  const neckRound = Number(measurements.neckRound) || chest * 0.32;
  const shoulder = Number(measurements.shoulder) || chest * 0.24;

  const quarterChest = +(chest / 4 + 1.5).toFixed(2);
  const armholeDepth = +(chest / 5 + 1.75).toFixed(2);
  const frontNeckDepth = +(neckRound / 10).toFixed(2);

  return {
    key: `pehran_${Date.now()}`,
    input: measurements,
    calculated: {
      chest,
      waist,
      fullLength,
      sleeveLength,
      neckRound,
      shoulder,
      quarterChest,
      armholeDepth,
      frontNeckDepth,
    },
    timestamp: Date.now(),
    garment: 'pehran',
    pehran: {
      chest,
      waist,
      fullLength,
      sleeveLength,
      neckRound,
      shoulder,
      quarterChest,
      armholeDepth,
      frontNeckDepth,
    },
  };
};
