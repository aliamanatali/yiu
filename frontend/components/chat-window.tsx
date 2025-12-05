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
import { toast } from "sonner";

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

// Placeholder messages
const placeholderMessages: Message[] = [
  {
    id: "1",
    sender: "user",
    content: "Can you help me write a blog post about productivity?",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    sender: "ai",
    content: `I'd be happy to help you write a blog post about productivity! To make it perfect for your audience, could you tell me:

1. Who is your target audience? (e.g., entrepreneurs, students, remote workers)
2. What aspect of productivity do you want to focus on? (e.g., time management, tools, habits)
3. What length are you aiming for? (e.g., 500 words, 1000 words)
4. Do you have any specific points or personal experiences you'd like to include?

This will help me create a blog post that resonates with your readers!`,
    timestamp: "10:30 AM",
  },
  {
    id: "3",
    sender: "user",
    content: "I want to write for remote workers, focusing on time management techniques. Around 800 words would be good.",
    timestamp: "10:32 AM",
  },
  {
    id: "4",
    sender: "ai",
    content: `Perfect! Here's a draft blog post for remote workers about time management:

---

**Mastering Time Management: A Remote Worker's Guide to Peak Productivity**

Working remotely offers incredible freedom, but it also comes with unique challenges. Without the structure of an office environment, managing your time effectively becomes crucial. Here are proven strategies to help you maximize productivity while maintaining work-life balance.

**1. The Power of Time Blocking**

Time blocking is a game-changer for remote workers. Instead of juggling multiple tasks, dedicate specific blocks of time to focused work. For example:
- 9:00-11:00 AM: Deep work on priority projects
- 11:00-12:00 PM: Meetings and communication
- 1:00-3:00 PM: Collaborative tasks
- 3:00-4:00 PM: Administrative work

This approach creates structure and helps you protect your most productive hours.

**2. Create a Dedicated Workspace**

Your environment significantly impacts your productivity. Set up a dedicated workspace that signals "work mode" to your brain. This doesn't require a full home office—even a specific corner or desk can work. Keep it organized, well-lit, and free from distractions.

**3. Use the Pomodoro Technique**

This classic technique involves working in 25-minute focused bursts, followed by 5-minute breaks. After four "pomodoros," take a longer 15-30 minute break. This rhythm helps maintain focus while preventing burnout.

**4. Set Clear Boundaries**

Remote work can blur the lines between professional and personal time. Establish clear start and end times for your workday. Communicate these boundaries to colleagues and family members. When your workday ends, physically close your laptop and step away from your workspace.

**5. Minimize Digital Distractions**

Close unnecessary browser tabs, turn off non-essential notifications, and use website blockers during focus periods. Consider using apps like Forest or Freedom to maintain discipline.

**Conclusion**

Effective time management as a remote worker is about creating systems that work for you. Experiment with these techniques and adjust them to fit your unique work style and responsibilities. Remember, productivity isn't about working longer hours—it's about working smarter.

---

Would you like me to adjust the tone, add more examples, or focus on different aspects?`,
    timestamp: "10:33 AM",
  },
];

interface ChatWindowProps {
  conversationId: string | null;
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(placeholderMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        content: "This is a placeholder AI response. The actual OpenAI integration will be added in the next step!",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
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
            Start a new conversation or select one from the sidebar to continue chatting.
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
            <h3 className="font-semibold text-lg">Writing a Blog Post</h3>
            <p className="text-xs text-slate-500">4 messages</p>
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
                <DropdownMenuItem>Export as Text</DropdownMenuItem>
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
              className={`flex gap-4 ${message.sender === "user" ? "justify-end" : ""}`}
            >
              {message.sender === "ai" && (
                <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 flex-shrink-0">
                  <AvatarFallback className="text-white font-semibold text-sm">
                    AI
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={`flex-1 max-w-2xl ${message.sender === "user" ? "flex justify-end" : ""}`}>
                <div
                  className={`group relative rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-white border border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  <div className={`text-xs mt-2 ${message.sender === "user" ? "text-purple-100" : "text-slate-400"}`}>
                    {message.timestamp}
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
                      <Button variant="ghost" size="icon" className="w-7 h-7">
                        <RotateCw className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-7 h-7">
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-7 h-7">
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
                <AvatarFallback className="text-white font-semibold text-sm">AI</AvatarFallback>
              </Avatar>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
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
    </div>
  );
}
