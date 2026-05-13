-- Tabela de categorias
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  descricao VARCHAR(200) NOT NULL,
  unidade VARCHAR(10) NOT NULL,
  valor_unitario DECIMAL(10,2) NOT NULL,
  categoria_id INTEGER REFERENCES categorias(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de clientes
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  endereco TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de dependentes
CREATE TABLE dependentes (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
  nome VARCHAR(150) NOT NULL,
  parentesco VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de funcionarios
CREATE TABLE funcionarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  cargo VARCHAR(50) NOT NULL,
  telefone VARCHAR(20),
  comissao_percentual DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de compras
CREATE TABLE compras (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES clientes(id),
  vendedor_id INTEGER REFERENCES funcionarios(id),
  data_compra TIMESTAMPTZ DEFAULT NOW(),
  valor_total DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itens da compra
CREATE TABLE compra_itens (
  id SERIAL PRIMARY KEY,
  compra_id INTEGER REFERENCES compras(id) ON DELETE CASCADE,
  produto_id INTEGER REFERENCES produtos(id),
  quantidade INTEGER NOT NULL,
  valor_unitario DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);