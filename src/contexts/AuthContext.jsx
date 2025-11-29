import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService, sessionService, initializeStorage } from '../utils/storage';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize storage with default data
    initializeStorage();

    // Check for existing session
    const currentUser = sessionService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const user = userService.getByEmail(email);

      if (!user) {
        throw new Error('User not found');
      }

      if (user.password !== password) {
        throw new Error('Invalid password');
      }

      // Don't store password in session
      const { password: _, ...userWithoutPassword } = user;

      setUser(userWithoutPassword);
      sessionService.setCurrentUser(userWithoutPassword);

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // Check if user already exists
      const existingUser = userService.getByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = userService.create(userData);

      // Don't store password in session
      const { password: _, ...userWithoutPassword } = newUser;

      setUser(userWithoutPassword);
      sessionService.setCurrentUser(userWithoutPassword);

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    sessionService.clearCurrentUser();
  };

  const updateProfile = (updatedData) => {
    try {
      const updatedUser = userService.update(user.id, updatedData);
      const { password: _, ...userWithoutPassword } = updatedUser;
      setUser(userWithoutPassword);
      sessionService.setCurrentUser(userWithoutPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isHost: user?.role === 'host',
    isTourist: user?.role === 'tourist',
    isGuide: user?.role === 'guide'
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
