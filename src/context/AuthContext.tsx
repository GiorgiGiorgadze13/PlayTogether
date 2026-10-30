import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/api';
import { api, ApiError } from '../services/api';

export interface SavedCard {
  last4: string;
  type: 'visa' | 'mastercard' | 'amex' | 'generic';
  holderName: string;
  expiry: string;
}

const CARD_STORAGE_KEY = 'playTogether_payment_card';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  savedCard: SavedCard | null;
  hasPaymentCard: boolean;
  saveCard: (card: SavedCard) => void;
  removeCard: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('playTogetherToken'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [savedCard, setSavedCard] = useState<SavedCard | null>(() => {
    try { const s = localStorage.getItem(CARD_STORAGE_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  });

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
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('NetworkError') || error.message.includes('Failed to fetch'))) {
        throw new Error('Cannot connect to server. Please ensure the backend is running and try again.');
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
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('NetworkError') || error.message.includes('Failed to fetch'))) {
        throw new Error('Cannot connect to server. Please ensure the backend is running and try again.');
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

  const saveCard = (card: SavedCard) => {
    localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(card));
    setSavedCard(card);
  };

  const removeCard = () => {
    localStorage.removeItem(CARD_STORAGE_KEY);
    setSavedCard(null);
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
        isAdmin: !!user && user.role === 'ADMIN',
        isLoading,
        login,
        register,
        logout,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        savedCard,
        hasPaymentCard: !!savedCard,
        saveCard,
        removeCard,
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
