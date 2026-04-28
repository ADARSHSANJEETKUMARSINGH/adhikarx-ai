import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('adhikarx_auth');
    if (saved) return JSON.parse(saved);
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('adhikarx_auth', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('adhikarx_auth');
    }
  }, [currentUser]);

  const login = (email, password) => {
    // Mock login logic - in a real app this would verify against a DB
    const users = JSON.parse(localStorage.getItem('adhikarx_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('adhikarx_users') || '[]');
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already exists' };
    }
    
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('adhikarx_users', JSON.stringify(users));
    
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    // Also optional: clear other user data? We'll keep it for now.
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
