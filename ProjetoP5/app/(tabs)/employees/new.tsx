import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import CadastroFuncionario from './CadastroFuncionario';
import { useRouter } from 'expo-router';
import { StandardButton } from '@/components/ui/StandardButton';

export default function NewEmployeePage() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScreenHeader title="Cadastrar funcionário" subtitle="Preencha os dados do funcionário" icon="👔" />
      <CadastroFuncionario />
      <StandardButton text="Voltar" onPress={() => router.back()} variant="secondary" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#fff' } });
