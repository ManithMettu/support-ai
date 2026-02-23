import { useState, useRef, useEffect } from "react";
import { 
  useSessionManager, 
  useConversation, 
  useSendMessage 
} from "@/hooks/use-chat";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatMessage, ChatMessageSkeleton } from "@/components/chat-message";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, CornerDownLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatPage() {
  const { sessionId, startNewSession, switchSession } = useSessionManager();
  const { data: messages = [], isLoading: isLoadingMessages } = useConversation(sessionId);
  const { mutate: sendMessage, isPending } = useSendMessage(sessionId);
  
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isPending]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isPending) return;
    
    sendMessage(input.trim());
    setInput("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <SidebarProvider style={{ "--sidebar-width": "18rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/10">
        <AppSidebar 
          currentSessionId={sessionId} 
          onNewSession={startNewSession}
          onSelectSession={switchSession}
        />
        
        <main className="flex flex-1 flex-col min-w-0 relative">
          {/* Header */}
          <header className="absolute top-0 z-10 flex h-14 w-full items-center px-4 bg-background/80 backdrop-blur-md border-b border-transparent">
            <SidebarTrigger className="hover-elevate opacity-70 hover:opacity-100" />
            <div className="ml-auto text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/50 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              AI Ready
            </div>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pt-14">
            {isLoadingMessages && !hasMessages ? (
              <div className="flex h-full items-center justify-center">
                <Sparkles className="h-6 w-6 animate-pulse text-muted-foreground/30" />
              </div>
            ) : !hasMessages ? (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
                <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 border border-primary/10">
                  <Sparkles className="h-8 w-8 text-primary/70" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">How can I help you today?</h1>
                <p className="mt-2 text-muted-foreground max-w-md">
                  Ask me anything. I'm designed to be clean, minimal, and out of your way.
                </p>
              </div>
            ) : (
              <div className="pb-32">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <ChatMessage key={msg.id || i} role={msg.role} content={msg.content} />
                  ))}
                </AnimatePresence>
                {isPending && <ChatMessageSkeleton />}
                <div ref={messagesEndRef} className="h-px w-full" />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-background via-background to-transparent pb-6 pt-10 px-4 md:px-8">
            <div className="mx-auto max-w-3xl relative">
              <form 
                onSubmit={handleSubmit}
                className="relative flex items-end w-full overflow-hidden rounded-2xl border border-border/60 bg-background/50 backdrop-blur-xl shadow-lg shadow-black/[0.03] transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30"
              >
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="min-h-[56px] w-full resize-none border-0 bg-transparent px-4 py-4 focus-visible:ring-0 text-base custom-scrollbar placeholder:text-muted-foreground/60"
                  rows={1}
                />
                <div className="absolute right-3 bottom-3 flex gap-2">
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!input.trim() || isPending}
                    className="h-8 w-8 rounded-xl transition-all duration-200 hover-elevate active-elevate-2 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    <Send className="h-4 w-4 ml-0.5" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </div>
              </form>
              <div className="text-center mt-3 text-[11px] text-muted-foreground/60 flex items-center justify-center gap-1">
                Press <kbd className="px-1.5 py-0.5 bg-muted rounded-md border text-[10px] font-sans flex items-center gap-1"><CornerDownLeft className="h-2.5 w-2.5"/> Enter</kbd> to send
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
