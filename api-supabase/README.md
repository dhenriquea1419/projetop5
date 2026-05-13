# Servidor API Supabase - Farmácia

Uma API completa para um sistema de vendas de farmácia com Supabase, autenticação e CRUD de todas as entidades.

## 🚀 Funcionalidades

- ✅ **Autenticação**: Signup, login e logout com JWT
- ✅ **Gestão de Categorias**: CRUD completo
- ✅ **Gestão de Produtos**: CRUD com controle de estoque
- ✅ **Gestão de Clientes**: CRUD completo
- ✅ **Gestão de Pedidos**: Criação, visualização e atualização de status
- ✅ **Relatórios**: Vendas, produtos, inventário e clientes

## 📋 Pré-requisitos

- Node.js v16 ou superior
- Conta Supabase ativa
- npm ou yarn

## ⚙️ Instalação

1. **Clone o repositório** (se aplicável)

2. **Instale as dependências**
   ```bash
   cd api-supabase
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```

4. **Adicione suas credenciais Supabase** no arquivo `.env`:
   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_ANON_KEY=sua-chave-anonima
   SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
   JWT_SECRET=uma-chave-secreta-segura
   PORT=3000
   ```

## 🗄️ Setup do Banco de Dados

1. **Acesse o Supabase Dashboard**

2. **Vá para SQL Editor** e crie uma nova query

3. **Copie e execute** todo o conteúdo do arquivo `scripts/database-schema.sql`

   Ou execute via CLI:
   ```bash
   npm run setup-db
   ```

## 🚀 Iniciar o Servidor

**Desenvolvimento** (com hot reload):
```bash
npm run dev
```

**Produção**:
```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 📚 Endpoints da API

### Autenticação

```
POST   /api/auth/signup        - Criar nova conta
POST   /api/auth/login         - Fazer login
POST   /api/auth/logout        - Fazer logout
GET    /api/auth/me            - Obter usuário atual
```

### Categorias

```
GET    /api/categories         - Listar todas as categorias
GET    /api/categories/:id     - Obter categoria por ID
POST   /api/categories         - Criar nova categoria (requer autenticação)
PUT    /api/categories/:id     - Atualizar categoria (requer autenticação)
DELETE /api/categories/:id     - Deletar categoria (requer autenticação)
```

### Produtos

```
GET    /api/products           - Listar produtos (com filtros opcionais)
GET    /api/products/:id       - Obter produto por ID
POST   /api/products           - Criar novo produto (requer autenticação)
PUT    /api/products/:id       - Atualizar produto (requer autenticação)
DELETE /api/products/:id       - Deletar produto (requer autenticação)
PATCH  /api/products/:id/stock - Atualizar estoque do produto (requer autenticação)
```

### Clientes

```
GET    /api/clients            - Listar clientes (requer autenticação)
GET    /api/clients/:id        - Obter cliente por ID (requer autenticação)
POST   /api/clients            - Criar novo cliente (requer autenticação)
PUT    /api/clients/:id        - Atualizar cliente (requer autenticação)
DELETE /api/clients/:id        - Deletar cliente (requer autenticação)
```

### Pedidos

```
GET    /api/orders             - Listar pedidos (requer autenticação)
GET    /api/orders/:id         - Obter pedido por ID (requer autenticação)
POST   /api/orders             - Criar novo pedido (requer autenticação)
PATCH  /api/orders/:id/status  - Atualizar status do pedido (requer autenticação)
DELETE /api/orders/:id         - Deletar pedido (requer autenticação)
```

### Relatórios

```
GET    /api/reports/sales      - Relatório de vendas (requer autenticação)
GET    /api/reports/products   - Produtos mais vendidos (requer autenticação)
GET    /api/reports/inventory  - Relatório de inventário (requer autenticação)
GET    /api/reports/clients    - Relatório de clientes (requer autenticação)
```

## 📝 Exemplos de Requisições

### 1. Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendedor@farmacia.com",
    "password": "senha123",
    "name": "João Vendedor",
    "role": "vendedor"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendedor@farmacia.com",
    "password": "senha123"
  }'
```

### 3. Criar Categoria
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "Antibióticos",
    "description": "Medicamentos antibióticos"
  }'
```

### 4. Criar Produto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "Dipirona 500mg",
    "description": "Comprimido 500mg",
    "price": 5.50,
    "stock": 100,
    "category_id": "UUID_DA_CATEGORIA",
    "barcode": "1234567890"
  }'
```

### 5. Criar Cliente
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@email.com",
    "phone": "(11) 99999-8888",
    "cpf": "123.456.789-00",
    "address": "Rua das Flores, 123",
    "city": "São Paulo",
    "state": "SP",
    "zipcode": "01234-567"
  }'
```

### 6. Criar Pedido
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "client_id": "UUID_DO_CLIENTE",
    "items": [
      {
        "product_id": "UUID_DO_PRODUTO",
        "quantity": 2,
        "unit_price": 5.50
      }
    ],
    "notes": "Entrega rápida"
  }'
```

## 🔐 Autenticação

Todos os endpoints protegidos requerem um token JWT no header:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

O token é obtido ao fazer login e expira em 24 horas.

## 📂 Estrutura do Projeto

```
api-supabase/
├── src/
│   ├── config/
│   │   └── supabase.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── productController.js
│   │   ├── clientController.js
│   │   ├── orderController.js
│   │   └── reportController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── products.js
│   │   ├── clients.js
│   │   ├── orders.js
│   │   ├── reports.js
│   │   └── index.js
│   ├── utils/
│   │   └── logger.js
│   └── server.js
├── scripts/
│   ├── database-schema.sql
│   └── setupDatabase.js
├── .env.example
├── package.json
└── README.md
```

## 🛠️ Tecnologias Usadas

- **Express.js**: Framework web
- **Supabase**: Backend como serviço (BaaS)
- **PostgreSQL**: Banco de dados
- **JWT**: Autenticação
- **CORS**: Compartilhamento de recursos entre origens

## 📖 Próximos Passos

1. Integrar com seu app Expo (ProjetoP5)
2. Adicionar validações mais rigorosas
3. Implementar paginação
4. Adicionar testes automatizados
5. Deploy em produção (Heroku, Render, Railway, etc.)

## 🆘 Suporte

Para dúvidas ou problemas, verifique:
- Logs do servidor
- Configuração das variáveis de ambiente
- Credenciais do Supabase
- Conexão com o banco de dados

## 📄 Licença

MIT
