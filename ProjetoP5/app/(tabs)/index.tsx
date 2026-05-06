import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useProducts } from '@/hooks/ProductContext';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function TabsScreen() {
  const router = useRouter();
  const { categories, products } = useProducts();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <ScreenHeader
        title="Farmácia Control"
        subtitle="Painel de estoque e cadastro de produtos"
      />

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Categorias cadastradas</Text>
        <Text style={styles.cardValue}>{categories.length}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Produtos cadastrados</Text>
        <Text style={styles.cardValue}>{products.length}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push({ pathname: '/(tabs)/products' })}
      >
        <Text style={styles.buttonText}>Ir para Produtos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => router.push({ pathname: '/(tabs)/categories' } as any)}
      >
        <Text style={styles.buttonSecondaryText}>Ir para Categorias</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14838d',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4a4a4a',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 36,
    color: '#14838d',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#14838d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#ffffff',
    borderColor: '#14838d',
    borderWidth: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonSecondaryText: {
    color: '#14838d',
    fontSize: 16,
    fontWeight: '600',
  },
});

