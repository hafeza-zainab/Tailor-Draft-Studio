// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../common/styles/colors';

const garmentFeatures = [
  { title: 'Kurta', icon: 'shirt-outline', screen: 'Kurta' },
  { title: 'Izar', icon: 'body-outline', screen: 'Izar' },
  { title: 'Pehran', icon: 't-shirt-outline', screen: 'Pehran' },
  { title: 'Rida', icon: 'shirt', screen: 'Rida' },
  { title: 'Saya', icon: 'shirt', screen: 'Saya' },
  { title: 'Jhabla', icon: 'baby-outline', screen: 'Jhabla' },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tailor Draft Studio</Text>
      <ScrollView contentContainerStyle={styles.list}>
        {garmentFeatures.map(({ title, icon, screen }) => (
          <TouchableOpacity
            key={title}
            style={styles.card}
            onPress={() => navigation.navigate(screen as never)}
            activeOpacity={0.8}
          >
            <Ionicons name={icon as any} size={32} color={COLORS.primary} />
            <Text style={styles.cardText}>{title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('SavedDrafts' as never)} style={styles.footerButton}>
          <Ionicons name="archive-outline" size={24} color={COLORS.secondary} />
          <Text style={styles.footerText}>Saved Drafts</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Clients' as never)} style={styles.footerButton}>
          <Ionicons name="people-outline" size={24} color={COLORS.secondary} />
          <Text style={styles.footerText}>Clients</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings' as never)} style={styles.footerButton}>
          <Ionicons name="settings-outline" size={24} color={COLORS.secondary} />
          <Text style={styles.footerText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 24, textAlign: 'center' },
  list: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', gap: 20 },
  card: {
    width: '40%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardText: { marginTop: 12, fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  footerButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { fontSize: 16, color: COLORS.secondary, fontWeight: '600' },
});
