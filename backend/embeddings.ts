import OpenAI from "openai";

export interface DocumentChunk {
  title: string;
  content: string;
  embedding?: number[];
}

/**
 * Generate embeddings for text using OpenAI's API
 * Note: Groq doesn't support embeddings yet, so we use a simple TF-IDF-like approach
 */
export function generateSimpleEmbedding(text: string): number[] {
  // Simple bag-of-words embedding (for demo purposes)
  // In production, use OpenAI embeddings or a proper embedding model
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  const wordFreq = new Map<string, number>();
  
  words.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  });
  
  // Create a simple 100-dimensional embedding
  const embedding = new Array(100).fill(0);
  words.forEach((word, idx) => {
    const hash = simpleHash(word) % 100;
    embedding[hash] += wordFreq.get(word) || 0;
  });
  
  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return magnitude > 0 ? embedding.map(val => val / magnitude) : embedding;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }
  
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Find most relevant documents using similarity search
 */
export function findRelevantDocs(
  query: string,
  documents: DocumentChunk[],
  topK: number = 3
): DocumentChunk[] {
  const queryEmbedding = generateSimpleEmbedding(query);
  
  // Calculate similarity scores
  const scores = documents.map(doc => {
    if (!doc.embedding) {
      doc.embedding = generateSimpleEmbedding(`${doc.title} ${doc.content}`);
    }
    return {
      doc,
      score: cosineSimilarity(queryEmbedding, doc.embedding)
    };
  });
  
  // Sort by score and return top K
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.doc);
}

/**
 * Initialize embeddings for all documents
 */
export function initializeEmbeddings(documents: DocumentChunk[]): DocumentChunk[] {
  return documents.map(doc => ({
    ...doc,
    embedding: generateSimpleEmbedding(`${doc.title} ${doc.content}`)
  }));
}
