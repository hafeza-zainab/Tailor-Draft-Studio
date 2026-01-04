// src/common/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DraftData } from '../types';  // ✅ Single source

export const saveDraft = async (key: string, data: Omit<DraftData, 'key'>): Promise<boolean> => {
  try {
    const fullData: DraftData = { ...data, key, timestamp: Date.now() };
    await AsyncStorage.setItem(key, JSON.stringify(fullData));
    return true;
  } catch {
    return false;
  }
};


export const listDrafts = async (): Promise<DraftData[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const draftKeys = keys.filter((key: string) => key.startsWith('draft_'));
    const drafts = [];
    for (const key of draftKeys) {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const draft: DraftData = JSON.parse(data);
        drafts.push(draft);
      }
    }
    return drafts;
  } catch {
    return [];
  }
};

export const deleteDraft = async (key: string): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

// Simple key/value settings helpers (used for units: "in" | "cm")
export const saveSetting = async (key: string, value: string): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

export const getSetting = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
};
