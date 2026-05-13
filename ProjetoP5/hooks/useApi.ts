import { useSupabase } from './SupabaseContext';

export const useProducts = () => {
  const { apiCall } = useSupabase();

  return {
    getAll: async (categoryId?: string, search?: string) => {
      const params = new URLSearchParams();
      if (categoryId) params.append('categoryId', categoryId);
      if (search) params.append('search', search);
      return apiCall('GET', `/products?${params.toString()}`);
    },
    getById: (id: string) => apiCall('GET', `/products/${id}`),
    create: (data: any) => apiCall('POST', '/products', data),
    update: (id: string, data: any) => apiCall('PUT', `/products/${id}`, data),
    delete: (id: string) => apiCall('DELETE', `/products/${id}`),
    updateStock: (id: string, quantity: number) =>
      apiCall('PATCH', `/products/${id}/stock`, { quantity }),
  };
};

export const useCategories = () => {
  const { apiCall } = useSupabase();

  return {
    getAll: () => apiCall('GET', '/categories'),
    getById: (id: string) => apiCall('GET', `/categories/${id}`),
    create: (data: any) => apiCall('POST', '/categories', data),
    update: (id: string, data: any) => apiCall('PUT', `/categories/${id}`, data),
    delete: (id: string) => apiCall('DELETE', `/categories/${id}`),
  };
};

export const useClients = () => {
  const { apiCall } = useSupabase();

  return {
    getAll: (search?: string) => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      return apiCall('GET', `/clients?${params.toString()}`);
    },
    getById: (id: string) => apiCall('GET', `/clients/${id}`),
    create: (data: any) => apiCall('POST', '/clients', data),
    update: (id: string, data: any) => apiCall('PUT', `/clients/${id}`, data),
    delete: (id: string) => apiCall('DELETE', `/clients/${id}`),
  };
};

export const useOrders = () => {
  const { apiCall } = useSupabase();

  return {
    getAll: (status?: string, clientId?: string) => {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (clientId) params.append('clientId', clientId);
      return apiCall('GET', `/orders?${params.toString()}`);
    },
    getById: (id: string) => apiCall('GET', `/orders/${id}`),
    create: (data: any) => apiCall('POST', '/orders', data),
    updateStatus: (id: string, status: string) =>
      apiCall('PATCH', `/orders/${id}/status`, { status }),
    delete: (id: string) => apiCall('DELETE', `/orders/${id}`),
  };
};

export const useReports = () => {
  const { apiCall } = useSupabase();

  return {
    getSalesReport: (startDate?: string, endDate?: string) => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      return apiCall('GET', `/reports/sales?${params.toString()}`);
    },
    getProductSalesReport: () => apiCall('GET', '/reports/products'),
    getInventoryReport: () => apiCall('GET', '/reports/inventory'),
    getClientReport: () => apiCall('GET', '/reports/clients'),
  };
};
