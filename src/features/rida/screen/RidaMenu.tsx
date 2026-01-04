// src/features/rida/screens/RidaMenu.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../common/styles/colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface MenuItem {
  title: string;
  subtitle: string;
  icon: IconName;  // ✅ Now properly typed
  screen: string;
  color: string;
}

export default function RidaMenu() {
  const navigation = useNavigation<any>();

  const menuItems: MenuItem[] = [
    {
      title: 'New Rida Draft',
      subtitle: 'Traditional Dawoodi Bohra Dress',
      icon: 'shirt-outline' as IconName,  // ✅ Explicit cast
      screen: 'RidaDraftInput',
      color: COLORS.primary,
    },
    {
      title: 'Saved Rida Drafts',
      subtitle: 'View & manage patterns',
      icon: 'archive-outline' as IconName,  // ✅ Explicit cast
      screen: 'SavedDrafts',
      color: COLORS.secondary,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="shirt" size={56} color={COLORS.primary} />
        <Text style={styles.title}>Rida Studio</Text>
        <Text style={styles.subtitle}>Dawoodi Bohra Traditional Wear</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuCard, { borderLeftColor: item.color }]}
            onPress={() => navigation.navigate(item.screen as any)}  // ✅ Fixed navigation too
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

// styles remain the same...
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
