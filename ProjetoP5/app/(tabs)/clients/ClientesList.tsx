import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { usePharmacy } from '@/hooks/PharmacyContext';

export default function ClientesList() {
  const { clients, getClientDependents } = usePharmacy();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Clientes cadastrados</Text>
      {clients.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum cliente cadastrado.</Text>
      ) : (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const deps = getClientDependents(item.id);
            return (
              <View style={styles.clientCard}>
                <Text style={styles.clientName}>{item.nome}</Text>
                <Text style={styles.clientInfo}>CPF: {item.cpf}</Text>
                <Text style={styles.clientInfo}>Telefone: {item.telefone}</Text>
                <Text style={styles.clientInfo}>Endereço: {item.endereco}</Text>
                {item.profissao && <Text style={styles.clientInfo}>Profissão: {item.profissao}</Text>}
                {deps.length > 0 && (
                  <View style={styles.dependentsList}>
                    <Text style={styles.sectionSubtitle}>Dependentes</Text>
                    {deps.map((dep) => (
                      <Text key={dep.id} style={styles.dependentItem}>
                        • {dep.nome} - {dep.grauParentesco} (nasc. {dep.dataNascimento})
                      </Text>
                    ))}
                  </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f3a72',
    marginBottom: 14,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
  },
  clientCard: {
    padding: 14,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  clientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f3a72',
  },
  clientInfo: {
    color: '#334155',
    marginTop: 4,
  },
  dependentsList: {
    marginTop: 10,
    gap: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f3a72',
    marginBottom: 8,
  },
  dependentItem: {
    color: '#3c3c3c',
    marginBottom: 4,
  },
  list: {
    paddingBottom: 12,
  },
});
