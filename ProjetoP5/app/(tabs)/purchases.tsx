import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { usePharmacy } from '@/hooks/PharmacyContext';
import { useProducts } from '@/hooks/ProductContext';

export default function PurchasesScreen() {
  const {
    clients,
    sellers,
    purchases,
    addPurchase,
    findClientById,
    findEmployeeById,
    getProductLabel,
  } = usePharmacy();
  const { products } = useProducts();

  const [numeroCompra, setNumeroCompra] = useState('');
  const [dataCompra, setDataCompra] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [vendedorId, setVendedorId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productQuantity, setProductQuantity] = useState('1');
  const [itens, setItens] = useState<Array<{ produtoId: string; quantidade: number }>>([]);

  const availableSellers = useMemo(
    () => sellers.filter((seller) => seller.id !== vendedorId),
    [sellers, vendedorId]
  );

  const handleAddItem = () => {
    if (!selectedProductId) {
      alert('Selecione um produto.');
      return;
    }

    const quantity = Number(productQuantity);
    if (Number.isNaN(quantity) || quantity <= 0) {
      alert('Informe uma quantidade válida.');
      return;
    }

    setItens((current) => {
      const existing = current.find((item) => item.produtoId === selectedProductId);
      if (existing) {
        return current.map((item) =>
          item.produtoId === selectedProductId
            ? { ...item, quantidade: item.quantidade + quantity }
            : item
        );
      }
      return [...current, { produtoId: selectedProductId, quantidade: quantity }];
    });
    setSelectedProductId('');
    setProductQuantity('1');
  };

  const handleCreatePurchase = () => {
    if (!numeroCompra.trim() || !dataCompra.trim() || !clienteId || !vendedorId || itens.length === 0) {
      alert('Preencha número, data, selecione cliente, vendedor e adicione pelo menos um item.');
      return;
    }

    addPurchase({
      numeroCompra: numeroCompra.trim(),
      dataCompra: dataCompra.trim(),
      clienteId,
      vendedorId,
      itens,
    });

    setNumeroCompra('');
    setDataCompra('');
    setClienteId('');
    setVendedorId('');
    setItens([]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Compras</Text>
      <Text style={styles.description}>
        Registre compras realizadas pelos clientes com vendedores.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nova compra</Text>

        <Text style={styles.label}>Número da compra</Text>
        <TextInput
          value={numeroCompra}
          onChangeText={setNumeroCompra}
          style={styles.input}
          placeholder="Ex: COMP001"
        />

        <Text style={styles.label}>Data da compra</Text>
        <TextInput
          value={dataCompra}
          onChangeText={setDataCompra}
          style={styles.input}
          placeholder="Ex: 2024-05-10"
        />

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
                  clienteId === client.id && styles.clientButtonSelected,
                ]}
                onPress={() => setClienteId(client.id)}
              >
                <Text
                  style={[
                    styles.clientButtonText,
                    clienteId === client.id && styles.clientButtonTextSelected,
                  ]}
                >
                  {client.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Vendedor</Text>
        {sellers.length === 0 ? (
          <Text style={styles.emptyText}>Adicione vendedores primeiro.</Text>
        ) : (
          <View style={styles.sellerList}>
            {sellers.map((seller) => (
              <TouchableOpacity
                key={seller.id}
                style={[
                  styles.sellerButton,
                  vendedorId === seller.id && styles.sellerButtonSelected,
                ]}
                onPress={() => setVendedorId(seller.id)}
              >
                <Text
                  style={[
                    styles.sellerButtonText,
                    vendedorId === seller.id && styles.sellerButtonTextSelected,
                  ]}
                >
                  {seller.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {products.length > 0 && (
          <View style={styles.itemsBox}>
            <Text style={styles.sectionSubtitle}>Itens da compra</Text>
            <View style={styles.row}>
              <View style={styles.fieldSmall}>
                <Text style={styles.label}>Produto</Text>
                <View style={styles.productList}>
                  {products.map((product) => (
                    <TouchableOpacity
                      key={product.id}
                      style={[
                        styles.productButton,
                        selectedProductId === product.id && styles.productButtonSelected,
                      ]}
                      onPress={() => setSelectedProductId(product.id)}
                    >
                      <Text
                        style={[
                          styles.productButtonText,
                          selectedProductId === product.id && styles.productButtonTextSelected,
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
                  value={productQuantity}
                  onChangeText={setProductQuantity}
                  style={styles.input}
                  keyboardType="number-pad"
                />
              </View>
            </View>
            <TouchableOpacity style={styles.addItemButton} onPress={handleAddItem}>
              <Text style={styles.addItemText}>Adicionar item</Text>
            </TouchableOpacity>
            {itens.length > 0 && (
              <View style={styles.itemsList}>
                {itens.map((item) => (
                  <Text key={item.produtoId} style={styles.itemText}>
                    {getProductLabel(item.produtoId)} — {item.quantidade}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleCreatePurchase}>
          <Text style={styles.buttonText}>Salvar compra</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compras registradas</Text>
        {purchases.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma compra registrada.</Text>
        ) : (
          <FlatList
            data={purchases}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const client = findClientById(item.clienteId);
              const seller = findEmployeeById(item.vendedorId);
              return (
                <View style={styles.purchaseCard}>
                  <View style={styles.purchaseHeader}>
                    <Text style={styles.purchaseNumber}>{item.numeroCompra}</Text>
                    <Text style={styles.purchaseDate}>{item.dataCompra}</Text>
                  </View>
                  <Text style={styles.purchaseInfo}>Cliente: {client?.nome || 'Não encontrado'}</Text>
                  <Text style={styles.purchaseInfo}>Vendedor: {seller?.nome || 'Não encontrado'}</Text>
                  <View style={styles.itemsList}>
                    <Text style={styles.sectionSubtitle}>Itens</Text>
                    {item.itens.map((purchaseItem) => (
                      <Text key={purchaseItem.produtoId} style={styles.itemText}>
                        • {getProductLabel(purchaseItem.produtoId)} — {purchaseItem.quantidade}
                      </Text>
                    ))}
                  </View>
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
  sellerList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sellerButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    backgroundColor: '#fff',
  },
  sellerButtonSelected: {
    backgroundColor: '#2c5aa0',
    borderColor: '#2c5aa0',
  },
  sellerButtonText: {
    color: '#4a4a4a',
    fontWeight: '600',
  },
  sellerButtonTextSelected: {
    color: '#fff',
  },
  itemsBox: {
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldSmall: {
    flex: 1,
    minWidth: 120,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  productButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  productButtonSelected: {
    backgroundColor: '#2c5aa0',
    borderColor: '#2c5aa0',
  },
  productButtonText: {
    color: '#4a4a4a',
    fontWeight: '600',
  },
  productButtonTextSelected: {
    color: '#fff',
  },
  addItemButton: {
    marginTop: 10,
    backgroundColor: '#2c5aa0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addItemText: {
    color: '#fff',
    fontWeight: '700',
  },
  itemsList: {
    marginTop: 10,
    gap: 6,
  },
  itemText: {
    color: '#3c3c3c',
    marginBottom: 4,
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
  purchaseCard: {
    padding: 14,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  purchaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  purchaseNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f3a72',
  },
  purchaseDate: {
    color: '#4a4a4a',
  },
  purchaseInfo: {
    color: '#334155',
    marginTop: 4,
  },
  list: {
    paddingBottom: 12,
  },
});
