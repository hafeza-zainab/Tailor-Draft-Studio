// src/features/jhabla/screens/JhablaDraftPreview.tsx
import React, { useEffect, useState, useMemo } from 'react';
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
import { plotJhablaDraftSVG, JhablaDraftArgs} from '../svg/JhablaSVG';
import { exportSvgToPdf } from '../../../common/utils/exporter';
import { wrapSvgHtml } from '../../../common/utils/htmlWrapper';
import { saveDraft } from '../../../common/utils/storage';
import { COLORS } from '../../../common/styles/colors';

type DraftFormData = {
  chest: string;
  waist: string;
  fullLength: string;
  sleeveLength: string;
  shoulder: string;
  neckRound: string;
};

interface Props {
  route: { params: { draft: DraftFormData } };
  navigation: any;
}

export default function JhablaDraftPreview({ route, navigation }: Props) {
  const { draft } = route.params;
  const [svgHtml, setSvgHtml] = useState('');
  const [loading, setLoading] = useState(true);

  // ✅ Create EXACTLY what plotJhablaDraftSVG expects - type inferred
  const draftData: JhablaDraftArgs= useMemo(() => {
    const chest = Number(draft.chest) || 0;
    const waist = Number(draft.waist) || 0;
    const fullLength = Number(draft.fullLength) || 0;
    const sleeveLength = Number(draft.sleeveLength) || 0;
    const shoulder = Number(draft.shoulder) || 0;
    const neckRound = Number(draft.neckRound) || 0;

    return {
      chest,
      waist,
      fullLength,
      sleeveLength,
      shoulder,
      neckRound,
      quarterChest: +(chest / 4 + 0.5).toFixed(2),
      armholeDepth: +(chest / 6 + 1).toFixed(2),
    };
  }, [draft]);

  // Full draft for saving
  const fullDraft = useMemo(() => ({
    key: `jhabla_${Date.now()}`,
    input: {
      chest: Number(draft.chest) || 0,
      waist: Number(draft.waist) || 0,
      fullLength: Number(draft.fullLength) || 0,
      sleeveLength: Number(draft.sleeveLength) || 0,
      shoulder: Number(draft.shoulder) || 0,
      neckRound: Number(draft.neckRound) || 0,
    },
    // `saveDraft` expects `calculated` to be a Record<string, number>.
    // Filter out any non-number fields (e.g. booleans like showGrid).
    calculated: Object.fromEntries(
      Object.entries(draftData).filter(([, v]) => typeof v === 'number')
    ) as Record<string, number>,
    timestamp: Date.now(),
    garment: 'jhabla',
  }), [draft, draftData]);

  
  useEffect(() => {
  try {
    const svg = plotJhablaDraftSVG(draftData);
    const html = wrapSvgHtml(svg);
    setSvgHtml(html);
  } catch (error) {
    Alert.alert('Error', 'Failed to generate Jhabla preview');
  } finally {
    setLoading(false);
  }
}, [draftData]);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');

  const handleSaveDraft = async () => {
    setShowSaveModal(true);
  };

  const confirmSave = async () => {
    const name = saveName.trim();
    const keyBase = name ? `draft_${name.replace(/\s+/g, '_').toLowerCase()}` : `jhabla_${Date.now()}`;
    const key = `${keyBase}_${Date.now()}`;
    try {
      const dataToSave = { ...fullDraft, clientName: name || undefined } as any;
      const success = await saveDraft(key, dataToSave);
      setShowSaveModal(false);
      setSaveName('');
      Alert.alert('Success', success ? 'Jhabla draft saved!' : 'Failed to save draft');
    } catch (e) {
      Alert.alert('Error', 'Failed to save draft');
    }
  };

  const { height } = Dimensions.get('window');
  const previewHeight = height * 0.6;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF69B4" />
          <Text style={styles.loadingText}>Generating Baby Jhabla Pattern...</Text>
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
        <Text style={styles.title}>Jhabla Draft Preview</Text>
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
            const svg = plotJhablaDraftSVG(draftData);
            const res = await exportSvgToPdf(svg, 60, 60, `jhabla_${Date.now()}`);
            Alert.alert('Export', res.filePath ? `PDF saved: ${res.filePath}` : 'Export failed');
          } catch (err) {
            Alert.alert('Export error', 'Failed to export PDF');
          }
        }}>
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Export PDF</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        👶 Baby Jhabla - Dawoodi Bohra Traditional - Print at 100% scale
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
    backgroundColor: '#FF69B4',
  },
  backButton: { padding: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff', flex: 1, textAlign: 'center' },
  placeholder: { width: 40, height: 40 },
  previewContainer: {
    backgroundColor: COLORS.surface,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF69B4',
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
  exportButton: { backgroundColor: '#FF1493' },
  actionText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  note: {
    textAlign: 'center',
    fontSize: 14,
    color: '#FF69B4',
    paddingHorizontal: 32,
    fontStyle: 'italic',
    fontWeight: '600',
  },
});
