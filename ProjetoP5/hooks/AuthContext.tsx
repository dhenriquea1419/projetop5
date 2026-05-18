import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'vendedor' | 'representante' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const STORAGE_KEY = '@projetop5:user';

const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Vendedor João',
    email: 'vendedor@farmacia.com',
    role: 'vendedor',
    password: '123456',
  },
  {
    id: '2',
    name: 'Maria Representante',
    email: 'representante@farmacia.com',
    role: 'representante',
    password: '123456',
  },
  {
    id: '3',
    name: 'Admin Farmácia',
    email: 'admin@farmacia.com',
    role: 'admin',
    password: '123456',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
        }
      } catch {
        await AsyncStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setError(null);

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password);

    if (foundUser) {
      const userToSet: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };
      setUser(userToSet);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userToSet));
      } catch {
        // ignore storage failures, keep user session in memory
      }
      return true;
    }

    setError('Credenciais inválidas');
    return false;
  };

  const signOut = () => {
    setUser(null);
    setError(null);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {
      // ignore
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};