// src/features/izar/screens/IzarDraftInput.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../common/styles/colors';

export interface IzarFormData {
  waist: string;
  hip: string;
  fullLength: string;
  bottomWidth: string;
  crotchDepthFront: string;
  crotchDepthBack: string;
  riseFront: string;
  riseBack: string;
}

export default function IzarDraftInput() {
  const navigation = useNavigation<any>();
  const [formData, setFormData] = useState<IzarFormData>({
    waist: '',
    hip: '',
    fullLength: '',
    bottomWidth: '',
    crotchDepthFront: '',
    crotchDepthBack: '',
    riseFront: '',
    riseBack: '',
  });

  const updateField = (field: keyof IzarFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const toNum = (v: string) => {
      const n = parseFloat(v.replace(',', '.'));
      return Number.isFinite(n) ? n : 0;
    };

    const waist = toNum(formData.waist);
    const hip = toNum(formData.hip);
    const fullLength = toNum(formData.fullLength);
    const bottomWidth = toNum(formData.bottomWidth);

    // Derive sensible defaults for depths / rises if user leaves them blank
    const crotchDepthFront =
      toNum(formData.crotchDepthFront) || Math.round(hip / 4);
    const crotchDepthBack =
      toNum(formData.crotchDepthBack) || Math.round((hip / 4) + 1);
    const riseFront = toNum(formData.riseFront) || Math.round(fullLength / 4);
    const riseBack = toNum(formData.riseBack) || Math.round(fullLength / 3.5);

    const measurementData = {
      waist,
      hip,
      fullLength,
      bottomWidth,
      crotchDepthFront,
      crotchDepthBack,
      riseFront,
      riseBack,
    };

    if (
      Object.values(measurementData).some(
        v => !v || v <= 0 || Number.isNaN(v),
      )
    ) {
      Alert.alert(
        'Validation Error',
        'Please enter valid positive measurements for Izar.',
      );
      return;
    }

    navigation.navigate('IzarDraftPreview', { draft: measurementData });
  };

  const renderNumberInput = (
    key: keyof IzarFormData,
    label: string,
    placeholder: string,
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label} (inches)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={formData[key]}
        onChangeText={value => updateField(key, value)}
        placeholder={placeholder}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Ionicons name="body-outline" size={48} color={COLORS.primary} />
          <Text style={styles.title}>Izar Measurements</Text>
        </View>

        <View style={styles.form}>
          {renderNumberInput('waist', 'Waist', '32')}
          {renderNumberInput('hip', 'Hip', '38')}
          {renderNumberInput('fullLength', 'Full Length', '38')}
          {renderNumberInput('bottomWidth', 'Bottom Width', '30')}
          {renderNumberInput('crotchDepthFront', 'Crotch Depth Front', 'Optional')}
          {renderNumberInput('crotchDepthBack', 'Crotch Depth Back', 'Optional')}
          {renderNumberInput('riseFront', 'Rise Front', 'Optional')}
          {renderNumberInput('riseBack', 'Rise Back', 'Optional')}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.submitText}>Generate Izar Draft</Text>
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
