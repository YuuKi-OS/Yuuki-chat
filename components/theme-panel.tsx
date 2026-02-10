"use client";

import React, { useState } from "react";
import { useYuukiTheme, type ThemeMode } from "@/lib/theme-context";
import { Sun, Moon, Palette, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  "#ff6b6b",
  "#ffa07a",
  "#ffd93d",
  "#6bcb77",
  "#4d96ff",
  "#9b59b6",
  "#ff69b4",
  "#00d2d3",
  "#f8b500",
  "#ffffff",
  "#0a0a0a",
  "#c08b6e",
];

const MODES: { id: ThemeMode; label: string; icon: React.ElementType }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "pastel", label: "Pastel", icon: Palette },
];

interface ThemePanelProps {
  open: boolean;
  onClose: () => void;
}

export function ThemePanel({ open, onClose }: ThemePanelProps) {
  const { mode, setMode, accentColor, setAccentColor } = useYuukiTheme();
  const [customHex, setCustomHex] = useState(accentColor);

  const handleHexChange = (val: string) => {
    setCustomHex(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      setAccentColor(val);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">theme settings</span>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-5">
          {/* Mode selection */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Appearance
            </label>
            <div className="grid grid-cols-3 gap-2">
              {MODES.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-xs font-medium transition-all",
                      mode === m.id
                        ? "border-foreground/30 bg-muted text-foreground"
                        : "border-border text-muted-foreground hover:border-foreground/10 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent color */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Accent Color
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => { setAccentColor(color); setCustomHex(color); }}
                  className={cn(
                    "relative h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                    accentColor === color ? "border-foreground" : "border-border"
                  )}
                  style={{ backgroundColor: color }}
                >
                  {accentColor === color && (
                    <Check
                      className="absolute inset-0 m-auto h-3.5 w-3.5"
                      style={{
                        color:
                          color === "#ffffff" || color === "#ffd93d" || color === "#f8b500"
                            ? "#000"
                            : "#fff",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom hex input with color picker */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Custom HEX
            </label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="color"
                  value={customHex.startsWith("#") ? customHex : "#000000"}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
                />
              </div>
              <input
                type="text"
                value={customHex}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#ff6b6b"
                maxLength={7}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Preview
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <div
                className="h-10 w-10 rounded-lg"
                style={{ backgroundColor: accentColor }}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">Yuuki Chat</div>
                <div className="text-xs text-muted-foreground font-mono">{accentColor}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
