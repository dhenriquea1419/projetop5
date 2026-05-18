import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import CadastroCliente from '@/app/(tabs)/clients/CadastroCliente';
import { useRouter } from 'expo-router';
import { StandardButton } from '@/components/ui/StandardButton';

export default function ModalNewClient() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScreenHeader title="Cadastrar cliente" subtitle="(Modal) Preencha os dados" icon="👥" />
      <CadastroCliente />
      <StandardButton text="Fechar" onPress={() => router.back()} variant="secondary" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#fff' } });
