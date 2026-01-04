// src/navigation/JhablaNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JhablaMenu from '../features/jhabla/screen/JhablaMenu';
import JhablaDraftInput from '../features/jhabla/screen/JhablaDraftInput';
import JhablaDraftPreview from '../features/jhabla/screen/JhablaDraftPreview';

// ✅ DEFINE YOUR PARAM LIST
type JhablaParamList = {
  JhablaMenu: undefined;
  JhablaDraftInput: undefined;
  JhablaDraftPreview: { draft: any }; // Match your navigation params
};

const Stack = createNativeStackNavigator<JhablaParamList>();

export default function JhablaNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="JhablaMenu" 
        component={JhablaMenu} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="JhablaDraftInput" 
        component={JhablaDraftInput} 
      />
      <Stack.Screen 
        name="JhablaDraftPreview" 
        component={JhablaDraftPreview} 
      />
    </Stack.Navigator>
  );
}
