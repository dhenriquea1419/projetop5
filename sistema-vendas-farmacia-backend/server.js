// Importação das dependências necessárias
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

const app = express();

app.use(cors()); 
app.use(helmet()); 
app.use(morgan('combined')); 
app.use(express.json()); 

app.get('/', (req, res) => {
  res.json({ mensagem: 'Sistema de Vendas em Farmácia - Backend funcionando perfeitamente!' });
});

const { connectDB } = require('./src/config/database.js');

async function iniciarServidor() {
  try {
    console.log('🔄 Tentando conectar ao banco de dados...');
    await connectDB();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');

    // Inicia o servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log('💊 Sistema de Vendas em Farmácia - Backend ativo e pronto para uso!');
    });
  } catch (erro) {
    console.error('❌ Erro ao conectar com o banco de dados:', erro);
    process.exit(1);
  }
}

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada no sistema.' });
});

app.use((err, req, res, next) => {
  console.error('💥 Erro no servidor:', err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor. Tente novamente mais tarde.' });
});

iniciarServidor();

process.on('SIGTERM', () => {
  console.log('🛑 Servidor encerrando...');
  process.exit(0);
});