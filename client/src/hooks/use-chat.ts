import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "./use-toast";
import { z } from "zod";

// --- Session Management ---
// We manage the current active session in localStorage so it persists across reloads.
const SESSION_KEY = "chat_current_session_id";

export function useSessionManager() {
  const [sessionId, setSessionId] = useState<string>(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) return stored;
    const newId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, newId);
    return newId;
  });

  const startNewSession = () => {
    const newId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, newId);
    setSessionId(newId);
  };

  const switchSession = (id: string) => {
    localStorage.setItem(SESSION_KEY, id);
    setSessionId(id);
  };

  return { sessionId, startNewSession, switchSession };
}

// --- API Hooks ---

export function useSessionsList() {
  return useQuery({
    queryKey: [api.sessions.list.path],
    queryFn: async () => {
      const res = await fetch(api.sessions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data = await res.json();
      return api.sessions.list.responses[200].parse(data);
    },
  });
}

// Local type since we don't have direct access to schema inside the prompt structure safely
type Message = { id?: number; sessionId: string; role: string; content: string; createdAt?: string };

export function useConversation(sessionId: string) {
  return useQuery({
    queryKey: [api.conversations.get.path, sessionId],
    queryFn: async () => {
      const url = buildUrl(api.conversations.get.path, { sessionId });
      const res = await fetch(url, { credentials: "include" });
      
      // If 404, it just means this local session hasn't had any messages saved to the DB yet.
      if (res.status === 404) return [];
      
      if (!res.ok) throw new Error("Failed to fetch conversation");
      const data = await res.json();
      // Using an array parsing as per the api definition
      return data as Message[];
    },
    // Don't refetch constantly while typing
    staleTime: 1000 * 60 * 5, 
  });
}

export function useSendMessage(sessionId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (messageContent: string) => {
      const payload = { sessionId, message: messageContent };
      // Validate payload just to be safe
      const validated = api.chat.create.input.parse(payload);

      const res = await fetch(api.chat.create.path, {
        method: api.chat.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 429) throw new Error("Rate limit exceeded. Please try again in a moment.");
        throw new Error("Failed to send message");
      }

      const data = await res.json();
      return api.chat.create.responses[200].parse(data);
    },
    onMutate: async (newMessageContent) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: [api.conversations.get.path, sessionId] });
      const previousMessages = queryClient.getQueryData<Message[]>([api.conversations.get.path, sessionId]);

      const optimisticMsg: Message = {
        sessionId,
        role: "user",
        content: newMessageContent,
        createdAt: new Date().toISOString()
      };

      queryClient.setQueryData<Message[]>([api.conversations.get.path, sessionId], (old) => {
        return old ? [...old, optimisticMsg] : [optimisticMsg];
      });

      return { previousMessages };
    },
    onError: (err, _, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData([api.conversations.get.path, sessionId], context.previousMessages);
      }
      toast({
        title: "Message failed",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      // Append the assistant's reply
      const assistantMsg: Message = {
        sessionId,
        role: "assistant",
        content: data.reply,
        createdAt: new Date().toISOString()
      };
      
      queryClient.setQueryData<Message[]>([api.conversations.get.path, sessionId], (old) => {
        return old ? [...old, assistantMsg] : [assistantMsg];
      });
      
      // Invalidate the sessions list so the sidebar updates its timestamps/creates new entries
      queryClient.invalidateQueries({ queryKey: [api.sessions.list.path] });
    },
  });
}
