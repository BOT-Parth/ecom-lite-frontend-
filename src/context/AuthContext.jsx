import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { API_ENDPOINTS } from '../constants/api';
import { AuthContext } from '../hooks/useAuth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userStores, setUserStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setUserStores([]);
    setLoading(false);
  }, []);

  // Initialize authentication state on startup
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }
      try {
        const profileRes = await api.get(API_ENDPOINTS.AUTH.PROFILE);
        const storesRes = await api.get(API_ENDPOINTS.STORES.MY_LIST);
        if (!cancelled) {
          setUser(profileRes.data?.user || null);
          setUserStores(storesRes.data?.stores || []);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load user profile or stores:', err);
        if (!cancelled) {
          logout();
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
      const { token: userToken, user: userData } = response.data;

      localStorage.setItem('token', userToken);
      setToken(userToken);
      setUser(userData);

      // Load user stores immediately after login
      const storesRes = await api.get(API_ENDPOINTS.STORES.MY_LIST);
      setUserStores(storesRes.data?.stores || []);

      return response;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const register = async (email, username, password) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
      email,
      username,
      password,
    });
    return response;
  };

  const refreshProfile = useCallback(async () => {
    if (token) {
      try {
        const profileRes = await api.get(API_ENDPOINTS.AUTH.PROFILE);
        setUser(profileRes.data?.user || null);
        const storesRes = await api.get(API_ENDPOINTS.STORES.MY_LIST);
        setUserStores(storesRes.data?.stores || []);
      } catch (err) {
        console.error('Failed to refresh profile:', err);
      }
    }
  }, [token]);

  const value = {
    user,
    token,
    userStores,
    loading,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
