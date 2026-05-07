import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useProducts } from '@/hooks/ProductContext';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StandardButton } from '@/components/ui/StandardButton';
import { StandardFooter } from '@/components/ui/StandardFooter';

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

      <StandardButton
        text="Ir para Produtos"
        onPress={() => router.push({ pathname: '/(tabs)/products' })}
        variant="primary"
      />
      <StandardButton
        text="Ir para Categorias"
        onPress={() => router.push({ pathname: '/(tabs)/categories' } as any)}
        variant="secondary"
      />

      <StandardFooter />
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
    marginHorizontal: 0,
    marginBottom: 16,
    marginTop: 20,
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
});

