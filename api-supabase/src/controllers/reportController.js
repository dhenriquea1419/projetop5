const supabase = require('../config/supabase');
const log = require('../utils/logger');

const reportController = {
  getSalesReport: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      let query = supabase
        .from('orders')
        .select('*, order_items(quantity, unit_price), clients(name)');

      if (startDate) {
        query = query.gte('created_at', new Date(startDate).toISOString());
      }

      if (endDate) {
        query = query.lte('created_at', new Date(endDate).toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      // Calcular totais
      let totalRevenue = 0;
      let totalOrders = data.length;
      let totalItems = 0;

      data.forEach((order) => {
        totalRevenue += order.total || 0;
        order.order_items?.forEach((item) => {
          totalItems += item.quantity || 0;
        });
      });

      res.json({
        totalRevenue,
        totalOrders,
        totalItems,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        orders: data,
      });
    } catch (error) {
      log.error('Erro ao gerar relatório de vendas', error);
      res.status(500).json({ error: 'Erro ao gerar relatório de vendas' });
    }
  },

  getProductSalesReport: async (req, res) => {
    try {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('order_items(product_id, quantity, unit_price)');

      if (ordersError) throw ordersError;

      const productSales = {};

      orders.forEach((order) => {
        order.order_items?.forEach((item) => {
          if (!productSales[item.product_id]) {
            productSales[item.product_id] = { quantity: 0, revenue: 0 };
          }
          productSales[item.product_id].quantity += item.quantity || 0;
          productSales[item.product_id].revenue += (item.unit_price || 0) * (item.quantity || 0);
        });
      });

      // Buscar nomes dos produtos
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name');

      if (productsError) throw productsError;

      const report = products.map((product) => ({
        productId: product.id,
        productName: product.name,
        ...(productSales[product.id] || { quantity: 0, revenue: 0 }),
      }));

      res.json(report);
    } catch (error) {
      log.error('Erro ao gerar relatório de produtos vendidos', error);
      res.status(500).json({ error: 'Erro ao gerar relatório de produtos vendidos' });
    }
  },

  getInventoryReport: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, stock, price, categories(name)')
        .order('stock', { ascending: true });

      if (error) throw error;

      const lowStockItems = data.filter((item) => item.stock < 10);
      const totalValue = data.reduce((sum, item) => sum + (item.stock * item.price), 0);

      res.json({
        totalProducts: data.length,
        totalValue,
        lowStockCount: lowStockItems.length,
        lowStockItems,
        allProducts: data,
      });
    } catch (error) {
      log.error('Erro ao gerar relatório de inventário', error);
      res.status(500).json({ error: 'Erro ao gerar relatório de inventário' });
    }
  },

  getClientReport: async (req, res) => {
    try {
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('id, name, email, phone, created_at');

      if (clientsError) throw clientsError;

      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('client_id, total');

      if (ordersError) throw ordersError;

      const clientStats = {};

      orders.forEach((order) => {
        if (!clientStats[order.client_id]) {
          clientStats[order.client_id] = { orderCount: 0, totalSpent: 0 };
        }
        clientStats[order.client_id].orderCount += 1;
        clientStats[order.client_id].totalSpent += order.total || 0;
      });

      const report = clients.map((client) => ({
        ...client,
        ...(clientStats[client.id] || { orderCount: 0, totalSpent: 0 }),
      }));

      res.json({
        totalClients: clients.length,
        clientsWithPurchases: Object.keys(clientStats).length,
        report,
      });
    } catch (error) {
      log.error('Erro ao gerar relatório de clientes', error);
      res.status(500).json({ error: 'Erro ao gerar relatório de clientes' });
    }
  },
};

module.exports = reportController;
