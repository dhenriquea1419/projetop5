import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useProducts } from '../../hooks/useApi';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

type Product = {
  id: string;
  name: string;
  price?: number;
  stock?: number;
  description?: string;
};

const ProductsScreen: React.FC = () => {
  const productsApi = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await productsApi.getAll();
      setProducts(data || []);
    } catch (err: any) {
      console.log('Usando modo local - API não disponível', err?.message || err);
      setProducts([]);
      setError('Não foi possível carregar os produtos no momento.');
    } finally {
      setIsLoading(false);
    }
  }, [productsApi]);

  // Carregar produtos da API ao iniciar
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAddComponent = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleCreateProduct = useCallback(async () => {
    if (newProductName.trim()) {
      try {
        const newProduct = await productsApi.create({
          name: newProductName.trim(),
          price: 0,
          stock: 0,
          category_id: 'default',
        });

        if (newProduct && newProduct.id) {
          setProducts((prev) => [newProduct, ...prev]);
        } else {
          setProducts((prev) => [
            {
              id: Math.random().toString(36).slice(2, 11),
              name: newProductName.trim(),
            },
            ...prev,
          ]);
        }
      } catch {
        setProducts((prev) => [
          {
            id: Math.random().toString(36).slice(2, 11),
            name: newProductName.trim(),
          },
          ...prev,
        ]);
      } finally {
        setNewProductName('');
        setShowForm(false);
      }
    }
  }, [newProductName, productsApi]);

  const handleCancel = useCallback(() => {
    setNewProductName('');
    setShowForm(false);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <View style={styles.productItem}>
        <View style={styles.productInfo}>
          <Text style={styles.productText}>{item.name}</Text>
          {item.price !== undefined && (
            <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
          )}
          {item.stock !== undefined && (
            <Text style={styles.productStock}>Estoque: {item.stock}</Text>
          )}
        </View>
      </View>
    ),
    []
  );

  const ListHeaderComponent = useCallback(() => (
    <View>
      <ScreenHeader title="Produtos" variant="left-aligned" />
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
      <View style={styles.headerFooter}>
        <Text style={styles.sectionTitle}>Produtos cadastrados</Text>
        {isLoading && <ActivityIndicator size="small" color="#6200EE" />}
        {!isLoading && products.length > 0 && (
          <TouchableOpacity onPress={loadProducts} style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>↻ Recarregar</Text>
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  ), [showForm, newProductName, handleAddComponent, handleCreateProduct, handleCancel, isLoading, products.length, loadProducts, error]);

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
  productInfo: {
    gap: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#6200EE',
    fontWeight: '600',
  },
  productStock: {
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    color: '#b00020',
    marginHorizontal: 16,
    marginBottom: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  headerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  refreshButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  refreshButtonText: {
    fontSize: 12,
    color: '#6200EE',
    fontWeight: '600',
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