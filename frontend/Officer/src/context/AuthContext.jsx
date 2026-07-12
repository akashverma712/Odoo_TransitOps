import React, { createContext, useState, useContext, useEffect } from 'react';

// ✅ Export AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Demo login - any password works
      let role = 'Admin';
      let name = 'Admin User';
      
      if (email.includes('manager')) {
        role = 'Fleet Manager';
        name = 'Fleet Manager';
      } else if (email.includes('driver')) {
        role = 'Driver';
        name = 'Driver User';
      } else if (email.includes('safety')) {
        role = 'Safety Officer';
        name = 'Safety Officer';
      } else if (email.includes('finance')) {
        role = 'Financial Analyst';
        name = 'Financial Analyst';
      }
      
      const userData = {
        id: 1,
        name: name,
        email: email,
        role: role
      };
      
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  };

  const signup = async (userData) => {
    try {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for easy usage
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};