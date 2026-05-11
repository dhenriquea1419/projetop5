import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useProducts } from '@/hooks/ProductContext';

export default function ProductsScreen() {
  const {
    categories,
    products,
    addProduct,
    findCategoryById,
    getProductComponents,
    getProductLabel,
  } = useProducts();

  const [codigo, setCodigo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [unidade, setUnidade] = useState('un');
  const [valorUnitario, setValorUnitario] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [selectedComponentId, setSelectedComponentId] = useState('');
  const [componentQuantity, setComponentQuantity] = useState('1');
  const [componentes, setComponentes] = useState<Array<{ produtoId: string; quantidade: number }>>([]);

  const handleAddComponent = () => {
    if (!selectedComponentId) {
      alert('Selecione um produto componente.');
      return;
    }

    const quantity = Number(componentQuantity);
    if (Number.isNaN(quantity) || quantity <= 0) {
      alert('Informe uma quantidade válida.');
      return;
    }

    setComponentes((current) => {
      const existing = current.find((item) => item.produtoId === selectedComponentId);
      if (existing) {
        return current.map((item) =>
          item.produtoId === selectedComponentId
            ? { ...item, quantidade: item.quantidade + quantity }
            : item
        );
      }
      return [...current, { produtoId: selectedComponentId, quantidade: quantity }];
    });
    setSelectedComponentId('');
    setComponentQuantity('1');
  };

  const handleCreateProduct = () => {
    if (!codigo.trim() || !descricao.trim() || !unidade.trim() || !valorUnitario.trim() || !categoriaId) {
      alert('Preencha todos os campos do produto e selecione uma categoria.');
      return;
    }

    const valor = Number(valorUnitario.replace(',', '.'));
    if (Number.isNaN(valor) || valor <= 0) {
      alert('Informe um valor unitário válido.');
      return;
    }

    addProduct({
      codigo: codigo.trim(),
      descricao: descricao.trim(),
      unidade: unidade.trim(),
      valorUnitario: valor,
      categoriaId,
      componentes,
    });

    setCodigo('');
    setDescricao('');
    setUnidade('un');
    setValorUnitario('');
    setCategoriaId('');
    setComponentes([]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Produtos</Text>
        <Text style={styles.description}>
          Cadastre produtos, associe-os a categorias e adicione componentes quando um produto for composto por outros.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Novo produto</Text>
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Código</Text>
              <TextInput
                value={codigo}
                onChangeText={setCodigo}
                style={styles.input}
                placeholder="Ex: PARA"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Unidade</Text>
              <TextInput
                value={unidade}
                onChangeText={setUnidade}
                style={styles.input}
                placeholder="Ex: un, mg"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              value={descricao}
              onChangeText={setDescricao}
              style={styles.input}
              placeholder="Ex: Paracetamol 500mg"
            />
          </View>
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Valor unitário</Text>
              <TextInput
                value={valorUnitario}
                onChangeText={setValorUnitario}
                style={styles.input}
                placeholder="Ex: 3.50"
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Categoria</Text>
              {categories.length === 0 ? (
                <Text style={styles.emptyText}>Adicione categorias primeiro.</Text>
              ) : (
                <View style={styles.categoryList}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        categoriaId === category.id && styles.categoryButtonSelected,
                      ]}
                      onPress={() => setCategoriaId(category.id)}
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          categoriaId === category.id && styles.categoryButtonTextSelected,
                        ]}
                      >
                        {category.codigo}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {products.length > 0 ? (
            <View style={styles.compositionBox}>
              <Text style={styles.sectionSubtitle}>Componentes do produto</Text>
              <View style={styles.row}>
                <View style={styles.fieldSmall}>
                  <Text style={styles.label}>Produto</Text>
                  <View style={styles.categoryList}>
                    {products.map((product) => (
                      <TouchableOpacity
                        key={product.id}
                        style={[
                          styles.componentButton,
                          selectedComponentId === product.id && styles.componentButtonSelected,
                        ]}
                        onPress={() => setSelectedComponentId(product.id)}
                      >
                        <Text
                          style={[
                            styles.componentButtonText,
                            selectedComponentId === product.id && styles.componentButtonTextSelected,
                          ]}
                        >
                          {product.codigo}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={styles.fieldSmall}>
                  <Text style={styles.label}>Quantidade</Text>
                  <TextInput
                    value={componentQuantity}
                    onChangeText={setComponentQuantity}
                    style={styles.input}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
              <TouchableOpacity style={styles.addComponentButton} onPress={handleAddComponent}>
                <Text style={styles.addComponentText}>Adicionar componente</Text>
              </TouchableOpacity>
              {componentes.length > 0 && (
                <View style={styles.componentList}>
                  {componentes.map((item) => (
                    <Text key={item.produtoId} style={styles.componentItem}>
                      {getProductLabel(item.produtoId)} — {item.quantidade}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.emptyText}>Ainda não há produtos para usar como componentes.</Text>
          )}

          <TouchableOpacity style={styles.primaryButton} onPress={handleCreateProduct}>
            <Text style={styles.primaryButtonText}>Salvar produto</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Produtos cadastrados</Text>
          {products.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum produto cadastrado ainda.</Text>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.productsList}
              renderItem={({ item }) => {
                const category = findCategoryById(item.categoriaId);
                const productComponents = getProductComponents(item);

                return (
                  <View style={styles.productCard}>
                    <View style={styles.productHeader}>
                      <View>
                        <Text style={styles.productTitle}>{item.descricao}</Text>
                        <Text style={styles.productSubtitle}>{item.codigo} • {item.unidade}</Text>
                      </View>
                      <Text style={styles.productPrice}>R$ {item.valorUnitario.toFixed(2)}</Text>
                    </View>
                    <Text style={styles.productCategory}>Categoria: {category?.descricao || 'Não definida'}</Text>
                    {productComponents.length > 0 ? (
                      <View style={styles.componentList}>
                        <Text style={styles.sectionSubtitle}>Composição</Text>
                        {productComponents.map((component) => (
                          <Text key={component.produto.id} style={styles.componentItem}>
                            • {component.produto.descricao} — {component.quantidade} {component.produto.unidade}
                          </Text>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.emptyText}>Produto sem composição.</Text>
                    )}
                  </View>
                );
              }}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  field: {
    flex: 1,
    minWidth: 140,
    marginBottom: 12,
  },
  fieldSmall: {
    flex: 1,
    minWidth: 120,
    marginBottom: 12,
  },
  label: {
    color: '#606060',
    marginBottom: 6,
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
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    backgroundColor: '#fff',
  },
  categoryButtonSelected: {
    backgroundColor: '#2c5aa0',
    borderColor: '#2c5aa0',
  },
  categoryButtonText: {
    color: '#4a4a4a',
    fontWeight: '600',
  },
  categoryButtonTextSelected: {
    color: '#fff',
  },
  compositionBox: {
    marginTop: 12,
    marginBottom: 12,
    padding: 14,
    backgroundColor: '#f8faff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f3a72',
    marginBottom: 8,
  },
  componentButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  componentButtonSelected: {
    backgroundColor: '#2c5aa0',
    borderColor: '#2c5aa0',
  },
  componentButtonText: {
    color: '#4a4a4a',
    fontWeight: '600',
  },
  componentButtonTextSelected: {
    color: '#fff',
  },
  addComponentButton: {
    marginTop: 10,
    backgroundColor: '#2c5aa0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addComponentText: {
    color: '#fff',
    fontWeight: '700',
  },
  componentList: {
    marginTop: 10,
    gap: 6,
  },
  componentItem: {
    color: '#3c3c3c',
    marginBottom: 4,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: '#2c5aa0',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  productsList: {
    paddingBottom: 12,
  },
  productCard: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e3e8ef',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f3a72',
  },
  productSubtitle: {
    fontSize: 13,
    color: '#5a5a5a',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c5aa0',
  },
  productCategory: {
    color: '#4f4f4f',
    marginTop: 6,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
  },
});
