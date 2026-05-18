import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import CadastroFuncionario from '@/app/(tabs)/employees/CadastroFuncionario';
import { useRouter } from 'expo-router';
import { StandardButton } from '@/components/ui/StandardButton';

export default function ModalNewEmployee() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScreenHeader title="Cadastrar funcionário" subtitle="(Modal) Preencha os dados" icon="👔" />
      <CadastroFuncionario />
      <StandardButton text="Fechar" onPress={() => router.back()} variant="secondary" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#fff' } });
