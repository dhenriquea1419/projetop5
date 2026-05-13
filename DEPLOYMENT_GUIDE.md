# 🚀 Deploy e Produção

## 📦 Opções de Deploy

### 1. Heroku (Grátis)
```bash
# Instalar Heroku CLI
# Fazer login
heroku login

# Criar app
heroku create sua-api-farmacia

# Configurar variáveis de ambiente
heroku config:set SUPABASE_URL=...
heroku config:set SUPABASE_ANON_KEY=...
heroku config:set SUPABASE_SERVICE_ROLE_KEY=...
heroku config:set JWT_SECRET=...

# Deploy
git push heroku main
```

### 2. Railway (Recomendado)
1. Acesse [railway.app](https://railway.app)
2. Clique em "New Project"
3. Selecione "Deploy from GitHub"
4. Conecte seu repositório
5. Adicione variáveis de ambiente
6. Deploy automático!

### 3. Render
1. Acesse [render.com](https://render.com)
2. Clique em "New +" → "Web Service"
3. Conecte seu GitHub
4. Configure as variáveis de ambiente
5. Deploy!

### 4. Docker + VPS
```bash
# Build da imagem
docker build -t farmacia-api ./api-supabase

# Run do container
docker run -e SUPABASE_URL=... \
           -e SUPABASE_ANON_KEY=... \
           -p 3000:3000 \
           farmacia-api

# Com docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔐 Segurança em Produção

### 1. Variáveis de Ambiente
```bash
# NUNCA commit no Git!
echo ".env" >> .gitignore

# Use variáveis seguras no servidor
export SUPABASE_URL=...
export JWT_SECRET=$(openssl rand -base64 32)
```

### 2. JWT Secret Seguro
```bash
# Gerar chave segura
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. CORS em Produção
```javascript
// src/server.js
const corsOptions = {
  origin: [
    'https://sua-app-frontend.com',
    'https://seu-dominio.com',
  ],
  credentials: true,
};
app.use(cors(corsOptions));
```

### 4. Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
// Adicionar no server.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
});

app.use('/api/', limiter);
```

### 5. HTTPS Obrigatório
```javascript
// Redirecionar HTTP para HTTPS
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});
```

### 6. Validação de Entrada
```bash
npm install joi
```

```javascript
// exemplo de validação
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const { error, value } = schema.validate(req.body);
if (error) {
  return res.status(400).json({ error: error.details[0].message });
}
```

---

## 📊 Monitoramento

### 1. Logs
```javascript
// Usar serviço de logs (Datadog, LogRocket, etc)
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

### 2. APM (Application Performance Monitoring)
```bash
npm install elastic-apm-node
```

### 3. Health Checks
```bash
# Verificar saúde da API regularmente
curl https://sua-api.com/health
```

---

## 📈 Performance

### 1. Cache com Redis
```bash
npm install redis
```

### 2. Compressão
```javascript
const compression = require('compression');
app.use(compression());
```

### 3. Paginação
```javascript
// Adicionar paginação nos endpoints
const limit = req.query.limit || 10;
const offset = (req.query.page - 1) * limit;

const { data } = await supabase
  .from('products')
  .select('*')
  .range(offset, offset + limit - 1);
```

---

## 🔄 CI/CD (Deploy Automático)

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm install
          npm test
          npm run build
```

---

## 📋 Checklist Pré-Produção

- [ ] JWT_SECRET mudado para chave segura
- [ ] CORS configurado para domínios específicos
- [ ] Rate limiting implementado
- [ ] HTTPS habilitado
- [ ] Logs configurados
- [ ] Backup automático ativo
- [ ] Monitoramento configurado
- [ ] Variáveis de ambiente seguras
- [ ] Testes executados
- [ ] SSL/TLS certificado instalado

---

## 🚨 Troubleshooting em Produção

### API não responde
```bash
# Verificar logs
docker logs container_id

# Reiniciar
docker restart container_id
```

### Erro de CORS
```javascript
// Aumentar allowed origins
const corsOptions = {
  origin: '*', // APENAS temporário para debug!
};
```

### Banco de dados lento
```javascript
// Adicionar índices
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_products_category ON products(category_id);
```

---

## 📚 Recursos

- [Heroku Docs](https://devcenter.heroku.com)
- [Railway Docs](https://docs.railway.app)
- [Docker Docs](https://docs.docker.com)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Sucesso no deploy! 🎉**
