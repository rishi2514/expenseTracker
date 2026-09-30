import React, { createContext, useContext, useState } from "react";
import {
  getAccessToken,
  setAccessToken,
  getUser,
  setUser,
  removeAll,
} from "../utils/storage.js";

// Create a context for authentication
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = getAccessToken();
    return Boolean(token);
  });
  const [user, setCurrentUser] = useState(() => getUser());

  const contextLogin = (token, userData) => {
    if (token) {
      setAccessToken(token);
    }
    if (userData) {
      setUser(userData);
      setCurrentUser(userData);
    }
    setIsAuthenticated(true);
  };

  const contextLogout = () => {
    removeAll();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser: setCurrentUser,
        contextLogin,
        contextLogout,
        login: contextLogin,
        logout: contextLogout,
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
