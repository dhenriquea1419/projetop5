import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { useRouter } from 'expo-router';

interface SaleItem {
  id: string;
  produto_nome: string;
  qtd: number;
  preco_unit: number;
  subtotal: number;
}

interface Sale {
  id: string;
  created_at: string;
  cliente_nome: string;
  vendedor_nome: string;
  total: number;
  subtotal: number;
  desconto: number;
  forma_pagamento: string;
  status: string;
  items: SaleItem[];
  troco: number;
  parcelas: number;
  observacoes: string;
}

const HistoricoVendasScreen = () => {
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchSales = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setSales(data || []);
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Falha ao carregar vendas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSales();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${d}/${m}/${y} ${h}:${min}`;
  };

  const filteredSales = sales.filter(sale => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      sale.cliente_nome?.toLowerCase().includes(term) ||
      sale.vendedor_nome?.toLowerCase().includes(term) ||
      sale.forma_pagamento?.toLowerCase().includes(term) ||
      sale.id?.toLowerCase().includes(term)
    );
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Título */}
        <Text style={styles.title}>Histórico de Vendas</Text>
        <Text style={styles.subtitle}>Visualizar todas as vendas realizadas</Text>

        {/* Botão Nova Venda */}
        <TouchableOpacity style={styles.novaVendaButton} onPress={() => router.push('/nova-venda')}>
          <Ionicons name="cart-outline" size={20} color="#FFF" />
          <Text style={styles.novaVendaText}>Nova Venda</Text>
        </TouchableOpacity>

        {/* Busca */}
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          value={search}
          onChangeText={setSearch}
        />

        {/* Lista */}
        {loading && sales.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <ActivityIndicator size="large" color="#20B2AA" />
          </View>
        ) : filteredSales.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <Ionicons name="cart-outline" size={64} color="#D1D5DB" />
            <Text style={{ color: '#6B7280', marginTop: 16, fontSize: 16 }}>Nenhuma venda encontrada</Text>
          </View>
        ) : (
          <FlatList
            data={filteredSales}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardRow}>
                  <Text style={styles.label}>N° {item.id.slice(0, 8)}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>Concluída</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => { setSelectedSale(item); setModalVisible(true); }}
                      style={{ marginLeft: 8 }}
                    >
                      <Ionicons name="eye" size={20} color="#20B2AA" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.cardRow}>
                  <Text style={styles.label}>Cliente</Text>
                  <Text style={styles.value}>{item.cliente_nome}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Text style={styles.label}>Vendedor</Text>
                  <Text style={styles.value}>{item.vendedor_nome}</Text>
                </View>
                <View style={styles.cardRowEnd}>
                  <Text style={styles.totalValue}>R$ {item.total.toFixed(2).replace('.', ',')}</Text>
                  <Text style={styles.value}>{item.forma_pagamento}</Text>
                </View>
                <View style={styles.cardRowEnd}>
                  <Text style={styles.label}>{formatDate(item.created_at)}</Text>
                </View>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </ScrollView>

      {/* Modal de Detalhes */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.selectModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes da Venda</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            {selectedSale && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.cardRow}><Text style={styles.label}>N°</Text><Text style={styles.value}>{selectedSale.id}</Text></View>
                <View style={styles.cardRow}><Text style={styles.label}>Status</Text><View style={styles.statusBadge}><Text style={styles.statusText}>Concluída</Text></View></View>
                <View style={styles.cardRow}><Text style={styles.label}>Cliente</Text><Text style={styles.value}>{selectedSale.cliente_nome}</Text></View>
                <View style={styles.cardRow}><Text style={styles.label}>Vendedor</Text><Text style={styles.value}>{selectedSale.vendedor_nome}</Text></View>
                <View style={styles.cardRow}><Text style={styles.label}>Pagamento</Text><Text style={styles.value}>{selectedSale.forma_pagamento}</Text></View>
                <View style={styles.cardRow}><Text style={styles.label}>Data</Text><Text style={styles.value}>{formatDate(selectedSale.created_at)}</Text></View>

                <Text style={[styles.modalTitle, { fontSize: 18, marginTop: 16, marginBottom: 8 }]}>Itens</Text>
                {selectedSale.items?.map(item => (
                  <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                    <Text style={styles.label}>{item.produto_nome} x{item.qtd}</Text>
                    <Text style={styles.value}>R$ {item.subtotal.toFixed(2).replace('.', ',')}</Text>
                  </View>
                ))}

                <View style={[styles.cardRow, { marginTop: 8 }]}><Text style={styles.label}>Subtotal</Text><Text style={styles.value}>R$ {selectedSale.subtotal.toFixed(2).replace('.', ',')}</Text></View>
                <View style={styles.cardRow}><Text style={styles.label}>Desconto</Text><Text style={styles.value}>R$ {selectedSale.desconto.toFixed(2).replace('.', ',')}</Text></View>
                <View style={styles.cardRow}><Text style={styles.label}>Total</Text><Text style={[styles.totalValue, { fontSize: 22 }]}>R$ {selectedSale.total.toFixed(2).replace('.', ',')}</Text></View>
                {selectedSale.troco > 0 && <View style={styles.cardRow}><Text style={styles.label}>Troco</Text><Text style={styles.value}>R$ {selectedSale.troco.toFixed(2).replace('.', ',')}</Text></View>}
                {selectedSale.parcelas > 1 && <View style={styles.cardRow}><Text style={styles.label}>Parcelas</Text><Text style={styles.value}>{selectedSale.parcelas}x</Text></View>}
                {selectedSale.observacoes && <View style={styles.cardRow}><Text style={styles.label}>Observações</Text><Text style={styles.value}>{selectedSale.observacoes}</Text></View>}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  novaVendaButton: { backgroundColor: '#20B2AA', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 16, marginBottom: 16 },
  novaVendaText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  searchInput: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, height: 48, paddingHorizontal: 16, fontSize: 16, marginBottom: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', padding: 16, marginBottom: 16 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  cardRowEnd: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  label: { fontSize: 14, color: '#6B7280' },
  value: { fontSize: 16, fontWeight: '600', color: '#111827' },
  totalValue: { fontSize: 28, fontWeight: 'bold', color: '#20B2AA' },
  statusBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#065F46', fontSize: 12, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  selectModalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, marginTop: 'auto', height: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
});

export default HistoricoVendasScreen;