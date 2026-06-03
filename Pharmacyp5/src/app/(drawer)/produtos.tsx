import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Modal,
  Platform,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';

const INITIAL_CATEGORIES = [
  'Medicamentos', 'Medicamentos controlados', 'Genéricos', 'Similares', 
  'OTC (medicamentos sem prescrição)', 'Higiene pessoal', 'Cosméticos', 
  'Perfumaria', 'Dermocosméticos', 'Vitaminas e suplementos', 'Infantil / bebê', 
  'Mamãe e maternidade', 'Produtos naturais', 'Saúde sexual', 'Primeiros socorros', 
  'Equipamentos médicos', 'Ortopédicos', 'Cuidados com idosos', 'Nutrição', 
  'Conveniência', 'Testes e diagnósticos', 'Produtos veterinários', 'Homeopáticos', 
  'Manipulados', 'Vacinas', 'Produtos hospitalares'
];

const UNIDADES_MEDIDA = ['UN', 'CX', 'FR', 'PCT', 'AMP', 'BL', 'TB', 'MG', 'G', 'KG', 'ML', 'L'];

export default function ProdutosScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  
  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [stock, setStock] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [activePrinciple, setActivePrinciple] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('UN');
  const [requiresPrescription, setRequiresPrescription] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar:', error.message);
    }
  };

  const filteredCategories = INITIAL_CATEGORIES.filter(cat => 
    cat.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  const handleCurrencyChange = (text: string, setter: (val: string) => void) => {
    const numericValue = text.replace(/\D/g, '');
    if (!numericValue) {
      setter('');
      return;
    }
    const floatValue = (Number(numericValue) / 100).toFixed(2);
    const formatted = floatValue.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setter(`R$ ${formatted}`);
  };

  const formatCurrencyDisplay = (value: any) => {
    if (value === null || value === undefined || value === '') return '';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return value;
    return `R$ ${num.toFixed(2).replace('.', ',')}`;
  };

  const openNewProductModal = () => {
    setEditingId(null);
    setName('');
    setBarcode('');
    setCostPrice('');
    setSellPrice('');
    setStock('');
    setManufacturer('');
    setActivePrinciple('');
    setDescription('');
    setCategory('');
    setUnit('UN');
    setRequiresPrescription(false);
    setIsActive(true);
    setShowNewProductModal(true);
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setName(product.name || '');
    setBarcode(product.barcode || '');
    setCostPrice(product.costPrice ? formatCurrencyDisplay(product.costPrice) : '');
    setSellPrice(product.price ? formatCurrencyDisplay(product.price) : '');
    setStock(product.stock ? product.stock.toString() : '');
    setManufacturer(product.manufacturer || '');
    setActivePrinciple(product.activePrinciple || '');
    setDescription(product.description || '');
    setCategory(product.category || '');
    setUnit(product.unit || 'UN');
    setRequiresPrescription(product.requiresPrescription || false);
    setIsActive(product.status === 'Ativo');
    setShowNewProductModal(true);
  };

  const handleSaveProduct = async () => {
    if (!name || !category || !sellPrice) {
      Alert.alert('Atenção', 'Por favor, preencha os campos obrigatórios: Nome, Categoria e Preço de Venda.');
      return;
    }

    const parseCurrency = (value: string) => {
      if (!value) return null;
      const cleanValue = value.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
      return parseFloat(cleanValue);
    };

    const productData = {
      name,
      barcode,
      category,
      description,
      price: parseCurrency(sellPrice),
      costPrice: parseCurrency(costPrice),
      stock: Number(stock) || 0,
      status: isActive ? 'Ativo' : 'Inativo',
      unit,
      manufacturer,
      activePrinciple,
      requiresPrescription
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        if (error) throw error;
      }

      setShowNewProductModal(false);
      fetchProducts();
    } catch (error: any) {
      Alert.alert('Erro ao salvar', error.message);
    }
  };

  const confirmDelete = (product: any) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.id);
      if (error) throw error;
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error: any) {
      Alert.alert('Erro ao excluir', error.message);
    }
  };

  const filteredProducts = products.filter(p => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(searchLower)) ||
      (p.barcode && p.barcode.toLowerCase().includes(searchLower)) ||
      (p.activePrinciple && p.activePrinciple.toLowerCase().includes(searchLower))
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Produtos</Text>
        <Text style={styles.subtitle}>Gerenciar cadastro de produtos</Text>
      </View>

      <View style={styles.topRow}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome, código ou princípio ativo..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openNewProductModal}>
          <Feather name="plus" size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Novo Produto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableContainer}>
        <ScrollView style={styles.verticalScroll} showsVerticalScrollIndicator={false}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={styles.tableInner}>
              <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 2.5 }]}>PRODUTO</Text>
                <Text style={[styles.th, { flex: 2 }]}>CATEGORIA</Text>
                <Text style={[styles.th, { flex: 1.5 }]}>PREÇO</Text>
                <Text style={[styles.th, { flex: 1.5 }]}>ESTOQUE</Text>
                <Text style={[styles.th, { flex: 1.5 }]}>STATUS</Text>
                <Text style={[styles.th, { width: 100, textAlign: 'center' }]}>AÇÕES</Text>
              </View>

              {filteredProducts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Feather name="box" size={48} color="#D1D5DB" />
                  <Text style={styles.emptyTitle}>Nenhum produto cadastrado</Text>
                  <Text style={styles.emptyText}>Clique em "Novo Produto" para começar a adicionar itens ao seu estoque.</Text>
                </View>
              ) : (
                filteredProducts.map((item) => (
                  <View key={item.id} style={styles.tableRow}>
                    <View style={{ flex: 2.5, paddingRight: 16 }}>
                      <Text style={styles.cellName}>{item.name}</Text>
                      <Text style={styles.cellBarcode}>{item.barcode || 'Sem código'}</Text>
                    </View>
                    <Text style={[styles.cell, { flex: 2, color: '#6B7280' }]}>{item.category}</Text>
                    <Text style={[styles.cell, { flex: 1.5, fontWeight: '600' }]}>{formatCurrencyDisplay(item.price)}</Text>
                    <Text style={[styles.cell, { flex: 1.5 }]}>{item.stock} {item.unit?.toLowerCase() || 'un'}</Text>
                    <View style={{ flex: 1.5 }}>
                      <View style={[styles.statusBadge, item.status === 'Inativo' && { backgroundColor: '#FEE2E2' }]}>
                        <Text style={[styles.statusText, item.status === 'Inativo' && { color: '#991B1B' }]}>{item.status}</Text>
                      </View>
                    </View>
                    <View style={[styles.actionButtons, { width: 100 }]}>
                      <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(item)}>
                        <Feather name="edit-2" size={18} color="#6B7280" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionBtn} onPress={() => confirmDelete(item)}>
                        <Feather name="trash-2" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        </ScrollView>
      </View>

      {/* MODAL NOVO/EDITAR PRODUTO */}
      <Modal visible={showNewProductModal} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Editar Produto' : 'Novo Produto'}</Text>
              <TouchableOpacity onPress={() => setShowNewProductModal(false)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome do Produto *</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: Dipirona 500mg" />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                  <Text style={styles.label}>Código de Barras</Text>
                  <TextInput style={styles.input} value={barcode} onChangeText={setBarcode} keyboardType="numeric" />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Estoque Atual</Text>
                  <TextInput style={styles.input} value={stock} onChangeText={setStock} keyboardType="numeric" />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 2, marginRight: 12 }]}>
                  <Text style={styles.label}>Categoria *</Text>
                  <TouchableOpacity style={styles.selectInput} onPress={() => setShowCategoryModal(true)}>
                    <Text style={{ color: category ? '#111827' : '#9CA3AF' }}>
                      {category || 'Selecione...'}
                    </Text>
                    <Feather name="chevron-down" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Unidade</Text>
                  <TouchableOpacity style={styles.selectInput} onPress={() => setShowUnitModal(true)}>
                    <Text style={{ color: '#111827' }}>{unit}</Text>
                    <Feather name="chevron-down" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                  <Text style={styles.label}>Preço de Custo</Text>
                  <TextInput 
                    style={styles.input} 
                    value={costPrice} 
                    onChangeText={(text) => handleCurrencyChange(text, setCostPrice)} 
                    placeholder="R$ 0,00" 
                    keyboardType="numeric" 
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Preço de Venda *</Text>
                  <TextInput 
                    style={styles.input} 
                    value={sellPrice} 
                    onChangeText={(text) => handleCurrencyChange(text, setSellPrice)} 
                    placeholder="R$ 0,00" 
                    keyboardType="numeric" 
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fabricante / Laboratório</Text>
                <TextInput style={styles.input} value={manufacturer} onChangeText={setManufacturer} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Princípio Ativo</Text>
                <TextInput style={styles.input} value={activePrinciple} onChangeText={setActivePrinciple} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descrição</Text>
                <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} value={description} onChangeText={setDescription} multiline />
              </View>

              <View style={styles.switchContainer}>
                <View>
                  <Text style={styles.switchLabel}>Receita Obrigatória</Text>
                  <Text style={styles.switchSubLabel}>Exige retenção de receita na venda</Text>
                </View>
                <TouchableOpacity style={[styles.switch, requiresPrescription ? styles.switchActive : styles.switchInactive]} onPress={() => setRequiresPrescription(!requiresPrescription)}>
                  <View style={[styles.switchThumb, requiresPrescription ? styles.thumbActive : styles.thumbInactive]} />
                </TouchableOpacity>
              </View>

              <View style={styles.switchContainer}>
                <View>
                  <Text style={styles.switchLabel}>Produto Ativo</Text>
                  <Text style={styles.switchSubLabel}>Disponível para venda no sistema</Text>
                </View>
                <TouchableOpacity style={[styles.switch, isActive ? styles.switchActive : styles.switchInactive]} onPress={() => setIsActive(!isActive)}>
                  <View style={[styles.switchThumb, isActive ? styles.thumbActive : styles.thumbInactive]} />
                </TouchableOpacity>
              </View>
              
              <View style={{ height: 40 }} />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowNewProductModal(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProduct}>
                <Text style={styles.saveText}>Salvar Produto</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL EXCLUIR */}
      <Modal visible={showDeleteModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlayCentered}>
          <View style={styles.deleteContent}>
            <View style={styles.deleteIcon}>
              <Feather name="trash-2" size={24} color="#EF4444" />
            </View>
            <Text style={styles.deleteTitle}>Excluir Produto</Text>
            <Text style={styles.deleteText}>
              Tem certeza que deseja excluir o produto <Text style={{fontWeight: 'bold'}}>{productToDelete?.name}</Text>? Esta ação não pode ser desfeita.
            </Text>
            <View style={styles.deleteActions}>
              <TouchableOpacity style={styles.cancelDeleteBtn} onPress={() => setShowDeleteModal(false)}>
                <Text style={styles.cancelDeleteText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmDeleteBtn} onPress={handleDelete}>
                <Text style={styles.confirmDeleteText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL SELECIONAR CATEGORIA */}
      <Modal visible={showCategoryModal} animationType="fade" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={styles.selectModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione a Categoria</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalSearchBar2}>
              <Feather name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.modalSearchInput2}
                placeholder="Buscar categoria..."
                placeholderTextColor="#9CA3AF"
                value={categorySearchQuery}
                onChangeText={setCategorySearchQuery}
              />
            </View>

            <ScrollView style={styles.selectList} keyboardShouldPersistTaps="handled">
              {filteredCategories.length === 0 ? (
                <Text style={styles.noResultsText}>Nenhuma categoria encontrada.</Text>
              ) : (
                filteredCategories.map((cat, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.selectItem}
                    onPress={() => {
                      setCategory(cat);
                      setShowCategoryModal(false);
                      setCategorySearchQuery('');
                    }}
                  >
                    <Text style={[styles.selectItemText, category === cat && { color: '#20B2AA', fontWeight: 'bold' }]}>
                      {cat}
                    </Text>
                    {category === cat && <Feather name="check" size={20} color="#20B2AA" />}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL SELECIONAR UNIDADE */}
      <Modal visible={showUnitModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.selectModalContent, { maxHeight: '50%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Unidade de Medida</Text>
              <TouchableOpacity onPress={() => setShowUnitModal(false)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.selectList} keyboardShouldPersistTaps="handled">
              {UNIDADES_MEDIDA.map((un, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.selectItem}
                  onPress={() => {
                    setUnit(un);
                    setShowUnitModal(false);
                  }}
                >
                  <Text style={[styles.selectItemText, unit === un && { color: '#20B2AA', fontWeight: 'bold' }]}>
                    {un}
                  </Text>
                  {unit === un && <Feather name="check" size={20} color="#20B2AA" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 24 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },

  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: '#E5E7EB', marginRight: 12, overflow: 'hidden' },
  searchInput: { flex: 1, height: '100%', width: '100%', fontSize: 16, color: '#111827', outlineStyle: 'none' } as any,
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#20B2AA', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  addButtonText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8 },
  
  tableContainer: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', flex: 1, overflow: 'hidden' },
  verticalScroll: { flex: 1 },
  tableInner: { flex: 1, minWidth: 1040, paddingBottom: 16 },
  tableHeader: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
  th: { fontSize: 12, fontWeight: 'bold', color: '#6B7280' },
  tableRow: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', alignItems: 'center' },
  cellName: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  cellBarcode: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  cell: { fontSize: 14, color: '#111827' },
  statusBadge: { backgroundColor: '#DEF7EC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  statusText: { color: '#046C4E', fontSize: 12, fontWeight: 'bold' },
  actionButtons: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  actionBtn: { padding: 4 },
  emptyState: { padding: 48, alignItems: 'center', justifyContent: 'center', width: '100%' },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', maxWidth: 300 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '90%', padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  modalBody: { flex: 1 },
  row: { flexDirection: 'row', marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, height: 48, fontSize: 16, color: '#111827', outlineStyle: 'none' } as any,
  selectInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, height: 48 },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  switchLabel: { fontSize: 16, fontWeight: '600', color: '#111827' },
  switchSubLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  switch: { width: 50, height: 28, borderRadius: 14, padding: 2, justifyContent: 'center' },
  switchActive: { backgroundColor: '#20B2AA' },
  switchInactive: { backgroundColor: '#D1D5DB' },
  switchThumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  thumbActive: { transform: [{ translateX: 22 }] },
  thumbInactive: { transform: [{ translateX: 0 }] },
  modalFooter: { flexDirection: 'row', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  cancelButton: { flex: 1, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginRight: 12, backgroundColor: '#F3F4F6' },
  cancelText: { color: '#4B5563', fontSize: 16, fontWeight: '600' },
  saveButton: { flex: 1, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: '#20B2AA' },
  saveText: { color: '#FFF', fontSize: 16, fontWeight: '600' },

  selectModalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '70%', padding: 24, marginTop: 'auto' },
  modalSearchBar2: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 16, height: 48, marginBottom: 16 },
  modalSearchInput2: { flex: 1, height: '100%', fontSize: 16, color: '#111827', outlineStyle: 'none' } as any,
  selectList: { flex: 1 },
  selectItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  selectItemText: { fontSize: 16, color: '#374151' },
  noResultsText: { textAlign: 'center', color: '#6B7280', marginTop: 24, fontSize: 16 },

  modalOverlayCentered: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  deleteContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400, alignItems: 'center' },
  deleteIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  deleteTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  deleteText: { fontSize: 14, color: '#4B5563', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  deleteActions: { flexDirection: 'row', gap: 12, width: '100%' },
  cancelDeleteBtn: { flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#D1D5DB' },
  cancelDeleteText: { color: '#374151', fontSize: 14, fontWeight: '600' },
  confirmDeleteBtn: { flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: '#EF4444' },
  confirmDeleteText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
});