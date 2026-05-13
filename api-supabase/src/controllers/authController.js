const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');
const log = require('../utils/logger');

const authController = {
  signup: async (req, res) => {
    try {
      const { email, password, name, role } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
      }

      // Criar usuário no Supabase
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (authError) {
        log.error('Erro ao criar usuário', authError);
        return res.status(400).json({ error: authError.message });
      }

      // Salvar dados do usuário na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            name,
            role: role || 'vendedor',
          },
        ])
        .select();

      if (userError) {
        log.error('Erro ao salvar usuário', userError);
        return res.status(400).json({ error: userError.message });
      }

      log.info('Usuário criado com sucesso', email);
      res.status(201).json({ user: userData[0], message: 'Usuário criado com sucesso' });
    } catch (error) {
      log.error('Erro no signup', error);
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      // Autenticar com Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        log.error('Erro ao fazer login', authError);
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      // Buscar dados do usuário
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) {
        log.error('Erro ao buscar dados do usuário', userError);
        return res.status(400).json({ error: userError.message });
      }

      // Gerar JWT customizado
      const token = jwt.sign(
        { id: authData.user.id, email: authData.user.email, role: userData.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      log.info('Login realizado com sucesso', email);
      res.json({
        user: userData,
        token,
        message: 'Login realizado com sucesso',
      });
    } catch (error) {
      log.error('Erro no login', error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  },

  logout: async (req, res) => {
    try {
      log.info('Logout realizado', req.user.email);
      res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      log.error('Erro no logout', error);
      res.status(500).json({ error: 'Erro ao fazer logout' });
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.user.id)
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ user: userData });
    } catch (error) {
      log.error('Erro ao buscar usuário atual', error);
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  },
};

module.exports = authController;
