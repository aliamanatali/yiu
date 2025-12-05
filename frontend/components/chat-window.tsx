"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Send,
  RotateCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Download,
  Share2,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import {
  getConversation,
  getMessages,
  createMessage,
  deleteMessage,
  rateMessage,
  canSendMessage,
  getMessageLimit,
  incrementUsage,
} from "@/lib/storage";
import { Message } from "@/lib/types";

interface ChatWindowProps {
  conversationId: string | null;
  onRefresh: () => void;
}

export function ChatWindow({ conversationId, onRefresh }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      const loadedMessages = getMessages(conversationId);
      setMessages(loadedMessages);
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || !conversationId) return;

    if (!canSendMessage()) {
      const limit = getMessageLimit();
      toast.error(
        `You've reached your daily limit of ${limit} messages. Upgrade to Pro for more!`
      );
      return;
    }

    // Add user message
    const userMessage = createMessage(conversationId, "user", inputValue.trim());
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    incrementUsage();
    onRefresh();

    // Simulate AI response (in a real app, this would call OpenAI API)
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const aiMessage = createMessage(conversationId, "ai", aiResponse);
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
      onRefresh();
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const handleRegenerate = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message || message.sender !== "ai") return;

    // Find the user message that prompted this AI response
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    const userMessage = messages[messageIndex - 1];

    if (userMessage && userMessage.sender === "user" && conversationId) {
      // Delete the old AI message
      deleteMessage(messageId);

      // Generate a new response
      setIsTyping(true);
      setTimeout(() => {
        const aiResponse = generateAIResponse(userMessage.content);
        createMessage(conversationId, "ai", aiResponse);
        const loadedMessages = getMessages(conversationId);
        setMessages(loadedMessages);
        setIsTyping(false);
        toast.success("Response regenerated!");
      }, 1500);
    }
  };

  const handleRate = (messageId: string, rating: "up" | "down") => {
    rateMessage(messageId, rating);
    const loadedMessages = conversationId ? getMessages(conversationId) : [];
    setMessages(loadedMessages);
    toast.success(`Feedback recorded: ${rating === "up" ? "👍" : "👎"}`);
  };

  const confirmDelete = () => {
    if (messageToDelete && conversationId) {
      deleteMessage(messageToDelete);
      const loadedMessages = getMessages(conversationId);
      setMessages(loadedMessages);
      onRefresh();
      toast.success("Message deleted");
    }
    setDeleteDialogOpen(false);
    setMessageToDelete(null);
  };

  const handleExport = () => {
    if (!conversationId) return;
    const conversation = getConversation(conversationId);
    if (!conversation) return;

    let content = `${conversation.title}\n\n`;
    messages.forEach((msg) => {
      const sender = msg.sender === "user" ? "You" : "AI";
      content += `${sender} (${msg.timestamp.toLocaleString()}):\n${msg.content}\n\n`;
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${conversation.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Conversation exported!");
  };

  const conversation = conversationId ? getConversation(conversationId) : null;

  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to AI Chat
          </h2>
          <p className="text-slate-600 mb-6">
            Start a new conversation or select one from the sidebar to continue
            chatting.
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 hover:border-purple-300 transition-colors cursor-pointer">
              <div className="font-semibold mb-1">💡 Get Ideas</div>
              <div className="text-slate-500 text-xs">Brainstorm and explore</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 hover:border-purple-300 transition-colors cursor-pointer">
              <div className="font-semibold mb-1">✍️ Write Content</div>
              <div className="text-slate-500 text-xs">Draft emails & articles</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 hover:border-purple-300 transition-colors cursor-pointer">
              <div className="font-semibold mb-1">🧠 Learn & Research</div>
              <div className="text-slate-500 text-xs">Explain complex topics</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 hover:border-purple-300 transition-colors cursor-pointer">
              <div className="font-semibold mb-1">🔧 Solve Problems</div>
              <div className="text-slate-500 text-xs">Debug code & more</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{conversation?.title}</h3>
            <p className="text-xs text-slate-500">
              {messages.length} {messages.length === 1 ? "message" : "messages"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("text")}>
                  Export as Text
                </DropdownMenuItem>
                <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                <DropdownMenuItem>Export as Markdown</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.sender === "user" ? "justify-end" : ""
              }`}
            >
              {message.sender === "ai" && (
                <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 flex-shrink-0">
                  <AvatarFallback className="text-white font-semibold text-sm">
                    AI
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`flex-1 max-w-2xl ${
                  message.sender === "user" ? "flex justify-end" : ""
                }`}
              >
                <div
                  className={`group relative rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-white border border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                  <div
                    className={`text-xs mt-2 ${
                      message.sender === "user"
                        ? "text-purple-100"
                        : "text-slate-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>

                  {/* Message Actions */}
                  {message.sender === "ai" && (
                    <div className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7"
                        onClick={() => handleCopy(message.content)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7"
                        onClick={() => handleRegenerate(message.id)}
                      >
                        <RotateCw className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`w-7 h-7 ${
                          message.rating === "up" ? "text-green-600" : ""
                        }`}
                        onClick={() => handleRate(message.id, "up")}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`w-7 h-7 ${
                          message.rating === "down" ? "text-red-600" : ""
                        }`}
                        onClick={() => handleRate(message.id, "down")}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {message.sender === "user" && (
                <Avatar className="w-8 h-8 bg-slate-300 flex-shrink-0">
                  <AvatarFallback className="text-slate-700 font-semibold text-sm">
                    U
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4">
              <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 flex-shrink-0">
                <AvatarFallback className="text-white font-semibold text-sm">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              className="min-h-[60px] max-h-[200px] pr-12 resize-none"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            AI can make mistakes. Check important information.
          </p>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Simulated AI response generator (will be replaced with real OpenAI API)
function generateAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return "Hello! I'm your AI assistant. How can I help you today?";
  }

  if (lowerMessage.includes("blog") || lowerMessage.includes("write")) {
    return "I'd be happy to help you with writing! Could you tell me more about what you'd like to write? For example:\n\n• What's the topic?\n• Who's your target audience?\n• What's the desired length?\n• Any specific points you want to cover?\n\nThis will help me create something perfect for your needs!";
  }

  if (lowerMessage.includes("code") || lowerMessage.includes("programming")) {
    return "I can definitely help with coding! Which programming language are you working with, and what would you like to accomplish? Feel free to share your code if you'd like me to review it or help debug an issue.";
  }

  if (lowerMessage.includes("thank")) {
    return "You're welcome! Feel free to ask if you need anything else. I'm here to help! 😊";
  }

  return `I understand you're asking about "${userMessage}". While this is a demo with simulated responses, in the full version I'll be powered by OpenAI's GPT API and able to provide detailed, helpful responses to any question!\n\nFor now, try asking about:\n• Writing blog posts\n• Coding help\n• Or just say hello!\n\nThe real AI integration is coming in the next development phase.`;
}



