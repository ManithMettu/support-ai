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

        <main className="flex flex-1 flex-col min-w-0 relative bg-background/50">
          {/* Header */}
          <header className="sticky top-0 z-20 flex h-16 w-full items-center px-6 bg-background/60 backdrop-blur-2xl border-b border-border/40">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover-elevate opacity-70 hover:opacity-100 transition-opacity" />
              <div className="h-4 w-px bg-border/60 mx-1" />
              <div className="flex flex-col">
                <h2 className="text-sm font-bold tracking-tight">Support Assistant</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                  <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider">Online</span>
                </div>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] font-bold text-primary uppercase tracking-wide">AI Powered</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                AI
              </div>
            </div>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-0">
            {!hasMessages && !isLoadingMessages ? (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-1000">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-20 animate-pulse" />
                  <div className="relative h-24 w-24 rounded-[2rem] bg-gradient-to-tr from-primary/10 to-primary/5 flex items-center justify-center border border-primary/20 shadow-2xl shadow-primary/5">
                    <Sparkles className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-3">
                  Hello! How can I <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">assist you</span>?
                </h1>
                <p className="text-muted-foreground max-w-sm text-lg font-medium leading-relaxed opacity-70">
                  I'm your intelligent support companion. Ask me anything about our services.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-12 w-full max-w-xl">
                  {[
                    "How do I reset my password?",
                    "Tell me about the refund policy.",
                    "What are the available plans?",
                    "How can I contact support?"
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion);
                        textareaRef.current?.focus();
                      }}
                      className="px-4 py-3 rounded-2xl bg-card/50 border border-border/50 text-sm font-medium text-left hover:bg-primary/5 hover:border-primary/20 transition-all hover:translate-y-[-2px] hover:shadow-md active:translate-y-0"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto w-full pt-8 pb-32">
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
                className="relative flex items-end w-full overflow-hidden rounded-2xl border-2 border-primary/20 bg-background/50 backdrop-blur-xl shadow-lg transition-all focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10"
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
                Press <kbd className="px-1.5 py-0.5 bg-muted rounded-md border text-[10px] font-sans flex items-center gap-1"><CornerDownLeft className="h-2.5 w-2.5" /> Enter</kbd> to send
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
