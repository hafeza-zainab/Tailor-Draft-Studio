// src/common/types/index.ts
export interface Measurement {
  chest?: number;
  waist?: number;
  hip?: number;
  fullLength?: number;
  sleeveLength?: number;
  neckRound?: number;
  shoulder?: number;
  bottomWidth?: number;
  fullFrontLength?: number;
  fullBackLength?: number;
}


export interface DraftData {
  input: Measurement;
  calculated: Record<string, number>;
  timestamp: number;
  garment: string;
  key: string;  // ✅ REQUIRED - matches storage
  clientName?: string;
}

export type RootStackParamList = {
  Home: undefined;
  SavedDrafts: undefined;
  Settings: undefined;
  Clients: undefined;
  Kurta: undefined;
  Izar: undefined;
  Pehran: undefined;
  Rida: undefined;
  Saya: undefined;
  Jhabla: undefined;
};
