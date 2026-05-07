import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  Pressable,
} from 'react-native';

type PurchaseItem = {
  id: string;
  name: string;
  value: string;
};

type Purchase = {
  id: string;
  date: string;
  items: PurchaseItem[];
  total: number;
};

const PurchasesScreen: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [currentItems, setCurrentItems] = useState<PurchaseItem[]>([]);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const sortedPurchases = useMemo(
    () => [...purchases].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [purchases]
  );

  const handleAddItem = useCallback(() => {
    if (!name.trim() || !value.trim()) {
      Alert.alert('Erro', 'Preencha o nome e o valor do item.');
      return;
    }

    const newItem: PurchaseItem = {
      id: Date.now().toString(),
      name: name.trim(),
      value: value.trim(),
    };

    setCurrentItems((prev) => [...prev, newItem]);
    setName('');
    setValue('');
  }, [name, value]);

  const handleCreatePurchase = useCallback(() => {
    if (currentItems.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um item à compra.');
      return;
    }

    const total = currentItems.reduce((acc, item) => acc + parseFloat(item.value || '0'), 0);

    const newPurchase: Purchase = {
      id: Date.now().toString(),
      date,
      items: currentItems,
      total,
    };

    setPurchases((prev) => [newPurchase, ...prev]);
    setCurrentItems([]);
  }, [currentItems, date]);

  const renderPurchaseItem = useCallback(({ item }: { item: Purchase }) => (
    <View style={styles.purchaseContainer}>
      <Text style={styles.purchaseDate}>{item.date}</Text>
      <Text style={styles.purchaseTotal}>Total: R$ {item.total.toFixed(2)}</Text>
      {item.items.map((it) => (
        <View key={it.id} style={styles.itemRow}>
          <Text style={styles.itemName}>{it.name}</Text>
          <Text style={styles.itemValue}>R$ {parseFloat(it.value).toFixed(2)}</Text>
        </View>
      ))}
    </View>
  ), []);

  const ListHeaderComponent = useCallback(() => (
    <View>
      {/* ScreenHeader */}
      <View style={styles.screenHeader}>
        <Text style={styles.headerTitle}>Minhas Compras</Text>
      </View>

      {/* Formulário Nova compra */}
      <View style={styles.newPurchaseSection}>
        <Text style={styles.sectionTitle}>Nova compra</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome do item"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Valor (ex: 12.50)"
            value={value}
            onChangeText={setValue}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Data (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
          />
        </View>

        <Pressable style={styles.button} onPress={handleAddItem}>
          <Text style={styles.buttonText}>Adicionar Item</Text>
        </Pressable>

        {currentItems.length > 0 && (
          <View style={styles.currentItems}>
            <Text style={styles.currentItemsTitle}>Itens atuais:</Text>
            {currentItems.map((item) => (
              <View key={item.id} style={styles.currentItem}>
                <Text>{item.name} - R$ {parseFloat(item.value).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        <Pressable
          style={[styles.button, currentItems.length === 0 && styles.buttonDisabled]}
          onPress={handleCreatePurchase}
          disabled={currentItems.length === 0}
        >
          <Text style={styles.buttonText}>
            Criar Compra ({currentItems.length} item{currentItems.length !== 1 ? 's' : ''})
          </Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Compras registradas</Text>
    </View>
  ), [name, value, date, currentItems.length, handleAddItem, handleCreatePurchase]);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={sortedPurchases}
      keyExtractor={(item) => item.id}
      renderItem={renderPurchaseItem}
      ListHeaderComponent={ListHeaderComponent}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default PurchasesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  screenHeader: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 16,
    color: '#333',
  },
  newPurchaseSection: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  currentItems: {
    marginTop: 12,
    marginBottom: 16,
  },
  currentItemsTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  currentItem: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  purchaseContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  purchaseDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  purchaseTotal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 16,
    flex: 1,
  },
  itemValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
});