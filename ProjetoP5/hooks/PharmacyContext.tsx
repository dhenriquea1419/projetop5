import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useProducts } from './ProductContext';

export interface Client {
  id: string;
  nome: string;
  cpf: string;
  endereco: string;
  telefone: string;
  profissao?: string;
}

export interface Dependent {
  id: string;
  clienteId: string;
  nome: string;
  dataNascimento: string;
  grauParentesco: string;
}

export interface Employee {
  id: string;
  matricula: string;
  rg: string;
  nome: string;
  cpf: string;
  salario: number;
  tipo: 'vendedor' | 'representante';
}

export interface Representative extends Employee {
  dataInicioContrato: string;
  dataFimContrato: string;
  categoriasResponsaveis: string[]; // ids das categorias
}

export interface Seller extends Employee {
  percentualComissao: number;
  cartaoProgressaoId: string;
}

export interface ProgressCard {
  id: string;
  codigo: string;
  dataUltimaProgressao: string;
  categoria: 'Junior' | 'Senior';
  vendedorId: string;
}

export interface PurchaseItem {
  produtoId: string;
  quantidade: number;
}

export interface Purchase {
  id: string;
  numeroCompra: string;
  dataCompra: string;
  clienteId: string;
  vendedorId: string;
  itens: PurchaseItem[];
}

type ClientCreate = Omit<Client, 'id'>;
type DependentCreate = Omit<Dependent, 'id'>;
type EmployeeCreate = Omit<Employee, 'id'>;
type RepresentativeCreate = Omit<Representative, 'id'>;
type SellerCreate = Omit<Seller, 'id'>;
type ProgressCardCreate = Omit<ProgressCard, 'id'>;
type PurchaseCreate = Omit<Purchase, 'id'>;

