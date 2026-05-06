import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    const doSignOut = () => {
      signOut();
      router.replace('/login');
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Tem certeza que deseja sair da aplicação?');
      if (confirmed) {
        doSignOut();
      }
      return;
    }

    Alert.alert('Sair', 'Tem certeza que deseja sair da aplicação?', [
      {
        text: 'Cancelar',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Sair',
        onPress: doSignOut,
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Cargo</Text>
          <Text style={styles.infoValue}>
            {user?.role === 'vendedor' && 'Vendedor'}
            {user?.role === 'representante' && 'Representante'}
            {user?.role === 'admin' && 'Administrador'}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>ID de Usuário</Text>
          <Text style={styles.infoValue}>{user?.id || '-'}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Permissões</Text>
        <View style={styles.permissionItem}>
          <View style={styles.permissionCheck} />
          <Text style={styles.permissionText}>Visualizar Produtos</Text>
        </View>
        <View style={styles.permissionItem}>
          <View style={styles.permissionCheck} />
          <Text style={styles.permissionText}>Registrar Compras</Text>
        </View>
        {user?.role === 'admin' && (
          <>
            <View style={styles.permissionItem}>
              <View style={styles.permissionCheck} />
              <Text style={styles.permissionText}>Gerenciar Usuários</Text>
            </View>
            <View style={styles.permissionItem}>
              <View style={styles.permissionCheck} />
              <Text style={styles.permissionText}>Relatórios Completos</Text>
            </View>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair da Conta</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Farmácia Control v1.0.0</Text>
        <Text style={styles.footerText}>© 2024 - Todos os direitos reservados</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#14838d',
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#cde8e9',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#14838d',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#d7f1f2',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#14838d',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  permissionCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#14838d',
    marginRight: 12,
  },
  permissionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#14838d',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});
