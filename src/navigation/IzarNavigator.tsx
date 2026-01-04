// src/navigation/IzarNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define your param list
export type IzarStackParamList = {
  IzarMenu: undefined;
  IzarDraftInput: undefined;
  IzarDraftPreview: { draft: any };
};

// Type your screen components
type IzarMenuProps = NativeStackScreenProps<IzarStackParamList, 'IzarMenu'>;
type IzarDraftInputProps = NativeStackScreenProps<IzarStackParamList, 'IzarDraftInput'>;
type IzarDraftPreviewProps = NativeStackScreenProps<IzarStackParamList, 'IzarDraftPreview'>;

import IzarMenu from '../features/izar/screen/IzarMenu';
import IzarDraftInput from '../features/izar/screen/IzarDraftInput';
import IzarDraftPreview from '../features/izar/screen/IzarDraftPreview';

const Stack = createNativeStackNavigator<IzarStackParamList>();

export default function IzarNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="IzarMenu" 
        component={IzarMenu} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="IzarDraftInput" 
        component={IzarDraftInput} 
      />
      <Stack.Screen 
        name="IzarDraftPreview" 
        component={IzarDraftPreview} 
      />
    </Stack.Navigator>
  );
}
