import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";

// Create SQLite database
export const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite, { schema });

// Setup tables since we aren't using drizzle-kit push (because we bypassed Postgres)
export function setupDatabase() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);
  
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    );
  `);
}

setupDatabase();