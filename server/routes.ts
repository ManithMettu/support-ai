import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const docs = JSON.parse(fs.readFileSync("docs.json", "utf-8"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Apply rate limiter to all /api routes
  app.use("/api/", limiter);

  app.get(api.sessions.list.path, async (req, res) => {
    try {
      const sessions = await storage.getSessions();
      res.json(sessions.map(s => ({ id: s.id, lastUpdated: s.updatedAt })));
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  app.get(api.conversations.get.path, async (req, res) => {
    try {
      const messages = await storage.getMessages(req.params.sessionId);
      res.json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post(api.chat.create.path, async (req, res) => {
    try {
      const input = api.chat.create.input.parse(req.body);
      
      // Ensure session exists
      let session = await storage.getSession(input.sessionId);
      if (!session) {
        session = await storage.createSession({ id: input.sessionId });
      }

      // Save user message
      await storage.createMessage({
        sessionId: input.sessionId,
        role: "user",
        content: input.message
      });
      await storage.updateSession(input.sessionId);

      // Get last 5 message pairs (10 messages)
      const allMessages = await storage.getMessages(input.sessionId);
      const recentMessages = allMessages.slice(-10).map(m => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content
      }));

      // Construct Prompt
      const systemPrompt = `You are a helpful AI support assistant.
      
Use the following product documentation to answer the user's questions:
${JSON.stringify(docs, null, 2)}

Strict Rules:
- Generate responses ONLY using this document content.
- If the user asks something outside the docs, you MUST respond exactly with: "Sorry, I don't have information about that."
- Do not hallucinate or guess.`;

      const messagesForLLM = [
        { role: "system" as const, content: systemPrompt },
        ...recentMessages
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: messagesForLLM,
      });

      const reply = response.choices[0]?.message?.content || "Sorry, I don't have information about that.";
      const tokensUsed = response.usage?.total_tokens || 0;

      // Save assistant message
      await storage.createMessage({
        sessionId: input.sessionId,
        role: "assistant",
        content: reply
      });
      await storage.updateSession(input.sessionId);

      res.status(200).json({ reply, tokensUsed });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}