interface PharmacyContextType {
  clients: Client[];
  dependents: Dependent[];
  employees: Employee[];
  representatives: Representative[];
  sellers: Seller[];
  progressCards: ProgressCard[];
  purchases: Purchase[];
  addClient: (client: ClientCreate) => void;
  addDependent: (dependent: DependentCreate) => void;
  addEmployee: (employee: EmployeeCreate) => void;
  addRepresentative: (rep: RepresentativeCreate) => void;
  addSeller: (seller: SellerCreate) => void;
  addProgressCard: (card: ProgressCardCreate) => void;
  updateProgressCard: (id: string, updates: Partial<ProgressCard>) => void;
  addPurchase: (purchase: PurchaseCreate) => void;
  findClientById: (id: string) => Client | undefined;
  findEmployeeById: (id: string) => Employee | undefined;
  findPurchaseById: (id: string) => Purchase | undefined;
  getClientDependents: (clientId: string) => Dependent[];
  getEmployeePurchases: (employeeId: string) => Purchase[];
  getClientPurchases: (clientId: string) => Purchase[];
  getProductLabel: (productId: string) => string;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

const initialClients: Client[] = [
  {
    id: 'c1',
    nome: 'João Silva',
    cpf: '123.456.789-00',
    endereco: 'Rua A, 123',
    telefone: '(11) 99999-9999',
    profissao: 'Professor',
  },
];

const initialDependents: Dependent[] = [
  {
    id: 'd1',
    clienteId: 'c1',
    nome: 'Maria Silva',
    dataNascimento: '2010-05-15',
    grauParentesco: 'Filha',
  },
];

const initialEmployees: Employee[] = [];
const initialRepresentatives: Representative[] = [
  {
    id: 'r1',
    matricula: 'REP001',
    rg: '12.345.678-9',
    nome: 'Ana Representante',
    cpf: '987.654.321-00',
    salario: 3500,
    tipo: 'representante',
    dataInicioContrato: '2024-01-01',
    dataFimContrato: '2026-12-31',
    categoriasResponsaveis: ['c1'], // Medicamentos
  },
];

const initialSellers: Seller[] = [
  {
    id: 's1',
    matricula: 'VEN001',
    rg: '98.765.432-1',
    nome: 'Carlos Vendedor',
    cpf: '456.789.123-00',
    salario: 2500,
    tipo: 'vendedor',
    percentualComissao: 5,
    cartaoProgressaoId: 'pc1',
  },
];

const initialProgressCards: ProgressCard[] = [
  {
    id: 'pc1',
    codigo: 'CARD001',
    dataUltimaProgressao: '2024-06-01',
    categoria: 'Junior',
    vendedorId: 's1',
  },
];

const initialPurchases: Purchase[] = [
  {
    id: 'p1',
    numeroCompra: 'COMP001',
    dataCompra: '2024-05-10',
    clienteId: 'c1',
    vendedorId: 's1',
    itens: [
      { produtoId: 'p1', quantidade: 2 },
      { produtoId: 'p2', quantidade: 1 },
    ],
  },
];

export const PharmacyContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [dependents, setDependents] = useState<Dependent[]>(initialDependents);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [representatives, setRepresentatives] = useState<Representative[]>(initialRepresentatives);
  const [sellers, setSellers] = useState<Seller[]>(initialSellers);
  const [progressCards, setProgressCards] = useState<ProgressCard[]>(initialProgressCards);
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);

  const { products } = useProducts();

  const addClient = (client: ClientCreate) => {
    setClients((current) => [
      ...current,
      {
        id: `client-${Date.now()}`,
        ...client,
      },
    ]);
  };

  const addDependent = (dependent: DependentCreate) => {
    setDependents((current) => [
      ...current,
      {
        id: `dep-${Date.now()}`,
        ...dependent,
      },
    ]);
  };

  const addEmployee = (employee: EmployeeCreate) => {
    setEmployees((current) => [
      ...current,
      {
        id: `emp-${Date.now()}`,
        ...employee,
      },
    ]);
  };

  const addRepresentative = (rep: RepresentativeCreate) => {
    setRepresentatives((current) => [
      ...current,
      {
        id: `rep-${Date.now()}`,
        ...rep,
      },
    ]);
  };

  const addSeller = (seller: SellerCreate) => {
    setSellers((current) => [
      ...current,
      {
        id: `sell-${Date.now()}`,
        ...seller,
      },
    ]);
  };

  const addProgressCard = (card: ProgressCardCreate) => {
    setProgressCards((current) => [
      ...current,
      {
        id: `pc-${Date.now()}`,
        ...card,
      },
    ]);
  };

  const addPurchase = (purchase: PurchaseCreate) => {
    setPurchases((current) => [
      ...current,
      {
        id: `pur-${Date.now()}`,
        ...purchase,
      },
    ]);
  };

  const updateProgressCard = (id: string, updates: Partial<ProgressCard>) => {
    setProgressCards((current) =>
      current.map((card) => (card.id === id ? { ...card, ...updates } : card))
    );
  };

  const getProductLabel = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product ? `${product.codigo} - ${product.descricao}` : 'Produto não encontrado';
  };

  const findClientById = (id: string) => clients.find((client) => client.id === id);
  const findEmployeeById = (id: string) => {
    const emp = employees.find((e) => e.id === id);
    if (emp) return emp;
    const rep = representatives.find((r) => r.id === id);
    if (rep) return rep;
    return sellers.find((s) => s.id === id);
  };
  const findPurchaseById = (id: string) => purchases.find((purchase) => purchase.id === id);

  const getClientDependents = (clientId: string) =>
    dependents.filter((dep) => dep.clienteId === clientId);

  const getEmployeePurchases = (employeeId: string) =>
    purchases.filter((pur) => pur.vendedorId === employeeId);

  const getClientPurchases = (clientId: string) =>
    purchases.filter((pur) => pur.clienteId === clientId);

  return (
    <PharmacyContext.Provider
      value={{
        clients,
        dependents,
        employees,
        representatives,
        sellers,
        progressCards,
        purchases,
        addClient,
        addDependent,
        addEmployee,
        addRepresentative,
        addSeller,
        addProgressCard,
        updateProgressCard,
        addPurchase,
        findClientById,
        findEmployeeById,
        findPurchaseById,
        getClientDependents,
        getEmployeePurchases,
        getClientPurchases,
        getProductLabel,
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = (): PharmacyContextType => {
  const context = useContext(PharmacyContext);
  if (context === undefined) {
    throw new Error('usePharmacy must be used within a PharmacyContextProvider');
  }
  return context;
};
