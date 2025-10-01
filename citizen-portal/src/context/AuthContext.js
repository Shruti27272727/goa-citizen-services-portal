import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // stores logged-in user with valid ID

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Ensure the saved user has an ID
      if (parsedUser?.id) setUser(parsedUser);
      else localStorage.removeItem('user'); // remove invalid user
    }
  }, []);

  // Login function receives backend response containing ID
  const login = (userData) => {
    if (!userData?.id) {
      console.error("Login failed: user ID is missing from backend response.");
      return;
    }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
