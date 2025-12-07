import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthState } from '../types';
import { AUTH_KEY, ADMIN_EMAIL, ADMIN_PASSWORD_MOCK, DATA_USERS_KEY } from '../constants';

interface AuthContextType extends AuthState {
  login: (email: string, password?: string) => Promise<boolean>;
  googleLogin: () => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  updateProfile: (data: { name?: string; avatar?: string }) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_KEY);
    if (storedAuth) {
      try {
        const parsedUser = JSON.parse(storedAuth);
        // Basic check if user is banned (in a real app, this would be an API call)
        const storedUsers = JSON.parse(localStorage.getItem(DATA_USERS_KEY) || '[]');
        const freshUser = storedUsers.find((u: User) => u.id === parsedUser.id);
        
        if (freshUser && freshUser.isBanned) {
          localStorage.removeItem(AUTH_KEY);
          setState({ user: null, isAuthenticated: false, isLoading: false });
        } else {
          // Update local state with fresh data from "DB" if available, to keep sync
          const userToUse = freshUser || parsedUser;
          setState({ user: userToUse, isAuthenticated: true, isLoading: false });
        }
      } catch (e) {
        localStorage.removeItem(AUTH_KEY);
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD_MOCK) {
      const adminUser: User = {
        id: 'admin_001',
        name: 'John Admin',
        email: ADMIN_EMAIL,
        role: UserRole.ADMIN,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(adminUser));
      setState({ user: adminUser, isAuthenticated: true, isLoading: false });
      return true;
    }

    // Check against mock users
    const storedUsers = JSON.parse(localStorage.getItem(DATA_USERS_KEY) || '[]');
    const existingUser = storedUsers.find((u: User) => u.email === email);

    if (existingUser) {
      if (existingUser.isBanned) {
        alert("This account has been banned by the administrator.");
        return false;
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(existingUser));
      setState({ user: existingUser, isAuthenticated: true, isLoading: false });
      return true;
    }

    // For demo purposes, if it's not admin and not found, fail (user must register)
    return false;
  };

  const register = async (name: string, email: string, password?: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const storedUsers = JSON.parse(localStorage.getItem(DATA_USERS_KEY) || '[]');
    if (storedUsers.find((u: User) => u.email === email)) {
      return false; // Already exists
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      role: UserRole.USER,
      createdAt: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=D4AF37&color=fff`
    };

    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem(DATA_USERS_KEY, JSON.stringify(updatedUsers));
    
    // Auto login after register
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    setState({ user: newUser, isAuthenticated: true, isLoading: false });
    return true;
  };

  const googleLogin = async (): Promise<boolean> => {
    // Simulate Google OAuth Popup and Processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, we'd get this data from the Google ID Token
    const mockGoogleUser = {
      name: "Google User",
      email: "user@gmail.com", // Simulating a google email
      avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c"
    };

    // Check if user exists, else register them
    const storedUsers = JSON.parse(localStorage.getItem(DATA_USERS_KEY) || '[]');
    let user = storedUsers.find((u: User) => u.email === mockGoogleUser.email);

    if (!user) {
      user = {
        id: `user_google_${Date.now()}`,
        name: mockGoogleUser.name,
        email: mockGoogleUser.email,
        role: UserRole.USER,
        createdAt: new Date().toISOString(),
        avatar: mockGoogleUser.avatar
      };
      const updatedUsers = [...storedUsers, user];
      localStorage.setItem(DATA_USERS_KEY, JSON.stringify(updatedUsers));
    }

    if (user.isBanned) {
      alert("This account has been banned.");
      return false;
    }

    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
    return true;
  };

  const updateProfile = async (data: { name?: string; avatar?: string }): Promise<void> => {
    if (!state.user) return;

    await new Promise(resolve => setTimeout(resolve, 500)); // Sim delay

    const updatedUser = { ...state.user, ...data };
    
    // Update Session
    localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
    setState(prev => ({ ...prev, user: updatedUser }));

    // Update "Database"
    const storedUsers = JSON.parse(localStorage.getItem(DATA_USERS_KEY) || '[]');
    const updatedUsersList = storedUsers.map((u: User) => 
        u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem(DATA_USERS_KEY, JSON.stringify(updatedUsersList));
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, verify oldPassword here.
    // For mock, we always succeed.
    return true;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, googleLogin, register, updateProfile, changePassword, logout }}>
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