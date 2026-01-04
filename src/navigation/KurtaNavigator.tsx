// src/navigation/KurtaNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Measurement } from '../common/types';
import KurtaMenu from '../features/kurta/screens/KurtaMenu';
import KurtaDraftInput from '../features/kurta/screens/KurtaDraftInput';
import KurtaDraftPreview from '../features/kurta/screens/KurtaDraftPreview';

// 1) Define param list for this stack
export type KurtaStackParamList = {
  KurtaMenu: undefined;
  KurtaDraftInput: undefined;
  KurtaDraftPreview: { draft: Measurement };
};

const Stack = createNativeStackNavigator<KurtaStackParamList>();

export default function KurtaNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="KurtaMenu" component={KurtaMenu} />
      <Stack.Screen name="KurtaDraftInput" component={KurtaDraftInput} />
      <Stack.Screen name="KurtaDraftPreview" component={KurtaDraftPreview} />
    </Stack.Navigator>
  );
}
