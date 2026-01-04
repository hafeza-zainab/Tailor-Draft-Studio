// src/features/saya/screens/SayaDraftInput.tsx
import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../common/styles/colors';

export default function SayaDraftInput() {
  const navigation = useNavigation<any>();
  const [formData, setFormData] = useState({
    chest: '',
    waist: '',
    fullLength: '',
    sleeveLength: '',
    neckRound: '',
    shoulder: '',
  });

  const validateForm = (): boolean => {
    const values = Object.values(formData);
    if (values.some(value => isNaN(Number(value)) || Number(value) <= 0)) {
      Alert.alert('Validation Error', 'Please enter valid positive numbers');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    navigation.navigate('SayaDraftPreview', { draft: formData });
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const fields = [
    { key: 'chest', label: 'Chest', placeholder: '38' },
    { key: 'waist', label: 'Waist', placeholder: '34' },
    { key: 'fullLength', label: 'Full Length', placeholder: '40' },
    { key: 'sleeveLength', label: 'Sleeve Length', placeholder: '23' },
    { key: 'neckRound', label: 'Neck Round', placeholder: '13' },
    { key: 'shoulder', label: 'Shoulder', placeholder: '10' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Ionicons name="shirt-outline" as any size={48} color={COLORS.primary} />
          <Text style={styles.title}>Saya Measurements</Text>
          <Text style={styles.subtitle}>Traditional Dress Measurements</Text>
        </View>

        <View style={styles.form}>
          {fields.map(({ key, label, placeholder }) => (
            <View key={key} style={styles.inputGroup}>
              <Text style={styles.label}>{label} (inches)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={formData[key as keyof typeof formData]}
                onChangeText={value => updateField(key as keyof typeof formData, value)}
                placeholder={placeholder}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="checkmark-circle-outline" as any size={20} color="#fff" />
          <Text style={styles.submitText}>Generate Saya Draft</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// styles remain the same...
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
