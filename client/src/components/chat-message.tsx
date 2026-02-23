import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Bot } from "lucide-react";
import { motion } from "framer-motion";

interface ChatMessageProps {
  role: string;
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex w-full gap-4 p-4 md:p-6 text-sm md:text-base",
        isUser ? "bg-background" : "bg-muted/30"
      )}
    >
      <div className="mx-auto flex w-full max-w-3xl gap-4 md:gap-6">
        {/* Avatar */}
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border shadow-sm",
            isUser ? "bg-background border-border" : "bg-primary text-primary-foreground border-transparent"
          )}
        >
          {isUser ? <User className="h-5 w-5 opacity-70" /> : <Bot className="h-5 w-5" />}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2 overflow-hidden pt-1">
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{content}</p>
          ) : (
            <div className="prose prose-sm md:prose-base prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Loading placeholder for assistant response
export function ChatMessageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex w-full gap-4 p-4 md:p-6 text-sm md:text-base bg-muted/30"
    >
      <div className="mx-auto flex w-full max-w-3xl gap-4 md:gap-6">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent bg-primary text-primary-foreground shadow-sm">
          <Bot className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-3 pt-2">
          <div className="h-4 w-1/3 animate-pulse rounded-md bg-muted-foreground/20"></div>
          <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted-foreground/20"></div>
        </div>
      </div>
    </motion.div>
  );
}
