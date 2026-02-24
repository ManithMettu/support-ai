/**
 * Example demonstrating how embeddings and similarity search work
 * Run with: npx tsx embeddings.example.ts
 */

import { initializeEmbeddings, findRelevantDocs, type DocumentChunk } from './embeddings';

// Sample documentation
const sampleDocs: DocumentChunk[] = [
  {
    title: "Password Reset",
    content: "Users can reset their password from Settings > Security. Click 'Forgot Password' and follow the email instructions."
  },
  {
    title: "Refund Policy",
    content: "Refunds are allowed within 7 days of purchase. Contact support@example.com with your order number."
  },
  {
    title: "Account Deletion",
    content: "To delete your account, go to Settings > Privacy and click 'Delete Account'. This action is irreversible."
  },
  {
    title: "Subscription Plans",
    content: "We offer Basic, Pro, and Enterprise plans. Basic is free, Pro is $10/month, and Enterprise is custom pricing."
  },
  {
    title: "Contact Support",
    content: "You can reach our support team by emailing support@example.com or using the in-app chat feature."
  }
];

// Initialize embeddings
console.log('Initializing embeddings for documents...\n');
const docsWithEmbeddings = initializeEmbeddings(sampleDocs);
console.log(`✓ Generated embeddings for ${docsWithEmbeddings.length} documents\n`);

// Example queries
const queries = [
  "How do I reset my password?",
  "What is your refund policy?",
  "I want to delete my account",
  "How much does the Pro plan cost?",
  "How can I contact support?"
];

console.log('Testing similarity search:\n');
console.log('='.repeat(80));

queries.forEach((query, index) => {
  console.log(`\nQuery ${index + 1}: "${query}"`);
  console.log('-'.repeat(80));
  
  const relevantDocs = findRelevantDocs(query, docsWithEmbeddings, 3);
  
  relevantDocs.forEach((doc, rank) => {
    console.log(`\n  Rank ${rank + 1}: ${doc.title}`);
    console.log(`  Content: ${doc.content.substring(0, 80)}...`);
  });
  
  console.log('\n' + '='.repeat(80));
});

console.log('\n✓ Similarity search demonstration complete!');
console.log('\nKey Points:');
console.log('- Each query is converted to a 100-dimensional vector');
console.log('- Cosine similarity ranks documents by relevance');
console.log('- Top 3 most relevant documents are returned');
console.log('- Only relevant docs are sent to the AI (not all docs)');
console.log('- This reduces token usage and improves response quality\n');
