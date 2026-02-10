"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { User, Bot, Globe, Youtube, Copy, Check } from "lucide-react";

export interface ChatMsg {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  type?: "text" | "research" | "youtube";
  researchData?: {
    answer: string;
    results: { title: string; url: string; content: string }[];
  };
  youtubeData?: {
    videos: {
      id: string;
      title: string;
      description: string;
      channel: string;
      thumbnail: string;
      url: string;
    }[];
  };
  isStreaming?: boolean;
}

interface ChatMessageProps {
  message: ChatMsg;
  accentColor: string;
}

export function ChatMessage({ message, accentColor }: ChatMessageProps) {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("group flex gap-3 px-4 py-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          {message.type === "research" ? (
            <Globe className="h-4 w-4 text-foreground" />
          ) : message.type === "youtube" ? (
            <Youtube className="h-4 w-4 text-foreground" />
          ) : (
            <Bot className="h-4 w-4 text-foreground" />
          )}
        </div>
      )}

      <div className={cn("flex max-w-[75%] flex-col gap-1", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "rounded-br-md text-white"
              : "rounded-bl-md bg-muted text-foreground"
          )}
          style={isUser ? { backgroundColor: accentColor } : undefined}
        >
          {/* Research results */}
          {message.type === "research" && message.researchData && (
            <div className="flex flex-col gap-3">
              {message.researchData.answer && (
                <p className="text-sm leading-relaxed">{message.researchData.answer}</p>
              )}
              {message.researchData.results.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sources</span>
                  {message.researchData.results.map((r, i) => (
                    <a
                      key={`${r.url}-${i}`}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col gap-0.5 rounded-lg border border-border bg-background/50 p-2.5 transition-colors hover:bg-background/80"
                    >
                      <span className="text-xs font-medium text-foreground line-clamp-1">{r.title}</span>
                      <span className="text-xs text-muted-foreground line-clamp-2">{r.content}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* YouTube results */}
          {message.type === "youtube" && message.youtubeData && (
            <div className="flex flex-col gap-2">
              {message.youtubeData.videos.map((v) => (
                <a
                  key={v.id}
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 rounded-lg border border-border bg-background/50 p-2 transition-colors hover:bg-background/80"
                >
                  {v.thumbnail && (
                    <img
                      src={v.thumbnail || "/placeholder.svg"}
                      alt={v.title}
                      className="h-16 w-24 shrink-0 rounded-md object-cover"
                      crossOrigin="anonymous"
                    />
                  )}
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className="text-xs font-medium text-foreground line-clamp-2">{v.title}</span>
                    <span className="text-xs text-muted-foreground">{v.channel}</span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Regular text */}
          {(!message.type || message.type === "text") && (
            <span className={isUser ? "text-white" : ""}>
              {message.content}
              {message.isStreaming && <span className="cursor-blink ml-0.5">|</span>}
            </span>
          )}
        </div>

        {/* Copy button for assistant messages */}
        {!isUser && !message.isStreaming && message.content && (
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:text-foreground hover:bg-muted"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      {isUser && (
        <div
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: accentColor }}
        >
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
}
