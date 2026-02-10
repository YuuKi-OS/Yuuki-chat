"use client";

import { useAuth } from "@/lib/auth-context";
import { TokenScreen } from "@/components/token-screen";
import { ChatWindow } from "@/components/chat-window";

export default function Home() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <TokenScreen />;
  }

  return <ChatWindow />;
}
