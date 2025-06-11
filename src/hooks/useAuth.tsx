
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo
const MOCK_USER: User = {
  id: '1',
  email: 'salon@example.com',
  firstName: 'Sarah',
  lastName: 'Johnson',
  role: 'owner',
  salonName: 'Glow Beauty Studio',
  profileImage: '/placeholder.svg'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for stored auth on mount
    const storedAuth = localStorage.getItem('salon-auth');
    if (storedAuth) {
      const { user, rememberMe } = JSON.parse(storedAuth);
      if (rememberMe || sessionStorage.getItem('salon-session')) {
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        return;
      }
    }
    setAuthState(prev => ({ ...prev, isLoading: false }));
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Mock authentication - replace with real API call
    console.log('Attempting login with:', credentials);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (credentials.email === 'salon@example.com' && credentials.password === 'password') {
      const user = { ...MOCK_USER, lastLogin: new Date().toISOString() };
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });

      // Store auth state
      if (credentials.rememberMe) {
        localStorage.setItem('salon-auth', JSON.stringify({ user, rememberMe: true }));
      } else {
        sessionStorage.setItem('salon-session', 'true');
      }

      return true;
    }
    
    return false;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    localStorage.removeItem('salon-auth');
    sessionStorage.removeItem('salon-session');
  };

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      
      // Update stored auth if exists
      const storedAuth = localStorage.getItem('salon-auth');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        localStorage.setItem('salon-auth', JSON.stringify({ ...parsed, user: updatedUser }));
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
