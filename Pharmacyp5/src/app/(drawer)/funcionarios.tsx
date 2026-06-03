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

const CARGOS_OPTIONS = [
  'Vendedor', 'Farmacêutico', 'Gerente', 'Farmacêutico Responsável',
  'Atendente', 'Auxiliar de Farmácia', 'Caixa', 'Entregador',
  'Estoquista', 'Administrativo', 'Supervisor', 'Outro'
];

export default function FuncionariosScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCargoModal, setShowCargoModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<any[]>([]);

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cargo, setCargo] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [salario, setSalario] = useState('');
  const [comissao, setComissao] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
  const [funcionarioAtivo, setFuncionarioAtivo] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      console.log('Aviso:', error.message);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
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

  const handleCurrencyChange = (text: string, setter: (val: string) => void) => {
    const numericValue = text.replace(/\D/g, '');
    if (!numericValue) {
      setter('');
      return;
    }
    const floatValue = (Number(numericValue) / 100).toFixed(2);
    const formatted = floatValue.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    setter(`R$ ${formatted}`);
  };

  const openNewModal = () => {
    setEditingId(null);
    setNome('');
    setCpf('');
    setCargo('');
    setTelefone('');
    setEmail('');
    setSalario('');
    setComissao('');
    setDataAdmissao('');
    setFuncionarioAtivo(true);
    setShowModal(true);
  };

  const handleEdit = (emp: any) => {
    setEditingId(emp.id);
    setNome(emp.nome || '');
    setCpf(emp.cpf || '');
    setCargo(emp.cargo || '');
    setTelefone(emp.telefone || '');
    setEmail(emp.email || '');
    setSalario(emp.salario || '');
    setComissao(emp.comissao || '');
    setDataAdmissao(emp.dataAdmissao || '');
    setFuncionarioAtivo(emp.status === 'ativo');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!nome || !cargo) {
      Alert.alert('Atenção', 'Os campos Nome Completo e Cargo são obrigatórios.');
      return;
    }

    const empData = {
      nome,
      cpf,
      cargo,
      telefone,
      email,
      salario,
      comissao,
      dataadmissao: dataAdmissao,
      status: funcionarioAtivo ? 'ativo' : 'inativo'
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from('employees')
          .update(empData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('employees')
          .insert([empData]);
        if (error) throw error;
      }

      setShowModal(false);
      fetchEmployees();
    } catch (error: any) {
      Alert.alert('Erro ao salvar', error.message);
    }
  };

  const confirmDelete = (emp: any) => {
    setEmployeeToDelete(emp);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!employeeToDelete) return;
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeToDelete.id);
      if (error) throw error;

      setShowDeleteModal(false);
      setEmployeeToDelete(null);
      fetchEmployees();
    } catch (error: any) {
      Alert.alert('Erro ao excluir', error.message);
    }
  };

  const filteredEmployees = employees.filter(e => {
    const q = searchQuery.toLowerCase();
    return (
      (e.nome && e.nome.toLowerCase().includes(q)) ||
      (e.cargo && e.cargo.toLowerCase().includes(q)) ||
      (e.telefone && e.telefone.includes(q))
    );
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.loadingContainer, { flex: 1 }]}>
          <Text style={styles.emptyText}>Carregando funcionários...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Funcionários</Text>
        <Text style={styles.subtitle}>Gerenciar equipe da farmácia</Text>
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
          <Text style={styles.addButtonText}>Novo Funcionário</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableContainer}>
        <ScrollView style={styles.verticalScroll} showsVerticalScrollIndicator={false}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.tableInner}>
              <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 2.5 }]}>NOME</Text>
                <Text style={[styles.th, { flex: 1.8 }]}>CARGO</Text>
                <Text style={[styles.th, { flex: 1.8 }]}>TELEFONE</Text>
                <Text style={[styles.th, { flex: 1 }]}>STATUS</Text>
                <Text style={[styles.th, { width: 100, textAlign: 'center' }]}>AÇÕES</Text>
              </View>

              {filteredEmployees.length === 0 ? (
                <View style={styles.emptyState}>
                  <Feather name="users" size={48} color="#D1D5DB" />
                  <Text style={styles.emptyTitle}>Nenhum funcionário cadastrado</Text>
                  <Text style={styles.emptyText}>Clique em "Novo Funcionário" para começar.</Text>
                </View>
              ) : (
                filteredEmployees.map((item) => (
                  <View key={item.id} style={styles.tableRow}>
                    <View style={{ flex: 2.5, paddingRight: 12 }}>
                      <Text style={styles.cellName}>{item.nome}</Text>
                    </View>
                    <View style={{ flex: 1.8 }}>
                      <View style={[styles.cargoBadge]}>
                        <Text style={styles.cargoBadgeText}>{item.cargo || '-'}</Text>
                      </View>
                    </View>
                    <Text style={[styles.cell, { flex: 1.8 }]}>{item.telefone || '-'}</Text>
                    <View style={{ flex: 1 }}>
                      <View style={[styles.statusBadge, item.status === 'inativo' && { backgroundColor: '#FEE2E2' }]}>
                        <Text style={[styles.statusText, item.status === 'inativo' && { color: '#991B1B' }]}>
                          {item.status === 'ativo' ? 'Ativo' : 'Inativo'}
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

      {/* MODAL NOVO/EDITAR FUNCIONÁRIO */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Editar Funcionário' : 'Novo Funcionário'}</Text>
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

              {/* Cargo */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cargo *</Text>
                <TouchableOpacity style={styles.selectInput} onPress={() => setShowCargoModal(true)}>
                  <Text style={{ color: cargo ? '#111827' : '#9CA3AF', flex: 1 }}>
                    {cargo || 'Selecione'}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* E-mail */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="email@exemplo.com" keyboardType="email-address" />
              </View>

              {/* Salário + Comissão lado a lado */}
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Salário (R$)</Text>
                  <TextInput 
                    style={styles.input} 
                    value={salario} 
                    onChangeText={(text) => handleCurrencyChange(text, setSalario)} 
                    placeholder="R$ 0,00" 
                    keyboardType="numeric" 
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Comissão (%)</Text>
                  <TextInput 
                    style={styles.input} 
                    value={comissao} 
                    onChangeText={setComissao} 
                    placeholder="0" 
                    keyboardType="numeric" 
                  />
                </View>
              </View>

              {/* Data de Admissão */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Data de Admissão</Text>
                <View style={styles.inputWithIcon}>
                  <TextInput 
                    style={[styles.input, { flex: 1, borderWidth: 0 }]} 
                    value={dataAdmissao} 
                    onChangeText={(t) => setDataAdmissao(maskDate(t))} 
                    placeholder="dd/mm/aaaa" 
                    keyboardType="numeric" 
                  />
                  <Feather name="calendar" size={20} color="#6B7280" style={{ marginRight: 12 }} />
                </View>
              </View>

              {/* Toggle Funcionário Ativo */}
              <View style={styles.switchContainer}>
                <View>
                  <Text style={styles.switchLabel}>Funcionário ativo</Text>
                  <Text style={styles.switchSubLabel}>Funcionário disponível no sistema</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.switch, funcionarioAtivo ? styles.switchActive : styles.switchInactive]} 
                  onPress={() => setFuncionarioAtivo(!funcionarioAtivo)}
                >
                  <View style={[styles.switchThumb, funcionarioAtivo ? styles.thumbActive : styles.thumbInactive]} />
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

      {/* MODAL SELECIONAR CARGO */}
      <Modal visible={showCargoModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.selectModalContent, { maxHeight: '60%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o Cargo</Text>
              <TouchableOpacity onPress={() => setShowCargoModal(false)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.selectList} keyboardShouldPersistTaps="handled">
              {CARGOS_OPTIONS.map((opt, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.selectItem}
                  onPress={() => {
                    setCargo(opt);
                    setShowCargoModal(false);
                  }}
                >
                  <Text style={[styles.selectItemText, cargo === opt && { color: '#20B2AA', fontWeight: 'bold' }]}>
                    {opt}
                  </Text>
                  {cargo === opt && <Feather name="check" size={20} color="#20B2AA" />}
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
            <Text style={styles.deleteTitle}>Excluir Funcionário</Text>
            <Text style={styles.deleteText}>
              Tem certeza que deseja excluir o funcionário <Text style={{fontWeight: 'bold'}}>{employeeToDelete?.nome}</Text>?
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
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: '#E5E7EB', marginRight: 12, overflow: 'hidden' },
  searchInput: { flex: 1, height: '100%', width: '100%', fontSize: 16, color: '#111827', outlineStyle: 'none' } as any,
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#20B2AA', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  addButtonText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8 },
  
  tableContainer: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', flex: 1, overflow: 'hidden' },
  verticalScroll: { flex: 1 },
  tableInner: { flex: 1, minWidth: 800, paddingBottom: 16 },
  tableHeader: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
  th: { fontSize: 12, fontWeight: 'bold', color: '#6B7280' },
  tableRow: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', alignItems: 'center' },
  cellName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  cell: { fontSize: 14, color: '#111827' },
  
  cargoBadge: { backgroundColor: '#EBF5FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  cargoBadgeText: { color: '#1E40AF', fontSize: 12, fontWeight: '600' },

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