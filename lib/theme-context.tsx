"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type ThemeMode = "light" | "dark" | "pastel";

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  accentColor: string;
  setAccentColor: (hex: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function YuukiThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("dark");
  const [accentColor, setAccentColorState] = useState("#fafafa");

  useEffect(() => {
    const stored = localStorage.getItem("yuuki-theme-mode") as ThemeMode | null;
    const storedAccent = localStorage.getItem("yuuki-accent-color");
    if (stored) setModeState(stored);
    if (storedAccent) setAccentColorState(storedAccent);
  }, []);

  const applyMode = useCallback((m: ThemeMode) => {
    const html = document.documentElement;
    html.classList.remove("dark", "pastel");
    if (m === "dark") html.classList.add("dark");
    if (m === "pastel") html.classList.add("pastel");
  }, []);

  const applyAccent = useCallback((hex: string) => {
    document.documentElement.style.setProperty("--user-accent", hex);
  }, []);

  useEffect(() => {
    applyMode(mode);
  }, [mode, applyMode]);

  useEffect(() => {
    applyAccent(accentColor);
  }, [accentColor, applyAccent]);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    localStorage.setItem("yuuki-theme-mode", m);
  }, []);

  const setAccentColor = useCallback((hex: string) => {
    setAccentColorState(hex);
    localStorage.setItem("yuuki-accent-color", hex);
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, setMode, accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useYuukiTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useYuukiTheme must be used within YuukiThemeProvider");
  return ctx;
}
