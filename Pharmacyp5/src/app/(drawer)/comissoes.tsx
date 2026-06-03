import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';

const { width: screenWidth } = Dimensions.get('window');

interface SaleRecord {
  employee_id: string;
  employee_name: string;
  sale_value: number;
  commission_value: number;
  period: string;
}

interface SellerSummary {
  name: string;
  totalSales: number;
  totalCommission: number;
}

const getCurrentPeriod = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const getMonthName = (monthIndex: number): string => {
  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
  ];
  return months[monthIndex];
};

const formatPeriod = (period: string): string => {
  const [year, month] = period.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  return `${getMonthName(monthIndex)} ${year}`;
};

const generatePeriods = (): string[] => {
  const periods: string[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    periods.push(`${year}-${month}`);
  }
  return periods;
};

const formatCurrency = (value: number): string => {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const ComissoesScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>(getCurrentPeriod());
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [salesData, setSalesData] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tooltipInfo, setTooltipInfo] = useState<{ visible: boolean; name: string; value: number; x: number; y: number }>({ visible: false, name: '', value: 0, x: 0, y: 0 });

  const periods = generatePeriods();

  const fetchData = useCallback(async (period: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('commissions')
        .select('*')
        .eq('period', period);
      if (error) throw error;
      setSalesData(data || []);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(selectedPeriod);
  }, [selectedPeriod, fetchData]);

  const groupedBySeller = (): SellerSummary[] => {
    const map = new Map<string, { totalSales: number; totalCommission: number }>();
    salesData.forEach((record) => {
      const existing = map.get(record.employee_name) || { totalSales: 0, totalCommission: 0 };
      existing.totalSales += record.sale_value;
      existing.totalCommission += record.commission_value;
      map.set(record.employee_name, existing);
    });
    return Array.from(map.entries()).map(([name, values]) => ({
      name,
      totalSales: values.totalSales,
      totalCommission: values.totalCommission,
    }));
  };

  const sellers = groupedBySeller();
  const totalCommissions = sellers.reduce((acc, s) => acc + s.totalCommission, 0);
  const totalSalesMonth = sellers.reduce((acc, s) => acc + s.totalSales, 0);
  const activeSellers = sellers.length;
  const bestSeller = sellers.reduce((best, current) =>
    current.totalCommission > best.totalCommission ? current : best,
    sellers[0] || { name: '', totalSales: 0, totalCommission: 0 }
  );

  // Bar chart constants
  const chartWidth = screenWidth - 64; // padding 16 each side + extra margin
  const chartHeight = 200;
  const barWidth = 40;
  const maxCommission = Math.max(...sellers.map((s) => s.totalCommission), 1);
  const barSpacing = 20;

  const handleBarPress = (seller: SellerSummary, index: number) => {
    const barX = 40 + index * (barWidth + barSpacing); // 40 for y-axis labels
    const barHeight = (seller.totalCommission / maxCommission) * chartHeight;
    const tooltipY = chartHeight - barHeight - 10; // above bar
    setTooltipInfo({
      visible: true,
      name: seller.name,
      value: seller.totalCommission,
      x: barX + barWidth / 2,
      y: tooltipY,
    });
    setTimeout(() => setTooltipInfo({ ...tooltipInfo, visible: false }), 2000);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.headerTitle}>Comissões</Text>
      <Text style={styles.headerSubtitle}>Controle de comissões dos vendedores</Text>

      {/* Period Selector */}
      <TouchableOpacity style={styles.periodSelector} onPress={() => setModalVisible(true)}>
        <Text style={styles.periodText}>{formatPeriod(selectedPeriod)}</Text>
        <Ionicons name="chevron-down" size={20} color="#6B7280" />
      </TouchableOpacity>

      {/* Modal for period selection */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={periods}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedPeriod(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalItemText, item === selectedPeriod && styles.modalItemSelected]}>
                    {formatPeriod(item)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Summary Cards */}
      {loading ? (
        <Text style={styles.loadingText}>Carregando...</Text>
      ) : (
        <>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { flex: 1 }]}>
              <View style={[styles.iconSquare, { backgroundColor: '#06B6D4' }]}>
                <Ionicons name="cash" size={24} color="white" />
              </View>
              <Text style={styles.cardLabel}>Total Comissões</Text>
              <Text style={styles.cardValue}>{formatCurrency(totalCommissions)}</Text>
            </View>
            <View style={[styles.summaryCard, { flex: 1 }]}>
              <View style={[styles.iconSquare, { backgroundColor: '#10B981' }]}>
                <Ionicons name="trending-up" size={24} color="white" />
              </View>
              <Text style={styles.cardLabel}>Total Vendas (Mês)</Text>
              <Text style={styles.cardValue}>{formatCurrency(totalSalesMonth)}</Text>
            </View>
            <View style={[styles.summaryCard, { flex: 1 }]}>
              <View style={[styles.iconSquare, { backgroundColor: '#8B5CF6' }]}>
                <Ionicons name="people" size={24} color="white" />
              </View>
              <Text style={styles.cardLabel}>Vendedores Ativos</Text>
              <Text style={styles.cardValue}>{activeSellers}</Text>
            </View>
          </View>

          {/* Best Seller Card */}
          {bestSeller.name ? (
            <View style={styles.bestSellerCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.iconSquare, { backgroundColor: '#FED7AA' }]}>
                  <Ionicons name="ribbon" size={24} color="#92400E" />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.bestSellerLabel}>Melhor Vendedor</Text>
                  <Text style={styles.bestSellerName}>{bestSeller.name}</Text>
                </View>
              </View>
              <Text style={styles.bestSellerCommission}>{formatCurrency(bestSeller.totalCommission)}</Text>
            </View>
          ) : null}

          {/* Bar Chart */}
          <Text style={styles.chartTitle}>Comissões por Vendedor</Text>
          <View style={styles.chartContainer}>
            {/* Y-axis labels */}
            <View style={styles.yAxis}>
              {[maxCommission, maxCommission * 0.75, maxCommission * 0.5, maxCommission * 0.25, 0].map((val, idx) => (
                <Text key={idx} style={styles.yAxisLabel}>
                  {formatCurrency(val)}
                </Text>
              ))}
            </View>
            {/* Chart area */}
            <View style={styles.chartArea}>
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((fraction, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.gridLine,
                    { bottom: fraction * chartHeight },
                  ]}
                />
              ))}
              {/* Bars */}
              {sellers.map((seller, index) => {
                const barHeight = (seller.totalCommission / maxCommission) * chartHeight;
                return (
                  <TouchableOpacity
                    key={seller.name}
                    onPress={() => handleBarPress(seller, index)}
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        left: 0 + index * (barWidth + barSpacing),
                        width: barWidth,
                        bottom: 0,
                      },
                    ]}
                  />
                );
              })}
              {/* Tooltip */}
              {tooltipInfo.visible && (
                <View
                  style={[
                    styles.tooltip,
                    {
                      left: tooltipInfo.x - 60,
                      top: tooltipInfo.y - 40,
                    },
                  ]}
                >
                  <Text style={styles.tooltipText}>
                    {tooltipInfo.name}: {formatCurrency(tooltipInfo.value)}
                  </Text>
                </View>
              )}
              {/* X-axis labels */}
              <View style={styles.xAxis}>
                {sellers.map((seller, index) => (
                  <Text
                    key={seller.name}
                    style={[
                      styles.xAxisLabel,
                      {
                        left: 0 + index * (barWidth + barSpacing),
                        width: barWidth,
                      },
                    ]}
                  >
                    {seller.name.split(' ')[0]}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          {/* Table Detalhamento */}
          <Text style={styles.tableTitle}>Detalhamento</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              {/* Header */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { width: 120 }]}>VENDEDOR</Text>
                <Text style={[styles.tableCell, { width: 80, textAlign: 'center' }]}>VENDAS</Text>
                <Text style={[styles.tableCell, { width: 120, textAlign: 'right' }]}>TOTAL VENDIDO</Text>
                <Text style={[styles.tableCell, { width: 120, textAlign: 'right' }]}>COMISSÃO</Text>
              </View>
              {/* Rows */}
              {sellers.map((seller, index) => (
                <View key={seller.name} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
                  <Text style={[styles.tableCell, { width: 120 }]}>{seller.name}</Text>
                  <Text style={[styles.tableCell, { width: 80, textAlign: 'center' }]}>{salesData.filter(s => s.employee_name === seller.name).length}</Text>
                  <Text style={[styles.tableCell, { width: 120, textAlign: 'right' }]}>{formatCurrency(seller.totalSales)}</Text>
                  <Text style={[styles.tableCell, { width: 120, textAlign: 'right', color: '#0D9488', fontWeight: 'bold' }]}>{formatCurrency(seller.totalCommission)}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  periodText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalItemText: {
    fontSize: 16,
    color: '#374151',
  },
  modalItemSelected: {
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 40,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  iconSquare: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  bestSellerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bestSellerLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  bestSellerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  bestSellerCommission: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 200 + 30, // extra space for x-axis labels
    marginBottom: 16,
  },
  yAxis: {
    width: 80,
    height: 200,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  chartArea: {
    flex: 1,
    height: 200,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bar: {
    position: 'absolute',
    backgroundColor: '#3B82F6',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#1F2937',
    padding: 8,
    borderRadius: 6,
    zIndex: 10,
    maxWidth: 150,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  xAxis: {
    position: 'absolute',
    bottom: -30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 30,
  },
  xAxisLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    marginTop: 16,
  },
  tableHeader: {
    backgroundColor: '#F1F5F9',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableRowEven: {
    backgroundColor: '#FFFFFF',
  },
  tableRowOdd: {
    backgroundColor: '#FFFFFF',
  },
  tableCell: {
    fontSize: 14,
    color: '#374151',
    paddingHorizontal: 4,
  },
});

export default ComissoesScreen;