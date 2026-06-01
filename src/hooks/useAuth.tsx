import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  cnh: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(token: string, user: User): Promise<void>;
  signOut(): Promise<void>;
  updateUserId(newId: number): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storageUser = await AsyncStorage.getItem('@AstroTrack:user');
      const storageToken = await AsyncStorage.getItem('@AstroTrack:token');

      if (storageUser && storageToken) {
        setUser(JSON.parse(storageUser));
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function signIn(token: string, user: User) {
    await AsyncStorage.setItem('@AstroTrack:token', token);
    await AsyncStorage.setItem('@AstroTrack:user', JSON.stringify(user));
    setUser(user);
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUser(null);
  }

  async function updateUserId(newId: number) {
    if (user) {
      const newUser = { ...user, id: newId };
      await AsyncStorage.setItem('@AstroTrack:user', JSON.stringify(newUser));
      setUser(newUser);
    }
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut, updateUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
