"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

export type TokenSource = "yuuki-api" | "huggingface" | "demo";

interface AuthContextValue {
  token: string | null;
  tokenSource: TokenSource | null;
  setAuth: (token: string, source: TokenSource) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [tokenSource, setTokenSource] = useState<TokenSource | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("yuuki-token");
    const storedSource = localStorage.getItem(
      "yuuki-token-source"
    ) as TokenSource | null;
    if (stored && storedSource) {
      setToken(stored);
      setTokenSource(storedSource);
    }
    setMounted(true);
  }, []);

  const setAuth = useCallback((t: string, source: TokenSource) => {
    setToken(t);
    setTokenSource(source);
    if (source === "demo") {
      // Don't persist demo sessions for security
      localStorage.setItem("yuuki-token", "__demo__");
      localStorage.setItem("yuuki-token-source", "demo");
    } else {
      localStorage.setItem("yuuki-token", t);
      localStorage.setItem("yuuki-token-source", source);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenSource(null);
    localStorage.removeItem("yuuki-token");
    localStorage.removeItem("yuuki-token-source");
  }, []);

  // Prevent flash of token screen before localStorage is read
  if (!mounted) {
    return (
      <AuthContext.Provider
        value={{
          token: null,
          tokenSource: null,
          setAuth,
          logout,
          isAuthenticated: false,
        }}
      >
        {null}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        tokenSource,
        setAuth,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
