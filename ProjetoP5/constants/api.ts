// ⚠️ IMPORTANTE: Substitua pelos seus valores reais do Supabase!
// Acesse: supabase.com → seu projeto → Settings → API

export const API_CONFIG = {
  // Supabase
  SUPABASE_URL: 'https://seu-projeto.supabase.co', // Ex: https://abcdef123.supabase.co
  SUPABASE_ANON_KEY: 'sua-chave-anonima', // Copie de Settings → API → anon public key
  
  // API Backend
  API_URL: 'http://192.168.1.100:3000/api', // ⚠️ Mude para seu IP local!
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
