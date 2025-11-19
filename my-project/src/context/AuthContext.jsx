import { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, logoutUser, signupUser } from '../services/authService.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  /** ──────────────────────────────────
   *  GLOBAL AUTH STATES
   *  ────────────────────────────────── */
  const [accessToken, setAccessToken] = useState(() => 
    localStorage.getItem('accessToken') || null
  );

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /** ──────────────────────────────────
   *  LOGIN HANDLER
   *  ────────────────────────────────── */
  const handleLogin = async (email, password) => {
    const { accessToken, user } = await loginUser(email, password);

    setAccessToken(accessToken);
    setUser(user);

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
  };

  /** ──────────────────────────────────
   *  SIGNUP HANDLER (INFLUENCER / BRAND)
   *  ────────────────────────────────── */
  const handleSignup = async (formData) => {
    const { accessToken, user } = await signupUser(formData);

    setAccessToken(accessToken);
    setUser(user);

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
  };

  /** ──────────────────────────────────
   *  LOGOUT HANDLER
   *  ────────────────────────────────── */
  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed:", err);
    }

    setAccessToken(null);
    setUser(null);

    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    setIsLoggingOut(false);
  };

  /** ──────────────────────────────────
   *  CROSS TAB AUTH SYNC
   *  ────────────────────────────────── */
  useEffect(() => {
    const syncAuth = (e) => {
      if (e.key === 'accessToken') {
        setAccessToken(e.newValue);
      }
      if (e.key === 'user') {
        setUser(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!accessToken,
      user,
      accessToken,
      login: handleLogin,
      signup: handleSignup,
      logout: handleLogout,
      isLoggingOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/** Convenience Hook */
export const useAuth = () => {
  return useContext(AuthContext);
};
