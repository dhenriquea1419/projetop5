import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const SUPABASE_URL = 'https://seu-projeto.supabase.co'; // Substitua pela sua URL
const SUPABASE_ANON_KEY = 'sua-chave-anonima'; // Substitua pela sua chave

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Configuração da API local
const API_URL = 'http://localhost:3000/api'; // Altere conforme necessário

interface User {
  id: string;
  email: string;
  name: string;
  role: 'vendedor' | 'representante' | 'admin';
}

interface SupabaseContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  supabase: ReturnType<typeof createClient>;
  apiCall: (method: string, endpoint: string, data?: any) => Promise<any>;
  signup: (email: string, password: string, name: string, role?: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Verificar se há sessão ativa ao iniciar
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (data?.session) {
        // Aqui você poderia buscar os dados adicionais do usuário da sua API
        // const response = await fetch(`${API_URL}/auth/me`, {
        //   headers: { Authorization: `Bearer ${data.session.access_token}` },
        // });
        // const userData = await response.json();
        // setUser(userData);
        setToken(data.session.access_token);
      }
    } catch (err) {
      console.error('Erro ao verificar sessão:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para fazer chamadas à API com autenticação
  const apiCall = async (method: string, endpoint: string, data?: any) => {
    try {
      const headers: any = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const options: any = {
        method,
        headers,
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${API_URL}${endpoint}`, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signup = async (email: string, password: string, name: string, role: string = 'vendedor') => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await apiCall('POST', '/auth/signup', {
        email,
        password,
        name,
        role,
      });

      setUser(response.user);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await apiCall('POST', '/auth/login', {
        email,
        password,
      });

      setUser(response.user);
      setToken(response.token);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiCall('POST', '/auth/logout');
      setUser(null);
      setToken(null);
      await supabase.auth.signOut();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SupabaseContext.Provider
      value={{
        user,
        isLoading,
        error,
        token,
        supabase,
        apiCall,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase deve ser usado dentro de SupabaseContextProvider');
  }
  return context;
};
