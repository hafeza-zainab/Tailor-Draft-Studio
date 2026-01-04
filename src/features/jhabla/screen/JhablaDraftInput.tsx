// src/features/jhabla/screens/JhablaDraftInput.tsx
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
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../common/styles/colors';
import { useNavigation, NavigationProp } from '@react-navigation/native';

// Define your navigation param list
type DraftFormData = {
  chest: string;
  waist: string;
  fullLength: string;
  sleeveLength: string;
  shoulder: string;
  neckRound: string;
};

type RootStackParamList = {
  JhablaDraftInput: undefined;
  JhablaDraftPreview: { draft: DraftFormData };
};

export default function JhablaDraftInput() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [formData, setFormData] = useState<DraftFormData>({
    chest: '',
    waist: '',
    fullLength: '',
    sleeveLength: '',
    shoulder: '',
    neckRound: '',
  });

  const validateForm = (): boolean => {
    // All fields required and > 0
    const entries = Object.entries(formData);

    for (const [key, raw] of entries) {
      const value = raw.trim();
      const num = Number(value);

      if (!value || Number.isNaN(num) || num <= 0) {
        Alert.alert(
          'Validation Error',
          `Please enter valid baby measurements (inches) – check ${key}.`
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    navigation.navigate('JhablaDraftPreview', { draft: formData });
  };

  const updateField = (field: keyof DraftFormData, value: string) => {
    // Allow only numeric characters and dot
    const cleaned = value.replace(/[^0-9.]/g, '');
    setFormData(prev => ({ ...prev, [field]: cleaned }));
  };

  const fields: { key: keyof DraftFormData; label: string; placeholder: string }[] = [
    { key: 'chest',        label: 'Chest',         placeholder: '22' },
    { key: 'waist',        label: 'Waist',         placeholder: '21' },
    { key: 'fullLength',   label: 'Full Length',   placeholder: '14' },
    { key: 'sleeveLength', label: 'Sleeve Length', placeholder: '8'  },
    { key: 'shoulder',     label: 'Shoulder',      placeholder: '7.5'},
    { key: 'neckRound',    label: 'Neck Round',    placeholder: '9'  },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Ionicons name="body-outline" size={48} color={COLORS.primary} />
          <Text style={styles.title}>Jhabla Measurements</Text>
          <Text style={styles.subtitle}>Dawoodi Bohra Baby Girls Dress</Text>
        </View>

        <View style={styles.form}>
          {fields.map(({ key, label, placeholder }) => (
            <View key={key} style={styles.inputGroup}>
              <Text style={styles.label}>{label} (inches)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={formData[key]}
                onChangeText={value => updateField(key, value)}
                placeholder={placeholder}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.submitText}>Generate Jhabla Draft</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary, marginTop: 12 },
  subtitle: { fontSize: 14, color: '#FF69B4', marginTop: 4, fontStyle: 'italic' },
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
    backgroundColor: '#FF69B4',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  submitText: { fontSize: 18, fontWeight: '600', color: '#fff' },
});
