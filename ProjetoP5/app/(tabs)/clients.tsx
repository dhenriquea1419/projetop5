import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { usePharmacy } from '@/hooks/PharmacyContext';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StandardButton } from '@/components/ui/StandardButton';
import { StandardFooter } from '@/components/ui/StandardFooter';

export default function ClientsScreen() {
  const {
    clients,
    dependents,
    addClient,
    addDependent,
    getClientDependents,
  } = usePharmacy();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [profissao, setProfissao] = useState('');

  const [selectedClientId, setSelectedClientId] = useState('');
  const [depNome, setDepNome] = useState('');
  const [depDataNascimento, setDepDataNascimento] = useState('');
  const [depGrauParentesco, setDepGrauParentesco] = useState('');

  const handleAddClient = () => {
    if (!nome.trim() || !cpf.trim() || !endereco.trim() || !telefone.trim()) {
      alert('Preencha nome, CPF, endereço e telefone do cliente.');
      return;
    }

    addClient({
      nome: nome.trim(),
      cpf: cpf.trim(),
      endereco: endereco.trim(),
      telefone: telefone.trim(),
      profissao: profissao.trim() || undefined,
    });

    setNome('');
    setCpf('');
    setEndereco('');
    setTelefone('');
    setProfissao('');
  };

  const handleAddDependent = () => {
    if (!selectedClientId || !depNome.trim() || !depDataNascimento.trim() || !depGrauParentesco.trim()) {
      alert('Selecione um cliente e preencha os dados do dependente.');
      return;
    }

    addDependent({
      clienteId: selectedClientId,
      nome: depNome.trim(),
      dataNascimento: depDataNascimento.trim(),
      grauParentesco: depGrauParentesco.trim(),
    });

    setDepNome('');
    setDepDataNascimento('');
    setDepGrauParentesco('');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <ScreenHeader
        title="Clientes"
        subtitle="Cadastre clientes e seus dependentes"
        icon="👥"
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Novo cliente</Text>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          placeholder="Ex: João Silva"
        />

        <Text style={styles.label}>CPF</Text>
        <TextInput
          value={cpf}
          onChangeText={setCpf}
          style={styles.input}
          placeholder="Ex: 123.456.789-00"
        />

        <Text style={styles.label}>Endereço</Text>
        <TextInput
          value={endereco}
          onChangeText={setEndereco}
          style={styles.input}
          placeholder="Ex: Rua A, 123"
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          value={telefone}
          onChangeText={setTelefone}
          style={styles.input}
          placeholder="Ex: (11) 99999-9999"
        />

        <Text style={styles.label}>Profissão (opcional)</Text>
        <TextInput
          value={profissao}
          onChangeText={setProfissao}
          style={styles.input}
          placeholder="Ex: Professor"
        />

        <StandardButton
          text="Salvar cliente"
          onPress={handleAddClient}
          variant="primary"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Novo dependente</Text>
        <Text style={styles.label}>Cliente</Text>
        {clients.length === 0 ? (
          <Text style={styles.emptyText}>Adicione clientes primeiro.</Text>
        ) : (
          <View style={styles.clientList}>
            {clients.map((client) => (
              <TouchableOpacity
                key={client.id}
                style={[
                  styles.clientButton,
                  selectedClientId === client.id && styles.clientButtonSelected,
                ]}
                onPress={() => setSelectedClientId(client.id)}
              >
                <Text
                  style={[
                    styles.clientButtonText,
                    selectedClientId === client.id && styles.clientButtonTextSelected,
                  ]}
                >
                  {client.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Nome do dependente</Text>
        <TextInput
          value={depNome}
          onChangeText={setDepNome}
          style={styles.input}
          placeholder="Ex: Maria Silva"
        />

        <Text style={styles.label}>Data de nascimento</Text>
        <TextInput
          value={depDataNascimento}
          onChangeText={setDepDataNascimento}
          style={styles.input}
          placeholder="Ex: 2010-05-15"
        />

        <Text style={styles.label}>Grau de parentesco</Text>
        <TextInput
          value={depGrauParentesco}
          onChangeText={setDepGrauParentesco}
          style={styles.input}
          placeholder="Ex: Filha"
        />

        <StandardButton
          text="Salvar dependente"
          onPress={handleAddDependent}
          variant="primary"
        />
      </View>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: 4,
  },
  description: {
    color: '#4a4a4a',
    marginBottom: 24,
    fontSize: 16,
  },
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
  label: {
    color: '#606060',
    marginBottom: 8,
    marginTop: 10,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d6d6d6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
    color: '#222',
  },
  clientList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  clientButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    backgroundColor: '#fff',
  },
  clientButtonSelected: {
    backgroundColor: '#2c5aa0',
    borderColor: '#2c5aa0',
  },
  clientButtonText: {
    color: '#4a4a4a',
    fontWeight: '600',
  },
  clientButtonTextSelected: {
    color: '#fff',
  },
  button: {
    marginTop: 18,
    backgroundColor: '#2c5aa0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
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
