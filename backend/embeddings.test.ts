import { describe, it, expect } from 'vitest';
import {
  generateSimpleEmbedding,
  cosineSimilarity,
  findRelevantDocs,
  initializeEmbeddings,
  type DocumentChunk
} from './embeddings';

describe('Embeddings', () => {
  describe('generateSimpleEmbedding', () => {
    it('should generate a 100-dimensional embedding', () => {
      const embedding = generateSimpleEmbedding('test text');
      expect(embedding).toHaveLength(100);
    });

    it('should generate normalized embeddings', () => {
      const embedding = generateSimpleEmbedding('test text');
      const magnitude = Math.sqrt(
        embedding.reduce((sum, val) => sum + val * val, 0)
      );
      expect(magnitude).toBeCloseTo(1, 5);
    });

    it('should generate different embeddings for different texts', () => {
      const embedding1 = generateSimpleEmbedding('password reset');
      const embedding2 = generateSimpleEmbedding('refund policy');
      expect(embedding1).not.toEqual(embedding2);
    });

    it('should generate same embeddings for same text', () => {
      const embedding1 = generateSimpleEmbedding('test');
      const embedding2 = generateSimpleEmbedding('test');
      expect(embedding1).toEqual(embedding2);
    });
  });

  describe('cosineSimilarity', () => {
    it('should return 1 for identical vectors', () => {
      const vec = [1, 2, 3, 4, 5];
      const similarity = cosineSimilarity(vec, vec);
      expect(similarity).toBeCloseTo(1, 5);
    });

    it('should return 0 for orthogonal vectors', () => {
      const vec1 = [1, 0, 0];
      const vec2 = [0, 1, 0];
      const similarity = cosineSimilarity(vec1, vec2);
      expect(similarity).toBe(0);
    });

    it('should return value between -1 and 1', () => {
      const vec1 = [1, 2, 3];
      const vec2 = [4, 5, 6];
      const similarity = cosineSimilarity(vec1, vec2);
      expect(similarity).toBeGreaterThanOrEqual(-1);
      expect(similarity).toBeLessThanOrEqual(1);
    });

    it('should return 0 for vectors of different lengths', () => {
      const vec1 = [1, 2, 3];
      const vec2 = [1, 2];
      const similarity = cosineSimilarity(vec1, vec2);
      expect(similarity).toBe(0);
    });
  });

  describe('findRelevantDocs', () => {
    const testDocs: DocumentChunk[] = [
      { title: 'Password Reset', content: 'How to reset your password from settings' },
      { title: 'Refund Policy', content: 'Refunds are available within 7 days' },
      { title: 'Account Deletion', content: 'Delete your account from privacy settings' },
    ];

    it('should return top K relevant documents', () => {
      const results = findRelevantDocs('password', testDocs, 2);
      expect(results).toHaveLength(2);
    });

    it('should return most relevant document first', () => {
      const results = findRelevantDocs('reset password', testDocs, 3);
      expect(results[0].title).toBe('Password Reset');
    });

    it('should handle empty query', () => {
      const results = findRelevantDocs('', testDocs, 2);
      expect(results).toHaveLength(2);
    });

    it('should return all docs if topK is larger than doc count', () => {
      const results = findRelevantDocs('test', testDocs, 10);
      expect(results).toHaveLength(testDocs.length);
    });
  });

  describe('initializeEmbeddings', () => {
    it('should add embeddings to all documents', () => {
      const docs: DocumentChunk[] = [
        { title: 'Test 1', content: 'Content 1' },
        { title: 'Test 2', content: 'Content 2' },
      ];
      
      const result = initializeEmbeddings(docs);
      
      expect(result).toHaveLength(2);
      expect(result[0].embedding).toBeDefined();
      expect(result[1].embedding).toBeDefined();
      expect(result[0].embedding).toHaveLength(100);
    });

    it('should preserve original document data', () => {
      const docs: DocumentChunk[] = [
        { title: 'Test', content: 'Content' },
      ];
      
      const result = initializeEmbeddings(docs);
      
      expect(result[0].title).toBe('Test');
      expect(result[0].content).toBe('Content');
    });
  });
});
