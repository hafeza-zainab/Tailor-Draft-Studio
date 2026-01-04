// src/navigation/RidaNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import RidaMenu from '../features/rida/screen/RidaMenu';
import RidaDraftInput from '../features/rida/screen/RidaDraftInput';
import RidaDraftPreview from '../features/rida/screen/RidaDraftPreview';

// Define your param list
export type RidaStackParamList = {
  RidaMenu: undefined;
  RidaDraftInput: undefined;
  RidaDraftPreview: { draft: any };
};

// Type your screens
type Props = NativeStackScreenProps<RidaStackParamList>;

const Stack = createNativeStackNavigator<RidaStackParamList>();

export default function RidaNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RidaMenu" component={RidaMenu} />
      <Stack.Screen name="RidaDraftInput" component={RidaDraftInput} />
      <Stack.Screen name="RidaDraftPreview" component={RidaDraftPreview} />
    </Stack.Navigator>
  );
}
