"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MacOSWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export function MacOSWindow({
  title,
  children,
  className,
  bodyClassName,
  noPadding,
  onClose,
  onMinimize,
  onMaximize,
}: MacOSWindowProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-2xl",
        className
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={onClose}
            className="h-3 w-3 rounded-full bg-[#ff5f57] transition-opacity hover:opacity-80"
            aria-label="Close"
          />
          <button
            type="button"
            onClick={onMinimize}
            className="h-3 w-3 rounded-full bg-[#febc2e] transition-opacity hover:opacity-80"
            aria-label="Minimize"
          />
          <button
            type="button"
            onClick={onMaximize}
            className="h-3 w-3 rounded-full bg-[#28c840] transition-opacity hover:opacity-80"
            aria-label="Maximize"
          />
        </div>
        <span className="flex-1 text-center text-xs text-muted-foreground font-mono select-none">
          {title}
        </span>
        <div className="w-[52px]" />
      </div>
      {/* Content */}
      <div className={cn(noPadding ? "" : "p-6", bodyClassName)}>
        {children}
      </div>
    </div>
  );
}
