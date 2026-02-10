"use client";

import React, { useState } from "react";
import { MacOSWindow } from "./macos-window";
import { useAuth, type TokenSource } from "@/lib/auth-context";
import { Key, ExternalLink, Sparkles, Eye, EyeOff, ArrowRight } from "lucide-react";

export function TokenScreen() {
  const { setAuth } = useAuth();
  const [step, setStep] = useState<"choose" | "input">("choose");
  const [selectedSource, setSelectedSource] = useState<TokenSource | null>(null);
  const [tokenValue, setTokenValue] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSourceSelect = (source: TokenSource) => {
    if (source === "demo") {
      setLoading(true);
      // Demo mode: token is managed server-side via HF_DEMO_TOKEN env var
      setAuth("__demo__", "demo");
      return;
    }
    setSelectedSource(source);
    setStep("input");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenValue.trim()) {
      setError("Please enter your API token");
      return;
    }
    if (!selectedSource) return;
    setAuth(tokenValue.trim(), selectedSource);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      {/* Background pattern */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-muted/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-muted/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {step === "choose" ? (
          <MacOSWindow title="yuuki-chat ~ authenticate" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center gap-8">
              {/* Logo and title */}
              <div className="flex flex-col items-center gap-3 pt-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground">
                  <span className="text-2xl font-bold text-background font-mono">Y</span>
                </div>
                <div className="text-center">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
                    Welcome to Yuuki Chat
                  </h1>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    Choose how to authenticate to start chatting
                  </p>
                </div>
              </div>

              {/* Two big buttons */}
              <div className="grid w-full grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSourceSelect("yuuki-api")}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:bg-muted/50 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background transition-transform group-hover:scale-105">
                    <Key className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-foreground">Yuuki API</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">yuuki-api.vercel.app</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSourceSelect("huggingface")}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:bg-muted/50 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background transition-transform group-hover:scale-105">
                    <ExternalLink className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-foreground">Hugging Face</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">huggingface.co token</div>
                  </div>
                </button>
              </div>

              {/* Small demo button */}
              <button
                type="button"
                onClick={() => handleSourceSelect("demo")}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {loading ? "Connecting..." : "Use demo"}
              </button>
            </div>
          </MacOSWindow>
        ) : (
          <MacOSWindow
            title={`yuuki-chat ~ ${selectedSource === "yuuki-api" ? "yuuki-api token" : "hugging face token"}`}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            onClose={() => { setStep("choose"); setError(""); setTokenValue(""); }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-3 pt-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
                  {selectedSource === "yuuki-api" ? (
                    <Key className="h-5 w-5" />
                  ) : (
                    <ExternalLink className="h-5 w-5" />
                  )}
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-foreground">
                    {selectedSource === "yuuki-api" ? "Enter Yuuki API Token" : "Enter Hugging Face Token"}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {selectedSource === "yuuki-api"
                      ? "Get your token from yuuki-api.vercel.app"
                      : "Get your token from huggingface.co/settings/tokens"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="relative">
                  <input
                    type={showToken ? "text" : "password"}
                    value={tokenValue}
                    onChange={(e) => { setTokenValue(e.target.value); setError(""); }}
                    placeholder={selectedSource === "yuuki-api" ? "yk-xxxxxxxxxx" : "hf_xxxxxxxxxx"}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-10 text-sm text-foreground font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setStep("choose"); setError(""); setTokenValue(""); }}
                  className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-foreground py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  Continue
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </MacOSWindow>
        )}
      </div>
    </div>
  );
}
