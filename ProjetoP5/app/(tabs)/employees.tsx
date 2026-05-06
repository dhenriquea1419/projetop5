import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { usePharmacy } from '@/hooks/PharmacyContext';
import { useProducts } from '@/hooks/ProductContext';

export default function EmployeesScreen() {
  const {
    representatives,
    sellers,
    progressCards,
    addRepresentative,
    addSeller,
    addProgressCard,
  } = usePharmacy();
  const { categories } = useProducts();

  const [tipo, setTipo] = useState<'representante' | 'vendedor'>('vendedor');
  const [matricula, setMatricula] = useState('');
  const [rg, setRg] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [salario, setSalario] = useState('');

  // Para representante
  const [dataInicioContrato, setDataInicioContrato] = useState('');
  const [dataFimContrato, setDataFimContrato] = useState('');
  const [categoriasResponsaveis, setCategoriasResponsaveis] = useState<string[]>([]);

  // Para vendedor
  const [percentualComissao, setPercentualComissao] = useState('');
  const [codigoCartao, setCodigoCartao] = useState('');
  const [dataUltimaProgressao, setDataUltimaProgressao] = useState('');
  const [categoriaCartao, setCategoriaCartao] = useState<'Junior' | 'Senior'>('Junior');

  const handleAddEmployee = () => {
    if (!matricula.trim() || !rg.trim() || !nome.trim() || !cpf.trim() || !salario.trim()) {
      alert('Preencha todos os campos básicos do funcionário.');
      return;
    }

    const sal = Number(salario.replace(',', '.'));
    if (Number.isNaN(sal) || sal <= 0) {
      alert('Informe um salário válido.');
      return;
    }

    if (tipo === 'representante') {
      if (!dataInicioContrato.trim() || !dataFimContrato.trim()) {
        alert('Preencha datas de contrato para representante.');
        return;
      }
      if (categoriasResponsaveis.length === 0) {
        alert('Selecione pelo menos uma categoria para o representante.');
        return;
      }

      addRepresentative({
        matricula: matricula.trim(),
        rg: rg.trim(),
        nome: nome.trim(),
        cpf: cpf.trim(),
        salario: sal,
        tipo: 'representante',
        dataInicioContrato: dataInicioContrato.trim(),
        dataFimContrato: dataFimContrato.trim(),
        categoriasResponsaveis,
      });
    } else {
      if (!percentualComissao.trim() || !codigoCartao.trim() || !dataUltimaProgressao.trim()) {
        alert('Preencha comissão e dados do cartão para vendedor.');
        return;
      }

      const comissao = Number(percentualComissao.replace(',', '.'));
      if (Number.isNaN(comissao) || comissao < 0 || comissao > 100) {
        alert('Informe um percentual de comissão válido (0-100).');
        return;
      }

      // Criar cartão primeiro
      const cardId = `pc-${Date.now()}`;
      addProgressCard({
        codigo: codigoCartao.trim(),
        dataUltimaProgressao: dataUltimaProgressao.trim(),
        categoria: categoriaCartao,
        vendedorId: `sell-${Date.now()}`, // será ajustado
      });

      addSeller({
        matricula: matricula.trim(),
        rg: rg.trim(),
        nome: nome.trim(),
        cpf: cpf.trim(),
        salario: sal,
        tipo: 'vendedor',
        percentualComissao: comissao,
        cartaoProgressaoId: cardId,
      });
    }

    // Reset fields
    setMatricula('');
    setRg('');
    setNome('');
    setCpf('');
    setSalario('');
    setDataInicioContrato('');
    setDataFimContrato('');
    setCategoriasResponsaveis([]);
    setPercentualComissao('');
    setCodigoCartao('');
    setDataUltimaProgressao('');
  };

  const toggleCategoria = (catId: string) => {
    setCategoriasResponsaveis((current) =>
      current.includes(catId)
        ? current.filter((id) => id !== catId)
        : [...current, catId]
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Funcionários</Text>
      <Text style={styles.description}>
        Cadastre representantes e vendedores com suas informações específicas.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Novo funcionário</Text>

        <Text style={styles.label}>Tipo</Text>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, tipo === 'vendedor' && styles.typeButtonSelected]}
            onPress={() => setTipo('vendedor')}
          >
            <Text style={[styles.typeButtonText, tipo === 'vendedor' && styles.typeButtonTextSelected]}>
              Vendedor
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, tipo === 'representante' && styles.typeButtonSelected]}
            onPress={() => setTipo('representante')}
          >
            <Text style={[styles.typeButtonText, tipo === 'representante' && styles.typeButtonTextSelected]}>
              Representante
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Matrícula</Text>
        <TextInput
          value={matricula}
          onChangeText={setMatricula}
          style={styles.input}
          placeholder="Ex: VEN001"
        />

        <Text style={styles.label}>RG</Text>
        <TextInput
          value={rg}
          onChangeText={setRg}
          style={styles.input}
          placeholder="Ex: 12.345.678-9"
        />

        <Text style={styles.label}>Nome</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          placeholder="Ex: João Silva"
        />

        <Text style={styles.label}>CPF</Text>
        <TextInput
          value={cpf}
          onChangeText={setCpf}
          style={styles.input}
          placeholder="Ex: 123.456.789-00"
        />

        <Text style={styles.label}>Salário</Text>
        <TextInput
          value={salario}
          onChangeText={setSalario}
          style={styles.input}
          placeholder="Ex: 2500.00"
          keyboardType="decimal-pad"
        />

        {tipo === 'representante' && (
          <>
            <Text style={styles.label}>Data início contrato</Text>
            <TextInput
              value={dataInicioContrato}
              onChangeText={setDataInicioContrato}
              style={styles.input}
              placeholder="Ex: 2024-01-01"
            />

            <Text style={styles.label}>Data fim contrato</Text>
            <TextInput
              value={dataFimContrato}
              onChangeText={setDataFimContrato}
              style={styles.input}
              placeholder="Ex: 2026-12-31"
            />

            <Text style={styles.label}>Categorias responsáveis</Text>
            {categories.length === 0 ? (
              <Text style={styles.emptyText}>Adicione categorias primeiro.</Text>
            ) : (
              <View style={styles.categoryList}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryButton,
                      categoriasResponsaveis.includes(cat.id) && styles.categoryButtonSelected,
                    ]}
                    onPress={() => toggleCategoria(cat.id)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        categoriasResponsaveis.includes(cat.id) && styles.categoryButtonTextSelected,
                      ]}
                    >
                      {cat.codigo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {tipo === 'vendedor' && (
          <>
            <Text style={styles.label}>Percentual comissão (%)</Text>
            <TextInput
              value={percentualComissao}
              onChangeText={setPercentualComissao}
              style={styles.input}
              placeholder="Ex: 5"
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Código do cartão</Text>
            <TextInput
              value={codigoCartao}
              onChangeText={setCodigoCartao}
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

            <Text style={styles.label}>Categoria do cartão</Text>
            <View style={styles.categorySelector}>
              <TouchableOpacity
                style={[styles.categoryOption, categoriaCartao === 'Junior' && styles.categoryOptionSelected]}
                onPress={() => setCategoriaCartao('Junior')}
              >
                <Text style={[styles.categoryOptionText, categoriaCartao === 'Junior' && styles.categoryOptionTextSelected]}>
                  Junior
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryOption, categoriaCartao === 'Senior' && styles.categoryOptionSelected]}
                onPress={() => setCategoriaCartao('Senior')}
              >
                <Text style={[styles.categoryOptionText, categoriaCartao === 'Senior' && styles.categoryOptionTextSelected]}>
                  Senior
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={handleAddEmployee}>
          <Text style={styles.buttonText}>Salvar funcionário</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Funcionários cadastrados</Text>
        {representatives.length === 0 && sellers.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum funcionário cadastrado.</Text>
        ) : (
          <FlatList
            data={[...representatives, ...sellers]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isRep = item.tipo === 'representante';
              const card = isRep ? null : progressCards.find((c) => c.id === (item as any).cartaoProgressaoId);
              return (
                <View style={styles.employeeCard}>
                  <Text style={styles.employeeName}>{item.nome}</Text>
                  <Text style={styles.employeeInfo}>Matrícula: {item.matricula}</Text>
                  <Text style={styles.employeeInfo}>CPF: {item.cpf}</Text>
                  <Text style={styles.employeeInfo}>Salário: R$ {item.salario.toFixed(2)}</Text>
                  <Text style={styles.employeeInfo}>Tipo: {isRep ? 'Representante' : 'Vendedor'}</Text>
                  {isRep ? (
                    <>
                      <Text style={styles.employeeInfo}>Contrato: {(item as any).dataInicioContrato} a {(item as any).dataFimContrato}</Text>
                      <Text style={styles.employeeInfo}>Categorias: {(item as any).categoriasResponsaveis.map((id: string) => categories.find(c => c.id === id)?.codigo).join(', ')}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.employeeInfo}>Comissão: {(item as any).percentualComissao}%</Text>
                      {card && (
                        <Text style={styles.employeeInfo}>Cartão: {card.codigo} - {card.categoria} (última: {card.dataUltimaProgressao})</Text>
                      )}
                    </>
                  )}
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
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
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
    marginBottom: 20,
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
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#2c5aa0',
    borderColor: '#2c5aa0',
  },
  typeButtonText: {
    color: '#4a4a4a',
    fontWeight: '600',
  },
  typeButtonTextSelected: {
    color: '#fff',
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    backgroundColor: '#fff',
  },
  categoryButtonSelected: {
    backgroundColor: '#2c5aa0',
    borderColor: '#2c5aa0',
  },
  categoryButtonText: {
    color: '#4a4a4a',
    fontWeight: '600',
  },
  categoryButtonTextSelected: {
    color: '#fff',
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
  button: {
    marginTop: 18,
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
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
  },
  employeeCard: {
    padding: 14,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f3a72',
  },
  employeeInfo: {
    color: '#334155',
    marginTop: 4,
  },
  list: {
    paddingBottom: 12,
  },
});
