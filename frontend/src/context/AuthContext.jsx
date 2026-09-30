import React, { createContext, useContext, useState } from "react";
import { getAccessToken, setAccessToken, removeAll } from "../utils/storage.js";

// Create a context for authentication
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = getAccessToken();
    return Boolean(token);
  });

  const login = (token) => {
    if (token) {
      setAccessToken(token);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeAll();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
