import { describe, it, expect, beforeAll, vi } from 'vitest';
import { api } from './shared/routes';

// Mock the storage module
vi.mock('./storage', () => ({
  storage: {
    getSessions: vi.fn(),
    getSession: vi.fn(),
    createSession: vi.fn(),
    updateSession: vi.fn(),
    getMessages: vi.fn(),
    createMessage: vi.fn(),
  }
}));

// Mock OpenAI
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: 'Mocked AI response' } }],
            usage: { total_tokens: 100 }
          })
        }
      }
    }))
  };
});

describe('API Routes', () => {
  describe('Route Definitions', () => {
    it('should have correct chat endpoint definition', () => {
      expect(api.chat.create.method).toBe('POST');
      expect(api.chat.create.path).toBe('/api/chat');
    });

    it('should have correct sessions endpoint definition', () => {
      expect(api.sessions.list.method).toBe('GET');
      expect(api.sessions.list.path).toBe('/api/sessions');
    });

    it('should have correct conversations endpoint definition', () => {
      expect(api.conversations.get.method).toBe('GET');
      expect(api.conversations.get.path).toBe('/api/conversations/:sessionId');
    });
  });

  describe('Input Validation', () => {
    it('should validate chat input with valid data', () => {
      const validInput = {
        sessionId: 'test-session-id',
        message: 'Hello, how can I reset my password?'
      };
      
      const result = api.chat.create.input.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should reject chat input without sessionId', () => {
      const invalidInput = {
        message: 'Hello'
      };
      
      const result = api.chat.create.input.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject chat input without message', () => {
      const invalidInput = {
        sessionId: 'test-session-id'
      };
      
      const result = api.chat.create.input.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject chat input with wrong types', () => {
      const invalidInput = {
        sessionId: 123,
        message: true
      };
      
      const result = api.chat.create.input.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe('Response Schemas', () => {
    it('should validate successful chat response', () => {
      const response = {
        reply: 'Here is your answer',
        tokensUsed: 150
      };
      
      const result = api.chat.create.responses[200].safeParse(response);
      expect(result.success).toBe(true);
    });

    it('should reject chat response with missing fields', () => {
      const response = {
        reply: 'Here is your answer'
      };
      
      const result = api.chat.create.responses[200].safeParse(response);
      expect(result.success).toBe(false);
    });

    it('should validate sessions list response', () => {
      const response = [
        { id: 'session-1', lastUpdated: '2024-02-24T10:00:00.000Z' },
        { id: 'session-2', lastUpdated: '2024-02-24T11:00:00.000Z' }
      ];
      
      const result = api.sessions.list.responses[200].safeParse(response);
      expect(result.success).toBe(true);
    });
  });
});
