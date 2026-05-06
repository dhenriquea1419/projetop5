import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

const mockUsers: Array<User & { password: string }> = [
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
    // Mantemos o comportamento igual em todas as plataformas:
    // o app inicia sempre na tela de login até o usuário efetuar login.
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    console.log('signIn called with:', email);
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
      console.log('user updated:', userToSet);
      return true;
    } else {
      setError('Credenciais inválidas');
      return false;
    }
  };

  const signOut = () => {
    setUser(null);
    setError(null);
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