const supabase = require('../config/supabase');
const log = require('../utils/logger');
const mockDb = process.env.USE_MOCK_DB === 'true' ? require('../mockDb') : null;

const clientController = {
  getAll: async (req, res) => {
    try {
      const { search } = req.query;
      if (mockDb) {
        const data = await mockDb.getAll(search);
        return res.json(data);
      }

      let query = supabase.from('clients').select('*');

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      res.json(data);
    } catch (error) {
      log.error('Erro ao buscar clientes', error);
      res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      if (mockDb) {
        const data = await mockDb.getById(id);
        if (!data) return res.status(404).json({ error: 'Cliente não encontrado' });
        return res.json(data);
      }

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Cliente não encontrado' });

      res.json(data);
    } catch (error) {
      log.error('Erro ao buscar cliente', error);
      res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
  },

  create: async (req, res) => {
    try {
      const { name, email, phone, cpf, address, city, state, zipcode } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: 'Nome e email são obrigatórios' });
      }
      if (mockDb) {
        const item = await mockDb.create({ name, email, phone, cpf, address, city, state, zipcode });
        log.info('Cliente (mock) criado', name);
        return res.status(201).json(item);
      }

      const { data, error } = await supabase
        .from('clients')
        .insert([
          {
            name,
            email,
            phone,
            cpf,
            address,
            city,
            state,
            zipcode,
            created_by: req.user.id,
          },
        ])
        .select();

      if (error) throw error;

      log.info('Cliente criado', name);
      res.status(201).json(data[0]);
    } catch (error) {
      log.error('Erro ao criar cliente', error);
      res.status(500).json({ error: 'Erro ao criar cliente' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, cpf, address, city, state, zipcode } = req.body;

      if (mockDb) {
        const updated = await mockDb.update(id, { name, email, phone, cpf, address, city, state, zipcode });
        if (!updated) return res.status(404).json({ error: 'Cliente não encontrado' });
        log.info('Cliente (mock) atualizado', id);
        return res.json(updated);
      }
      const { data, error } = await supabase
        .from('clients')
        .update({
          name,
          email,
          phone,
          cpf,
          address,
          city,
          state,
          zipcode,
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) return res.status(404).json({ error: 'Cliente não encontrado' });

      log.info('Cliente atualizado', id);
      res.json(data[0]);
    } catch (error) {
      log.error('Erro ao atualizar cliente', error);
      res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      if (mockDb) {
        const ok = await mockDb.delete(id);
        if (!ok) return res.status(404).json({ error: 'Cliente não encontrado' });
        log.info('Cliente (mock) deletado', id);
        return res.json({ message: 'Cliente deletado com sucesso' });
      }

      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      log.info('Cliente deletado', id);
      res.json({ message: 'Cliente deletado com sucesso' });
    } catch (error) {
      log.error('Erro ao deletar cliente', error);
      res.status(500).json({ error: 'Erro ao deletar cliente' });
    }
  },
};

module.exports = clientController;
