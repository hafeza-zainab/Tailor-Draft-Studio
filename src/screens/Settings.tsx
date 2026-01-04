// src/screens/Settings.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveSetting, getSetting } from '../common/utils/storage';
import { COLORS } from '../common/styles/colors';

const SETTINGS_KEY = 'app_settings';

interface SettingsState {
  darkMode: boolean;
  // Add more settings as needed
  units?: 'in' | 'cm';
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>({ darkMode: false });

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then(value => {
      if (value) setSettings(JSON.parse(value));
    });
    (async () => {
      const units = (await getSetting('units')) || 'in';
      setSettings(prev => ({ ...prev, units: units as any }));
    })();
  }, []);

  const toggleDarkMode = (val: boolean) => {
    setSettings(prev => {
      const newSettings = { ...prev, darkMode: val };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings)).catch(() => {
        Alert.alert('Error', 'Failed to save settings');
      });
      return newSettings;
    });
  };

  const toggleUnits = async (useCm: boolean) => {
    const units = useCm ? 'cm' : 'in';
    setSettings(prev => {
      const newSettings = { ...prev, units };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings)).catch(() => {
        Alert.alert('Error', 'Failed to save settings');
      });
      return newSettings;
    });
    await saveSetting('units', units);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={settings.darkMode} onValueChange={toggleDarkMode} thumbColor={settings.darkMode ? COLORS.primary : '#ccc'} />
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Units (cm)</Text>
        <Switch value={settings.units === 'cm'} onValueChange={val => toggleUnits(val)} thumbColor={settings.units === 'cm' ? COLORS.primary : '#ccc'} />
      </View>
      {/* Add more settings here */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: COLORS.background },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 24 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  label: { fontSize: 18, color: COLORS.textPrimary, fontWeight: '600' },
});
