import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DraftData } from '../common/types';
import { listDrafts, deleteDraft } from '../common/utils/storage';
import { useIsFocused } from '@react-navigation/native';

// Mock constants (replace with your actual constants file)
const COLORS = {
  primary: '#007AFF',
  danger: '#FF3B30',
  light: '#F5F5F7',
  textSecondary: '#666',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  item: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  itemDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 16,
    backgroundColor: COLORS.danger + '20',
    borderRadius: 8,
  },
});

export default function SavedDrafts({ navigation, route }: { navigation: any; route?: any }) {
  const [drafts, setDrafts] = useState<DraftData[]>([]);
  const isFocused = useIsFocused();
  const filter = route?.params?.filter as string | undefined; // e.g. 'izar'

  const loadDrafts = async () => {
    const loadedDrafts = await listDrafts();
    if (filter) {
      setDrafts(loadedDrafts.filter(d => d.garment === filter));
    } else {
      setDrafts(loadedDrafts);
    }
  };

  useEffect(() => {
    loadDrafts();
  }, [isFocused]);

  const handleDelete = async (key: string) => {
    await deleteDraft(key);
    setDrafts(prev => prev.filter(draft => draft.key !== key));
  };

  const keyExtractor = (item: DraftData) => item.key || item.timestamp.toString();

  const renderItem = ({ item }: { item: DraftData }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        // Open correct preview based on garment
        switch ((item.garment || '').toLowerCase()) {
          case 'kurta':
            navigation.navigate('KurtaDraftPreview', { draft: item.input });
            break;
          case 'izar':
            navigation.navigate('IzarDraftPreview', { draft: item.input });
            break;
          case 'jhabla':
            navigation.navigate('JhablaForm', { draft: item.input });
            break;
          default:
            navigation.navigate('Home');
        }
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{(item.garment || 'Draft').toUpperCase()} Draft</Text>
        <Text style={styles.itemDate}>{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
      <TouchableOpacity
        onPress={() => item.key && handleDelete(item.key)}
        style={styles.deleteBtn}
      >
        <Ionicons name="trash-outline" size={24} color={COLORS.danger} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={drafts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
