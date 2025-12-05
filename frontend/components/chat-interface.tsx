"use client";

import { useState } from "react";
import { ConversationSidebar } from "./conversation-sidebar";
import { ChatWindow } from "./chat-window";
import { Button } from "./ui/button";
import { Menu, PanelLeftClose } from "lucide-react";

export function ChatInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<string | null>("1");

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 ease-in-out overflow-hidden border-r border-slate-200 bg-white shadow-lg`}
      >
        <ConversationSidebar
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Toggle Sidebar Button */}
        {!sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-10"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}

        {/* Chat Window */}
        <ChatWindow conversationId={activeConversationId} />
      </div>
    </div>
  );
}
