import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import SayaMenu from '../features/saya/screens/SayaMenu';
import SayaDraftInput from '../features/saya/screens/SayaDraftInput';
import SayaDraftPreview from '../features/saya/screens/SayaDraftPreview';

// ✅ DEFINE YOUR PARAM TYPES
export type SayaStackParamList = {
  SayaMenu: undefined;
  SayaDraftInput: undefined;
  SayaDraftPreview: { draft: any }; // Add your draft type here
};

// ✅ TYPE YOUR SCREEN COMPONENTS (add to SayaDraftPreview.tsx, etc.)
type Props = NativeStackScreenProps<SayaStackParamList, 'SayaDraftPreview'>;

const Stack = createNativeStackNavigator<SayaStackParamList>();

const SayaNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SayaMenu" component={SayaMenu} />
      <Stack.Screen name="SayaDraftInput" component={SayaDraftInput} />
      <Stack.Screen name="SayaDraftPreview" component={SayaDraftPreview} />
    </Stack.Navigator>
  );
};

export default SayaNavigator;
