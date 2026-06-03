import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../../services/supabase';
import { Ionicons } from '@expo/vector-icons';

interface ItemVenda {
  id: string;
  produto_id: string;
  produto_nome: string;
  qtd: number;
  preco_unit: number;
  subtotal: number;
}

interface Cliente {
  id: string;
  nome: string;
  cidade: string;
}

interface Vendedor {
  id: string;
  nome: string;
  cargo: string;
}

interface Produto {
  id: string;
  name: string;
  category: string;
  price: number;
}

type FormaPagamento = 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'PIX';

const FORMAS_PAGAMENTO: FormaPagamento[] = [
  'Dinheiro',
  'Cartão de Crédito',
  'Cartão de Débito',
  'PIX'
];

const NovaVendaScreen: React.FC = () => {
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [vendedorSelecionado, setVendedorSelecionado] = useState<Vendedor | null>(null);
  const [itens, setItens] = useState<ItemVenda[]>([]);
  const [desconto, setDesconto] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento | null>(null);
  const [observacoes, setObservacoes] = useState('');

  // Estados de pagamento
  const [pagandoComCartao, setPagandoComCartao] = useState(false);
  const [valorRecebido, setValorRecebido] = useState('');
  const [numeroCartao, setNumeroCartao] = useState('');
  const [nomeCartao, setNomeCartao] = useState('');
  const [validadeCartao, setValidadeCartao] = useState('');
  const [cvvCartao, setCvvCartao] = useState('');
  const [parcelas, setParcelas] = useState(1);
  const [qrCodePix, setQrCodePix] = useState('');
  const [codigoPix, setCodigoPix] = useState('');
  const [gerandoPix, setGerandoPix] = useState(false);

  const [modalClientesVisible, setModalClientesVisible] = useState(false);
  const [modalVendedoresVisible, setModalVendedoresVisible] = useState(false);
  const [modalProdutosVisible, setModalProdutosVisible] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [buscaCliente, setBuscaCliente] = useState('');
  const [buscaVendedor, setBuscaVendedor] = useState('');
  const [buscaProduto, setBuscaProduto] = useState('');
  const [adicionandoItem, setAdicionandoItem] = useState(false);
  const [novoProduto, setNovoProduto] = useState<Produto | null>(null);
  const [novaQtd, setNovaQtd] = useState('1');
  const [novoPreco, setNovoPreco] = useState('');

  useEffect(() => {
    fetchClientes();
    fetchVendedores();
    fetchProdutos();
  }, []);

  const fetchClientes = async () => {
    const { data, error } = await supabase.from('clients').select('*');
    if (!error && data) setClientes(data);
  };

  const fetchVendedores = async () => {
    const { data, error } = await supabase.from('employees').select('*').eq('status', 'ativo');
    if (!error && data) setVendedores(data);
  };

  const fetchProdutos = async () => {
    const { data, error } = await supabase.from('products').select('*').eq('status', 'Ativo');
    if (!error && data) setProdutos(data);
  };

  const handleCurrencyChange = (text: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    let cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned === '') { setter(''); return; }
    let intValue = parseInt(cleaned, 10);
    let formatted = (intValue / 100).toFixed(2);
    formatted = formatted.replace('.', ',');
    setter(`R$ ${formatted}`);
  };

  const parseCurrency = (value: string): number => {
    const cleaned = value.replace(/[^0-9,]/g, '').replace(',', '.');
    const number = parseFloat(cleaned);
    return isNaN(number) ? 0 : number;
  };

  const getSubtotalItens = useCallback(() => {
    return itens.reduce((acc, item) => acc + item.subtotal, 0);
  }, [itens]);

  const getTotal = useCallback(() => {
    const subtotal = getSubtotalItens();
    const descontoValue = parseCurrency(desconto);
    return subtotal - descontoValue;
  }, [getSubtotalItens, desconto]);

  const troco = (() => {
    const recebido = parseCurrency(valorRecebido);
    const total = getTotal();
    return recebido - total;
  })();

  // Formatadores de cartão
  const formatarNumeroCartao = (text: string) => {
    const cleaned = text.replace(/\D/g, '').substring(0, 16);
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    setNumeroCartao(formatted);
  };

  const formatarValidade = (text: string) => {
    const cleaned = text.replace(/\D/g, '').substring(0, 4);
    if (cleaned.length > 2) {
      setValidadeCartao(cleaned.substring(0, 2) + '/' + cleaned.substring(2));
    } else {
      setValidadeCartao(cleaned);
    }
  };

  // Geração de QR Code PIX (Mercado Pago)
  const gerarQrCodePix = async () => {
    setGerandoPix(true);
    try {
      const txid = `OMNISTOCK${Date.now()}`;
      const payload = `00020101021226880014br.gov.bcb.pix2556api.mercadopago.com/instore/orders/pix/${txid}5204000053039865406${getTotal().toFixed(2)}5802BR5913OmniStock6008Sao Paulo62070503***6304`;
      setQrCodePix(payload);
      setCodigoPix(payload);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o QR Code PIX.');
    } finally {
      setGerandoPix(false);
    }
  };

  const adicionarItem = () => {
    if (!novoProduto) { Alert.alert('Atenção', 'Selecione um produto.'); return; }
    const qtd = parseInt(novaQtd, 10);
    if (isNaN(qtd) || qtd <= 0) { Alert.alert('Atenção', 'Quantidade inválida.'); return; }
    const preco = parseCurrency(novoPreco);
    if (preco <= 0) { Alert.alert('Atenção', 'Preço inválido.'); return; }
    const novoItem: ItemVenda = {
      id: Date.now().toString(),
      produto_id: novoProduto.id,
      produto_nome: novoProduto.name,
      qtd,
      preco_unit: preco,
      subtotal: qtd * preco
    };
    setItens([...itens, novoItem]);
    setAdicionandoItem(false);
    setNovoProduto(null);
    setNovaQtd('1');
    setNovoPreco('');
  };

  const removerItem = (id: string) => {
    setItens(itens.filter(item => item.id !== id));
  };

  const handleFinalizar = async () => {
    if (!clienteSelecionado) { Alert.alert('Atenção', 'Selecione um cliente.'); return; }
    if (itens.length === 0) { Alert.alert('Atenção', 'Adicione pelo menos um item.'); return; }
    if (!formaPagamento) { Alert.alert('Atenção', 'Selecione uma forma de pagamento.'); return; }

    const subtotal = getSubtotalItens();
    const total = getTotal();

    const dadosVenda = {
      cliente_id: clienteSelecionado.id,
      cliente_nome: clienteSelecionado.nome,
      vendedor_id: vendedorSelecionado?.id || null,
      vendedor_nome: vendedorSelecionado?.nome || null,
      items: itens,
      subtotal,
      desconto: parseCurrency(desconto),
      total,
      forma_pagamento: formaPagamento,
      observacoes,
      status: 'finalizada'
    };

    const { error } = await supabase.from('sales').insert([dadosVenda]);
    if (error) { Alert.alert('Erro', 'Não foi possível finalizar a venda.'); return; }
    Alert.alert('Sucesso', 'Venda finalizada com sucesso!');
    limparFormulario();
  };

  const limparFormulario = () => {
    setClienteSelecionado(null);
    setVendedorSelecionado(null);
    setItens([]);
    setDesconto('');
    setFormaPagamento(null);
    setObservacoes('');
    setAdicionandoItem(false);
    setNovoProduto(null);
    setNovaQtd('1');
    setNovoPreco('');
    setValorRecebido('');
    setPagandoComCartao(false);
    setNumeroCartao('');
    setNomeCartao('');
    setValidadeCartao('');
    setCvvCartao('');
    setParcelas(1);
    setQrCodePix('');
    setCodigoPix('');
  };

  const renderModalSelecao = ({
    visible, onClose, title, data, search, setSearch, renderItem
  }: {
    visible: boolean;
    onClose: () => void;
    title: string;
    data: any[];
    search: string;
    setSearch: (text: string) => void;
    renderItem: (item: any) => React.JSX.Element;
  }) => (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.selectModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <TextInput style={styles.searchInput} placeholder="Buscar..." value={search} onChangeText={setSearch} />
          <FlatList
            data={data.filter(item => (item.name || item.nome)?.toLowerCase().includes(search.toLowerCase()))}
            keyExtractor={item => item.id}
            renderItem={({ item }) => renderItem(item)}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Nova Venda</Text>
          <Text style={styles.subtitle}>Registrar uma nova venda</Text>
        </View>

        {/* Card 1 - Informações da Venda */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informações da Venda</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Cliente</Text>
            <TouchableOpacity style={styles.selectInput} onPress={() => setModalClientesVisible(true)}>
              <Text style={[styles.inputText, !clienteSelecionado && { color: '#9CA3AF' }]}>
                {clienteSelecionado ? clienteSelecionado.nome : 'Selecione um cliente'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Vendedor</Text>
            <TouchableOpacity style={styles.selectInput} onPress={() => setModalVendedoresVisible(true)}>
              <Text style={[styles.inputText, !vendedorSelecionado && { color: '#9CA3AF' }]}>
                {vendedorSelecionado ? vendedorSelecionado.nome : 'Selecione um vendedor'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 2 - Itens da Venda */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={styles.cardTitle}>Itens da Venda</Text>
            <TouchableOpacity style={styles.addButtonItem} onPress={() => setAdicionandoItem(true)}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>+ Adicionar Item</Text>
            </TouchableOpacity>
          </View>

          {adicionandoItem && (
            <View style={{ marginBottom: 16, backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8 }}>
              <Text style={styles.label}>Produto</Text>
              <TouchableOpacity style={[styles.selectInput, { marginBottom: 12 }]} onPress={() => setModalProdutosVisible(true)}>
                <Text style={[styles.inputText, !novoProduto && { color: '#9CA3AF' }]}>
                  {novoProduto ? novoProduto.name : 'Selecione...'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.label}>Qtd</Text>
                  <TextInput style={styles.input} keyboardType="numeric" value={novaQtd} onChangeText={text => setNovaQtd(text.replace(/[^0-9]/g, ''))} />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.label}>Preço Unit.</Text>
                  <TextInput style={styles.input} keyboardType="numeric" value={novoPreco} onChangeText={text => handleCurrencyChange(text, setNovoPreco)} />
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                <TouchableOpacity style={styles.trashButton} onPress={() => setAdicionandoItem(false)}>
                  <Text style={{ color: '#EF4444' }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.addButtonItem, { marginLeft: 8 }]} onPress={adicionarItem}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {itens.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
              <Ionicons name="cart-outline" size={48} color="#D1D5DB" />
              <Text style={{ color: '#9CA3AF', marginTop: 16 }}>Nenhum item adicionado</Text>
            </View>
          ) : (
            itens.map(item => (
              <View key={item.id} style={styles.itemRow}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#111827', flex: 1 }}>{item.produto_nome}</Text>
                  <TouchableOpacity style={styles.trashButton} onPress={() => removerItem(item.id)}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                  <Text style={{ color: '#6B7280' }}>Qtd: {item.qtd}</Text>
                  <Text style={{ color: '#6B7280' }}>Preço Unit: R$ {item.preco_unit.toFixed(2).replace('.', ',')}</Text>
                </View>
                <Text style={{ textAlign: 'right', color: '#111827', fontWeight: 'bold', marginTop: 4 }}>
                  Subtotal: R$ {item.subtotal.toFixed(2).replace('.', ',')}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Card 3 - Resumo */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: '#6B7280' }}>Subtotal</Text>
            <Text style={{ color: '#111827' }}>R$ {getSubtotalItens().toFixed(2).replace('.', ',')}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ color: '#6B7280' }}>Desconto (R$)</Text>
            <TextInput style={[styles.input, { width: 150, textAlign: 'right' }]} keyboardType="numeric" value={desconto} onChangeText={text => handleCurrencyChange(text, setDesconto)} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: '#111827', fontWeight: 'bold' }}>Total</Text>
            <Text style={styles.totalValue}>R$ {getTotal().toFixed(2).replace('.', ',')}</Text>
          </View>
        </View>

        {/* Card 4 - Pagamento */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pagamento</Text>

          {/* Botões de seleção */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
            {FORMAS_PAGAMENTO.map(forma => (
              <TouchableOpacity
                key={forma}
                style={[
                  { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB', marginRight: 8, marginBottom: 8 },
                  formaPagamento === forma && {
                    backgroundColor: forma === 'Dinheiro' ? '#20B2AA' : forma === 'PIX' ? '#7C3AED' : '#3B82F6',
                    borderColor: forma === 'Dinheiro' ? '#20B2AA' : forma === 'PIX' ? '#7C3AED' : '#3B82F6'
                  }
                ]}
                onPress={() => {
                  setFormaPagamento(forma);
                  setPagandoComCartao(forma === 'Cartão de Crédito' || forma === 'Cartão de Débito');
                  if (forma === 'PIX') { setQrCodePix(''); setCodigoPix(''); }
                }}
              >
                <Text style={[{ fontSize: 14, color: '#374151' }, formaPagamento === forma && { color: '#FFF' }]}>
                  {forma}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* DINHEIRO */}
          {formaPagamento === 'Dinheiro' && (
            <View style={{ backgroundColor: '#F0FFF4', borderWidth: 1, borderColor: '#20B2AA', borderRadius: 8, padding: 12, marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 8 }}>Pagamento em Dinheiro</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Valor Recebido R$</Text>
              <TextInput
                style={[styles.input, { marginBottom: 4 }]}
                keyboardType="numeric"
                value={valorRecebido}
                onChangeText={text => handleCurrencyChange(text, setValorRecebido)}
                placeholder="R$ 0,00"
              />
              {valorRecebido !== '' && parseCurrency(valorRecebido) > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Text style={{ fontSize: 16, color: '#374151', fontWeight: '600' }}>Troco: </Text>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: troco < 0 ? '#DC2626' : '#16A34A' }}>
                    R$ {troco.toFixed(2).replace('.', ',')}
                  </Text>
                  {troco < 0 && (
                    <Text style={{ fontSize: 14, color: '#DC2626', marginLeft: 8 }}>Valor insuficiente</Text>
                  )}
                </View>
              )}
            </View>
          )}

          {/* CARTÃO */}
          {(formaPagamento === 'Cartão de Crédito' || formaPagamento === 'Cartão de Débito') && pagandoComCartao && (
            <View style={{ backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#3B82F6', borderRadius: 8, padding: 12, marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 8 }}>Dados do Cartão</Text>
              <Text style={styles.label}>Número do Cartão</Text>
              <TextInput style={[styles.input, { marginBottom: 8 }]} keyboardType="numeric" value={numeroCartao}
                onChangeText={formatarNumeroCartao} placeholder="0000 0000 0000 0000" maxLength={19} />
              <Text style={styles.label}>Nome do Titular</Text>
              <TextInput style={[styles.input, { marginBottom: 8 }]} value={nomeCartao}
                onChangeText={setNomeCartao} placeholder="Nome como está no cartão" />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.label}>Validade</Text>
                  <TextInput style={[styles.input, { marginBottom: 8 }]} keyboardType="numeric" value={validadeCartao}
                    onChangeText={formatarValidade} placeholder="MM/AA" maxLength={5} />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput style={[styles.input, { marginBottom: 8 }]} keyboardType="numeric" value={cvvCartao}
                    onChangeText={text => setCvvCartao(text.replace(/\D/g, '').substring(0, 4))}
                    placeholder="123" maxLength={4} secureTextEntry />
                </View>
              </View>
              {formaPagamento === 'Cartão de Crédito' && (
                <View style={{ marginTop: 8 }}>
                  <Text style={styles.label}>Parcelas</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => {
                      const valorParcela = getTotal() / num;
                      return (
                        <TouchableOpacity key={num}
                          style={[{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1, borderColor: '#D1D5DB', marginRight: 6, marginBottom: 6 },
                            parcelas === num && { backgroundColor: '#3B82F6', borderColor: '#3B82F6' }]}
                          onPress={() => setParcelas(num)}>
                          <Text style={[{ fontSize: 12, color: '#374151' }, parcelas === num && { color: '#FFF' }]}>
                            {num}x R$ {valorParcela.toFixed(2).replace('.', ',')}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* PIX */}
          {formaPagamento === 'PIX' && (
            <View style={{ backgroundColor: '#F5F3FF', borderWidth: 1, borderColor: '#7C3AED', borderRadius: 8, padding: 12, marginBottom: 12, alignItems: 'center' }}>
              <Ionicons name="qr-code" size={32} color="#7C3AED" />
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#374151', marginTop: 8, marginBottom: 8 }}>Pagamento via PIX</Text>
              {!qrCodePix ? (
                <TouchableOpacity style={{ backgroundColor: '#7C3AED', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 }}
                  onPress={gerarQrCodePix} disabled={gerandoPix}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{gerandoPix ? 'Gerando...' : 'Gerar QR Code PIX'}</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ width: '100%', alignItems: 'center' }}>
                  <View style={{ width: 200, height: 200, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
                    <Text style={{ color: '#6B7280', textAlign: 'center', padding: 16 }}>QR Code gerado!</Text>
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 4 }}>Código Copia e Cola:</Text>
                  <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 8 }]} value={codigoPix} editable={false} multiline />
                  <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>Configure o token do Mercado Pago</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Observações</Text>
            <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top', paddingTop: 12 }]}
              multiline numberOfLines={4} value={observacoes} onChangeText={setObservacoes} />
          </View>
        </View>

        {/* Botão Finalizar */}
        <TouchableOpacity style={styles.finalizarButton} onPress={handleFinalizar}>
          <Ionicons name="checkmark-circle" size={24} color="#FFF" />
          <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 8 }}>Finalizar Venda</Text>
        </TouchableOpacity>

        {/* Modais */}
        {renderModalSelecao({
          visible: modalClientesVisible,
          onClose: () => setModalClientesVisible(false),
          title: 'Selecionar Cliente',
          data: clientes,
          search: buscaCliente,
          setSearch: setBuscaCliente,
          renderItem: (cliente: Cliente) => (
            <TouchableOpacity style={[styles.modalItem, clienteSelecionado?.id === cliente.id && { backgroundColor: '#E0F2FE' }]}
              onPress={() => { setClienteSelecionado(cliente); setModalClientesVisible(false); }}>
              <View>
                <Text style={{ fontWeight: 'bold', color: '#111827' }}>{cliente.nome}</Text>
                <Text style={{ color: '#6B7280' }}>{cliente.cidade}</Text>
              </View>
              {clienteSelecionado?.id === cliente.id && <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />}
            </TouchableOpacity>
          )
        })}

        {renderModalSelecao({
          visible: modalVendedoresVisible,
          onClose: () => setModalVendedoresVisible(false),
          title: 'Selecionar Vendedor',
          data: vendedores,
          search: buscaVendedor,
          setSearch: setBuscaVendedor,
          renderItem: (vendedor: Vendedor) => (
            <TouchableOpacity style={[styles.modalItem, vendedorSelecionado?.id === vendedor.id && { backgroundColor: '#E0F2FE' }]}
              onPress={() => { setVendedorSelecionado(vendedor); setModalVendedoresVisible(false); }}>
              <View>
                <Text style={{ fontWeight: 'bold', color: '#111827' }}>{vendedor.nome}</Text>
                <Text style={{ color: '#6B7280' }}>{vendedor.cargo}</Text>
              </View>
              {vendedorSelecionado?.id === vendedor.id && <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />}
            </TouchableOpacity>
          )
        })}

        {renderModalSelecao({
          visible: modalProdutosVisible,
          onClose: () => setModalProdutosVisible(false),
          title: 'Selecionar Produto',
          data: produtos,
          search: buscaProduto,
          setSearch: setBuscaProduto,
          renderItem: (produto: Produto) => (
            <TouchableOpacity style={[styles.modalItem, novoProduto?.id === produto.id && { backgroundColor: '#E0F2FE' }]}
              onPress={() => { setNovoProduto(produto); setNovoPreco(`R$ ${produto.price.toFixed(2).replace('.', ',')}`); setModalProdutosVisible(false); }}>
              <View>
                <Text style={{ fontWeight: 'bold', color: '#111827' }}>{produto.name}</Text>
                <Text style={{ color: '#6B7280' }}>{produto.category} - R$ {produto.price.toFixed(2).replace('.', ',')}</Text>
              </View>
              {novoProduto?.id === produto.id && <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />}
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 24 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  card: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  fieldContainer: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, height: 48, fontSize: 16, color: '#111827' },
  selectInput: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, height: 48, fontSize: 16, color: '#111827', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputText: { fontSize: 16, color: '#111827' },
  addButtonItem: { backgroundColor: '#20B2AA', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  itemRow: { backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  trashButton: { padding: 8 },
  finalizarButton: { backgroundColor: '#20B2AA', borderRadius: 12, height: 56, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  totalValue: { fontSize: 28, fontWeight: 'bold', color: '#20B2AA' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  selectModalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, marginTop: 'auto', height: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  searchInput: { backgroundColor: '#F3F4F6', borderRadius: 8, height: 48, paddingHorizontal: 16, fontSize: 16, marginBottom: 16 },
  modalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
});

export default NovaVendaScreen;