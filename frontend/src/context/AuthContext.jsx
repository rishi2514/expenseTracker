import { createContext, useContext, useEffect, useState } from "react";
import {
  getAccessToken,
  setAccessToken,
  getUser,
  setUser as persistUser,
  removeAll,
} from "../utils/storage.js";
import { getMe } from "../api/users.js";

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
      persistUser(userData);
      setCurrentUser(userData);
    }
    setIsAuthenticated(true);
  };

  const contextLogout = () => {
    removeAll();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Updates the user both in memory and in localStorage (profile / avatar edits).
  const updateUser = (userData) => {
    if (!userData) return;
    persistUser(userData);
    setCurrentUser(userData);
  };

  // Sync the stored profile with the backend once on mount so stale data
  // (renames, new avatar) is refreshed. The client handles token refresh.
  useEffect(() => {
    if (!getAccessToken()) return undefined;
    let stale = false;

    getMe()
      .then((response) => {
        const me = response?.data;
        if (!stale && me) {
          persistUser(me);
          setCurrentUser(me);
        }
      })
      .catch(() => {
        // Silently ignore — the interceptor already handles expired sessions.
      });

    return () => {
      stale = true;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser: setCurrentUser,
        updateUser,
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
