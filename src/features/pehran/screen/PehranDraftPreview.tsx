// src/features/pehran/screens/PehranDraftPreview.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { exportSvgToPdf } from '../../../common/utils/exporter';
import { plotPehranDraftSVG } from '../svg/PehranSVG';
import { wrapSvgHtml } from '../../../common/utils/htmlWrapper';
import { calculatePehranDraft } from '../logic/PehranLogic';
import { saveDraft } from '../../../common/utils/storage';
import { COLORS } from '../../../common/styles/colors';
import type { DraftData, Measurement } from '../../../common/types';
import type { PehranFormData } from './PehranDraftInput';

interface Props {
  route: { params: { draft: PehranFormData } };
  navigation: any;
}

export default function PehranDraftPreview({ route, navigation }: Props) {
  const { draft } = route.params;
  const [svgHtml, setSvgHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const measurements: Measurement = {
        chest: Number(draft.chest),
        waist: Number(draft.waist),
        fullLength: Number(draft.fullLength),
        sleeveLength: Number(draft.sleeveLength),
        neckRound: Number(draft.neckRound),
        shoulder: Number(draft.shoulder),
      } as Measurement;

      const pehranDraft = calculatePehranDraft(measurements);
      const svg = plotPehranDraftSVG(pehranDraft);

      const html = wrapSvgHtml(svg);
      setSvgHtml(html);
    } catch (error) {
      console.error('SVG generation error:', error);
      Alert.alert('Error', 'Failed to generate Pehran preview');
    } finally {
      setLoading(false);
    }
  }, [draft]);

  const handleSaveDraft = async () => {
    try {
      const calculated = {
        chest: Number(draft.chest),
        waist: Number(draft.waist),
        fullLength: Number(draft.fullLength),
        sleeveLength: Number(draft.sleeveLength),
        shoulder: Number(draft.shoulder),
        neckRound: Number(draft.neckRound),
      };

      const saveDraftData: DraftData = {
        key: `pehran_${Date.now()}`,
        input: draft as unknown as Measurement,
        calculated,
        timestamp: Date.now(),
        garment: 'pehran',
      };

      setShowSaveModal(true);
    } catch (error) {
      console.error('Save draft error:', error);
      Alert.alert('Error', 'Failed to save draft');
    }
  };

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');

  
  const confirmSave = async () => {
    const name = saveName.trim();
    const keyBase = name ? `draft_${name.replace(/\s+/g, '_').toLowerCase()}` : `pehran_${Date.now()}`;
    const key = `${keyBase}_${Date.now()}`;

    const calculated = {
      chest: Number(draft.chest),
      waist: Number(draft.waist),
      fullLength: Number(draft.fullLength),
      sleeveLength: Number(draft.sleeveLength),
      shoulder: Number(draft.shoulder),
      neckRound: Number(draft.neckRound),
    };

    const saveDraftData: DraftData = {
      key,
      input: draft as unknown as Measurement,
      calculated,
      timestamp: Date.now(),
      garment: 'pehran',
      clientName: name || undefined,
    };

    const success = await saveDraft(key, saveDraftData);
    setShowSaveModal(false);
    setSaveName('');
    Alert.alert('Success', success ? 'Pehran draft saved!' : 'Failed to save draft');
  };

 const handleExportPDF = () => {
  Alert.alert(
    'Export PDF',
    'PDF export is not available in this build yet.'
  );
};


  const { height } = Dimensions.get('window');
  const previewHeight = height * 0.6;

  if (loading || !svgHtml) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B4513" />
          <Text style={styles.loadingText}>Generating Pehran Pattern...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Pehran Draft Preview</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={[styles.previewContainer, { height: previewHeight }]}>
        <WebView
          source={{ html: svgHtml }}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          scalesPageToFit={true}
          originWhitelist={['*']}
          automaticallyAdjustContentInsets={false}
          nestedScrollEnabled={true}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleSaveDraft}>
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Save Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.exportButton]}
          onPress={async () => {
            try {
              // regenerate draft and svg to export full-size
              const measurements: Measurement = {
                chest: Number(draft.chest),
                waist: Number(draft.waist),
                fullLength: Number(draft.fullLength),
                sleeveLength: Number(draft.sleeveLength),
                neckRound: Number(draft.neckRound),
                shoulder: Number(draft.shoulder),
              } as Measurement;

              const pehranDraft = calculatePehranDraft(measurements);
              const svg = plotPehranDraftSVG(pehranDraft);
              const res = await exportSvgToPdf(svg, 60, 60, `pehran_${Date.now()}`);
              Alert.alert('Export', res.filePath ? `PDF saved: ${res.filePath}` : 'Export failed');
            } catch (err) {
              console.error('Export error', err);
              Alert.alert('Export Failed', 'Could not export PDF');
            }
          }}
        >
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Export PDF</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        📏 Traditional Kashmiri Pehran – print at 100% scale and check the scale
        box for accuracy.
      </Text>
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
    backgroundColor: '#8B4513',
  },
  backButton: { padding: 8 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: { width: 40, height: 40 },
  previewContainer: {
    backgroundColor: COLORS.surface,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  webview: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: { marginTop: 12, fontSize: 16, color: COLORS.textSecondary },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 20,
  },
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
  exportButton: { backgroundColor: '#D2691E' },
  actionText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  note: {
    textAlign: 'center',
    fontSize: 14,
    color: '#8B4513',
    paddingHorizontal: 32,
    fontStyle: 'italic',
    fontWeight: '600',
    marginBottom: 12,
  },
});
