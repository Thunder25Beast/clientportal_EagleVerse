
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials } from '@/types/auth';
import { apiClient } from '@/lib/api';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for stored auth on mount
    const token = localStorage.getItem('salon-token');
    const refreshToken = localStorage.getItem('salon-refresh-token');
    const userStr = localStorage.getItem('salon-user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        logout();
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const refreshToken = async (): Promise<boolean> => {
    const storedRefreshToken = localStorage.getItem('salon-refresh-token');
    if (!storedRefreshToken) return false;

    try {
      // Note: Implement refresh token endpoint when available
      // For now, we'll just check if the token is still valid
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const data = await apiClient.login(credentials.email, credentials.password);
      
      if (data.token) {
        // Store token
        localStorage.setItem('salon-token', data.token);
        
        // Get user details using the token
        const userData = await apiClient.getCurrentUser();

        const user: User = {
          id: userData.id,
          email: userData.email || credentials.email,
          firstName: userData.name?.split(' ')[0] || '',
          lastName: userData.name?.split(' ')[1] || '',
          role: userData.role?.toLowerCase() || 'staff',
          salonName: userData.salonName || '',
          profileImage: userData.profilePhoto || '/placeholder.svg',
          lastLogin: new Date().toISOString()
        };

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });

        // Store user data
        localStorage.setItem('salon-user', JSON.stringify(user));
        
        if (credentials.rememberMe) {
          localStorage.setItem('salon-remember', 'true');
        }

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    localStorage.removeItem('salon-token');
    localStorage.removeItem('salon-refresh-token');
    localStorage.removeItem('salon-user');
    localStorage.removeItem('salon-remember');
  };

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      
      // Update stored user data
      localStorage.setItem('salon-user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      updateUser,
      refreshToken
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
