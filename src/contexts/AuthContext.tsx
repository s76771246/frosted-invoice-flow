
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { currentUser, users } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => Promise.resolve(false),
  logout: () => {},
  hasPermission: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // In a real app, this would check for a token or session
  useEffect(() => {
    const checkAuth = () => {
      // For demo purposes, we'll auto-login as the CEO
      setUser(currentUser);
      setIsAuthenticated(true);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would call an API
    try {
      const foundUser = users.find(u => u.email === email.toLowerCase());
      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    // Convert to array for easier handling
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // CEO has access to everything
    if (user.role === 'CEO') return true;
    
    // Check if user's role is in the required roles
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
