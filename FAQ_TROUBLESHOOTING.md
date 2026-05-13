# ❓ FAQ & Troubleshooting

## Perguntas Frequentes

### 1. Como conectar o app ao servidor local?

**Problema:** App não consegue alcançar `localhost:3000`

**Solução:** Em celular físico, use o IP local:
```typescript
// constants/api.ts
export const API_CONFIG = {
  API_URL: 'http://192.168.1.100:3000/api', // Seu IP local
};
```

Para encontrar seu IP:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

---

### 2. Erro "CORS error" ao fazer requisições

**Erro:** 
```
Cross-Origin Request Blocked
```

**Solução:** Adicionar origem no CORS:
```javascript
// src/server.js
const corsOptions = {
  origin: ['http://localhost:3000', 'http://192.168.1.100:3000'],
};
app.use(cors(corsOptions));
```

---

### 3. "Cannot find module '@supabase/supabase-js'"

**Problema:** Módulo não instalado

**Solução:**
```bash
cd api-supabase
npm install @supabase/supabase-js
```

---

### 4. Erro "Invalid token" após login

**Problema:** Token JWT inválido

**Solução:**
1. Verifique se JWT_SECRET está correto no `.env`
2. Faça login novamente para obter novo token
3. Certifique-se que o token está no header:
   ```
   Authorization: Bearer SEU_TOKEN_AQUI
   ```

---

### 5. "database connection failed" ou "Forbidden"

**Problema:** Credenciais Supabase inválidas

**Solução:**
1. Acesse [supabase.com](https://supabase.com)
2. Vá para Settings → API
3. Copie URL e chaves corretamente
4. Atualize `.env`:
   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=sk-...
   ```

---

### 6. Erro 404 "Rota não encontrada"

**Problema:** Endpoint não existe

**Solução:** Verificar:
- URL correta (ex: `/api/products` não `/api/product`)
- Método HTTP correto (GET, POST, PUT, DELETE)
- Documentação em [api-supabase/README.md](api-supabase/README.md)

---

### 7. Banco de dados vazio ou sem tabelas

**Problema:** Tabelas não foram criadas

**Solução:**
1. Vá para [supabase.com](https://supabase.com)
2. Acesse seu projeto → SQL Editor
3. Clique "New Query"
4. Cole todo o conteúdo de `scripts/database-schema.sql`
5. Clique "Run"

---

### 8. "Cannot POST /api/auth/signup"

**Problema:** Rota de signup não funciona

**Solução:** Certifique-se que:
1. Backend está rodando (`npm run dev`)
2. URL está correta
3. Method é POST (não GET)
4. Header `Content-Type: application/json` está presente

---

### 9. Estoque negativo ao criar pedido

**Problema:** Sistema permite vender mais que há em estoque

**Solução:** Adicionar validação:
```javascript
// orderController.js
if (item.quantity > product.stock) {
  throw new Error('Estoque insuficiente');
}
```

---

### 10. Dados não atualizam em tempo real

**Problema:** App não mostra dados novos sem recarregar

**Solução:** Implementar polling ou real-time:
```typescript
// Em um hook
useEffect(() => {
  const interval = setInterval(() => {
    products.getAll();
  }, 5000); // Atualizar a cada 5 segundos

  return () => clearInterval(interval);
}, []);
```

---

## Troubleshooting Avançado

### Debug com Logs

```javascript
// Adicionar logs detalhados
const log = {
  debug: (msg, data) => console.log(`[DEBUG] ${msg}`, data),
  info: (msg, data) => console.log(`[INFO] ${msg}`, data),
  error: (msg, error) => console.error(`[ERROR] ${msg}`, error),
};
```

### Inspecionar Requisições

```bash
# Usar Postman ou Insomnia para testar endpoints
# Ou curl com verbose:
curl -v -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"senha123"}'
```

### Verificar Banco de Dados

```sql
-- Supabase SQL Editor
SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM orders;

-- Contar registros
SELECT COUNT(*) FROM products;

-- Buscar por ID
SELECT * FROM orders WHERE id = 'seu-uuid';
```

### Reset Completo

```bash
# 1. Parar backend
# Ctrl + C

# 2. Limpar dados (no Supabase)
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM clients;
DELETE FROM users;

# 3. Reinstalar dependências
npm install

# 4. Iniciar novamente
npm run dev
```

---

## Performance

### Lento demais?

```javascript
// Adicionar índices no Supabase
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_client ON orders(client_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
```

### Muitos erros de timeout?

```typescript
// Aumentar timeout na API
const API_TIMEOUT = 30000; // 30 segundos
```

---

## Segurança

### Criptografar senhas corretamente

```bash
npm install bcryptjs
```

```javascript
// authController.js
const bcrypt = require('bcryptjs');

// Hash de senha
const hashedPassword = await bcrypt.hash(password, 10);

// Comparar
const isValid = await bcrypt.compare(password, hashedPassword);
```

### Não guardar tokens em localStorage

```typescript
// ❌ INSEGURO
localStorage.setItem('token', token);

// ✅ SEGURO (usar httpOnly cookie ou memory)
// httpOnly cookie (servidor define)
// Ou guardar em memória (perde ao recarregar)
const [token, setToken] = useState<string | null>(null);
```

---

## Contato e Suporte

| Problema | Recurso |
|----------|---------|
| Erro Supabase | [Supabase Docs](https://supabase.com/docs) |
| Erro Express | [Express Docs](https://expressjs.com) |
| Erro Expo | [Expo Docs](https://docs.expo.dev) |
| Erro Node.js | [Node.js Docs](https://nodejs.org/docs) |

---

## Checklist de Debug

- [ ] Backend está rodando?
- [ ] Variáveis `.env` preenchidas corretamente?
- [ ] Banco de dados conectado?
- [ ] Tabelas criadas?
- [ ] App tentando alcançar API correta?
- [ ] CORS configurado?
- [ ] Token válido?
- [ ] Método HTTP correto?
- [ ] Body da requisição correto?

---

**Não encontrou sua dúvida? Verifique os logs! 🔍**
