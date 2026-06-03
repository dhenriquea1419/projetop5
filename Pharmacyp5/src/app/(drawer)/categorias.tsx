import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';

export default function CategoriasScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<any[]>([]);

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState(true);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      setCategorias(data || []);
    } catch (error: any) {
      console.log('Aviso:', error.message);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategorias = categorias.filter(cat => 
    cat.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openNewModal = () => {
    setEditingId(null);
    setNome('');
    setDescricao('');
    setCategoriaAtiva(true);
    setShowModal(true);
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setNome(cat.nome || '');
    setDescricao(cat.descricao || '');
    setCategoriaAtiva(cat.ativa !== false);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o nome da categoria.');
      return;
    }

    const catData = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      ativa: categoriaAtiva,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from('categories')
          .update(catData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([catData]);
        if (error) throw error;
      }

      setShowModal(false);
      fetchCategorias();
    } catch (error: any) {
      Alert.alert('Erro ao salvar', error.message);
    }
  };

  const confirmDelete = (cat: any) => {
    setCategoryToDelete(cat);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryToDelete.id);
      if (error) throw error;

      setShowDeleteModal(false);
      setCategoryToDelete(null);
      fetchCategorias();
    } catch (error: any) {
      Alert.alert('Erro ao excluir', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categorias</Text>
        <Text style={styles.subtitle}>Gerenciar categorias de produtos</Text>
      </View>

      <View style={styles.topRow}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar categoria..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openNewModal}>
          <Feather name="plus" size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Nova Categoria</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 1 }]}>NOME DA CATEGORIA</Text>
          <Text style={[styles.th, { width: 100, textAlign: 'center' }]}>STATUS</Text>
          <Text style={[styles.th, { width: 100, textAlign: 'center' }]}>AÇÕES</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Carregando...</Text>
            </View>
          ) : filteredCategorias.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="tag" size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>Nenhuma categoria encontrada</Text>
              <Text style={styles.emptyText}>Clique em "Nova Categoria" para começar.</Text>
            </View>
          ) : (
            filteredCategorias.map((cat) => (
              <View key={cat.id} style={styles.tableRow}>
                <Text style={[styles.cell, { flex: 1, fontWeight: '500' }]}>{cat.nome}</Text>
                <View style={{ width: 100, alignItems: 'center' }}>
                  <View style={[styles.statusBadge, { backgroundColor: cat.ativa !== false ? '#DEF7EC' : '#FEE2E2' }]}>
                    <Text style={[styles.statusText, { color: cat.ativa !== false ? '#046C4E' : '#9B1C1C' }]}>
                      {cat.ativa !== false ? 'Ativa' : 'Inativa'}
                    </Text>
                  </View>
                </View>
                <View style={{ width: 100, flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(cat)}>
                    <Feather name="edit-2" size={18} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => confirmDelete(cat)}>
                    <Feather name="trash-2" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* MODAL NOVA/EDITAR CATEGORIA */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Editar Categoria' : 'Nova Categoria'}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome *</Text>
                <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Medicamentos" />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descrição</Text>
                <TextInput 
                  style={[styles.input, { height: 100, textAlignVertical: 'top', paddingTop: 12 }]} 
                  value={descricao} 
                  onChangeText={setDescricao} 
                  placeholder="Descrição opcional da categoria..."
                  multiline 
                />
              </View>

              <View style={styles.switchContainer}>
                <View>
                  <Text style={styles.switchLabel}>Categoria ativa</Text>
                  <Text style={styles.switchSubLabel}>Disponível para uso nos produtos</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.switch, categoriaAtiva ? styles.switchActive : styles.switchInactive]} 
                  onPress={() => setCategoriaAtiva(!categoriaAtiva)}
                >
                  <View style={[styles.switchThumb, categoriaAtiva ? styles.thumbActive : styles.thumbInactive]} />
                </TouchableOpacity>
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Salvar</Text>
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
            <Text style={styles.deleteTitle}>Excluir Categoria</Text>
            <Text style={styles.deleteText}>
              Tem certeza que deseja excluir a categoria <Text style={{fontWeight: 'bold'}}>{categoryToDelete?.nome}</Text>?
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },

  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: '#E5E7EB', marginRight: 12, overflow: 'hidden' },
  searchInput: { flex: 1, height: '100%', width: '100%', fontSize: 16, color: '#111827', outlineStyle: 'none' } as any,
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#20B2AA', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  addButtonText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8 },

  tableContainer: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
  th: { fontSize: 12, fontWeight: 'bold', color: '#6B7280' },
  tableRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  cell: { fontSize: 14, color: '#111827' },
  actionBtn: { padding: 4 },

  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: 'bold' },

  emptyState: { padding: 48, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 8 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '70%', padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  modalBody: { flex: 1 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, height: 48, fontSize: 16, color: '#111827', outlineStyle: 'none' } as any,

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