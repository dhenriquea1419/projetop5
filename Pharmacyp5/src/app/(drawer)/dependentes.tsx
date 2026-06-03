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

const PARENTESCO_OPTIONS = [
  'Filho(a)', 'Cônjuge', 'Pai', 'Mãe', 'Irmão(ã)', 'Sogro(a)',
  'Avô(ó)', 'Neto(a)', 'Tio(a)', 'Primo(a)', 'Outro'
];

export default function DependentesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTitularModal, setShowTitularModal] = useState(false);
  const [showParentescoModal, setShowParentescoModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dependentToDelete, setDependentToDelete] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dependents, setDependents] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [clienteTitularId, setClienteTitularId] = useState<string | null>(null);
  const [clienteTitularNome, setClienteTitularNome] = useState('');
  const [parentesco, setParentesco] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [dependenteAtivo, setDependenteAtivo] = useState(true);

  useEffect(() => {
    fetchDependents();
    fetchClients();
  }, []);

  const fetchDependents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('dependents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDependents(data || []);
    } catch (error: any) {
      console.log('Aviso:', error.message);
      setDependents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, nome')
        .order('nome', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error: any) {
      console.log('Aviso ao carregar clientes:', error.message);
    }
  };

  const getTitularNome = (titularId: string) => {
    const client = clients.find(c => c.id === titularId);
    return client ? client.nome : '---';
  };

  // Máscaras
  const maskCpf = (text: string) => {
    const nums = text.replace(/\D/g, '').slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
    if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
    return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
  };

  const maskPhone = (text: string) => {
    const nums = text.replace(/\D/g, '').slice(0, 11);
    if (nums.length <= 2) return `(${nums}`;
    if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
  };

  const maskDate = (text: string) => {
    const nums = text.replace(/\D/g, '').slice(0, 8);
    if (nums.length <= 2) return nums;
    if (nums.length <= 4) return `${nums.slice(0, 2)}/${nums.slice(2)}`;
    return `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4)}`;
  };

  const openNewModal = () => {
    setEditingId(null);
    setNome('');
    setClienteTitularId(null);
    setClienteTitularNome('');
    setParentesco('');
    setCpf('');
    setTelefone('');
    setDataNascimento('');
    setDependenteAtivo(true);
    setShowModal(true);
  };

  const handleEdit = (dep: any) => {
    setEditingId(dep.id);
    setNome(dep.nome || '');
    setClienteTitularId(dep.cliente_titular_id || null);
    setClienteTitularNome(getTitularNome(dep.cliente_titular_id));
    setParentesco(dep.parentesco || '');
    setCpf(dep.cpf || '');
    setTelefone(dep.telefone || '');
    setDataNascimento(dep.datanascimento || '');
    setDependenteAtivo(dep.status === 'ativo');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!nome || !clienteTitularId) {
      Alert.alert('Atenção', 'Os campos Nome Completo e Cliente Titular são obrigatórios.');
      return;
    }

    const depData = {
      nome,
      cliente_titular_id: clienteTitularId,
      parentesco,
      cpf,
      telefone,
      datanascimento: dataNascimento,
      status: dependenteAtivo ? 'ativo' : 'inativo'
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from('dependents')
          .update(depData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('dependents')
          .insert([depData]);
        if (error) throw error;
      }

      setShowModal(false);
      fetchDependents();
    } catch (error: any) {
      Alert.alert('Erro ao salvar', error.message);
    }
  };

  const confirmDelete = (dep: any) => {
    setDependentToDelete(dep);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!dependentToDelete) return;
    try {
      const { error } = await supabase
        .from('dependents')
        .delete()
        .eq('id', dependentToDelete.id);
      if (error) throw error;

      setShowDeleteModal(false);
      setDependentToDelete(null);
      fetchDependents();
    } catch (error: any) {
      Alert.alert('Erro ao excluir', error.message);
    }
  };

  const filteredDependents = dependents.filter(d => {
    const q = searchQuery.toLowerCase();
    return (
      (d.nome && d.nome.toLowerCase().includes(q)) ||
      (d.parentesco && d.parentesco.toLowerCase().includes(q)) ||
      (getTitularNome(d.cliente_titular_id) && getTitularNome(d.cliente_titular_id).toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.loadingContainer, { flex: 1 }]}>
          <Text style={styles.emptyText}>Carregando dependentes...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dependentes</Text>
        <Text style={styles.subtitle}>Gerenciar dependentes dos clientes</Text>
      </View>

      <View style={styles.topRow}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openNewModal}>
          <Feather name="plus" size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Novo Dependente</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableContainer}>
        <ScrollView style={styles.verticalScroll} showsVerticalScrollIndicator={false}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.tableInner}>
              <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 2.5 }]}>NOME</Text>
                <Text style={[styles.th, { flex: 2.5 }]}>TITULAR</Text>
                <Text style={[styles.th, { flex: 1.5 }]}>PARENTESCO</Text>
                <Text style={[styles.th, { flex: 1 }]}>STATUS</Text>
                <Text style={[styles.th, { width: 100, textAlign: 'center' }]}>AÇÕES</Text>
              </View>

              {filteredDependents.length === 0 ? (
                <View style={styles.emptyState}>
                  <Feather name="users" size={48} color="#D1D5DB" />
                  <Text style={styles.emptyTitle}>Nenhum dependente cadastrado</Text>
                  <Text style={styles.emptyText}>Clique em "Novo Dependente" para começar.</Text>
                </View>
              ) : (
                filteredDependents.map((item) => (
                  <View key={item.id} style={styles.tableRow}>
                    <View style={{ flex: 2.5, paddingRight: 12 }}>
                      <Text style={styles.cellName}>{item.nome}</Text>
                    </View>
                    <Text style={[styles.cell, { flex: 2.5 }]}>{getTitularNome(item.cliente_titular_id) || '-'}</Text>
                    <Text style={[styles.cell, { flex: 1.5 }]}>{item.parentesco || '-'}</Text>
                    <View style={{ flex: 1 }}>
                      <View style={[styles.statusBadge, item.status === 'inativo' && { backgroundColor: '#FEE2E2' }]}>
                        <Text style={[styles.statusText, item.status === 'inativo' && { color: '#991B1B' }]}>
                          {item.status || 'ativo'}
                        </Text>
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

      {/* MODAL NOVO/EDITAR DEPENDENTE */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Editar Dependente' : 'Novo Dependente'}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              {/* Nome Completo */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome Completo *</Text>
                <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome completo" />
              </View>

              {/* Cliente Titular */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cliente Titular *</Text>
                <TouchableOpacity style={styles.selectInput} onPress={() => setShowTitularModal(true)}>
                  <Text style={{ color: clienteTitularNome ? '#111827' : '#9CA3AF', flex: 1 }}>
                    {clienteTitularNome || 'Selecione o titular'}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Parentesco */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Parentesco</Text>
                <TouchableOpacity style={styles.selectInput} onPress={() => setShowParentescoModal(true)}>
                  <Text style={{ color: parentesco ? '#111827' : '#9CA3AF', flex: 1 }}>
                    {parentesco || 'Selecione'}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* CPF + Telefone lado a lado */}
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>CPF</Text>
                  <TextInput style={styles.input} value={cpf} onChangeText={(t) => setCpf(maskCpf(t))} placeholder="000.000.000-00" keyboardType="numeric" />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Telefone</Text>
                  <TextInput style={styles.input} value={telefone} onChangeText={(t) => setTelefone(maskPhone(t))} placeholder="(00) 00000-0000" keyboardType="numeric" />
                </View>
              </View>

              {/* Data de Nascimento */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Data de Nascimento</Text>
                <View style={styles.inputWithIcon}>
                  <TextInput 
                    style={[styles.input, { flex: 1, borderWidth: 0 }]} 
                    value={dataNascimento} 
                    onChangeText={(t) => setDataNascimento(maskDate(t))} 
                    placeholder="dd/mm/aaaa" 
                    keyboardType="numeric" 
                  />
                  <Feather name="calendar" size={20} color="#6B7280" style={{ marginRight: 12 }} />
                </View>
              </View>

              {/* Toggle Dependente Ativo */}
              <View style={styles.switchContainer}>
                <View>
                  <Text style={styles.switchLabel}>Dependente ativo</Text>
                  <Text style={styles.switchSubLabel}>Dependente disponível para vendas</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.switch, dependenteAtivo ? styles.switchActive : styles.switchInactive]} 
                  onPress={() => setDependenteAtivo(!dependenteAtivo)}
                >
                  <View style={[styles.switchThumb, dependenteAtivo ? styles.thumbActive : styles.thumbInactive]} />
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

      {/* MODAL SELECIONAR TITULAR */}
      <Modal visible={showTitularModal} animationType="fade" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={styles.selectModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o Titular</Text>
              <TouchableOpacity onPress={() => setShowTitularModal(false)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.selectList} keyboardShouldPersistTaps="handled">
              {clients.length === 0 ? (
                <Text style={styles.noResultsText}>Nenhum cliente cadastrado.</Text>
              ) : (
                clients.map((client) => (
                  <TouchableOpacity 
                    key={client.id} 
                    style={styles.selectItem}
                    onPress={() => {
                      setClienteTitularId(client.id);
                      setClienteTitularNome(client.nome);
                      setShowTitularModal(false);
                    }}
                  >
                    <Text style={[styles.selectItemText, clienteTitularId === client.id && { color: '#20B2AA', fontWeight: 'bold' }]}>
                      {client.nome}
                    </Text>
                    {clienteTitularId === client.id && <Feather name="check" size={20} color="#20B2AA" />}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL SELECIONAR PARENTESCO */}
      <Modal visible={showParentescoModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.selectModalContent, { maxHeight: '60%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o Parentesco</Text>
              <TouchableOpacity onPress={() => setShowParentescoModal(false)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.selectList} keyboardShouldPersistTaps="handled">
              {PARENTESCO_OPTIONS.map((opt, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.selectItem}
                  onPress={() => {
                    setParentesco(opt);
                    setShowParentescoModal(false);
                  }}
                >
                  <Text style={[styles.selectItemText, parentesco === opt && { color: '#20B2AA', fontWeight: 'bold' }]}>
                    {opt}
                  </Text>
                  {parentesco === opt && <Feather name="check" size={20} color="#20B2AA" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL EXCLUIR */}
      <Modal visible={showDeleteModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlayCentered}>
          <View style={styles.deleteContent}>
            <View style={styles.deleteIcon}>
              <Feather name="trash-2" size={24} color="#EF4444" />
            </View>
            <Text style={styles.deleteTitle}>Excluir Dependente</Text>
            <Text style={styles.deleteText}>
              Tem certeza que deseja excluir o dependente <Text style={{fontWeight: 'bold'}}>{dependentToDelete?.nome}</Text>?
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
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 24 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: '#E5E7EB', marginRight: 12 },
  searchInput: { flex: 1, height: '100%', fontSize: 16, color: '#111827', outlineStyle: 'none' } as any,
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#20B2AA', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  addButtonText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8 },
  
  tableContainer: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', flex: 1, overflow: 'hidden' },
  verticalScroll: { flex: 1 },
  tableInner: { flex: 1, minWidth: 700, paddingBottom: 16 },
  tableHeader: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
  th: { fontSize: 12, fontWeight: 'bold', color: '#6B7280' },
  tableRow: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', alignItems: 'center' },
  cellName: { fontSize: 14, fontWeight: '600', color: '#111827' },
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
  row: { flexDirection: 'row', marginBottom: 8 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, height: 48, fontSize: 16, color: '#111827', outlineStyle: 'none' } as any,
  inputWithIcon: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8 },
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
  
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
});