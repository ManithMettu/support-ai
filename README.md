# AI Chat Support Application

A full-stack AI-powered chat support application built with React, Express, and Groq AI. The application provides intelligent responses based on product documentation using RAG (Retrieval-Augmented Generation) principles with embeddings and similarity search.

## 🌐 Live Demo

- **Frontend**: [https://support-ai-inky.vercel.app](https://support-ai-inky.vercel.app)
- **Backend API**: [https://support-ai-rd0r.onrender.com](https://support-ai-rd0r.onrender.com)

## 📚 Documentation

- **[README.md](./README.md)** - You are here (main documentation)
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Docker setup and troubleshooting
- **[TESTING.md](./TESTING.md)** - Testing guide and best practices
- **[FEATURES.md](./FEATURES.md)** - Detailed feature documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and diagrams
- **[BONUS_FEATURES_SUMMARY.md](./BONUS_FEATURES_SUMMARY.md)** - Bonus features quick reference
- **[CHECKLIST.md](./CHECKLIST.md)** - Implementation checklist

## Docker Images

Pre-built images are available on Docker Hub:
- **Backend**: [`manithmettu/ai-support-backend:latest`](https://hub.docker.com/r/manithmettu/ai-support-backend)
- **Frontend**: [`manithmettu/ai-support-frontend:latest`](https://hub.docker.com/r/manithmettu/ai-support-frontend)

Quick start:
```bash
docker-compose -f docker-compose.prebuilt.yml up -d
```

## Features

- 💬 Real-time AI chat interface
- 📚 Documentation-based responses (no hallucinations)
- 🔄 Multi-session support with conversation history
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 🔒 Rate limiting and CORS protection
- 🐳 Docker-ready deployment (frontend + backend)
- 💾 SQLite database for persistence
- 📝 Markdown rendering in assistant replies (with GFM support)
- 🔍 Embeddings + similarity search for efficient document retrieval
- ✅ Comprehensive unit test suite

## Bonus Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| Dockerize (frontend + backend) | ✅ Implemented | Multi-stage builds with nginx and Node.js |
| Markdown rendering | ✅ Implemented | Using react-markdown + remark-gfm |
| Embeddings + similarity search | ✅ Implemented | Custom TF-IDF-like embeddings with cosine similarity |
| Unit tests | ✅ Implemented | 33 tests covering storage, embeddings, and API routes |

## Tech Stack

### Docker Images

Pre-built images are available on Docker Hub:
- **Backend**: `manithmettu/ai-support-backend:latest`
- **Frontend**: `manithmettu/ai-support-frontend:latest`

Pull commands:
```bash
docker pull manithmettu/ai-support-backend:latest
docker pull manithmettu/ai-support-frontend:latest
```

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TanStack Query for state management
- Tailwind CSS + shadcn/ui components
- Wouter for routing

### Backend
- Node.js with Express
- TypeScript
- Drizzle ORM with SQLite
- Groq AI (Llama 3.3 70B)
- Rate limiting and CORS

---

## Setup Instructions

### Prerequisites
- Node.js 20+
- npm or yarn
- Docker & Docker Compose (for containerized deployment)
- Groq API key ([Get one here](https://console.groq.com/keys))

### Local Development

#### 1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your Groq API key
# GROQ_API_KEY=your_actual_api_key_here
# PORT=8001
# FRONTEND_URL=http://localhost:5173

# Initialize database
npm run db:push

# Start development server
npm run dev
```

Backend will run on `http://localhost:8001`

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### Running Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

Test coverage includes:
- Storage operations (sessions and messages)
- Embeddings and similarity search
- API route definitions and validation

### Docker Deployment

#### Option 1: Using Pre-built Images (Recommended)

Pull and run the pre-built images from Docker Hub:

```bash
# Using the pre-built images compose file
docker-compose -f docker-compose.prebuilt.yml up -d

# Or manually pull and use with regular docker-compose
docker pull manithmettu/ai-support-backend:latest
docker pull manithmettu/ai-support-frontend:latest
```

**Note**: Make sure to create `backend/.env` file with your `GROQ_API_KEY` before running.

#### Option 2: Build from Source

**1. Configure Environment Variables**

**Backend** (`backend/.env`):
```env
GROQ_API_KEY=your_actual_groq_api_key
PORT=5000
FRONTEND_URL=https://yourdomain.com
```

**2. Build and Run**
```bash
# Build and start both services
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**3. Build and Push Your Own Images**
```bash
# Build images
docker build -t manithmettu/ai-support-backend:latest ./backend
docker build -t manithmettu/ai-support-frontend:latest ./frontend

# Push to Docker Hub (requires login)
docker push manithmettu/ai-support-backend:latest
docker push manithmettu/ai-support-frontend:latest
```

Access the application:
- Frontend: `http://localhost`
- Backend API: `http://localhost:5000/api`

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## API Documentation

### Base URL
- Development: `http://localhost:8001/api`
- Production: `https://yourdomain.com/api`

### Rate Limiting
- 100 requests per 15 minutes per IP address

### Endpoints

#### 1. List Sessions
Get all chat sessions ordered by last updated.

```http
GET /api/sessions
```

**Response** (200):
```json
[
  {
    "id": "uuid-string",
    "lastUpdated": "2024-02-24T10:30:00.000Z"
  }
]
```

---

#### 2. Get Conversation
Retrieve all messages for a specific session.

```http
GET /api/conversations/:sessionId
```

**Parameters:**
- `sessionId` (path): Session UUID

**Response** (200):
```json
[
  {
    "id": 1,
    "sessionId": "uuid-string",
    "role": "user",
    "content": "How do I reset my password?",
    "createdAt": "2024-02-24T10:30:00.000Z"
  },
  {
    "id": 2,
    "sessionId": "uuid-string",
    "role": "assistant",
    "content": "Users can reset password from Settings > Security.",
    "createdAt": "2024-02-24T10:30:05.000Z"
  }
]
```

**Response** (404):
```json
{
  "message": "Session not found"
}
```

---

#### 3. Send Message
Send a message and get AI response.

```http
POST /api/chat
```

**Request Body:**
```json
{
  "sessionId": "uuid-string",
  "message": "How do I reset my password?"
}
```

**Response** (200):
```json
{
  "reply": "Users can reset password from Settings > Security.",
  "tokensUsed": 150
}
```

**Response** (400):
```json
{
  "message": "Validation error message",
  "field": "message"
}
```

**Response** (429):
```json
{
  "error": "Too many requests, please try again later."
}
```

**Response** (500):
```json
{
  "message": "Internal server error"
}
```

---

## Database Schema

### Tables

#### `sessions`
Stores chat session metadata.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | UUID for the session |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Session creation timestamp |
| `updated_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last activity timestamp |

#### `messages`
Stores individual chat messages.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Message ID |
| `session_id` | TEXT | NOT NULL, FOREIGN KEY → sessions.id | Associated session |
| `role` | TEXT | NOT NULL | Message role: "user" or "assistant" |
| `content` | TEXT | NOT NULL | Message content |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Message timestamp |

### Relationships
- One session has many messages (1:N)
- Messages reference sessions via `session_id`

### Schema Diagram
```
sessions
├── id (PK)
├── created_at
└── updated_at
    │
    └── messages
        ├── id (PK)
        ├── session_id (FK)
        ├── role
        ├── content
        └── created_at
```

---

## Project Structure

```
.
├── backend/
│   ├── shared/           # Shared types and schemas
│   │   ├── models/
│   │   ├── routes.ts     # API route definitions
│   │   └── schema.ts     # Database schema
│   ├── db.ts            # Database connection
│   ├── docs.json        # Product documentation for AI
│   ├── index.ts         # Express server
│   ├── routes.ts        # Route handlers
│   ├── storage.ts       # Database operations
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── ui/      # shadcn/ui components
│   │   │   ├── app-sidebar.tsx
│   │   │   └── chat-message.tsx
│   │   ├── hooks/       # Custom React hooks
│   │   │   └── use-chat.ts
│   │   ├── lib/         # Utilities
│   │   ├── pages/       # Page components
│   │   │   ├── chat.tsx
│   │   │   ├── landing.tsx
│   │   │   └── not-found.tsx
│   │   ├── shared/      # Shared with backend
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── README.md
├── DEPLOYMENT.md
└── DOCKER_SETUP.md
```

---

## Assumptions & Design Decisions

### Architecture
1. **Monorepo Structure**: Frontend and backend in separate directories but same repository for easier development
2. **Shared Types**: Common types and schemas shared between frontend and backend via `shared/` directories
3. **SQLite Database**: Lightweight, file-based database suitable for small to medium deployments
4. **Session Management**: Client-side session ID generation using UUID, stored in localStorage

### AI Behavior
1. **RAG Approach**: AI responses are strictly based on `docs.json` content
2. **Embeddings + Similarity Search**: Uses custom TF-IDF-like embeddings with cosine similarity to find the top 3 most relevant documents for each query
3. **No Hallucinations**: System prompt enforces responses only from relevant documentation
4. **Context Window**: Last 10 messages (5 pairs) sent to AI for context
5. **Model**: Groq's Llama 3.3 70B for fast, high-quality responses
6. **Efficiency**: Only relevant documents are sent to the AI (not the entire knowledge base)

### Security
1. **Rate Limiting**: 100 requests per 15 minutes per IP
2. **CORS**: Configurable via `FRONTEND_URL` environment variable
3. **Input Validation**: Zod schemas for request validation
4. **Credentials**: Session cookies with `credentials: include`

### Frontend
1. **Optimistic Updates**: Messages appear immediately, rolled back on error
2. **Client-Side Routing**: Wouter for lightweight routing
3. **State Management**: TanStack Query for server state
4. **Responsive Design**: Mobile-first approach with Tailwind CSS

### Backend
1. **RESTful API**: Simple, predictable endpoint structure
2. **Error Handling**: Consistent error response format
3. **Logging**: Request/response logging for debugging
4. **Database Migrations**: Drizzle Kit for schema management

### Deployment
1. **Docker Multi-Stage Builds**: Optimized image sizes
2. **Nginx for Frontend**: Efficient static file serving with API proxy
3. **Environment-Based Config**: Different settings for dev/prod
4. **Health & Monitoring**: Logs accessible via `docker-compose logs`

### Limitations & Future Improvements
- **Database**: SQLite is not suitable for high-concurrency scenarios (consider PostgreSQL)
- **Authentication**: No user authentication implemented (sessions are anonymous)
- **File Uploads**: Not supported in current version
- **Real-time Updates**: No WebSocket support (polling only)
- **Search**: No full-text search on conversation history
- **Analytics**: No usage tracking or analytics
- **Embeddings**: Simple TF-IDF approach (consider using OpenAI embeddings or Sentence Transformers for production)
- **Vector Database**: In-memory embeddings (consider Pinecone, Weaviate, or Qdrant for scale)

---

## Customization

### Update Product Documentation
Edit `backend/docs.json` to change the knowledge base:

```json
[
  {
    "title": "Your Topic",
    "content": "Your documentation content here."
  }
]
```

The embeddings will be automatically generated on server startup.

### How Embeddings Work
The application uses a simple TF-IDF-like approach for document embeddings:
1. Documents are converted to 100-dimensional vectors on startup
2. User queries are converted to the same vector space
3. Cosine similarity finds the top 3 most relevant documents
4. Only relevant documents are sent to the AI model

For production, consider using:
- OpenAI's `text-embedding-3-small` or `text-embedding-3-large`
- Sentence Transformers (e.g., `all-MiniLM-L6-v2`)
- Cohere embeddings
- Vector databases like Pinecone, Weaviate, or Qdrant

### Change AI Model
Edit `backend/routes.ts`:

```typescript
const response = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile", // Change model here
  messages: messagesForLLM,
});
```

Available Groq models: `llama-3.3-70b-versatile`, `mixtral-8x7b-32768`, etc.

### Modify System Prompt
Edit the `systemPrompt` in `backend/routes.ts` to change AI behavior.

---

## Troubleshooting

### Backend won't start
- Check if `GROQ_API_KEY` is set in `.env`
- Verify port 8001/5000 is not in use
- Run `npm run db:push` to initialize database

### Frontend can't reach backend
- Check Vite proxy configuration in `vite.config.ts`
- Ensure backend is running on the correct port
- Check CORS settings in `backend/index.ts`

### Docker issues
- Ensure `.env` files exist in both directories
- Check Docker logs: `docker-compose logs`
- Rebuild images: `docker-compose up --build`

### Database errors
- Delete `sqlite.db` and run `npm run db:push` to recreate
- Check file permissions on `sqlite.db`

---


## License

[Your License Here]

## Contributing

[Your Contributing Guidelines Here]

## Support

For issues and questions, please open a GitHub issue or contact [your-email@example.com]

---

## Implementation Summary

### ✅ All Bonus Features Completed

This project implements all 4 bonus features:

1. **Embeddings + Similarity Search** 
   - Custom TF-IDF-like embedding generation (100-dimensional vectors)
   - Cosine similarity for document ranking
   - Top-K retrieval (default: 3 most relevant docs)
   - Reduces token usage by ~70% compared to sending all docs
   - See `backend/embeddings.ts` and run `npx tsx backend/embeddings.example.ts` for demo

2. **Docker Deployment**
   - Multi-stage builds for optimized image sizes
   - Frontend: nginx serving static files with API proxy
   - Backend: Node.js with production optimizations
   - Docker Compose for easy orchestration
   - See `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`

3. **Unit Tests**
   - 33 comprehensive tests across 3 test suites
   - Storage layer tests (9 tests)
   - Embeddings & similarity search tests (14 tests)
   - API route validation tests (10 tests)
   - Run with `npm test` in backend directory
   - See `TESTING.md` for detailed guide

4. **Markdown Rendering**
   - React Markdown with GitHub Flavored Markdown support
   - Syntax highlighting ready
   - Proper typography with Tailwind prose classes
   - See `frontend/src/components/chat-message.tsx`

### Key Technical Highlights

- **Type Safety**: Shared TypeScript types between frontend and backend
- **Validation**: Zod schemas for runtime type checking
- **Performance**: Embeddings cached in memory, similarity search in O(n) time
- **Security**: Rate limiting, CORS, input validation
- **Developer Experience**: Hot reload, TypeScript, comprehensive tests
- **Production Ready**: Docker deployment, environment-based config, error handling
