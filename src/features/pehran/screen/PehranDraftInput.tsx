// src/features/pehran/screens/PehranDraftInput.tsx
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../common/styles/colors';

export interface PehranFormData {
  chest: number;
  waist: number;
  fullLength: number;
  sleeveLength: number;
  neckRound: number;
  shoulder: number;
}

export default function PehranDraftInput() {
  const navigation = useNavigation<any>();

  const [formData, setFormData] = useState<PehranFormData>({
    chest: 0,
    waist: 0,
    fullLength: 0,
    sleeveLength: 0,
    neckRound: 0,
    shoulder: 0,
  });

  const updateField = (field: keyof PehranFormData, value: string) => {
    const num = parseFloat(value.replace(',', '.'));
    setFormData(prev => ({
      ...prev,
      [field]: Number.isFinite(num) ? num : 0,
    }));
  };

  const validateForm = (): boolean => {
    const entries = Object.entries(formData);
    for (const [key, value] of entries) {
      if (!value || value <= 0) {
        Alert.alert(
          'Validation error',
          `Please enter a valid positive value for ${key.replace(
            /([A-Z])/g,
            ' $1',
          )}.`,
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    navigation.navigate('PehranDraftPreview', { draft: formData });
  };

  const fields: { key: keyof PehranFormData; label: string; placeholder: string }[] =
    [
      { key: 'chest', label: 'Chest', placeholder: '40' },
      { key: 'waist', label: 'Waist', placeholder: '36' },
      { key: 'fullLength', label: 'Full Length', placeholder: '42' },
      { key: 'sleeveLength', label: 'Sleeve Length', placeholder: '19' },
      { key: 'neckRound', label: 'Neck Round', placeholder: '13' },
      { key: 'shoulder', label: 'Shoulder', placeholder: '10' },
    ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Ionicons name="shirt-outline" size={48} color="#8B4513" />
          <Text style={styles.title}>Pehran Measurements</Text>
          <Text style={styles.subtitle}>Kashmiri Traditional Tunic</Text>
        </View>

        <View style={styles.form}>
          {fields.map(({ key, label, placeholder }) => (
            <View key={key} style={styles.inputGroup}>
              <Text style={styles.label}>{label} (inches)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={
                  formData[key] && formData[key] > 0
                    ? String(formData[key])
                    : ''
                }
                onChangeText={value => updateField(key, value)}
                placeholder={placeholder}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.submitText}>Generate Pehran Draft</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 32 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B4513',
    marginTop: 4,
    fontStyle: 'italic',
  },
  form: { gap: 20, marginBottom: 32 },
  inputGroup: { gap: 8 },
  label: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  input: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#8B4513',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  submitText: { fontSize: 18, fontWeight: '600', color: '#fff' },
});
