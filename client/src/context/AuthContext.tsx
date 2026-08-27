import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { AdminService } from '../services/api';

interface AuthContextType {
  isAdmin: boolean;
  adminUser: AdminUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: AdminUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(
    localStorage.getItem('dropyourstories_token') ? { id: 'admin', username: 'admin', name: 'Aarav Sharma' } : null
  );
  const [token, setToken] = useState<string | null>(localStorage.getItem('dropyourstories_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const user = await AdminService.getMe();
          setAdminUser(user || { id: 'admin', username: 'admin', name: 'Aarav Sharma' });
        } catch (err) {
          console.warn('Admin token verification fallback:', err);
          setAdminUser({ id: 'admin', username: 'admin', name: 'Aarav Sharma' });
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (username: string, password: string) => {
    const res = await AdminService.login(username, password);
    localStorage.setItem('dropyourstories_token', res.token);
    setToken(res.token);
    setAdminUser(res.admin || { id: 'admin', username: 'admin', name: 'Aarav Sharma' });
  };

  const logout = () => {
    localStorage.removeItem('dropyourstories_token');
    setToken(null);
    setAdminUser(null);
  };

  const updateUser = (user: AdminUser) => {
    setAdminUser(user);
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin: !!token,
        adminUser,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
