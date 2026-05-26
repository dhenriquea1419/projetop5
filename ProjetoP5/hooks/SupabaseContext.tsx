import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Platform } from 'react-native';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { API_CONFIG } from '../constants/api';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_URL ?? API_CONFIG.API_URL;

const createSupabaseClient = async () => {
  if (Platform.OS === 'web') {
    return createClient(supabaseUrl as string, supabaseAnonKey as string);
  }

  const AsyncStorageModule = await import('@react-native-async-storage/async-storage');
  const AsyncStorage = AsyncStorageModule.default ?? AsyncStorageModule;

  return createClient(supabaseUrl as string, supabaseAnonKey as string, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
};

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
  supabase: SupabaseClient | null;
  signup: (email: string, password: string, name: string, role?: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  apiCall: (method: string, path: string, body?: any) => Promise<any>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initSupabase = async () => {
      if (!supabaseUrl || !supabaseAnonKey) {
        setError('Supabase não está configurado');
        setIsLoading(false);
        return;
      }

      try {
        const client = await createSupabaseClient();
        setSupabase(client);
      } catch (err) {
        console.error('Erro ao inicializar Supabase:', err);
        setError('Falha ao conectar ao Supabase');
        setIsLoading(false);
      }
    };

    initSupabase();
  }, []);

  const checkSession = useCallback(async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();

      if (data?.session?.user) {
        const userData: User = {
          id: data.session.user.id,
          email: data.session.user.email ?? '',
          name: data.session.user.user_metadata?.name ?? '',
          role: data.session.user.user_metadata?.role ?? 'vendedor',
        };
        setUser(userData);
      }
    } catch (err) {
      console.error('Erro ao verificar sessão:', err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;

    const run = async () => {
      await checkSession();
    };

    run();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email ?? '',
            name: session.user.user_metadata?.name ?? '',
            role: session.user.user_metadata?.role ?? 'vendedor',
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, checkSession]);

  const apiCall = async (method: string, path: string, body?: any) => {
    if (!apiBaseUrl) {
      throw new Error('API backend não está configurado. Atualize constants/api.ts.');
    }

    const response = await fetch(`${apiBaseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || `Erro de API: ${response.status}`);
    }

    return response.status === 204 ? null : response.json();
  };

  const signup = async (email: string, password: string, name: string, role: string = 'vendedor') => {
    if (!supabase) {
      setError('Supabase não está configurado');
      return false;
    }

    try {
      setError(null);
      setIsLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role } },
      });

      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    if (!supabase) {
      setError('Supabase não está configurado');
      return false;
    }

    try {
      setError(null);
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!supabase) return;

    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
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
        supabase,
        signup,
        login,
        logout,
        apiCall,
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