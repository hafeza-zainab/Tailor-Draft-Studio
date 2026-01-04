// src/features/jhabla/logic/JhablaLogic.ts
import { Measurement, DraftData } from '../../../common/types';

export interface JhablaDraft extends DraftData {
  jhabla: {
    chest: number;
    waist: number;
    fullLength: number;
    sleeveLength: number;
    shoulder: number;
    neckRound: number;
    armholeDepth: number;
    quarterChest: number;
  };
}


export const calculateJhablaDraft = (measurements: Measurement): JhablaDraft => {
  const chest = Number(measurements.chest) || 22;  // Baby size default
  const waist = Number(measurements.waist) || chest * 0.95;
  const fullLength = Number(measurements.fullLength) || 14;
  const sleeveLength = Number(measurements.sleeveLength) || 8;
  const shoulder = Number(measurements.shoulder) || 7.5;
  const neckRound = Number(measurements.neckRound) || chest * 0.4;

  return {
    key: `jhabla_${Date.now()}`,
    input: measurements,
    calculated: {
      chest, waist, fullLength, sleeveLength, shoulder, neckRound,
      quarterChest: +(chest / 4 + 0.5).toFixed(2),
      armholeDepth: +(chest / 6 + 1).toFixed(2),
    },
    timestamp: Date.now(),
    garment: 'jhabla',
    jhabla: {
      chest,
      waist,
      fullLength,
      sleeveLength,
      shoulder,
      neckRound,
      quarterChest: +(chest / 4 + 0.5).toFixed(2),
      armholeDepth: +(chest / 6 + 1).toFixed(2),
    },
  };
};
