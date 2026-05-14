import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const menuItems = [
  { title: 'Home', path: '/(tabs)/' },
  { title: 'Categorias', path: '/(tabs)/categories' },
  { title: 'Produtos', path: '/(tabs)/products' },
  { title: 'Clientes', path: '/(tabs)/clients' },
  { title: 'Funcionários', path: '/(tabs)/employees' },
  { title: 'Compras', path: '/(tabs)/purchases' },
  { title: 'Cartões', path: '/(tabs)/progress-cards' },
  { title: 'Perfil', path: '/(tabs)/profile' },
];

export default function TabLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleMenuItemPress = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={[styles.header, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}> 
        <Pressable style={styles.menuButton} onPress={() => setIsMenuOpen(true)}>
          <Text style={styles.menuIcon}>☰</Text>
          <Text style={styles.menuLabel}>Menu</Text>
        </Pressable>
      </SafeAreaView>

      <View style={styles.tabsContainer}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
          }}>
          <Tabs.Screen name="index" />
          <Tabs.Screen name="categories" />
          <Tabs.Screen name="products" />
          <Tabs.Screen name="clients" />
          <Tabs.Screen name="employees" />
          <Tabs.Screen name="purchases" />
          <Tabs.Screen name="progress-cards" />
          <Tabs.Screen name="profile" />
        </Tabs>
      </View>

      {isMenuOpen ? (
        <Pressable style={styles.overlay} onPress={() => setIsMenuOpen(false)}>
          <Pressable style={styles.drawer} onPress={() => null}>
            <Text style={styles.drawerTitle}>Menu de navegação</Text>
            {menuItems.map((item) => (
              <Pressable
                key={item.path}
                style={styles.drawerItem}
                onPress={() => handleMenuItemPress(item.path)}>
                <Text style={styles.drawerItemText}>{item.title}</Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 28,
    color: '#ffffff',
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  tabsContainer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  drawer: {
    width: '72%',
    maxWidth: 300,
    minHeight: '100%',
    backgroundColor: '#ffffff',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 18,
    color: '#14838d',
  },
  drawerItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333333',
  },
});
