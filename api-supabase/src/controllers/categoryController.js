const supabase = require('../config/supabase');
const log = require('../utils/logger');

const categoryController = {
  getAll: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(data);
    } catch (error) {
      log.error('Erro ao buscar categorias', error);
      res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Categoria não encontrada' });

      res.json(data);
    } catch (error) {
      log.error('Erro ao buscar categoria', error);
      res.status(500).json({ error: 'Erro ao buscar categoria' });
    }
  },

  create: async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Nome da categoria é obrigatório' });
      }

      const { data, error } = await supabase
        .from('categories')
        .insert([{ name, description, created_by: req.user.id }])
        .select();

      if (error) throw error;

      log.info('Categoria criada', name);
      res.status(201).json(data[0]);
    } catch (error) {
      log.error('Erro ao criar categoria', error);
      res.status(500).json({ error: 'Erro ao criar categoria' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const { data, error } = await supabase
        .from('categories')
        .update({ name, description })
        .eq('id', id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) return res.status(404).json({ error: 'Categoria não encontrada' });

      log.info('Categoria atualizada', id);
      res.json(data[0]);
    } catch (error) {
      log.error('Erro ao atualizar categoria', error);
      res.status(500).json({ error: 'Erro ao atualizar categoria' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      log.info('Categoria deletada', id);
      res.json({ message: 'Categoria deletada com sucesso' });
    } catch (error) {
      log.error('Erro ao deletar categoria', error);
      res.status(500).json({ error: 'Erro ao deletar categoria' });
    }
  },
};

module.exports = categoryController;
