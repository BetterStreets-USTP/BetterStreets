import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/apiService';
import { getData, saveData } from '../services/storageService';
import { STORAGE_KEYS } from '../utils/constants';
import { registerForPushNotificationsAsync, updatePushToken } from '../services/notificationService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await getData(STORAGE_KEYS.USER_TOKEN);
      const userData = await getData(STORAGE_KEYS.USER_DATA);
      
      if (token && userData) {
        setUser(userData);
        setIsAuthenticated(true);
        
        // Register for push notifications
        registerPushNotifications();
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerPushNotifications = async () => {
    try {
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) {
        await updatePushToken(pushToken);
      }
    } catch (error) {
      console.error('Error registering push notifications:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const result = await apiLogin(email, password);
      if (result.success) {
        setUser(result.data);
        setIsAuthenticated(true);
        
        // Register for push notifications after successful login
        registerPushNotifications();
        
        return { success: true };
      }
      // Pass through requiresVerification flag if present
      return { 
        success: false, 
        error: result.error,
        requiresVerification: result.requiresVerification,
        email: result.email
      };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const result = await apiRegister(userData);
      if (result.success) {
        // Don't authenticate yet if email verification is required
        if (result.requiresVerification) {
          return { 
            success: true, 
            requiresVerification: true,
            email: userData.email 
          };
        }
        
        setUser(result.data);
        setIsAuthenticated(true);
        
        // Register for push notifications after successful registration
        registerPushNotifications();
        
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (userData) => {
    setUser(userData);
    await saveData(STORAGE_KEYS.USER_DATA, userData);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
