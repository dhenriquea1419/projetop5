# 🎯 Quick Reference - Farmácia com Supabase

## 📱 Começar (5 min)

```bash
# 1. Backend
cd api-supabase
npm install
cp .env.example .env
# Edite .env com credenciais Supabase
npm run dev

# 2. App
cd ProjetoP5
npm start
```

---

## 🔑 Credenciais Supabase (Guardar!)

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
JWT_SECRET=gerado-aleatoriamente
```

---

## 🛠️ Arquivos Importantes

| Arquivo | Função | Editar? |
|---------|--------|---------|
| `api-supabase/.env` | Credenciais | ✅ SIM |
| `ProjetoP5/constants/api.ts` | URL da API | ✅ SIM |
| `scripts/database-schema.sql` | Banco de dados | 📋 Executar |
| `ProjetoP5/hooks/SupabaseContext.tsx` | Autenticação | ❌ Pronto |
| `ProjetoP5/hooks/useApi.ts` | CRUD hooks | ❌ Pronto |

---

## 📝 Exemplos Rápidos

### Login
```typescript
const { login } = useSupabase();
await login('user@email.com', 'senha123');
```

### Listar Produtos
```typescript
const products = useProducts();
const all = await products.getAll();
```

### Criar Produto
```typescript
const products = useProducts();
await products.create({
  name: 'Dipirona 500mg',
  price: 5.50,
  stock: 100,
  category_id: 'uuid-aqui'
});
```

### Criar Pedido
```typescript
const orders = useOrders();
await orders.create({
  client_id: 'uuid-cliente',
  items: [
    { product_id: 'uuid-prod', quantity: 2, unit_price: 5.50 }
  ]
});
```

---

## 🔌 Endpoints Principais

```
POST   /api/auth/login              ← Login
GET    /api/products                ← Listar
POST   /api/products                ← Criar
PUT    /api/products/:id            ← Atualizar
DELETE /api/products/:id            ← Deletar
PATCH  /api/products/:id/stock      ← Estoque
GET    /api/reports/sales           ← Relatórios
```

---

## 🗄️ Tabelas do Banco

```
users          → Usuários e autenticação
categories     → Categorias de produtos
products       → Produtos
clients        → Clientes
orders         → Pedidos
order_items    → Itens dos pedidos
```

---

## ❌ Erros Comuns

| Erro | Solução |
|------|---------|
| Cannot reach server | Backend não está rodando |
| CORS error | Editar origem em server.js |
| Invalid token | Refazer login |
| Database error | Credenciais Supabase erradas |
| No tables | Executar database-schema.sql |

---

## 📚 Documentação

- **QUICK_START.md** - Setup rápido
- **SETUP_GUIDE.md** - Detalhado
- **FAQ_TROUBLESHOOTING.md** - Problemas
- **DEPLOYMENT_GUIDE.md** - Deploy

---

## ✅ Checklist

- [ ] Backend rodando na porta 3000
- [ ] App conectando na API
- [ ] Banco de dados com tabelas
- [ ] Signup/Login funcionando
- [ ] CRUD de produtos funcionando
- [ ] Relatórios retornando dados

---

## 🚀 Deploy

```bash
# Heroku
git push heroku main

# Railway / Render
Conectar GitHub e auto-deploy

# Docker
docker build -t farmacia ./api-supabase
docker run -p 3000:3000 farmacia
```

---

## 💡 Dicas

1. Use seu IP local em vez de localhost para testar no celular
2. Sempre gere novo JWT_SECRET em produção
3. Use HTTPS em produção
4. Configure backups automáticos no Supabase
5. Adicione rate limiting para APIs públicas

---

**Versão:** 1.0  
**Última atualização:** 2024  
**Status:** ✅ Pronto para uso
