/**
 * Layer:
 * Context
 *
 * Purpose:
 * Provides global authentication state, token storage, and session lifecycle utilities.
 *
 * Used By:
 * - App.jsx (via AuthProvider wrapping)
 * - useAuth.js (hook)
 *
 * Uses:
 * - api.js (Axios client)
 * - API_ENDPOINTS (constants)
 *
 * Backend APIs:
 * - GET /auth/profile (profile retrieval/validation)
 * - POST /auth/login (authentication)
 * - POST /auth/register (registration)
 */

import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { API_ENDPOINTS } from "../constants/api";
import { AuthContext } from "../hooks/useAuth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  /**
   * Logs out the current user by destroying the local session.
   *
   * Called:
   * - On user logout action click
   * - Automatically when API requests encounter token errors (401)
   */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setLoading(false);
  }, []);

  // Initialize authentication state on startup using profile endpoint.
  // The /auth/profile response already contains the full authorization context
  // (platformRole + storeMemberships) — no separate /stores/my call is needed.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }
      try {
        const profileRes = await api.get(API_ENDPOINTS.AUTH.PROFILE);
        if (!cancelled) {
          setUser(profileRes.data?.user || null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
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

  /**
   * Performs authentication using email and password.
   *
   * Called:
   * - During Login form submission
   *
   * Parameters:
   * - email (string)
   * - password (string)
   *
   * Returns:
   * Promise<Object> The authenticated user's profile metadata.
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      // response is the unwrapped body: { token, user }
      // user already contains authorization.platformRole and authorization.storeMemberships
      const { token: userToken, user: userData } = response.data;

      localStorage.setItem("token", userToken);
      setToken(userToken);
      setUser(userData);
      setLoading(false);

      return userData;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  /**
   * Registers a new user.
   *
   * Called:
   * - During Register form submission
   *
   * Parameters:
   * - email (string)
   * - username (string)
   * - password (string)
   *
   * Returns:
   * Promise<Object> The API response payload.
   */
  const register = async (email, username, password) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
      email,
      username,
      password,
    });
    return response;
  };

  /**
   * Refreshes the user profile object in memory.
   *
   * Called:
   * - After store request submission/approvals to reload roles
   *
   * Returns:
   * Promise<void>
   */
  const refreshProfile = useCallback(async () => {
    if (token) {
      try {
        const profileRes = await api.get(API_ENDPOINTS.AUTH.PROFILE);
        setUser(profileRes.data?.user || null);
      } catch (err) {
        console.error("Failed to refresh profile:", err);
      }
    }
  }, [token]);

  // Derive store memberships directly from user authorization context.
  // This is the single source of truth — no separate API call needed.
  const storeMemberships = user?.authorization?.storeMemberships || [];

  const value = {
    user,
    token,
    storeMemberships,
    loading,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
