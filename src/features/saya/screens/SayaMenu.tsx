// src/features/saya/screens/SayaMenu.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../common/styles/colors';

interface MenuItem {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>['name']; // ✅ FIX 1: Proper icon type
  screen: string;
  color: string;
  params?: any;
}

export default function SayaMenu() {
  const navigation = useNavigation<any>(); // ✅ FIX 2: Any navigation type

  const menuItems: MenuItem[] = [ // ✅ FIX 3: Type the array
    {
      title: 'New Saya Draft',
      subtitle: 'Traditional Saya Dress',
      icon: 'shirt-outline' as const, // ✅ FIX 4: Literal type
      screen: 'SayaDraftInput',
      color: COLORS.primary,
    },
    {
      title: 'Saved Saya Drafts',
      subtitle: 'View & manage patterns',
      icon: 'archive-outline' as const, // ✅ FIX 5: Literal type
      screen: 'SavedDrafts',
      color: COLORS.secondary,
      params: { filter: 'saya' },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="shirt" size={56} color={COLORS.primary} />
        <Text style={styles.title}>Saya Studio</Text>
        <Text style={styles.subtitle}>Traditional Dress Patterns</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuCard, { borderLeftColor: item.color }]}
            onPress={() => navigation.navigate(item.screen as any, item.params)} // ✅ FIX 6: Proper any type
            activeOpacity={0.9}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// styles unchanged...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.surface,
    padding: 32,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, marginTop: 16 },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, marginTop: 4 },
  menuContainer: { flex: 1, padding: 24 },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: { flex: 1 },
  menuTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  menuSubtitle: { fontSize: 14, color: COLORS.textSecondary },
});
