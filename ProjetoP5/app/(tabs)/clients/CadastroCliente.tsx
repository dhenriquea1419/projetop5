import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { usePharmacy } from '@/hooks/PharmacyContext';
import { StandardButton } from '@/components/ui/StandardButton';

export default function CadastroCliente() {
  const {
    clients,
    addClient,
    addDependent,
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
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Novo cliente</Text>
      <Text style={styles.label}>Nome</Text>
      <TextInput value={nome} onChangeText={setNome} style={styles.input} placeholder="Ex: João Silva" />

      <Text style={styles.label}>CPF</Text>
      <TextInput value={cpf} onChangeText={setCpf} style={styles.input} placeholder="Ex: 123.456.789-00" />

      <Text style={styles.label}>Endereço</Text>
      <TextInput value={endereco} onChangeText={setEndereco} style={styles.input} placeholder="Ex: Rua A, 123" />

      <Text style={styles.label}>Telefone</Text>
      <TextInput value={telefone} onChangeText={setTelefone} style={styles.input} placeholder="Ex: (11) 99999-9999" />

      <Text style={styles.label}>Profissão (opcional)</Text>
      <TextInput value={profissao} onChangeText={setProfissao} style={styles.input} placeholder="Ex: Professor" />

      <StandardButton text="Salvar cliente" onPress={handleAddClient} variant="primary" />

      <View style={{ marginTop: 18 }} />

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
              <Text style={[styles.clientButtonText, selectedClientId === client.id && styles.clientButtonTextSelected]}>
                {client.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>Nome do dependente</Text>
      <TextInput value={depNome} onChangeText={setDepNome} style={styles.input} placeholder="Ex: Maria Silva" />

      <Text style={styles.label}>Data de nascimento</Text>
      <TextInput value={depDataNascimento} onChangeText={setDepDataNascimento} style={styles.input} placeholder="Ex: 2010-05-15" />

      <Text style={styles.label}>Grau de parentesco</Text>
      <TextInput value={depGrauParentesco} onChangeText={setDepGrauParentesco} style={styles.input} placeholder="Ex: Filha" />

      <StandardButton text="Salvar dependente" onPress={handleAddDependent} variant="primary" />
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
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
  },
});
