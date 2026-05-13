# 🔧 Guia de Setup - API Supabase

Siga os passos abaixo para integrar completamente a API Supabase com seu app Expo.

## 📍 Passo 1: Criar Projeto Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login ou crie uma conta
4. Clique em "New Project"
5. Preencha os dados:
   - **Project name**: seu-projeto-farmacia
   - **Database password**: uma senha segura
   - **Region**: escolha o mais próximo
6. Clique em "Create new project"
7. Aguarde a criação (pode levar alguns minutos)

## 🔑 Passo 2: Obter Credenciais

1. No Supabase Dashboard, vá para **Settings → API**
2. Copie:
   - **Project URL** → SUPABASE_URL
   - **anon public key** → SUPABASE_ANON_KEY
   - **service_role key** → SUPABASE_SERVICE_ROLE_KEY (para o backend)

## 🗄️ Passo 3: Criar Tabelas no Banco

1. No Supabase, vá para **SQL Editor**
2. Clique em "New Query"
3. Cole todo o conteúdo de `api-supabase/scripts/database-schema.sql`
4. Clique em "Run"

## ⚙️ Passo 4: Configurar Backend API

1. Abra `api-supabase/.env.example` e salve como `.env`
2. Preencha as credenciais:
   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_ANON_KEY=sua-chave-anonima
   SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
   JWT_SECRET=gere-uma-chave-segura-aqui
   PORT=3000
   ```

3. Instale as dependências:
   ```bash
   cd api-supabase
   npm install
   ```

4. Inicie o servidor:
   ```bash
   npm run dev
   ```

O servidor deve estar rodando em `http://localhost:3000`

## 📱 Passo 5: Configurar App Expo

1. Abra `ProjetoP5/constants/api.ts`
2. Atualize as configurações:
   ```typescript
   export const API_CONFIG = {
     SUPABASE_URL: 'https://seu-projeto.supabase.co',
     SUPABASE_ANON_KEY: 'sua-chave-anonima',
     API_URL: 'http://localhost:3000/api', // ou seu IP local
   };
   ```

3. Certifique-se que o `SupabaseContext.tsx` está configurado corretamente

## 🚀 Passo 6: Testar a Integração

### Terminal 1 - Iniciar Backend
```bash
cd api-supabase
npm run dev
```

### Terminal 2 - Iniciar App Expo
```bash
cd ProjetoP5
npm start
```

### Testar Login
1. Abra o app no Expo
2. Tente fazer login/signup
3. Verifique os logs no terminal

## ✅ Verificação de Conectividade

### Teste 1: Health Check da API
```bash
curl http://localhost:3000/health
```

Deve retornar:
```json
{ "status": "ok", "timestamp": "..." }
```

### Teste 2: Listar Categorias
```bash
curl http://localhost:3000/api/categories
```

### Teste 3: Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu-email@gmail.com",
    "password": "sua-senha"
  }'
```

## 🆘 Troubleshooting

### Erro: "Cannot reach server"
- Verifique se o backend está rodando
- Se usar em celular físico, use seu IP local em vez de `localhost`
- Ex: `http://192.168.1.100:3000/api`

### Erro: "CORS error"
- Verifique a configuração de CORS no `src/server.js`
- Adicione sua URL do Expo na lista de CORS

### Erro: "Invalid token"
- Verifique se o JWT_SECRET está correto
- Refaça o login para obter um novo token

### Erro: "Database connection failed"
- Verifique as credenciais do Supabase
- Confirme que o projeto está ativo

## 📚 Próximos Passos

1. Integrar componentes do app com os hooks (`useProducts`, `useCategories`, etc.)
2. Adicionar telas de autenticação
3. Implementar cache local
4. Adicionar notificações de erro/sucesso
5. Deploy em produção

## 📖 Documentação

- [Supabase Docs](https://supabase.com/docs)
- [Expo Docs](https://docs.expo.dev)
- [Express.js Docs](https://expressjs.com)

---

**Dúvidas?** Consulte os logs do servidor e do app para mais detalhes!
