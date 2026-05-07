import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { usePharmacy } from '@/hooks/PharmacyContext';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StandardButton } from '@/components/ui/StandardButton';
import { StandardFooter } from '@/components/ui/StandardFooter';

export default function ProgressCardsScreen() {
  const {
    sellers,
    progressCards,
    addProgressCard,
    updateProgressCard,
    findEmployeeById,
  } = usePharmacy();

  const [codigo, setCodigo] = useState('');
  const [dataUltimaProgressao, setDataUltimaProgressao] = useState('');
  const [categoria, setCategoria] = useState<'Junior' | 'Senior'>('Junior');
  const [vendedorId, setVendedorId] = useState('');
  const [editingCard, setEditingCard] = useState<string | null>(null);

  const handleAddOrUpdateCard = () => {
    if (!codigo.trim() || !dataUltimaProgressao.trim() || !vendedorId) {
      alert('Preencha código, data e selecione vendedor.');
      return;
    }

    if (editingCard) {
      updateProgressCard(editingCard, {
        codigo: codigo.trim(),
        dataUltimaProgressao: dataUltimaProgressao.trim(),
        categoria,
        vendedorId,
      });
      setEditingCard(null);
    } else {
      addProgressCard({
        codigo: codigo.trim(),
        dataUltimaProgressao: dataUltimaProgressao.trim(),
        categoria,
        vendedorId,
      });
    }

    setCodigo('');
    setDataUltimaProgressao('');
    setCategoria('Junior');
    setVendedorId('');
  };

  const handleEditCard = (card: any) => {
    setEditingCard(card.id);
    setCodigo(card.codigo);
    setDataUltimaProgressao(card.dataUltimaProgressao);
    setCategoria(card.categoria);
    setVendedorId(card.vendedorId);
  };

  const handleCancelEdit = () => {
    setEditingCard(null);
    setCodigo('');
    setDataUltimaProgressao('');
    setCategoria('Junior');
    setVendedorId('');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <ScreenHeader
        title="Cartões de Progressão"
        subtitle="Gerencie cartões dos vendedores"
        icon="⭐"
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {editingCard ? 'Editar cartão' : 'Novo cartão'}
        </Text>

        <Text style={styles.label}>Código</Text>
        <TextInput
          value={codigo}
          onChangeText={setCodigo}
          style={styles.input}
          placeholder="Ex: CARD001"
        />

        <Text style={styles.label}>Data última progressão</Text>
        <TextInput
          value={dataUltimaProgressao}
          onChangeText={setDataUltimaProgressao}
          style={styles.input}
          placeholder="Ex: 2024-06-01"
        />

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categorySelector}>
          <TouchableOpacity
            style={[styles.categoryOption, categoria === 'Junior' && styles.categoryOptionSelected]}
            onPress={() => setCategoria('Junior')}
          >
            <Text style={[styles.categoryOptionText, categoria === 'Junior' && styles.categoryOptionTextSelected]}>
              Junior
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.categoryOption, categoria === 'Senior' && styles.categoryOptionSelected]}
            onPress={() => setCategoria('Senior')}
          >
            <Text style={[styles.categoryOptionText, categoria === 'Senior' && styles.categoryOptionTextSelected]}>
              Senior
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Vendedor</Text>
        {sellers.length === 0 ? (
          <Text style={styles.emptyText}>Adicione vendedores primeiro.</Text>
        ) : (
          <View style={styles.sellerList}>
            {sellers.map((seller) => (
              <TouchableOpacity
                key={seller.id}
                style={[
                  styles.sellerButton,
                  vendedorId === seller.id && styles.sellerButtonSelected,
                ]}
                onPress={() => setVendedorId(seller.id)}
              >
                <Text
                  style={[
                    styles.sellerButtonText,
                    vendedorId === seller.id && styles.sellerButtonTextSelected,
                  ]}
                >
                  {seller.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.buttonRow}>
          <StandardButton
            text={editingCard ? 'Atualizar cartão' : 'Salvar cartão'}
            onPress={handleAddOrUpdateCard}
            variant="primary"
          />
          {editingCard && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cartões cadastrados</Text>
        {progressCards.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum cartão cadastrado.</Text>
        ) : (
          <FlatList
            data={progressCards}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const seller = findEmployeeById(item.vendedorId);
              return (
                <View style={styles.cardItem}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardCode}>{item.codigo}</Text>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEditCard(item)}
                    >
                      <Text style={styles.editButtonText}>Editar</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.cardInfo}>Categoria: {item.categoria}</Text>
                  <Text style={styles.cardInfo}>Última progressão: {item.dataUltimaProgressao}</Text>
                  <Text style={styles.cardInfo}>Vendedor: {seller?.nome || 'Não encontrado'}</Text>
                </View>
              );
            }}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
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
    color: '#2c5aa0',
    marginBottom: 4,
  },
  description: {
    color: '#4a4a4a',
    marginBottom: 24,
    fontSize: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 0,
    marginBottom: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f3a72',
    marginBottom: 14,
  },
  label: {
    color: '#606060',
    marginBottom: 8,
    marginTop: 10,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d6d6d6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
    color: '#222',
  },
  categorySelector: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  categoryOptionSelected: {
    backgroundColor: '#2c5aa0',
    borderColor: '#2c5aa0',
  },
  categoryOptionText: {
    color: '#4a4a4a',
    fontWeight: '600',
  },
  categoryOptionTextSelected: {
    color: '#fff',
  },
  sellerList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sellerButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    backgroundColor: '#fff',
  },
  sellerButtonSelected: {
    backgroundColor: '#2c5aa0',
    borderColor: '#2c5aa0',
  },
  sellerButtonText: {
    color: '#4a4a4a',
    fontWeight: '600',
  },
  sellerButtonTextSelected: {
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  button: {
    flex: 1,
    backgroundColor: '#2c5aa0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
  },
  cardItem: {
    padding: 14,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f3a72',
  },
  editButton: {
    backgroundColor: '#dbeafe',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  cardInfo: {
    color: '#334155',
    marginTop: 4,
  },
  list: {
    paddingBottom: 12,
  },
});
