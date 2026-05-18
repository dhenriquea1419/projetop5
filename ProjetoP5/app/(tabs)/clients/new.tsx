import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import CadastroCliente from './CadastroCliente';
import { useRouter } from 'expo-router';
import { StandardButton } from '@/components/ui/StandardButton';

export default function NewClientPage() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScreenHeader title="Cadastrar cliente" subtitle="Preencha os dados do cliente" icon="👥" />
      <CadastroCliente />
      <StandardButton text="Voltar" onPress={() => router.back()} variant="secondary" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#fff' } });
