"use client";

import React, { createContext, useContext } from "react";

interface AuthContextValue {
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const logout = () => {
    // No-op since there's no authentication needed.
    // Kept for compatibility with components that reference it.
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
