import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { usePharmacy } from '@/hooks/PharmacyContext';
import { useProducts } from '@/hooks/ProductContext';

export default function FuncionariosList() {
  const { representatives, sellers, progressCards } = usePharmacy();
  const { categories } = useProducts();

  const data = [...representatives, ...sellers];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Funcionários cadastrados</Text>
      {data.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum funcionário cadastrado.</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isRep = item.tipo === 'representante';
            const card = isRep ? null : progressCards.find((c) => c.id === (item as any).cartaoProgressaoId);
            return (
              <View style={styles.employeeCard}>
                <Text style={styles.employeeName}>{item.nome}</Text>
                <Text style={styles.employeeInfo}>Matrícula: {item.matricula}</Text>
                <Text style={styles.employeeInfo}>CPF: {item.cpf}</Text>
                <Text style={styles.employeeInfo}>Salário: R$ {typeof item.salario === 'number' ? item.salario.toFixed(2) : item.salario}</Text>
                <Text style={styles.employeeInfo}>Tipo: {isRep ? 'Representante' : 'Vendedor'}</Text>
                {isRep ? (
                  <>
                    <Text style={styles.employeeInfo}>Contrato: {(item as any).dataInicioContrato} a {(item as any).dataFimContrato}</Text>
                    <Text style={styles.employeeInfo}>Categorias: {(item as any).categoriasResponsaveis.map((id: string) => categories.find(c => c.id === id)?.codigo).join(', ')}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.employeeInfo}>Comissão: {(item as any).percentualComissao}%</Text>
                    {card && (
                      <Text style={styles.employeeInfo}>Cartão: {card.codigo} - {card.categoria} (última: {card.dataUltimaProgressao})</Text>
                    )}
                  </>
                )}
              </View>
            );
          }}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 0,
    marginBottom: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1f3a72', marginBottom: 14 },
  emptyText: { color: '#6b7280', fontSize: 14 },
  employeeCard: { padding: 14, backgroundColor: '#f8fafc', borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#dbeafe' },
  employeeName: { fontSize: 16, fontWeight: '700', color: '#1f3a72' },
  employeeInfo: { color: '#334155', marginTop: 4 },
  list: { paddingBottom: 12 },
});
