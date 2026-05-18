import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Category {
  id: string;
  codigo: string;
  descricao: string;
}

export interface ProductComposition {
  produtoId: string;
  quantidade: number;
}

export interface Product {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  valorUnitario: number;
  categoriaId: string;
  componentes: ProductComposition[];
}

type ProductCreate = Omit<Product, 'id'>;
type CategoryCreate = Omit<Category, 'id'>;

interface ProductContextType {
  categories: Category[];
  products: Product[];
  addCategory: (category: CategoryCreate) => void;
  addProduct: (product: ProductCreate) => void;
  findCategoryById: (id: string) => Category | undefined;
  findProductById: (id: string) => Product | undefined;
  getProductLabel: (id: string) => string;
  getProductComponents: (product: Product) => { produto: Product; quantidade: number }[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const initialCategories: Category[] = [
  { id: 'c1', codigo: 'MED', descricao: 'Medicamentos' },
  { id: 'c2', codigo: 'COS', descricao: 'Cosméticos' },
];

const initialProducts: Product[] = [
  {
    id: 'p1',
    codigo: 'PARA',
    descricao: 'Paracetamol 500mg',
    unidade: 'mg',
    valorUnitario: 2.5,
    categoriaId: 'c1',
    componentes: [],
  },
  {
    id: 'p2',
    codigo: 'CREM',
    descricao: 'Creme Hidratante',
    unidade: 'un',
    valorUnitario: 18.9,
    categoriaId: 'c2',
    componentes: [],
  },
  {
    id: 'p3',
    codigo: 'KITB',
    descricao: 'Kit Bem-Estar',
    unidade: 'kit',
    valorUnitario: 38.5,
    categoriaId: 'c2',
    componentes: [
      { produtoId: 'p1', quantidade: 2 },
      { produtoId: 'p2', quantidade: 1 },
    ],
  },
];

export const ProductContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addCategory = (category: CategoryCreate) => {
    setCategories((current) => [
      ...current,
      {
        id: `c-${Date.now()}`,
        ...category,
      },
    ]);
  };

  const addProduct = (product: ProductCreate) => {
    setProducts((current) => [
      ...current,
      {
        id: `p-${Date.now()}`,
        ...product,
      },
    ]);
  };

  const findCategoryById = (id: string) => categories.find((category) => category.id === id);

  const findProductById = (id: string) => products.find((product) => product.id === id);

  const getProductLabel = (id: string) => {
    const product = findProductById(id);
    return product ? `${product.codigo} - ${product.descricao}` : 'Produto desconhecido';
  };

  const getProductComponents = (product: Product) => {
    return product.componentes
      .map((item) => {
        const produto = findProductById(item.produtoId);
        return produto ? { produto, quantidade: item.quantidade } : undefined;
      })
      .filter((item): item is { produto: Product; quantidade: number } => Boolean(item));
  };

  return (
    <ProductContext.Provider
      value={{
        categories,
        products,
        addCategory,
        addProduct,
        findCategoryById,
        findProductById,
        getProductLabel,
        getProductComponents,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductContextProvider');
  }
  return context;
};
