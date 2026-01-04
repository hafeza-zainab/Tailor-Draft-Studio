
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import HomeScreen from './src/screens/HomeScreen';
import SavedDraftsScreen from './src/screens/SavedDrafts';
import SettingsScreen from './src/screens/Settings';
import ClientsScreen from './src/screens/Clients';


import KurtaNavigator from './src/navigation/KurtaNavigator';
import IzarNavigator from './src/navigation/IzarNavigator';
import PehranNavigator from './src/navigation/PehranNavigator';  
import RidaNavigator from './src/navigation/RidaNavigator';
import SayaNavigator from './src/navigation/SayaNavigator';
import JhablaNavigator from './src/navigation/JhablaNavigator';

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

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1e293b' },
          headerTintColor: '#f1f5f9',
          headerTitleStyle: { fontWeight: 'bold' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#f8fafc' },
        }}
      >
        
        <Stack.Screen 
          name="Home" 
          component={HomeScreen as React.ComponentType<any>} 
          options={{ 
            title: 'Tailor Draft Studio',
            headerLargeTitle: true,
            headerLargeTitleStyle: { fontSize: 32, fontWeight: '800' },
          }} 
        />
        <Stack.Screen name="SavedDrafts" component={SavedDraftsScreen as React.ComponentType<any>} options={{ title: 'Saved Drafts' }} />
        <Stack.Screen name="Settings" component={SettingsScreen as React.ComponentType<any>} options={{ title: 'Settings' }} />
        <Stack.Screen name="Clients" component={ClientsScreen as React.ComponentType<any>} options={{ title: 'Clients' }} />

        
        <Stack.Screen name="Kurta" component={KurtaNavigator as React.ComponentType<any>} options={{ headerShown: false }} />
        <Stack.Screen name="Izar" component={IzarNavigator as React.ComponentType<any>} options={{ headerShown: false }} />
        <Stack.Screen name="Pehran" component={PehranNavigator as React.ComponentType<any>} options={{ headerShown: false }} /> 
        <Stack.Screen name="Rida" component={RidaNavigator as React.ComponentType<any>} options={{ headerShown: false }} />
        <Stack.Screen name="Saya" component={SayaNavigator as React.ComponentType<any>} options={{ headerShown: false }} />
        <Stack.Screen name="Jhabla" component={JhablaNavigator as React.ComponentType<any>} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
