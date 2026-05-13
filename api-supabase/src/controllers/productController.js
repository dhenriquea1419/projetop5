const supabase = require('../config/supabase');
const log = require('../utils/logger');

const productController = {
  getAll: async (req, res) => {
    try {
      const { categoryId, search } = req.query;

      let query = supabase.from('products').select('*, categories(name)');

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      res.json(data);
    } catch (error) {
      log.error('Erro ao buscar produtos', error);
      res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Produto não encontrado' });

      res.json(data);
    } catch (error) {
      log.error('Erro ao buscar produto', error);
      res.status(500).json({ error: 'Erro ao buscar produto' });
    }
  },

  create: async (req, res) => {
    try {
      const { name, description, price, stock, category_id, barcode } = req.body;

      if (!name || !price || !category_id) {
        return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios' });
      }

      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name,
            description,
            price,
            stock: stock || 0,
            category_id,
            barcode,
            created_by: req.user.id,
          },
        ])
        .select('*, categories(name)');

      if (error) throw error;

      log.info('Produto criado', name);
      res.status(201).json(data[0]);
    } catch (error) {
      log.error('Erro ao criar produto', error);
      res.status(500).json({ error: 'Erro ao criar produto' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, stock, category_id, barcode } = req.body;

      const { data, error } = await supabase
        .from('products')
        .update({
          name,
          description,
          price,
          stock,
          category_id,
          barcode,
        })
        .eq('id', id)
        .select('*, categories(name)');

      if (error) throw error;
      if (!data || data.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });

      log.info('Produto atualizado', id);
      res.json(data[0]);
    } catch (error) {
      log.error('Erro ao atualizar produto', error);
      res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      log.info('Produto deletado', id);
      res.json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
      log.error('Erro ao deletar produto', error);
      res.status(500).json({ error: 'Erro ao deletar produto' });
    }
  },

  updateStock: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (quantity === undefined) {
        return res.status(400).json({ error: 'Quantidade é obrigatória' });
      }

      const { data, error } = await supabase
        .from('products')
        .update({ stock: quantity })
        .eq('id', id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });

      log.info('Estoque do produto atualizado', id);
      res.json(data[0]);
    } catch (error) {
      log.error('Erro ao atualizar estoque', error);
      res.status(500).json({ error: 'Erro ao atualizar estoque' });
    }
  },
};

module.exports = productController;
