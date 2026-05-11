import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/AuthContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

function DrawerContent({ navigation }: { navigation: DrawerNavigationProp<any> }) {
  const { signOut, user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const menuItems = [
    { name: 'index', label: 'Home', icon: 'house.fill' },
    { name: 'categories', label: 'Categorias', icon: 'square.grid.2x2.fill' },
    { name: 'products', label: 'Produtos', icon: 'cart.fill' },
    { name: 'clients', label: 'Clientes', icon: 'person.2.fill' },
    { name: 'employees', label: 'Funcionários', icon: 'person.3.fill' },
    { name: 'purchases', label: 'Compras', icon: 'bag.fill' },
    { name: 'progress-cards', label: 'Cartões', icon: 'star.fill' },
    { name: 'profile', label: 'Perfil', icon: 'person.fill' },
  ];

  const handleLogout = () => {
    signOut();
    navigation.closeDrawer();
  };

  return (
    <View style={[styles.drawerContainer, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.drawerScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Menu</Text>
          <Text style={[styles.headerSubtitle, { color: colors.icon }]}>
            {user?.name || 'Usuário'}
          </Text>
        </View>

        <View style={styles.menuList}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate(item.name);
                navigation.closeDrawer();
              }}
            >
              <View style={styles.menuItemIcon}>
                <IconSymbol size={24} name={item.icon as any} color={colors.tint} />
              </View>
              <Text style={[styles.menuItemLabel, { color: colors.text }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.icon }]}>
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.tint }]} onPress={handleLogout}>
          <IconSymbol size={20} name="arrow.right.square.fill" color="#fff" />
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Drawer
      drawerContent={DrawerContent}
      screenOptions={{
        headerShown: true,
        headerTintColor: colors.tint,
        headerTitleStyle: {
          color: colors.text,
        },
        sceneContainerStyle: {
          backgroundColor: colors.background,
        },
        drawerInactiveTintColor: colors.icon,
        drawerActiveTintColor: colors.tint,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Farmácia Control',
        }}
      />
      <Drawer.Screen
        name="categories"
        options={{
          title: 'Categorias',
          headerTitle: 'Categorias de Produtos',
        }}
      />
      <Drawer.Screen
        name="products"
        options={{
          title: 'Produtos',
          headerTitle: 'Gestão de Produtos',
        }}
      />
      <Drawer.Screen
        name="clients"
        options={{
          title: 'Clientes',
          headerTitle: 'Cadastro de Clientes',
        }}
      />
      <Drawer.Screen
        name="employees"
        options={{
          title: 'Funcionários',
          headerTitle: 'Gestão de Funcionários',
        }}
      />
      <Drawer.Screen
        name="purchases"
        options={{
          title: 'Compras',
          headerTitle: 'Histórico de Compras',
        }}
      />
      <Drawer.Screen
        name="progress-cards"
        options={{
          title: 'Cartões',
          headerTitle: 'Cartões de Progresso',
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: 'Perfil',
          headerTitle: 'Meu Perfil',
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerScroll: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  menuList: {
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  menuItemIcon: {
    marginRight: 16,
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
