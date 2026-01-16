import { createContext, useContext, useState, useEffect } from 'react';
import { api, authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = api.getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.me();
      setUser(response.data);
    } catch (err) {
      api.setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await authApi.login(email, password);
      api.setToken(response.data.token);
      setUser(response.data.user);
      return response.data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      api.setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await authApi.updateProfile(data);
      setUser(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    checkAuth,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'super_admin',
    isClientAdmin: user?.role === 'client_admin',
    isClientUser: user?.role === 'client_user',
    isReadOnly: user?.role === 'read_only',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
