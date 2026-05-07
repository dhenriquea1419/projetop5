import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

type Product = {
  id: string;
  name: string;
};

const ScreenHeader: React.FC<{ title: string }> = ({ title }) => (
  <View style={styles.screenHeader}>
    <Text style={styles.screenHeaderTitle}>{title}</Text>
  </View>
);

const ProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newProductName, setNewProductName] = useState('');

  const handleAddComponent = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleCreateProduct = useCallback(() => {
    if (newProductName.trim()) {
      setProducts((prev) => [
        {
          id: Math.random().toString(36).substr(2, 9),
          name: newProductName.trim(),
        },
        ...prev,
      ]);
      setNewProductName('');
      setShowForm(false);
    }
  }, [newProductName]);

  const handleCancel = useCallback(() => {
    setNewProductName('');
    setShowForm(false);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <View style={styles.productItem}>
        <Text style={styles.productText}>{item.name}</Text>
      </View>
    ),
    []
  );

  const ListHeaderComponent = useCallback(() => (
    <View>
      <ScreenHeader title="Produtos" />
      <TouchableOpacity
        style={styles.addProductButton}
        onPress={handleAddComponent}
        activeOpacity={0.7}
      >
        <Text style={styles.addProductButtonText}>+ Novo produto</Text>
      </TouchableOpacity>
      {showForm && (
        <View style={styles.newProductForm}>
          <TextInput
            style={styles.productInput}
            placeholder="Nome do produto"
            value={newProductName}
            onChangeText={setNewProductName}
            returnKeyType="done"
            onSubmitEditing={handleCreateProduct}
            autoFocus
          />
          <View style={styles.formButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateProduct}
              disabled={!newProductName.trim()}
              activeOpacity={0.7}
            >
              <Text style={styles.createButtonText}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Text style={styles.sectionTitle}>Produtos cadastrados</Text>
    </View>
  ), [showForm, newProductName, handleAddComponent, handleCreateProduct, handleCancel]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum produto cadastrado ainda.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenHeader: {
    backgroundColor: '#6200EE',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  screenHeaderTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  addProductButton: {
    backgroundColor: '#03DAC6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addProductButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newProductForm: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  cancelButtonText: {
    color: '#6C757D',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#03DAC6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 8,
  },
  createButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  productItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  productText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});

export default ProductsScreen;  