// src/features/kurta/screens/KurtaDraftPreview.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { plotKurtaDraftSVG } from '../svg/KurtaSVG';
import { saveDraft } from '../../../common/utils/storage';
import { DraftData } from '../../../common/types';
import { COLORS } from '../../../common/styles/colors';
import { wrapSvgHtml } from '../../../common/utils/htmlWrapper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { KurtaStackParamList } from '../../../navigation/KurtaNavigator';
import type { KurtaDraft } from '../logic/KurtaLogic';

const Print = require('expo-print') as any;
const Sharing = require('expo-sharing') as any;

type Props = NativeStackScreenProps<KurtaStackParamList, 'KurtaDraftPreview'>;

export default function KurtaDraftPreview({ route, navigation }: Props) {
  const { draft } = route.params as { draft: KurtaDraft };
  const [svgHtml, setSvgHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateSVG = async () => {
      try {
        const svg = plotKurtaDraftSVG(draft);
        const html = wrapSvgHtml(svg);
        setSvgHtml(html);
      } catch (error) {
        console.error('Kurta SVG generation error', error);
        Alert.alert('Error', 'Failed to generate draft preview');
      } finally {
        setLoading(false);
      }
    };

    generateSVG();
  }, [draft]);

  const handleSaveDraft = async () => {
    try {
      const dataToSave: DraftData = {
        key: draft.key,
        input: draft.input,
        calculated: draft.calculated,
        timestamp: draft.timestamp,
        garment: 'kurta',
      };

      const success = await saveDraft(draft.key, dataToSave);
      Alert.alert(
        'Success',
        success ? 'Draft saved successfully!' : 'Failed to save draft',
      );
    } catch (err) {
      console.error('saveDraft error', err);
      Alert.alert('Error', 'Failed to save draft');
    }
  };

  const exportPdfFromHtml = async (html: string) => {
    try {
      if (Platform.OS !== 'web' && !(await Sharing.isAvailableAsync())) {
        Alert.alert(
          'Sharing Unavailable',
          'Sharing not available on this device. PDF will be saved locally.',
        );
        const { uri } = await Print.printToFileAsync({
          html,
          base64: false,
        });
        Alert.alert('PDF Ready', `File saved to: ${uri}`);
        return;
      }

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Kurta Draft PDF',
      });
    } catch (err) {
      console.error('exportPdf error', err);
      if (Platform.OS !== 'web') {
        try {
          await Print.printAsync({ html });
        } catch {
          Alert.alert('Export Failed', 'PDF export failed.');
        }
      } else {
        Alert.alert('Export Failed', 'PDF export failed.');
      }
    }
  };

  const { height } = Dimensions.get('window');
  const previewHeight = height * 0.6;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Generating Kurta Pattern...</Text>
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
        <Text style={styles.title}>Kurta Draft Preview</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={[styles.previewContainer, { height: previewHeight }]}>
        <WebView
          source={{ html: svgHtml }}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          scalesPageToFit
          originWhitelist={['*']}
          automaticallyAdjustContentInsets={false}
          nestedScrollEnabled
          startInLoadingState
          renderLoading={() => (
            <View style={styles.webviewLoading}>
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          )}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleSaveDraft}>
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Save Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.exportButton]}
          onPress={() => exportPdfFromHtml(svgHtml)}
        >
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Export PDF</Text>
        </TouchableOpacity>
      </View>
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
  backButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  placeholder: { width: 40 },
  previewContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  webview: { flex: 1 },
  webviewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
    paddingTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  exportButton: { backgroundColor: '#f97316' },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
