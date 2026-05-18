import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import FuncionariosList from './FuncionariosList';
import { StandardButton } from '@/components/ui/StandardButton';
import { useRouter } from 'expo-router';

export default function EmployeesListPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScreenHeader title="Funcionários" subtitle="Lista de funcionários cadastrados" icon="👔" />
      <StandardButton text="Cadastrar funcionário" onPress={() => router.push('/employees/new')} variant="primary" />
      <FuncionariosList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingBottom: 20 },
});
