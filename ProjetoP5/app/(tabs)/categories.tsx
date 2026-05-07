import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useProducts } from '@/hooks/ProductContext';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StandardButton } from '@/components/ui/StandardButton';
import { StandardFooter } from '@/components/ui/StandardFooter';

interface Category {
  codigo: string;
  descricao: string;
}

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

  const renderCategory = ({ item }: { item: Category }) => (
    <View style={styles.categoryItem}>
      <Text style={styles.codigoText}>{item.codigo}</Text>
      <Text style={styles.descricaoText}>{item.descricao}</Text>
    </View>
  );

  const ListHeaderComponent = () => (
    <View style={styles.headerContainer}>
      <ScreenHeader title="Categorias" />
      <View style={styles.formContainer}>
        <Text style={styles.label}>Código:</Text>
        <TextInput
          style={styles.input}
          value={codigo}
          onChangeText={setCodigo}
          placeholder="Digite o código"
          autoCapitalize="characters"
        />
        <Text style={styles.label}>Descrição:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Digite a descrição"
          multiline
          numberOfLines={3}
        />
        <View style={styles.buttonContainer}>
          <StandardButton
            text="Adicionar Categoria"
            onPress={handleAddCategory}
          />
        </View>
      </View>
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Nenhuma categoria cadastrada.</Text>
    </View>
  );

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.codigo}
      renderItem={renderCategory}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={StandardFooter}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  codigoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    width: 80,
  },
  descricaoText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 16,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});