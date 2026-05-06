import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useProducts } from '@/hooks/ProductContext';

export default function CategoriesScreen() {
  const { categories, addCategory } = useProducts();
  const [codigo, setCodigo] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleAddCategory = () => {
    if (!codigo.trim() || !descricao.trim()) {
      alert('Preencha código e descrição da categoria.');
      return;
    }

    addCategory({
      codigo: codigo.trim().toUpperCase(),
      descricao: descricao.trim(),
    });

    setCodigo('');
    setDescricao('');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Categorias</Text>
      <Text style={styles.description}>Registre as categorias da farmácia e associe produtos a elas.</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nova categoria</Text>
        <Text style={styles.label}>Código</Text>
        <TextInput
          value={codigo}
          onChangeText={setCodigo}
          style={styles.input}
          placeholder="Ex: MED"
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          value={descricao}
          onChangeText={setDescricao}
          style={styles.input}
          placeholder="Ex: Medicamentos"
        />

        <TouchableOpacity style={styles.button} onPress={handleAddCategory}>
          <Text style={styles.buttonText}>Salvar categoria</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorias cadastradas</Text>
        {categories.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma categoria cadastrada.</Text>
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.categoryCard}>
                <Text style={styles.categoryCode}>{item.codigo}</Text>
                <Text style={styles.categoryDescription}>{item.descricao}</Text>
              </View>
            )}
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
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
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
    marginBottom: 20,
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
  categoryCard: {
    padding: 14,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  categoryCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  categoryDescription: {
    marginTop: 4,
    color: '#334155',
  },
  list: {
    paddingBottom: 12,
  },
});
