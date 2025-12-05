"use client";

import { useState, useEffect } from "react";
import { ConversationSidebar } from "./conversation-sidebar";
import { ChatWindow } from "./chat-window";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { getConversations, initializeDemoData } from "@/lib/storage";

export function ChatInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Initialize demo data if needed
    initializeDemoData();
    
    // Set the first conversation as active
    const conversations = getConversations();
    if (conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, []);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 ease-in-out overflow-hidden border-r border-slate-200 bg-white shadow-lg`}
      >
        <ConversationSidebar
          key={refreshKey}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          onClose={() => setSidebarOpen(false)}
          onRefresh={handleRefresh}
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
        <ChatWindow
          key={`${activeConversationId}-${refreshKey}`}
          conversationId={activeConversationId}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
}
