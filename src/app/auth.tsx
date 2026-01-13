import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'customer' | 'admin';
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'nura_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setUser(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const fakeNetwork = () => new Promise<void>((resolve) => setTimeout(resolve, 400));

  const login = async (email: string, _password: string) => {
    await fakeNetwork();
    setUser({
      id: email,
      name: email.split('@')[0] || 'Customer',
      email,
      role: 'customer',
    });
  };

  const register = async (name: string, email: string, _password: string) => {
    await fakeNetwork();
    setUser({
      id: email,
      name: name || email.split('@')[0] || 'Customer',
      email,
      role: 'customer',
    });
  };

  const adminLogin = async (email: string, password: string) => {
    await fakeNetwork();
    // Simple admin check - in production, this would be a real API call
    if (email === 'admin@nura.com' && password === 'admin123') {
      setUser({
        id: 'admin',
        name: 'Admin',
        email: 'admin@nura.com',
        role: 'admin',
      });
    } else {
      throw new Error('Invalid admin credentials');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, adminLogin, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}

