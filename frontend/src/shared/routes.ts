import { z } from 'zod';
import { sessions, messages } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  chat: {
    create: {
      method: 'POST' as const,
      path: '/api/chat' as const,
      input: z.object({
        sessionId: z.string(),
        message: z.string(),
      }),
      responses: {
        200: z.object({
          reply: z.string(),
          tokensUsed: z.number(),
        }),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
  conversations: {
    get: {
      method: 'GET' as const,
      path: '/api/conversations/:sessionId' as const,
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
        404: errorSchemas.notFound,
      },
    },
  },
  sessions: {
    list: {
      method: 'GET' as const,
      path: '/api/sessions' as const,
      responses: {
        200: z.array(z.object({
          id: z.string(),
          lastUpdated: z.string(),
        })),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  // Use environment variable for API base URL, fallback to relative path
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  let url = baseUrl + path;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
