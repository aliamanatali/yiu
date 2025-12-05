"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  PanelLeftClose,
  Plus,
  Search,
  MessageSquare,
  MoreVertical,
  Pencil,
  Trash2,
  Archive,
  Pin,
  Settings,
  CreditCard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// Placeholder data
const placeholderConversations = [
  {
    id: "1",
    title: "Writing a Blog Post",
    preview: "Can you help me write a blog post about productivity?",
    timestamp: "2 hours ago",
    isPinned: true,
  },
  {
    id: "2",
    title: "Python Code Review",
    preview: "I have some Python code that needs review...",
    timestamp: "Yesterday",
    isPinned: false,
  },
  {
    id: "3",
    title: "Marketing Ideas",
    preview: "What are some creative marketing strategies for...",
    timestamp: "2 days ago",
    isPinned: false,
  },
  {
    id: "4",
    title: "Resume Writing",
    preview: "Help me improve my resume for a software...",
    timestamp: "3 days ago",
    isPinned: false,
  },
  {
    id: "5",
    title: "Recipe Suggestions",
    preview: "Can you suggest some healthy dinner recipes?",
    timestamp: "1 week ago",
    isPinned: false,
  },
];

interface ConversationSidebarProps {
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onClose: () => void;
}

export function ConversationSidebar({
  activeConversationId,
  onSelectConversation,
  onClose,
}: ConversationSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = placeholderConversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600">
              <AvatarFallback className="text-white font-semibold text-sm">AI</AvatarFallback>
            </Avatar>
            <h2 className="font-semibold text-lg">AI Chat</h2>
          </div>
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Subscription & Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={onClose}>
              <PanelLeftClose className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* New Chat Button */}
        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`group relative p-3 rounded-lg mb-1 cursor-pointer transition-all ${
                  activeConversationId === conversation.id
                    ? "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {conversation.isPinned && (
                        <Pin className="w-3 h-3 text-purple-600 fill-purple-600" />
                      )}
                      <h3 className="font-medium text-sm truncate">{conversation.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{conversation.preview}</p>
                    <span className="text-xs text-slate-400 mt-1 block">
                      {conversation.timestamp}
                    </span>
                  </div>

                  {/* More Options */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="w-4 h-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pin className="w-4 h-4 mr-2" />
                        {conversation.isPinned ? "Unpin" : "Pin"}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Usage Info */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="text-xs text-slate-600 mb-2">
          <div className="flex justify-between mb-1">
            <span>Messages today:</span>
            <span className="font-semibold">15 / 20</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs border-purple-200 hover:bg-purple-50"
        >
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
}
