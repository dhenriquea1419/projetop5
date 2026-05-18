import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import ClientesList from './ClientesList';
import { StandardButton } from '@/components/ui/StandardButton';
import { useRouter } from 'expo-router';

export default function ClientsListPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScreenHeader title="Clientes" subtitle="Lista de clientes cadastrados" icon="👥" />
      <StandardButton text="Cadastrar cliente" onPress={() => router.push('/clients/new')} variant="primary" />
      <ClientesList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingBottom: 20 },
});
