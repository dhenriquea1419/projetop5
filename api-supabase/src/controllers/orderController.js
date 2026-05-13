const supabase = require('../config/supabase');
const log = require('../utils/logger');

const orderController = {
  getAll: async (req, res) => {
    try {
      const { status, clientId } = req.query;

      let query = supabase
        .from('orders')
        .select('*, clients(name, email), order_items(*, products(name, price))');

      if (status) {
        query = query.eq('status', status);
      }

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      res.json(data);
    } catch (error) {
      log.error('Erro ao buscar pedidos', error);
      res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('orders')
        .select('*, clients(name, email), order_items(*, products(name, price))')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Pedido não encontrado' });

      res.json(data);
    } catch (error) {
      log.error('Erro ao buscar pedido', error);
      res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
  },

  create: async (req, res) => {
    try {
      const { client_id, items, notes } = req.body;

      if (!client_id || !items || items.length === 0) {
        return res.status(400).json({ error: 'Cliente e itens do pedido são obrigatórios' });
      }

      // Calcular total
      let total = 0;
      for (const item of items) {
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('price')
          .eq('id', item.product_id)
          .single();

        if (productError) throw productError;
        total += product.price * item.quantity;
      }

      // Criar pedido
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            client_id,
            total,
            status: 'pending',
            notes,
            created_by: req.user.id,
          },
        ])
        .select();

      if (orderError) throw orderError;

      const orderId = orderData[0].id;

      // Criar itens do pedido
      const orderItems = items.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price || 0,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Atualizar estoque
      for (const item of items) {
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single();

        if (productError) throw productError;

        await supabase
          .from('products')
          .update({ stock: product.stock - item.quantity })
          .eq('id', item.product_id);
      }

      log.info('Pedido criado', orderId);
      res.status(201).json({ ...orderData[0], order_items: orderItems });
    } catch (error) {
      log.error('Erro ao criar pedido', error);
      res.status(500).json({ error: 'Erro ao criar pedido' });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status é obrigatório' });
      }

      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) return res.status(404).json({ error: 'Pedido não encontrado' });

      log.info('Status do pedido atualizado', id);
      res.json(data[0]);
    } catch (error) {
      log.error('Erro ao atualizar status do pedido', error);
      res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      // Buscar itens do pedido para restaurar estoque
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);

      if (itemsError) throw itemsError;

      // Restaurar estoque
      for (const item of orderItems) {
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single();

        if (productError) throw productError;

        await supabase
          .from('products')
          .update({ stock: product.stock + item.quantity })
          .eq('id', item.product_id);
      }

      // Deletar itens do pedido
      const { error: deleteItemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', id);

      if (deleteItemsError) throw deleteItemsError;

      // Deletar pedido
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      log.info('Pedido deletado', id);
      res.json({ message: 'Pedido deletado com sucesso' });
    } catch (error) {
      log.error('Erro ao deletar pedido', error);
      res.status(500).json({ error: 'Erro ao deletar pedido' });
    }
  },
};

module.exports = orderController;
