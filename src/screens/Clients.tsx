// src/screens/Clients.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../common/styles/colors';
import { Ionicons } from '@expo/vector-icons';

interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  lastVisit?: number;
}

const CLIENTS_KEY = 'clients_list';

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);

  const loadClients = async () => {
    try {
      const data = await AsyncStorage.getItem(CLIENTS_KEY);
      if (data) setClients(JSON.parse(data));
    } catch (error) {
      Alert.alert('Error', 'Failed to load clients');
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const renderItem = ({ item }: { item: Client }) => (
    <TouchableOpacity style={styles.item}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        {item.phone && <Text style={styles.detail}>📞 {item.phone}</Text>}
        {item.email && <Text style={styles.detail}>✉️ {item.email}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {clients.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No clients found.</Text>
        </View>
      ) : (
        <FlatList data={clients} keyExtractor={(item) => item.id} renderItem={renderItem} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: COLORS.textSecondary },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  name: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  detail: { fontSize: 14, color: COLORS.textSecondary },
});
