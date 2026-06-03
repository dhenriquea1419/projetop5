import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';

const INITIAL_CATEGORIES = [
  { id: '1', nome: 'Medicamentos', ativa: true },
  { id: '2', nome: 'Medicamentos controlados', ativa: true },
  { id: '3', nome: 'Genéricos', ativa: true },
  { id: '4', nome: 'Similares', ativa: true },
  { id: '5', nome: 'OTC (medicamentos sem prescrição)', ativa: true },
  { id: '6', nome: 'Higiene pessoal', ativa: true },
  { id: '7', nome: 'Cosméticos', ativa: true },
  { id: '8', nome: 'Perfumaria', ativa: true },
  { id: '9', nome: 'Dermocosméticos', ativa: true },
  { id: '10', nome: 'Vitaminas e suplementos', ativa: true },
  { id: '11', nome: 'Infantil / bebê', ativa: true },
  { id: '12', nome: 'Mamãe e maternidade', ativa: true },
  { id: '13', nome: 'Produtos naturais', ativa: true },
  { id: '14', nome: 'Saúde sexual', ativa: true },
  { id: '15', nome: 'Primeiros socorros', ativa: true },
  { id: '16', nome: 'Equipamentos médicos', ativa: true },
  { id: '17', nome: 'Ortopédicos', ativa: true },
  { id: '18', nome: 'Cuidados com idosos', ativa: true },
  { id: '19', nome: 'Nutrição', ativa: true },
  { id: '20', nome: 'Conveniência', ativa: true },
  { id: '21', nome: 'Testes e diagnósticos', ativa: true },
  { id: '22', nome: 'Produtos veterinários', ativa: true },
  { id: '23', nome: 'Homeopáticos', ativa: true },
  { id: '24', nome: 'Manipulados', ativa: true },
  { id: '25', nome: 'Vacinas', ativa: true },
  { id: '26', nome: 'Produtos hospitalares', ativa: true },
];

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [activeProducts, setActiveProducts] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Total de produtos
      const { count: totalCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Produtos ativos
      const { count: activeCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Ativo');

      // Produtos com estoque baixo (<= 5)
      const { count: lowCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lte('stock', 5);

      setTotalProducts(totalCount || 0);
      setActiveProducts(activeCount || 0);
      setLowStockProducts(lowCount || 0);
      setTotalCategories(INITIAL_CATEGORIES.length);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      title: 'Total de Produtos', 
      value: loading ? '-' : totalProducts.toString(), 
      icon: 'box' as const, 
      color: '#3B82F6' 
    },
    { 
      title: 'Produtos Ativos', 
      value: loading ? '-' : activeProducts.toString(), 
      icon: 'check-circle' as const, 
      color: '#10B981' 
    },
    { 
      title: 'Estoque Baixo', 
      value: loading ? '-' : lowStockProducts.toString(), 
      icon: 'alert-triangle' as const, 
      color: '#F59E0B' 
    },
    { 
      title: 'Categorias', 
      value: loading ? '-' : totalCategories.toString(), 
      icon: 'tag' as const, 
      color: '#8B5CF6' 
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Visão Geral da Farmácia</Text>
      <Text style={styles.pageSubtitle}>Acompanhe os indicadores do seu sistema de vendas.</Text>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.iconWrapper, { backgroundColor: `${stat.color}15` }]}>
              <Feather name={stat.icon} size={24} color={stat.color} />
            </View>
            {loading ? (
              <ActivityIndicator size="small" color="#9CA3AF" style={{ marginBottom: 4 }} />
            ) : (
              <Text style={styles.statValue}>{stat.value}</Text>
            )}
            <Text style={styles.statTitle}>{stat.title}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Módulos do Sistema</Text>
      <View style={styles.modulesGrid}>
        <ModuleCard title="Gestão de Produtos" desc="Código, descrição, unidade, valor e composição." icon="package" />
        <ModuleCard title="Clientes e Dependentes" desc="Vínculo familiar, identificação e dados de contato." icon="user-plus" />
        <ModuleCard title="Funcionários" desc="Vendedores, representantes e comissões." icon="briefcase" />
        <ModuleCard title="Cartões de Progressão" desc="Controle de nível (Junior/Sênior) por vendedor." icon="award" />
      </View>
    </ScrollView>
  );
}

function ModuleCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <TouchableOpacity style={styles.moduleCard}>
      <Feather name={icon as any} size={28} color="#173534" style={styles.moduleIcon} />
      <Text style={styles.moduleTitle}>{title}</Text>
      <Text style={styles.moduleDesc}>{desc}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F7' },
  content: { padding: 20 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  pageSubtitle: { fontSize: 16, color: '#6B7280', marginBottom: 24, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 32 },
  statCard: { width: '48%', backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  iconWrapper: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  statTitle: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  modulesGrid: { gap: 16 },
  moduleCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderLeftWidth: 4, borderLeftColor: '#37d3c5' },
  moduleIcon: { marginBottom: 12 },
  moduleTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  moduleDesc: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
});