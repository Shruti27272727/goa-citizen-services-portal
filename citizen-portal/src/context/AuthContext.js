import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
   
      if (parsedUser?.id) setUser(parsedUser);
      else localStorage.removeItem('user'); 
    }
  }, []);

  
  const login = (userData) => {
    if (!userData?.id) {
      console.error("Login failed: user ID is missing from backend response.");
      return;
    }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  
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
