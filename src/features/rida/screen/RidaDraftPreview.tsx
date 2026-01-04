// src/features/rida/screens/RidaDraftPreview.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { plotRidaDraftSVG } from '../svg/RidaSVG';
import { exportSvgToPdf } from '../../../common/utils/exporter';
import { saveDraft } from '../../../common/utils/storage';
import { wrapSvgHtml } from '../../../common/utils/htmlWrapper';
import { COLORS } from '../../../common/styles/colors';
import type { DraftData, Measurement } from '../../../common/types';
import { RidaDraft } from '../logic/RidaLogic'; // ✅ IMPORT OFFICIAL TYPE

interface Props {
  route: { params: { draft: any } };
  navigation: any;
}

export default function RidaDraftPreview({ route, navigation }: Props) {
  const { draft } = route.params;
  const [svgHtml, setSvgHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // ✅ CREATE FULL RidaDraft with ALL REQUIRED PROPERTIES
      const fullDraft: RidaDraft = {
        key: '',
        input: draft as Measurement,
        calculated: {
          chest: Number(draft.chest) || 34,
          waist: Number(draft.waist) || 30,
          fullFrontLength: Number(draft.fullFrontLength) || 26,
          fullBackLength: Number(draft.fullBackLength) || 24,
          shoulder: Number(draft.shoulder) || 16,
          sleeveLength: Number(draft.sleeveLength) || 22,
          neckRound: Number(draft.neckRound) || 15,
          armholeDepth: 9.5,        // ✅ REQUIRED
          frontYokeDepth: 7.5       // ✅ REQUIRED
        },
        timestamp: Date.now(),
        garment: 'rida',
        rida: {
          chest: Number(draft.chest) || 34,
          waist: Number(draft.waist) || 30,
          fullFrontLength: Number(draft.fullFrontLength) || 26,
          fullBackLength: Number(draft.fullBackLength) || 24,
          shoulder: Number(draft.shoulder) || 16,
          sleeveLength: Number(draft.sleeveLength) || 22,
          neckRound: Number(draft.neckRound) || 15,
          armholeDepth: 9.5,        // ✅ REQUIRED
          frontYokeDepth: 7.5       // ✅ REQUIRED
        }
      };
      
      const svg = plotRidaDraftSVG(fullDraft);
      const html = wrapSvgHtml(svg);
      setSvgHtml(html);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate Rida preview');
    } finally {
      setLoading(false);
    }
  }, [draft]);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');

  const handleSaveDraft = async () => {
    setShowSaveModal(true);
  };

  const confirmSave = async () => {
    const name = saveName.trim();
    const keyBase = name ? `draft_${name.replace(/\s+/g, '_').toLowerCase()}` : `rida_${Date.now()}`;
    const key = `${keyBase}_${Date.now()}`;

    const fullDraft: DraftData = {
      key,
      input: draft as Measurement,
      calculated: {
        chest: Number(draft.chest) || 34,
        waist: Number(draft.waist) || 30,
        fullFrontLength: Number(draft.fullFrontLength) || 26,
        fullBackLength: Number(draft.fullBackLength) || 24,
        shoulder: Number(draft.shoulder) || 16,
        sleeveLength: Number(draft.sleeveLength) || 22,
        neckRound: Number(draft.neckRound) || 15,
        armholeDepth: 9.5,
        frontYokeDepth: 7.5
      },
      timestamp: Date.now(),
      garment: 'rida',
      clientName: name || undefined,
    };

    const success = await saveDraft(key, fullDraft);
    setShowSaveModal(false);
    setSaveName('');
    Alert.alert('Success', success ? 'Rida draft saved!' : 'Failed to save draft');
  };

  // Rest of your component stays EXACTLY the same...
  const { height } = Dimensions.get('window');
  const previewHeight = height * 0.6;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Generating Rida Pattern...</Text>
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
        <Text style={styles.title}>Rida Draft Preview</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={[styles.previewContainer, { height: previewHeight }]}>
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
        <TouchableOpacity style={[styles.actionButton, styles.exportButton]} onPress={async () => {
          try {
            // regenerate svg from plotted draft
            const fullDraft: RidaDraft = {
              key: '',
              input: draft as Measurement,
              calculated: {
                chest: Number(draft.chest) || 34,
                waist: Number(draft.waist) || 30,
                fullFrontLength: Number(draft.fullFrontLength) || 26,
                fullBackLength: Number(draft.fullBackLength) || 24,
                shoulder: Number(draft.shoulder) || 16,
                sleeveLength: Number(draft.sleeveLength) || 22,
                neckRound: Number(draft.neckRound) || 15,
                armholeDepth: 9.5,
                frontYokeDepth: 7.5
              },
              timestamp: Date.now(),
              garment: 'rida',
              rida: draft as any,
            };
            const svg = plotRidaDraftSVG(fullDraft);
            const res = await exportSvgToPdf(svg, 60, 60, `rida_${Date.now()}`);
            Alert.alert('Export', res.filePath ? `PDF saved: ${res.filePath}` : 'Export failed');
          } catch (err) {
            Alert.alert('Export error', 'Failed to export PDF');
          }
        }}>
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Export PDF</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>📏 Print at 100% scale for best results</Text>
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

// Your styles remain exactly the same...
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
    backgroundColor: COLORS.surface,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
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
  exportButton: { backgroundColor: COLORS.accent },
  actionText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  note: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.textSecondary,
    paddingHorizontal: 32,
    fontStyle: 'italic',
  },
});
