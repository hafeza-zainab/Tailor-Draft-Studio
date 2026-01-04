// src/features/rida/screens/RidaDraftInput.tsx
import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../common/styles/colors';

interface RidaFormData {
  chest: string;
  waist: string;
  fullFrontLength: string;
  fullBackLength: string;
  shoulder: string;
  sleeveLength: string;
  neckRound: string;
}

interface FormField {
  key: keyof RidaFormData;
  label: string;
  placeholder: string;
}

export default function RidaDraftInput() {
  const navigation = useNavigation<any>();
  const [formData, setFormData] = useState<RidaFormData>({
    chest: '',
    waist: '',
    fullFrontLength: '',
    fullBackLength: '',
    shoulder: '',
    sleeveLength: '',
    neckRound: '',
  });

  const validateForm = (): boolean => {
    const values = Object.values(formData);
    if (values.some(value => isNaN(Number(value)) || Number(value) <= 0)) {
      Alert.alert('Validation Error', 'Please enter valid positive numeric measurements');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    navigation.navigate('RidaDraftPreview' as any, { draft: formData } as any);
  };

  const updateField = (field: keyof RidaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const fields: FormField[] = [
    { key: 'chest', label: 'Chest', placeholder: '38' },
    { key: 'waist', label: 'Waist', placeholder: '34' },
    { key: 'fullFrontLength', label: 'Full Front Length', placeholder: '27' },
    { key: 'fullBackLength', label: 'Full Back Length', placeholder: '30' },
    { key: 'shoulder', label: 'Shoulder', placeholder: '10' },
    { key: 'sleeveLength', label: 'Sleeve Length', placeholder: '18' },
    { key: 'neckRound', label: 'Neck Round', placeholder: '14' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Ionicons name="shirt-outline" size={48} color={COLORS.primary} />
          <Text style={styles.title}>Rida Measurements</Text>
          <Text style={styles.subtitle}>Traditional Dawoodi Bohra Wear</Text>
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
          <Text style={styles.submitText}>Generate Rida Draft</Text>
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
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
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
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  submitText: { fontSize: 18, fontWeight: '600', color: '#fff' },
});
