import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, Modal, Pressable } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { Feather } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth(); // Pega a função de logout do contexto

  const menuItems = [
    { name: 'Dashboard', icon: 'grid', route: '/' },
    { name: 'Produtos', icon: 'box', route: '/produtos' },
    { name: 'Categorias', icon: 'tag', route: '/categorias' },
    { name: 'Clientes', icon: 'users', route: '/clientes' },
    { name: 'Dependentes', icon: 'user-plus', route: '/dependentes' },
    { name: 'Funcionários', icon: 'briefcase', route: '/funcionarios' },
    { name: 'Nova Venda', icon: 'shopping-cart', route: '/nova-venda' },
    { name: 'Histórico Vendas', icon: 'clock', route: '/historico-vendas' },
    { name: 'Comissões', icon: 'dollar-sign', route: '/comissoes' },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/auth');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#173534', paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ paddingTop: 0 }}>
        <View style={styles.drawerHeader}>
          <View style={styles.logoRow}>
             <View style={styles.logoCircle}>
               <Feather name="activity" size={24} color="#FBBF24" />
             </View>
             <TouchableOpacity onPress={() => props.navigation.closeDrawer()} style={styles.closeButton}>
               <Feather name="x" size={20} color="#FFF" />
             </TouchableOpacity>
          </View>
          <Text style={styles.brandName}>SapéPharma</Text>
          <Text style={styles.brandSubtitle}>Sistema de Vendas</Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => {
            const isActive = pathname === item.route || (pathname === '/home' && item.route === '/');
            return (
              <TouchableOpacity 
                key={index}
                style={[styles.menuItem, isActive && styles.menuItemActive]}
                onPress={() => router.push(item.route as any)}
              >
                <Feather name={item.icon as any} size={20} color={isActive ? '#173534' : '#FFF'} style={styles.menuIcon} />
                <Text style={[styles.menuText, isActive && styles.menuTextActive]}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={[styles.logoutButton, { paddingBottom: Math.max(insets.bottom, 24) }]} 
        onPress={handleLogout}
      >
        <Feather name="log-out" size={20} color="#EF4444" style={styles.menuIcon} />
        <Text style={[styles.menuText, { color: '#EF4444' }]}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function DrawerLayout() {
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Extrai os dados do usuário do Supabase
  const email = user?.email || 'usuario@email.com';
  const name = user?.user_metadata?.name || 'Usuário';
  const cpf = user?.user_metadata?.cpf || '000.000.000-00';
  const firstLetter = name.charAt(0).toUpperCase();

  const handleLogout = async () => {
    setProfileModalVisible(false);
    try {
      await signOut();
      router.replace('/auth');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          header: ({ navigation }) => (
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.hamburgerBtn}>
                <Feather name="menu" size={24} color="#FFF" />
              </TouchableOpacity>
              
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.iconBtn}>
                  <Feather name="bell" size={20} color="#6B7280" />
                  <View style={styles.notificationDot} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.profileBtn}
                  onPress={() => setProfileModalVisible(true)}
                >
                  <Feather name="user" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
          ),
          drawerStyle: { width: 280 },
        }}
      >
        <Drawer.Screen name="index" options={{ title: 'Dashboard' }} />
      </Drawer>

      {/* Modal de Perfil */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setProfileModalVisible(false)}
        >
          <Pressable style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>{firstLetter}</Text>
            </View>
            
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
            
            <View style={styles.profileInfoBox}>
              <Text style={styles.profileInfoLabel}>CPF</Text>
              <Text style={styles.profileInfoValue}>{cpf}</Text>
            </View>

            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.modalLogoutButton} onPress={handleLogout}>
              <Feather name="log-out" size={18} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.modalLogoutText}>Sair da Conta</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  drawerHeader: { padding: 24, paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#1E403F' },
  logoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  logoCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E403F', justifyContent: 'center', alignItems: 'center' },
  closeButton: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#1E403F', justifyContent: 'center', alignItems: 'center' },
  brandName: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  brandSubtitle: { fontSize: 14, color: '#9CA3AF', marginTop: 4 },
  menuContainer: { padding: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginBottom: 4 },
  menuItemActive: { backgroundColor: '#37d3c5', shadowColor: '#37d3c5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  menuIcon: { marginRight: 12 },
  menuText: { fontSize: 16, color: '#FFF', fontWeight: '500' },
  menuTextActive: { color: '#173534', fontWeight: 'bold' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', padding: 24, borderTopWidth: 1, borderTopColor: '#1E403F' },
  header: { height: 80, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingTop: Platform.OS === 'ios' ? 40 : 10 },
  hamburgerBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#20B2AA', justifyContent: 'center', alignItems: 'center', shadowColor: '#20B2AA', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  notificationDot: { position: 'absolute', top: 10, right: 10, width: 10, height: 10, borderRadius: 5, backgroundColor: '#20B2AA', borderWidth: 2, borderColor: '#FFF' },
  profileBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center' },
  
  // Estilos do Modal de Perfil
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    width: '85%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#20B2AA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: -40, // Faz o avatar "flutuar" para fora do card
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  profileAvatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  profileInfoBox: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileInfoLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '600',
  },
  profileInfoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: 'bold',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 20,
  },
  modalLogoutButton: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLogoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});