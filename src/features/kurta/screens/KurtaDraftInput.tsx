// src/features/kurta/screens/KurtaDraftInput.tsx
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
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../common/styles/colors';
import { Measurement, RootStackParamList } from '../../../common/types';
import { calculateKurtaDraft, KurtaDraft } from '../logic/KurtaLogic';

// Extend RootStackParamList locally to include KurtaDraftPreview
type ExtendedParamList = RootStackParamList & {
  KurtaDraftPreview: { draft: KurtaDraft };
};

interface FormData {
  chest: number;
  waist: number;
  hip: number;
  fullLength: number;
  sleeveLength: number;
  neckRound: number;
  shoulder: number;
}

export default function KurtaDraftInput() {
  const navigation = useNavigation<NavigationProp<ExtendedParamList>>();
  const [formData, setFormData] = useState<FormData>({
    chest: 0,
    waist: 0,
    hip: 0,
    fullLength: 0,
    sleeveLength: 0,
    neckRound: 0,
    shoulder: 0,
  });
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const values = Object.values(formData);
    if (
      values.length === 0 ||
      values.some((v: number) => v <= 0 || Number.isNaN(v))
    ) {
      Alert.alert('Validation Error', 'Please enter valid positive measurements');
      return false;
    }
    return true;
  };

  const updateField = (field: keyof FormData, value: string) => {
    const num = parseFloat(value.replace(',', '.'));
    setFormData(prev => ({
      ...prev,
      [field]: Number.isNaN(num) ? 0 : num,
    }));
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const measurement: Measurement = {
      chest: formData.chest,
      waist: formData.waist,
      hip: formData.hip,
      fullLength: formData.fullLength,
      sleeveLength: formData.sleeveLength,
      neckRound: formData.neckRound,
      shoulder: formData.shoulder,
    };

    const kurtaDraft = calculateKurtaDraft(measurement);

    setLoading(true);
    setTimeout(() => {
      navigation.navigate('KurtaDraftPreview', { draft: kurtaDraft });
      setLoading(false);
    }, 300);
  };

  const fields: (keyof FormData)[] = [
    'chest',
    'waist',
    'hip',
    'fullLength',
    'sleeveLength',
    'neckRound',
    'shoulder',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Ionicons name="shirt-outline" size={48} color={COLORS.primary} />
          <Text style={styles.title}>Kurta Measurements</Text>
        </View>

        <View style={styles.form}>
          {fields.map(field => (
            <View key={field as string} style={styles.inputGroup}>
              <Text style={styles.label}>
                {field
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())}{' '}
                (inches)
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={formData[field] ? String(formData[field]) : ''}
                onChangeText={value => updateField(field, value)}
                placeholder={
                  field === 'chest'
                    ? '36'
                    : field === 'fullLength'
                    ? '40'
                    : '16'
                }
              />
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.loadingButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <Ionicons name="hourglass-outline" size={20} color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.submitText}>Generate Draft</Text>
            </>
          )}
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
  loadingButton: { backgroundColor: COLORS.textSecondary },
  submitText: { fontSize: 18, fontWeight: '600', color: '#fff' },
});
