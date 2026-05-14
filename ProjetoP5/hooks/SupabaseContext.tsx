import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY

// Only create Supabase client if we have valid credentials and are in browser environment
const supabase = supabaseUrl && supabaseAnonKey && typeof window !== 'undefined' 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

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
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (supabase) {
      checkSession()
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            const userData: User = {
              id: session.user.id,
              email: session.user.email ?? '',
              name: session.user.user_metadata?.name ?? '',
              role: session.user.user_metadata?.role ?? 'vendedor',
            }
            setUser(userData)
          } else {
            setUser(null)
          }
          setIsLoading(false)
        }
      )

      return () => {
        authListener?.subscription.unsubscribe()
      }
    } else {
      setIsLoading(false)
    }
  }, [])

  const checkSession = async () => {
    if (!supabase) return
    
    try {
      setIsLoading(true)
      const { data } = await supabase.auth.getSession()

      if (data?.session?.user) {
        const userData: User = {
          id: data.session.user.id,
          email: data.session.user.email ?? '',
          name: data.session.user.user_metadata?.name ?? '',
          role: data.session.user.user_metadata?.role ?? 'vendedor',
        }
        setUser(userData)
      }
    } catch (err) {
      console.error('Erro ao verificar sessão:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string, role: string = 'vendedor') => {
    if (!supabase) {
      setError('Supabase não está configurado')
      return false
    }
    
    try {
      setError(null)
      setIsLoading(true)

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role } },
      })

      if (error) throw error
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    if (!supabase) {
      setError('Supabase não está configurado')
      return false
    }
    
    try {
      setError(null)
      setIsLoading(true)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    if (!supabase) return
    
    try {
      setIsLoading(true)
      await supabase.auth.signOut()
      setUser(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

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
      }}
    >
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase deve ser usado dentro de SupabaseContextProvider')
  }
  return context
}