// src/features/izar/logic/IzarLogic.ts
import { Measurement, DraftData } from '../../../common/types';

export interface IzarDraft extends DraftData {
  izar: {
    waist: number;
    hip: number;
    fullLength: number;
    bottomWidth: number;
    crotchDepthFront: number;
    crotchDepthBack: number;
    riseFront: number;
    riseBack: number;
  };
}

export const calculateIzarDraft = (measurements: Measurement): IzarDraft => {
  const waist = Number(measurements.waist) || 32;
  const hip = Number(measurements.hip) || waist * 1.15;
  const fullLength = Number(measurements.fullLength) || 38;
  const bottomWidth = Number(measurements.bottomWidth) || hip * 0.85;

  const crotchDepthFront = +(hip / 4 + 0.75).toFixed(2) as number;
  const crotchDepthBack = +(hip / 3.5 + 1).toFixed(2) as number;
  const riseFront = +(crotchDepthFront + 1.5).toFixed(2) as number;
  const riseBack = +(crotchDepthBack + 2).toFixed(2) as number;

  const izar = {
    waist, hip, fullLength, bottomWidth,
    crotchDepthFront, crotchDepthBack, riseFront, riseBack
  };

  return {
    key: Date.now().toString(),
    input: measurements,
    calculated: izar as Record<string, number>,
    timestamp: Date.now(),
    garment: 'izar',
    izar,
  };
};
