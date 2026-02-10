"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Cpu } from "lucide-react";

const MODELS = [
  { id: "yuuki-best", name: "Yuuki Best", tag: "Flagship" },
  { id: "yuuki-3.7", name: "Yuuki 3.7", tag: "Balanced" },
  { id: "yuuki-v0.1", name: "Yuuki v0.1", tag: "Fast" },
];

interface ModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const selected = MODELS.find((m) => m.id === value) || MODELS[0];

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
        {selected.name}
        <ChevronDown
          className={cn(
            "h-3 w-3 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1.5 min-w-[200px] overflow-hidden rounded-xl border border-border bg-card shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
          {MODELS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                onChange(m.id);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted",
                m.id === value && "bg-muted/50"
              )}
            >
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{m.name}</span>
              </div>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                {m.tag}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
