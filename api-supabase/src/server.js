require('dotenv').config();
const express = require('express');
const cors = require('express-cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const log = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições
app.use((req, res, next) => {
  log.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas da API
app.use('/api', routes);

// Erro 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware de erro
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  log.info(`Servidor rodando na porta ${PORT}`);
  log.info(`Ambiente: ${process.env.NODE_ENV}`);
});

module.exports = app;
