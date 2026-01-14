import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

export interface User {
  id: string;
  name: string | null;
  email: string;
  phone?: string | null;
  role?: 'customer' | 'admin';
  address?: string | null;
  apartment?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
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

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    if (response.success && response.data) {
      const userData = response.data;
      setUser({
        id: userData.id,
        name: userData.name || email.split('@')[0] || 'Customer',
        email: userData.email,
        phone: userData.phone,
        role: userData.role === 'admin' ? 'admin' : 'customer',
        address: userData.address,
        apartment: userData.apartment,
        city: userData.city,
        state: userData.state,
        zipCode: userData.zipCode,
        country: userData.country,
      });
    } else {
      throw new Error(response.error || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const response = await api.register({ name, email, password, phone });
    if (response.success && response.data) {
      const userData = response.data;
      setUser({
        id: userData.id,
        name: userData.name || name || email.split('@')[0] || 'Customer',
        email: userData.email,
        phone: userData.phone,
        role: userData.role === 'admin' ? 'admin' : 'customer',
        address: userData.address,
        apartment: userData.apartment,
        city: userData.city,
        state: userData.state,
        zipCode: userData.zipCode,
        country: userData.country,
      });
    } else {
      throw new Error(response.error || 'Registration failed');
    }
  };

  const adminLogin = async (email: string, password: string) => {
    // Try to login - if user has admin role, it will work
    const response = await api.login({ email, password });
    if (response.success && response.data) {
      const userData = response.data;
      if (userData.role === 'admin') {
        setUser({
          id: userData.id,
          name: userData.name || 'Admin',
          email: userData.email,
          phone: userData.phone,
          role: 'admin',
          address: userData.address,
          apartment: userData.apartment,
          city: userData.city,
          state: userData.state,
          zipCode: userData.zipCode,
          country: userData.country,
        });
      } else {
        throw new Error('Access denied. Admin privileges required.');
      }
    } else {
      throw new Error(response.error || 'Invalid admin credentials');
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

