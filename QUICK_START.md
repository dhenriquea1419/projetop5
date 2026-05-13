# 🎯 Guia Rápido - 5 Minutos

## ⚡ Início Rápido (Sem Setup Completo)

Quer testar a API rapidamente? Siga este guia:

### 1. Clonar/Baixar o projeto
```bash
cd c:\projetop5
```

### 2. Instalar dependências do backend
```bash
cd api-supabase
npm install
```

### 3. Copiar configurações
```bash
cp .env.example .env
```

### 4. Editar .env com suas credenciais Supabase
```bash
# .env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
JWT_SECRET=sua-chave-secreta-jwt
PORT=3000
```

### 5. Iniciar servidor
```bash
npm run dev
```

O servidor estará em: **http://localhost:3000**

---

## 🧪 Testar a API (sem app)

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Criar usuário
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@gmail.com",
    "password": "senha123",
    "name": "Teste User",
    "role": "vendedor"
  }'
```

### 3. Fazer login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@gmail.com",
    "password": "senha123"
  }'
```

Copie o `token` retornado!

### 4. Usar o token
```bash
# Listar categorias (sem autenticação)
curl http://localhost:3000/api/categories

# Criar categoria (com autenticação)
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "Antibióticos",
    "description": "Medicamentos antibióticos"
  }'
```

---

## 📱 Integrar com App Expo

### 1. Editar configuração da API
```typescript
// ProjetoP5/constants/api.ts
export const API_CONFIG = {
  SUPABASE_URL: 'https://seu-projeto.supabase.co',
  SUPABASE_ANON_KEY: 'sua-chave-anonima',
  API_URL: 'http://localhost:3000/api',
};
```

### 2. Usar no app
```tsx
import { useSupabase } from '../hooks/SupabaseContext';

export default function MyScreen() {
  const { login } = useSupabase();

  const handleLogin = () => {
    login('teste@gmail.com', 'senha123');
  };

  return (
    // UI aqui
  );
}
```

---

## 📝 Checklist de Setup

- [ ] Conta Supabase criada
- [ ] Credenciais Supabase copiadas
- [ ] Arquivo `.env` preenchido
- [ ] Banco de dados configurado (SQL executado)
- [ ] Backend rodando (`npm run dev`)
- [ ] App conectando na API
- [ ] Login funcionando

---

## 🆘 Erros Comuns

| Erro | Solução |
|------|---------|
| Cannot reach server | Backend não está rodando |
| CORS error | Verificar configuração de CORS |
| Invalid token | Refazer login |
| Database error | Credenciais Supabase inválidas |
| Módulo não encontrado | Executar `npm install` |

---

## ✅ Próximos Passos

1. Criar tabelas no Supabase
2. Cadastrar alguns dados de teste
3. Testar todos os endpoints
4. Integrar com telas do app
5. Deploy em produção

---

**Dúvidas?** Consulte:
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Guia completo
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Resumo técnico
- [api-supabase/README.md](api-supabase/README.md) - Documentação da API
