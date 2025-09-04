import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'user' | 'owner';
  profileImage?: string;
  phone?: string;
  bio?: string;
  placeName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, userType: 'user' | 'owner') => Promise<void>;
  register: (email: string, password: string, name: string, userType?: 'user' | 'owner', phone?: string, placeName?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, userType: 'user' | 'owner') => {
    // Default userType to 'user' for login
    const userData: User = {
      id: Math.random().toString(),
      email,
      name: email.split('@')[0],
      userType: 'user',
    };
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (email: string, password: string, name: string, userType: 'user' | 'owner' = 'user', phone?: string, placeName?: string) => {
    const userData: User = {
      id: Math.random().toString(),
      email,
      name,
      userType,
      phone,
      placeName,
    };
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    if (userType === 'owner') {
      router.replace('/first-venue-setup');
    } else {
      router.replace('/(tabs)');
    }
  };

  const resetPassword = async (email: string) => {
    console.log('resetPassword requested for', email);
    return Promise.resolve();
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}