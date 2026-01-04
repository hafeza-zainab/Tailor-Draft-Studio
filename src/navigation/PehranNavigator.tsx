// src/navigation/PehranNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PehranMenu from '../features/pehran/screen/PehranMenu';
import PehranDraftInput from '../features/pehran/screen/PehranDraftInput';
import PehranDraftPreview from '../features/pehran/screen/PehranDraftPreview';

const Stack = createNativeStackNavigator<any>(); // ✅ Add type param

// ✅ Wrap components to fix type mismatch
const PehranMenuScreen = (props: any) => <PehranMenu {...props} />;
const PehranDraftInputScreen = (props: any) => <PehranDraftInput {...props} />;
const PehranDraftPreviewScreen = (props: any) => <PehranDraftPreview {...props} />;

export default function PehranNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PehranMenu" component={PehranMenuScreen} />
      <Stack.Screen name="PehranDraftInput" component={PehranDraftInputScreen} />
      <Stack.Screen name="PehranDraftPreview" component={PehranDraftPreviewScreen} />
    </Stack.Navigator>
  );
}
