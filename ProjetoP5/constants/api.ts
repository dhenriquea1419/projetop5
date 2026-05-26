// ⚠️ IMPORTANTE: Substitua pelos valores reais do Supabase se necessário.
// Acesse: supabase.com → seu projeto → Settings → API

export const API_CONFIG = {
  // Supabase
  SUPABASE_URL: 'http://127.0.0.1:54321',
  SUPABASE_ANON_KEY: '',

  // API Backend
  API_URL: 'http://localhost:3000/api',
  API_TIMEOUT: 10000, // 10 segundos
};

// Status dos pedidos
export const ORDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  SHIPPED: 'shipped',
};

// Papéis de usuário
export const USER_ROLES = {
  VENDEDOR: 'vendedor',
  REPRESENTANTE: 'representante',
  ADMIN: 'admin',
};

// Mensagens de erro comuns
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  AUTH_ERROR: 'Erro de autenticação. Verifique suas credenciais.',
  SERVER_ERROR: 'Erro do servidor. Tente novamente mais tarde.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
};
