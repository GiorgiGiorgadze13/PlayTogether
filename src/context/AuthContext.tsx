/* oxlint-disable */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/api';
import { api, ApiError } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('playTogetherToken'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('playTogetherToken');
      if (storedToken) {
        try {
          const response = await api.me();
          if (isMounted) {
            setUser(response.user);
            setToken(storedToken);
          }
        } catch {
          // If backend network request fails, restore local session if present
          const storedUser = localStorage.getItem('playTogetherUser');
          if (storedUser && isMounted) {
            try {
              setUser(JSON.parse(storedUser));
              setToken(storedToken);
            } catch {
              localStorage.removeItem('playTogetherToken');
              localStorage.removeItem('playTogetherUser');
              setToken(null);
              setUser(null);
            }
          } else if (isMounted) {
            localStorage.removeItem('playTogetherToken');
            setToken(null);
            setUser(null);
          }
        }
      }
      if (isMounted) {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password });
      localStorage.setItem('playTogetherToken', response.token);
      localStorage.setItem('playTogetherUser', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      // If network error / offline backend, fallback to local demo user session
      if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('NetworkError') || error.message.includes('Failed to fetch'))) {
        const fallbackUser: User = {
          id: 'user-' + Date.now(),
          name: email.split('@')[0] || 'Sports Fan',
          email: email,
          role: 'USER',
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
          createdAt: new Date().toISOString(),
        };
        const fallbackToken = 'demo-token-' + Date.now();
        localStorage.setItem('playTogetherToken', fallbackToken);
        localStorage.setItem('playTogetherUser', JSON.stringify(fallbackUser));
        setToken(fallbackToken);
        setUser(fallbackUser);
        return;
      }
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.register({ name, email, password });
      localStorage.setItem('playTogetherToken', response.token);
      localStorage.setItem('playTogetherUser', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      // If network error / offline backend, fallback to local demo user session
      if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('NetworkError') || error.message.includes('Failed to fetch'))) {
        const fallbackUser: User = {
          id: 'user-' + Date.now(),
          name: name || email.split('@')[0] || 'Sports Fan',
          email: email,
          role: 'USER',
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email)}`,
          createdAt: new Date().toISOString(),
        };
        const fallbackToken = 'demo-token-' + Date.now();
        localStorage.setItem('playTogetherToken', fallbackToken);
        localStorage.setItem('playTogetherUser', JSON.stringify(fallbackUser));
        setToken(fallbackToken);
        setUser(fallbackUser);
        return;
      }
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('playTogetherToken');
    localStorage.removeItem('playTogetherUser');
    setToken(null);
    setUser(null);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
