#!/usr/bin/env node

const supabase = require('../src/config/supabase');
const fs = require('fs');
const path = require('path');
const log = require('../src/utils/logger');

const setupDatabase = async () => {
  try {
    log.info('Iniciando setup do banco de dados...');

    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'database-schema.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf-8');

    // Executar cada comando SQL separadamente
    const commands = sqlScript
      .split(';')
      .map((cmd) => cmd.trim())
      .filter((cmd) => cmd.length > 0);

    for (const command of commands) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: command });

        if (error && !error.message.includes('already exists')) {
          log.warn(`Aviso ao executar comando: ${error.message}`);
        }
      } catch (error) {
        // Se usar raw query via query builder
        log.info(`Comando SQL: ${command.substring(0, 50)}...`);
      }
    }

    log.info('Setup do banco de dados concluído com sucesso!');
    log.info('Acesse o Supabase Dashboard para executar manualmente os scripts SQL se necessário.');
    process.exit(0);
  } catch (error) {
    log.error('Erro ao configurar banco de dados', error);
    log.info('Execute os comandos SQL manualmente no Supabase Dashboard:');
    log.info('Copie o conteúdo de scripts/database-schema.sql');
    process.exit(1);
  }
};

setupDatabase();
