// src/features/saya/screens/SayaDraftPreview.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { plotSayaDraftSVG } from '../svg/SayaSVG';
import { saveDraft } from '../../../common/utils/storage';
import { COLORS } from '../../../common/styles/colors';
import type { SayaDraft } from '../logic/SayaLogic';

interface Props {
  route: { params: { draft: any } };
  navigation: any;
}

export default function SayaDraftPreview({ route, navigation }: Props) {
  const { draft: inputDraft } = route.params;
  const [svgHtml, setSvgHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Create FULL draft with all required properties
      const fullDraft: SayaDraft = {
        key: '',
        input: inputDraft,
        calculated: inputDraft, // Will be replaced by real logic
        timestamp: Date.now(),
        garment: 'saya',
        saya: inputDraft,
      };
      
      const svg = plotSayaDraftSVG(fullDraft);
      const html = wrapSvgHtml(svg);
      setSvgHtml(html);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate Saya preview');
    } finally {
      setLoading(false);
    }
  }, [inputDraft]);

  const handleSaveDraft = async () => {
    const fullDraft: any = {
      key: `saya_${Date.now()}`,
      input: inputDraft,
      calculated: inputDraft,
      timestamp: Date.now(),
      garment: 'saya',
    };
    const success = await saveDraft(fullDraft.key!, fullDraft);
    Alert.alert('Success', success ? 'Saya draft saved!' : 'Failed to save draft');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Generating Saya Pattern...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Saya Draft Preview</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.previewContainer}>
        <WebView source={{ html: svgHtml }} style={styles.webview} />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleSaveDraft}>
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Save Draft</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: COLORS.primary },
  backButton: { padding: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff', flex: 1, textAlign: 'center' },
  placeholder: { width: 40, height: 40 },
  previewContainer: { flex: 1, margin: 16, borderRadius: 12, overflow: 'hidden' },
  webview: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  loadingText: { marginTop: 12, fontSize: 16, color: COLORS.textSecondary },
  actions: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, paddingBottom: 20 },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
