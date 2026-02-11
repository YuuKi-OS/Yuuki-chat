"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useYuukiTheme } from "@/lib/theme-context";
import { ChatMessage, type ChatMsg } from "./chat-message";
import { ModelSelector } from "./model-selector";
import { ThemePanel } from "./theme-panel";
import {
  Send,
  Palette,
  Globe,
  Youtube,
  Loader2,
  Plus,
  Trash2,
  MessageSquare,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  messages: ChatMsg[];
}

export function ChatWindow() {
  const { accentColor } = useYuukiTheme();

  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "1", title: "New Chat", messages: [] },
  ]);
  const [activeConvId, setActiveConvId] = useState("1");
  const [model, setModel] = useState("yuuki-best");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [researchEnabled, setResearchEnabled] = useState(false);
  const [youtubeEnabled, setYoutubeEnabled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const messages = activeConv.messages;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const updateMessages = (convId: string, msgs: ChatMsg[]) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, messages: msgs } : c))
    );
  };

  const updateTitle = (convId: string, firstMsg: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId && c.title === "New Chat"
          ? { ...c, title: firstMsg.slice(0, 30) + (firstMsg.length > 30 ? "..." : "") }
          : c
      )
    );
  };

  const createNewChat = () => {
    const id = Date.now().toString();
    setConversations((prev) => [...prev, { id, title: "New Chat", messages: [] }]);
    setActiveConvId(id);
    setSidebarOpen(false);
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (next.length === 0) {
        const newConv = { id: Date.now().toString(), title: "New Chat", messages: [] };
        setActiveConvId(newConv.id);
        return [newConv];
      }
      if (id === activeConvId) setActiveConvId(next[0].id);
      return next;
    });
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMsg = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    const newMessages = [...messages, userMsg];
    updateMessages(activeConvId, newMessages);
    updateTitle(activeConvId, input.trim());

    const currentInput = input.trim();
    setInput("");
    setLoading(true);

    // Resize textarea
    if (inputRef.current) inputRef.current.style.height = "auto";

    try {
      // If research is enabled, do a parallel research call
      if (researchEnabled) {
        const resRes = await fetch("/api/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: currentInput }),
        });
        const resData = await resRes.json();

        if (resRes.ok) {
          const researchMsg: ChatMsg = {
            id: `res-${Date.now()}`,
            role: "assistant",
            content: resData.answer || "Research completed",
            type: "research",
            researchData: resData,
          };
          const updated = [...newMessages, researchMsg];
          updateMessages(activeConvId, updated);
          setLoading(false);
          return;
        }
      }

      // If YouTube is enabled, do a YouTube search
      if (youtubeEnabled) {
        const ytRes = await fetch("/api/youtube", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: currentInput }),
        });
        const ytData = await ytRes.json();

        if (ytRes.ok && ytData.videos?.length > 0) {
          const ytMsg: ChatMsg = {
            id: `yt-${Date.now()}`,
            role: "assistant",
            content: `Found ${ytData.videos.length} videos for "${currentInput}"`,
            type: "youtube",
            youtubeData: ytData,
          };
          const updated = [...newMessages, ytMsg];
          updateMessages(activeConvId, updated);
          setLoading(false);
          return;
        }
      }

      // Default: chat with model
      const streamingMsg: ChatMsg = {
        id: `ast-${Date.now()}`,
        role: "assistant",
        content: "",
        isStreaming: true,
      };
      updateMessages(activeConvId, [...newMessages, streamingMsg]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          model,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg: ChatMsg = {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `Error: ${data.error || "Something went wrong"}`,
        };
        updateMessages(activeConvId, [...newMessages, errorMsg]);
      } else {
        const assistantMsg: ChatMsg = {
          id: data.id || `ast-${Date.now()}`,
          role: "assistant",
          content: data.content,
        };
        updateMessages(activeConvId, [...newMessages, assistantMsg]);
      }
    } catch (err) {
      const errorMsg: ChatMsg = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `Connection error: ${err instanceof Error ? err.message : "Please try again"}`,
      };
      updateMessages(activeConvId, [...newMessages, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto resize
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 150) + "px";
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground">
              <span className="text-xs font-bold text-background font-mono">Y</span>
            </div>
            <span className="text-sm font-semibold text-foreground">Yuuki Chat</span>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="text-muted-foreground hover:text-foreground md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* New chat button */}
        <div className="p-3">
          <button
            type="button"
            onClick={createNewChat}
            className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3">
          <div className="flex flex-col gap-0.5">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={cn(
                  "group flex items-center gap-2 rounded-lg px-3 py-2 transition-colors cursor-pointer",
                  conv.id === activeConvId
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                onClick={() => {
                  setActiveConvId(conv.id);
                  setSidebarOpen(false);
                }}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                <span className="flex-1 truncate text-sm">{conv.title}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar footer */}
        <div className="border-t border-border p-3 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setThemeOpen(true)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Palette className="h-4 w-4" />
            Theme
          </button>

        </div>
      </aside>

      {/* Main chat area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-border glass px-4 py-2.5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted md:hidden"
            >
              <Settings className="h-4 w-4" />
            </button>
            <ModelSelector value={model} onChange={setModel} />
            <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              open
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Research toggle */}
            <button
              type="button"
              onClick={() => { setResearchEnabled(!researchEnabled); setYoutubeEnabled(false); }}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all",
                researchEnabled
                  ? "border-foreground/20 bg-muted text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/10"
              )}
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Research</span>
            </button>

            {/* YouTube toggle */}
            <button
              type="button"
              onClick={() => { setYoutubeEnabled(!youtubeEnabled); setResearchEnabled(false); }}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all",
                youtubeEnabled
                  ? "border-foreground/20 bg-muted text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/10"
              )}
            >
              <Youtube className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">YouTube</span>
            </button>

            {/* Theme button (desktop only) */}
            <button
              type="button"
              onClick={() => setThemeOpen(true)}
              className="hidden md:flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/10"
            >
              <Palette className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <span className="text-2xl font-bold text-foreground font-mono">Y</span>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground">Yuuki Chat</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {researchEnabled
                    ? "Research mode is active. Ask anything to search the web."
                    : youtubeEnabled
                      ? "YouTube mode is active. Search for videos."
                      : `Using ${model.replace("yuuki-", "Yuuki ")} model. Start typing to chat.`
                  }
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {["Tell me about yourself", "Write a short poem", "Explain quantum computing"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setInput(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} accentColor={accentColor} />
              ))}
              {loading && (
                <div className="flex items-center gap-3 px-4 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin text-foreground" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-border glass p-4">
          <div className="mx-auto max-w-3xl">
            {/* Active mode indicator */}
            {(researchEnabled || youtubeEnabled) && (
              <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                {researchEnabled && (
                  <>
                    <Globe className="h-3 w-3" />
                    <span>Research mode active - results from Tavily</span>
                  </>
                )}
                {youtubeEnabled && (
                  <>
                    <Youtube className="h-3 w-3" />
                    <span>YouTube mode active - searching videos</span>
                  </>
                )}
              </div>
            )}
            <div className="flex items-end gap-2">
              <div className="flex-1 rounded-xl border border-border bg-card transition-colors focus-within:border-foreground/20">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    researchEnabled
                      ? "Search the web..."
                      : youtubeEnabled
                        ? "Search YouTube..."
                        : "Message Yuuki..."
                  }
                  rows={1}
                  className="w-full resize-none bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                  disabled={loading}
                />
              </div>
              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: accentColor }}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="mt-2 text-center">
              <span className="text-[10px] text-muted-foreground/60">
                Yuuki Chat can make mistakes. Verify important information.
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Theme panel */}
      <ThemePanel open={themeOpen} onClose={() => setThemeOpen(false)} />
    </div>
  );
}
