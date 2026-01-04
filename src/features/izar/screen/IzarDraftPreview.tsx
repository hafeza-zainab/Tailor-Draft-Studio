// src/features/izar/screens/IzarDraftPreview.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { plotIzarDraftSVG, type IzarDraftArgs } from '../svg/IzarSVG';
import { wrapSvgHtml } from '../../../common/utils/htmlWrapper';
import { saveDraft } from '../../../common/utils/storage';
import { COLORS } from '../../../common/styles/colors';

interface Props {
  route: { params: { draft: IzarDraftArgs } };
  navigation: any;
}

// Shape of a generic draft used across app
interface DraftData {
  input: IzarDraftArgs;
  calculated: Record<string, number>;
  timestamp: number;
  garment: string;
}

export default function IzarDraftPreview({ route, navigation }: Props) {
  const { draft } = route.params;
  const [svgHtml, setSvgHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generate = () => {
      try {
        // Build full draft object (input + calculated)
        const calculated: Record<string, number> = {
          waist: draft.waist,
          hip: draft.hip,
          fullLength: draft.fullLength,
          bottomWidth: draft.bottomWidth,
          crotchDepthFront: draft.crotchDepthFront,
          crotchDepthBack: draft.crotchDepthBack,
          riseFront: draft.riseFront,
          riseBack: draft.riseBack,
        };

        const fullDraft: DraftData = {
          input: draft,
          calculated,
          timestamp: Date.now(),
          garment: 'izar',
        };

        // Now TypeScript knows draft has all properties
        const svg = plotIzarDraftSVG(draft);

        const html = wrapSvgHtml(svg);
        setSvgHtml(html);
      } catch (error) {
        console.error('Izar SVG generation error', error);
        Alert.alert('Error', 'Failed to generate Izar preview');
      } finally {
        setLoading(false);
      }
    };

    generate();
  }, [draft]);

  const handleSaveDraft = async () => {
    try {
      const calculated: Record<string, number> = {
        waist: draft.waist,
        hip: draft.hip,
        fullLength: draft.fullLength,
        bottomWidth: draft.bottomWidth,
        crotchDepthFront: draft.crotchDepthFront,
        crotchDepthBack: draft.crotchDepthBack,
        riseFront: draft.riseFront,
        riseBack: draft.riseBack,
      };

      const dataToSave: DraftData = {
        input: draft,
        calculated,
        timestamp: Date.now(),
        garment: 'izar',
      };

      const key = `draft_izar_${dataToSave.timestamp}`;
      // prompt for client name before saving
      setShowSaveModal(true);
    } catch (err) {
      console.error('saveDraft izar error', err);
      Alert.alert('Error', 'Failed to save draft');
    }
  };

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');

  const confirmSave = async () => {
    const name = saveName.trim();
    const keyBase = name ? `draft_${name.replace(/\s+/g, '_').toLowerCase()}` : `draft_izar`;
    const key = `${keyBase}_${Date.now()}`;

    const calculated: Record<string, number> = {
      waist: draft.waist,
      hip: draft.hip,
      fullLength: draft.fullLength,
      bottomWidth: draft.bottomWidth,
      crotchDepthFront: draft.crotchDepthFront,
      crotchDepthBack: draft.crotchDepthBack,
      riseFront: draft.riseFront,
      riseBack: draft.riseBack,
    };

    const dataToSave: any = {
      input: draft,
      calculated,
      timestamp: Date.now(),
      garment: 'izar',
      clientName: name || undefined,
    };

    const success = await saveDraft(key, dataToSave);
    setShowSaveModal(false);
    setSaveName('');
    Alert.alert('Success', success ? 'Izar draft saved!' : 'Failed to save draft');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Generating Izar Pattern...</Text>
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
        <Text style={styles.title}>Izar Draft Preview</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.previewContainer}>
        <WebView
          source={{ html: svgHtml }}
          style={styles.webview}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleSaveDraft}>
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { marginLeft: 12 }]} onPress={async () => {
          try {
            const svg = plotIzarDraftSVG(draft);
            const { exportSvgToPdf } = await import('../../../common/utils/exporter');
            const res = await exportSvgToPdf(svg, 60, 60, `izar_${Date.now()}`);
            Alert.alert('Export', res.filePath ? `PDF saved: ${res.filePath}` : 'Export failed');
          } catch (err) {
            Alert.alert('Export failed', 'Could not export PDF');
          }
        }}>
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Export PDF</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={showSaveModal} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View style={{ width: '86%', backgroundColor: '#fff', padding: 16, borderRadius: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>Save Draft</Text>
            <TextInput placeholder="Enter client name (optional)" value={saveName} onChangeText={setSaveName} style={{ borderWidth: 1, borderColor: '#e5e7eb', padding: 8, borderRadius: 8, marginBottom: 12 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => { setShowSaveModal(false); setSaveName(''); }} style={{ padding: 8, marginRight: 12 }}>
                <Text style={{ color: '#6b7280' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmSave} style={{ padding: 8 }}>
                <Text style={{ color: '#0ea5a4', fontWeight: '700' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.primary,
  },
  backButton: { padding: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff', flex: 1, textAlign: 'center' },
  placeholder: { width: 40, height: 40 },
  previewContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  webview: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
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
