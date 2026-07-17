/**
 * Layer:
 * Custom Hook
 *
 * Purpose:
 * Exposes the AuthContext session values, providing current user, token,
 * memberships list, and login/logout trigger methods.
 *
 * Uses:
 * - AuthContext (context object)
 *
 * Returns:
 * - Object: { user, token, storeMemberships, loading, login, register, logout, refreshProfile }
 */

import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

/**
 * Accesses AuthContext authentication credentials and state.
 *
 * Returns:
 * AuthContextValue
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
